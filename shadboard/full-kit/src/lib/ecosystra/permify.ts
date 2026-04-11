/**
 * Permify HTTP client — degrades gracefully when Permify is unreachable.
 */
import { isSuperUserEmail } from "./superuser";

const tenant = process.env.PERMIFY_TENANT_ID || "t1";
const base =
  process.env.PERMIFY_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3476";

let _lastWarnedAt = 0;

function warnUnreachable(context: string, err: unknown) {
  const now = Date.now();
  if (now - _lastWarnedAt < 30_000) return;
  _lastWarnedAt = now;
  console.warn(
    `[permify] ${context}: server unreachable — operations will be allowed without authorization checks.`,
    err instanceof Error ? err.message : err
  );
}

function isConnectionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  if (msg.includes("fetch failed") || msg.includes("econnrefused") || msg.includes("enotfound")) return true;
  const cause = (err as { cause?: Error }).cause;
  if (cause instanceof Error) {
    const cm = cause.message.toLowerCase();
    return cm.includes("econnrefused") || cm.includes("enotfound") || cm.includes("fetch failed");
  }
  return false;
}

export function permifyDisabled(): boolean {
  return process.env.PERMIFY_DISABLED === "1" || process.env.PERMIFY_DISABLED === "true";
}

type CheckInput = {
  userId: string;
  entityType: "task" | "project";
  entityId: string;
  permission: "edit" | "view" | "assign";
};

export async function permifyCheck(input: CheckInput): Promise<boolean> {
  if (permifyDisabled()) return true;
  const body = {
    metadata: { snap_token: "", schema_version: "", depth: 32 },
    entity: { type: input.entityType, id: input.entityId },
    permission: input.permission,
    subject: { type: "user", id: input.userId },
  };
  try {
    const res = await fetch(`${base}/v1/tenants/${tenant}/permissions/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("[permify] check failed", res.status, await res.text());
      return false;
    }
    const json = (await res.json()) as { can?: string | number };
    const v = json.can;
    if (v === undefined) return false;
    if (typeof v === "number") return v === 1 || v === 2;
    const s = String(v);
    return s.includes("ALLOWED") || s === "true";
  } catch (err) {
    if (isConnectionError(err)) {
      warnUnreachable("check", err);
      return true;
    }
    throw err;
  }
}

export async function assertTaskEdit(params: {
  prismaUserId: string;
  email: string | null;
  taskItemId: string;
}): Promise<void> {
  if (isSuperUserEmail(params.email)) return;
  const ok = await permifyCheck({
    userId: params.prismaUserId,
    entityType: "task",
    entityId: params.taskItemId,
    permission: "edit",
  });
  if (!ok) throw new Error("FORBIDDEN");
}

export async function assertProjectAssign(params: {
  prismaUserId: string;
  email: string | null;
  projectBoardId: string;
}): Promise<void> {
  if (isSuperUserEmail(params.email)) return;
  const ok = await permifyCheck({
    userId: params.prismaUserId,
    entityType: "project",
    entityId: params.projectBoardId,
    permission: "assign",
  });
  if (!ok) throw new Error("FORBIDDEN");
}

type Tuple = {
  entityType: string;
  entityId: string;
  relation: string;
  subjectType: string;
  subjectId: string;
  subjectRelation?: string;
};

export async function writeTuples(tuples: Tuple[]): Promise<void> {
  if (permifyDisabled() || tuples.length === 0) return;
  const body = {
    metadata: { schema_version: "" },
    tuples: tuples.map((t) => ({
      entity: { type: t.entityType, id: t.entityId },
      relation: t.relation,
      subject: { type: t.subjectType, id: t.subjectId, relation: t.subjectRelation || "" },
    })),
  };
  try {
    const res = await fetch(`${base}/v1/tenants/${tenant}/data/write`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("[permify] write failed", res.status, await res.text());
      throw new Error(`PERMIFY_WRITE_FAILED: ${res.status}`);
    }
  } catch (err) {
    if (isConnectionError(err)) {
      warnUnreachable("writeTuples", err);
      return;
    }
    throw err;
  }
}

export async function deleteTuple(tuple: Tuple): Promise<void> {
  if (permifyDisabled()) return;
  const body = {
    metadata: { schema_version: "" },
    tuple: {
      entity: { type: tuple.entityType, id: tuple.entityId },
      relation: tuple.relation,
      subject: { type: tuple.subjectType, id: tuple.subjectId, relation: tuple.subjectRelation || "" },
    },
  };
  try {
    const res = await fetch(`${base}/v1/tenants/${tenant}/data/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok && res.status !== 404) {
      console.error("[permify] delete failed", await res.text());
    }
  } catch (err) {
    if (isConnectionError(err)) {
      warnUnreachable("deleteTuple", err);
      return;
    }
    throw err;
  }
}

export async function ensureProjectTuples(boardId: string, ownerUserId: string): Promise<void> {
  await writeTuples([
    { entityType: "project", entityId: boardId, relation: "owner", subjectType: "user", subjectId: ownerUserId },
    { entityType: "project", entityId: boardId, relation: "admin", subjectType: "user", subjectId: ownerUserId },
  ]);
}

export async function bootstrapProjectAndTask(params: {
  boardId: string;
  ownerUserId: string;
  taskItemId: string;
}): Promise<void> {
  await writeTuples([
    { entityType: "project", entityId: params.boardId, relation: "owner", subjectType: "user", subjectId: params.ownerUserId },
    { entityType: "task", entityId: params.taskItemId, relation: "project", subjectType: "project", subjectId: params.boardId },
    { entityType: "task", entityId: params.taskItemId, relation: "owner", subjectType: "user", subjectId: params.ownerUserId },
  ]);
}

export async function setTaskAssigneeTuple(params: {
  taskItemId: string;
  assigneeUserId: string | null;
  previousAssigneeUserId?: string | null;
}): Promise<void> {
  if (params.previousAssigneeUserId && params.previousAssigneeUserId !== params.assigneeUserId) {
    await deleteTuple({ entityType: "task", entityId: params.taskItemId, relation: "assignee", subjectType: "user", subjectId: params.previousAssigneeUserId });
  }
  if (params.assigneeUserId) {
    await writeTuples([{ entityType: "task", entityId: params.taskItemId, relation: "assignee", subjectType: "user", subjectId: params.assigneeUserId }]);
  }
}

export async function setTaskOwnerTuple(params: {
  taskItemId: string;
  ownerUserId: string;
  previousOwnerUserId?: string | null;
}): Promise<void> {
  if (params.previousOwnerUserId && params.previousOwnerUserId !== params.ownerUserId) {
    await deleteTuple({ entityType: "task", entityId: params.taskItemId, relation: "owner", subjectType: "user", subjectId: params.previousOwnerUserId });
  }
  await writeTuples([{ entityType: "task", entityId: params.taskItemId, relation: "owner", subjectType: "user", subjectId: params.ownerUserId }]);
}
