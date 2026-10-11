import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightIcon,
  CaretDownIcon,
  ChartLineUpIcon,
  ClockIcon,
  FireIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  SealCheckIcon,
  SparkleIcon,
  TrendUpIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getProducerPopularTracks,
  getProducerTrackStats,
  MARKETPLACE_PRODUCERS,
  marketplaceProducerPath,
  type MarketplaceProducer,
} from '@/features/marketplace/data/marketplace-producers'
import {
  formatPlayCount,
  marketplaceTrackPath,
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

type CreatorsTab = 'all' | 'spotlight'
type SortKey = 'popular' | 'newest' | 'az' | 'tracks'

const TABS: { id: CreatorsTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'spotlight', label: 'Spotlight' },
]

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'az', label: 'A–Z' },
  { id: 'tracks', label: 'Most tracks' },
]

/**
 * Spotlight feed — curated promotions with a reason the system surfaced them.
 * Order = editorial rank in the feed.
 */
const SPOTLIGHT_FEED: {
  slug: string
  badge: string
  reason: string
  when: string
}[] = [
  {
    slug: 'kelu',
    badge: 'Rising',
    reason: 'Fastest climb in Amapiano plays this week',
    when: '2h ago',
  },
  {
    slug: 'nao',
    badge: 'On fire',
    reason: 'Most Drill streams across the marketplace right now',
    when: '5h ago',
  },
  {
    slug: 'jules',
    badge: 'Editor’s pick',
    reason: 'Consistently high save rate on melodic Amapiano',
    when: 'Yesterday',
  },
  {
    slug: 'amara',
    badge: 'Breakthrough',
    reason: 'R&B catalog crossing into new listener pockets',
    when: 'Yesterday',
  },
  {
    slug: 'dewit',
    badge: 'Trending',
    reason: 'Afrobeats radio heat — bright hooks, clean space',
    when: '2d ago',
  },
]

/** Right-rail “also rising” — not in the main Spotlight feed. */
const ALSO_RISING_SLUGS = ['selasi', 'koko', 'riven'] as const

const SIGNAL_CRITERIA = [
  {
    id: 'velocity',
    label: 'Play velocity',
    detail: 'Week-over-week stream climb',
    icon: TrendUpIcon,
  },
  {
    id: 'saves',
    label: 'Save rate',
    detail: 'Favorites relative to plays',
    icon: SparkleIcon,
  },
  {
    id: 'heat',
    label: 'Genre heat',
    detail: 'Share of genre chart activity',
    icon: FireIcon,
  },
] as const

type CreatorRow = MarketplaceProducer & {
  trackCount: number
  plays: number
  playsLabel: string
}

type SpotlightRow = CreatorRow & {
  badge: string
  reason: string
  when: string
  rank: number
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function matchesQuery(creator: CreatorRow, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [creator.name, creator.username, creator.location, ...creator.genres]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export default function CreatorsPage() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const searchRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<CreatorsTab>('all')
  const [sort, setSort] = useState<SortKey>('popular')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const creators = useMemo(() => {
    const rows: CreatorRow[] = MARKETPLACE_PRODUCERS.map((producer) => {
      const stats = getProducerTrackStats(producer.name)
      return {
        ...producer,
        trackCount: stats.tracks,
        plays: stats.plays,
        playsLabel: stats.playsLabel,
      }
    }).filter((creator) => matchesQuery(creator, query))

    rows.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return b.joinedAt.localeCompare(a.joinedAt) || b.followers - a.followers
        case 'az':
          return a.name.localeCompare(b.name)
        case 'tracks':
          return b.trackCount - a.trackCount || b.plays - a.plays
        case 'popular':
        default:
          return b.plays - a.plays || b.followers - a.followers
      }
    })

    return rows
  }, [query, sort])

  const spotlight = useMemo(() => {
    const bySlug = new Map(
      MARKETPLACE_PRODUCERS.map((producer) => {
        const stats = getProducerTrackStats(producer.name)
        return [
          producer.slug,
          {
            ...producer,
            trackCount: stats.tracks,
            plays: stats.plays,
            playsLabel: stats.playsLabel,
          } satisfies CreatorRow,
        ]
      }),
    )

    return SPOTLIGHT_FEED.map((entry, index) => {
      const creator = bySlug.get(entry.slug)
      if (!creator) return null
      if (!matchesQuery(creator, query)) return null
      return {
        ...creator,
        badge: entry.badge,
        reason: entry.reason,
        when: entry.when,
        rank: index + 1,
      } satisfies SpotlightRow
    }).filter((row): row is SpotlightRow => row != null)
  }, [query])

  const sortLabel = SORTS.find((option) => option.id === sort)?.label ?? 'Popular'
  const tabEmpty =
    tab === 'spotlight' ? SPOTLIGHT_FEED.length === 0 : MARKETPLACE_PRODUCERS.length === 0
  const activeEmpty = tab === 'spotlight' ? spotlight.length === 0 : creators.length === 0

  return (
    <motion.section
      className="flex h-full flex-col overflow-hidden px-4 pt-6 lg:px-6 lg:pt-6"
      variants={reduce ? undefined : pageEnter}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
    >
      <div className="shrink-0">
        <motion.header variants={reduce ? undefined : fadeUp}>
          <h1 className="text-[32px] font-medium tracking-[-0.03em] text-white">Creators</h1>
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
                placeholder={tab === 'spotlight' ? 'Search spotlight…' : 'Search creators…'}
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

              {tab === 'all' ? (
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
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto pb-6">
        {tabEmpty ? (
          <EmptyCreators
            reduce={reduce}
            title={tab === 'spotlight' ? 'Spotlight is empty' : 'No creators yet'}
            description={
              tab === 'spotlight'
                ? 'Featured creators will land here when the next spotlight drops.'
                : 'Producers on Soniq will show up here.'
            }
            actionLabel={tab === 'spotlight' ? 'Browse all' : 'Explore tracks'}
            onAction={() =>
              tab === 'spotlight' ? setTab('all') : navigate('/marketplace/tracks')
            }
          />
        ) : activeEmpty ? (
          <EmptyCreators
            reduce={reduce}
            title="No creators match"
            description={
              tab === 'spotlight'
                ? 'Try a different search, or clear it to see Spotlight again.'
                : 'Try a different search, or clear it to see everyone.'
            }
            actionLabel="Clear search"
            onAction={() => {
              setQuery('')
              setSearchOpen(false)
            }}
          />
        ) : tab === 'spotlight' ? (
          <SpotlightFeed creators={spotlight} reduce={reduce} />
        ) : (
          <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]">
            {creators.map((creator, index) => (
              <motion.li
                key={creator.slug}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  duration: 0.36,
                  ease: EASE,
                  delay: Math.min(index, 10) * 0.03,
                }}
              >
                <CreatorGridCard creator={creator} reduce={reduce} />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.section>
  )
}

function SpotlightFeed({
  creators,
  reduce,
}: {
  creators: SpotlightRow[]
  reduce: boolean | null
}) {
  const genrePulse = useMemo(() => {
    const counts = new Map<string, number>()
    for (const creator of creators) {
      for (const genre of creator.genres) {
        counts.set(genre, (counts.get(genre) ?? 0) + 1)
      }
    }
    const max = Math.max(...counts.values(), 1)
    return [...counts.entries()]
      .map(([genre, count]) => ({ genre, count, pct: Math.round((count / max) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [creators])

  const alsoRising = useMemo(() => {
    return ALSO_RISING_SLUGS.map((slug) => {
      const producer = MARKETPLACE_PRODUCERS.find((row) => row.slug === slug)
      if (!producer) return null
      const stats = getProducerTrackStats(producer.name)
      return { ...producer, ...stats }
    }).filter((row): row is MarketplaceProducer & ReturnType<typeof getProducerTrackStats> => row != null)
  }, [])

  const weekPlays = useMemo(
    () => creators.reduce((sum, creator) => sum + creator.plays, 0),
    [creators],
  )

  return (
    <div className="mt-5 grid gap-6 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
      {/* Left — live promotion feed */}
      <div className="min-w-0">
        <motion.div
          variants={reduce ? undefined : fadeUp}
          className="mb-4 flex flex-wrap items-end justify-between gap-2"
        >
          <div>
            <p className="flex items-center gap-2 text-[13px] font-medium text-white">
              <LightningIcon size={14} weight="fill" className="text-amber-300" />
              Live spotlight feed
            </p>
            <p className="mt-1 text-[12px] text-ink-mute">
              Creators the system is pushing right now
            </p>
          </div>
          <p className="tnum text-[12px] text-ink-faint">{creators.length} in rotation</p>
        </motion.div>

        <ol className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/[0.06]">
          {creators.map((creator, index) => (
            <motion.li
              key={creator.slug}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.42,
                ease: EASE,
                delay: Math.min(index, 5) * 0.04,
              }}
            >
              <SpotlightFeedCard creator={creator} />
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Right — discovery rail */}
      <aside className="space-y-4 lg:sticky lg:top-3">
        <motion.section
          variants={reduce ? undefined : fadeUp}
          className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]"
        >
          <p className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-ink-mute uppercase">
            <ChartLineUpIcon size={13} />
            This week
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <StatTile label="Featured" value={String(creators.length)} />
            <StatTile label="Plays" value={formatPlayCount(weekPlays)} />
            <StatTile label="Genres" value={String(genrePulse.length)} />
          </div>
        </motion.section>

        <motion.section
          variants={reduce ? undefined : fadeUp}
          className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]"
        >
          <p className="text-[13px] font-medium text-white">How Spotlight picks</p>
          <p className="mt-1 text-[12px] text-ink-mute">
            Signals that move a creator into the feed
          </p>
          <ul className="mt-3 space-y-2.5">
            {SIGNAL_CRITERIA.map((signal) => (
              <li key={signal.id} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/8 text-amber-200/90">
                  <signal.icon size={15} weight="duotone" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-white">{signal.label}</span>
                  <span className="mt-0.5 block text-[12px] text-ink-mute">{signal.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.section>

        {genrePulse.length > 0 ? (
          <motion.section
            variants={reduce ? undefined : fadeUp}
            className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]"
          >
            <p className="text-[13px] font-medium text-white">Genre pulse</p>
            <p className="mt-1 text-[12px] text-ink-mute">Where this week’s spotlight is hot</p>
            <ul className="mt-3 space-y-2.5">
              {genrePulse.map((row) => (
                <li key={row.genre}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
                    <span className="truncate text-ink-2">{row.genre}</span>
                    <span className="tnum shrink-0 text-ink-mute">{row.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-300/80 to-orange-400/70"
                      initial={reduce ? false : { width: 0 }}
                      whileInView={reduce ? undefined : { width: `${row.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}

        {alsoRising.length > 0 ? (
          <motion.section
            variants={reduce ? undefined : fadeUp}
            className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-medium text-white">Also rising</p>
              <span className="text-[11px] text-ink-faint">Watch list</span>
            </div>
            <ul className="mt-3 space-y-1">
              {alsoRising.map((creator) => (
                <li key={creator.slug}>
                  <Link
                    to={marketplaceProducerPath(creator.slug)}
                    className="flex items-center gap-2.5 rounded-xl px-1.5 py-2 transition-colors hover:bg-white/[0.05]"
                  >
                    <span
                      className={cn(
                        'grid size-9 shrink-0 place-items-center overflow-hidden rounded-full text-[11px] font-semibold text-white/70',
                        creator.cover,
                      )}
                    >
                      {creator.avatar ? (
                        <img src={creator.avatar} alt="" className="size-full object-cover" />
                      ) : (
                        initials(creator.name)
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-1">
                        <span className="truncate text-[13px] font-medium text-white">
                          {creator.name}
                        </span>
                        {creator.verified ? (
                          <SealCheckIcon size={12} weight="fill" className="shrink-0 text-sky-400" />
                        ) : null}
                      </span>
                      <span className="tnum mt-0.5 block truncate text-[11px] text-ink-mute">
                        {creator.playsLabel} plays · {creator.genres[0]}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault()
                        toast.success(`Following ${creator.name}`)
                      }}
                      className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-white/14"
                      aria-label={`Follow ${creator.name}`}
                    >
                      <UserPlusIcon size={14} weight="bold" />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}
      </aside>
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-2.5 py-2.5 text-center">
      <p className="tnum text-[16px] font-semibold tracking-[-0.02em] text-white">{value}</p>
      <p className="mt-0.5 text-[10px] text-ink-mute">{label}</p>
    </div>
  )
}

function SpotlightFeedCard({ creator }: { creator: SpotlightRow }) {
  const tracks = useMemo(
    () => getProducerPopularTracks(creator.name, 2),
    [creator.name],
  )

  return (
    <article className="px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start gap-3">
        <Link
          to={marketplaceProducerPath(creator.slug)}
          className={cn(
            'grid size-11 shrink-0 place-items-center overflow-hidden rounded-full text-[12px] font-semibold text-white/70 outline-none ring-2 ring-white/10 transition-[ring-color] hover:ring-white/25',
            creator.cover,
          )}
        >
          {creator.avatar ? (
            <img src={creator.avatar} alt="" className="size-full object-cover" />
          ) : (
            initials(creator.name)
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              to={marketplaceProducerPath(creator.slug)}
              className="inline-flex min-w-0 max-w-full items-center gap-1 outline-none"
            >
              <span className="truncate text-[15px] font-semibold tracking-[-0.02em] text-white">
                {creator.name}
              </span>
              {creator.verified ? (
                <SealCheckIcon
                  size={15}
                  weight="fill"
                  className="shrink-0 text-sky-400"
                  aria-label="Verified"
                />
              ) : null}
            </Link>
            <span className="tnum text-[12px] text-ink-faint">#{creator.rank}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/12 px-2 py-0.5 text-[11px] font-semibold text-amber-100">
              <LightningIcon size={10} weight="fill" />
              {creator.badge}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-faint">
              <ClockIcon size={11} />
              {creator.when}
            </span>
          </div>

          <p className="mt-2 text-[14px] leading-snug text-ink-2">{creator.reason}</p>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-mute">
            {creator.bio}
          </p>

          <Link
            to={marketplaceProducerPath(creator.slug)}
            className={cn(
              'relative mt-3 block overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/30',
              creator.cover,
            )}
          >
            <span className="relative block aspect-[2.2/1]">
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt=""
                  className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-2xl"
                />
              ) : null}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-white">
                    {creator.genres.join(' · ')}
                  </span>
                  <span className="tnum mt-0.5 block text-[11px] text-white/65">
                    {creator.playsLabel} plays · {formatPlayCount(creator.followers)} followers
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-white/80">
                  Profile
                  <ArrowRightIcon size={12} weight="bold" />
                </span>
              </span>
            </span>
          </Link>

          {tracks.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {tracks.map((track) => (
                <li key={track.id}>
                  <Link
                    to={marketplaceTrackPath(track.id)}
                    className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-white/[0.04]"
                  >
                    <span
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-md text-[10px] font-semibold text-white/45',
                        track.cover,
                      )}
                    >
                      {track.title.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-white">
                      {track.title}
                    </span>
                    <span className="tnum shrink-0 text-[11px] text-ink-mute">
                      {formatPlayCount(track.plays)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.success(`Following ${creator.name}`)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-black transition-opacity hover:opacity-90"
            >
              <UserPlusIcon size={13} weight="bold" />
              Follow
            </button>
            <Link
              to={marketplaceProducerPath(creator.slug)}
              className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/12"
            >
              View profile
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function CreatorGridCard({
  creator,
  reduce,
}: {
  creator: CreatorRow
  reduce: boolean | null
}) {
  return (
    <article className="group w-full">
      <motion.div whileHover={reduce ? undefined : { y: -3 }} transition={{ duration: 0.3, ease: EASE }}>
        <Link
          to={marketplaceProducerPath(creator.slug)}
          className="block outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35"
        >
          <span className="relative block overflow-hidden rounded-2xl">
            <span
              className={cn(
                'relative grid aspect-[4/5] w-full place-items-center text-[28px] font-semibold tracking-tight text-white/25',
                creator.cover,
              )}
            >
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              {initials(creator.name)}
              <span className="absolute inset-x-3 bottom-3">
                <span className="flex items-end gap-2.5">
                  <span
                    className={cn(
                      'relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full text-[12px] font-semibold text-white ring-2 ring-black/40',
                      creator.cover,
                    )}
                  >
                    {creator.avatar ? (
                      <img src={creator.avatar} alt="" className="size-full object-cover" />
                    ) : (
                      initials(creator.name)
                    )}
                  </span>
                  <span className="min-w-0 flex-1 pb-0.5">
                    <span className="flex min-w-0 items-center gap-1">
                      <span className="truncate text-[15px] font-medium tracking-[-0.01em] text-white">
                        {creator.name}
                      </span>
                      {creator.verified ? (
                        <SealCheckIcon
                          size={14}
                          weight="fill"
                          className="shrink-0 text-sky-400"
                          aria-label="Verified creator"
                        />
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-white/65">
                      {creator.genres.join(' · ')}
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </Link>
      </motion.div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="tnum min-w-0 truncate text-[12px] text-ink-mute">
          {creator.playsLabel} plays
          <span className="text-ink-faint"> · </span>
          {creator.trackCount} {creator.trackCount === 1 ? 'track' : 'tracks'}
        </p>
        <button
          type="button"
          onClick={() => toast.success(`Following ${creator.name}`)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-white/8 px-2.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/14"
        >
          <UserPlusIcon size={13} weight="bold" />
          Follow
        </button>
      </div>
    </article>
  )
}

function EmptyCreators({
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
        <UsersIcon size={22} weight="duotone" />
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
  placeholder = 'Search creators…',
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
            aria-label="Search creators"
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
