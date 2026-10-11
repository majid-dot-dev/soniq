import { Skeleton } from '@/components/ui/skeleton'

function LicenseRowSkeleton() {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-white/8 px-2 py-3.5 lg:grid-cols-[2rem_minmax(0,1.3fr)_6.5rem_minmax(0,1fr)_5.5rem_4.5rem_5rem]">
      <Skeleton className="size-4 rounded-sm" />
      <div className="min-w-0 space-y-1.5">
        <Skeleton className="h-3.5 w-36 max-w-full rounded-md" />
        <Skeleton className="h-3 w-48 max-w-[85%] rounded-md" />
        <Skeleton className="mt-1 h-3 w-40 max-w-[70%] rounded-md lg:hidden" />
      </div>
      <Skeleton className="hidden h-3.5 w-16 rounded-md lg:block" />
      <Skeleton className="hidden h-3.5 w-28 max-w-full rounded-md lg:block" />
      <Skeleton className="hidden h-3.5 w-12 rounded-md lg:block" />
      <Skeleton className="hidden h-3.5 w-6 rounded-md lg:block" />
      <div className="flex justify-end">
        <Skeleton className="h-5 w-9 rounded-full" />
      </div>
    </div>
  )
}

export function LicensesTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mt-4 min-h-0 flex-1 overflow-auto" aria-busy="true" aria-label="Loading licenses">
      <div className="hidden grid-cols-[2rem_minmax(0,1.3fr)_6.5rem_minmax(0,1fr)_5.5rem_4.5rem_5rem] items-center gap-3 px-2 pb-2 text-[11px] font-medium tracking-[0.04em] text-ink-faint uppercase lg:grid">
        <Skeleton className="size-4 rounded-sm" />
        <span>License</span>
        <span>Kind</span>
        <span>Files</span>
        <span>Price</span>
        <span>Items</span>
        <span className="text-right">Active</span>
      </div>
      <div className="flex flex-col">
        {Array.from({ length: rows }, (_, index) => (
          <LicenseRowSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
