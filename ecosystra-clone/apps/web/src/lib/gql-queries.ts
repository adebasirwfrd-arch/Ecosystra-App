import { gql } from "@apollo/client";

/** Shared documents for TanStack + Apollo bridge hooks */
export const GET_OR_CREATE_BOARD = gql`
  query GetOrCreateBoard {
    getOrCreateBoard {
      id
      name
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
      createdAt
    }
  }
`;
