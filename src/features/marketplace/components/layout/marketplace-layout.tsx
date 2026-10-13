import { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { Outlet } from 'react-router-dom'
import { CartProvider } from '@/features/marketplace/cart/cart-provider'
import { BrandMark } from '@/features/marketplace/components/layout/brand-mark'
import { ContentHeader } from '@/features/marketplace/components/layout/content-header'
import { MobileBottomBar } from '@/features/marketplace/components/layout/mobile-bottom-bar'
import { MobileSidePanel } from '@/features/marketplace/components/layout/mobile-side-panel'
import { SellCard } from '@/features/marketplace/components/layout/sell-card'
import { SideLinks } from '@/features/marketplace/components/layout/side-nav'
import { useSidebarCollapsed } from '@/features/marketplace/components/layout/use-sidebar-collapsed'
import { cn } from '@/lib/utils'

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
            collapsed ? 'lg:w-19' : 'lg:w-60',
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
          <SideLinks collapsed={collapsed} layoutId="marketplace-sidebar-active" className="pt-8" />
          <div className="mt-auto">
            <SellCard collapsed={collapsed} />
          </div>
        </aside>

        <div className="relative z-10 min-w-0 flex-1 lg:py-4 lg:pr-4 lg:pl-0">
          <main className="flex h-svh flex-col overflow-hidden lg:h-[calc(100svh-2rem)] lg:rounded-[1.75rem] lg:bg-white/8 lg:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] lg:backdrop-blur-2xl">
            <ContentHeader />
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <Outlet />
            </div>
            <MobileBottomBar moreOpen={mobileOpen} onMore={() => setMobileOpen((open) => !open)} />
          </main>
        </div>

        <MobileSidePanel open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </CartProvider>
  )
}