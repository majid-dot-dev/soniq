import { useState } from 'react'
import { DownloadSimpleIcon, PlayIcon, SealCheckIcon, ShoppingBagOpenIcon } from '@phosphor-icons/react'
import LicenseModal, {
  type LicenseCheckoutAction,
  type MarketplaceLicenseOption,
} from '@/components/shared/license-modal'
import { useCart } from '@/features/marketplace/cart/cart-provider'
import { cartItemFromLicense } from '@/features/marketplace/cart/map-cart-item'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export type MarketplaceTrack = {
  id: string
  title: string
  producer: string
  genre: string
  bpm: number
  priceLabel: string
  cover: string
  /** Verified producer — shows a seal beside the name. */
  verified?: boolean
  /** When true, show a free-download control beside the price. */
  freeDownload?: boolean
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function MarketplaceTrackCard({
  track,
  className,
  onSelect,
}: {
  track: MarketplaceTrack
  className?: string
  onSelect?: () => void
}) {
  const [licenseOpen, setLicenseOpen] = useState(false)
  const { addItem } = useCart()

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
    <article className={cn('group w-37 shrink-0 sm:w-42', className)}>
      <button type="button" onClick={onSelect} className="w-full text-left outline-none">
        <span className="relative block overflow-hidden rounded-xl">
          <span
            className={cn(
              'grid aspect-square w-full place-items-center text-[22px] font-semibold tracking-tight text-white/80',
              track.cover,
            )}
          >
            {initials(track.title)}
          </span>
          <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
          <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="grid size-10 place-items-center rounded-full bg-white text-black shadow-lg">
              <PlayIcon size={16} weight="fill" className="ml-0.5" />
            </span>
          </span>
        </span>
        <span className="mt-3 block truncate text-[14px] font-medium text-white">
          {track.title}
        </span>
        <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[12px] text-ink-mute">
          <span className="truncate">{track.producer}</span>
          {track.verified !== false ? (
            <SealCheckIcon
              size={12}
              weight="fill"
              className="shrink-0 text-sky-400"
              aria-label="Verified producer"
            />
          ) : null}
        </span>
      </button>

      <div className="mt-2 flex items-center gap-1.5">
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
      </div>

      <LicenseModal
        track={track}
        open={licenseOpen}
        onClose={() => setLicenseOpen(false)}
        onCheckout={handleCheckout}
      />
    </article>
  )
}