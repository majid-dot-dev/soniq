import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBagOpenIcon, TrashIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCart } from '@/features/marketplace/cart/cart-provider'
import type { CartItem } from '@/features/marketplace/cart/types'
import { formatMoney } from '@/features/licenses/lib/format'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: EASE },
  },
}

const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE },
  },
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function MiniCartLine({
  item,
  reduce,
  onRemove,
}: {
  item: CartItem
  reduce: boolean | null
  onRemove: () => void
}) {
  return (
    <motion.li
      layout={reduce ? false : 'position'}
      variants={reduce ? undefined : listItem}
      exit={
        reduce
          ? undefined
          : {
              opacity: 0,
              y: -8,
              transition: { duration: 0.18, ease: EASE },
            }
      }
      className="flex gap-2.5 py-2.5"
    >
      <span
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-lg text-[11px] font-semibold text-white/80',
          item.cover,
        )}
      >
        {initials(item.title)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-white">{item.title}</p>
            <p className="mt-0.5 truncate text-[11px] text-ink-mute">
              {item.licenseName}
              <span className="text-ink-faint"> · </span>
              {item.producer}
            </p>
          </div>
          <p className="tnum shrink-0 text-[13px] font-semibold text-white">
            {formatMoney(item.priceCents)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="mt-1.5 inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-ink-mute transition-colors hover:text-rose-300"
        >
          <TrashIcon size={12} />
          Remove
        </button>
      </div>
    </motion.li>
  )
}

export function CartDropdown() {
  const reduce = useReducedMotion()
  const { items, itemCount, subtotalCents, totalCents, discountCents, removeItem } = useCart()
  const [open, setOpen] = useState(false)
  const springTap = { type: 'spring' as const, stiffness: 420, damping: 24 }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
        className="relative grid size-9 cursor-pointer place-items-center rounded-full text-ink-2 outline-none transition-colors hover:bg-white/8 hover:text-white data-popup-open:bg-white/8 data-popup-open:text-white"
      >
        <ShoppingBagOpenIcon size={18} />
        <AnimatePresence>
          {itemCount > 0 ? (
            <motion.span
              key={itemCount}
              initial={reduce ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
              className="tnum absolute top-0.5 right-0.5 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-4 text-white"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[min(calc(100vw-2rem),22rem)] gap-0 overflow-hidden rounded-2xl bg-[#161618] p-0 text-ink shadow-2xl ring-1 ring-white/12"
      >
        <motion.div
          variants={reduce ? undefined : listContainer}
          initial={reduce ? false : 'hidden'}
          animate={open ? 'show' : 'hidden'}
        >
          <motion.div
            variants={reduce ? undefined : fadeUp}
            className="border-b border-white/8 px-4 py-3"
          >
            <p className="text-[14px] font-semibold text-white">Cart ({itemCount})</p>
            {/* <p className="text-[11px] text-ink-mute">
              {itemCount === 0
                ? 'No items yet'
                : `${itemCount} license${itemCount === 1 ? '' : 's'}`}
            </p> */}
          </motion.div>

          {itemCount === 0 ? (
            <motion.div
              variants={reduce ? undefined : fadeUp}
              className="flex flex-col items-center px-4 py-8 text-center"
            >
              <motion.span
                initial={reduce ? false : { opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.06 }}
                className="grid size-11 place-items-center rounded-xl bg-white/6 text-ink-mute"
              >
                <ShoppingBagOpenIcon size={20} />
              </motion.span>
              <p className="mt-3 text-[13px] font-medium text-white">Your cart is empty</p>
              <p className="mt-1 text-[12px] text-ink-mute">
                Add a license from Explore to get started.
              </p>
              <Link
                to="/marketplace/explore"
                onClick={() => setOpen(false)}
                className="mt-4 text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
              >
                Browse Explore
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.ul
                variants={reduce ? undefined : listContainer}
                className="max-h-[min(50svh,280px)] divide-y divide-white/6 overflow-y-auto px-4"
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <MiniCartLine
                      key={item.id}
                      item={item}
                      reduce={reduce}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.ul>
              <motion.div
                variants={reduce ? undefined : fadeUp}
                className="border-t border-white/8 px-4 py-3.5"
              >
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-ink-mute">Subtotal</span>
                  <span className="tnum font-semibold text-white">
                    {formatMoney(subtotalCents)}
                  </span>
                </div>
                {discountCents > 0 ? (
                  <div className="mt-1.5 flex items-center justify-between text-[12px]">
                    <span className="text-ink-mute">Discount</span>
                    <span className="tnum text-emerald-400">−{formatMoney(discountCents)}</span>
                  </div>
                ) : null}
                <motion.div
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={springTap}
                  className="mt-3"
                >
                  <Link
                    to="/marketplace/checkout"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-full items-center justify-center rounded-full bg-white text-[13px] font-semibold text-black"
                  >
                    Checkout · {formatMoney(totalCents)}
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}