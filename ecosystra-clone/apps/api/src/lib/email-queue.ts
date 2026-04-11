import { Queue, Worker, type ConnectionOptions } from "bullmq";
import IORedis from "ioredis";
import { sendTaskNotificationEmail } from "./brevo-email";

function makeIoRedis(): IORedis {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL required for worker");
  return new IORedis(url, { maxRetriesPerRequest: null });
}

export type TaskEmailJob = {
  taskId: string;
  assigneeEmail: string;
  assigneeName?: string | null;
  changes: Record<string, { old?: unknown; new?: unknown }>;
  deepLink: string;
  summary: string;
};

let connection: ConnectionOptions | null = null;
let queue: Queue<TaskEmailJob> | null = null;

function redisConn(): ConnectionOptions | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  return { url };
}

export function getTaskEmailQueue(): Queue<TaskEmailJob> | null {
  const conn = redisConn();
  if (!conn) return null;
  if (!queue) {
    connection = conn;
    queue = new Queue<TaskEmailJob>("ecosystra-task-email", {
      connection: conn,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });
  }
  return queue;
}

function emailWorkerEnabled(): boolean {
  return (
    process.env.START_EMAIL_WORKER === "true" ||
    process.env.START_EMAIL_WORKER === "1"
  );
}

/**
 * Sends assignee notification email.
 * - If REDIS_URL + START_EMAIL_WORKER: job goes to BullMQ (worker sends via Brevo).
 * - Otherwise: send via Brevo immediately. This avoids "silent" failures when Redis
 *   is set in production but no worker process consumes the queue.
 */
export async function enqueueTaskEmail(job: TaskEmailJob): Promise<void> {
  const hasRedis = !!redisConn();
  const queue = hasRedis ? getTaskEmailQueue() : null;
  const useQueue = !!(queue && emailWorkerEnabled());

  if (useQueue && queue) {
    await queue.add("notify", job, {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    });
    console.info(
      "[email-queue] job enqueued (worker will send via Brevo)",
      job.taskId,
      "→",
      job.assigneeEmail,
    );
    return;
  }

  if (hasRedis && !emailWorkerEnabled()) {
    console.info(
      "[email-queue] REDIS_URL set but START_EMAIL_WORKER is off — sending Brevo now (not queued)",
      job.taskId,
    );
  }

  if (!process.env.BREVO_API_KEY?.trim()) {
    console.warn(
      "[email-queue] skip: BREVO_API_KEY missing",
      job.taskId,
    );
    return;
  }

  const r = await sendTaskNotificationEmail(job);
  if (r.ok) {
    console.info(
      "[brevo] transactional email sent OK",
      job.taskId,
      "→",
      job.assigneeEmail,
    );
  } else {
    console.warn(
      "[brevo] transactional email failed",
      job.taskId,
      job.assigneeEmail,
      r.message,
    );
  }
}

/** Starts a worker in-process (set START_EMAIL_WORKER=true). */
export function startEmailWorkerIfEnabled(): void {
  if (process.env.START_EMAIL_WORKER !== "true" && process.env.START_EMAIL_WORKER !== "1") {
    return;
  }
  const conn = redisConn();
  if (!conn) {
    console.warn("[queue] START_EMAIL_WORKER set but REDIS_URL missing");
    return;
  }

  const worker = new Worker<TaskEmailJob>(
    "ecosystra-task-email",
    async (job) => {
      const payload = job.data;
      const r = await sendTaskNotificationEmail(payload);
      if (!r.ok) {
        throw new Error(r.message || "brevo_send_failed");
      }
      console.info("[email-worker] Brevo sent to", payload.assigneeEmail);
    },
    { connection: makeIoRedis() }
  );

  worker.on("failed", (err) => console.error("[email-worker]", err));
}
