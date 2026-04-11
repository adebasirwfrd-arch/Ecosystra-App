import {
  sendTaskNotificationEmail,
  type TaskEmailPayload,
} from "./brevo-email";

export type TaskEmailJob = TaskEmailPayload;

/**
 * Sends assignee notification email directly via Brevo (no Redis/BullMQ needed).
 */
export async function enqueueTaskEmail(job: TaskEmailJob): Promise<void> {
  if (!process.env.BREVO_API_KEY?.trim()) {
    console.warn("[email-queue] skip: BREVO_API_KEY missing", job.taskId);
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
