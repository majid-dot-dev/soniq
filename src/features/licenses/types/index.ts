export const LICENSE_CATALOGS = ['beat', 'kit'] as const
export type LicenseCatalog = (typeof LICENSE_CATALOGS)[number]

export const LICENSE_KINDS = ['lease', 'exclusive', 'free', 'royalty-free'] as const
export type LicenseKind = (typeof LICENSE_KINDS)[number]

export const DELIVERABLE_FILES = [
  'Tagged MP3',
  'Untagged MP3',
  'WAV',
  'Stems',
  'Kit ZIP',
] as const
export type DeliverableFile = (typeof DELIVERABLE_FILES)[number]

export const PUBLISHING_SPLITS = [
  'producer-keeps',
  'fifty-fifty',
  'buyer-keeps',
  'custom',
] as const
export type PublishingSplit = (typeof PUBLISHING_SPLITS)[number]

export type LicenseTemplate = {
  id: string
  catalog: LicenseCatalog
  name: string
  kind: LicenseKind
  description: string
  /** Default offer price. Stored in minor units (cents). */
  defaultPrice: number
  /** Minimum buyer offer. null = no minimum. Stored in minor units (cents). */
  minOfferPrice: number | null
  filesDelivered: DeliverableFile[]
  streams: number | null
  /** Paid / commercial distribution copies */
  distributionCopies: number | null
  /** Free downloads the buyer may give away */
  freeDownloads: number | null
  radioStations: number | null
  monetizedMusicVideos: number | null
  nonMonetizedMusicVideos: number | null
  monetizedVideoStreams: number | null
  nonMonetizedVideoStreams: number | null
  performancesForProfit: number | null
  performancesNonProfit: number | null
  /** Lease length in years. null = no fixed expiry */
  termYears: number | null
  publishingSplit: PublishingSplit
  /** Used when publishingSplit is custom (producer %). 0–100 */
  publishingProducerPercent: number
  creditLine: string
  /** Editable contract body. Empty = generate from fields. */
  contractBody: string
  defaultOnNewUploads: boolean
  enabled: boolean
  itemCount: number
}

export type LicenseTemplateInput = Omit<LicenseTemplate, 'id' | 'itemCount'>

export const beatFileOptions: DeliverableFile[] = ['Tagged MP3', 'Untagged MP3', 'WAV', 'Stems']
export const kitFileOptions: DeliverableFile[] = ['Kit ZIP', 'Untagged MP3']

export const publishingSplitOptions: { id: PublishingSplit; label: string; hint: string }[] = [
  { id: 'producer-keeps', label: 'Producer keeps', hint: 'Buyer gets master use; publishing stays with you' },
  { id: 'fifty-fifty', label: '50 / 50', hint: 'Standard split on the composition' },
  { id: 'buyer-keeps', label: 'Buyer keeps', hint: 'Buyer takes publishing (rare; usually exclusives)' },
  { id: 'custom', label: 'Custom', hint: 'Set the producer’s publishing share' },
]
