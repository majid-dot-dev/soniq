import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  Bell,
  Bookmark,
  ChevronDown,
  CreditCard,
  Download,
  Heart,
  LayoutDashboard,
  ListMusic,
  LogOut,
  Menu,
  MessageCircle,
  Receipt,
  Settings,
  ShoppingCart,
  User,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/features/auth/auth-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { dashboardHref } from '@/lib/host'
import { cn } from '@/lib/utils'
import { Container, MarketingButton } from './primitives'
import { EASE } from './motion'

const menuLabelClass = 'px-2.5 text-[11px] font-medium tracking-[0.04em] text-black/40 uppercase'

const MENU_SPRING = { type: 'spring', stiffness: 380, damping: 32, mass: 0.7 } as const

function AccountMenuItem({
  id,
  label,
  icon: Icon,
  activeId,
  onActive,
  onClick,
}: {
  id: string
  label: string
  icon: LucideIcon
  activeId: string | null
  onActive: (id: string | null) => void
  onClick?: () => void
}) {
  const reduceMotion = useReducedMotion()
  const active = activeId === id

  return (
    <DropdownMenuItem
      onClick={onClick}
      onMouseEnter={() => onActive(id)}
      onFocus={() => onActive(id)}
      className={cn(
        'relative cursor-pointer gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-medium text-black/80',
        'bg-transparent focus:bg-transparent data-highlighted:bg-transparent',
        active && 'text-black',
      )}
    >
      {active ? (
        <motion.span
          layoutId={reduceMotion ? undefined : 'account-menu-highlight'}
          className="pointer-events-none absolute inset-0 rounded-xl bg-rose-50"
          transition={reduceMotion ? { duration: 0 } : MENU_SPRING}
        />
      ) : null}
      <motion.span
        className="relative flex min-w-0 items-center gap-2.5"
        animate={reduceMotion ? undefined : { x: active ? 4 : 0 }}
        transition={reduceMotion ? { duration: 0 } : MENU_SPRING}
      >
        <motion.span
          className="grid size-4 shrink-0 place-items-center"
          animate={
            reduceMotion
              ? undefined
              : {
                  color: active ? 'rgb(225 29 72)' : 'rgba(0,0,0,0.4)',
                  scale: active ? 1.08 : 1,
                }
          }
          transition={reduceMotion ? { duration: 0 } : MENU_SPRING}
        >
          <Icon className="size-4" />
        </motion.span>
        <span>{label}</span>
      </motion.span>
    </DropdownMenuItem>
  )
}

function dashboardPath(path: string, accessToken?: string | null) {
  const url = new URL(dashboardHref(accessToken))
  url.pathname = path
  return url.toString()
}

function HeaderIconButton({
  label,
  href,
  onClick,
  children,
}: {
  label: string
  href?: string
  onClick?: () => void
  children: ReactNode
}) {
  const className =
    'relative grid size-9 place-items-center rounded-full text-black/70 transition-colors hover:bg-black/5 hover:text-black'

  if (href) {
    return (
      <a href={href} aria-label={label} onClick={onClick} className={className}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {children}
    </button>
  )
}

const platformLinks = [
  { label: 'Distribution', desc: 'Release to every major DSP', href: '#release' },
  { label: 'Marketplace', desc: 'Buy and sell beats & licenses', href: '/marketplace' },
  { label: 'Royalties', desc: 'Splits, statements, and reporting', href: '#royalties' },
  { label: 'Analytics', desc: 'Catalog and audience insight', href: '#grow' },
  { label: 'Payments', desc: 'Balances, payouts, and transfers', href: '#financial' },
  { label: 'Rights', desc: 'Masters, compositions, collaborators', href: '#rights' },
]

const resourceLinks = [
  { label: 'Help Center', desc: 'Answers from the Soniq team', href: '#' },
  { label: 'Blog', desc: 'Notes on the business of music', href: '#' },
  { label: 'Guides', desc: 'Playbooks for artists & labels', href: '#' },
  { label: 'API', desc: 'Build on the Soniq platform', href: '#' },
  { label: 'Documentation', desc: 'Integration & release docs', href: '#' },
]

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group relative rounded-full px-3.5 py-2 text-sm text-black transition-colors hover:text-rose-600"
    >
      {children}
      <span className="absolute inset-x-3.5 bottom-1.5 h-[1.5px] origin-left scale-x-0 bg-linear-to-r from-rose-600 via-rose-500 to-rose-400 transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  )
}

function NavDropdown({
  label,
  items,
}: {
  label: string
  items: { label: string; desc: string; href: string }[]
}) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const closeTimer = useRef<number | null>(null)

  const openMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpen(true)
  }

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 90)
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          scheduleClose()
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className="group relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm text-black transition-colors hover:text-rose-600"
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: EASE }}
          className="flex"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
        <span
          className={cn(
            'absolute inset-x-3.5 bottom-1.5 h-[1.5px] origin-left bg-linear-to-r from-rose-600 via-rose-500 to-rose-400 transition-transform duration-300',
            open ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={
              reduceMotion
                ? { opacity: 0, x: '-50%' }
                : { opacity: 0, y: 10, scale: 0.96, x: '-50%' }
            }
            animate={
              reduceMotion ? { opacity: 1, x: '-50%' } : { opacity: 1, y: 0, scale: 1, x: '-50%' }
            }
            exit={
              reduceMotion
                ? { opacity: 0, x: '-50%' }
                : { opacity: 0, y: 6, scale: 0.98, x: '-50%' }
            }
            transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: EASE }}
            style={{ transformOrigin: 'top center' }}
            className="absolute left-1/2 top-full z-40 w-120 pt-3"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.035,
                    delayChildren: reduceMotion ? 0 : 0.06,
                  },
                },
              }}
              className="grid grid-cols-2 gap-1 rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
            >
              {items.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.32, ease: EASE },
                    },
                  }}
                  whileHover={reduceMotion ? undefined : { y: -1 }}
                  className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-rose-50/70"
                >
                  <span className="text-[13.5px] font-medium text-black">{item.label}</span>
                  <span className="text-[12px] text-black/45">{item.desc}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AccountAvatarMenu({
  onNavigate,
  align = 'end',
}: {
  onNavigate?: () => void
  align?: 'start' | 'end'
}) {
  const { user, profiles, activeProfile, accessToken, logout } = useAuth()
  const [activeId, setActiveId] = useState<string | null>(null)
  if (!user) return <div />

  const displayName = activeProfile?.displayName || user.name || 'Account'
  const handle = activeProfile?.username ? `@${activeProfile.username}` : user.email
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
  const avatarUrl = activeProfile?.avatar?.trim() || ''
  const showStudio = profiles.some(
    (profile) =>
      profile.type === 'producer' || profile.type === 'label' || profile.type === 'artist',
  )

  function go(href: string) {
    onNavigate?.()
    window.location.href = href
  }

  async function onLogout() {
    onNavigate?.()
    await logout()
    window.location.href = '/login'
  }

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) setActiveId(null)
      }}
    >
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-rose-600 text-[12px] font-semibold text-white outline-none ring-offset-2 transition hover:bg-rose-500 focus-visible:ring-2 focus-visible:ring-rose-500/40 data-popup-open:ring-2 data-popup-open:ring-rose-500/30"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <span>{initials || <User className="size-4" />}</span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={10}
        onMouseLeave={() => setActiveId(null)}
        className="min-w-64 rounded-2xl border border-black/8 bg-white p-1.5 text-black ring-0 shadow-[0_18px_12px_-24px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center gap-3 px-2.5 py-2.5">
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-rose-600 text-[12px] font-semibold text-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              initials || <User className="size-4" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-medium text-black">{displayName}</span>
            <span className="block truncate text-[12px] text-black/45">{handle}</span>
          </span>
        </div>

        <DropdownMenuSeparator className="mx-1 bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuLabel className={menuLabelClass}>Library</DropdownMenuLabel>
          <AccountMenuItem
            id="orders"
            label="Orders"
            icon={Receipt}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go('/orders')}
          />
          <AccountMenuItem
            id="downloads"
            label="Downloads"
            icon={Download}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go('/downloads')}
          />
          <AccountMenuItem
            id="favorites"
            label="Favorites"
            icon={Heart}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go('/favorites')}
          />
          <AccountMenuItem
            id="wishlist"
            label="Wishlist"
            icon={Bookmark}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go('/wishlist')}
          />
          <AccountMenuItem
            id="playlists"
            label="Playlists"
            icon={ListMusic}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go('/playlists')}
          />
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-1 bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuLabel className={menuLabelClass}>Social</DropdownMenuLabel>
          <AccountMenuItem
            id="following"
            label="Following"
            icon={Users}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go('/following')}
          />
          <AccountMenuItem
            id="messages"
            label="Messages"
            icon={MessageCircle}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go('/messages')}
          />
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-1 bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuLabel className={menuLabelClass}>Account</DropdownMenuLabel>
          <AccountMenuItem
            id="profile"
            label="Profile"
            icon={UserRound}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go(dashboardPath('/account', accessToken))}
          />
          <AccountMenuItem
            id="settings"
            label="Settings"
            icon={Settings}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go(dashboardPath('/settings', accessToken))}
          />
          <AccountMenuItem
            id="billing"
            label="Billing"
            icon={CreditCard}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => go(dashboardPath('/billing', accessToken))}
          />
        </DropdownMenuGroup>

        {showStudio ? (
          <>
            <DropdownMenuSeparator className="mx-1 bg-muted" />
            <DropdownMenuGroup>
              <DropdownMenuLabel className={menuLabelClass}>Studio</DropdownMenuLabel>
              <AccountMenuItem
                id="dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
                activeId={activeId}
                onActive={setActiveId}
                onClick={() => go(dashboardHref(accessToken))}
              />
            </DropdownMenuGroup>
          </>
        ) : null}

        <DropdownMenuSeparator className="mx-1 bg-muted" />

        <DropdownMenuGroup>
          <AccountMenuItem
            id="logout"
            label="Log out"
            icon={LogOut}
            activeId={activeId}
            onActive={setActiveId}
            onClick={() => {
              void onLogout()
            }}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AuthenticatedNavActions({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <HeaderIconButton label="Cart" href="/cart" onClick={onNavigate}>
        <ShoppingCart className="size-4.5" />
      </HeaderIconButton>
      <HeaderIconButton label="Notifications" href="/notifications" onClick={onNavigate}>
        <Bell className="size-4.5" />
      </HeaderIconButton>
      <span aria-hidden className="mx-1.5 h-5 w-[1.2px] shrink-0 bg-black/10" />
      <AccountAvatarMenu onNavigate={onNavigate} />
    </div>
  )
}

export function Navbar() {
  const { status } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const showAuthActions = status === 'anonymous'
  const showAccount = status === 'authenticated'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-black/6 bg-white/80 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <Container className="flex h-17 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="text-[22px] font-semibold tracking-[-0.02em] text-black">
            Sound<span className="text-rose-600">Soniq</span>
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 lg:flex">
          <NavDropdown label="Solutions" items={platformLinks} />
          <NavLink href="#artists">For Artists</NavLink>
          <NavLink href="#producers">For Producers</NavLink>
          <NavLink href="#labels">For Labels</NavLink>
          <NavDropdown label="Resources" items={resourceLinks} />
        </nav>

        {showAuthActions ? (
          <div className="hidden items-center gap-2 lg:flex">
            <MarketingButton variant="ghost" size="sm" href="/login">
              Log in
            </MarketingButton>
            <MarketingButton variant="primary" size="sm" href="/signup" magnetic>
              Get started
            </MarketingButton>
          </div>
        ) : showAccount ? (
          <div className="hidden lg:block">
            <AuthenticatedNavActions />
          </div>
        ) : (
          <div className="hidden lg:block" />
        )}

        <div className="flex items-center gap-1 lg:hidden">
          {showAccount ? (
            <>
              <HeaderIconButton label="Cart" href="/cart" onClick={() => setMobileOpen(false)}>
                <ShoppingCart className="size-4.5" />
              </HeaderIconButton>
              <HeaderIconButton
                label="Notifications"
                href="/notifications"
                onClick={() => setMobileOpen(false)}
              >
                <Bell className="size-4.5" />
              </HeaderIconButton>
            </>
          ) : null}
          <button
            type="button"
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-black lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <div
        className={cn(
          'fixed inset-x-0 top-17 z-40 origin-top border-t border-line-dark bg-ink-dark transition-all duration-200 lg:hidden',
          mobileOpen
            ? 'max-h-[calc(100vh-68px)] opacity-100'
            : 'pointer-events-none max-h-0 opacity-0',
        )}
        style={{ overflow: 'auto' }}
      >
        <Container className="flex flex-col gap-1 py-5">
          {[
            { label: 'Platform', href: '#platform' },
            { label: 'For Artists', href: '#artists' },
            { label: 'For Producers', href: '#producers' },
            { label: 'For Labels', href: '#labels' },
            { label: 'Resources', href: '#resources' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-3 text-[15px] font-medium text-white/70 hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
          {showAuthActions ? (
            <div className="mt-3 flex flex-col gap-2 border-t border-line-dark pt-4">
              <MarketingButton variant="secondary" href="/login" className="w-full">
                Log in
              </MarketingButton>
              <MarketingButton variant="primary" href="/signup" className="w-full">
                Get started
              </MarketingButton>
            </div>
          ) : showAccount ? (
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-line-dark pt-4">
              <p className="text-[13px] font-medium text-white/70">Your account</p>
              <AccountAvatarMenu align="end" onNavigate={() => setMobileOpen(false)} />
            </div>
          ) : null}
        </Container>
      </div>
    </header>
  )
}