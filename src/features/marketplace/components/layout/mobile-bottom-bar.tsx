import {
  CompassIcon,
  DotsThreeOutlineIcon,
  HeartIcon,
  ShoppingBagOpenIcon,
  WaveformIcon,
} from '@phosphor-icons/react'
import { NavLink, useLocation } from 'react-router-dom'
import { useCart } from '@/features/marketplace/cart/cart-provider'
import { isMoreRoute } from '@/features/marketplace/components/layout/constants'
import { cn } from '@/lib/utils'

export function MobileBottomBar({
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
