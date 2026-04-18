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
    createdByUserId: ID
    subitems: [Item!]
    dynamicData: JSON!
    createdAt: String!
    updatedAt: String!
  }

  type TaskAssigneeInvite {
    id: ID!
    itemId: ID!
    email: String!
    status: String!
    createdAt: String!
  }

  type TaskAuditEntry {
    id: ID!
    fieldKey: String!
    oldValue: JSON
    newValue: JSON
    actorUserId: ID
    createdAt: String!
  }

  type Email {
    id: ID!
    sender: EmailUser!
    recipientId: ID!
    subject: String!
    content: String!
    read: Boolean!
    starred: Boolean!
    label: String
    isDraft: Boolean!
    isSent: Boolean!
    isStarred: Boolean!
    isSpam: Boolean!
    isDeleted: Boolean!
    muted: Boolean!
    cc: String
    bcc: String
    attachments: JSON!
    createdAt: String!
  }

  type EmailUser {
    id: ID!
    name: String!
    email: String!
    avatar: String
    status: String
  }

  type EmailCounts {
    inbox: Int!
    sent: Int!
    draft: Int!
    starred: Int!
    spam: Int!
    trash: Int!
    personal: Int!
    important: Int!
    work: Int!
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
    emails(filter: String!): [Email!]!
    emailById(id: ID!): Email
    emailCounts: EmailCounts!
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
    """Replace workspace-member assignees; optional inviteEmails create pending invites (Brevo)."""
    setTaskAssignees(itemId: ID!, assigneeUserIds: [ID!]!, inviteEmails: [String!]!): Item!
    acceptTaskAssigneeInvite(token: String!): Item!
    assignMemberRole(workspaceId: ID!, userId: ID!, role: String!): Member!
    sendEmail(
      to: String!
      subject: String!
      content: String!
      label: String
      cc: String
      bcc: String
      attachments: JSON
    ): Email!
    toggleStarEmail(id: ID!): Email!
    markEmailAsRead(id: ID!): Email!
    markEmailAsUnread(id: ID!): Email!
    archiveEmail(id: ID!): Email!
    markEmailAsSpam(id: ID!): Email!
    deleteEmail(id: ID!): Boolean!
    setEmailLabel(id: ID!, label: String!): Email!
    toggleMuteEmail(id: ID!): Email!
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
