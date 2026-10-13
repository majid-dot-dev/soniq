import { useState } from 'react'
import {
  CreditCardIcon,
  LayoutIcon,
  SignOutIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/auth-provider'
import { EASE, studioFlow } from '@/features/marketplace/components/layout/constants'
import { dashboardHref, loginHref } from '@/lib/host'
import { cn } from '@/lib/utils'

function accountInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split('@')[0]?.trim() || ''
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
}

const accountMenuContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.04,
    },
  },
}

const accountMenuItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE },
  },
}

const AVATAR_GRADIENT =
  'bg-[radial-gradient(130%_120%_at_18%_12%,#fb7185_0%,#e11d48_40%,#9f1239_72%,#3f0a16_100%)]'

export function AccountMenu({ compact }: { compact?: boolean }) {
  const reduce = useReducedMotion()
  const { status, logout, accessToken, user, profiles } = useAuth()
  const authenticated = status === 'authenticated'
  const [open, setOpen] = useState(false)
  const displayName = profiles[0]?.displayName || user?.name || user?.email || 'Account'
  const initials = accountInitials(profiles[0]?.displayName || user?.name, user?.email)
  const springTap = { type: 'spring' as const, stiffness: 420, damping: 24 }

  async function onLogout() {
    await logout()
    window.location.href = loginHref()
  }

  if (!authenticated) {
    return (
      <div className={cn('flex items-center', compact ? 'gap-0.5' : 'gap-1.5')}>
        <Link
          to="/login"
          className={cn(
            'rounded-full font-medium text-ink-2 transition-colors hover:bg-white/8 hover:text-white',
            compact ? 'px-2.5 py-1.5 text-[12px]' : 'px-3 py-1.5 text-[13px]',
          )}
        >
          Log in
        </Link>
        {!compact ? (
          <Link
            to="/signup"
            className="rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-black"
          >
            Sign up
          </Link>
        ) : null}
      </div>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label="Account"
        className="grid size-9 shrink-0 place-items-center p-0 outline-none"
      >
        <motion.span
          aria-hidden
          animate={
            reduce
              ? undefined
              : open
                ? { scale: 0.94, filter: 'brightness(1.12)' }
                : { scale: 1, filter: 'brightness(1)' }
          }
          whileHover={reduce ? undefined : { scale: 1.06, filter: 'brightness(1.1)' }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
          transition={springTap}
          className={cn(
            'grid size-7 place-items-center rounded-full text-[11px] font-semibold tracking-tight text-white',
            AVATAR_GRADIENT,
          )}
        >
          {initials}
        </motion.span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="overflow-hidden rounded-xl bg-[#161618] p-0 text-ink shadow-2xl ring-1 ring-white/12 duration-200 data-open:zoom-in-95 data-closed:zoom-out-95"
        style={{ width: '13.5rem', minWidth: '13.5rem' }}
      >
        <motion.div
          variants={reduce ? undefined : accountMenuContainer}
          initial={reduce ? false : 'hidden'}
          animate={open ? 'show' : 'hidden'}
        >
          <motion.div
            variants={reduce ? undefined : accountMenuItem}
            className="flex items-center gap-2.5 border-b border-white/8 px-3 py-3"
          >
            <motion.span
              initial={reduce ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 460, damping: 22, delay: 0.05 }}
              className={cn(
                'grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold tracking-tight text-white',
                AVATAR_GRADIENT,
              )}
            >
              {initials}
            </motion.span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">{displayName}</p>
              {user?.email ? (
                <p className="mt-0.5 truncate text-[11px] text-ink-mute">{user.email}</p>
              ) : null}
            </div>
          </motion.div>

          <div className="p-1.5">
            <motion.div variants={reduce ? undefined : accountMenuItem}>
              <DropdownMenuItem
                render={<a href={dashboardHref(accessToken)} />}
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
              >
                <LayoutIcon size={16} />
                Studio
              </DropdownMenuItem>
            </motion.div>
            <motion.div variants={reduce ? undefined : accountMenuItem}>
              <DropdownMenuItem
                render={<a href={studioFlow('/account', accessToken)} />}
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
              >
                <UserIcon size={16} />
                Account
              </DropdownMenuItem>
            </motion.div>
            <motion.div variants={reduce ? undefined : accountMenuItem}>
              <DropdownMenuItem
                render={<a href={studioFlow('/billing', accessToken)} />}
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
              >
                <CreditCardIcon size={16} />
                Billing
              </DropdownMenuItem>
            </motion.div>
            <motion.div variants={reduce ? undefined : accountMenuItem}>
              <DropdownMenuSeparator className="bg-white/10" />
            </motion.div>
            <motion.div variants={reduce ? undefined : accountMenuItem}>
              <DropdownMenuItem
                onClick={() => {
                  void onLogout()
                }}
                className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
              >
                <SignOutIcon size={16} />
                Log out
              </DropdownMenuItem>
            </motion.div>
          </div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
