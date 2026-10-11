import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FileTextIcon, SealCheckIcon, ShoppingBagOpenIcon, TrashIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import LicenseModal, {
  type LicenseCheckoutAction,
  type MarketplaceLicenseOption,
} from '@/components/shared/license-modal'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCart } from '@/features/marketplace/cart/cart-provider'
import { cartItemFromLicense, trackFromCartItem } from '@/features/marketplace/cart/map-cart-item'
import type { CartItem } from '@/features/marketplace/cart/types'
import { formatCap, formatMoney, formatTerm } from '@/features/licenses/lib/format'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
}

const listItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE },
  },
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function termRows(item: CartItem) {
  return [
    item.licenseDescription,
    `Files: ${item.filesDelivered.join(', ')}`,
    `Audio streams: ${formatCap(item.streams)}`,
    `Distribution copies: ${formatCap(item.distributionCopies)}`,
    `Term: ${formatTerm(item.termYears)}`,
    `Publishing: ${item.publishingLabel}`,
    item.licenseKind === 'exclusive'
      ? 'Exclusive rights — beat removed from further sale'
      : 'Non-exclusive — producer may sell to others',
  ]
}

function CheckoutLine({
  item,
  reduce,
  promoApplied,
  onRemove,
  onViewTerms,
  onChangeLicense,
}: {
  item: CartItem
  reduce: boolean | null
  promoApplied: boolean
  onRemove: () => void
  onViewTerms: () => void
  onChangeLicense: () => void
}) {
  return (
    <motion.article
      layout={reduce ? false : 'position'}
      variants={reduce ? undefined : listItem}
      exit={
        reduce
          ? undefined
          : {
              opacity: 0,
              y: -10,
              transition: { duration: 0.22, ease: EASE },
            }
      }
      className="flex gap-3.5 border-b border-white/8 py-4 last:border-b-0 sm:gap-4 sm:py-5"
    >
      <span
        className={cn(
          'grid size-16 shrink-0 place-items-center rounded-xl text-[13px] font-semibold tracking-tight text-white/80 sm:size-[72px] sm:text-[15px]',
          item.cover,
        )}
      >
        {initials(item.title)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-medium tracking-[-0.01em] text-white">
              {item.title}
            </h3>
            <p className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 text-[12px] text-ink-mute">
              <span className="truncate">{item.producer}</span>
              {item.verified !== false ? (
                <SealCheckIcon
                  size={12}
                  weight="fill"
                  className="shrink-0 text-sky-400"
                  aria-label="Verified"
                />
              ) : null}
              <span className="text-ink-faint"> · </span>
              <span className="min-w-0 truncate">
                {item.genre} · {item.bpm} BPM
              </span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tnum text-[15px] font-semibold text-white">
              {formatMoney(item.priceCents)}
            </p>
            {promoApplied ? (
              <p className="mt-0.5 text-[11px] font-medium text-emerald-400/90">Promo</p>
            ) : null}
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <button
            type="button"
            onClick={onChangeLicense}
            className="cursor-pointer rounded-lg bg-white/8 px-2 py-1 text-[12px] font-medium text-white transition-colors hover:bg-white/12"
          >
            {item.licenseName}
            {/* <span className="ml-1.5 text-ink-mute">Change</span> */}
          </button>
          <button
            type="button"
            onClick={onViewTerms}
            className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-medium text-ink-2 transition-colors hover:text-white"
          >
            <FileTextIcon size={13} weight="regular" />
            Review license
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-medium text-ink-mute transition-colors hover:text-rose-300"
          >
            <TrashIcon size={13} weight="regular" />
            Remove
          </button>
        </div>

        <p className="mt-2 truncate text-[12px] text-ink-faint">
          {item.filesDelivered.join(' · ')}
        </p>
      </div>
    </motion.article>
  )
}

export default function CheckoutPage() {
  const reduce = useReducedMotion()
  const {
    items,
    itemCount,
    subtotalCents,
    discountCents,
    totalCents,
    appliedCoupon,
    addItem,
    removeItem,
    clear,
    applyCoupon,
    removeCoupon,
  } = useCart()
  const [termsItem, setTermsItem] = useState<CartItem | null>(null)
  const [changeItem, setChangeItem] = useState<CartItem | null>(null)
  const [couponOpen, setCouponOpen] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const springTap = { type: 'spring' as const, stiffness: 420, damping: 24 }

  function handleApplyCoupon(event: FormEvent) {
    event.preventDefault()
    const result = applyCoupon(couponInput)
    if (!result.ok) {
      setCouponError(result.error)
      return
    }
    setCouponError(null)
    setCouponInput('')
    setCouponOpen(false)
    toast.success(`Applied ${result.applied.code}`)
  }

  function handleLicenseChange(_action: LicenseCheckoutAction, license: MarketplaceLicenseOption) {
    if (!changeItem) return
    addItem(cartItemFromLicense(trackFromCartItem(changeItem), license))
  }

  return (
    <section className="h-full overflow-auto px-4 py-6 lg:px-6 lg:py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="text-[24px] font-medium tracking-[-0.03em] text-white sm:text-[26px] lg:text-[32px]"
        >
          Checkout
        </motion.h1>
        {itemCount > 0 ? (
          <motion.button
            type="button"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
            onClick={() => {
              clear()
              toast.success('Cart cleared')
            }}
            className="cursor-pointer text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
          >
            Clear cart
          </motion.button>
        ) : null}
      </div>

      {itemCount === 0 ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.06, ease: EASE }}
          className="mt-16 flex flex-col items-center text-center"
        >
          <motion.span
            initial={reduce ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.1 }}
            className="grid size-14 place-items-center rounded-2xl bg-white/6 text-ink-mute"
          >
            <ShoppingBagOpenIcon size={26} weight="regular" />
          </motion.span>
          <h2 className="mt-5 text-[18px] font-medium tracking-[-0.02em] text-white">
            Nothing to check out
          </h2>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-ink-mute">
            Add beats from Explore, then open your cart and continue to checkout.
          </p>
          <Link
            to="/marketplace/explore"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-black transition-opacity hover:opacity-90"
          >
            Browse Explore
          </Link>
        </motion.div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_400px]">
          <motion.div
            variants={reduce ? undefined : listContainer}
            initial={reduce ? false : 'hidden'}
            animate="show"
            className="min-w-0 rounded-2xl bg-white/[0.03] px-3 sm:px-5"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CheckoutLine
                  key={item.trackId}
                  item={item}
                  reduce={reduce}
                  promoApplied={Boolean(appliedCoupon?.eligibleItemIds.includes(item.id))}
                  onRemove={() => {
                    removeItem(item.id)
                    toast.success(`Removed “${item.title}”`)
                  }}
                  onViewTerms={() => setTermsItem(item)}
                  onChangeLicense={() => setChangeItem(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.aside
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.18, ease: EASE }}
            className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/8 lg:sticky lg:top-2"
          >
            <h2 className="text-[15px] font-medium text-white">Order summary</h2>
            <dl className="mt-4 space-y-2.5 text-[13px]">
              <div className="flex justify-between gap-3 text-ink-2">
                <dt>Subtotal</dt>
                <dd className="tnum text-white">{formatMoney(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between gap-3 text-ink-mute">
                <dt>Discounts</dt>
                <dd className={cn('tnum', discountCents > 0 && 'text-ink-2')}>
                  {discountCents > 0 ? `−${formatMoney(discountCents)}` : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-white/10 pt-3 text-[15px] font-semibold text-white">
                <dt>Total</dt>
                <dd className="tnum">{formatMoney(totalCents)}</dd>
              </div>
            </dl>

            {appliedCoupon ? (
              <button
                type="button"
                onClick={() => {
                  removeCoupon()
                  setCouponError(null)
                  setCouponOpen(false)
                  toast.success('Coupon removed')
                }}
                className="mt-4 cursor-pointer text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
              >
                Remove {appliedCoupon.code}
              </button>
            ) : couponOpen ? (
              <form onSubmit={handleApplyCoupon} className="mt-4">
                <label htmlFor="checkout-coupon" className="sr-only">
                  Coupon code
                </label>
                <div className="flex gap-2">
                  <input
                    id="checkout-coupon"
                    value={couponInput}
                    onChange={(event) => {
                      setCouponInput(event.target.value.toUpperCase())
                      if (couponError) setCouponError(null)
                    }}
                    placeholder="Enter code"
                    autoComplete="off"
                    spellCheck={false}
                    autoFocus
                    className="h-10 min-w-0 flex-1 rounded-full bg-white/6 px-3.5 text-[13px] text-white outline-none ring-1 ring-white/10 placeholder:text-ink-faint focus:ring-white/25"
                  />
                  <button
                    type="submit"
                    disabled={!couponInput.trim()}
                    className="h-10 shrink-0 cursor-pointer rounded-full bg-white/10 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
                {couponError ? (
                  <p className="mt-2 text-[12px] text-rose-300">{couponError}</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setCouponOpen(false)
                    setCouponInput('')
                    setCouponError(null)
                  }}
                  className="mt-2 cursor-pointer text-[12px] font-medium text-ink-mute transition-colors hover:text-white"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setCouponOpen(true)}
                className="mt-4 cursor-pointer text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
              >
                Have a promo code?
              </button>
            )}

            <motion.button
              type="button"
              onClick={() => toast.success('Checkout coming soon')}
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={springTap}
              className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-white text-[14px] font-semibold text-black"
            >
              Checkout · {formatMoney(totalCents)}
            </motion.button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-mute">
              By checking out you agree to each license’s terms. Files and contracts deliver after
              payment.
            </p>
            <Link
              to="/marketplace/explore"
              className="mt-4 block text-center text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
            >
              Continue shopping
            </Link>
          </motion.aside>
        </div>
      )}

      <Dialog
        open={termsItem != null}
        onOpenChange={(next) => {
          if (!next) setTermsItem(null)
        }}
      >
        <DialogContent
          showCloseButton
          overlayClassName="bg-black/70 backdrop-blur-sm"
          className="max-h-[min(80svh,560px)] gap-0 overflow-hidden rounded-3xl bg-[#161618] p-0 text-ink ring-0 sm:max-w-md"
        >
          {termsItem ? (
            <>
              <div className="border-b border-white/8 px-5 py-4 sm:px-6">
                <DialogTitle className="text-[17px] font-semibold tracking-[-0.02em] text-white">
                  {termsItem.licenseName}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] text-ink-mute">
                  {termsItem.title} · {termsItem.producer}
                </DialogDescription>
              </div>
              <ul className="max-h-[min(50svh,360px)] space-y-2.5 overflow-y-auto px-5 py-4 text-[13px] text-ink-2 sm:px-6">
                {termRows(termsItem).map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
              <div className="border-t border-white/8 px-5 py-4 sm:px-6">
                <DialogClose className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-white/8 text-[13px] font-medium text-white transition-colors hover:bg-white/12">
                  Close
                </DialogClose>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <LicenseModal
        track={changeItem ? trackFromCartItem(changeItem) : null}
        open={changeItem != null}
        intent="change"
        initialLicenseId={changeItem?.licenseId}
        onClose={() => setChangeItem(null)}
        onCheckout={handleLicenseChange}
      />
    </section>
  )
}