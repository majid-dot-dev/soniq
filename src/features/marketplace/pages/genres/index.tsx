import { useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  genreMatchKeys,
  MARKETPLACE_GENRE_SEED,
  meshForGenreSlug,
  type GenreMesh,
  type MarketplaceGenreTerm,
  type MeshBlob,
} from '@/features/marketplace/data/marketplace-genres'
import { MARKETPLACE_TRACKS } from '@/features/marketplace/data/marketplace-tracks'
import { useGenres } from '@/features/tracks/services/taxonomy'

const EASE = [0.16, 1, 0.3, 1] as const

const pageEnter = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
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

/** Soft film grain — breaks banding on wide mesh fades. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

type GenreCardModel = MarketplaceGenreTerm &
  GenreMesh & {
    trackCount: number
  }

function blobsToBackground(blobs: MeshBlob[]) {
  return blobs
    .map((blob) => {
      const shape = blob.shape ?? 'circle'
      const falloff = blob.falloff ?? '55%'
      // `in oklab` keeps falloffs vivid — sRGB overlaps muddy toward grey.
      return `radial-gradient(in oklab ${shape} at ${blob.at}, ${blob.color} 0%, transparent ${falloff})`
    })
    .join(', ')
}

function genreTracksPath(label: string) {
  return `/marketplace/tracks?genre=${encodeURIComponent(label)}`
}

function countTracksForGenre(term: MarketplaceGenreTerm) {
  const keys = new Set(genreMatchKeys(term))
  return MARKETPLACE_TRACKS.filter((track) =>
    track.genres.some((genre) => keys.has(genre.toLowerCase())),
  ).length
}

export default function GenresPage() {
  const reduce = useReducedMotion()
  const searchRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const genresQuery = useGenres()

  const genres = useMemo(() => {
    const terms: MarketplaceGenreTerm[] =
      genresQuery.data && genresQuery.data.length > 0
        ? genresQuery.data
            .filter((term) => term.active !== false)
            .map((term) => ({
              slug: term.slug,
              label: term.label,
              aliases: term.aliases,
            }))
        : MARKETPLACE_GENRE_SEED

    const q = query.trim().toLowerCase()
    const rows = terms
      .filter((term) => {
        if (!q) return true
        return genreMatchKeys(term).some((key) => key.includes(q))
      })
      .map((term) => {
        const mesh = meshForGenreSlug(term.slug)
        return {
          ...term,
          ...mesh,
          trackCount: countTracksForGenre(term),
        } satisfies GenreCardModel
      })

    // Keep taxonomy order; park "Other" at the end.
    return rows.sort((a, b) => {
      if (a.slug === 'other') return 1
      if (b.slug === 'other') return -1
      return 0
    })
  }, [genresQuery.data, query])

  return (
    <motion.section
      className="h-full overflow-auto px-4 pt-6 pb-8 lg:px-6 lg:pt-6"
      variants={reduce ? undefined : pageEnter}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
    >
      <motion.header
        variants={reduce ? undefined : fadeUp}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <h1 className="text-[24px] font-medium tracking-[-0.03em] text-white sm:text-[26px] lg:text-[32px]">
            Genres
          </h1>
        </div>

        <ExpandableSearch
          open={searchOpen || query.length > 0}
          query={query}
          inputRef={searchRef}
          reduce={reduce}
          onOpen={() => setSearchOpen(true)}
          onQueryChange={setQuery}
          onClose={() => {
            if (!query.trim()) setSearchOpen(false)
          }}
          onClear={() => {
            setQuery('')
            setSearchOpen(false)
          }}
        />
      </motion.header>

      {genres.length === 0 ? (
        <motion.div
          variants={reduce ? undefined : fadeUp}
          className="mt-10 rounded-2xl bg-white/[0.03] px-6 py-12 text-center"
        >
          <p className="text-[15px] font-medium text-white">No genres match</p>
          <p className="mt-1.5 text-[13px] text-ink-mute">Try a different search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setSearchOpen(false)
            }}
            className="mt-5 cursor-pointer rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/14"
          >
            Clear search
          </button>
        </motion.div>
      ) : (
        <motion.ul
          variants={reduce ? undefined : fadeUp}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {genres.map((genre, index) => (
            <motion.li
              key={genre.slug}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{
                duration: 0.38,
                ease: EASE,
                delay: Math.min(index, 10) * 0.03,
              }}
            >
              <GenreCard genre={genre} reduce={reduce} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.section>
  )
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

function GenreCard({
  genre,
  reduce,
}: {
  genre: GenreCardModel
  reduce: boolean | null
}) {
  return (
    <Link to={genreTracksPath(genre.label)} className="group block outline-none">
      <motion.span
        whileHover={reduce ? undefined : { y: -4, scale: 1.02 }}
        whileTap={reduce ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative isolate block aspect-square overflow-hidden rounded-[18px] shadow-[0_8px_28px_-12px_rgba(0,0,0,0.55)] transition-[box-shadow] duration-300 group-hover:shadow-[0_18px_48px_-16px_rgba(0,0,0,0.65)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-white/35"
        style={{ backgroundColor: genre.base }}
      >
        <MeshBackdrop base={genre.base} blobs={genre.blobs} />

        <span className="relative z-10 grid size-full place-items-center px-4 text-center">
          <span className="min-w-0">
            <span className="block truncate text-[18px] font-semibold tracking-[-0.03em] text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)] sm:text-[20px]">
              {genre.label}
            </span>
            <span className="tnum mt-1 block text-[12px] text-white/70 sm:text-[13px]">
              {genre.trackCount.toLocaleString('en-US')}{' '}
              {genre.trackCount === 1 ? 'track' : 'tracks'}
            </span>
          </span>
        </span>
      </motion.span>
    </Link>
  )
}

function ExpandableSearch({
  open,
  query,
  inputRef,
  reduce,
  onOpen,
  onQueryChange,
  onClose,
  onClear,
}: {
  open: boolean
  query: string
  inputRef: RefObject<HTMLInputElement | null>
  reduce: boolean | null
  onOpen: () => void
  onQueryChange: (value: string) => void
  onClose: () => void
  onClear: () => void
}) {
  return (
    <div className="flex h-9 items-center">
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <motion.label
            key="search-field"
            initial={reduce ? false : { width: 36, opacity: 0.7 }}
            animate={{ width: 'min(220px, 55vw)', opacity: 1 }}
            exit={reduce ? undefined : { width: 36, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="flex h-9 items-center gap-2 overflow-hidden rounded-xl bg-white/8 px-3"
          >
            <MagnifyingGlassIcon size={16} className="shrink-0 text-ink-mute" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              autoFocus
              onChange={(event) => onQueryChange(event.target.value)}
              onBlur={onClose}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  onClear()
                  ;(event.target as HTMLInputElement).blur()
                }
              }}
              placeholder="Search genres…"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onMouseDown={(event) => event.preventDefault()}
                onClick={onClear}
                className="grid size-5 shrink-0 cursor-pointer place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/10 hover:text-white"
              >
                <XIcon size={11} weight="bold" />
              </button>
            ) : null}
          </motion.label>
        ) : (
          <motion.button
            key="search-icon"
            type="button"
            aria-label="Search genres"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onOpen}
            className="grid size-9 cursor-pointer place-items-center rounded-xl bg-white/8 text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
          >
            <MagnifyingGlassIcon size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
