import { Skeleton } from "@/components/ui/skeleton"

/** Instant shell while RSC loads the next dashboard segment (dev feels snappier). */
export default function DashboardSegmentLoading() {
  return (
    <div className="container flex flex-col gap-4 p-4">
      <Skeleton className="h-8 w-56 max-w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl md:col-span-2" />
      </div>
    </div>
  )
}
