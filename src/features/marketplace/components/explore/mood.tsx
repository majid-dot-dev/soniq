import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import type { GenreMesh, MeshBlob } from '@/features/marketplace/data/marketplace-genres'
import {
  MARKETPLACE_MOOD_SEED,
  meshForMoodSlug,
  moodMatchKeys,
  type MarketplaceMoodTerm,
} from '@/features/marketplace/data/marketplace-moods'
import { MARKETPLACE_TRACKS } from '@/features/marketplace/data/marketplace-tracks'
import HorizontalScroller, {
  ScrollerNav,
} from '@/features/marketplace/components/explore/horizontal-scroller'
import { useHorizontalScroller } from '@/features/marketplace/components/explore/use-horizontal-scroller'

const EASE = [0.16, 1, 0.3, 1] as const

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

/** Flagship moods for the Explore rail (order is intentional). */
const RAIL_SLUGS = [
  'dark',
  'melodic',
  'energetic',
  'chill',
  'emotional',
  'hype',
  'aggressive',
  'dreamy',
] as const

type MoodCardModel = MarketplaceMoodTerm &
  GenreMesh & {
    trackCount: number
  }

function blobsToBackground(blobs: MeshBlob[]) {
  return blobs
    .map((blob) => {
      const shape = blob.shape ?? 'circle'
      const falloff = blob.falloff ?? '55%'
      return `radial-gradient(in oklab ${shape} at ${blob.at}, ${blob.color} 0%, transparent ${falloff})`
    })
    .join(', ')
}

function moodTracksPath(label: string) {
  return `/marketplace/tracks?mood=${encodeURIComponent(label)}`
}

function countTracksForMood(term: MarketplaceMoodTerm) {
  const keys = new Set(moodMatchKeys(term))
  return MARKETPLACE_TRACKS.filter((track) =>
    track.tags.some((tag) => keys.has(tag.toLowerCase())),
  ).length
}

function buildRailMoods(moods?: MoodCardModel[]): MoodCardModel[] {
  if (moods) return moods

  const bySlug = new Map(MARKETPLACE_MOOD_SEED.map((term) => [term.slug, term]))
  return RAIL_SLUGS.flatMap((slug) => {
    const term = bySlug.get(slug)
    if (!term) return []
    const mesh = meshForMoodSlug(term.slug)
    return [
      {
        ...term,
        ...mesh,
        trackCount: countTracksForMood(term),
      } satisfies MoodCardModel,
    ]
  })
}

function MeshBackdrop({ base, blobs }: { base: string; blobs: MeshBlob[] }) {
  const meshStyle = {
    backgroundColor: base,
    backgroundImage: blobsToBackground(blobs),
  } satisfies CSSProperties

  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-28%] scale-[1.05] blur-[42px] saturate-[1.35]"
        style={meshStyle}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-55"
        style={meshStyle}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.45)_100%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
      />
    </>
  )
}

function MoodCard({
  mood,
  reduce,
}: {
  mood: MoodCardModel
  reduce: boolean | null
}) {
  return (
    <Link
      to={moodTracksPath(mood.label)}
      className="group block w-[140px] shrink-0 outline-none sm:w-[160px]"
    >
      <motion.span
        whileHover={reduce ? undefined : { scale: 1.03 }}
        whileTap={reduce ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative isolate block aspect-square overflow-hidden rounded-[18px] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-white/35"
        style={{ backgroundColor: mood.base }}
      >
        <MeshBackdrop base={mood.base} blobs={mood.blobs} />

        <span className="relative z-10 grid size-full place-items-center px-3 text-center sm:px-4">
          <span className="min-w-0">
            <span className="block truncate text-[16px] font-semibold tracking-[-0.03em] text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)] sm:text-[18px]">
              {mood.label}
            </span>
            <span className="tnum mt-1 block text-[11px] text-white/70 sm:text-[12px]">
              {mood.trackCount.toLocaleString('en-US')}{' '}
              {mood.trackCount === 1 ? 'track' : 'tracks'}
            </span>
          </span>
        </span>
      </motion.span>
    </Link>
  )
}

export default function Mood({ moods }: { moods?: MoodCardModel[] }) {
  const scroller = useHorizontalScroller()
  const reduce = useReducedMotion()
  const items = buildRailMoods(moods)

  return (
    <section className="mt-10 pb-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-medium tracking-[-0.02em] text-white sm:text-[20px] lg:text-[22px]">
            Browse by mood
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ScrollerNav
            canPrev={scroller.canPrev}
            canNext={scroller.canNext}
            onPrev={scroller.scrollPrev}
            onNext={scroller.scrollNext}
          />
          <Link
            to="/marketplace/moods"
            className="text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
          >
            See all
          </Link>
        </div>
      </div>

      <HorizontalScroller
        scrollerRef={scroller.ref}
        className="mt-3 pt-2 pb-2"
        contentClassName="gap-3"
        aria-label="Browse by mood"
      >
        {items.map((mood) => (
          <MoodCard key={mood.slug} mood={mood} reduce={reduce} />
        ))}
      </HorizontalScroller>
    </section>
  )
}
