import { useQuery } from "@apollo/client";

import {
  GET_NOTIFICATIONS,
  GET_OR_CREATE_BOARD,
  ME_QUERY,
} from "../lib/gql-queries";

export function useEcosystraBoardQuery() {
  return useQuery(GET_OR_CREATE_BOARD);
}

export function useEcosystraMeQuery() {
  return useQuery(ME_QUERY);
}

export function useEcosystraNotificationsQuery() {
  return useQuery(GET_NOTIFICATIONS, { pollInterval: 60_000 });
}
