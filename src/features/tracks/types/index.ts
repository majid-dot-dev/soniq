export const TRACK_STATUSES = ['draft', 'live', 'sold', 'archived'] as const
export type TrackStatus = (typeof TRACK_STATUSES)[number]

export const TRACK_VISIBILITIES = ['private', 'public', 'unlisted'] as const
export type TrackVisibility = (typeof TRACK_VISIBILITIES)[number]

export const TRACK_TYPES = ['beat', 'beat_with_hook', 'song', 'top_line'] as const
export type TrackType = (typeof TRACK_TYPES)[number]

export type TaxonomyRef = {
  id: string
  slug: string
  label: string
}

export type TaxonomyTerm = TaxonomyRef & {
  sortOrder: number
  active: boolean
  aliases: string[]
  regions: string[]
}

export type StoredAsset = {
  key: string
  bucket: string
  contentType: string
  byteSize: number
  etag: string | null
  originalFilename: string | null
  durationMs: number | null
}

export type TrackLicense = {
  licenseTemplateId: string
  name: string
  detail: string
  kind: 'lease' | 'exclusive' | 'free' | 'royalty-free'
  filesDelivered: string[]
  priceCents: number
  enabled: boolean
}

export type Track = {
  id: string
  userId: string
  profileId: string
  status: TrackStatus
  processingStatus?: 'pending' | 'processing' | 'ready' | 'failed'
  visibility: TrackVisibility
  title: string
  about: string
  trackType: TrackType | null
  slug: string
  genreIds: string[]
  genres: TaxonomyRef[]
  moodIds: string[]
  moods: TaxonomyRef[]
  instrumentIds: string[]
  instruments: TaxonomyRef[]
  tags: string[]
  bpm: number | null
  musicalKeyId: string | null
  musicalKey: TaxonomyRef | null
  durationMs: number | null
  releaseDate: string | null
  assets: {
    master: StoredAsset | null
    tagged: StoredAsset | null
    stems: StoredAsset | null
    cover: StoredAsset | null
  }
  /** Presigned cover URL when a cover asset exists */
  coverUrl: string | null
  /** Presigned stream URL for the tagged preview (never the master) */
  previewUrl: string | null
  licenses: TrackLicense[]
  plays: number
  sales: number
  publishedAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export type TrackAssetSlot = 'master' | 'tagged' | 'stems' | 'cover'

export type PendingTrackAsset = {
  slot: TrackAssetSlot
  key: string
  originalFilename?: string
  durationMs?: number
}

export type CreateTrackInput = {
  title?: string
  assets: PendingTrackAsset[]
}

export type UpdateTrackInput = {
  title?: string
  about?: string
  trackType?: TrackType | null
  genreIds?: string[]
  moodIds?: string[]
  instrumentIds?: string[]
  tags?: string[]
  bpm?: number | null
  musicalKeyId?: string | null
  durationMs?: number | null
  visibility?: TrackVisibility
  releaseDate?: string | null
  licenses?: Array<{
    licenseTemplateId: string
    priceCents: number
    enabled: boolean
  }>
}
