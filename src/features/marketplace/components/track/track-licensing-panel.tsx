import { useMemo, useState } from 'react'
import { CheckIcon, ShoppingBagOpenIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  licenseInclusionRows,
  licensesForTrack,
} from '@/components/shared/license-modal'
import type { MarketplaceTrack } from '@/components/shared/marketplace-track-card'
import { useCart } from '@/features/marketplace/cart/cart-provider'
import { cartItemFromLicense } from '@/features/marketplace/cart/map-cart-item'
import { formatMoney } from '@/features/licenses/lib/format'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const springTap = { type: 'spring' as const, stiffness: 420, damping: 24 }

export default function TrackLicensingPanel({ track }: { track: MarketplaceTrack }) {
  const reduce = useReducedMotion()
  const { addItem } = useCart()
  const options = useMemo(() => licensesForTrack(track), [track])
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? '')
  const selected = options.find((row) => row.id === selectedId) ?? options[0]
  if (!selected) return null

  const terms = licenseInclusionRows(selected)
  const isFree = selected.kind === 'free' || selected.priceCents === 0

  function addToCart() {
    addItem(cartItemFromLicense(track, selected))
  }

  function buyNow() {
    if (isFree) {
      toast.success(`Downloading “${track.title}” (tagged MP3)`)
      return
    }
    toast.success(`Checkout for “${track.title}” (${selected.name}) coming soon`)
  }

  return (
    <section className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/8 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-[17px] font-medium tracking-[-0.02em] text-white">Licensing</h2>
        <div
          className={cn(
            'grid w-full gap-2 sm:w-auto',
            isFree ? 'grid-cols-1' : 'grid-cols-2',
          )}
        >
          {!isFree ? (
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={springTap}
              onClick={addToCart}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white/8 px-3 text-[12px] font-semibold text-white transition-colors hover:bg-white/12 sm:h-9"
            >
              <ShoppingBagOpenIcon size={15} />
              Add to cart
            </motion.button>
          ) : null}
          <motion.button
            type="button"
            whileHover={reduce ? undefined : { scale: 1.02 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={springTap}
            onClick={buyNow}
            className="inline-flex h-10 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white px-3 text-[12px] font-semibold text-black transition-opacity hover:opacity-90 sm:h-9"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isFree ? 'free' : selected.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="truncate"
              >
                {isFree ? 'Download free' : `Buy now · ${formatMoney(selected.priceCents)}`}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
        {options.map((license, index) => {
          const active = license.id === selected.id
          return (
            <motion.li
              key={license.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: EASE, delay: Math.min(index, 4) * 0.04 }}
            >
              <motion.button
                type="button"
                whileHover={reduce || active ? undefined : { y: -1 }}
                whileTap={reduce ? undefined : { scale: 0.985 }}
                transition={springTap}
                onClick={() => setSelectedId(license.id)}
                className={cn(
                  'relative flex h-full w-full cursor-pointer flex-col rounded-xl px-3.5 py-3 text-left transition-colors',
                  active ? 'bg-white/10 ring-1 ring-white/16' : 'bg-white/[0.03] hover:bg-white/[0.06]',
                )}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium text-white">{license.name}</span>
                    <span className="tnum mt-1 block text-[15px] font-semibold text-white">
                      {formatMoney(license.priceCents)}
                    </span>
                  </span>
                  <motion.span
                    animate={
                      active
                        ? { scale: 1, backgroundColor: 'rgb(255 255 255)', borderColor: 'rgb(255 255 255)' }
                        : { scale: 1, backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(255,255,255,0.25)' }
                    }
                    transition={springTap}
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-full border',
                      active ? 'text-black' : 'text-transparent',
                    )}
                  >
                    <AnimatePresence initial={false}>
                      {active ? (
                        <motion.span
                          key="check"
                          initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={reduce ? undefined : { opacity: 0, scale: 0.5 }}
                          transition={springTap}
                          className="grid place-items-center"
                        >
                          <CheckIcon size={12} weight="bold" />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.span>
                </span>
                <span className="mt-2 line-clamp-2 text-[12px] leading-snug text-ink-mute">
                  {license.filesDelivered.join(' · ')}
                </span>
              </motion.button>
            </motion.li>
          )
        })}
      </ul>

      <div className="mt-4 border-t border-white/8 pt-4">
        <p className="text-[12px] font-medium text-ink-mute">Usage terms</p>
        <AnimatePresence mode="wait">
          <motion.ul
            key={selected.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="mt-2.5 space-y-1.5 text-[13px] text-ink-2"
          >
            {terms.slice(0, 7).map((row) => (
              <li key={row} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-white/35" />
                <span>{row}</span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  )
}
