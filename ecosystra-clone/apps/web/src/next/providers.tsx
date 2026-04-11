"use client";

import { ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useMemo } from "react";
import type { ReactNode } from "react";

import { ecoKeys } from "../hooks/use-ecosystra-queries";
import { createApolloClient } from "./apollo-client";
import { EcosystraDataWarmup } from "./ecosystra-data-warmup";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 30 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "774084590937-ej8f13a7j01gddobb42a426uksudqst8.apps.googleusercontent.com";

  const queryClient = useMemo(() => createQueryClient(), []);

  const apolloClient = useMemo(
    () =>
      createApolloClient({
        afterMutation: (operationName) => {
          const n = operationName || "";
          if (n === "UpdateUserStatus") {
            void queryClient.invalidateQueries({ queryKey: ecoKeys.me });
            return;
          }
          if (/MarkNotification|Notification/i.test(n)) {
            void queryClient.invalidateQueries({
              queryKey: ecoKeys.notifications,
            });
            return;
          }
          // Only refetch full board when structure/items change — not on every cell edit
          // (UpdateItemDynamicData + board invalidation was wiping optimistic rows before createItem finished).
          const boardStructureMutations = new Set([
            "CreateItem",
            "DeleteItem",
            "BulkCreateItems",
            "CreateGroup",
            "DeleteGroup",
            "ArchiveGroup",
          ]);
          if (n && boardStructureMutations.has(n)) {
            void queryClient.invalidateQueries({ queryKey: ecoKeys.board });
          }
        },
      }),
    [queryClient]
  );

  /* eslint-disable @typescript-eslint/no-explicit-any -- dual @types/react when embedded in Next.js */
  const Apollo = ApolloProvider as any;

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Apollo client={apolloClient}>
          <EcosystraDataWarmup />
          {children}
        </Apollo>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
