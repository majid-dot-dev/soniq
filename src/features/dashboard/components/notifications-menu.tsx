import type { ReactNode } from 'react'
import { Bell } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationRow } from '@/features/dashboard/components/notification-row'
import { markNotificationsRead, useNotifications } from '@/features/dashboard/notifications'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const bellRing = { rotate: [0, -16, 12, -6, 0] }

function Reveal({ index, children }: { index: number; children: ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="w-full"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.06 + index * 0.045 }}
    >
      {children}
    </motion.div>
  )
}

export function NotificationsMenu() {
  const notifications = useNotifications()
  const unread = notifications.filter((item) => item.unread).length
  const reduce = useReducedMotion()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        className="relative grid size-9 place-items-center rounded-full text-ink-2 transition-colors outline-none hover:bg-white/8 hover:text-white data-popup-open:bg-white/8 data-popup-open:text-white"
      >
        <motion.span
          className="grid place-items-center"
          animate={unread > 0 && !reduce ? bellRing : { rotate: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: unread > 0 ? 0.3 : 0 }}
        >
          <Bell size={18} />
        </motion.span>
        <AnimatePresence>
          {unread > 0 ? (
            <motion.span
              key="unread"
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white"
            >
              {unread}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          'origin-(--transform-origin) rounded-2xl bg-[rgba(16,16,18,0.72)] p-2 text-ink shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] backdrop-blur-2xl',
          'data-open:animate-none data-closed:animate-none',
          !reduce &&
            'transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-starting-style:scale-[0.96] data-starting-style:opacity-0 data-starting-style:-translate-y-2 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:-translate-y-1',
        )}
        style={{ width: '24rem', minWidth: '24rem' }}
      >
        <Reveal index={0}>
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <p className="text-[15px] font-semibold text-white">Notifications</p>
            <button
              type="button"
              onClick={markNotificationsRead}
              disabled={unread === 0}
              className="text-[13px] font-medium text-rose-500 transition-opacity duration-300 disabled:opacity-40"
            >
              Mark as read
            </button>
          </div>
        </Reveal>
        {notifications.map((item, index) => (
          <DropdownMenuItem
            key={item.id}
            className="h-auto cursor-default items-start rounded-xl px-2 py-2.5 whitespace-normal transition-colors duration-200 focus:bg-white/8"
          >
            <Reveal index={index + 1}>
              <NotificationRow item={item} />
            </Reveal>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          render={<Link to="/notifications" />}
          className="mt-1 cursor-pointer justify-center rounded-xl px-2 py-2 text-[13px] font-medium text-rose-500 transition-colors duration-200 focus:bg-white/8 focus:text-rose-500"
        >
          <motion.span
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.06 + (notifications.length + 1) * 0.045 }}
          >
            See all
          </motion.span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
