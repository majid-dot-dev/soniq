import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import type { Icon } from '@phosphor-icons/react'
import {
  CaretLeftIcon,
  CaretRightIcon,
  ChartLineUpIcon,
  CompassIcon,
  CreditCardIcon,
  DotsThreeOutlineIcon,
  GearIcon,
  HeartIcon,
  LayoutIcon,
  MagnifyingGlassIcon,
  MicrophoneStageIcon,
  MusicNotesIcon,
  PackageIcon,
  ShoppingBagOpenIcon,
  SignOutIcon,
  SmileyIcon,
  SparkleIcon,
  UserIcon,
  UsersIcon,
  WaveformIcon,
  XIcon,
} from '@phosphor-icons/react'
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/auth-provider'
import { NotificationsMenu } from '@/features/dashboard/components/notifications-menu'
import { CartProvider, useCart } from '@/features/marketplace/cart/cart-provider'
import { CartDropdown } from '@/features/marketplace/components/cart-dropdown'
import { dashboardHref, loginHref } from '@/lib/host'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const SIDEBAR_COLLAPSED_KEY = 'soniq.marketplace.sidebarCollapsed'

function studioFlow(path: string, accessToken?: string | null) {
  const url = new URL(dashboardHref(accessToken))
  url.pathname = path
  return url.toString()
}

function BrandMark({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <Link
      to="/marketplace"
      className={cn(
        'font-semibold tracking-[-0.02em] text-white',
        compact ? 'text-[18px]' : 'text-[20px] sm:text-[22px]',
        className,
      )}
      title="SoundSoniq"
    >
      {compact ? (
        <>
          S<span className="text-rose-500">S</span>
        </>
      ) : (
        <>
          Sound<span className="text-rose-500">Soniq</span>
        </>
      )}
    </Link>
  )
}

function SearchForm({
  className,
  autoFocus,
  inputRef,
  onDone,
  onCancel,
}: {
  className?: string
  autoFocus?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  onDone?: () => void
  onCancel?: () => void
}) {
  const navigate = useNavigate()

  return (
    <form
      className={cn(
        'flex min-w-0 items-center gap-2 rounded-full bg-white/8 px-3.5 py-2',
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const q = String(data.get('q') ?? '').trim()
        navigate(q ? `/marketplace?q=${encodeURIComponent(q)}` : '/marketplace')
        onDone?.()
      }}
    >
      <MagnifyingGlassIcon size={16} className="shrink-0 text-ink-mute" />
      <input
        ref={inputRef}
        name="q"
        type="search"
        autoFocus={autoFocus}
        placeholder="Search beats, producers, tags"
        className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-ink-mute"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onCancel?.()
        }}
      />
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close search"
          className="grid size-6 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/10 hover:text-white"
        >
          <XIcon size={14} />
        </button>
      ) : null}
    </form>
  )
}

function SellCard({ collapsed }: { collapsed?: boolean }) {
  const { status, accessToken } = useAuth()
  const href = status === 'authenticated' ? dashboardHref(accessToken) : '/signup'

  if (collapsed) {
    const className =
      'mx-auto mb-3 grid size-10 place-items-center rounded-xl bg-[radial-gradient(130%_120%_at_0%_0%,#fb7185_0%,#e11d48_34%,#9f1239_62%,#3f0a16_84%,#14060a_100%)] text-[13px] font-bold text-white transition-transform hover:scale-105'
    return status === 'authenticated' ? (
      <a href={href} aria-label="Open studio" title="Sell on Soniq" className={className}>
        S
      </a>
    ) : (
      <Link to="/signup" aria-label="Get started selling" title="Sell on Soniq" className={className}>
        S
      </Link>
    )
  }

  return (
    <div className="mx-3 mb-4 rounded-[1.35rem] bg-[radial-gradient(130%_120%_at_0%_0%,#fb7185_0%,#e11d48_34%,#9f1239_62%,#3f0a16_84%,#14060a_100%)] px-4 pt-4 pb-3.5">
      <p className="text-[15px] font-bold tracking-[-0.02em] text-white">Sell on Soniq</p>
      <p className="mt-1.5 text-[12.5px] leading-snug font-medium text-white/90">
        Upload beats, set licenses, and get paid.
      </p>
      {status === 'authenticated' ? (
        <a
          href={href}
          className="mt-4 inline-flex rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-rose-600"
        >
          Open studio
        </a>
      ) : (
        <Link
          to="/signup"
          className="mt-4 inline-flex rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-rose-600"
        >
          Get started
        </Link>
      )}
    </div>
  )
}

function AccountMenu({ compact }: { compact?: boolean }) {
  const { status, logout, accessToken } = useAuth()
  const authenticated = status === 'authenticated'

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
    <>
      {!compact ? (
        <a
          href={studioFlow('/settings', accessToken)}
          aria-label="Settings"
          className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-white/8 hover:text-white"
        >
          <GearIcon size={18} />
        </a>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Account"
          className="grid size-9 place-items-center rounded-full bg-white/10 text-white outline-none transition-colors hover:bg-white/15 data-popup-open:bg-white/15"
        >
          <UserIcon size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="rounded-xl bg-[#1a1714] p-1.5 text-ink ring-white/15"
          style={{ width: '11rem', minWidth: '11rem' }}
        >
          <DropdownMenuItem
            render={<a href={dashboardHref(accessToken)} />}
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
          >
            <LayoutIcon size={16} />
            Studio
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<a href={studioFlow('/account', accessToken)} />}
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
          >
            <UserIcon size={16} />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<a href={studioFlow('/billing', accessToken)} />}
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
          >
            <CreditCardIcon size={16} />
            Billing
          </DropdownMenuItem>
          {compact ? (
            <DropdownMenuItem
              render={<a href={studioFlow('/settings', accessToken)} />}
              className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
            >
              <GearIcon size={16} />
              Settings
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={() => {
              void onLogout()
            }}
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
          >
            <SignOutIcon size={16} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

function HeaderActions({
  compact,
  hideCart,
}: {
  compact?: boolean
  hideCart?: boolean
}) {
  const { status } = useAuth()
  const authenticated = status === 'authenticated'

  return (
    <div className="flex items-center gap-0.5 sm:gap-1.5">
      {hideCart ? null : <CartDropdown />}
      {authenticated ? <NotificationsMenu /> : null}
      <AccountMenu compact={compact} />
    </div>
  )
}

function ContentHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!searchOpen) return
    const id = window.requestAnimationFrame(() => searchInputRef.current?.focus())
    return () => window.cancelAnimationFrame(id)
  }, [searchOpen])

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-4 sm:py-4">
      {/* Mobile — logo + search + account; primary nav lives in the bottom bar */}
      <div className="flex w-full items-center gap-1.5 lg:hidden">
        <AnimatePresence mode="wait" initial={false}>
          {searchOpen ? (
            <motion.div
              key="search"
              className="flex min-w-0 flex-1 items-center"
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 4 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
            >
              <SearchForm
                className="w-full"
                inputRef={searchInputRef}
                onDone={() => setSearchOpen(false)}
                onCancel={() => setSearchOpen(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chrome"
              className="flex min-w-0 flex-1 items-center justify-between gap-2"
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
            >
              <BrandMark className="min-w-0 truncate" />
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-white/8 hover:text-white"
                >
                  <MagnifyingGlassIcon size={18} />
                </button>
                <HeaderActions compact hideCart />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop */}
      <div className="hidden min-w-0 flex-1 items-center justify-between gap-3 lg:flex">
        <SearchForm className="max-w-md flex-1" />
        <HeaderActions />
      </div>
    </header>
  )
}

type NavItem = { to: string; label: string; icon: Icon; end?: boolean }
type NavSection = { label: string; items: NavItem[] }

const sections: NavSection[] = [
  {
    label: 'Discover',
    items: [
      { to: '/marketplace/explore', label: 'Explore', icon: CompassIcon },
      { to: '/marketplace/charts', label: 'Top charts', icon: ChartLineUpIcon },
      { to: '/marketplace', label: 'Made for you', icon: SparkleIcon, end: true },
      { to: '/marketplace/tracks', label: 'All Tracks', icon: WaveformIcon },
    ],
  },
  {
    label: 'Browse',
    items: [
      { to: '/marketplace/type-beats', label: 'Type Beats', icon: MicrophoneStageIcon },
      { to: '/marketplace/genres', label: 'Genres', icon: MusicNotesIcon },
      { to: '/marketplace/moods', label: 'Moods', icon: SmileyIcon },
      { to: '/marketplace/creators', label: 'Creators', icon: UsersIcon },
    ],
  },
  {
    label: 'Library',
    items: [
      { to: '/marketplace/favorites', label: 'Favorites', icon: HeartIcon },
      { to: '/marketplace/packs', label: 'All packs', icon: PackageIcon },
    ],
  },
]

/** Secondary destinations shown in the mobile “More” sheet (primary tabs cover the rest). */
const moreSections: NavSection[] = [
  {
    label: 'Discover',
    items: [
      { to: '/marketplace/charts', label: 'Top charts', icon: ChartLineUpIcon },
      { to: '/marketplace', label: 'Made for you', icon: SparkleIcon, end: true },
    ],
  },
  {
    label: 'Browse',
    items: [
      { to: '/marketplace/type-beats', label: 'Type Beats', icon: MicrophoneStageIcon },
      { to: '/marketplace/genres', label: 'Genres', icon: MusicNotesIcon },
      { to: '/marketplace/moods', label: 'Moods', icon: SmileyIcon },
      { to: '/marketplace/creators', label: 'Creators', icon: UsersIcon },
    ],
  },
  {
    label: 'Library',
    items: [{ to: '/marketplace/packs', label: 'All packs', icon: PackageIcon }],
  },
]

const MORE_ROUTE_MATCHERS = [
  '/marketplace/charts',
  '/marketplace/type-beats',
  '/marketplace/genres',
  '/marketplace/moods',
  '/marketplace/creators',
  '/marketplace/packs',
  '/marketplace/producers',
] as const

function isMoreRoute(pathname: string) {
  if (pathname === '/marketplace' || pathname === '/marketplace/') return true
  return MORE_ROUTE_MATCHERS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

function SideLink({
  to,
  end,
  label,
  icon: Icon,
  collapsed,
  layoutId,
  onNavigate,
}: {
  to: string
  end?: boolean
  label: string
  icon: Icon
  collapsed?: boolean
  layoutId?: string
  onNavigate?: () => void
}) {
  const reduce = useReducedMotion()

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex w-full shrink-0 items-center rounded-xl text-[14px] font-medium transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isActive ? 'text-white' : 'text-ink-2 hover:text-white',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId={reduce || !layoutId ? undefined : layoutId}
              className="pointer-events-none absolute inset-0 rounded-xl bg-white/8"
              transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            />
          ) : (
            <span
              className={cn(
                'pointer-events-none absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                !reduce && 'group-hover:opacity-100',
              )}
            />
          )}
          <span
            className={cn(
              'relative flex w-full items-center gap-2.5 py-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
              collapsed ? 'justify-center px-2' : 'px-3',
              !reduce && !isActive && !collapsed && 'group-hover:translate-x-1',
            )}
          >
            <Icon
              size={18}
              className={cn(
                'shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                !reduce && 'group-hover:scale-110',
              )}
            />
            <span className={cn(collapsed && 'sr-only')}>{label}</span>
          </span>
        </>
      )}
    </NavLink>
  )
}

function SideLinks({
  collapsed,
  layoutId,
  onNavigate,
  className,
  navSections = sections,
}: {
  collapsed?: boolean
  layoutId?: string
  onNavigate?: () => void
  className?: string
  navSections?: NavSection[]
}) {
  return (
    <nav
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto py-3',
        collapsed ? 'px-2' : 'px-3',
        className,
      )}
    >
      {navSections.map((section, index) => (
        <div key={section.label} className={cn('flex flex-col gap-1', index > 0 && 'mt-4')}>
          <p
            className={cn(
              'px-3 pb-1 text-[11px] font-medium text-ink-faint',
              collapsed && 'hidden',
            )}
          >
            {section.label}
          </p>
          {section.items.map((item) => (
            <SideLink
              key={item.to}
              {...item}
              collapsed={collapsed}
              layoutId={layoutId}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  )
}

function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      // ignore quota / private mode
    }
  }, [collapsed])

  return [collapsed, setCollapsed] as const
}

function MobileSidePanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
            onClick={onClose}
          />
          <motion.aside
            id="marketplace-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[min(88svh,42rem)] w-full flex-col rounded-t-[1.75rem] border-t border-white/12 bg-[#121110] shadow-[0_-24px_60px_rgba(0,0,0,0.5)]"
            initial={reduce ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: '100%' }}
            transition={{ duration: reduce ? 0 : 0.34, ease: EASE }}
          >
            <div className="flex shrink-0 flex-col items-center pt-2.5">
              <span className="h-1 w-10 rounded-full bg-white/20" aria-hidden />
              <div className="flex w-full items-center justify-between gap-3 px-4 pt-3 pb-2">
                <p id={titleId} className="text-[15px] font-semibold text-white">
                  More
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-white/8 hover:text-white"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <SideLinks
                navSections={moreSections}
                layoutId="marketplace-mobile-sidebar-active"
                onNavigate={onClose}
              />
              <div className="mt-auto border-t border-white/8 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <SellCard />
              </div>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

function MobileBottomBar({
  moreOpen,
  onMore,
}: {
  moreOpen: boolean
  onMore: () => void
}) {
  const { pathname } = useLocation()
  const { itemCount } = useCart()
  const moreActive = moreOpen || isMoreRoute(pathname)

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition-colors',
      isActive ? 'text-white' : 'text-ink-mute hover:text-ink-2',
    )

  return (
    <nav
      aria-label="Primary"
      className="shrink-0 border-t border-white/10 bg-black/35 px-1.5 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
    >
      <div className="flex items-stretch gap-0.5">
        <NavLink to="/marketplace/explore" className={tabClass}>
          {({ isActive }) => (
            <>
              <CompassIcon size={22} weight={isActive ? 'fill' : 'regular'} />
              <span>Explore</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/marketplace/tracks"
          className={({ isActive }) =>
            tabClass({
              isActive: isActive || pathname.startsWith('/marketplace/tracks/'),
            })
          }
        >
          {({ isActive }) => {
            const active = isActive || pathname.startsWith('/marketplace/tracks/')
            return (
              <>
                <WaveformIcon size={22} weight={active ? 'fill' : 'regular'} />
                <span>Tracks</span>
              </>
            )
          }}
        </NavLink>

        <NavLink to="/marketplace/favorites" className={tabClass}>
          {({ isActive }) => (
            <>
              <HeartIcon size={22} weight={isActive ? 'fill' : 'regular'} />
              <span>Favorites</span>
            </>
          )}
        </NavLink>

        <NavLink to="/marketplace/checkout" className={tabClass}>
          {({ isActive }) => (
            <>
              <span className="relative">
                <ShoppingBagOpenIcon size={22} weight={isActive ? 'fill' : 'regular'} />
                {itemCount > 0 ? (
                  <span className="tnum absolute -top-1 -right-2 grid min-w-3.5 place-items-center rounded-full bg-rose-500 px-0.5 text-[9px] font-semibold leading-3.5 text-white">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                ) : null}
              </span>
              <span>Cart</span>
            </>
          )}
        </NavLink>

        <button
          type="button"
          onClick={onMore}
          aria-label="More"
          aria-expanded={moreOpen}
          aria-controls="marketplace-mobile-menu"
          className={tabClass({ isActive: moreActive })}
        >
          <DotsThreeOutlineIcon size={22} weight={moreActive ? 'fill' : 'regular'} />
          <span>More</span>
        </button>
      </div>
    </nav>
  )
}

export function MarketplaceLayout() {
  const [collapsed, setCollapsed] = useSidebarCollapsed()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <CartProvider>
      <div className="relative min-h-svh overflow-hidden bg-black text-ink lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#000_0%,#070707_42%,#101012_100%)]" />
        <div className="pointer-events-none absolute -top-24 -left-16 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(226,85,31,0.22),transparent_68%)] blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-120 w-120 rounded-full bg-[radial-gradient(circle,rgba(90,60,160,0.2),transparent_70%)] blur-3xl" />

        <aside
          className={cn(
            'relative z-10 hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:shrink-0 lg:flex-col lg:transition-[width] lg:duration-300 lg:ease-[cubic-bezier(0.16,1,0.3,1)]',
            collapsed ? 'lg:w-[4.75rem]' : 'lg:w-60',
          )}
        >
          <div
            className={cn(
              'flex items-center pt-6',
              collapsed ? 'flex-col gap-2 px-2' : 'justify-between gap-2 px-4',
            )}
          >
            <div className={cn(!collapsed && 'px-2')}>
              <BrandMark compact={collapsed} />
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
              aria-expanded={!collapsed}
              title={collapsed ? 'Expand sidebar' : 'Minimize sidebar'}
              className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-white/8 hover:text-white"
            >
              {collapsed ? (
                <CaretRightIcon size={16} weight="bold" />
              ) : (
                <CaretLeftIcon size={16} weight="bold" />
              )}
            </button>
          </div>
          <SideLinks
            collapsed={collapsed}
            layoutId="marketplace-sidebar-active"
            className="pt-8"
          />
          <div className="mt-auto">
            <SellCard collapsed={collapsed} />
          </div>
        </aside>

        <div className="relative z-10 min-w-0 flex-1 p-3 sm:p-4 lg:py-4 lg:pr-4 lg:pl-0">
          <main className="flex h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[1.75rem] border-none bg-white/8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] backdrop-blur-2xl sm:h-[calc(100svh-2rem)]">
            <ContentHeader />
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <Outlet />
            </div>
            <MobileBottomBar
              moreOpen={mobileOpen}
              onMore={() => setMobileOpen((open) => !open)}
            />
          </main>
        </div>

        <MobileSidePanel open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </CartProvider>
  )
}
