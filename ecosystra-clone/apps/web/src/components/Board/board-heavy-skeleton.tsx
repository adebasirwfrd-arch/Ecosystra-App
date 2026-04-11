import React from "react";

import { Skeleton } from "../../../../../../shadboard/full-kit/src/components/ui/skeleton";

function TableSkeletonInner() {
  return (
    <div className="board-heavy-skeleton space-y-3 p-4" aria-hidden>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-md" />
        ))}
      </div>
      <Skeleton className="h-10 w-full max-w-md rounded-md" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

function KanbanSkeletonInner() {
  return (
    <div
      className="board-heavy-skeleton flex gap-3 overflow-hidden p-4"
      aria-hidden
    >
      {Array.from({ length: 4 }).map((_, col) => (
        <div key={col} className="flex min-w-[220px] flex-1 flex-col gap-2">
          <Skeleton className="h-8 w-full rounded-md" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function BoardHeavySkeleton({
  variant,
}: {
  variant: "table" | "kanban";
}) {
  return variant === "kanban" ? <KanbanSkeletonInner /> : <TableSkeletonInner />;
}
