import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  ChatCenteredTextIcon,
  MapPinIcon,
  PackageIcon,
  PlaylistIcon,
  SealCheckIcon,
  ShareNetworkIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import MarketplaceTrackCard from '@/components/shared/marketplace-track-card'
import HorizontalScroller, {
  ScrollerNav,
} from '@/features/marketplace/components/explore/horizontal-scroller'
import { useHorizontalScroller } from '@/features/marketplace/components/explore/use-horizontal-scroller'
import {
  getMarketplaceProducer,
  getProducerCollections,
  getProducerNewTracks,
  getProducerPopularTracks,
  getProducerSoundPacks,
  getProducerTrackStats,
  marketplaceProducerPath,
  type ProducerBundle,
} from '@/features/marketplace/data/marketplace-producers'
import {
  formatPlayCount,
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
    transition: { staggerChildren: 0.035, delayChildren: 0.02 },
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatJoined(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

function SectionShell({
  children,
  reduce,
  delay = 0,
}: {
  children: ReactNode
  reduce: boolean | null
  delay?: number
}) {
  if (reduce) return <div>{children}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px 0px' }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function TrackScrollerSection({
  title,
  tracks,
  onSelect,
  onSeeAll,
  reduce,
}: {
  title: string
  tracks: MarketplaceTrackDetail[]
  onSelect: (id: string) => void
  onSeeAll: () => void
  reduce: boolean | null
}) {
  const scroller = useHorizontalScroller()
  if (tracks.length === 0) return null

  return (
    <SectionShell reduce={reduce}>
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[17px] font-medium tracking-[-0.02em] text-white">{title}</h2>
          <div className="flex shrink-0 items-center gap-2">
            <ScrollerNav
              canPrev={scroller.canPrev}
              canNext={scroller.canNext}
              onPrev={scroller.scrollPrev}
              onNext={scroller.scrollNext}
            />
            <button
              type="button"
              onClick={onSeeAll}
              className="cursor-pointer text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
            >
              See all
            </button>
          </div>
        </div>
        <HorizontalScroller
          scrollerRef={scroller.ref}
          className="mt-4"
          contentClassName="gap-3.5"
          aria-label={title}
        >
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-24px' }}
              transition={{ duration: 0.38, ease: EASE, delay: Math.min(index, 6) * 0.04 }}
            >
              <MarketplaceTrackCard track={track} onSelect={() => onSelect(track.id)} />
            </motion.div>
          ))}
        </HorizontalScroller>
      </section>
    </SectionShell>
  )
}

function BundleCard({
  bundle,
  kind,
  reduce,
  index,
}: {
  bundle: ProducerBundle
  kind: 'collection' | 'pack'
  reduce: boolean | null
  index: number
}) {
  const isCollection = kind === 'collection'

  return (
    <motion.button
      type="button"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ duration: 0.38, ease: EASE, delay: Math.min(index, 5) * 0.045 }}
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      onClick={() =>
        toast.success(
          isCollection ? `Opening “${bundle.title}”` : `Sound pack “${bundle.title}” coming soon`,
        )
      }
      className="group w-37 shrink-0 cursor-pointer text-left outline-none sm:w-42"
    >
      <span className={cn('relative block aspect-square', isCollection && 'pt-3')}>
        {isCollection ? (
          <>
            <span
              aria-hidden
              className={cn(
                'absolute inset-x-3 top-0 aspect-square origin-top scale-[0.88] rounded-xl opacity-40 transition-transform duration-300 ease-out group-hover:-translate-y-1',
                bundle.cover,
              )}
            />
            <span
              aria-hidden
              className={cn(
                'absolute inset-x-1.5 top-1.5 aspect-square origin-top scale-[0.94] rounded-xl opacity-70 transition-transform duration-300 ease-out group-hover:-translate-y-0.5',
                bundle.cover,
              )}
            />
          </>
        ) : null}
        <span
          className={cn(
            'relative block aspect-square overflow-hidden rounded-xl transition-transform duration-300 ease-out',
            isCollection && 'group-hover:translate-y-0.5',
            bundle.cover,
          )}
        >
          <span className="absolute inset-0 grid place-items-center text-white/30 transition-colors duration-300 group-hover:bg-black/20">
            <span className="grid place-items-center transition-transform duration-300 ease-out group-hover:scale-110">
              {isCollection ? (
                <PlaylistIcon size={28} weight="duotone" />
              ) : (
                <PackageIcon size={28} weight="duotone" />
              )}
            </span>
          </span>
        </span>
      </span>
      <span className="mt-3 block truncate text-[14px] font-medium text-white">{bundle.title}</span>
      <span className="tnum mt-0.5 block text-[12px] text-ink-mute">
        {isCollection
          ? `${bundle.itemCount} ${bundle.itemCount === 1 ? 'track' : 'tracks'}`
          : `${bundle.itemCount} ${bundle.itemCount === 1 ? 'sound' : 'sounds'}`}
      </span>
    </motion.button>
  )
}

function BundleScrollerSection({
  title,
  bundles,
  kind,
  onSeeAll,
  reduce,
}: {
  title: string
  bundles: ProducerBundle[]
  kind: 'collection' | 'pack'
  onSeeAll: () => void
  reduce: boolean | null
}) {
  const scroller = useHorizontalScroller()
  if (bundles.length === 0) return null

  return (
    <SectionShell reduce={reduce}>
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[17px] font-medium tracking-[-0.02em] text-white">{title}</h2>
          <div className="flex shrink-0 items-center gap-2">
            <ScrollerNav
              canPrev={scroller.canPrev}
              canNext={scroller.canNext}
              onPrev={scroller.scrollPrev}
              onNext={scroller.scrollNext}
            />
            <button
              type="button"
              onClick={onSeeAll}
              className="cursor-pointer text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
            >
              See all
            </button>
          </div>
        </div>
        <HorizontalScroller
          scrollerRef={scroller.ref}
          className="mt-4"
          contentClassName="gap-3.5"
          aria-label={title}
        >
          {bundles.map((bundle, index) => (
            <BundleCard key={bundle.id} bundle={bundle} kind={kind} reduce={reduce} index={index} />
          ))}
        </HorizontalScroller>
      </section>
    </SectionShell>
  )
}

export default function ProducerPage() {
  const { producerSlug = '' } = useParams()
  return <ProducerPageContent key={producerSlug} producerSlug={producerSlug} />
}

function ProducerPageContent({ producerSlug }: { producerSlug: string }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const producer = getMarketplaceProducer(producerSlug)
  const [following, setFollowing] = useState(false)

  const tracks = useMemo(
    () => (producer ? getTracksByProducer(producer.name, undefined, 200) : []),
    [producer],
  )
  const popular = useMemo(
    () => (producer ? getProducerPopularTracks(producer.name, 8) : []),
    [producer],
  )
  const newest = useMemo(() => (producer ? getProducerNewTracks(producer.name, 8) : []), [producer])
  const collections = useMemo(
    () => (producer ? getProducerCollections(producer.slug) : []),
    [producer],
  )
  const soundPacks = useMemo(
    () => (producer ? getProducerSoundPacks(producer.slug) : []),
    [producer],
  )
  const stats = useMemo(() => (producer ? getProducerTrackStats(producer.name) : null), [producer])

  if (!producer || !stats) {
    return (
      <section className="h-full overflow-auto px-4 py-6 lg:px-6 lg:py-4">
        <Link
          to="/marketplace/explore"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
        >
          <ArrowLeftIcon size={14} />
          Back to explore
        </Link>
        <h1 className="mt-8 text-[28px] font-medium tracking-[-0.03em] text-white">
          Producer not found
        </h1>
        <p className="mt-2 max-w-md text-[15px] text-ink-mute">
          This creator isn’t in the marketplace catalog, or the link is outdated.
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

  const metaRows = [
    ['Tracks', String(stats.tracks)],
    ['Plays', formatPlayCount(stats.plays)],
    ['Followers', formatPlayCount(producer.followers)],
    ['Joined', formatJoined(producer.joinedAt)],
  ] as const

  return (
    <motion.section
      className="h-full overflow-auto px-4 py-6 pb-10 lg:px-6 lg:py-4"
      variants={reduce ? undefined : pageEnter}
      initial={reduce ? false : 'hidden'}
      animate="show"
    >
      <motion.div variants={reduce ? undefined : fadeUp}>
        <Link
          to="/marketplace/creators"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
        >
          <ArrowLeftIcon size={14} />
          Back to creators
        </Link>
      </motion.div>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <motion.aside
          variants={reduce ? undefined : asideEnter}
          className="max-w-75 space-y-5 lg:sticky lg:top-2 lg:max-w-none"
        >
          <motion.div
            variants={reduce ? undefined : coverPop}
            className={cn(
              'relative aspect-square w-full overflow-hidden rounded-2xl',
              producer.cover,
            )}
          >
            <motion.img
              src={producer.avatar}
              alt=""
              className="size-full object-cover"
              initial={reduce ? false : { scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
            <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
            {!producer.avatar ? (
              <span className="absolute inset-0 grid place-items-center text-[42px] font-semibold text-white/80">
                {initials(producer.name)}
              </span>
            ) : null}
          </motion.div>

          <motion.header variants={reduce ? undefined : fadeUp}>
            <h1 className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[26px] font-medium leading-tight tracking-[-0.03em] text-white">
              {producer.name}
              {producer.verified ? (
                <motion.span
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...springSoft, delay: 0.22 }}
                  className="inline-flex"
                >
                  <SealCheckIcon
                    size={18}
                    weight="fill"
                    className="shrink-0 text-sky-400"
                    aria-label="Verified"
                  />
                </motion.span>
              ) : null}
            </h1>
            <p className="mt-1 text-[14px] text-ink-mute">@{producer.username}</p>
          </motion.header>

          <motion.div variants={reduce ? undefined : fadeUp} className="flex items-center gap-2">
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { scale: 1.015 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={springTap}
              onClick={() => {
                setFollowing((value) => !value)
                toast.success(
                  following ? `Unfollowed ${producer.name}` : `Following ${producer.name}`,
                )
              }}
              className="inline-flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-white/8 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/12"
            >
              <UserPlusIcon size={16} />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={following ? 'following' : 'follow'}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  {following ? 'Following' : 'Follow'}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { scale: 1.06 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              transition={springTap}
              onClick={() => toast.success(`Message ${producer.name} coming soon`)}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-white/12"
              aria-label={`Message ${producer.name}`}
            >
              <ChatCenteredTextIcon size={17} />
            </motion.button>
            <motion.button
              type="button"
              whileHover={reduce ? undefined : { scale: 1.06 }}
              whileTap={reduce ? undefined : { scale: 0.94 }}
              transition={springTap}
              onClick={() => {
                const url = `${window.location.origin}${marketplaceProducerPath(producer.slug)}`
                void navigator.clipboard.writeText(url).then(
                  () => toast.success('Profile link copied'),
                  () => toast.success(`Share @${producer.username}`),
                )
              }}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-white/12"
              aria-label="Share producer"
            >
              <ShareNetworkIcon size={17} />
            </motion.button>
          </motion.div>

          <motion.section
            variants={reduce ? undefined : fadeUp}
            className="border-t border-white/8 pt-5"
          >
            <h2 className="text-[13px] font-medium text-ink-mute">About</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{producer.bio}</p>
            <motion.div
              variants={reduce ? undefined : chipRow}
              initial={reduce ? false : 'hidden'}
              animate="show"
              className="mt-3 flex flex-wrap gap-1.5"
            >
              {producer.genres.map((genre) => (
                <motion.span
                  key={genre}
                  variants={reduce ? undefined : chipItem}
                  className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-2"
                >
                  {genre}
                </motion.span>
              ))}
            </motion.div>
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
              className="flex items-center justify-between gap-3"
            >
              <dt className="text-ink-mute">Location</dt>
              <dd className="inline-flex items-center gap-1 text-ink-2">
                <MapPinIcon size={13} className="text-ink-mute" />
                {producer.location}
              </dd>
            </motion.div>
          </motion.dl>
        </motion.aside>

        <motion.div variants={reduce ? undefined : fadeUp} className="min-w-0 space-y-10">
          <TrackScrollerSection
            title="Popular"
            tracks={popular}
            reduce={reduce}
            onSelect={(id) => navigate(marketplaceTrackPath(id))}
            onSeeAll={() => toast.success(`See all popular from ${producer.name}`)}
          />

          <TrackScrollerSection
            title="New releases"
            tracks={newest}
            reduce={reduce}
            onSelect={(id) => navigate(marketplaceTrackPath(id))}
            onSeeAll={() => toast.success(`See all new releases from ${producer.name}`)}
          />

          <TrackScrollerSection
            title="Tracks"
            tracks={tracks}
            reduce={reduce}
            onSelect={(id) => navigate(marketplaceTrackPath(id))}
            onSeeAll={() => toast.success(`See all tracks from ${producer.name}`)}
          />

          <BundleScrollerSection
            title="Collections"
            bundles={collections}
            kind="collection"
            reduce={reduce}
            onSeeAll={() => toast.success(`See all collections from ${producer.name}`)}
          />

          <BundleScrollerSection
            title="Sound packs"
            bundles={soundPacks}
            kind="pack"
            reduce={reduce}
            onSeeAll={() => toast.success(`See all sound packs from ${producer.name}`)}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}