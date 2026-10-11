import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import {
  CaretDownIcon,
  ListIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
  WaveformIcon,
  XIcon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import MarketplaceTrackCard from '@/components/shared/marketplace-track-card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ChartTrackRow, {
  type ChartTrack,
} from '@/features/marketplace/components/charts/chart-track-row'
import { MARKETPLACE_GENRE_SEED } from '@/features/marketplace/data/marketplace-genres'
import { MARKETPLACE_MOOD_SEED } from '@/features/marketplace/data/marketplace-moods'
import {
  MARKETPLACE_INSTRUMENTS,
  MARKETPLACE_TRACKS,
  marketplaceTrackPath,
  type MarketplaceTrackDetail,
} from '@/features/marketplace/data/marketplace-tracks'
import { cn } from '@/lib/utils'

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

type SortKey = 'popular' | 'newest' | 'az' | 'price'
type ViewMode = 'list' | 'grid'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'az', label: 'A–Z' },
  { id: 'price', label: 'Price: low to high' },
]

/** Buyer-facing multi-select filters (studio table minus status). */
type FilterId = 'genre' | 'mood' | 'bpm' | 'key' | 'price' | 'instrument'

type CatalogFilters = Record<FilterId, string[]>

const DEFAULT_FILTERS: CatalogFilters = {
  genre: [],
  mood: [],
  bpm: [],
  key: [],
  price: [],
  instrument: [],
}

const BPM_OPTIONS = ['Under 100', '100–130', '130+'] as const
const PRICE_OPTIONS = ['Under $30', '$30–$50', '$50+'] as const

const LEGACY_MOOD_OPTIONS = [
  'Warm',
  'Dark',
  'Bright',
  'Soft',
  'Melodic',
  'Moody',
  'Atmospheric',
  'Energy',
  'Hard',
  'Intimate',
  'Sunset',
] as const

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

const GENRE_OPTIONS = uniqueSorted([
  ...MARKETPLACE_GENRE_SEED.map((genre) => genre.label),
  ...MARKETPLACE_TRACKS.flatMap((t) => t.genres),
])
const MOOD_OPTIONS = uniqueSorted([
  ...MARKETPLACE_MOOD_SEED.map((mood) => mood.label),
  ...LEGACY_MOOD_OPTIONS,
])
const KEY_OPTIONS = uniqueSorted(MARKETPLACE_TRACKS.map((t) => t.key))
const INSTRUMENT_OPTIONS = uniqueSorted([
  ...MARKETPLACE_INSTRUMENTS,
  ...MARKETPLACE_TRACKS.flatMap((t) => t.instruments),
])

const FILTER_MENUS: {
  id: FilterId
  label: string
  options: readonly string[]
}[] = [
  { id: 'genre', label: 'Genre', options: GENRE_OPTIONS },
  { id: 'mood', label: 'Mood', options: MOOD_OPTIONS },
  { id: 'instrument', label: 'Instrument', options: INSTRUMENT_OPTIONS },
  { id: 'bpm', label: 'BPM', options: BPM_OPTIONS },
  { id: 'key', label: 'Key', options: KEY_OPTIONS },
  { id: 'price', label: 'Price', options: PRICE_OPTIONS },
]

function toChartTrack(track: MarketplaceTrackDetail): ChartTrack {
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
    plays: track.plays,
  }
}

function priceValue(label: string) {
  const n = Number(label.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function matchesBpm(bpm: number, buckets: string[]) {
  if (buckets.length === 0) return true
  return buckets.some((filter) => {
    if (filter === 'Under 100') return bpm < 100
    if (filter === '100–130') return bpm >= 100 && bpm <= 130
    return bpm > 130
  })
}

function matchesPrice(label: string, buckets: string[]) {
  if (buckets.length === 0) return true
  const amount = priceValue(label)
  return buckets.some((filter) => {
    if (filter === 'Under $30') return amount < 30
    if (filter === '$30–$50') return amount >= 30 && amount <= 50
    return amount > 50
  })
}

function matchesAny(haystack: string[], selected: string[]) {
  if (selected.length === 0) return true
  const set = new Set(haystack.map((item) => item.toLowerCase()))
  return selected.some((value) => set.has(value.toLowerCase()))
}

function matchesQuery(track: MarketplaceTrackDetail, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    track.title,
    track.producer,
    track.genre,
    track.key,
    ...track.genres,
    ...track.tags,
    ...track.instruments,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export default function AllTracksPage() {
  const [params] = useSearchParams()
  const legacyTrackId = params.get('track')?.trim()
  if (legacyTrackId) {
    return <Navigate to={marketplaceTrackPath(legacyTrackId)} replace />
  }

  const genreParam = params.get('genre')?.trim() ?? ''
  const moodParam = params.get('mood')?.trim() ?? ''
  const initialGenre = genreParam || null
  const initialMood = moodParam || null

  return <AllTracksCatalog initialGenre={initialGenre} initialMood={initialMood} />
}

function AllTracksCatalog({
  initialGenre,
  initialMood,
}: {
  initialGenre: string | null
  initialMood: string | null
}) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const searchRef = useRef<HTMLInputElement>(null)
  const [filters, setFilters] = useState<CatalogFilters>(() => ({
    ...DEFAULT_FILTERS,
    ...(initialGenre ? { genre: [initialGenre] } : null),
    ...(initialMood ? { mood: [initialMood] } : null),
  }))
  const [sort, setSort] = useState<SortKey>('popular')
  const [view, setView] = useState<ViewMode>('list')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  function setFilterValues(id: FilterId, values: string[]) {
    setFilters((current) => ({ ...current, [id]: values }))
  }

  function toggleFilter(id: FilterId, value: string) {
    setFilters((current) => ({
      ...current,
      [id]: toggleValue(current[id], value),
    }))
  }

  function clearAllFilters() {
    setFilters(DEFAULT_FILTERS)
    setQuery('')
    setSearchOpen(false)
  }

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const tracks = useMemo(() => {
    const rows = MARKETPLACE_TRACKS.filter((track) => {
      if (!matchesQuery(track, query)) return false
      if (!matchesAny(track.genres, filters.genre)) return false
      if (!matchesAny(track.tags, filters.mood)) return false
      if (!matchesAny(track.instruments, filters.instrument)) return false
      if (!matchesAny([track.key], filters.key)) return false
      if (!matchesBpm(track.bpm, filters.bpm)) return false
      if (!matchesPrice(track.priceLabel, filters.price)) return false
      return true
    }).slice()

    rows.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return b.publishedAt.localeCompare(a.publishedAt) || b.plays - a.plays
        case 'az':
          return a.title.localeCompare(b.title)
        case 'price':
          return priceValue(a.priceLabel) - priceValue(b.priceLabel)
        case 'popular':
        default:
          return b.plays - a.plays
      }
    })

    return rows.map(toChartTrack)
  }, [filters, query, sort])

  const appliedChips = [
    ...(query.trim()
      ? [
          {
            id: 'query',
            label: `Search: “${query.trim()}”`,
            onClear: () => {
              setQuery('')
              setSearchOpen(false)
            },
          },
        ]
      : []),
    ...FILTER_MENUS.flatMap((menu) =>
      filters[menu.id].map((value) => ({
        id: `${menu.id}:${value}`,
        label: `${menu.label}: ${value}`,
        onClear: () => toggleFilter(menu.id, value),
      })),
    ),
  ]

  const sortLabel = SORTS.find((option) => option.id === sort)?.label ?? 'Popular'

  return (
    <motion.section
      className="flex h-full flex-col overflow-hidden px-4 pt-6 lg:px-6 lg:pt-6"
      variants={reduce ? undefined : pageEnter}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
    >
      <div className="shrink-0">
        <motion.header variants={reduce ? undefined : fadeUp}>
          <h1 className="text-[32px] font-medium tracking-[-0.03em] text-white">All Tracks</h1>
        </motion.header>

        <div className="mt-4 border-b border-white/10">
          <motion.div
            variants={reduce ? undefined : fadeUp}
            className="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_MENUS.map((menu) => (
                <FilterDropdown
                  key={menu.id}
                  label={menu.label}
                  values={filters[menu.id]}
                  options={menu.options}
                  onToggle={(value) => toggleFilter(menu.id, value)}
                  onClear={() => setFilterValues(menu.id, [])}
                />
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
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

              <DropdownMenu>
                <motion.div
                  layout={!reduce}
                  className="inline-flex overflow-hidden rounded-xl"
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <DropdownMenuTrigger className="inline-flex h-9 w-full cursor-pointer items-center gap-2 bg-white/8 px-3.5 text-[13px] font-medium text-white outline-none transition-colors hover:bg-white/12 data-popup-open:bg-white/12">
                    <span className="shrink-0 text-ink-mute">Sort</span>
                    <motion.span
                      key={sort}
                      layout={!reduce ? 'position' : false}
                      initial={reduce ? false : { opacity: 0.35 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.22, ease: EASE }}
                      className="whitespace-nowrap"
                    >
                      {sortLabel}
                    </motion.span>
                    <CaretDownIcon size={12} weight="bold" className="shrink-0 opacity-60" />
                  </DropdownMenuTrigger>
                </motion.div>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="min-w-48 rounded-xl bg-[#161618] p-1.5 text-ink ring-white/12"
                >
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => setSort(value as SortKey)}
                  >
                    {SORTS.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.id}
                        value={option.id}
                        className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
                      >
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center rounded-xl bg-white/8 p-0.5">
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                  onClick={() => setView('list')}
                  className={cn(
                    'grid size-8 cursor-pointer place-items-center rounded-lg transition-colors',
                    view === 'list' ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
                  )}
                >
                  <ListIcon size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                  onClick={() => setView('grid')}
                  className={cn(
                    'grid size-8 cursor-pointer place-items-center rounded-lg transition-colors',
                    view === 'grid' ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
                  )}
                >
                  <SquaresFourIcon size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {appliedChips.length > 0 ? (
            <motion.div
              variants={reduce ? undefined : fadeUp}
              className="flex flex-wrap items-center gap-1.5 border-t border-white/10 py-3"
            >
              {appliedChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.onClear}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 py-1 pr-1.5 pl-2.5 text-[12px] font-medium text-white transition-colors hover:bg-white/14"
                >
                  {chip.label}
                  <span className="grid size-4 place-items-center rounded-full bg-white/10">
                    <XIcon size={10} weight="bold" />
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="cursor-pointer px-2 py-1 text-[12px] font-medium text-ink-mute transition-colors hover:text-white"
              >
                Clear all
              </button>
            </motion.div>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto pb-6">
        {tracks.length === 0 ? (
          <motion.div
            variants={reduce ? undefined : fadeUp}
            className="mt-10 rounded-2xl bg-white/3 px-6 py-12 text-center"
          >
            {/* <span className="mx-auto grid size-12 place-items-center rounded-full bg-white/8 text-ink-mute"> */}
            <WaveformIcon size={22} weight="duotone" className="text-white mx-auto" />
            {/* </span> */}
            <p className="mt-4 text-[15px] font-medium text-white">No tracks match</p>
            <p className="mt-1.5 text-[13px] text-ink-mute">
              Try clearing a filter or choosing a different combination.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-5 cursor-pointer rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/14"
            >
              Clear filters
            </button>
          </motion.div>
        ) : view === 'list' ? (
          <ol className="mt-4 divide-y divide-white/6">
            {tracks.map((track, index) => (
              <motion.li
                key={track.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  duration: 0.36,
                  ease: EASE,
                  delay: Math.min(index, 10) * 0.03,
                }}
              >
                <ChartTrackRow track={track} />
              </motion.li>
            ))}
          </ol>
        ) : (
          <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(9.25rem,1fr))] gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))]">
            {tracks.map((track, index) => (
              <motion.li
                key={track.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  duration: 0.36,
                  ease: EASE,
                  delay: Math.min(index, 10) * 0.03,
                }}
              >
                <MarketplaceTrackCard
                  track={track}
                  className="w-full sm:w-full"
                  onSelect={() => navigate(marketplaceTrackPath(track.id))}
                />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.section>
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
            animate={{ width: 220, opacity: 1 }}
            exit={reduce ? undefined : { width: 36, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="flex h-9 items-center gap-2 overflow-hidden rounded-xl bg-white/8 px-3"
          >
            <MagnifyingGlassIcon size={16} className="shrink-0 text-ink-mute" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onBlur={onClose}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  onClear()
                  ;(event.target as HTMLInputElement).blur()
                }
              }}
              placeholder="Search tracks…"
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
            aria-label="Search tracks"
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

function FilterDropdown({
  label,
  values,
  options,
  onToggle,
  onClear,
}: {
  label: string
  values: string[]
  options: readonly string[]
  onToggle: (value: string) => void
  onClear: () => void
}) {
  const active = values.length > 0
  const summary =
    values.length === 0 ? 'All' : values.length === 1 ? values[0] : `${values.length} selected`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl px-3.5 text-[13px] font-medium outline-none transition-colors',
          active
            ? 'bg-white/14 text-white'
            : 'bg-white/8 text-white hover:bg-white/12 data-popup-open:bg-white/12',
        )}
      >
        <span className="text-ink-mute">{label}</span>
        <span className="max-w-28 truncate">{summary}</span>
        <CaretDownIcon size={12} weight="bold" className="opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="max-h-72 min-w-48 overflow-y-auto rounded-xl bg-[#161618] p-1.5 text-ink ring-white/12"
      >
        {active ? (
          <button
            type="button"
            onClick={onClear}
            className="mb-1 w-full cursor-pointer rounded-lg px-2.5 py-2 text-left text-[12px] font-medium text-ink-mute transition-colors hover:bg-white/8 hover:text-white"
          >
            Clear {label.toLowerCase()}
          </button>
        ) : null}
        {options.map((option) => {
          const checked = values.includes(option)
          return (
            <DropdownMenuCheckboxItem
              key={option}
              checked={checked}
              closeOnClick={false}
              onCheckedChange={() => onToggle(option)}
              className="cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
            >
              {option}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}