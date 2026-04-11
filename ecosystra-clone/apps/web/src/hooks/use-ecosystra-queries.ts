import { useApolloClient } from "@apollo/client";
import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  GET_NOTIFICATIONS,
  GET_OR_CREATE_BOARD,
  ME_QUERY,
} from "../lib/gql-queries";

export const ecoKeys = {
  board: ["ecosystra", "board"] as const,
  me: ["ecosystra", "me"] as const,
  notifications: ["ecosystra", "notifications"] as const,
};

/** Parallel prefetch for cold start (e.g. after full page refresh). */
/* eslint-disable @typescript-eslint/no-explicit-any -- Apollo client may be a different workspace copy when embedded in Next. */
export async function prefetchEcosystraCoreQueries(
  client: any,
  queryClient: QueryClient
): Promise<void> {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ecoKeys.board,
      queryFn: async () => {
        const { data } = await client.query({
          query: GET_OR_CREATE_BOARD,
          fetchPolicy: "cache-first",
        });
        return data;
      },
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ecoKeys.me,
      queryFn: async () => {
        const { data } = await client.query({
          query: ME_QUERY,
          fetchPolicy: "cache-first",
        });
        return data;
      },
      staleTime: 3 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ecoKeys.notifications,
      queryFn: async () => {
        const { data } = await client.query({
          query: GET_NOTIFICATIONS,
          fetchPolicy: "cache-first",
        });
        return data;
      },
      staleTime: 60 * 1000,
    }),
  ]);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function useEcosystraBoardQuery() {
  const client = useApolloClient();
  return useQuery({
    queryKey: ecoKeys.board,
    queryFn: async () => {
      const { data } = await client.query({
        query: GET_OR_CREATE_BOARD,
        fetchPolicy: "cache-first",
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useEcosystraMeQuery() {
  const client = useApolloClient();
  return useQuery({
    queryKey: ecoKeys.me,
    queryFn: async () => {
      const { data } = await client.query({
        query: ME_QUERY,
        fetchPolicy: "cache-first",
      });
      return data;
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useEcosystraNotificationsQuery() {
  const client = useApolloClient();
  return useQuery({
    queryKey: ecoKeys.notifications,
    queryFn: async () => {
      const { data } = await client.query({
        query: GET_NOTIFICATIONS,
        fetchPolicy: "cache-first",
      });
      return data;
    },
    staleTime: 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
