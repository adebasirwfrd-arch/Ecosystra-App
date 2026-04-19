import { randomBytes } from "crypto";
import GraphQLJSON from "graphql-type-json";
import { Prisma } from "@/generated/prisma";
import type { AuthState } from "./auth";
import { db as prisma, withPrismaRetry } from "@/lib/prisma";
import { logItemFieldChange } from "./audit";
import { enqueueTaskEmail } from "./email-queue";
import { sendTaskAssigneeInviteEmail } from "./brevo-email";
import {
  assertProjectAssign,
  assertTaskEdit,
  bootstrapProjectAndTask,
  ensureProjectTuples,
  permifyDisabled,
  setTaskOwnerTuple,
  syncTaskAssigneeTuples,
} from "./permify";
import { isSuperUserEmail } from "./superuser";
import {
  buildEcosystraBoardAbsoluteUrl,
  getPublicSiteOrigin,
} from "./app-url";
import { isEcosystraServerPerfEnabled, logEcosystraServerPerf } from "./server-perf";

import { i18n } from "@/configs/i18n";

export type GqlContext = {
  auth: AuthState;
  prismaUser: Awaited<ReturnType<typeof prisma.ecoUser.findUnique>>;
};

function ecosystraInviteLocale(): string {
  const v = process.env.NEXT_PUBLIC_ECOSYSTRA_INVITE_LOCALE?.trim();
  if (v) return v;
  return i18n.defaultLocale;
}

/** @deprecated use getPublicSiteOrigin from ./app-url */
function appBaseUrl(): string {
  return getPublicSiteOrigin();
}

/**
 * Deep links to the Ecosystra board view (`/[lang]/apps/ecosystra/board`).
 * Legacy `/board?…` URLs were invalid and returned 404.
 */
function ecosystraBoardAbsoluteUrl(query: Record<string, string>): string {
  return buildEcosystraBoardAbsoluteUrl(query);
}

type EcoEmailRow = {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  read: boolean;
  starred: boolean;
  label: string | null;
  isDraft: boolean;
  isSent: boolean;
  isStarred: boolean;
  isSpam: boolean;
  isDeleted: boolean;
  muted: boolean;
  cc: string | null;
  bcc: string | null;
  attachments: unknown;
  createdAt: Date;
  sender: { id: string; name: string | null; email: string; avatarUrl: string | null; status: string | null };
};

function formatAttachmentsForGql(raw: unknown): unknown[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  return [];
}

function formatEmailRow(row: EcoEmailRow) {
  return {
    id: row.id,
    sender: {
      id: row.sender.id,
      name: row.sender.name || row.sender.email.split("@")[0],
      email: row.sender.email,
      avatar: row.sender.avatarUrl || null,
      status: row.sender.status || "Active",
    },
    recipientId: row.recipientId,
    subject: row.subject,
    content: row.content,
    read: row.read,
    starred: row.starred,
    label: row.label?.trim() ? row.label.trim().toLowerCase() : null,
    isDraft: row.isDraft,
    isSent: row.isSent,
    isStarred: row.isStarred,
    isSpam: row.isSpam,
    isDeleted: row.isDeleted,
    muted: row.muted,
    cc: row.cc ?? null,
    bcc: row.bcc ?? null,
    attachments: formatAttachmentsForGql(row.attachments),
    createdAt: row.createdAt.toISOString(),
  };
}

const MAX_ATTACHMENT_BYTES = 500 * 1024;
const MAX_ATTACHMENTS_TOTAL_BYTES = 2 * 1024 * 1024;

function parseAddressList(s: string | null | undefined): string[] {
  if (!s?.trim()) return [];
  const parts = s.split(/[,;]+/).map((x) => x.trim().toLowerCase()).filter(Boolean);
  return [...new Set(parts)];
}

function normalizeAttachmentsInput(raw: unknown): Prisma.InputJsonValue {
  if (raw == null) return [];
  if (!Array.isArray(raw)) throw new Error("INVALID_ATTACHMENTS");
  let total = 0;
  const out: Array<{ fileName: string; mimeType: string; contentBase64: string }> = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) throw new Error("INVALID_ATTACHMENTS");
    const o = item as Record<string, unknown>;
    const fileName = String(o.fileName ?? "file").slice(0, 240);
    const mimeType = String(o.mimeType ?? "application/octet-stream").slice(0, 120);
    const contentBase64 = String(o.contentBase64 ?? "");
    let size: number;
    try {
      size = Buffer.from(contentBase64, "base64").length;
    } catch {
      throw new Error("INVALID_ATTACHMENTS");
    }
    if (size > MAX_ATTACHMENT_BYTES) throw new Error("ATTACHMENT_TOO_LARGE");
    total += size;
    if (total > MAX_ATTACHMENTS_TOTAL_BYTES) throw new Error("ATTACHMENTS_TOO_LARGE");
    out.push({ fileName, mimeType, contentBase64 });
  }
  return out as unknown as Prisma.InputJsonValue;
}

/** Sidebar folders personal / important / work — stored values may be mixed case from older sends. */
function systemLabelEquals(tag: "personal" | "important" | "work"): Prisma.StringNullableFilter {
  return { equals: tag, mode: "insensitive" };
}

function normalizeIncomingEmailLabel(label: string | null | undefined): string | null {
  if (label == null || typeof label !== "string") return null;
  const t = label.trim().toLowerCase();
  if (!t) return null;
  if (t === "personal" || t === "important" || t === "work") return t;
  return null;
}

/**
 * Folder counts — parallel `count()` queries (read-only) for lower latency vs sequential round-trips.
 */
async function aggregateEmailCountsForUser(userId: string) {
  const [
    inbox,
    sent,
    draft,
    starred,
    spam,
    trash,
    personal,
    important,
    work,
  ] = await Promise.all([
    prisma.ecoEmail.count({
      where: {
        recipientId: userId,
        isSent: false,
        isDraft: false,
        isSpam: false,
        isDeleted: false,
        muted: false,
        read: false,
      },
    }),
    prisma.ecoEmail.count({
      where: { senderId: userId, isSent: true },
    }),
    prisma.ecoEmail.count({
      where: { senderId: userId, isDraft: true },
    }),
    prisma.ecoEmail.count({
      where: {
        OR: [{ recipientId: userId }, { senderId: userId }],
        isStarred: true,
      },
    }),
    prisma.ecoEmail.count({
      where: {
        recipientId: userId,
        isSpam: true,
        isDeleted: false,
        read: false,
      },
    }),
    prisma.ecoEmail.count({
      where: {
        OR: [{ recipientId: userId }, { senderId: userId }],
        isDeleted: true,
      },
    }),
    prisma.ecoEmail.count({
      where: {
        label: systemLabelEquals("personal"),
        isSpam: false,
        isDeleted: false,
        read: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
    }),
    prisma.ecoEmail.count({
      where: {
        label: systemLabelEquals("important"),
        isSpam: false,
        isDeleted: false,
        read: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
    }),
    prisma.ecoEmail.count({
      where: {
        label: systemLabelEquals("work"),
        isSpam: false,
        isDeleted: false,
        read: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      },
    }),
  ]);
  return {
    inbox,
    sent,
    draft,
    starred,
    spam,
    trash,
    personal,
    important,
    work,
  };
}

function buildEmailFilter(filter: string, userId: string): Prisma.EcoEmailWhereInput {
  switch (filter) {
    case "inbox":
      return {
        recipientId: userId,
        isSent: false,
        isDraft: false,
        isSpam: false,
        isDeleted: false,
        muted: false,
      };
    case "sent":
      return { senderId: userId, isSent: true };
    case "draft":
      return { senderId: userId, isDraft: true };
    case "starred":
      return { OR: [{ recipientId: userId }, { senderId: userId }], isStarred: true };
    case "spam":
      return { recipientId: userId, isSpam: true };
    case "trash":
      return { OR: [{ recipientId: userId }, { senderId: userId }], isDeleted: true };
    case "personal":
      return {
        label: systemLabelEquals("personal"),
        isSpam: false,
        isDeleted: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      };
    case "important":
      return {
        label: systemLabelEquals("important"),
        isSpam: false,
        isDeleted: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      };
    case "work":
      return {
        label: systemLabelEquals("work"),
        isSpam: false,
        isDeleted: false,
        OR: [{ recipientId: userId }, { senderId: userId }],
      };
    default:
      return { recipientId: userId, isSpam: false, isDeleted: false, muted: false };
  }
}

/**
 * EcoUser email must match session (lowercased in GraphQL `buildContext`).
 * Use case-insensitive lookup so legacy rows still resolve after normalization.
 */
async function getViewer(ctx: GqlContext) {
  const email = ctx.auth.email?.trim().toLowerCase();
  if (!email) {
    throw new Error("UNAUTHORIZED");
  }
  const cached = ctx.prismaUser;
  if (cached?.email && cached.email.trim().toLowerCase() === email) {
    return cached;
  }
  return withPrismaRetry(async () => {
    const existing = await prisma.ecoUser.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      if (existing.email !== email) {
        return prisma.ecoUser.update({
          where: { id: existing.id },
          data: { email },
        });
      }
      return existing;
    }
    return prisma.ecoUser.create({
      data: {
        email,
        name: email.split("@")[0],
      },
    });
  });
}

/** Resolve EcoUser by email, or create from NextAuth `User` so app email works for all signed-up accounts. */
async function ensureEcoRecipientByEmail(to: string) {
  const raw = to.trim();
  if (!raw) return null;
  const existing = await prisma.ecoUser.findFirst({
    where: { email: { equals: raw, mode: "insensitive" } },
  });
  if (existing) return existing;
  const authUser = await prisma.user.findFirst({
    where: { email: { equals: raw, mode: "insensitive" } },
  });
  if (!authUser?.email) return null;
  return prisma.ecoUser.create({
    data: {
      email: authUser.email,
      name: authUser.name || authUser.email.split("@")[0],
      avatarUrl: authUser.avatar || authUser.image,
    },
  });
}

async function requireWorkspaceAccess(
  viewerId: string,
  workspaceId: string,
  ctx: GqlContext
) {
  if (isSuperUserEmail(ctx.auth.email)) return;
  const m = await prisma.ecoMember.findUnique({
    where: {
      userId_workspaceId: { userId: viewerId, workspaceId },
    },
  });
  if (!m) throw new Error("FORBIDDEN");
}

/** Fields needed for board UI + GraphQL `Item` / `Group` — avoids loading unused relations (faster DB + JSON). */
const ecoUserBoardPick = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  status: true,
} as const;

const ecoItemLeafSelect = {
  id: true,
  name: true,
  boardId: true,
  groupId: true,
  parentItemId: true,
  createdByUserId: true,
  createdAt: true,
  updatedAt: true,
  dynamicData: true,
  createdBy: { select: ecoUserBoardPick },
} as const;

const ecoItemWithSubitemsSelect = {
  ...ecoItemLeafSelect,
  subitems: {
    orderBy: { createdAt: "asc" as const },
    select: ecoItemLeafSelect,
  },
} as const;

const boardTreeSelect = {
  id: true,
  name: true,
  workspaceId: true,
  columns: true,
  subitemColumns: true,
  createdAt: true,
  groups: {
    orderBy: { id: "asc" as const },
    select: {
      id: true,
      name: true,
      color: true,
      boardId: true,
      items: {
        where: { parentItemId: null },
        orderBy: { createdAt: "asc" as const },
        select: ecoItemWithSubitemsSelect,
      },
    },
  },
} as const;

/** Populated on board-loaded items to avoid N+1 `lastUpdatedBy` audit queries. */
const ITEM_LAST_UPDATED_PREFETCH = Symbol.for(
  "ecosystra.itemLastUpdatedByPrefetch"
);

type ItemWithPrefetchMeta = {
  id: string;
  createdByUserId?: string | null;
  createdBy?: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    status: string | null;
  } | null;
  subitems?: ItemWithPrefetchMeta[];
  [ITEM_LAST_UPDATED_PREFETCH]?: {
    hasAuditRow: boolean;
    auditActor: {
      id: string;
      name: string | null;
      email: string;
      avatarUrl: string | null;
      status: string | null;
    } | null;
  };
};

function collectBoardItemIdsFromTree(board: {
  groups: Array<{ items: ItemWithPrefetchMeta[] }>;
}): string[] {
  const ids: string[] = [];
  for (const g of board.groups) {
    for (const it of g.items) {
      ids.push(it.id);
      for (const s of it.subitems ?? []) ids.push(s.id);
    }
  }
  return ids;
}

async function prefetchLastUpdatedByForBoardItems(board: {
  groups: Array<{ items: ItemWithPrefetchMeta[] }>;
}): Promise<void> {
  const ids = [...new Set(collectBoardItemIdsFromTree(board))];
  if (!ids.length) return;

  const auditRows = await prisma.$queryRaw<
    Array<{ itemId: string; actorUserId: string | null }>
  >(
    Prisma.sql`
      SELECT DISTINCT ON ("itemId") "itemId", "actorUserId"
      FROM "TaskAuditLog"
      WHERE "itemId" IN (${Prisma.join(ids)})
      ORDER BY "itemId", "createdAt" DESC
    `
  );

  const actorIds = [
    ...new Set(
      auditRows.map((r) => r.actorUserId).filter((x): x is string => Boolean(x))
    ),
  ];
  const actors =
    actorIds.length > 0
      ? await prisma.ecoUser.findMany({ where: { id: { in: actorIds } } })
      : [];
  const actorById = new Map(actors.map((a) => [a.id, a]));

  type AuditActor = NonNullable<
    NonNullable<ItemWithPrefetchMeta[typeof ITEM_LAST_UPDATED_PREFETCH]>["auditActor"]
  >;
  const auditMetaByItemId = new Map<
    string,
    { hasAuditRow: boolean; auditActor: AuditActor | null }
  >();
  for (const row of auditRows) {
    auditMetaByItemId.set(row.itemId, {
      hasAuditRow: true,
      auditActor: row.actorUserId
        ? actorById.get(row.actorUserId) ?? null
        : null,
    });
  }

  const walk = (item: ItemWithPrefetchMeta) => {
    const meta = auditMetaByItemId.get(item.id);
    if (meta) {
      item[ITEM_LAST_UPDATED_PREFETCH] = meta;
    } else {
      item[ITEM_LAST_UPDATED_PREFETCH] = {
        hasAuditRow: false,
        auditActor: null,
      };
    }
    for (const s of item.subitems ?? []) walk(s);
  };
  for (const g of board.groups) {
    for (const it of g.items) walk(it);
  }
}

async function loadBoardWithTree(
  boardId: string,
  perfParent?: { op: string; phasePrefix?: string }
) {
  const perf = isEcosystraServerPerfEnabled();
  const tBoard = perf ? performance.now() : 0;
  const board = await prisma.ecoBoard.findUniqueOrThrow({
    where: { id: boardId },
    select: boardTreeSelect,
  });
  const prismaMs = perf ? performance.now() - tBoard : 0;
  const tPrefetch = perf ? performance.now() : 0;
  await prefetchLastUpdatedByForBoardItems(
    board as unknown as { groups: Array<{ items: ItemWithPrefetchMeta[] }> }
  );
  const prefetchMs = perf ? performance.now() - tPrefetch : 0;
  if (perf) {
    const tree = board as unknown as {
      groups: Array<{ items: ItemWithPrefetchMeta[] }>;
    };
    const itemIds = collectBoardItemIdsFromTree(tree);
    logEcosystraServerPerf({
      op: perfParent?.op ?? "loadBoardWithTree",
      phase: `${perfParent?.phasePrefix ?? ""}loadBoardWithTree`,
      boardId,
      prismaBoardGraphMs: Math.round(prismaMs * 10) / 10,
      prefetchLastUpdatedMs: Math.round(prefetchMs * 10) / 10,
      loadBoardTotalMs: Math.round((prismaMs + prefetchMs) * 10) / 10,
      itemCountForPrefetch: itemIds.length,
    });
  }
  return board;
}

const MAX_TASK_ASSIGNEES = 25;
const MAX_INVITE_EMAILS_PER_CALL = 20;

function assertEcoTaskAssigneeInviteDelegate(
  client: { ecoTaskAssigneeInvite?: { findMany: unknown } },
  context: string
): void {
  if (!client.ecoTaskAssigneeInvite) {
    throw new Error(
      `${context}: Prisma client is stale (missing ecoTaskAssigneeInvite). Stop the dev server, run \`pnpm prisma generate\` and \`pnpm prisma db push\`, then restart.`
    );
  }
}

function normalizeAssigneeUserIdsFromDynamic(prev: Record<string, unknown>): string[] {
  const raw = prev.assigneeUserIds;
  if (Array.isArray(raw)) {
    return [...new Set(raw.map((x) => String(x)).filter(Boolean))];
  }
  const single = prev.assigneeUserId;
  if (typeof single === "string" && single.trim()) return [single.trim()];
  return [];
}

function normalizeEmailAddr(s: string): string {
  return s.trim().toLowerCase();
}

function isValidEmailAddr(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function buildAssigneeDynamicData(
  tx: Prisma.TransactionClient,
  prev: Record<string, unknown>,
  nextUserIds: string[],
  itemId: string
): Promise<Record<string, unknown>> {
  const users =
    nextUserIds.length > 0
      ? await tx.ecoUser.findMany({ where: { id: { in: nextUserIds } } })
      : [];
  const order = new Map(nextUserIds.map((id, i) => [id, i]));
  users.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  const assignees = nextUserIds.map((id) => {
    const u = users.find((x) => x.id === id);
    return u
      ? {
          id: u.id,
          name: u.name?.trim() || u.email,
          email: u.email,
          avatarUrl: u.avatarUrl ?? null,
        }
      : { id, name: "", email: "", avatarUrl: null };
  });
  const first = assignees[0] as
    | { id: string; name: string; email: string; avatarUrl: string | null }
    | undefined;
  assertEcoTaskAssigneeInviteDelegate(tx, "buildAssigneeDynamicData");
  const pending = await tx.ecoTaskAssigneeInvite.findMany({
    where: { itemId, status: "PENDING" },
    select: { email: true, status: true },
  });
  return {
    ...prev,
    assigneeUserIds: nextUserIds,
    assignees,
    assigneeUserId: first?.id ?? null,
    assignee: first?.name ?? "",
    assigneeEmail: first?.email ?? null,
    assignee_avatarUrl: first?.avatarUrl ?? null,
    assigneePendingInvites: pending.map((p) => ({ email: p.email, status: p.status })),
    last_updated: new Date().toISOString(),
  };
}

async function executeSetTaskAssignees(
  _: unknown,
  {
    itemId,
    assigneeUserIds,
    inviteEmails,
  }: { itemId: string; assigneeUserIds: string[]; inviteEmails: string[] },
  ctx: GqlContext
) {
  const viewer = await getViewer(ctx);
  const item = await prisma.ecoItem.findUnique({
    where: { id: itemId },
    include: { board: { select: { id: true, workspaceId: true } } },
  });
  if (!item?.board) throw new Error("NOT_FOUND");
  await assertTaskEdit({ prismaUserId: viewer.id, email: ctx.auth.email, taskItemId: itemId });
  await assertProjectAssign({
    prismaUserId: viewer.id,
    email: ctx.auth.email,
    projectBoardId: item.boardId,
  });

  const workspaceId = item.board.workspaceId;
  const prev = (item.dynamicData as Record<string, unknown>) || {};
  const prevIds = normalizeAssigneeUserIdsFromDynamic(prev);

  const uniqueInputIds = [...new Set(assigneeUserIds)].slice(0, MAX_TASK_ASSIGNEES);
  if (uniqueInputIds.length > 0) {
    const members = await prisma.ecoMember.findMany({
      where: { workspaceId, userId: { in: uniqueInputIds } },
      select: { userId: true },
    });
    const memberSet = new Set(members.map((m) => m.userId));
    for (const id of uniqueInputIds) {
      if (!memberSet.has(id)) throw new Error("ASSIGNEE_NOT_IN_WORKSPACE");
    }
  }

  const invitesToEmail: { token: string; email: string }[] = [];

  assertEcoTaskAssigneeInviteDelegate(prisma, "setTaskAssignees");

  const updated = await prisma.$transaction(async (tx) => {
    assertEcoTaskAssigneeInviteDelegate(tx, "setTaskAssignees(tx)");
    const normalizedInviteEmails = [
      ...new Set(inviteEmails.map(normalizeEmailAddr).filter(isValidEmailAddr)),
    ].slice(0, MAX_INVITE_EMAILS_PER_CALL);

    const assignedEmails = new Set(
      uniqueInputIds.length > 0
        ? (
            await tx.ecoUser.findMany({
              where: { id: { in: uniqueInputIds } },
              select: { email: true },
            })
          ).map((u) => u.email.toLowerCase())
        : []
    );

    for (const email of normalizedInviteEmails) {
      if (assignedEmails.has(email)) continue;
      const existingInv = await tx.ecoTaskAssigneeInvite.findUnique({
        where: { itemId_email: { itemId, email } },
      });
      if (existingInv?.status === "ACCEPTED") continue;

      const token = randomBytes(24).toString("hex");
      const row = await tx.ecoTaskAssigneeInvite.upsert({
        where: { itemId_email: { itemId, email } },
        create: {
          itemId,
          email,
          token,
          invitedByUserId: viewer.id,
          workspaceId,
          status: "PENDING",
        },
        update: {
          token,
          invitedByUserId: viewer.id,
          status: "PENDING",
        },
      });
      invitesToEmail.push({ token: row.token, email: row.email });
    }

    const nextData = await buildAssigneeDynamicData(tx, prev, uniqueInputIds, itemId);
    const row = await tx.ecoItem.update({
      where: { id: itemId },
      data: { dynamicData: nextData as Prisma.InputJsonValue },
    });
    await logItemFieldChange(tx, {
      itemId,
      actorUserId: viewer.id,
      fieldKey: "assignees",
      oldValue: prevIds,
      newValue: uniqueInputIds,
    });
    return row;
  });

  if (!permifyDisabled()) {
    await syncTaskAssigneeTuples({
      taskItemId: itemId,
      previousUserIds: prevIds,
      nextUserIds: uniqueInputIds,
    });
  }

  const prevSet = new Set(prevIds);
  const actor = await prisma.ecoUser.findUnique({
    where: { id: viewer.id },
    select: { name: true, email: true },
  });
  const actorLabel = actor?.name?.trim() || actor?.email || "Someone";

  for (const uid of uniqueInputIds) {
    if (prevSet.has(uid)) continue;
    const assignee = await prisma.ecoUser.findUnique({ where: { id: uid } });
    if (!assignee) continue;
    try {
      await prisma.ecoNotification.create({
        data: {
          userId: assignee.id,
          title: `Assigned: ${updated.name}`,
          message: `${actorLabel} assigned you to this task.`,
          type: "task_assigned",
          link: ecosystraBoardAbsoluteUrl({ task: itemId }),
        },
      });
    } catch (e) {
      console.error("[notification] assignee notification failed", e);
    }
    if (assignee.email) {
      await enqueueTaskEmail({
        taskId: itemId,
        assigneeEmail: assignee.email,
        assigneeName: assignee.name,
        changes: { assignee: { old: prev.assignee, new: assignee.name || assignee.email } },
        deepLink: ecosystraBoardAbsoluteUrl({ task: itemId }),
        summary: `You were assigned to task "${updated.name}"`,
      });
      try {
        const subject = `Assigned: ${updated.name}`;
        const content = `You have been assigned to task "${updated.name}".\n\nOpen: ${ecosystraBoardAbsoluteUrl({ task: itemId })}`;
        await prisma.ecoEmail.create({
          data: {
            senderId: viewer.id,
            recipientId: assignee.id,
            subject,
            content,
            label: "work",
            isSent: true,
          },
        });
      } catch (e) {
        console.warn("[setTaskAssignees] auto email row failed", e);
      }
    }
  }

  for (const inv of invitesToEmail) {
    await sendTaskAssigneeInviteEmail({
      toEmail: inv.email,
      taskName: updated.name,
      inviterName: actorLabel,
      acceptUrl: ecosystraBoardAbsoluteUrl({ acceptAssignee: inv.token }),
    });
  }

  return updated;
}

async function executeAcceptTaskAssigneeInvite(
  _: unknown,
  { token }: { token: string },
  ctx: GqlContext
) {
  const viewer = await getViewer(ctx);
  assertEcoTaskAssigneeInviteDelegate(prisma, "acceptTaskAssigneeInvite");
  const viewerUser = await prisma.ecoUser.findUnique({ where: { id: viewer.id } });
  if (!viewerUser?.email) throw new Error("UNAUTHORIZED");

  const tokenTrim = token.trim();
  const invite = await prisma.ecoTaskAssigneeInvite.findFirst({
    where: { token: tokenTrim },
    include: { item: true },
  });
  if (!invite) throw new Error("NOT_FOUND");

  const viewerEmail = viewerUser.email.trim().toLowerCase();
  const invitedEmail = invite.email.trim().toLowerCase();
  if (viewerEmail !== invitedEmail) {
    throw new Error(
      `Sign in as ${invitedEmail} to accept this invitation. You are currently signed in as ${viewerEmail}.`
    );
  }

  /** React Strict Mode / double navigation can invoke accept twice — second call must succeed. */
  if (invite.status === "ACCEPTED") {
    if (invite.acceptedUserId === viewer.id) {
      return prisma.ecoItem.findUniqueOrThrow({ where: { id: invite.itemId } });
    }
    throw new Error("This invitation was already accepted by another account.");
  }

  if (invite.status !== "PENDING") {
    throw new Error("This invitation is no longer valid.");
  }

  await prisma.ecoMember.upsert({
    where: { userId_workspaceId: { userId: viewer.id, workspaceId: invite.workspaceId } },
    create: { userId: viewer.id, workspaceId: invite.workspaceId, role: "MEMBER" },
    update: {},
  });

  const item = invite.item;
  const prev = (item.dynamicData as Record<string, unknown>) || {};
  const prevIds = normalizeAssigneeUserIdsFromDynamic(prev);
  const nextIds = prevIds.includes(viewer.id) ? prevIds : [...prevIds, viewer.id];

  const updated = await prisma.$transaction(async (tx) => {
    await tx.ecoTaskAssigneeInvite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED", acceptedAt: new Date(), acceptedUserId: viewer.id },
    });
    const nextData = await buildAssigneeDynamicData(tx, prev, nextIds, item.id);
    return tx.ecoItem.update({
      where: { id: item.id },
      data: { dynamicData: nextData as Prisma.InputJsonValue },
    });
  });

  if (!permifyDisabled()) {
    await syncTaskAssigneeTuples({
      taskItemId: item.id,
      previousUserIds: prevIds,
      nextUserIds: nextIds,
    });
  }

  return updated;
}

export const resolvers = {
  JSON: GraphQLJSON,

  Board: {
    /** Fallback when board payload was not built with `boardTreeInclude` root `items`. */
    items: async (board: { id: string; items?: unknown[] }) => {
      if (Array.isArray(board.items)) return board.items;
      return prisma.ecoItem.findMany({
        where: { boardId: board.id, parentItemId: null },
        orderBy: { createdAt: "asc" },
        include: {
          createdBy: true,
          subitems: {
            orderBy: { createdAt: "asc" },
            include: { createdBy: true },
          },
        },
      });
    },
    createdAt: (board: { createdAt?: Date }) =>
      board.createdAt instanceof Date
        ? board.createdAt.toISOString()
        : String(board.createdAt ?? ""),
    metadata: (board: { columns?: unknown }) => {
      const columns = board?.columns;
      if (columns && typeof columns === "object" && !Array.isArray(columns)) {
        return (columns as { metadata?: unknown }).metadata || {};
      }
      return {};
    },
    columns: (board: { columns?: unknown }) => {
      const columns = board?.columns;
      if (Array.isArray(columns)) return columns;
      if (
        columns &&
        typeof columns === "object" &&
        Array.isArray((columns as { definitions?: unknown }).definitions)
      ) {
        return (columns as { definitions: unknown[] }).definitions;
      }
      return [];
    },
  },

  Group: {
    items: async (group: { id: string; items?: unknown[] }) => {
      if (Array.isArray(group.items)) return group.items;
      return prisma.ecoItem.findMany({
        where: { groupId: group.id, parentItemId: null },
        include: { subitems: true },
        orderBy: { createdAt: "asc" },
      });
    },
  },

  Item: {
    createdAt: (item: { createdAt?: Date }) =>
      item.createdAt instanceof Date
        ? item.createdAt.toISOString()
        : String(item.createdAt ?? ""),
    updatedAt: (item: { updatedAt?: Date }) =>
      item.updatedAt instanceof Date
        ? item.updatedAt.toISOString()
        : String(item.updatedAt ?? ""),
    lastUpdatedBy: async (
      item: ItemWithPrefetchMeta & { id: string; createdByUserId?: string | null }
    ) => {
      const p = item[ITEM_LAST_UPDATED_PREFETCH];
      if (p !== undefined) {
        if (p.hasAuditRow) {
          if (p.auditActor) return p.auditActor;
          if (item.createdBy) return item.createdBy;
          if (item.createdByUserId) {
            return prisma.ecoUser.findUnique({
              where: { id: item.createdByUserId },
            });
          }
          return null;
        }
        if (item.createdBy) return item.createdBy;
        if (item.createdByUserId) {
          return prisma.ecoUser.findUnique({
            where: { id: item.createdByUserId },
          });
        }
        return null;
      }
      const lastAudit = await prisma.ecoTaskAuditLog.findFirst({
        where: { itemId: item.id },
        orderBy: { createdAt: "desc" },
        include: { actor: true },
      });
      if (lastAudit?.actor) return lastAudit.actor;
      if (item.createdBy) return item.createdBy;
      if (item.createdByUserId) {
        return prisma.ecoUser.findUnique({ where: { id: item.createdByUserId } });
      }
      return null;
    },
    subitems: async (item: { id: string; subitems?: unknown[] }) => {
      if (Array.isArray(item.subitems)) return item.subitems;
      return prisma.ecoItem.findMany({
        where: { parentItemId: item.id },
        orderBy: { createdAt: "asc" },
      });
    },
  },

  Query: {
    getOrCreateBoard: async (_: unknown, __: unknown, ctx: GqlContext) => {
      const perf = isEcosystraServerPerfEnabled();
      const t0 = perf ? performance.now() : 0;
      const mark = (phase: string, extra?: Record<string, unknown>) => {
        if (!perf) return;
        logEcosystraServerPerf({
          op: "GetOrCreateBoard",
          phase,
          sinceStartMs: Math.round((performance.now() - t0) * 10) / 10,
          ...extra,
        });
      };

      const viewer = await getViewer(ctx);
      mark("after_getViewer", { viewerId: viewer.id });

      const membership = await prisma.ecoMember.findFirst({
        where: { userId: viewer.id },
        select: {
          workspace: {
            select: {
              boards: {
                orderBy: { createdAt: "asc" },
                take: 1,
                select: { id: true },
              },
            },
          },
        },
      });
      mark("after_membershipLookup");

      const firstBoardId = membership?.workspace.boards[0]?.id;
      if (firstBoardId) {
        const board = await loadBoardWithTree(firstBoardId, {
          op: "GetOrCreateBoard",
          phasePrefix: "path=memberBoard ",
        });
        mark("after_loadBoardWithTree", { path: "memberBoard", boardId: firstBoardId });
        return board;
      }

      const legacy = await prisma.ecoBoard.findFirst({
        orderBy: { createdAt: "asc" },
        include: { workspace: true },
      });
      mark("after_legacyBoardLookup");

      if (legacy) {
        await prisma.ecoMember.upsert({
          where: {
            userId_workspaceId: {
              userId: viewer.id,
              workspaceId: legacy.workspaceId,
            },
          },
          create: {
            userId: viewer.id,
            workspaceId: legacy.workspaceId,
            role: "ADMIN",
          },
          update: {},
        });
        if (!legacy.createdByUserId) {
          await prisma.ecoBoard.update({
            where: { id: legacy.id },
            data: { createdByUserId: viewer.id },
          });
        }
        try {
          await ensureProjectTuples(legacy.id, viewer.id);
        } catch {
          /* permify optional */
        }
        mark("after_legacyUpserts");
        const board = await loadBoardWithTree(legacy.id, {
          op: "GetOrCreateBoard",
          phasePrefix: "path=legacy ",
        });
        mark("after_loadBoardWithTree", { path: "legacy", boardId: legacy.id });
        return board;
      }

      const newBoardId = await prisma.$transaction(async (tx) => {
        const ws = await tx.ecoWorkspace.create({
          data: { name: "Main workspace", description: "" },
        });
        await tx.ecoMember.create({
          data: {
            userId: viewer.id,
            workspaceId: ws.id,
            role: "ADMIN",
          },
        });
        const board = await tx.ecoBoard.create({
          data: {
            name: "Task management",
            workspaceId: ws.id,
            columns: [],
            subitemColumns: [],
            createdByUserId: viewer.id,
          },
        });
        await tx.ecoGroup.create({
          data: {
            name: "New Group",
            color: "#A25DDC",
            boardId: board.id,
          },
        });
        try {
          await ensureProjectTuples(board.id, viewer.id);
        } catch {
          /* optional */
        }
        return board.id;
      });
      mark("after_createWorkspaceTransaction", { newBoardId });
      const createdBoard = await loadBoardWithTree(newBoardId, {
        op: "GetOrCreateBoard",
        phasePrefix: "path=new ",
      });
      mark("after_loadBoardWithTree", { path: "new", boardId: newBoardId });
      return createdBoard;
    },

    getBoard: async (_: unknown, { id }: { id: string }) => {
      return loadBoardWithTree(id, { op: "getBoard" });
    },

    getItems: async (_: unknown, { boardId }: { boardId: string }) => {
      return prisma.ecoItem.findMany({ where: { boardId } });
    },

    exportGroup: async (_: unknown, { id }: { id: string }) => {
      const group = await prisma.ecoGroup.findUnique({
        where: { id },
        include: {
          items: {
            where: { parentItemId: null },
            include: { subitems: true },
          },
        },
      });
      if (!group) return [];
      return group.items.map((item) => ({
        id: item.id,
        name: item.name,
        group: group.name,
        ...((item.dynamicData as Record<string, unknown>) || {}),
      }));
    },

    me: async (_: unknown, __: unknown, ctx: GqlContext) => {
      if (!ctx.auth.email) return null;
      const user = await getViewer(ctx);
      return prisma.ecoUser.findUnique({
        where: { id: user.id },
        include: { memberships: true, notifications: true },
      });
    },

    notifications: async (_: unknown, __: unknown, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      return prisma.ecoNotification.findMany({
        where: { userId: viewer.id },
        orderBy: { createdAt: "desc" },
      });
    },

    search: async (_: unknown, { query }: { query: string }, ctx: GqlContext) => {
      await getViewer(ctx);
      const items = await prisma.ecoItem.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        take: 5,
      });
      const groups = await prisma.ecoGroup.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        take: 3,
      });
      const boards = await prisma.ecoBoard.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        take: 2,
      });
      return [
        ...items.map((i) => ({
          id: i.id, type: "Item", name: i.name, parentId: i.groupId, context: "Task",
        })),
        ...groups.map((g) => ({
          id: g.id, type: "Group", name: g.name, parentId: g.boardId, context: "Group",
        })),
        ...boards.map((b) => ({
          id: b.id, type: "Board", name: b.name, context: "Board",
        })),
      ];
    },

    workspaceUsers: async (
      _: unknown,
      { workspaceId, query, take = 8 }: { workspaceId: string; query: string; take?: number },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      await requireWorkspaceAccess(viewer.id, workspaceId, ctx);
      const lim = Math.min(Math.max(take || 8, 1), 25);
      const q = (query || "").trim();
      const broad = q.length === 0 || q === ".";
      return prisma.ecoUser.findMany({
        where: {
          memberships: { some: { workspaceId } },
          ...(broad
            ? {}
            : {
                OR: [
                  { email: { contains: q, mode: "insensitive" as const } },
                  { name: { contains: q, mode: "insensitive" as const } },
                ],
              }),
        },
        take: lim,
        orderBy: { email: "asc" },
      });
    },

    workspaceMembers: async (
      _: unknown,
      { workspaceId }: { workspaceId: string },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      await requireWorkspaceAccess(viewer.id, workspaceId, ctx);
      return prisma.ecoMember.findMany({
        where: { workspaceId },
        include: { user: true, workspace: true },
        orderBy: { createdAt: "asc" },
      });
    },

    taskAuditLog: async (
      _: unknown,
      { itemId }: { itemId: string },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      const item = await prisma.ecoItem.findUnique({
        where: { id: itemId },
        include: { board: true },
      });
      if (!item) throw new Error("NOT_FOUND");
      await requireWorkspaceAccess(viewer.id, item.board.workspaceId, ctx);
      await assertTaskEdit({
        prismaUserId: viewer.id,
        email: ctx.auth.email,
        taskItemId: itemId,
      }).catch(() => {
        if (!isSuperUserEmail(ctx.auth.email)) throw new Error("FORBIDDEN");
      });
      return prisma.ecoTaskAuditLog.findMany({
        where: { itemId },
        orderBy: { createdAt: "desc" },
        take: 200,
      });
    },

    emails: async (_: unknown, { filter }: { filter: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const where = buildEmailFilter(filter, viewer.id);
      const rows = await withPrismaRetry(() =>
        prisma.ecoEmail.findMany({
          where,
          include: { sender: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
      );
      return rows.map(formatEmailRow);
    },

    emailById: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await withPrismaRetry(() =>
        prisma.ecoEmail.findFirst({
          where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
          include: { sender: true },
        })
      );
      return row ? formatEmailRow(row) : null;
    },

    emailCounts: async (_: unknown, __: unknown, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      return withPrismaRetry(() => aggregateEmailCountsForUser(viewer.id));
    },
  },

  TaskAuditEntry: {
    createdAt: (e: { createdAt: Date }) => e.createdAt.toISOString(),
  },

  Mutation: {
    setTaskOwner: async (
      _: unknown,
      { itemId, ownerUserId }: { itemId: string; ownerUserId: string | null },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      const item = await prisma.ecoItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error("NOT_FOUND");
      await assertTaskEdit({ prismaUserId: viewer.id, email: ctx.auth.email, taskItemId: itemId });

      const prev = (item.dynamicData as Record<string, unknown>) || {};
      const prevOwnerId = (prev.ownerUserId as string) || item.createdByUserId;
      const ownerUser = ownerUserId ? await prisma.ecoUser.findUnique({ where: { id: ownerUserId } }) : null;

      return prisma.$transaction(async (tx) => {
        const nextData = {
          ...prev,
          owner: ownerUser?.name || ownerUser?.email || "",
          ownerUserId: ownerUser?.id || null,
          owner_avatarUrl: ownerUser?.avatarUrl ?? null,
          last_updated: new Date().toISOString(),
        };
        const updated = await tx.ecoItem.update({
          where: { id: itemId },
          data: { dynamicData: nextData },
        });
        await logItemFieldChange(tx, {
          itemId, actorUserId: viewer.id, fieldKey: "owner",
          oldValue: prev.owner, newValue: nextData.owner,
        });
        if (!permifyDisabled()) {
          await setTaskOwnerTuple({
            taskItemId: itemId,
            ownerUserId: ownerUser?.id || viewer.id,
            previousOwnerUserId: prevOwnerId || null,
          });
        }
        return updated;
      });
    },

    setTaskAssignees: executeSetTaskAssignees,

    setTaskAssignee: async (
      _: unknown,
      { itemId, assigneeUserId }: { itemId: string; assigneeUserId: string | null },
      ctx: GqlContext
    ) =>
      executeSetTaskAssignees(
        _,
        {
          itemId,
          assigneeUserIds: assigneeUserId ? [assigneeUserId] : [],
          inviteEmails: [],
        },
        ctx
      ),

    acceptTaskAssigneeInvite: executeAcceptTaskAssigneeInvite,

    assignMemberRole: async (
      _: unknown,
      { workspaceId, userId, role }: { workspaceId: string; userId: string; role: string },
      ctx: GqlContext
    ) => {
      if (!isSuperUserEmail(ctx.auth.email)) throw new Error("FORBIDDEN");
      await getViewer(ctx);
      return prisma.ecoMember.update({
        where: { userId_workspaceId: { userId, workspaceId } },
        data: { role },
      });
    },

    updateBoard: async (
      _: unknown,
      { id, name, columns, subitemColumns }: { id: string; name?: string; columns?: unknown; subitemColumns?: unknown },
      ctx: GqlContext
    ) => {
      await getViewer(ctx);
      const existingBoard = await prisma.ecoBoard.findUnique({ where: { id } });
      const existingColumns = existingBoard?.columns;
      const existingMetadata =
        existingColumns && typeof existingColumns === "object" && !Array.isArray(existingColumns)
          ? (existingColumns as { metadata?: Record<string, unknown> }).metadata || {}
          : {};
      const nextColumns: unknown =
        columns !== undefined ? { definitions: columns, metadata: existingMetadata } : existingColumns;
      const safeColumns = nextColumns === null ? [] : nextColumns;
      return prisma.ecoBoard.update({
        where: { id },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(columns !== undefined ? { columns: safeColumns as Prisma.InputJsonValue } : {}),
          ...(subitemColumns !== undefined ? { subitemColumns: subitemColumns as Prisma.InputJsonValue } : {}),
        },
      });
    },

    updateBoardMetadata: async (
      _: unknown,
      { id, metadata }: { id: string; metadata: unknown },
      ctx: GqlContext
    ) => {
      const perf = isEcosystraServerPerfEnabled();
      const t0 = perf ? performance.now() : 0;
      const mark = (phase: string, extra?: Record<string, unknown>) => {
        if (!perf) return;
        logEcosystraServerPerf({
          op: "UpdateBoardMetadata",
          phase,
          boardId: id,
          sinceStartMs: Math.round((performance.now() - t0) * 10) / 10,
          ...extra,
        });
      };

      await getViewer(ctx);
      mark("after_getViewer");
      const board = await prisma.ecoBoard.findUnique({ where: { id } });
      mark("after_findUnique");
      const existingColumns = board?.columns;
      const definitions = Array.isArray(existingColumns)
        ? existingColumns
        : existingColumns && typeof existingColumns === "object" &&
            Array.isArray((existingColumns as { definitions?: unknown[] }).definitions)
          ? (existingColumns as { definitions: unknown[] }).definitions
          : [];
      const existingMetadata =
        existingColumns && typeof existingColumns === "object" && !Array.isArray(existingColumns)
          ? (existingColumns as { metadata?: Record<string, unknown> }).metadata || {}
          : {};
      const updated = await prisma.ecoBoard.update({
        where: { id },
        data: {
          columns: { definitions, metadata: { ...existingMetadata, ...(metadata as object) } } as Prisma.InputJsonValue,
        },
      });
      mark("after_update", {
        definitionsCount: definitions.length,
      });
      return updated;
    },

    createItem: async (
      _: unknown,
      args: { name: string; boardId: string; groupId?: string; parentItemId?: string; dynamicData?: Record<string, unknown> },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      await assertProjectAssign({ prismaUserId: viewer.id, email: ctx.auth.email, projectBoardId: args.boardId });
      let groupId = args.groupId ?? null;
      if (args.parentItemId && !groupId) {
        const parent = await prisma.ecoItem.findUnique({
          where: { id: args.parentItemId },
          select: { groupId: true },
        });
        groupId = parent?.groupId ?? null;
      }
      const creator = await prisma.ecoUser.findUnique({ where: { id: viewer.id } });
      const incoming = (args.dynamicData || {}) as Record<string, unknown>;
      const dynamicData: Record<string, unknown> = {
        ...incoming,
        owner: creator?.name?.trim() || creator?.email || "",
        ownerUserId: viewer.id,
        owner_avatarUrl: creator?.avatarUrl ?? null,
      };
      const item = await prisma.ecoItem.create({
        data: {
          name: args.name, boardId: args.boardId, groupId,
          parentItemId: args.parentItemId,
          dynamicData: dynamicData as Prisma.InputJsonValue,
          createdByUserId: viewer.id,
        },
      });
      try {
        await bootstrapProjectAndTask({ boardId: args.boardId, ownerUserId: viewer.id, taskItemId: item.id });
      } catch (e) {
        console.warn("[permify] bootstrap task failed", e);
      }
      return item;
    },

    updateItemDynamicData: async (
      _: unknown,
      { id, dynamicData }: { id: string; dynamicData: Record<string, unknown> },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      await assertTaskEdit({ prismaUserId: viewer.id, email: ctx.auth.email, taskItemId: id });
      const currentItem = await prisma.ecoItem.findUnique({ where: { id } });
      const currentData = (currentItem?.dynamicData as Record<string, unknown>) || {};
      const mergedData = { ...currentData, ...dynamicData };
      const statusOld = currentData.status;
      const statusNew = mergedData.status;
      const row = await prisma.$transaction(async (tx) => {
        const updated = await tx.ecoItem.update({ where: { id }, data: { dynamicData: mergedData as Prisma.InputJsonValue } });
        for (const key of Object.keys(dynamicData)) {
          if (currentData[key] !== mergedData[key]) {
            await logItemFieldChange(tx, { itemId: id, actorUserId: viewer.id, fieldKey: key, oldValue: currentData[key], newValue: mergedData[key] });
          }
        }
        return updated;
      });
      if (statusNew !== undefined && statusNew !== statusOld) {
        const assigneeEmail = mergedData.assigneeEmail as string | undefined;
        if (assigneeEmail) {
          await enqueueTaskEmail({
            taskId: id, assigneeEmail,
            changes: { status: { old: statusOld, new: statusNew } },
            deepLink: ecosystraBoardAbsoluteUrl({ task: id }),
            summary: `Task "${currentItem?.name || ""}" status updated`,
          });
        }
      }
      return row;
    },

    updateItem: async (_: unknown, { id, name }: { id: string; name: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      await assertTaskEdit({ prismaUserId: viewer.id, email: ctx.auth.email, taskItemId: id });
      const prev = await prisma.ecoItem.findUnique({ where: { id } });
      return prisma.$transaction(async (tx) => {
        const updated = await tx.ecoItem.update({ where: { id }, data: { name } });
        if (prev?.name !== name) {
          await logItemFieldChange(tx, { itemId: id, actorUserId: viewer.id, fieldKey: "name", oldValue: prev?.name, newValue: name });
        }
        return updated;
      });
    },

    moveItemToGroup: async (
      _: unknown,
      { id, groupId }: { id: string; groupId: string },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      await assertTaskEdit({ prismaUserId: viewer.id, email: ctx.auth.email, taskItemId: id });
      const item = await prisma.ecoItem.findUnique({
        where: { id },
      });
      if (!item) throw new Error("NOT_FOUND");
      if (item.parentItemId) {
        throw new Error("CANNOT_MOVE_SUBITEM_GROUP");
      }
      const targetGroup = await prisma.ecoGroup.findUnique({
        where: { id: groupId },
        include: { board: true },
      });
      if (!targetGroup) throw new Error("NOT_FOUND");
      if (item.boardId !== targetGroup.boardId) {
        throw new Error("GROUP_BOARD_MISMATCH");
      }
      if (item.groupId === groupId) {
        return item;
      }
      await assertProjectAssign({
        prismaUserId: viewer.id,
        email: ctx.auth.email,
        projectBoardId: item.boardId,
      });
      const prevGroupId = item.groupId;
      return prisma.$transaction(async (tx) => {
        const updated = await tx.ecoItem.update({
          where: { id },
          data: { groupId },
        });
        if (prevGroupId !== groupId) {
          await logItemFieldChange(tx, {
            itemId: id,
            actorUserId: viewer.id,
            fieldKey: "groupId",
            oldValue: prevGroupId,
            newValue: groupId,
          });
        }
        return updated;
      });
    },

    addItemUpdate: async (_: unknown, { id, text }: { id: string; text: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      await assertTaskEdit({ prismaUserId: viewer.id, email: ctx.auth.email, taskItemId: id });
      const item = await prisma.ecoItem.findUnique({ where: { id } });
      const currentData = (item?.dynamicData as Record<string, unknown>) || {};
      const updates = Array.isArray(currentData.updates) ? currentData.updates : [];
      const nextUpdates = [
        { id: `upd-${Date.now()}`, text, createdAt: new Date().toISOString(), userId: viewer.id },
        ...updates,
      ];
      return prisma.ecoItem.update({ where: { id }, data: { dynamicData: { ...currentData, updates: nextUpdates } } });
    },

    createGroup: async (_: unknown, { name, boardId, color }: { name: string; boardId: string; color?: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      await assertProjectAssign({ prismaUserId: viewer.id, email: ctx.auth.email, projectBoardId: boardId });
      return prisma.ecoGroup.create({ data: { name, boardId, color } });
    },

    updateGroup: async (_: unknown, { id, name, color }: { id: string; name?: string; color?: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const g = await prisma.ecoGroup.findUnique({ where: { id }, include: { board: true } });
      if (!g) throw new Error("NOT_FOUND");
      await assertProjectAssign({ prismaUserId: viewer.id, email: ctx.auth.email, projectBoardId: g.boardId });
      return prisma.ecoGroup.update({ where: { id }, data: { name, color } });
    },

    deleteGroup: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const g = await prisma.ecoGroup.findUnique({ where: { id }, include: { board: true } });
      if (!g) throw new Error("NOT_FOUND");
      await assertProjectAssign({ prismaUserId: viewer.id, email: ctx.auth.email, projectBoardId: g.boardId });
      await prisma.ecoGroup.delete({ where: { id } });
      return true;
    },

    archiveGroup: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const group = await prisma.ecoGroup.findUnique({ where: { id }, include: { board: true } });
      if (!group) throw new Error("Group not found");
      await assertProjectAssign({ prismaUserId: viewer.id, email: ctx.auth.email, projectBoardId: group.boardId });
      const archivedName = group.name.startsWith("[Archived] ") ? group.name : `[Archived] ${group.name}`;
      return prisma.ecoGroup.update({ where: { id }, data: { name: archivedName, color: "#9CA3AF" } });
    },

    bulkCreateItems: async (
      _: unknown,
      { boardId, groupId, items }: { boardId: string; groupId: string; items: Record<string, unknown>[] },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      await assertProjectAssign({ prismaUserId: viewer.id, email: ctx.auth.email, projectBoardId: boardId });
      const createdItems: unknown[] = [];
      for (const item of items) {
        const created = await prisma.ecoItem.create({
          data: { name: String(item.name || "Task"), boardId, groupId, dynamicData: (item.dynamicData as object) || {}, createdByUserId: viewer.id },
        });
        try {
          await bootstrapProjectAndTask({ boardId, ownerUserId: viewer.id, taskItemId: created.id });
        } catch (e) {
          console.warn("[permify] bulk bootstrap", e);
        }
        createdItems.push(created);
      }
      return createdItems;
    },

    deleteItem: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      await assertTaskEdit({ prismaUserId: viewer.id, email: ctx.auth.email, taskItemId: id });
      await prisma.ecoItem.delete({ where: { id } });
      return true;
    },

    updateBoardSubitemColumns: async (_: unknown, { id, subitemColumns }: { id: string; subitemColumns: unknown }, ctx: GqlContext) => {
      await getViewer(ctx);
      return prisma.ecoBoard.update({ where: { id }, data: { subitemColumns: subitemColumns as object } });
    },

    updateUserStatus: async (_: unknown, { status }: { status: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      return prisma.ecoUser.update({ where: { id: viewer.id }, data: { status } });
    },

    markNotificationAsRead: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const n = await prisma.ecoNotification.findFirst({ where: { id, userId: viewer.id } });
      if (!n) throw new Error("NOT_FOUND");
      return prisma.ecoNotification.update({ where: { id: n.id }, data: { isRead: true } });
    },

    sendEmail: async (
      _: unknown,
      {
        to,
        subject,
        content,
        label,
        cc,
        bcc,
        attachments,
      }: {
        to: string;
        subject: string;
        content: string;
        label?: string | null;
        cc?: string | null;
        bcc?: string | null;
        attachments?: unknown | null;
      },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      const recipient = await ensureEcoRecipientByEmail(to);
      if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");

      const attachmentsJson = normalizeAttachmentsInput(attachments);
      const toNorm = to.trim().toLowerCase();
      const ccList = parseAddressList(cc ?? undefined).filter((e) => e !== toNorm);
      const bccSet = new Set(parseAddressList(bcc ?? undefined));
      for (const c of ccList) bccSet.delete(c);
      const bccList = [...bccSet];
      const ccDisplay = cc?.trim() ? cc.trim() : null;
      const bccDisplay = bcc?.trim() ? bcc.trim() : null;

      const basePayload = {
        subject,
        content,
        label: normalizeIncomingEmailLabel(label ?? undefined),
        cc: ccDisplay,
        bcc: bccDisplay,
        attachments: attachmentsJson,
      };

      const sentRow = await prisma.ecoEmail.create({
        data: {
          ...basePayload,
          senderId: viewer.id,
          recipientId: recipient.id,
          isSent: true,
        },
        include: { sender: true },
      });

      await prisma.ecoEmail.create({
        data: {
          ...basePayload,
          senderId: viewer.id,
          recipientId: recipient.id,
          isSent: false,
        },
      });

      const extraEmails = [...new Set([...ccList, ...bccList])];
      for (const addr of extraEmails) {
        const u = await ensureEcoRecipientByEmail(addr);
        if (!u || u.id === recipient.id) continue;
        await prisma.ecoEmail.create({
          data: {
            ...basePayload,
            senderId: viewer.id,
            recipientId: u.id,
            isSent: false,
          },
        });
      }

      try {
        const { sendTaskNotificationEmail } = await import("./brevo-email");
        await sendTaskNotificationEmail({
          taskId: sentRow.id,
          assigneeEmail: to,
          assigneeName: recipient.name,
          changes: {},
          deepLink: `${appBaseUrl()}/apps/email/inbox`,
          summary: subject,
        });
      } catch (e) {
        console.warn("[sendEmail] brevo send failed", e);
      }

      return formatEmailRow(sentRow);
    },

    toggleStarEmail: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await prisma.ecoEmail.findFirst({
        where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
      });
      if (!row) throw new Error("NOT_FOUND");
      const updated = await prisma.ecoEmail.update({
        where: { id },
        data: { starred: !row.starred, isStarred: !row.starred },
        include: { sender: true },
      });
      return formatEmailRow(updated);
    },

    markEmailAsRead: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await prisma.ecoEmail.findFirst({
        where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
      });
      if (!row) throw new Error("NOT_FOUND");
      const updated = await prisma.ecoEmail.update({
        where: { id },
        data: { read: true },
        include: { sender: true },
      });
      return formatEmailRow(updated);
    },

    markEmailAsUnread: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await prisma.ecoEmail.findFirst({
        where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
      });
      if (!row) throw new Error("NOT_FOUND");
      const updated = await prisma.ecoEmail.update({
        where: { id },
        data: { read: false },
        include: { sender: true },
      });
      return formatEmailRow(updated);
    },

    archiveEmail: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await prisma.ecoEmail.findFirst({
        where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
      });
      if (!row) throw new Error("NOT_FOUND");
      const updated = await prisma.ecoEmail.update({
        where: { id },
        data: { isDeleted: true, isSpam: false },
        include: { sender: true },
      });
      return formatEmailRow(updated);
    },

    markEmailAsSpam: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await prisma.ecoEmail.findFirst({
        where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
      });
      if (!row) throw new Error("NOT_FOUND");
      const updated = await prisma.ecoEmail.update({
        where: { id },
        data: { isSpam: true, isDeleted: false },
        include: { sender: true },
      });
      return formatEmailRow(updated);
    },

    deleteEmail: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await prisma.ecoEmail.findFirst({
        where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
      });
      if (!row) {
        const stillThere = await prisma.ecoEmail.findUnique({ where: { id } });
        if (!stillThere) return true;
        throw new Error("FORBIDDEN");
      }
      if (row.isDeleted) {
        await prisma.ecoEmail.delete({ where: { id } });
      } else {
        await prisma.ecoEmail.update({ where: { id }, data: { isDeleted: true } });
      }
      return true;
    },

    setEmailLabel: async (_: unknown, { id, label }: { id: string; label: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await prisma.ecoEmail.findFirst({
        where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
      });
      if (!row) throw new Error("NOT_FOUND");
      const t = label.trim().toLowerCase();
      let next: string | null;
      if (!t) next = null;
      else if (t === "personal" || t === "important" || t === "work") next = t;
      else throw new Error("INVALID_LABEL");
      const updated = await prisma.ecoEmail.update({
        where: { id },
        data: { label: next },
        include: { sender: true },
      });
      return formatEmailRow(updated);
    },

    toggleMuteEmail: async (_: unknown, { id }: { id: string }, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);
      const row = await prisma.ecoEmail.findFirst({
        where: { id, OR: [{ recipientId: viewer.id }, { senderId: viewer.id }] },
      });
      if (!row) throw new Error("NOT_FOUND");
      const updated = await prisma.ecoEmail.update({
        where: { id },
        data: { muted: !row.muted },
        include: { sender: true },
      });
      return formatEmailRow(updated);
    },
  },

  User: {
    createdAt: (user: { createdAt?: Date }) => user.createdAt ? user.createdAt.toISOString() : null,
    notifications: async (user: { id: string }) => prisma.ecoNotification.findMany({ where: { userId: user.id } }),
    memberships: async (user: { id: string }) => prisma.ecoMember.findMany({ where: { userId: user.id }, include: { workspace: true } }),
  },

  Member: {
    createdAt: (member: { createdAt?: Date }) => member.createdAt ? member.createdAt.toISOString() : null,
    workspace: async (member: { workspaceId: string }) => prisma.ecoWorkspace.findUnique({ where: { id: member.workspaceId } }),
    user: async (member: { userId: string }) => prisma.ecoUser.findUniqueOrThrow({ where: { id: member.userId } }),
  },

  Notification: {
    createdAt: (n: { createdAt: Date | string }) => {
      if (n.createdAt instanceof Date) return n.createdAt.toISOString();
      if (typeof n.createdAt === "string") return n.createdAt;
      return new Date(n.createdAt as unknown as string).toISOString();
    },
  },
};
