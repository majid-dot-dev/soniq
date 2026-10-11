import { useMemo, useState } from 'react'
import { DashboardPage } from '@/features/dashboard/components/dashboard-page'
import {
  markNotificationRead,
  markNotificationsRead,
  useNotifications,
  type Notification,
} from '@/features/dashboard/notifications'
import { cn } from '@/lib/utils'

const filters = ['All', 'Unread', 'License', 'Payout', 'Royalties', 'Split', 'Release'] as const

type Filter = (typeof filters)[number]

function age(time: string) {
  const amount = Number.parseInt(time, 10)
  if (time.endsWith('m')) return amount
  if (time.endsWith('h')) return amount * 60
  if (time.endsWith('d')) return amount * 60 * 24
  return 0
}

function NotificationHubItem({ item }: { item: Notification }) {
  const incoming = item.direction === 'in'

  return (
    <button
      type="button"
      onClick={() => markNotificationRead(item.id)}
      className={cn(
        'flex w-full items-start gap-4 rounded-2xl px-4 py-4 text-left transition-colors',
        item.unread ? 'bg-white/8 hover:bg-white/10' : 'hover:bg-white/5',
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-[12px] font-semibold tracking-wide text-white">
        {item.initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn('truncate text-[15px] font-medium', item.unread ? 'text-white' : 'text-ink-2')}>
            {item.name}
          </span>
          <span
            className={cn(
              'size-1.5 shrink-0 rounded-full bg-rose-500 transition-opacity duration-300',
              item.unread ? 'opacity-100' : 'opacity-0',
            )}
          />
        </span>
        <span className="mt-1 block text-[14px] leading-relaxed text-ink-mute">
          {item.detail}
          {item.amount ? (
            <span className={cn('font-medium', incoming ? 'text-yield-bright' : 'text-rose-400')}> {item.amount}</span>
          ) : null}
        </span>
        <span className="mt-2 block text-[12px] text-ink-faint">
          {item.status} · {item.category}
        </span>
      </span>
      <span className="shrink-0 pt-0.5 text-[13px] text-ink-mute">{item.time}</span>
    </button>
  )
}

export default function NotificationsPage() {
  const notifications = useNotifications()
  const [filter, setFilter] = useState<Filter>('All')
  const unread = notifications.filter((item) => item.unread).length

  const visible = useMemo(() => {
    const matched = notifications.filter((item) => {
      if (filter === 'All') return true
      if (filter === 'Unread') return item.unread
      return item.category === filter
    })
    return [...matched].sort((a, b) => age(a.time) - age(b.time))
  }, [notifications, filter])

  const today = visible.filter((item) => !item.time.endsWith('d'))
  const earlier = visible.filter((item) => item.time.endsWith('d'))
  const groups = [
    { label: 'Today', items: today },
    { label: 'Earlier', items: earlier },
  ].filter((group) => group.items.length > 0)

  return (
    <DashboardPage title="Notifications" description="Sales, payouts, and releases, as they happen.">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {filters.map((item) => {
              const active = filter === item
              const count = item === 'Unread' ? unread : 0
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                    active ? 'bg-white text-black' : 'text-ink-2 hover:bg-white/8 hover:text-white',
                  )}
                >
                  {item}
                  {count > 0 ? <span className={cn('ml-1.5', active ? 'text-rose-600' : 'text-rose-500')}>{count}</span> : null}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={markNotificationsRead}
            disabled={unread === 0}
            className="text-[13px] font-medium text-rose-500 transition-opacity duration-300 disabled:opacity-40"
          >
            Mark all as read
          </button>
        </div>

        {groups.length === 0 ? (
          <p className="rounded-2xl bg-white/5 px-4 py-10 text-center text-[14px] text-ink-mute">
            {filter === 'Unread' ? "You're caught up." : 'Nothing in this list.'}
          </p>
        ) : (
          groups.map((group) => (
            <section key={group.label}>
              <h2 className="px-1 text-[13px] font-medium text-ink-mute">{group.label}</h2>
              <ul className="mt-2 flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <NotificationHubItem item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </DashboardPage>
  )
}
