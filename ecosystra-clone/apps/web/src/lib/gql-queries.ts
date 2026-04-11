import { gql } from "@apollo/client";

/** Shared documents for TanStack + Apollo bridge hooks */
export const GET_OR_CREATE_BOARD = gql`
  query GetOrCreateBoard {
    getOrCreateBoard {
      id
      name
      workspaceId
      columns
      subitemColumns
      metadata
      groups {
        id
        name
        color
      }
      items {
        id
        name
        groupId
        dynamicData
        subitems {
          id
          name
          groupId
          dynamicData
        }
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      status
      avatarUrl
      createdAt
      memberships {
        id
        role
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
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
`;

export const WORKSPACE_USERS_SEARCH = gql`
  query WorkspaceUsers($workspaceId: ID!, $query: String!, $take: Int) {
    workspaceUsers(workspaceId: $workspaceId, query: $query, take: $take) {
      id
      name
      email
      avatarUrl
    }
  }
`;

export const SET_TASK_OWNER = gql`
  mutation SetTaskOwner($itemId: ID!, $ownerUserId: ID) {
    setTaskOwner(itemId: $itemId, ownerUserId: $ownerUserId) {
      id
      dynamicData
    }
  }
`;

export const SET_TASK_ASSIGNEE = gql`
  mutation SetTaskAssignee($itemId: ID!, $assigneeUserId: ID) {
    setTaskAssignee(itemId: $itemId, assigneeUserId: $assigneeUserId) {
      id
      dynamicData
    }
  }
`;

export const WORKSPACE_MEMBERS = gql`
  query WorkspaceMembers($workspaceId: ID!) {
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
`;

