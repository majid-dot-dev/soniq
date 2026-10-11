import { centsToDollarsInput, dollarsToCents } from '@/features/licenses/lib/format'
import type {
  DeliverableFile,
  LicenseCatalog,
  LicenseKind,
  LicenseTemplate,
  LicenseTemplateInput,
  PublishingSplit,
} from '@/features/licenses/types'

export type LicenseDraft = {
  name: string
  kind: LicenseKind
  description: string
  defaultPrice: string
  minOfferPrice: string
  filesDelivered: DeliverableFile[]
  streams: string
  distributionCopies: string
  freeDownloads: string
  radioStations: string
  monetizedMusicVideos: string
  nonMonetizedMusicVideos: string
  monetizedVideoStreams: string
  nonMonetizedVideoStreams: string
  performancesForProfit: string
  performancesNonProfit: string
  unlimitedStreams: boolean
  unlimitedDistributionCopies: boolean
  unlimitedFreeDownloads: boolean
  unlimitedRadio: boolean
  unlimitedMonetizedVideos: boolean
  unlimitedNonMonetizedVideos: boolean
  unlimitedMonetizedVideoStreams: boolean
  unlimitedNonMonetizedVideoStreams: boolean
  unlimitedPaidShows: boolean
  unlimitedFreeShows: boolean
  termYears: string
  publishingSplit: PublishingSplit
  publishingProducerPercent: string
  creditLine: string
  contractBody: string
  contractCustomized: boolean
  defaultOnNewUploads: boolean
  enabled: boolean
}

export const LICENSE_FIELD_CLASS =
  'mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-ink-mute'

export function emptyDraft(catalog: LicenseCatalog): LicenseDraft {
  const isKit = catalog === 'kit'
  return {
    name: '',
    kind: isKit ? 'royalty-free' : 'lease',
    description: '',
    defaultPrice: isKit ? '29' : '40',
    minOfferPrice: '',
    filesDelivered: isKit ? ['Kit ZIP'] : ['Tagged MP3', 'Untagged MP3'],
    streams: '50000',
    distributionCopies: '2000',
    freeDownloads: '0',
    radioStations: '0',
    monetizedMusicVideos: '1',
    nonMonetizedMusicVideos: '1',
    monetizedVideoStreams: '0',
    nonMonetizedVideoStreams: '50000',
    performancesForProfit: '0',
    performancesNonProfit: '',
    unlimitedStreams: isKit,
    unlimitedDistributionCopies: isKit,
    unlimitedFreeDownloads: isKit,
    unlimitedRadio: isKit,
    unlimitedMonetizedVideos: isKit,
    unlimitedNonMonetizedVideos: isKit,
    unlimitedMonetizedVideoStreams: isKit,
    unlimitedNonMonetizedVideoStreams: isKit,
    unlimitedPaidShows: isKit,
    unlimitedFreeShows: true,
    termYears: isKit ? '' : '2',
    publishingSplit: isKit ? 'buyer-keeps' : 'producer-keeps',
    publishingProducerPercent: '50',
    creditLine: isKit ? 'Sounds by Nao' : 'Produced by Nao',
    contractBody: '',
    contractCustomized: false,
    defaultOnNewUploads: true,
    enabled: true,
  }
}

export function draftFromLicense(license: LicenseTemplate): LicenseDraft {
  return {
    name: license.name,
    kind: license.kind,
    description: license.description,
    defaultPrice: centsToDollarsInput(license.defaultPrice),
    minOfferPrice: license.minOfferPrice != null ? centsToDollarsInput(license.minOfferPrice) : '',
    filesDelivered: [...license.filesDelivered],
    streams: String(license.streams ?? 0),
    distributionCopies: String(license.distributionCopies ?? 0),
    freeDownloads: String(license.freeDownloads ?? 0),
    radioStations: String(license.radioStations ?? 0),
    monetizedMusicVideos: String(license.monetizedMusicVideos ?? 0),
    nonMonetizedMusicVideos: String(license.nonMonetizedMusicVideos ?? 0),
    monetizedVideoStreams: String(license.monetizedVideoStreams ?? 0),
    nonMonetizedVideoStreams: String(license.nonMonetizedVideoStreams ?? 0),
    performancesForProfit: String(license.performancesForProfit ?? 0),
    performancesNonProfit: String(license.performancesNonProfit ?? 0),
    unlimitedStreams: license.streams === null,
    unlimitedDistributionCopies: license.distributionCopies === null,
    unlimitedFreeDownloads: license.freeDownloads === null,
    unlimitedRadio: license.radioStations === null,
    unlimitedMonetizedVideos: license.monetizedMusicVideos === null,
    unlimitedNonMonetizedVideos: license.nonMonetizedMusicVideos === null,
    unlimitedMonetizedVideoStreams: license.monetizedVideoStreams === null,
    unlimitedNonMonetizedVideoStreams: license.nonMonetizedVideoStreams === null,
    unlimitedPaidShows: license.performancesForProfit === null,
    unlimitedFreeShows: license.performancesNonProfit === null,
    termYears: license.termYears != null ? String(license.termYears) : '',
    publishingSplit: license.publishingSplit,
    publishingProducerPercent: String(license.publishingProducerPercent),
    creditLine: license.creditLine,
    contractBody: license.contractBody,
    contractCustomized: Boolean(license.contractBody.trim()),
    defaultOnNewUploads: license.defaultOnNewUploads,
    enabled: license.enabled,
  }
}

function parseCap(unlimited: boolean, value: string): number | null {
  if (unlimited) return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0
}

/** Draft (dollars in price fields) → API template fields (cents). */
export function draftToTemplateFields(tab: LicenseCatalog, draft: LicenseDraft): LicenseTemplateInput {
  const isLeaseLike = draft.kind === 'lease' || draft.kind === 'free'
  const dollars = draft.kind === 'free' ? 0 : Number(draft.defaultPrice)
  const producerPercent = Math.min(100, Math.max(0, Math.floor(Number(draft.publishingProducerPercent) || 0)))
  const minOfferDollars =
    draft.kind !== 'free' && draft.minOfferPrice.trim() !== ''
      ? Math.max(0, Number(draft.minOfferPrice) || 0)
      : null

  return {
    catalog: tab,
    name: draft.name.trim(),
    kind: draft.kind,
    description: draft.description.trim(),
    defaultPrice: dollarsToCents(Number.isFinite(dollars) ? dollars : 0),
    minOfferPrice: minOfferDollars == null ? null : dollarsToCents(minOfferDollars),
    filesDelivered: draft.filesDelivered,
    streams: isLeaseLike ? parseCap(draft.unlimitedStreams, draft.streams) : null,
    distributionCopies: isLeaseLike
      ? parseCap(draft.unlimitedDistributionCopies, draft.distributionCopies)
      : null,
    freeDownloads: isLeaseLike ? parseCap(draft.unlimitedFreeDownloads, draft.freeDownloads) : null,
    radioStations: isLeaseLike ? parseCap(draft.unlimitedRadio, draft.radioStations) : null,
    monetizedMusicVideos: isLeaseLike
      ? parseCap(draft.unlimitedMonetizedVideos, draft.monetizedMusicVideos)
      : null,
    nonMonetizedMusicVideos: isLeaseLike
      ? parseCap(draft.unlimitedNonMonetizedVideos, draft.nonMonetizedMusicVideos)
      : null,
    monetizedVideoStreams: isLeaseLike
      ? parseCap(draft.unlimitedMonetizedVideoStreams, draft.monetizedVideoStreams)
      : null,
    nonMonetizedVideoStreams: isLeaseLike
      ? parseCap(draft.unlimitedNonMonetizedVideoStreams, draft.nonMonetizedVideoStreams)
      : null,
    performancesForProfit: isLeaseLike
      ? parseCap(draft.unlimitedPaidShows, draft.performancesForProfit)
      : null,
    performancesNonProfit: isLeaseLike
      ? parseCap(draft.unlimitedFreeShows, draft.performancesNonProfit)
      : null,
    termYears:
      isLeaseLike && draft.termYears.trim() !== ''
        ? Math.max(1, Math.floor(Number(draft.termYears) || 1))
        : null,
    publishingSplit: draft.publishingSplit,
    publishingProducerPercent:
      draft.publishingSplit === 'fifty-fifty'
        ? 50
        : draft.publishingSplit === 'producer-keeps'
          ? 100
          : draft.publishingSplit === 'buyer-keeps'
            ? 0
            : producerPercent,
    creditLine: draft.creditLine.trim() || (tab === 'kit' ? 'Sounds by Nao' : 'Produced by Nao'),
    contractBody: draft.contractCustomized ? draft.contractBody.trim() : '',
    defaultOnNewUploads: draft.defaultOnNewUploads,
    enabled: draft.enabled,
  }
}
