import { Skeleton } from '@/components/ui/skeleton'

export function AllTracksTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mt-5 flex flex-col" aria-busy="true" aria-label="Loading tracks">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-3 sm:gap-4 sm:px-3"
        >
          <Skeleton className="size-12 shrink-0 rounded-lg sm:size-14" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40 max-w-full rounded-md" />
            <Skeleton className="h-3 w-52 max-w-[80%] rounded-md" />
          </div>
          <div className="hidden items-center gap-1.5 lg:flex">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
          <Skeleton className="hidden h-7 w-12 rounded-lg sm:block" />
          <Skeleton className="size-8 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function AllTracksGridSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <div
      className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Loading tracks"
    >
      {Array.from({ length: cards }, (_, index) => (
        <div key={index} className="min-w-0">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="mt-3 flex items-start gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-[75%] rounded-md" />
              <Skeleton className="h-3 w-[50%] rounded-md" />
            </div>
            <Skeleton className="size-8 shrink-0 rounded-full" />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <Skeleton className="h-8 w-14 rounded-lg" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
