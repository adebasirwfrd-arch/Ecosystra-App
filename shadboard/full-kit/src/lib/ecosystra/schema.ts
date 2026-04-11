export const typeDefs = `#graphql
  scalar JSON

  type Workspace {
    id: ID!
    name: String!
    description: String
    createdAt: String!
  }

  type Folder {
    id: ID!
    name: String!
    workspaceId: ID!
  }

  type Board {
    id: ID!
    name: String!
    columns: JSON!
    subitemColumns: JSON!
    metadata: JSON
    workspaceId: ID!
    groups: [Group!]!
    items: [Item!]!
    createdAt: String!
  }

  type Group {
    id: ID!
    name: String!
    color: String
    boardId: ID!
    items: [Item!]!
  }

  type Item {
    id: ID!
    name: String!
    boardId: ID!
    groupId: ID
    parentItemId: ID
    subitems: [Item!]
    dynamicData: JSON!
    createdAt: String!
    updatedAt: String!
  }

  type TaskAuditEntry {
    id: ID!
    fieldKey: String!
    oldValue: JSON
    newValue: JSON
    actorUserId: ID
    createdAt: String!
  }

  type Query {
    getBoard(id: ID!): Board
    getOrCreateBoard: Board!
    getItems(boardId: ID!): [Item!]!
    exportGroup(id: ID!): [JSON!]!
    me: User
    notifications: [Notification!]!
    search(query: String!): [SearchResult!]!
    workspaceUsers(workspaceId: ID!, query: String!, take: Int): [User!]!
    workspaceMembers(workspaceId: ID!): [Member!]!
    taskAuditLog(itemId: ID!): [TaskAuditEntry!]!
  }

  type Mutation {
    updateBoard(id: ID!, name: String, columns: JSON, subitemColumns: JSON): Board!
    updateBoardMetadata(id: ID!, metadata: JSON!): Board!
    createItem(name: String!, boardId: ID!, groupId: ID, parentItemId: ID, dynamicData: JSON): Item!
    updateItemDynamicData(id: ID!, dynamicData: JSON!): Item!
    updateItem(id: ID!, name: String!): Item!
    addItemUpdate(id: ID!, text: String!): Item!
    createGroup(name: String!, boardId: ID!, color: String): Group!
    updateGroup(id: ID!, name: String, color: String): Group!
    deleteGroup(id: ID!): Boolean!
    archiveGroup(id: ID!): Group!
    deleteItem(id: ID!): Boolean!
    updateBoardSubitemColumns(id: ID!, subitemColumns: JSON!): Board!
    bulkCreateItems(boardId: ID!, groupId: ID!, items: [JSON!]!): [Item!]!
    updateUserStatus(status: String!): User!
    markNotificationAsRead(id: ID!): Notification!
    setTaskOwner(itemId: ID!, ownerUserId: ID): Item!
    setTaskAssignee(itemId: ID!, assigneeUserId: ID): Item!
    assignMemberRole(workspaceId: ID!, userId: ID!, role: String!): Member!
  }

  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
    status: String
    createdAt: String
    notifications: [Notification!]!
    memberships: [Member!]!
  }

  type Notification {
    id: ID!
    title: String!
    message: String!
    isRead: Boolean!
    type: String
    link: String
    createdAt: String!
  }

  type Member {
    id: ID!
    userId: ID!
    workspaceId: ID!
    role: String!
    createdAt: String
    workspace: Workspace!
    user: User!
  }

  type SearchResult {
    id: ID!
    type: String!
    name: String!
    parentId: ID
    context: String
  }
`;
