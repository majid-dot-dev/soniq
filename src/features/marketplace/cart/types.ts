export type CartLicenseKind = 'lease' | 'exclusive' | 'free'

export type CartItem = {
  /** Stable key: `${trackId}:${licenseId}` */
  id: string
  trackId: string
  title: string
  producer: string
  verified?: boolean
  cover: string
  genre: string
  bpm: number
  /** Track listing price label — used to rebuild lease tiers when changing license. */
  priceLabel: string
  licenseId: string
  licenseName: string
  licenseKind: CartLicenseKind
  licenseDescription: string
  priceCents: number
  filesDelivered: string[]
  streams: number | null
  distributionCopies: number | null
  termYears: number | null
  publishingLabel: string
}
