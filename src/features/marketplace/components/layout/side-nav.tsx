import type { Icon } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  EASE,
  sections,
  type NavSection,
} from '@/features/marketplace/components/layout/constants'
import { cn } from '@/lib/utils'

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

export function SideLinks({
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
