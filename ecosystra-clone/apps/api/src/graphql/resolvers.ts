import GraphQLJSON from 'graphql-type-json';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  JSON: GraphQLJSON,

  Board: {
    metadata: (board: any) => {
      const columns = board?.columns;
      if (columns && typeof columns === 'object' && !Array.isArray(columns)) {
        return (columns as any).metadata || {};
      }
      return {};
    },
    columns: (board: any) => {
      const columns = board?.columns;
      if (Array.isArray(columns)) return columns;
      if (columns && typeof columns === 'object' && Array.isArray((columns as any).definitions)) {
        return (columns as any).definitions;
      }
      return [];
    }
  },

  Query: {
    getOrCreateBoard: async () => {
      const existingBoard = await prisma.board.findFirst({
        include: {
          groups: true,
          items: {
            where: { parentItemId: null },
            include: { subitems: true }
          }
        }
      });

      if (existingBoard) {
        return existingBoard;
      }

      return await prisma.$transaction(async (tx) => {
        const workspace = await tx.workspace.create({
          data: {
            name: 'Default Workspace',
            description: 'Auto-generated workspace for first run'
          }
        });

        const board = await tx.board.create({
          data: {
            name: 'Task management',
            workspaceId: workspace.id,
            columns: [],
            subitemColumns: []
          }
        });

        await tx.group.create({
          data: {
            name: 'New Group',
            color: '#A25DDC',
            boardId: board.id
          }
        });

        return tx.board.findUniqueOrThrow({
          where: { id: board.id },
          include: {
            groups: true,
            items: {
              where: { parentItemId: null },
              include: { subitems: true }
            }
          }
        });
      });
    },

    // Mengambil board beserta seluruh struktur hirarkis di bawahnya
    getBoard: async (_: any, { id }: { id: string }) => {
      return await prisma.board.findUnique({
        where: { id },
        include: {
          groups: true,
          items: {
            where: { parentItemId: null }, // Hanya ambil item pada level-0, subitems ditangani terpisah
            include: {
              subitems: true // Memuat tingkat subitem 1
            }
          }
        }
      });
    },
    
    getItems: async (_: any, { boardId }: { boardId: string }) => {
      return await prisma.item.findMany({
        where: { boardId }
      });
    },

    exportGroup: async (_: any, { id }: { id: string }) => {
      const group = await prisma.group.findUnique({
        where: { id },
        include: {
          items: {
            where: { parentItemId: null },
            include: { subitems: true }
          }
        }
      });
      if (!group) return [];
      return group.items.map((item) => ({
        id: item.id,
        name: item.name,
        group: group.name,
        ...((item.dynamicData as Record<string, any>) || {})
      }));
    },

    me: async () => {
      let user = await prisma.user.findFirst({
        include: { memberships: true, notifications: true }
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'ade.basirwfrd@gmail.com',
            name: 'Ade Basir',
            avatarUrl: null,
            status: 'Working on it'
          },
          include: { memberships: true, notifications: true }
        });

        // Add dummy notification
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'Welcome to Ecosystra',
            message: 'Experience the next generation of work management.',
            isRead: false
          }
        });
      }
      return user;
    },

    notifications: async () => {
      const user = await prisma.user.findFirst();
      if (!user) return [];
      return await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });
    },

    search: async (_: any, { query }: { query: string }) => {
      const items = await prisma.item.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 5
      });
      const groups = await prisma.group.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 3
      });
      const boards = await prisma.board.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 2
      });

      const results = [
        ...items.map(i => ({ id: i.id, type: 'Item', name: i.name, parentId: i.groupId, context: 'Task' })),
        ...groups.map(g => ({ id: g.id, type: 'Group', name: g.name, parentId: g.boardId, context: 'Group' })),
        ...boards.map(b => ({ id: b.id, type: 'Board', name: b.name, context: 'Board' }))
      ];
      return results;
    }
  },

  Mutation: {
    updateBoard: async (_: any, { id, name, columns, subitemColumns }: { id: string, name?: string, columns?: any, subitemColumns?: any }) => {
      const existingBoard = await prisma.board.findUnique({ where: { id } });
      const existingColumns = existingBoard?.columns;
      const existingMetadata =
        existingColumns && typeof existingColumns === 'object' && !Array.isArray(existingColumns)
          ? (existingColumns as any).metadata || {}
          : {};
      const nextColumns: any =
        columns !== undefined
          ? { definitions: columns, metadata: existingMetadata }
          : existingColumns;
      const safeColumns = nextColumns === null ? [] : nextColumns;

      return await prisma.board.update({
        where: { id },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(columns !== undefined ? { columns: safeColumns } : {}),
          ...(subitemColumns !== undefined ? { subitemColumns } : {})
        }
      });
    },

    updateBoardMetadata: async (_: any, { id, metadata }: { id: string, metadata: any }) => {
      const board = await prisma.board.findUnique({ where: { id } });
      const existingColumns = board?.columns;
      const definitions =
        Array.isArray(existingColumns)
          ? existingColumns
          : (existingColumns && typeof existingColumns === 'object' && Array.isArray((existingColumns as any).definitions))
            ? (existingColumns as any).definitions
            : [];
      const existingMetadata =
        existingColumns && typeof existingColumns === 'object' && !Array.isArray(existingColumns)
          ? (existingColumns as any).metadata || {}
          : {};

      return await prisma.board.update({
        where: { id },
        data: {
          columns: {
            definitions,
            metadata: { ...existingMetadata, ...metadata }
          }
        }
      });
    },

    // Membuat Item atau Subitem
    createItem: async (_: any, args: {
      name: string;
      boardId: string;
      groupId?: string;
      parentItemId?: string;
      dynamicData?: any;
    }) => {
      return await prisma.item.create({
        data: {
          name: args.name,
          boardId: args.boardId,
          groupId: args.groupId,
          parentItemId: args.parentItemId,
          dynamicData: args.dynamicData || {},
        }
      });
    },

    // Memperbarui hanya sebagian spesifik dari JSONB Dynamic Data
    updateItemDynamicData: async (_: any, { id, dynamicData }: { id: string, dynamicData: any }) => {
      // Pada SQL mentah, ini sama dengan melakukan jsonb_set untuk menimpa state tanpa reset total
      // Di prisma, update untuk JSON Object akan menelan objek keseluruhan tanpa payload deep merge (bergantung tipe db)
      // Namun bisa diabstraksikan via query raw ke PostgreSQL jika kompleks
      const currentItem = await prisma.item.findUnique({ where: { id } });
      const currentData = (currentItem?.dynamicData as Record<string, any>) || {};
      
      const mergedData = { ...currentData, ...dynamicData };

      return await prisma.item.update({
        where: { id },
        data: {
          dynamicData: mergedData,
        }
      });
    },

    updateItem: async (_: any, { id, name }: { id: string, name: string }) => {
      return await prisma.item.update({
        where: { id },
        data: { name }
      });
    },

    addItemUpdate: async (_: any, { id, text }: { id: string, text: string }) => {
      const item = await prisma.item.findUnique({ where: { id } });
      const currentData = (item?.dynamicData as Record<string, any>) || {};
      const updates = Array.isArray(currentData.updates) ? currentData.updates : [];
      const nextUpdates = [
        {
          id: `upd-${Date.now()}`,
          text,
          createdAt: new Date().toISOString()
        },
        ...updates
      ];
      return await prisma.item.update({
        where: { id },
        data: {
          dynamicData: {
            ...currentData,
            updates: nextUpdates
          }
        }
      });
    },

    // --- Group CRUD ---
    createGroup: async (_: any, { name, boardId, color }: { name: string, boardId: string, color?: string }) => {
      return await prisma.group.create({
        data: { name, boardId, color }
      });
    },

    updateGroup: async (_: any, { id, name, color }: { id: string, name?: string, color?: string }) => {
      return await prisma.group.update({
        where: { id },
        data: { name, color }
      });
    },

    deleteGroup: async (_: any, { id }: { id: string }) => {
      await prisma.group.delete({
        where: { id }
      });
      return true;
    },

    archiveGroup: async (_: any, { id }: { id: string }) => {
      const group = await prisma.group.findUnique({ where: { id } });
      if (!group) throw new Error('Group not found');
      const archivedName = group.name.startsWith('[Archived] ') ? group.name : `[Archived] ${group.name}`;
      return await prisma.group.update({
        where: { id },
        data: { name: archivedName, color: '#9CA3AF' }
      });
    },

    // --- Import / Bulk Create ---
    bulkCreateItems: async (_: any, { boardId, groupId, items }: { boardId: string, groupId: string, items: any[] }) => {
      const createdItems = [];
      for (const item of items) {
        const created = await prisma.item.create({
          data: {
            name: item.name,
            boardId,
            groupId,
            dynamicData: item.dynamicData || {}
          }
        });
        createdItems.push(created);
      }
      return createdItems;
    },

    deleteItem: async (_: any, { id }: { id: string }) => {
      // Cascade delete is handled by Prisma (Cascade onDelete in schema)
      // But we can double check or do a manual cleanup if needed.
      await prisma.item.delete({ where: { id } });
      return true;
    },

    updateBoardSubitemColumns: async (_: any, { id, subitemColumns }: { id: string, subitemColumns: any }) => {
      return await prisma.board.update({
        where: { id },
        data: { subitemColumns }
      });
    },

    updateUserStatus: async (_: any, { status }: { status: string }) => {
      const user = await prisma.user.findFirst();
      if (!user) throw new Error('User not found');
      return await prisma.user.update({
        where: { id: user.id },
        data: { status }
      });
    },

    markNotificationAsRead: async (_: any, { id }: { id: string }) => {
      return await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      });
    }

  },

  User: {
    notifications: async (user: any) => {
      return await prisma.notification.findMany({ where: { userId: user.id } });
    },
    memberships: async (user: any) => {
      return await prisma.member.findMany({ where: { userId: user.id }, include: { workspace: true } });
    }
  },

  Member: {
    workspace: async (member: any) => {
      return await prisma.workspace.findUnique({ where: { id: member.workspaceId } });
    },
    user: async (member: any) => {
      return await prisma.user.findUniqueOrThrow({ where: { id: member.userId } });
    }
  }
};
