"use client";

import { useEffect } from "react";
import { prefetchBoardHeavyChunks } from "../lib/ecosystra-warmup";

/**
 * Preloads heavy board UI chunks (code-split components).
 * Data fetching is handled by Apollo useQuery in the consuming components.
 */
export function EcosystraDataWarmup() {
  useEffect(() => {
    prefetchBoardHeavyChunks();
  }, []);

  return null;
}
