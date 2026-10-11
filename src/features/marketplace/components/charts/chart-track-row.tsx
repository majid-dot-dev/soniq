import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CaretDownIcon,
  CaretUpIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  FlagIcon,
  HeartIcon,
  LinkSimpleIcon,
  MinusIcon,
  PlayIcon,
  MusicNoteIcon,
  PlaylistIcon,
  SealCheckIcon,
  ShareNetworkIcon,
  ShoppingBagOpenIcon,
  UserIcon,
} from '@phosphor-icons/react'
import LicenseModal, {
  type LicenseCheckoutAction,
  type MarketplaceLicenseOption,
} from '@/components/shared/license-modal'
import type { MarketplaceTrack } from '@/components/shared/marketplace-track-card'
import ShareTrackModal from '@/components/shared/share-track-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCart } from '@/features/marketplace/cart/cart-provider'
import { cartItemFromLicense } from '@/features/marketplace/cart/map-cart-item'
import { marketplaceProducerPath } from '@/features/marketplace/data/marketplace-producers'
import { marketplaceTrackPath } from '@/features/marketplace/data/marketplace-tracks'
import { trackShareUrl } from '@/components/shared/share-track-modal'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const menuItemClass =
  'cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-2 focus:bg-white/8 focus:text-white'

export type ChartTrack = MarketplaceTrack & {
  plays: number
  /** Rank change vs previous period; 0 = same, null = new. Omit when not ranking. */
  delta?: number | null
}

/** Intrinsic width ≈ bars×2.5px + gaps×3px — keep density, grow length. */
const WAVE_BARS = 140

function initials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function formatChartStat(value: number) {
  if (value >= 1_000_000) {
    const n = value / 1_000_000
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}M`
  }
  if (value >= 1_000) {
    const n = value / 1_000
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}K`
  }
  return value.toLocaleString('en-US')
}

function RankDelta({ delta }: { delta: number | null }) {
  if (delta == null) {
    return <span className="text-[10px] font-semibold tracking-wide text-sky-400">NEW</span>
  }
  if (delta === 0) {
    return <MinusIcon size={11} className="text-ink-faint" aria-label="No change" />
  }
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-px text-[10px] font-semibold text-emerald-400">
        <CaretUpIcon size={11} weight="bold" />
        {delta}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-px text-[10px] font-semibold text-rose-400">
      <CaretDownIcon size={11} weight="bold" />
      {Math.abs(delta)}
    </span>
  )
}

function seedFromId(id: string) {
  let s = 0
  for (let i = 0; i < id.length; i++) s = (s * 31 + id.charCodeAt(i)) >>> 0
  return (s % 200) + 1
}

function waveformHeights(seed: number) {
  const out: number[] = []
  let s = seed
  for (let i = 0; i < WAVE_BARS; i++) {
    s = (s * 9301 + 49297) % 233280
    const rnd = s / 233280
    const wave = Math.sin(i / 2.4) * 0.5 + 0.5
    out.push(Math.max(14, Math.round((rnd * 0.5 + wave * 0.5) * 100)))
  }
  return out
}

function TrackWaveform({ trackId }: { trackId: string }) {
  const heights = useMemo(() => waveformHeights(seedFromId(trackId)), [trackId])

  return (
    <div aria-hidden className="flex h-7 items-center gap-[3px]">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[2.5px] flex-none rounded-full bg-white/25 transition-colors duration-200 group-hover:bg-rose-300/50"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

export default function ChartTrackRow({
  track,
  rank,
}: {
  track: ChartTrack
  /** When omitted, the rank / delta column is hidden (catalog lists). */
  rank?: number
}) {
  const navigate = useNavigate()
  const [licenseOpen, setLicenseOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const { addItem } = useCart()
  const showRank = rank != null
  const topThree = showRank && rank <= 3

  function handleCheckout(
    action: LicenseCheckoutAction,
    license: MarketplaceLicenseOption,
  ) {
    if (action === 'cart') {
      addItem(cartItemFromLicense(track, license))
      return
    }
    if (action === 'buy') {
      toast.success(`Checkout for “${track.title}” coming soon`)
      return
    }
    toast.success(`Offer sent for “${track.title}”`)
  }

  return (
    <article className="group flex items-center gap-3 py-3 sm:gap-4">
      {showRank ? (
        <div className="flex w-9 shrink-0 flex-col items-center gap-0.5 sm:w-10">
          <span
            className={cn(
              'tnum text-[15px] font-semibold tracking-tight',
              topThree ? 'text-rose-400' : 'text-ink-mute',
            )}
          >
            {rank}
          </span>
          <RankDelta delta={track.delta ?? null} />
        </div>
      ) : null}

      <button
        type="button"
        className="relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-lg outline-none sm:size-[52px]"
        aria-label={`Play ${track.title}`}
        onClick={() => toast.success(`Playing “${track.title}”`)}
      >
        <span
          className={cn(
            'grid size-full place-items-center text-[13px] font-semibold tracking-tight text-white/80',
            track.cover,
          )}
        >
          {initials(track.title)}
        </span>
        <span className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/45 group-hover:opacity-100">
          <span className="grid size-8 place-items-center rounded-full bg-white text-black shadow-md">
            <PlayIcon size={14} weight="fill" className="ml-0.5" />
          </span>
        </span>
      </button>

      <div className="min-w-0 w-40 shrink-0 sm:w-44 md:w-52">
        <p className="truncate text-[14px] font-medium tracking-[-0.01em] text-white">
          {track.title}
        </p>
        <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[12px] text-ink-mute">
          <span className="truncate">{track.producer}</span>
          {track.verified !== false ? (
            <SealCheckIcon
              size={12}
              weight="fill"
              className="shrink-0 text-sky-400"
              aria-label="Verified"
            />
          ) : null}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-ink-faint">
          {track.genre} · {track.bpm} BPM
          <span className="tnum md:hidden"> · {formatChartStat(track.plays)} plays</span>
        </p>
      </div>

      <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
        <TrackWaveform trackId={track.id} />
      </div>

      <p className="tnum hidden w-14 shrink-0 text-right text-[13px] text-ink-2 sm:block">
        {formatChartStat(track.plays)}
      </p>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => setLicenseOpen(true)}
          className="tnum inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/8 px-2 py-1 text-[12px] font-medium text-white transition-colors hover:bg-white/12"
        >
          <ShoppingBagOpenIcon size={14} weight="regular" className="shrink-0" />
          {track.priceLabel}
        </button>
        {track.freeDownload !== false ? (
          <button
            type="button"
            aria-label={`Download ${track.title} free`}
            title="Free download"
            onClick={() => toast.success(`Downloading “${track.title}” (tagged MP3)`)}
            className="grid size-7 cursor-pointer place-items-center rounded-lg bg-white/8 text-white transition-colors hover:bg-white/12"
          >
            <DownloadSimpleIcon size={14} weight="regular" />
          </button>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`More actions for ${track.title}`}
            className="grid size-7 cursor-pointer place-items-center rounded-lg bg-white/8 text-white outline-none transition-colors hover:bg-white/12 data-popup-open:bg-white/12"
          >
            <DotsThreeIcon size={16} weight="bold" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="min-w-48 rounded-xl bg-[#161618] p-1.5 text-ink ring-white/12"
          >
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => toast.success(`Liked “${track.title}”`)}
            >
              <HeartIcon size={16} />
              Like
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => toast.success(`Added “${track.title}” to a playlist`)}
            >
              <PlaylistIcon size={16} />
              Add to playlist
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => navigate(marketplaceTrackPath(track.id))}
            >
              <MusicNoteIcon size={16} />
              Go to track
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => navigate(marketplaceProducerPath(track.producer))}
            >
              <UserIcon size={16} />
              Go to producer
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => {
                void navigator.clipboard?.writeText(trackShareUrl(track.id)).then(
                  () => toast.success('Link copied'),
                  () => toast.success('Copy link coming soon'),
                )
              }}
            >
              <LinkSimpleIcon size={16} />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => setShareOpen(true)}
            >
              <ShareNetworkIcon size={16} />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className={cn(menuItemClass, 'text-rose-300 focus:text-rose-200')}
              onClick={() => toast.success('Report submitted')}
            >
              <FlagIcon size={16} />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LicenseModal
        track={track}
        open={licenseOpen}
        onClose={() => setLicenseOpen(false)}
        onCheckout={handleCheckout}
      />
      <ShareTrackModal
        track={track}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </article>
  )
}
