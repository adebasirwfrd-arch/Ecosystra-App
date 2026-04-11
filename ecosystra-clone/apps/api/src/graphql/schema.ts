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

  type Query {
    getBoard(id: ID!): Board
    getOrCreateBoard: Board!
    getItems(boardId: ID!): [Item!]!
    exportGroup(id: ID!): [JSON!]!
    me: User
    notifications: [Notification!]!
    search(query: String!): [SearchResult!]!
  }

  type Mutation {
    updateBoard(
      id: ID!
      name: String
      columns: JSON
      subitemColumns: JSON
    ): Board!

    updateBoardMetadata(
      id: ID!
      metadata: JSON!
    ): Board!

    createItem(
      name: String!
      boardId: ID!
      groupId: ID
      parentItemId: ID
      dynamicData: JSON
    ): Item!
    
    updateItemDynamicData(
      id: ID!
      dynamicData: JSON!
    ): Item!

    updateItem(
      id: ID!
      name: String!
    ): Item!

    addItemUpdate(
      id: ID!
      text: String!
    ): Item!

    createGroup(
      name: String!
      boardId: ID!
      color: String
    ): Group!

    updateGroup(
      id: ID!
      name: String
      color: String
    ): Group!

    deleteGroup(id: ID!): Boolean!
    archiveGroup(id: ID!): Group!

    deleteItem(id: ID!): Boolean!

    updateBoardSubitemColumns(
      id: ID!
      subitemColumns: JSON!
    ): Board!

    bulkCreateItems(
      boardId: ID!
      groupId: ID!
      items: [JSON!]!
    ): [Item!]!

    updateUserStatus(status: String!): User!
    markNotificationAsRead(id: ID!): Notification!
  }

  type User {
    id: ID!
    email: String!
    name: String
    avatarUrl: String
    status: String
    notifications: [Notification!]!
    memberships: [Member!]!
  }

  type Notification {
    id: ID!
    title: String!
    message: String!
    isRead: Boolean!
    link: String
    createdAt: String!
  }

  type Member {
    id: ID!
    userId: ID!
    workspaceId: ID!
    role: String!
    workspace: Workspace!
    user: User!
  }

  type SearchResult {
    id: ID!
    type: String! # Item, Group, Board
    name: String!
    parentId: ID
    context: String
  }
`;
