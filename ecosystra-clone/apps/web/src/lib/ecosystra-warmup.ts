/**
 * Preloads heavy board view chunks so first navigation after refresh
 * does not wait on dynamic import + parse.
 */
export function prefetchBoardHeavyChunks(): void {
  if (typeof window === "undefined") return;
  void import("../components/Board/VirtualBoard");
  void import("../components/Board/KanbanView");
}
