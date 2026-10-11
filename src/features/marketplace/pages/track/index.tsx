import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  SealCheckIcon,
  ShareNetworkIcon,
  ShoppingBagOpenIcon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import LicenseModal, {
  type LicenseCheckoutAction,
  type MarketplaceLicenseOption,
} from '@/components/shared/license-modal'
import MarketplaceTrackCard from '@/components/shared/marketplace-track-card'
import ShareTrackModal from '@/components/shared/share-track-modal'
import { useCart } from '@/features/marketplace/cart/cart-provider'
import { cartItemFromLicense } from '@/features/marketplace/cart/map-cart-item'
import HorizontalScroller, {
  ScrollerNav,
} from '@/features/marketplace/components/explore/horizontal-scroller'
import { useHorizontalScroller } from '@/features/marketplace/components/explore/use-horizontal-scroller'
import TrackCommentsSection from '@/features/marketplace/components/comments/track-comments-section'
import TrackLicensingPanel from '@/features/marketplace/components/track/track-licensing-panel'
import { marketplaceProducerPath } from '@/features/marketplace/data/marketplace-producers'
import {
  formatDuration,
  formatPlayCount,
  formatPublishedDate,
  getMarketplaceTrack,
  getRelatedTracks,
  getTracksByProducer,
  marketplaceTrackPath,
  type MarketplaceTrackDetail,
} from '@/features/marketplace/data/marketplace-tracks'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const springSoft = { type: 'spring' as const, stiffness: 380, damping: 28, mass: 0.85 }
const springTap = { type: 'spring' as const, stiffness: 420, damping: 24 }

const pageEnter = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
}

const asideEnter = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
}

const coverPop = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springSoft,
  },
}

const chipRow = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
}

const chipItem = {
  hidden: { opacity: 0, y: 6, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: EASE },
  },
}

const statsList = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
}

const statsRow = {
  hidden: { opacity: 0, x: 8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: EASE },
  },
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function SectionShell({ children, reduce }: { children: ReactNode; reduce: boolean | null }) {
  if (reduce) return <div>{children}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px 0px' }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function TrackScrollerSection({
  title,
  tracks,
  onSelect,
  reduce,
}: {
  title: string
  tracks: MarketplaceTrackDetail[]
  onSelect: (id: string) => void
  reduce: boolean | null
}) {
  const scroller = useHorizontalScroller()
  if (tracks.length === 0) return null

  return (
    <SectionShell reduce={reduce}>
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[17px] font-medium tracking-[-0.02em] text-white">{title}</h2>
          <ScrollerNav
            canPrev={scroller.canPrev}
            canNext={scroller.canNext}
            onPrev={scroller.scrollPrev}
            onNext={scroller.scrollNext}
          />
        </div>
        <HorizontalScroller
          scrollerRef={scroller.ref}
          className="mt-4"
          contentClassName="gap-3.5"
          aria-label={title}
        >
          {tracks.map((beat, index) => (
            <motion.div
              key={beat.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-24px' }}
              transition={{ duration: 0.38, ease: EASE, delay: Math.min(index, 6) * 0.04 }}
            >
              <MarketplaceTrackCard track={beat} onSelect={() => onSelect(beat.id)} />
            </motion.div>
          ))}
        </HorizontalScroller>
      </section>
    </SectionShell>
  )
}

export default function TrackPage() {
  const { trackId = '' } = useParams()
  return <TrackPageContent key={trackId} trackId={trackId} />
}

function TrackPageContent({ trackId }: { trackId: string }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const track = getMarketplaceTrack(trackId)
  const { addItem } = useCart()
  const [shareOpen, setShareOpen] = useState(false)
  const [licenseOpen, setLicenseOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState(false)

  const producerTracks = useMemo(
    () => (track ? getTracksByProducer(track.producer, track.id, 12) : []),
    [track],
  )
  const relatedTracks = useMemo(() => (track ? getRelatedTracks(track, 12) : []), [track])

  if (!track) {
    return (
      <section className="h-full overflow-auto px-4 py-6 lg:px-6 lg:py-4">
        <Link
          to="/marketplace/charts"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
        >
          <ArrowLeftIcon size={14} />
          Back to charts
        </Link>
        <h1 className="mt-8 text-[28px] font-medium tracking-[-0.03em] text-white">
          Track not found
        </h1>
        <p className="mt-2 max-w-md text-[15px] text-ink-mute">
          This beat isn’t in the marketplace catalog, or the link is outdated.
        </p>
        <Link
          to="/marketplace/explore"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-black"
        >
          Browse Explore
        </Link>
      </section>
    )
  }

  const activeTrack = track

  function handleCheckout(action: LicenseCheckoutAction, license: MarketplaceLicenseOption) {
    if (action === 'cart') {
      addItem(cartItemFromLicense(activeTrack, license))
      return
    }
    if (action === 'buy') {
      if (license.priceCents === 0) {
        toast.success(`Downloading “${activeTrack.title}” (tagged MP3)`)
        return
      }
      toast.success(`Checkout for “${activeTrack.title}” (${license.name}) coming soon`)
      return
    }
    toast.success(`Offer sent for “${activeTrack.title}”`)
  }

  const lowestPrice = activeTrack.priceLabel

  const metaRows = [
    ['BPM', String(track.bpm)],
    ['Key', track.key],
    ['Duration', formatDuration(track.durationSec)],
    ['Plays', formatPlayCount(track.plays)],
    ['Published', formatPublishedDate(track.publishedAt)],
  ] as const

  return (
    <motion.section
      className="relative h-full overflow-auto px-4 py-6 pb-28 lg:px-6 lg:py-4 lg:pb-8"
      variants={reduce ? undefined : pageEnter}
      initial={reduce ? false : 'hidden'}
      animate="show"
    >
      <motion.div variants={reduce ? undefined : fadeUp}>
        <Link
          to="/marketplace/charts"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
        >
          <ArrowLeftIcon size={14} />
          Back to tracks
        </Link>
      </motion.div>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <motion.aside
          variants={reduce ? undefined : asideEnter}
          className="max-w-75 space-y-5 lg:sticky lg:top-2 lg:max-w-none"
        >
          <motion.button
            type="button"
            variants={reduce ? undefined : coverPop}
            whileHover={reduce ? undefined : { scale: 1.015 }}
            whileTap={reduce ? undefined : { scale: 0.985 }}
            transition={springTap}
            aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
            onClick={() => setPlaying((p) => !p)}
            className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl outline-none"
          >
            <span
              className={cn(
                'grid size-full place-items-center text-[42px] font-semibold tracking-tight text-white/80',
                track.cover,
              )}
            >
              {initials(track.title)}
            </span>
            <span
              className={cn(
                'absolute inset-0 grid place-items-center bg-black/40 transition-opacity duration-200',
                playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
            >
              <motion.span
                layout
                className="grid size-14 place-items-center rounded-full bg-white text-black shadow-lg"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={playing ? 'pause' : 'play'}
                    initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.16, ease: EASE }}
                    className="grid place-items-center"
                  >
                    {playing ? (
                      <PauseIcon size={22} weight="fill" />
                    ) : (
                      <PlayIcon size={22} weight="fill" className="ml-0.5" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </span>
          </motion.button>

          <motion.header variants={reduce ? undefined : fadeUp}>
            <h1 className="text-[26px] font-medium leading-tight tracking-[-0.03em] text-white">
              {track.title}
            </h1>
            <button
              type="button"
              onClick={() => navigate(marketplaceProducerPath(track.producer))}
              className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[14px] font-medium text-ink-2 transition-colors hover:text-white"
            >
              {track.producer}
              {track.verified !== false ? (
                <motion.span
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...springSoft, delay: 0.2 }}
                  className="inline-flex"
                >
                  <SealCheckIcon
                    size={14}
                    weight="fill"
                    className="shrink-0 text-sky-400"
                    aria-label="Verified"
                  />
                </motion.span>
              ) : null}
            </button>
          </motion.header>

          <motion.div variants={reduce ? undefined : fadeUp} className="flex items-center gap-2">
            {track.freeDownload !== false ? (
              <motion.button
                type="button"
                whileHover={reduce ? undefined : { scale: 1.015 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={springTap}
                onClick={() => toast.success(`Downloading “${track.title}” (tagged MP3)`)}
                className="inline-flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white/8 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/12"
              >
                <DownloadSimpleIcon size={16} />
                Free download
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={reduce ? undefined : { scale: 1.015 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={springTap}
                onClick={() => setLicenseOpen(true)}
                className="inline-flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white/8 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/12"
              >
                <ShoppingBagOpenIcon size={16} />
                <span className="truncate">License · from {lowestPrice}</span>
              </motion.button>
            )}
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { scale: 1.06 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              transition={springTap}
              onClick={() => setShareOpen(true)}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-white/12"
              aria-label="Share track"
            >
              <ShareNetworkIcon size={17} />
            </motion.button>
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { scale: 1.06 }}
              whileTap={reduce ? undefined : { scale: 0.9 }}
              transition={springTap}
              onClick={() => {
                setLiked((value) => !value)
                toast.success(liked ? `Removed like` : `Liked “${track.title}”`)
              }}
              className={cn(
                'grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/8 transition-colors hover:bg-white/12',
                liked ? 'text-rose-300' : 'text-white',
              )}
              aria-label="Like track"
            >
              <motion.span
                key={liked ? 'liked' : 'like'}
                initial={reduce ? false : { scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={springTap}
                className="grid place-items-center"
              >
                <HeartIcon size={17} weight={liked ? 'fill' : 'regular'} />
              </motion.span>
            </motion.button>
          </motion.div>

          <motion.section
            variants={reduce ? undefined : fadeUp}
            className="border-t border-white/8 pt-5"
          >
            <h2 className="text-[13px] font-medium text-ink-mute">About</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{track.description}</p>
            {track.tags.length > 0 ? (
              <motion.div
                variants={reduce ? undefined : chipRow}
                initial={reduce ? false : 'hidden'}
                animate="show"
                className="mt-3 flex flex-wrap gap-1.5"
              >
                {track.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    variants={reduce ? undefined : chipItem}
                    className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-2"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            ) : null}
          </motion.section>

          <motion.dl
            variants={reduce ? undefined : statsList}
            initial={reduce ? false : 'hidden'}
            animate="show"
            className="space-y-2.5 border-t border-white/8 pt-5 text-[13px]"
          >
            {metaRows.map(([label, value]) => (
              <motion.div
                key={label}
                variants={reduce ? undefined : statsRow}
                className="flex items-baseline justify-between gap-3"
              >
                <dt className="text-ink-mute">{label}</dt>
                <dd className="tnum text-right text-ink-2">{value}</dd>
              </motion.div>
            ))}
            <motion.div
              variants={reduce ? undefined : statsRow}
              className="flex items-start justify-between gap-3 pt-0.5"
            >
              <dt className="shrink-0 pt-0.5 text-ink-mute">
                {track.genres.length > 1 ? 'Genres' : 'Genre'}
              </dt>
              <dd className="flex flex-wrap justify-end gap-1.5">
                {track.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-2"
                  >
                    {genre}
                  </span>
                ))}
              </dd>
            </motion.div>
          </motion.dl>
        </motion.aside>

        <motion.div variants={reduce ? undefined : fadeUp} className="min-w-0 space-y-8">
          <SectionShell reduce={reduce}>
            <div id="track-licensing">
              <TrackLicensingPanel track={track} />
            </div>
          </SectionShell>

          <TrackScrollerSection
            title={`More from ${track.producer}`}
            tracks={producerTracks}
            reduce={reduce}
            onSelect={(id) => navigate(marketplaceTrackPath(id))}
          />

          <SectionShell reduce={reduce}>
            <TrackCommentsSection key={track.id} trackId={track.id} />
          </SectionShell>

          <TrackScrollerSection
            title="You may also like"
            tracks={relatedTracks}
            reduce={reduce}
            onSelect={(id) => navigate(marketplaceTrackPath(id))}
          />
        </motion.div>
      </div>

      <motion.div
        initial={reduce ? false : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#141216]/95 px-4 py-3 backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto flex max-w-lg items-center gap-2">
          {track.freeDownload !== false ? (
            <motion.button
              type="button"
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={springTap}
              onClick={() => toast.success(`Downloading “${track.title}” (tagged MP3)`)}
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white/10 text-[13px] font-semibold text-white"
            >
              <DownloadSimpleIcon size={18} />
              Free download
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={springTap}
              onClick={() => setLicenseOpen(true)}
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-white/10 text-[13px] font-semibold text-white"
            >
              License · from {lowestPrice}
            </motion.button>
          )}
        </div>
      </motion.div>

      <LicenseModal
        track={track}
        open={licenseOpen}
        onClose={() => setLicenseOpen(false)}
        onCheckout={handleCheckout}
      />
      <ShareTrackModal track={track} open={shareOpen} onClose={() => setShareOpen(false)} />
    </motion.section>
  )
}