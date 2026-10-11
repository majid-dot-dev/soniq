import {
  couponCodes,
  type CouponCode,
} from '@/features/dashboard/discounts'
import type { CartItem } from '@/features/marketplace/cart/types'

export type AppliedCoupon = {
  code: string
  couponId: string
  valueType: CouponCode['valueType']
  amount: number
  /** Cart line ids that received a discount. */
  eligibleItemIds: string[]
  discountCents: number
}

export type ApplyCouponResult =
  | { ok: true; applied: AppliedCoupon }
  | { ok: false; error: string }

function normalize(value: string) {
  return value.trim().toLowerCase()
}

/** Map cart license labels onto dashboard coupon license labels. */
function couponLicenseKey(licenseName: string) {
  const key = normalize(licenseName)
  if (key.includes('trackout') || key.includes('stem')) return 'stems lease'
  if (key.includes('mp3')) return 'mp3 lease'
  if (key.includes('wav')) return 'wav lease'
  if (key.includes('exclusive')) return 'exclusive'
  return key
}

function isWithinWindow(coupon: CouponCode, now = new Date()) {
  const start = new Date(`${coupon.startsAt}T00:00:00`)
  if (now < start) return false
  if (!coupon.endsAt) return true
  const end = new Date(`${coupon.endsAt}T23:59:59.999`)
  return now <= end
}

function isRedeemable(coupon: CouponCode, now = new Date()) {
  if (coupon.status === 'Disabled' || coupon.status === 'Expired') return false
  if (coupon.maxUses != null && coupon.uses >= coupon.maxUses) return false
  return isWithinWindow(coupon, now)
}

export function findCoupon(code: string): CouponCode | undefined {
  const needle = normalize(code)
  if (!needle) return undefined
  return couponCodes.find((row) => normalize(row.code) === needle)
}

export function itemMatchesCoupon(item: CartItem, coupon: CouponCode) {
  const licenseOk = coupon.licenses.some(
    (name) => normalize(name) === couponLicenseKey(item.licenseName),
  )
  if (!licenseOk) return false
  if (coupon.beatScope === 'All') return true
  return coupon.beatScope.some((title) => normalize(title) === normalize(item.title))
}

function eligibleItems(items: CartItem[], coupon: CouponCode) {
  return items.filter((item) => itemMatchesCoupon(item, coupon))
}

function discountForEligible(
  eligible: CartItem[],
  coupon: CouponCode,
): { discountCents: number; eligibleItemIds: string[] } {
  const eligibleSubtotal = eligible.reduce((sum, row) => sum + row.priceCents, 0)
  if (eligibleSubtotal <= 0) {
    return { discountCents: 0, eligibleItemIds: [] }
  }

  if (coupon.valueType === 'percent') {
    const discountCents = Math.min(
      eligibleSubtotal,
      Math.round((eligibleSubtotal * coupon.amount) / 100),
    )
    return {
      discountCents,
      eligibleItemIds: eligible.map((row) => row.id),
    }
  }

  // Fixed $ off eligible subtotal once (amount stored in dollars in dashboard seed).
  const discountCents = Math.min(eligibleSubtotal, Math.round(coupon.amount * 100))
  return {
    discountCents,
    eligibleItemIds: eligible.map((row) => row.id),
  }
}

/** Resolve a typed code against the current cart (one code, eligible lines only). */
export function applyCouponToCart(code: string, items: CartItem[]): ApplyCouponResult {
  const coupon = findCoupon(code)
  if (!coupon) {
    return { ok: false, error: 'That code isn’t valid' }
  }
  if (!isRedeemable(coupon)) {
    return { ok: false, error: 'That code isn’t active right now' }
  }

  const eligible = eligibleItems(items, coupon)
  if (eligible.length === 0) {
    return {
      ok: false,
      error: 'No items in your cart qualify for this code',
    }
  }

  const { discountCents, eligibleItemIds } = discountForEligible(eligible, coupon)
  if (discountCents <= 0) {
    return { ok: false, error: 'No items in your cart qualify for this code' }
  }

  return {
    ok: true,
    applied: {
      code: coupon.code,
      couponId: coupon.id,
      valueType: coupon.valueType,
      amount: coupon.amount,
      eligibleItemIds,
      discountCents,
    },
  }
}

/** Recompute a stored code after cart edits; returns null if it no longer applies. */
export function resolveAppliedCoupon(
  code: string | null,
  items: CartItem[],
): AppliedCoupon | null {
  if (!code) return null
  const result = applyCouponToCart(code, items)
  return result.ok ? result.applied : null
}
