import { gql } from "@apollo/client"

/** Board tree for main table (groups → top-level items → subitems). */
export const GET_OR_CREATE_BOARD = gql`
  query GetOrCreateBoard {
    getOrCreateBoard {
      id
      name
      workspaceId
      viewerWorkspaceRole
      metadata
      columns
      subitemColumns
      groups {
        id
        name
        color
        items {
          id
          name
          groupId
          createdByUserId
          updatedAt
          lastUpdatedBy {
            id
            name
            avatarUrl
          }
          dynamicData
          subitems {
            id
            name
            createdByUserId
            updatedAt
            lastUpdatedBy {
              id
              name
              avatarUrl
            }
            dynamicData
          }
        }
      }
    }
  }
`

export const UPDATE_BOARD = gql`
  mutation UpdateBoard($id: ID!, $name: String) {
    updateBoard(id: $id, name: $name) {
      id
      name
    }
  }
`

export const UPDATE_BOARD_METADATA = gql`
  mutation UpdateBoardMetadata($id: ID!, $metadata: JSON!) {
    updateBoardMetadata(id: $id, metadata: $metadata) {
      id
      metadata
    }
  }
`

export const UPDATE_BOARD_SUBITEM_COLUMNS = gql`
  mutation UpdateBoardSubitemColumns($id: ID!, $subitemColumns: JSON!) {
    updateBoardSubitemColumns(id: $id, subitemColumns: $subitemColumns) {
      id
      subitemColumns
    }
  }
`

export const CREATE_ITEM = gql`
  mutation CreateItem(
    $name: String!
    $boardId: ID!
    $groupId: ID
    $parentItemId: ID
    $dynamicData: JSON
  ) {
    createItem(
      name: $name
      boardId: $boardId
      groupId: $groupId
      parentItemId: $parentItemId
      dynamicData: $dynamicData
    ) {
      id
      name
      groupId
      parentItemId
      dynamicData
    }
  }
`

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $name: String!) {
    updateItem(id: $id, name: $name) {
      id
      name
    }
  }
`

export const MOVE_ITEM_TO_GROUP = gql`
  mutation MoveItemToGroup($id: ID!, $groupId: ID!) {
    moveItemToGroup(id: $id, groupId: $groupId) {
      id
      groupId
    }
  }
`

export const UPDATE_ITEM_DYNAMIC_DATA = gql`
  mutation UpdateItemDynamicData($id: ID!, $dynamicData: JSON!) {
    updateItemDynamicData(id: $id, dynamicData: $dynamicData) {
      id
      dynamicData
    }
  }
`

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`

export const SET_TASK_OWNER = gql`
  mutation SetTaskOwner($itemId: ID!, $ownerUserId: ID) {
    setTaskOwner(itemId: $itemId, ownerUserId: $ownerUserId) {
      id
      dynamicData
    }
  }
`

export const SET_TASK_ASSIGNEE = gql`
  mutation SetTaskAssignee($itemId: ID!, $assigneeUserId: ID) {
    setTaskAssignee(itemId: $itemId, assigneeUserId: $assigneeUserId) {
      id
      dynamicData
    }
  }
`

export const SET_TASK_ASSIGNEES = gql`
  mutation SetTaskAssignees(
    $itemId: ID!
    $assigneeUserIds: [ID!]!
    $inviteEmails: [String!]!
  ) {
    setTaskAssignees(
      itemId: $itemId
      assigneeUserIds: $assigneeUserIds
      inviteEmails: $inviteEmails
    ) {
      id
      dynamicData
    }
  }
`

export const ACCEPT_TASK_ASSIGNEE_INVITE = gql`
  mutation AcceptTaskAssigneeInvite($token: String!) {
    acceptTaskAssigneeInvite(token: $token) {
      id
      dynamicData
    }
  }
`

export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $boardId: ID!, $color: String) {
    createGroup(name: $name, boardId: $boardId, color: $color) {
      id
      name
      color
    }
  }
`

export const UPDATE_GROUP = gql`
  mutation UpdateGroup($id: ID!, $name: String, $color: String) {
    updateGroup(id: $id, name: $name, color: $color) {
      id
      name
      color
    }
  }
`

export const DELETE_GROUP = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`

export const SEARCH_WORKSPACE = gql`
  query SearchWorkspace($query: String!) {
    search(query: $query) {
      id
      type
      name
      parentId
      context
    }
  }
`

export const WORKSPACE_USERS = gql`
  query WorkspaceUsers($workspaceId: ID!, $query: String!, $take: Int) {
    workspaceUsers(workspaceId: $workspaceId, query: $query, take: $take) {
      id
      name
      email
    }
  }
`

export const ME_NAV_BOOTSTRAP = gql`
  query MeNavBootstrap {
    me {
      id
      memberships {
        workspaceId
        role
      }
    }
  }
`

export const ECOSYSTRA_NOTIFICATIONS = gql`
  query EcosystraNotifications {
    notifications {
      id
      title
      message
      isRead
      type
      link
      createdAt
    }
  }
`

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      isRead
    }
  }
`

export const ECOSYSTRA_EMAILS_INBOX = gql`
  query EcosystraEmailsInbox {
    emails(filter: "inbox") {
      id
      subject
      read
      createdAt
      sender {
        id
        name
        email
        avatar
      }
    }
    emailCounts {
      inbox
    }
  }
`

export const WORKSPACE_MEMBERS_LIST = gql`
  query WorkspaceMembersList($workspaceId: ID!) {
    workspaceMembers(workspaceId: $workspaceId) {
      id
      role
      createdAt
      user {
        id
        name
        email
        avatarUrl
        status
      }
    }
  }
`

export const ASSIGN_MEMBER_ROLE = gql`
  mutation AssignMemberRole($workspaceId: ID!, $userId: ID!, $role: String!) {
    assignMemberRole(workspaceId: $workspaceId, userId: $userId, role: $role) {
      id
      role
    }
  }
`
