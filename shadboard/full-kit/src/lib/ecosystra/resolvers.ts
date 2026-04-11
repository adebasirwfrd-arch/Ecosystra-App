import GraphQLJSON from "graphql-type-json";
import type { Prisma } from "@/generated/prisma";
import type { AuthState } from "./auth";
import { db as prisma, withPrismaRetry } from "@/lib/prisma";
import { logItemFieldChange } from "./audit";
import { enqueueTaskEmail } from "./email-queue";
import {
  assertProjectAssign,
  assertTaskEdit,
  bootstrapProjectAndTask,
  ensureProjectTuples,
  permifyDisabled,
  setTaskAssigneeTuple,
  setTaskOwnerTuple,
} from "./permify";
import { isSuperUserEmail } from "./superuser";

export type GqlContext = {
  auth: AuthState;
  prismaUser: Awaited<ReturnType<typeof prisma.ecoUser.findUnique>>;
};

function appBaseUrl(): string {
  return (
    process.env.APP_BASE_URL ||
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3002"
  );
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

async function getViewer(ctx: GqlContext) {
  if (!ctx.auth.email) {
    throw new Error("UNAUTHORIZED");
  }
  return withPrismaRetry(() =>
    prisma.ecoUser.upsert({
      where: { email: ctx.auth.email },
      create: {
        email: ctx.auth.email,
        name: ctx.auth.email.split("@")[0],
      },
      update: {},
    })
  );
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

async function loadBoardWithTree(boardId: string) {
  return prisma.ecoBoard.findUniqueOrThrow({
    where: { id: boardId },
    include: {
      groups: true,
      items: {
        where: { parentItemId: null },
        include: { subitems: true },
      },
    },
  });
}

export const resolvers = {
  JSON: GraphQLJSON,

  Board: {
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

  Query: {
    getOrCreateBoard: async (_: unknown, __: unknown, ctx: GqlContext) => {
      const viewer = await getViewer(ctx);

      const membership = await prisma.ecoMember.findFirst({
        where: { userId: viewer.id },
        include: {
          workspace: {
            include: {
              boards: { orderBy: { createdAt: "asc" }, take: 1 },
            },
          },
        },
      });

      if (membership?.workspace.boards[0]) {
        return loadBoardWithTree(membership.workspace.boards[0].id);
      }

      const legacy = await prisma.ecoBoard.findFirst({
        orderBy: { createdAt: "asc" },
        include: { workspace: true },
      });

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
        return loadBoardWithTree(legacy.id);
      }

      return prisma.$transaction(async (tx) => {
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
        return tx.ecoBoard.findUniqueOrThrow({
          where: { id: board.id },
          include: {
            groups: true,
            items: {
              where: { parentItemId: null },
              include: { subitems: true },
            },
          },
        });
      });
    },

    getBoard: async (_: unknown, { id }: { id: string }) => {
      return loadBoardWithTree(id);
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

    setTaskAssignee: async (
      _: unknown,
      { itemId, assigneeUserId }: { itemId: string; assigneeUserId: string | null },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      const item = await prisma.ecoItem.findUnique({ where: { id: itemId } });
      if (!item) throw new Error("NOT_FOUND");
      await assertTaskEdit({ prismaUserId: viewer.id, email: ctx.auth.email, taskItemId: itemId });

      const prev = (item.dynamicData as Record<string, unknown>) || {};
      const prevAssignee = (prev.assigneeUserId as string) || null;
      const assignee = assigneeUserId ? await prisma.ecoUser.findUnique({ where: { id: assigneeUserId } }) : null;

      const updated = await prisma.$transaction(async (tx) => {
        const nextData = {
          ...prev,
          assignee: assignee?.name || assignee?.email || "",
          assigneeUserId: assignee?.id || null,
          assigneeEmail: assignee?.email || null,
          assignee_avatarUrl: assignee?.avatarUrl ?? null,
          last_updated: new Date().toISOString(),
        };
        const row = await tx.ecoItem.update({ where: { id: itemId }, data: { dynamicData: nextData } });
        await logItemFieldChange(tx, {
          itemId, actorUserId: viewer.id, fieldKey: "assignee",
          oldValue: prev.assignee, newValue: nextData.assignee,
        });
        return row;
      });

      if (!permifyDisabled()) {
        await setTaskAssigneeTuple({
          taskItemId: itemId, assigneeUserId: assignee?.id || null, previousAssigneeUserId: prevAssignee,
        });
      }

      const assigneeChanged = (prevAssignee || null) !== (assignee?.id || null);

      if (assignee && assigneeChanged) {
        try {
          const actor = await prisma.ecoUser.findUnique({ where: { id: viewer.id }, select: { name: true, email: true } });
          const actorLabel = actor?.name?.trim() || actor?.email || "Someone";
          await prisma.ecoNotification.create({
            data: {
              userId: assignee.id,
              title: `Assigned: ${item.name}`,
              message: `${actorLabel} assigned you to this task.`,
              type: "task_assigned",
              link: `${appBaseUrl()}/board?task=${encodeURIComponent(itemId)}`,
            },
          });
        } catch (e) {
          console.error("[notification] assignee notification failed", e);
        }
      }

      if (assignee?.email && assigneeChanged) {
        await enqueueTaskEmail({
          taskId: itemId, assigneeEmail: assignee.email, assigneeName: assignee.name,
          changes: { assignee: { old: prev.assignee, new: assignee.name || assignee.email } },
          deepLink: `${appBaseUrl()}/board?task=${encodeURIComponent(itemId)}`,
          summary: `You were assigned to task "${item.name}"`,
        });

        try {
          const subject = `Assigned: ${item.name}`;
          const content = `You have been assigned to task "${item.name}".\n\nOpen the task: ${appBaseUrl()}/board?task=${encodeURIComponent(itemId)}`;
          await prisma.ecoEmail.create({
            data: {
              senderId: viewer.id,
              recipientId: assignee.id,
              subject,
              content,
              label: "work",
              isSent: false,
            },
          });
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
          console.warn("[setTaskAssignee] auto email row failed", e);
        }
      }

      return updated;
    },

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
      await getViewer(ctx);
      const board = await prisma.ecoBoard.findUnique({ where: { id } });
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
      return prisma.ecoBoard.update({
        where: { id },
        data: {
          columns: { definitions, metadata: { ...existingMetadata, ...(metadata as object) } } as Prisma.InputJsonValue,
        },
      });
    },

    createItem: async (
      _: unknown,
      args: { name: string; boardId: string; groupId?: string; parentItemId?: string; dynamicData?: Record<string, unknown> },
      ctx: GqlContext
    ) => {
      const viewer = await getViewer(ctx);
      await assertProjectAssign({ prismaUserId: viewer.id, email: ctx.auth.email, projectBoardId: args.boardId });
      const item = await prisma.ecoItem.create({
        data: {
          name: args.name, boardId: args.boardId, groupId: args.groupId,
          parentItemId: args.parentItemId,
          dynamicData: (args.dynamicData || {}) as Prisma.InputJsonValue,
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
            deepLink: `${appBaseUrl()}/board?task=${encodeURIComponent(id)}`,
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
