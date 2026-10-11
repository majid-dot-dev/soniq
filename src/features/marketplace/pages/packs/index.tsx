import { useEffect, useId, useMemo, useRef, useState, type RefObject } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CaretDownIcon,
  FadersIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  SealCheckIcon,
  ShoppingBagOpenIcon,
  SquaresFourIcon,
  XIcon,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getMarketplaceProducer,
  getProducerSoundPacks,
  MARKETPLACE_PRODUCERS,
  marketplaceProducerPath,
  type ProducerBundle,
} from '@/features/marketplace/data/marketplace-producers'
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

type SortKey = 'popular' | 'az' | 'price' | 'producer'
type ViewMode = 'list' | 'grid'
type FilterId = 'category' | 'instrument' | 'price'

type CatalogFilters = Record<FilterId, string[]>

const DEFAULT_FILTERS: CatalogFilters = {
  category: [],
  instrument: [],
  price: [],
}

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'az', label: 'A–Z' },
  { id: 'price', label: 'Price: low to high' },
  { id: 'producer', label: 'Creator' },
]

const CATEGORY_OPTIONS = [
  'Drum kits',
  'Melody',
  'Loops',
  'One-shots',
  'Textures',
  'Bass',
] as const

const PRICE_OPTIONS = ['Under $25', '$25–$30', '$30+'] as const

type CatalogPack = ProducerBundle & {
  producer: string
  producerSlug: string
  verified: boolean
  category: string
  instruments: string[]
}

/** Taxonomy for filterable catalog fields (mock until packs carry this on the API). */
const PACK_META: Record<string, { category: string; instruments: string[] }> = {
  'jules-log-drum-kit': { category: 'Drum kits', instruments: ['Log drum', 'Percussion'] },
  'jules-pad-bank': { category: 'Textures', instruments: ['Pads', 'Synth'] },
  'nao-808-lab': { category: 'Bass', instruments: ['808', 'Synth'] },
  'nao-drill-drums': { category: 'Drum kits', instruments: ['Percussion', '808'] },
  'kelu-gqom-kit': { category: 'Drum kits', instruments: ['Percussion', 'Synth'] },
  'amara-keys': { category: 'Melody', instruments: ['Keys', 'Piano'] },
}

function packMeta(pack: ProducerBundle): { category: string; instruments: string[] } {
  const known = PACK_META[pack.id]
  if (known) return known
  const hay = `${pack.title} ${pack.subtitle}`.toLowerCase()
  if (hay.includes('drum') || hay.includes('kit')) {
    return { category: 'Drum kits', instruments: ['Percussion'] }
  }
  if (hay.includes('loop')) {
    return { category: 'Loops', instruments: ['Synth'] }
  }
  if (hay.includes('one-shot') || hay.includes('one shot')) {
    return { category: 'One-shots', instruments: ['Percussion'] }
  }
  return { category: 'Loops', instruments: ['Synth', 'Percussion'] }
}

const ALL_PACKS: CatalogPack[] = MARKETPLACE_PRODUCERS.flatMap((producer) =>
  getProducerSoundPacks(producer.slug).map((pack) => {
    const meta = packMeta(pack)
    return {
      ...pack,
      producer: producer.name,
      producerSlug: producer.slug,
      verified: producer.verified,
      category: meta.category,
      instruments: meta.instruments,
    }
  }),
)

const INSTRUMENT_OPTIONS = [
  ...new Set(ALL_PACKS.flatMap((pack) => pack.instruments)),
].sort((a, b) => a.localeCompare(b))

const FILTER_MENUS: {
  id: FilterId
  label: string
  options: readonly string[]
}[] = [
  { id: 'category', label: 'Category', options: CATEGORY_OPTIONS },
  { id: 'instrument', label: 'Instrument', options: INSTRUMENT_OPTIONS },
  { id: 'price', label: 'Price', options: PRICE_OPTIONS },
]

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function priceValue(label: string) {
  const n = Number(label.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function matchesQuery(pack: CatalogPack, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [pack.title, pack.subtitle, pack.producer, pack.category, ...pack.instruments, pack.priceLabel]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

function matchesAny(haystack: string[], selected: string[]) {
  if (selected.length === 0) return true
  return selected.some((value) => haystack.includes(value))
}

function matchesPrice(label: string, selected: string[]) {
  if (selected.length === 0) return true
  const price = priceValue(label)
  return selected.some((bucket) => {
    if (bucket === 'Under $25') return price < 25
    if (bucket === '$25–$30') return price >= 25 && price <= 30
    if (bucket === '$30+') return price > 30
    return false
  })
}

export default function PacksPage() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const searchRef = useRef<HTMLInputElement>(null)
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortKey>('popular')
  const [view, setView] = useState<ViewMode>('grid')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

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

  const packs = useMemo(() => {
    const rows = ALL_PACKS.filter((pack) => {
      if (!matchesQuery(pack, query)) return false
      if (!matchesAny([pack.category], filters.category)) return false
      if (!matchesAny(pack.instruments, filters.instrument)) return false
      if (!matchesPrice(pack.priceLabel, filters.price)) return false
      return true
    }).slice()

    rows.sort((a, b) => {
      switch (sort) {
        case 'az':
          return a.title.localeCompare(b.title)
        case 'price':
          return priceValue(a.priceLabel) - priceValue(b.priceLabel)
        case 'producer':
          return a.producer.localeCompare(b.producer) || a.title.localeCompare(b.title)
        case 'popular':
        default:
          return b.itemCount - a.itemCount || a.title.localeCompare(b.title)
      }
    })

    return rows
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
  const activeFilterCount = FILTER_MENUS.reduce((count, menu) => count + filters[menu.id].length, 0)

  return (
    <motion.section
      className="flex h-full flex-col overflow-hidden px-4 pt-6 lg:px-6 lg:pt-6"
      variants={reduce ? undefined : pageEnter}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
    >
      <div className="shrink-0">
        <motion.header variants={reduce ? undefined : fadeUp}>
          <h1 className="text-[24px] font-medium tracking-[-0.03em] text-white sm:text-[26px] lg:text-[32px]">
            All packs
          </h1>
        </motion.header>

        <div className="mt-4 border-b border-white/10">
          <motion.div
            variants={reduce ? undefined : fadeUp}
            className="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
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

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-expanded={filtersOpen}
              aria-controls="packs-filters-drawer"
              className={cn(
                'inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl px-3.5 text-[13px] font-medium outline-none transition-colors lg:hidden',
                activeFilterCount > 0
                  ? 'bg-white/14 text-white'
                  : 'bg-white/8 text-white hover:bg-white/12',
              )}
            >
              <FadersIcon size={16} />
              <span>Filters</span>
              {activeFilterCount > 0 ? (
                <span className="tnum grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold leading-5 text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:flex-none sm:shrink-0">
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
                  className="hidden overflow-hidden rounded-xl lg:inline-flex"
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
                  <span>{chip.label}</span>
                  <span className="grid size-4 place-items-center rounded-full bg-white/10">
                    <XIcon size={9} weight="bold" />
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="cursor-pointer px-2 text-[12px] font-medium text-ink-mute transition-colors hover:text-white"
              >
                Clear all
              </button>
            </motion.div>
          ) : null}
        </div>
      </div>

      <FiltersDrawer
        open={filtersOpen}
        filters={filters}
        sort={sort}
        onClose={() => setFiltersOpen(false)}
        onToggle={toggleFilter}
        onClearGroup={setFilterValues}
        onClearAll={clearAllFilters}
        onSortChange={setSort}
      />

      <div className="min-h-0 flex-1 overflow-auto pb-6">
        {ALL_PACKS.length === 0 ? (
          <EmptyPacks
            reduce={reduce}
            title="No sound packs yet"
            description="Kits and packs from creators will show up here."
            actionLabel="Browse creators"
            onAction={() => navigate('/marketplace/creators')}
          />
        ) : packs.length === 0 ? (
          <EmptyPacks
            reduce={reduce}
            title="No packs match"
            description="Try clearing a filter or choosing a different combination."
            actionLabel="Clear filters"
            onAction={clearAllFilters}
          />
        ) : view === 'grid' ? (
          <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(9.25rem,1fr))] gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))]">
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
                <PackGridCard pack={pack} />
              </motion.li>
            ))}
          </ul>
        ) : (
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
                <PackListRow pack={pack} />
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </motion.section>
  )
}

function openPack(pack: CatalogPack) {
  toast.success(`Sound pack “${pack.title}” coming soon`)
}

function packInitials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function PackGridCard({ pack }: { pack: CatalogPack }) {
  return (
    <article className="group w-full">
      <button
        type="button"
        onClick={() => openPack(pack)}
        className="w-full cursor-pointer text-left outline-none"
      >
        <span className="relative block overflow-hidden rounded-xl">
          <span
            className={cn(
              'grid aspect-square w-full place-items-center text-[22px] font-semibold tracking-tight text-white/80',
              pack.cover,
            )}
          >
            {packInitials(pack.title)}
          </span>
          <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
          <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="grid size-10 place-items-center rounded-full bg-white text-black shadow-lg">
              <PackageIcon size={16} weight="fill" />
            </span>
          </span>
        </span>
        <span className="mt-3 block truncate text-[14px] font-medium text-white">{pack.title}</span>
        <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[12px] text-ink-mute">
          <span className="truncate">{pack.producer}</span>
          {pack.verified ? (
            <SealCheckIcon
              size={12}
              weight="fill"
              className="shrink-0 text-sky-400"
              aria-label="Verified creator"
            />
          ) : null}
        </span>
      </button>

      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => openPack(pack)}
          className="tnum inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/8 px-2 py-1 text-[12px] font-medium text-white transition-colors hover:bg-white/12"
        >
          <ShoppingBagOpenIcon size={14} weight="regular" className="shrink-0" />
          {pack.priceLabel}
        </button>
        <span className="tnum rounded-lg bg-white/8 px-2 py-1 text-[12px] font-medium text-ink-mute">
          {pack.itemCount} {pack.itemCount === 1 ? 'sound' : 'sounds'}
        </span>
      </div>
    </article>
  )
}

function PackListRow({ pack }: { pack: CatalogPack }) {
  const producer = getMarketplaceProducer(pack.producerSlug)

  return (
    <article className="group flex items-center gap-3 py-3 sm:gap-4">
      <button
        type="button"
        className="relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-lg outline-none sm:size-[52px]"
        aria-label={`Open ${pack.title}`}
        onClick={() => openPack(pack)}
      >
        <span
          className={cn(
            'grid size-full place-items-center text-[13px] font-semibold tracking-tight text-white/80',
            pack.cover,
          )}
        >
          {packInitials(pack.title)}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => openPack(pack)}
          className="block max-w-full cursor-pointer truncate text-left text-[14px] font-medium tracking-[-0.01em] text-white"
        >
          {pack.title}
        </button>
        <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[12px] text-ink-mute">
          <Link
            to={marketplaceProducerPath(pack.producerSlug)}
            className="truncate transition-colors hover:text-white"
          >
            {pack.producer}
          </Link>
          {producer?.verified ? (
            <SealCheckIcon
              size={12}
              weight="fill"
              className="shrink-0 text-sky-400"
              aria-label="Verified"
            />
          ) : null}
        </p>
        <p className="tnum mt-0.5 truncate text-[11px] text-ink-faint">
          {pack.itemCount} {pack.itemCount === 1 ? 'sound' : 'sounds'} · {pack.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={() => openPack(pack)}
        className="tnum inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/12"
      >
        <ShoppingBagOpenIcon size={14} weight="regular" className="shrink-0" />
        {pack.priceLabel}
      </button>
    </article>
  )
}

function EmptyPacks({
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
        <PackageIcon size={22} weight="duotone" />
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

function FiltersDrawer({
  open,
  filters,
  sort,
  onClose,
  onToggle,
  onClearGroup,
  onClearAll,
  onSortChange,
}: {
  open: boolean
  filters: CatalogFilters
  sort: SortKey
  onClose: () => void
  onToggle: (id: FilterId, value: string) => void
  onClearGroup: (id: FilterId, values: string[]) => void
  onClearAll: () => void
  onSortChange: (sort: SortKey) => void
}) {
  const reduce = useReducedMotion()
  const titleId = useId()
  const activeCount = FILTER_MENUS.reduce((count, menu) => count + filters[menu.id].length, 0)

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <motion.button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
            onClick={onClose}
          />
          <motion.aside
            id="packs-filters-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[min(88svh,42rem)] w-full flex-col rounded-t-[1.75rem] border-t border-white/12 bg-[#121110] shadow-[0_-24px_60px_rgba(0,0,0,0.5)]"
            initial={reduce ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: '100%' }}
            transition={{ duration: reduce ? 0 : 0.34, ease: EASE }}
          >
            <div className="flex shrink-0 flex-col items-center pt-2.5">
              <span className="h-1 w-10 rounded-full bg-white/20" aria-hidden />
              <div className="flex w-full items-center justify-between gap-3 pr-3 pl-6 pt-3 pb-2">
                <div className="min-w-0">
                  <p id={titleId} className="text-[15px] font-semibold text-white">
                    Filters
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-mute">
                    {activeCount > 0 ? `${activeCount} selected` : 'Refine the catalog'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filters"
                  className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-white/8 hover:text-white"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
              <div className="space-y-5">
                <section>
                  <div className="mb-2.5 px-1">
                    <h3 className="text-[12px] font-medium tracking-wide text-ink-faint uppercase">
                      Sort
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SORTS.map((option) => {
                      const checked = sort === option.id
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={checked}
                          onClick={() => onSortChange(option.id)}
                          className={cn(
                            'cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                            checked
                              ? 'bg-white text-black'
                              : 'bg-white/8 text-ink-2 hover:bg-white/12 hover:text-white',
                          )}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </section>

                {FILTER_MENUS.map((menu) => {
                  const selected = filters[menu.id]
                  return (
                    <section key={menu.id}>
                      <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
                        <h3 className="text-[12px] font-medium tracking-wide text-ink-faint uppercase">
                          {menu.label}
                        </h3>
                        {selected.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => onClearGroup(menu.id, [])}
                            className="cursor-pointer text-[12px] font-medium text-ink-mute transition-colors hover:text-white"
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {menu.options.map((option) => {
                          const checked = selected.includes(option)
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={checked}
                              onClick={() => onToggle(menu.id, option)}
                              className={cn(
                                'cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                                checked
                                  ? 'bg-white text-black'
                                  : 'bg-white/8 text-ink-2 hover:bg-white/12 hover:text-white',
                              )}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-white/10 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={onClearAll}
                disabled={activeCount === 0}
                className="h-11 flex-1 cursor-pointer rounded-full bg-white/8 text-[14px] font-medium text-white transition-colors hover:bg-white/12 disabled:cursor-default disabled:opacity-40"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-[1.4] cursor-pointer rounded-full bg-white text-[14px] font-semibold text-black transition-colors hover:bg-white/90"
              >
                Show results
              </button>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
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
    <div className="flex h-9 min-w-0 items-center">
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <motion.label
            key="search-field"
            initial={reduce ? false : { width: 36, opacity: 0.7 }}
            animate={{ width: 'min(220px, 55vw)', opacity: 1 }}
            exit={reduce ? undefined : { width: 36, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="flex h-9 max-w-full items-center gap-2 overflow-hidden rounded-xl bg-white/8 px-3"
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
              placeholder="Search packs…"
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
            aria-label="Search packs"
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
