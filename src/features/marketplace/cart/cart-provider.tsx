import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applyCouponToCart,
  resolveAppliedCoupon,
  type AppliedCoupon,
} from '@/features/marketplace/cart/coupons'
import { normalizeCartItem } from '@/features/marketplace/cart/map-cart-item'
import type { CartItem } from '@/features/marketplace/cart/types'

const STORAGE_KEY = 'soniq.marketplace.cart.v1'
const COUPON_KEY = 'soniq.marketplace.cart.coupon.v1'

type ApplyCouponOutcome =
  | { ok: true; applied: AppliedCoupon }
  | { ok: false; error: string }

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotalCents: number
  discountCents: number
  totalCents: number
  appliedCoupon: AppliedCoupon | null
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clear: () => void
  applyCoupon: (code: string) => ApplyCouponOutcome
  removeCoupon: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed.map(normalizeCartItem) : []
  } catch {
    return []
  }
}

function readStoredCoupon(): string | null {
  try {
    const raw = localStorage.getItem(COUPON_KEY)
    if (!raw) return null
    const code = String(raw).trim()
    return code || null
  } catch {
    return null
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    typeof window === 'undefined' ? [] : readStoredItems(),
  )
  const [couponCode, setCouponCode] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : readStoredCoupon(),
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota / private mode
    }
  }, [items])

  useEffect(() => {
    try {
      if (couponCode) localStorage.setItem(COUPON_KEY, couponCode)
      else localStorage.removeItem(COUPON_KEY)
    } catch {
      // ignore
    }
  }, [couponCode])

  // Drop coupon when cart edits leave nothing eligible.
  useEffect(() => {
    if (!couponCode) return
    if (!resolveAppliedCoupon(couponCode, items)) {
      setCouponCode(null)
    }
  }, [items, couponCode])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const without = prev.filter((row) => row.id !== item.id)
      const withoutTrack = without.filter((row) => row.trackId !== item.trackId)
      return [...withoutTrack, item]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((row) => row.id !== id))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    setCouponCode(null)
  }, [])

  const applyCoupon = useCallback(
    (code: string): ApplyCouponOutcome => {
      const result = applyCouponToCart(code, items)
      if (!result.ok) return result
      setCouponCode(result.applied.code)
      return result
    },
    [items],
  )

  const removeCoupon = useCallback(() => setCouponCode(null), [])

  const value = useMemo<CartContextValue>(() => {
    const subtotalCents = items.reduce((sum, row) => sum + row.priceCents, 0)
    const appliedCoupon = resolveAppliedCoupon(couponCode, items)
    const discountCents = appliedCoupon?.discountCents ?? 0
    return {
      items,
      itemCount: items.length,
      subtotalCents,
      discountCents,
      totalCents: Math.max(0, subtotalCents - discountCents),
      appliedCoupon,
      addItem,
      removeItem,
      clear,
      applyCoupon,
      removeCoupon,
    }
  }, [items, couponCode, addItem, removeItem, clear, applyCoupon, removeCoupon])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
