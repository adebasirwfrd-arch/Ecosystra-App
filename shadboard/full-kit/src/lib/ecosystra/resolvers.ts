import GraphQLJSON from "graphql-type-json";
import type { Prisma } from "@prisma/client";
import type { AuthState } from "./auth";
import { db as prisma } from "@/lib/prisma";
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

async function getViewer(ctx: GqlContext) {
  if (!ctx.auth.email) {
    throw new Error("UNAUTHORIZED");
  }
  return prisma.ecoUser.upsert({
    where: { email: ctx.auth.email },
    create: {
      email: ctx.auth.email,
      name: ctx.auth.email.split("@")[0],
    },
    update: {},
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
