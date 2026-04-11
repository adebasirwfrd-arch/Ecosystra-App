"use client";

import { useApolloClient } from "@apollo/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { prefetchEcosystraCoreQueries } from "../hooks/use-ecosystra-queries";
import { prefetchBoardHeavyChunks } from "../lib/ecosystra-warmup";

/**
 * Must live under the same @tanstack/react-query instance as QueryClientProvider
 * (embedding the web app in another Next app can otherwise duplicate the package).
 */
export function EcosystraDataWarmup() {
  const queryClient = useQueryClient();
  const apollo = useApolloClient();

  useEffect(() => {
    prefetchBoardHeavyChunks();
    void prefetchEcosystraCoreQueries(apollo, queryClient);
  }, [apollo, queryClient]);

  return null;
}
