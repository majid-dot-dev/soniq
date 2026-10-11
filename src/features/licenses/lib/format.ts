import type { LicenseKind, PublishingSplit } from '@/features/licenses/types'

export function formatMoney(cents: number) {
  const dollars = cents / 100
  return `$${dollars.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

/** Form dollars → stored minor units. */
export function dollarsToCents(dollars: number) {
  if (!Number.isFinite(dollars) || dollars < 0) return 0
  return Math.round(dollars * 100)
}

/** Stored minor units → form dollars string. */
export function centsToDollarsInput(cents: number) {
  const dollars = cents / 100
  return Number.isInteger(dollars) ? String(dollars) : String(dollars)
}

export function formatCap(value: number | null) {
  if (value === null) return 'Unlimited'
  return value.toLocaleString('en-US')
}

export function formatKind(kind: LicenseKind) {
  if (kind === 'lease') return 'Non-exclusive'
  if (kind === 'exclusive') return 'Exclusive'
  if (kind === 'free') return 'Free download'
  return 'Royalty-free'
}

export function formatFiles(files: string[]) {
  if (files.length <= 2) return files.join(', ')
  return `${files[0]} +${files.length - 1}`
}

export function formatPublishing(split: PublishingSplit, producerPercent: number) {
  if (split === 'producer-keeps') return 'Producer keeps publishing'
  if (split === 'fifty-fifty') return '50% producer / 50% buyer'
  if (split === 'buyer-keeps') return 'Buyer keeps publishing'
  return `${producerPercent}% producer / ${100 - producerPercent}% buyer`
}

export function formatTerm(years: number | null) {
  if (years == null) return 'No fixed expiry'
  if (years === 1) return '1 year'
  return `${years} years`
}
