import { type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import MarketplaceTrackCard, {
  type MarketplaceTrack,
} from '@/components/shared/marketplace-track-card'
import CreatorsToWatch from '@/features/marketplace/components/explore/creators-to-watch'
import HorizontalScroller, {
  ScrollerNav,
} from '@/features/marketplace/components/explore/horizontal-scroller'
import { useHorizontalScroller } from '@/features/marketplace/components/explore/use-horizontal-scroller'
import {
  getMarketplaceTrack,
  getRelatedTracks,
  getTracksByProducer,
  MARKETPLACE_TRACKS,
  marketplaceTrackPath,
  type MarketplaceTrackDetail,
} from '@/features/marketplace/data/marketplace-tracks'

const EASE = [0.16, 1, 0.3, 1] as const

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

/** Mock taste profile — stands in for listening / purchase history. */
const TASTE = {
  genres: ['Amapiano', 'Afrobeats', 'R&B'] as const,
  seedTrackId: 'night-market',
  followedProducers: ['Jules', 'Amara', 'Kelu'] as const,
}

function toCardTrack(track: MarketplaceTrackDetail): MarketplaceTrack {
  return {
    id: track.id,
    title: track.title,
    producer: track.producer,
    genre: track.genre,
    bpm: track.bpm,
    priceLabel: track.priceLabel,
    cover: track.cover,
    verified: track.verified,
    freeDownload: track.freeDownload,
  }
}

function pickByGenre(genre: string, limit = 10, excludeIds?: Set<string>) {
  return MARKETPLACE_TRACKS.filter(
    (track) =>
      track.genres.includes(genre) && !(excludeIds?.has(track.id) ?? false),
  )
    .slice(0, limit)
    .map(toCardTrack)
}

function pickTodaysMix(limit = 12) {
  const seed = getMarketplaceTrack(TASTE.seedTrackId)
  const related = seed ? getRelatedTracks(seed, 8) : []
  const genreHits = TASTE.genres.flatMap((genre) =>
    MARKETPLACE_TRACKS.filter((track) => track.genres.includes(genre)),
  )

  const seen = new Set<string>()
  const out: MarketplaceTrack[] = []
  for (const track of [...related, ...genreHits, ...MARKETPLACE_TRACKS]) {
    if (seen.has(track.id)) continue
    seen.add(track.id)
    out.push(toCardTrack(track))
    if (out.length >= limit) break
  }
  return out
}

function pickFromFollowed(limit = 10) {
  const rows = TASTE.followedProducers.flatMap((name) =>
    getTracksByProducer(name, undefined, 4),
  )
  const seen = new Set<string>()
  const out: MarketplaceTrack[] = []
  for (const track of rows) {
    if (seen.has(track.id)) continue
    seen.add(track.id)
    out.push(toCardTrack(track))
    if (out.length >= limit) break
  }
  return out
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

function TrackRail({
  title,
  tracks,
  seeAllTo,
  className = 'mt-10',
  reduce,
}: {
  title: string
  tracks: MarketplaceTrack[]
  seeAllTo?: string
  className?: string
  reduce: boolean | null
}) {
  const navigate = useNavigate()
  const scroller = useHorizontalScroller()
  if (tracks.length === 0) return null

  return (
    <SectionShell reduce={reduce}>
      <section className={className}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white sm:text-[20px] lg:text-[22px]">
              {title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-end">
            <ScrollerNav
              canPrev={scroller.canPrev}
              canNext={scroller.canNext}
              onPrev={scroller.scrollPrev}
              onNext={scroller.scrollNext}
            />
            {seeAllTo ? (
              <Link
                to={seeAllTo}
                className="text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
              >
                See all
              </Link>
            ) : null}
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
              whileHover={reduce ? undefined : { y: -3 }}
            >
              <MarketplaceTrackCard
                track={track}
                onSelect={() => navigate(marketplaceTrackPath(track.id))}
              />
            </motion.div>
          ))}
        </HorizontalScroller>
      </section>
    </SectionShell>
  )
}

export default function MadeForYouPage() {
  const reduce = useReducedMotion()
  const seed = getMarketplaceTrack(TASTE.seedTrackId)
  const todaysMix = pickTodaysMix()
  const becauseGenre = pickByGenre(TASTE.genres[0])
  const moreLike = seed ? getRelatedTracks(seed, 10).map(toCardTrack) : []
  const fromFollowed = pickFromFollowed()
  const becauseAfrobeats = pickByGenre(
    TASTE.genres[1],
    10,
    new Set(becauseGenre.map((t) => t.id)),
  )

  return (
    <motion.section
      className="h-full overflow-auto px-4 py-6 lg:px-6 lg:py-4"
      variants={reduce ? undefined : pageEnter}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
    >
      <motion.header variants={reduce ? undefined : fadeUp}>
        <h1 className="text-[24px] font-medium tracking-[-0.03em] text-white sm:text-[26px] lg:text-[32px]">
          Made for you
        </h1>
      </motion.header>

      <TrackRail
        className="mt-8"
        title="Today's mix"
        tracks={todaysMix}
        seeAllTo="/marketplace/tracks"
        reduce={reduce}
      />

      <TrackRail
        title={`Because you like ${TASTE.genres[0]}`}
        tracks={becauseGenre}
        seeAllTo="/marketplace/genres"
        reduce={reduce}
      />

      <TrackRail
        title={seed ? `More like ${seed.title}` : 'You may also like'}
        tracks={moreLike}
        seeAllTo="/marketplace/tracks"
        reduce={reduce}
      />

      <TrackRail
        title="From producers you follow"
        tracks={fromFollowed}
        seeAllTo="/marketplace/creators"
        reduce={reduce}
      />

      <TrackRail
        title={`Because you like ${TASTE.genres[1]}`}
        tracks={becauseAfrobeats}
        seeAllTo="/marketplace/genres"
        reduce={reduce}
      />

      <SectionShell reduce={reduce}>
        <CreatorsToWatch title="Creators for you" showSubtitle={false} animate={!reduce} />
      </SectionShell>
    </motion.section>
  )
}
