import {
  formatCap,
  formatKind,
  formatMoney,
  formatPublishing,
  formatTerm,
} from '@/features/licenses/lib/format'
import type { LicenseTemplate } from '@/features/licenses/types'

/** Generate contract text from structured fields. */
export function buildContractPreview(
  license: Pick<
    LicenseTemplate,
    | 'name'
    | 'kind'
    | 'description'
    | 'defaultPrice'
    | 'filesDelivered'
    | 'streams'
    | 'distributionCopies'
    | 'freeDownloads'
    | 'radioStations'
    | 'monetizedMusicVideos'
    | 'nonMonetizedMusicVideos'
    | 'monetizedVideoStreams'
    | 'nonMonetizedVideoStreams'
    | 'performancesForProfit'
    | 'performancesNonProfit'
    | 'termYears'
    | 'publishingSplit'
    | 'publishingProducerPercent'
    | 'creditLine'
    | 'minOfferPrice'
    | 'contractBody'
  >,
) {
  if (license.contractBody.trim()) return license.contractBody.trim()

  const exclusive = license.kind === 'exclusive'
  const royaltyFree = license.kind === 'royalty-free'
  const free = license.kind === 'free'

  const lines = [
    `${license.name.toUpperCase()} AGREEMENT`,
    '',
    `This agreement grants the buyer rights to use the purchased ${royaltyFree ? 'sound kit' : 'beat'} under the ${formatKind(license.kind).toLowerCase()} terms below.`,
    '',
    `Fee: ${free ? 'Free' : formatMoney(license.defaultPrice)}`,
    `Files delivered: ${license.filesDelivered.join(', ') || 'None selected'}`,
    `Credit: ${license.creditLine || 'Not required'}`,
    `Publishing: ${formatPublishing(license.publishingSplit, license.publishingProducerPercent)}`,
    `Term: ${formatTerm(license.termYears)}`,
    '',
  ]

  if (royaltyFree) {
    lines.push(
      'The buyer may use the sounds royalty-free in original recordings.',
      'The buyer may not resell, repackage, or redistribute the raw files as a competing pack.',
    )
  } else if (exclusive) {
    lines.push(
      'This license is exclusive. After purchase, the track is removed from further sale.',
      'Prior non-exclusive buyers keep the rights already granted to them.',
      'Usage for the exclusive buyer is unlimited unless otherwise stated.',
      'Sync / TV / film / ad placements may require a separate written agreement unless included above.',
    )
    if (license.minOfferPrice != null) {
      lines.push(`Minimum offer accepted: ${formatMoney(license.minOfferPrice)}.`)
    }
  } else {
    lines.push(
      free
        ? 'This is a free promotional license. The producer may still sell paid licenses of the same beat.'
        : 'This license is non-exclusive. The producer may sell the same beat to other buyers.',
      `Audio streams: ${formatCap(license.streams)}`,
      `Distribution copies: ${formatCap(license.distributionCopies)}`,
      `Free downloads: ${formatCap(license.freeDownloads)}`,
      `Radio stations: ${formatCap(license.radioStations)}`,
      `Monetized music videos: ${formatCap(license.monetizedMusicVideos)}`,
      `Non-monetized music videos: ${formatCap(license.nonMonetizedMusicVideos)}`,
      `Monetized video streams: ${formatCap(license.monetizedVideoStreams)}`,
      `Non-monetized video streams: ${formatCap(license.nonMonetizedVideoStreams)}`,
      `Paid live performances: ${formatCap(license.performancesForProfit)}`,
      `Non-profit live performances: ${formatCap(license.performancesNonProfit)}`,
      'The buyer may not resell or re-lease the instrumental itself.',
      'Sync / TV / film / ad placements are not included unless expressly stated.',
    )
  }

  if (license.description.trim()) {
    lines.push('', license.description.trim())
  }

  return lines.join('\n')
}
