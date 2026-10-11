import type { MarketplaceLicenseOption } from '@/components/shared/license-modal'
import type { MarketplaceTrack } from '@/components/shared/marketplace-track-card'
import type { CartItem } from '@/features/marketplace/cart/types'
import { formatMoney } from '@/features/licenses/lib/format'

/** Mock tier multipliers used by `defaultLicensesForTrack` — for migrating older cart rows. */
const TIER_MULT: Record<string, number> = {
  mp3: 1,
  wav: 1.67,
  trackout: 3.33,
  exclusive: 16.67,
}

export function cartItemFromLicense(
  track: MarketplaceTrack,
  license: MarketplaceLicenseOption,
): CartItem {
  return {
    id: `${track.id}:${license.id}`,
    trackId: track.id,
    title: track.title,
    producer: track.producer,
    verified: track.verified,
    cover: track.cover,
    genre: track.genre,
    bpm: track.bpm,
    priceLabel: track.priceLabel,
    licenseId: license.id,
    licenseName: license.name,
    licenseKind: license.kind,
    licenseDescription: license.description,
    priceCents: license.priceCents,
    filesDelivered: [...license.filesDelivered],
    streams: license.streams,
    distributionCopies: license.distributionCopies,
    termYears: license.termYears,
    publishingLabel: license.publishingLabel,
  }
}

/** Rebuild a track shape for the license modal from a cart line. */
export function trackFromCartItem(item: CartItem): MarketplaceTrack {
  return {
    id: item.trackId,
    title: item.title,
    producer: item.producer,
    verified: item.verified,
    cover: item.cover,
    genre: item.genre,
    bpm: item.bpm,
    priceLabel: item.priceLabel || inferPriceLabel(item),
  }
}

export function normalizeCartItem(item: CartItem): CartItem {
  if (item.priceLabel) return item
  return { ...item, priceLabel: inferPriceLabel(item) }
}

function inferPriceLabel(item: CartItem): string {
  const mult = TIER_MULT[item.licenseId] ?? 1
  const baseCents = Math.round(item.priceCents / mult)
  return formatMoney(baseCents)
}
