import type { Icon } from '@phosphor-icons/react'
import {
  CaretUpDown,
  ChartLine,
  Chats,
  Check,
  CreditCard,
  FileText,
  Gear,
  House,
  MagnifyingGlass,
  MusicNotes,
  Package,
  Percent,
  Plus,
  Receipt,
  Scroll,
  SignOut,
  Storefront,
  Tag,
  User,
  Users,
  Wallet,
  Waveform,
} from '@phosphor-icons/react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorkspace, WorkspaceProvider, type WorkspaceType } from '@/features/dashboard/workspace'
import { useAuth } from '@/features/auth/auth-provider'
import { NotificationsMenu } from '@/features/dashboard/components/notifications-menu'
import { loginHref } from '@/lib/host'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const linkVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
}

function WorkspaceSwitcher() {
  const { current, workspaces, setCurrentId } = useWorkspace()
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mx-3 mb-3 flex w-[calc(100%-1.5rem)] items-center gap-2.5 rounded-xl px-2.5 py-2 text-left outline-none transition-colors hover:bg-white/8 data-popup-open:bg-white/8">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-[11px] font-semibold text-white">
          {current.name.slice(0, 2).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-white">{current.name}</span>
          <span className="block text-[12px] text-ink-mute">{current.type}</span>
        </span>
        <CaretUpDown size={14} className="shrink-0 text-ink-mute" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={6}
        className="rounded-xl bg-[rgba(16,16,18,0.92)] p-1.5 text-ink ring-white/15 backdrop-blur-2xl"
      >
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => {
              setCurrentId(workspace.id)
              navigate('/')
            }}
            className="cursor-pointer gap-2.5 rounded-lg px-2 py-2 focus:bg-white/8"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-[11px] font-semibold text-white">
              {workspace.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-medium text-white">
                {workspace.name}
              </span>
              <span className="block text-[12px] text-ink-mute">{workspace.type}</span>
            </span>
            {workspace.id === current.id ? (
              <Check size={14} className="shrink-0 text-white" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="cursor-pointer gap-2.5 rounded-lg px-2 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white">
          <Plus size={16} />
          Add profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UpgradeCard() {
  return (
    <div className="mx-3 mb-4 rounded-[1.35rem] bg-[radial-gradient(130%_120%_at_0%_0%,#fb7185_0%,#e11d48_34%,#9f1239_62%,#3f0a16_84%,#14060a_100%)] px-4 pt-4 pb-3.5">
      <p className="text-[15px] font-bold tracking-[-0.02em] text-white">Go Pro</p>
      <p className="mt-1.5 text-[12.5px] leading-snug text-white/90 font-medium">
        Unlock new features, a store, and payouts.
      </p>
      <button
        type="button"
        className="mt-4 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-rose-600"
      >
        Upgrade
      </button>
    </div>
  )
}
function ContentHeader() {
  const { logout } = useAuth()

  async function onLogout() {
    await logout()
    window.location.href = loginHref()
  }

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
      <form
        className="flex min-w-0 max-w-md flex-1 items-center gap-2 rounded-full bg-white/8 px-3.5 py-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <MagnifyingGlass size={16} className="shrink-0 text-ink-mute" />
        <input
          type="search"
          placeholder="Search"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-ink-mute"
        />
      </form>
      <div className="flex items-center gap-1.5">
        <NotificationsMenu />
        <NavLink
          to="/settings"
          aria-label="Settings"
          className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-white/8 hover:text-white"
        >
          <Gear size={18} />
        </NavLink>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account"
            className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors outline-none hover:bg-white/15 data-popup-open:bg-white/15"
          >
            <User size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="rounded-xl bg-[#1a1714] p-1.5 text-ink ring-white/15"
            style={{ width: '11rem', minWidth: '11rem' }}
          >
            <DropdownMenuItem
              render={<Link to="/account" />}
              className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
            >
              <User size={16} />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link to="/billing" />}
              className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
            >
              <CreditCard size={16} />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => {
                void onLogout()
              }}
              className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[14px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
            >
              <SignOut size={16} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

type NavItem = { to: string; label: string; icon: Icon }
type NavSection = { label?: string; items: NavItem[] }

const sections: Record<WorkspaceType, NavSection[]> = {
  Artist: [
    {
      items: [
        { to: '/music', label: 'Music', icon: MusicNotes },
        { to: '/splits', label: 'Splits', icon: Percent },
        { to: '/insights', label: 'Insights', icon: ChartLine },
        { to: '/wallet', label: 'Wallet', icon: Wallet },
      ],
    },
  ],
  Producer: [
    {
      label: 'Catalog',
      items: [
        { to: '/tracks', label: 'Tracks', icon: Waveform },
        { to: '/sound-kits', label: 'Sound kits', icon: Package },
      ],
    },
    {
      label: 'Selling',
      items: [
        { to: '/licenses', label: 'Licenses', icon: Scroll },
        { to: '/sales', label: 'Sales', icon: Receipt },
        { to: '/discounts', label: 'Discounts', icon: Tag },
        { to: '/store', label: 'Store', icon: Storefront },
      ],
    },
    {
      items: [
        { to: '/stats', label: 'Stats', icon: ChartLine },
        { to: '/wallet', label: 'Wallet', icon: Wallet },
      ],
    },
  ],
  Label: [
    {
      label: 'Catalog',
      items: [
        { to: '/releases', label: 'Releases', icon: MusicNotes },
        { to: '/artists', label: 'Artists', icon: Users },
      ],
    },
    {
      label: 'Royalties',
      items: [
        { to: '/statements', label: 'Statements', icon: FileText },
        { to: '/splits', label: 'Splits', icon: Percent },
        { to: '/payees', label: 'Payees', icon: Users },
      ],
    },
    { items: [{ to: '/analytics', label: 'Analytics', icon: ChartLine }] },
  ],
}

function SideLink({
  to,
  end,
  label,
  icon: Icon,
  onNavigate,
}: {
  to: string
  end?: boolean
  label: string
  icon: Icon
  onNavigate?: () => void
}) {
  const reduce = useReducedMotion()

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex shrink-0 items-center rounded-xl text-[14px] font-medium transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:w-full',
          isActive ? 'text-white' : 'text-ink-2 hover:text-white',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId={reduce ? undefined : 'sidebar-active'}
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
              'relative flex w-full items-center gap-2.5 px-3 py-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
              !reduce && !isActive && 'group-hover:translate-x-1',
            )}
          >
            <Icon
              size={18}
              className={cn(
                'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                !reduce && 'group-hover:scale-110',
              )}
            />
            <span>{label}</span>
          </span>
        </>
      )}
    </NavLink>
  )
}

function SideLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { current } = useWorkspace()
  const reduce = useReducedMotion()

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-3 lg:pt-8 lg:pb-2">
      <SideLink to="/" end label="Dashboard" icon={House} onNavigate={onNavigate} />
      <SideLink to="/chats" label="Chats" icon={Chats} onNavigate={onNavigate} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.type}
          className="flex gap-1 lg:flex-col"
          variants={
            reduce
              ? undefined
              : { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } } }
          }
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.12, ease: EASE } }}
        >
          {sections[current.type].map((section, index) => (
            <div
              key={section.label ?? `links-${index}`}
              className={cn(
                'flex gap-1 lg:flex-col',
                section.label ? 'lg:mt-4' : index > 0 && 'lg:mt-2',
              )}
            >
              {section.label ? (
                <motion.p
                  variants={reduce ? undefined : linkVariants}
                  className="hidden px-3 pb-1 text-[11px] font-medium text-ink-faint lg:block"
                >
                  {section.label}
                </motion.p>
              ) : null}
              {section.items.map(({ to, label, icon }) => (
                <motion.div
                  key={to}
                  variants={reduce ? undefined : linkVariants}
                  className="flex shrink-0 lg:w-full"
                >
                  <SideLink to={to} label={label} icon={icon} onNavigate={onNavigate} />
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </nav>
  )
}

export function DashboardLayout() {
  return (
    <WorkspaceProvider>
      <DashboardShell />
    </WorkspaceProvider>
  )
}

function DashboardShell() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-black text-ink lg:flex">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#000_0%,#070707_42%,#101012_100%)]" />
      <div className="pointer-events-none absolute -top-24 -left-16 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(226,85,31,0.22),transparent_68%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-120 w-120 rounded-full bg-[radial-gradient(circle,rgba(90,60,160,0.2),transparent_70%)] blur-3xl" />

      <aside className="relative z-10 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-60 lg:shrink-0 lg:flex-col">
        <Link
          to="/"
          className="px-6 pt-5 text-[22px] font-semibold tracking-[-0.02em] text-white lg:pt-6"
        >
          Sound<span className="text-rose-500">Soniq</span>
        </Link>
        <SideLinks />
        <div className="mt-2 lg:mt-auto">
          <UpgradeCard />
          <WorkspaceSwitcher />
        </div>
      </aside>

      <div className="relative z-10 min-w-0 flex-1 p-3 sm:p-4 lg:py-4 lg:pr-4 lg:pl-0">
        <main className="flex h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[1.75rem] border-none bg-white/8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] backdrop-blur-2xl sm:h-[calc(100svh-2rem)]">
          <ContentHeader />
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}