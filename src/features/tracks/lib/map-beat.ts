import type { Beat, BeatStatus } from '@/features/dashboard/beats'
import { centsToDollarsInput } from '@/features/licenses/lib/format'
import type { LicenseTemplate } from '@/features/licenses/types'
import type { LicenseOffer } from '@/features/tracks/components/upload-track-steps/shared'
import type {
  StoredAsset,
  Track,
  TrackAssetSlot,
  TrackLicense,
  TrackType,
  TrackVisibility,
} from '@/features/tracks/types'

const TRACK_TYPE_LABEL: Record<TrackType, string> = {
  beat: 'Beat',
  beat_with_hook: 'Beat with hook',
  song: 'Song',
  top_line: 'Top line',
}

const TRACK_TYPE_VALUE: Record<string, TrackType> = {
  Beat: 'beat',
  'Beat with hook': 'beat_with_hook',
  Song: 'song',
  'Top line': 'top_line',
}

const VISIBILITY_VALUE: Record<string, TrackVisibility> = {
  Private: 'private',
  Public: 'public',
  Unlisted: 'unlisted',
}

const VISIBILITY_LABEL: Record<TrackVisibility, string> = {
  private: 'Private',
  public: 'Public',
  unlisted: 'Unlisted',
}

export type PendingSlot = {
  key: string
  originalFilename: string
  durationMs?: number
}

export function trackTypeToApi(label: string): TrackType | null {
  return TRACK_TYPE_VALUE[label] ?? null
}

export function trackTypeFromApi(value: TrackType | null): string {
  if (!value) return ''
  return TRACK_TYPE_LABEL[value]
}

export function visibilityToApi(label: string): TrackVisibility {
  return VISIBILITY_VALUE[label] ?? 'public'
}

export function visibilityFromApi(value: TrackVisibility): string {
  return VISIBILITY_LABEL[value]
}

export function formatDurationMs(ms: number | null | undefined) {
  if (ms == null || ms <= 0) return '00:00'
  const total = Math.round(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function durationMsFromClock(clock: string) {
  const [minutes, seconds] = clock.split(':').map((part) => Number(part))
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return null
  return Math.max(0, (minutes * 60 + seconds) * 1000)
}

function pendingFromAsset(asset: StoredAsset | null): PendingSlot | undefined {
  if (!asset) return undefined
  return {
    key: asset.key,
    originalFilename: asset.originalFilename || asset.key.split('/').pop() || 'file',
    durationMs: asset.durationMs ?? undefined,
  }
}

export function pendingAssetsFromTrack(track: Track): Partial<Record<TrackAssetSlot, PendingSlot>> {
  const pending: Partial<Record<TrackAssetSlot, PendingSlot>> = {}
  const master = pendingFromAsset(track.assets.master)
  const tagged = pendingFromAsset(track.assets.tagged)
  const stems = pendingFromAsset(track.assets.stems)
  const cover = pendingFromAsset(track.assets.cover)
  if (master) pending.master = master
  if (tagged) pending.tagged = tagged
  if (stems) pending.stems = stems
  if (cover) pending.cover = cover
  return pending
}

export function offersFromTemplates(
  templates: LicenseTemplate[],
  existing: TrackLicense[] = [],
): LicenseOffer[] {
  const byTemplateId = new Map(existing.map((license) => [license.licenseTemplateId, license]))
  const enabledTemplates = templates.filter((template) => template.enabled)

  const fromTemplates = enabledTemplates.map((template) => {
    const match = byTemplateId.get(template.id)
    return {
      id: template.id,
      name: template.name,
      detail: template.description,
      kind: template.kind,
      price: match
        ? centsToDollarsInput(match.priceCents)
        : centsToDollarsInput(template.defaultPrice),
      enabled: match ? match.enabled : template.defaultOnNewUploads,
      needsStems: template.filesDelivered.includes('Stems'),
      isFree: template.kind === 'free',
      minOfferCents: template.minOfferPrice,
    } satisfies LicenseOffer
  })

  const knownIds = new Set(fromTemplates.map((offer) => offer.id))
  const orphans = existing
    .filter((license) => !knownIds.has(license.licenseTemplateId))
    .map(
      (license) =>
        ({
          id: license.licenseTemplateId,
          name: license.name,
          detail: license.detail,
          kind: license.kind,
          price: centsToDollarsInput(license.priceCents),
          enabled: license.enabled,
          needsStems: license.filesDelivered.includes('Stems'),
          isFree: license.kind === 'free',
          minOfferCents: null,
        }) satisfies LicenseOffer,
    )

  return [...fromTemplates, ...orphans]
}

export function trackToBeat(track: Track): Beat {
  const enabled = track.licenses.filter((license) => license.enabled && license.priceCents > 0)
  const from = enabled.length
    ? Math.min(...enabled.map((license) => license.priceCents)) / 100
    : 0

  const statusMap: Record<Track['status'], BeatStatus> = {
    draft: 'Draft',
    live: 'Live',
    sold: 'Sold',
    archived: 'Draft',
  }

  return {
    id: track.id,
    slug: track.slug,
    title: track.title || 'Untitled track',
    bpm: track.bpm ?? 0,
    key: track.musicalKey?.label || '—',
    genre: track.genres.map((item) => item.label),
    mood: track.moods.map((item) => item.label),
    status: statusMap[track.status],
    plays: track.plays,
    sales: track.sales,
    fromPrice: from ? `$${from % 1 === 0 ? from : from.toFixed(2)}` : '—',
    licenses: enabled.length,
    duration: formatDurationMs(track.durationMs),
    year: String(new Date(track.createdAt).getFullYear()),
    updated: 'Just now',
    image: track.coverUrl ?? '',
    previewUrl: track.previewUrl,
    about: track.about || 'No description yet.',
    tags: track.tags.length ? track.tags : undefined,
    trackType: trackTypeFromApi(track.trackType) || undefined,
    instruments: track.instruments.length
      ? track.instruments.map((item) => item.label)
      : undefined,
    visibility: visibilityFromApi(track.visibility) as Beat['visibility'],
    releaseDate: track.releaseDate
      ? new Date(track.releaseDate).toISOString().slice(0, 10)
      : undefined,
  }
}
