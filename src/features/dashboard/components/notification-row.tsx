import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'
import type { Notification } from '@/features/dashboard/notifications'
import { cn } from '@/lib/utils'

// const statusClass = {
//   paid: 'bg-yield-tint text-yield-bright',
//   pending: 'bg-ember-tint text-ember-bright',
//   live: 'bg-white/10 text-white',
// } as const

export function NotificationRow({ item }: { item: Notification }) {
  const incoming = item.direction === 'in'

  return (
    <span className="flex w-full gap-3">
      <span className="relative size-10 shrink-0">
        <span className="grid size-10 place-items-center rounded-full bg-white/10 text-[11px] font-semibold tracking-wide text-white">
          {item.initials}
        </span>
        <span
          className={cn(
            'absolute -right-0.5 -bottom-0.5 grid size-4 place-items-center rounded-full text-white ring-2 ring-[#121214]',
            incoming ? 'bg-yield' : 'bg-rose-500',
          )}
        >
          {incoming ? <ArrowDownIcon className="size-2.5" weight="bold" /> : <ArrowUpIcon className="size-2.5" weight="bold" />}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="truncate text-[14px] font-semibold text-white">{item.name}</span>
          <span className="shrink-0 text-[12px] text-ink-mute">{item.time}</span>
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-ink-mute">
          {item.detail}
          {item.amount ? (
            <span className={cn('font-medium', incoming ? 'text-yield-bright' : 'text-rose-400')}> {item.amount}</span>
          ) : null}
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          {/* <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', statusClass[item.statusTone])}>
            {item.status}
          </span> */}
          <span className="rounded-md bg-white/8 px-2 py-0.5 text-[11px] font-medium text-ink-2">{item.category}</span>
        </span>
      </span>
      <span
        className={cn(
          'mt-6 size-2 shrink-0 rounded-full bg-rose-500 transition-opacity duration-300',
          item.unread ? 'opacity-100' : 'opacity-0',
        )}
      />
    </span>
  )
}