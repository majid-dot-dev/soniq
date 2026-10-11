import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CaretDownIcon,
  HeartIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  SquaresFourIcon,
  XIcon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import MarketplaceTrackCard from '@/components/shared/marketplace-track-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ChartTrackRow, {
  type ChartTrack,
} from '@/features/marketplace/components/charts/chart-track-row'
import {
  getMarketplaceProducer,
  getProducerSoundPacks,
  MARKETPLACE_PRODUCERS,
  type ProducerBundle,
} from '@/features/marketplace/data/marketplace-producers'
import {
  getMarketplaceTrack,
  marketplaceTrackPath,
  type MarketplaceTrackDetail,
} from '@/features/marketplace/data/marketplace-tracks'
import { toast } from '@/lib/toast'
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

type FavoritesTab = 'tracks' | 'packs'
type SortKey = 'recent' | 'popular' | 'az' | 'price'
type ViewMode = 'list' | 'grid'

const TABS: { id: FavoritesTab; label: string }[] = [
  { id: 'tracks', label: 'Tracks' },
  { id: 'packs', label: 'Sound packs' },
]

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'recent', label: 'Recently liked' },
  { id: 'popular', label: 'Popular' },
  { id: 'az', label: 'A–Z' },
  { id: 'price', label: 'Price: low to high' },
]

/** Mock liked tracks — newest likes first. */
const FAVORITE_TRACK_IDS: string[] = [
  'night-market',
  'glass-city',
  'half-light',
  'after-service',
  'quiet-riot',
  'blue-hour',
  'palm-wine',
  'soft-landing',
  'iron-choir',
  'harmattan',
  'sunday-drive',
  'concrete-garden',
]

/** Mock liked sound packs — newest likes first. */
const FAVORITE_PACK_IDS: string[] = [
  'jules-log-drum-kit',
  'nao-808-lab',
  'kelu-gqom-kit',
  'amara-keys',
  'jules-pad-bank',
  'nao-drill-drums',
]

type FavoritePack = ProducerBundle & { producer: string }

const ALL_PACKS: FavoritePack[] = MARKETPLACE_PRODUCERS.flatMap((producer) =>
  getProducerSoundPacks(producer.slug).map((pack) => ({
    ...pack,
    producer: producer.name,
  })),
)

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

function matchesTrackQuery(track: MarketplaceTrackDetail, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    track.title,
    track.producer,
    track.genre,
    track.key,
    ...track.genres,
    ...track.tags,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

function matchesPackQuery(pack: FavoritePack, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [pack.title, pack.subtitle, pack.producer, pack.priceLabel]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export default function FavoritesPage() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const searchRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<FavoritesTab>('tracks')
  const [sort, setSort] = useState<SortKey>('recent')
  const [view, setView] = useState<ViewMode>('list')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const tracks = useMemo(() => {
    const order = new Map(FAVORITE_TRACK_IDS.map((id, index) => [id, index]))
    const rows = FAVORITE_TRACK_IDS.map((id) => getMarketplaceTrack(id))
      .filter((track): track is MarketplaceTrackDetail => track != null)
      .filter((track) => matchesTrackQuery(track, query))

    rows.sort((a, b) => {
      switch (sort) {
        case 'popular':
          return b.plays - a.plays
        case 'az':
          return a.title.localeCompare(b.title)
        case 'price':
          return priceValue(a.priceLabel) - priceValue(b.priceLabel)
        case 'recent':
        default:
          return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
      }
    })

    return rows.map(toChartTrack)
  }, [query, sort])

  const packs = useMemo(() => {
    const order = new Map(FAVORITE_PACK_IDS.map((id, index) => [id, index]))
    const rows = FAVORITE_PACK_IDS.map((id) => ALL_PACKS.find((pack) => pack.id === id)).filter(
      (pack): pack is FavoritePack => pack != null,
    ).filter((pack) => matchesPackQuery(pack, query))

    rows.sort((a, b) => {
      switch (sort) {
        case 'popular':
          return b.itemCount - a.itemCount
        case 'az':
          return a.title.localeCompare(b.title)
        case 'price':
          return priceValue(a.priceLabel) - priceValue(b.priceLabel)
        case 'recent':
        default:
          return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
      }
    })

    return rows
  }, [query, sort])

  const sortLabel = SORTS.find((option) => option.id === sort)?.label ?? 'Recently liked'
  const activeCount = tab === 'tracks' ? tracks.length : packs.length
  const libraryEmpty =
    tab === 'tracks' ? FAVORITE_TRACK_IDS.length === 0 : FAVORITE_PACK_IDS.length === 0

  return (
    <motion.section
      className="flex h-full flex-col overflow-hidden px-4 pt-6 lg:px-6 lg:pt-6"
      variants={reduce ? undefined : pageEnter}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
    >
      <div className="shrink-0">
        <motion.header variants={reduce ? undefined : fadeUp}>
          <h1 className="text-[32px] font-medium tracking-[-0.03em] text-white">Favorites</h1>
        </motion.header>

        <div className="mt-4 border-b border-white/10">
          <motion.div
            variants={reduce ? undefined : fadeUp}
            className="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div className="flex items-center rounded-xl bg-white/8 p-0.5">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    'cursor-pointer rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                    tab === item.id
                      ? 'bg-white/12 text-white'
                      : 'text-ink-mute hover:text-white',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <ExpandableSearch
                open={searchOpen || query.length > 0}
                query={query}
                inputRef={searchRef}
                reduce={reduce}
                placeholder={tab === 'tracks' ? 'Search tracks…' : 'Search sound packs…'}
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
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto pb-6">
        {libraryEmpty ? (
          <EmptyFavorites
            reduce={reduce}
            title={tab === 'tracks' ? 'No favorite tracks yet' : 'No favorite sound packs yet'}
            description={
              tab === 'tracks'
                ? 'Like beats while browsing and they’ll show up here.'
                : 'Save sound packs you like and they’ll land in this list.'
            }
            actionLabel={tab === 'tracks' ? 'Browse tracks' : 'Browse packs'}
            onAction={() =>
              navigate(tab === 'tracks' ? '/marketplace/tracks' : '/marketplace/packs')
            }
          />
        ) : activeCount === 0 ? (
          <EmptyFavorites
            reduce={reduce}
            title={tab === 'tracks' ? 'No tracks match' : 'No sound packs match'}
            description="Try a different search, or clear it to see all favorites in this tab."
            actionLabel="Clear search"
            onAction={() => {
              setQuery('')
              setSearchOpen(false)
            }}
          />
        ) : tab === 'tracks' ? (
          view === 'list' ? (
            <ol className="mt-4 divide-y divide-white/[0.06]">
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
            <ul className="mt-4 grid grid-cols-[repeat(auto-fill,9.25rem)] gap-3.5 sm:grid-cols-[repeat(auto-fill,10.5rem)]">
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
                    onSelect={() => navigate(marketplaceTrackPath(track.id))}
                  />
                </motion.li>
              ))}
            </ul>
          )
        ) : view === 'list' ? (
          <ol className="mt-4 divide-y divide-white/[0.06]">
            {packs.map((pack, index) => (
              <motion.li
                key={pack.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  duration: 0.36,
                  ease: EASE,
                  delay: Math.min(index, 10) * 0.03,
                }}
              >
                <FavoritePackRow pack={pack} />
              </motion.li>
            ))}
          </ol>
        ) : (
          <ul className="mt-4 grid grid-cols-[repeat(auto-fill,9.25rem)] gap-3.5 sm:grid-cols-[repeat(auto-fill,10.5rem)]">
            {packs.map((pack, index) => (
              <motion.li
                key={pack.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  duration: 0.36,
                  ease: EASE,
                  delay: Math.min(index, 10) * 0.03,
                }}
              >
                <FavoritePackCard pack={pack} reduce={reduce} />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.section>
  )
}

function FavoritePackCard({
  pack,
  reduce,
}: {
  pack: FavoritePack
  reduce: boolean | null
}) {
  return (
    <motion.button
      type="button"
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      onClick={() => toast.success(`Sound pack “${pack.title}” coming soon`)}
      className="group w-37 cursor-pointer text-left outline-none sm:w-42"
    >
      <span className="relative block aspect-square overflow-hidden rounded-xl">
        <span className={cn('absolute inset-0', pack.cover)} />
        <span className="absolute inset-0 grid place-items-center text-white/30 transition-colors duration-300 group-hover:bg-black/20">
          <PackageIcon
            size={28}
            weight="duotone"
            className="transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </span>
      </span>
      <span className="mt-3 block truncate text-[14px] font-medium text-white">{pack.title}</span>
      <span className="mt-0.5 block truncate text-[12px] text-ink-mute">{pack.producer}</span>
      <span className="tnum mt-0.5 block text-[12px] text-ink-faint">
        {pack.itemCount} {pack.itemCount === 1 ? 'sound' : 'sounds'} · {pack.priceLabel}
      </span>
    </motion.button>
  )
}

function FavoritePackRow({ pack }: { pack: FavoritePack }) {
  const producer = getMarketplaceProducer(
    MARKETPLACE_PRODUCERS.find((row) => row.name === pack.producer)?.slug ?? '',
  )

  return (
    <article className="group flex items-center gap-3 py-3 sm:gap-4">
      <button
        type="button"
        className="relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-lg outline-none sm:size-[52px]"
        aria-label={`Open ${pack.title}`}
        onClick={() => toast.success(`Sound pack “${pack.title}” coming soon`)}
      >
        <span className={cn('grid size-full place-items-center text-white/35', pack.cover)}>
          <PackageIcon size={20} weight="duotone" />
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium tracking-[-0.01em] text-white">{pack.title}</p>
        <p className="mt-0.5 truncate text-[12px] text-ink-mute">
          {pack.producer}
          {producer?.verified ? ' · Verified' : null}
        </p>
        <p className="tnum mt-0.5 truncate text-[11px] text-ink-faint">
          {pack.itemCount} {pack.itemCount === 1 ? 'sound' : 'sounds'} · {pack.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={() => toast.success(`Sound pack “${pack.title}” coming soon`)}
        className="tnum inline-flex shrink-0 cursor-pointer items-center rounded-lg bg-white/8 px-2.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/12"
      >
        {pack.priceLabel}
      </button>
    </article>
  )
}

function EmptyFavorites({
  reduce,
  title,
  description,
  actionLabel,
  onAction,
}: {
  reduce: boolean | null
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <motion.div
      variants={reduce ? undefined : fadeUp}
      className="mt-10 rounded-2xl bg-white/[0.03] px-6 py-12 text-center"
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-white/8 text-ink-mute">
        <HeartIcon size={22} weight="duotone" />
      </span>
      <p className="mt-4 text-[15px] font-medium text-white">{title}</p>
      <p className="mt-1.5 text-[13px] text-ink-mute">{description}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 cursor-pointer rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/14"
      >
        {actionLabel}
      </button>
    </motion.div>
  )
}

function ExpandableSearch({
  open,
  query,
  inputRef,
  reduce,
  placeholder = 'Search favorites…',
  onOpen,
  onQueryChange,
  onClose,
  onClear,
}: {
  open: boolean
  query: string
  inputRef: RefObject<HTMLInputElement | null>
  reduce: boolean | null
  placeholder?: string
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
              placeholder={placeholder}
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
            aria-label="Search favorites"
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
