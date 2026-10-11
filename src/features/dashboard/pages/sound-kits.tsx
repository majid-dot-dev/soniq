import { useMemo, useState } from 'react'
import {
  CaretDown,
  DotsThree,
  DotsThreeVertical,
  Info,
  List,
  MagnifyingGlass,
  Package,
  Plus,
  SquaresFour,
  X,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCompact, formatCount } from '@/features/dashboard/beats'
import { UploadSoundKit } from '@/features/dashboard/components/upload-sound-kit'
import { kitTypes, soundKits as seedKits, type SoundKit } from '@/features/dashboard/sound-kits'
import { useWorkspace } from '@/features/dashboard/workspace'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const filterMenus = [
  { id: 'status', label: 'Status', options: ['All', 'Live', 'Draft'] },
  { id: 'type', label: 'Type', options: ['All', ...kitTypes] },
  { id: 'price', label: 'Price', options: ['All', 'Under $30', '$30–$45', '$45+'] },
] as const

type FilterId = (typeof filterMenus)[number]['id']
type ViewMode = 'list' | 'grid'

function Cover({ kit, className }: { kit: SoundKit; className?: string }) {
  return <img src={kit.image} alt="" className={cn('object-cover', className)} />
}

function KitMenu({ onAbout, vertical = false }: { onAbout: () => void; vertical?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Kit options"
        className="grid size-8 shrink-0 place-items-center rounded-full text-ink-mute outline-none transition-colors hover:bg-white/10 hover:text-white data-popup-open:bg-white/10 data-popup-open:text-white"
        onClick={(event) => event.stopPropagation()}
      >
        {vertical ? <DotsThreeVertical size={18} weight="bold" /> : <DotsThree size={18} weight="bold" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="rounded-xl bg-[rgba(16,16,18,0.92)] p-1.5 text-ink ring-white/15 backdrop-blur-2xl"
      >
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation()
            onAbout()
          }}
          className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
        >
          <Info size={15} />
          About kit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function FeaturedCard({ kit, onSelect, onAbout }: { kit: SoundKit; onSelect: () => void; onAbout: () => void }) {
  return (
    <div className="group min-w-0 flex-1">
      <button type="button" onClick={onSelect} className="w-full text-left">
        <span className="relative block overflow-hidden rounded-xl">
          <Cover
            kit={kit}
            className="aspect-square w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
          <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="grid size-11 place-items-center rounded-full bg-white text-black">
              <Package size={18} weight="fill" />
            </span>
          </span>
        </span>
      </button>
      <div className="mt-3 flex items-start gap-2">
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[15px] font-medium text-white">{kit.title}</span>
          <span className="mt-0.5 block truncate text-[13px] text-ink-mute">
            {kit.type} · {kit.sounds} sounds
          </span>
        </button>
        <KitMenu onAbout={onAbout} />
      </div>
    </div>
  )
}

function KitRow({
  kit,
  active,
  onSelect,
  onAbout,
}: {
  kit: SoundKit
  active: boolean
  onSelect: () => void
  onAbout: () => void
}) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-2 py-3 transition-colors sm:gap-4 sm:px-3',
        active ? 'bg-white/8' : 'hover:bg-white/5',
      )}
    >
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4">
        <Cover kit={kit} className="size-12 shrink-0 rounded-lg sm:size-14" />
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[15px] font-medium text-white">{kit.title}</span>
            <span
              className={cn(
                'hidden shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase sm:inline',
                kit.status === 'Live' && 'bg-yield-tint text-yield-bright',
                kit.status === 'Draft' && 'bg-white/8 text-ink-mute',
              )}
            >
              {kit.status}
            </span>
          </span>
          <span className="mt-1 block truncate text-[12px] text-ink-mute">
            {kit.type} · {kit.sounds} sounds · {formatCompact(kit.plays)} plays
          </span>
        </span>
      </button>

      <div className="hidden min-w-0 max-w-sm flex-wrap items-center justify-end gap-1.5 lg:flex">
        {(kit.tags ?? []).map((tag) => (
          <span key={tag} className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-2">
            #{tag}
          </span>
        ))}
      </div>

      <span className="hidden h-7 shrink-0 items-center rounded-lg bg-white/8 px-2.5 text-[12px] font-medium text-white tnum sm:inline-flex">
        {kit.fromPrice}
      </span>

      <KitMenu onAbout={onAbout} vertical />
    </div>
  )
}

function GridCard({
  kit,
  active,
  onSelect,
  onAbout,
}: {
  kit: SoundKit
  active: boolean
  onSelect: () => void
  onAbout: () => void
}) {
  return (
    <div className={cn('group min-w-0', active && 'rounded-2xl bg-white/5 p-2 ring-1 ring-white/10')}>
      <button type="button" onClick={onSelect} className="w-full text-left">
        <span className="relative block overflow-hidden rounded-xl">
          <Cover kit={kit} className="aspect-square w-full" />
        </span>
        <span className="mt-3 block truncate text-[15px] font-medium text-white">{kit.title}</span>
        <span className="mt-0.5 block truncate text-[12px] text-ink-mute">
          {kit.type} · {kit.status}
        </span>
      </button>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="rounded-lg bg-white/8 px-2.5 py-1.5 text-[12px] font-medium text-white tnum">{kit.fromPrice}</span>
        <span className="text-[11px] text-ink-faint tnum">{formatCompact(kit.plays)} plays</span>
        <KitMenu onAbout={onAbout} />
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="relative inline-flex shrink-0 items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent py-1.5 pr-5 pl-0 text-[13px] font-medium text-ink-2 outline-none transition-colors hover:text-white"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#121214] text-white">
            {option === 'All' ? label : option}
          </option>
        ))}
      </select>
      <CaretDown size={12} className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-ink-mute" />
    </label>
  )
}

function matchesPrice(kit: SoundKit, filter: string) {
  if (filter === 'All') return true
  const amount = Number.parseInt(kit.fromPrice.replace(/[^0-9]/g, ''), 10)
  if (filter === 'Under $30') return amount < 30
  if (filter === '$30–$45') return amount >= 30 && amount <= 45
  return amount > 45
}

export default function SoundKits() {
  const { current } = useWorkspace()
  const reduce = useReducedMotion()
  const [catalog, setCatalog] = useState(seedKits)
  const [uploading, setUploading] = useState(false)
  const featured = useMemo(
    () => [...catalog].filter((kit) => kit.status === 'Live').sort((a, b) => b.sales - a.sales).slice(0, 4),
    [catalog],
  )
  const [selectedId, setSelectedId] = useState(featured[0]?.id ?? seedKits[0].id)
  const [panelOpen, setPanelOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('list')
  const [filters, setFilters] = useState<Record<FilterId, string>>({
    status: 'All',
    type: 'All',
    price: 'All',
  })

  const selected = catalog.find((kit) => kit.id === selectedId) ?? catalog[0]
  const live = catalog.filter((kit) => kit.status === 'Live').length
  const totalSales = catalog.reduce((sum, kit) => sum + kit.sales, 0)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return catalog.filter((kit) => {
      if (filters.status !== 'All' && kit.status !== filters.status) return false
      if (filters.type !== 'All' && kit.type !== filters.type) return false
      if (!matchesPrice(kit, filters.price)) return false
      if (!needle) return true
      return [kit.title, kit.type, kit.status, ...(kit.tags ?? []), ...(kit.genre ?? [])].some((value) =>
        value.toLowerCase().includes(needle),
      )
    })
  }, [catalog, filters, query])

  function finishUpload(kit: SoundKit) {
    setCatalog((items) => [kit, ...items])
    setSelectedId(kit.id)
    setPanelOpen(false)
    setUploading(false)
  }

  function openAbout(id: string) {
    setSelectedId(id)
    setPanelOpen(true)
  }

  if (uploading) {
    return <UploadSoundKit onCancel={() => setUploading(false)} onComplete={finishUpload} />
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 flex-1 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-8 lg:pt-5">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex flex-wrap items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]">Sound kits</h1>
              <p className="mt-2 text-[14px] text-ink-mute">
                {catalog.length} kits · {formatCount(totalSales)} sales · {live} live
              </p>
            </div>
            <motion.button
              type="button"
              onClick={() => {
                setPanelOpen(false)
                setUploading(true)
              }}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="inline-flex h-9 select-none items-center justify-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium tracking-[-0.01em] text-white"
            >
              <span aria-hidden className="grid size-4 place-items-center rounded-full bg-white text-rose-500">
                <Plus size={10} weight="bold" />
              </span>
              Upload
            </motion.button>
          </motion.div>

          {featured.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-[18px] font-medium text-white">Top sellers</h2>
              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                {featured.map((kit) => (
                  <FeaturedCard
                    key={kit.id}
                    kit={kit}
                    onSelect={() => setSelectedId(kit.id)}
                    onAbout={() => openAbout(kit.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[18px] font-medium text-white">All kits</h2>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex w-full max-w-48 items-center gap-2 rounded-xl bg-white/8 px-3 py-2 sm:w-48">
                  <MagnifyingGlass size={14} className="shrink-0 text-ink-mute" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search kits"
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
                  />
                </label>
                {filterMenus.map((menu) => (
                  <FilterSelect
                    key={menu.id}
                    label={menu.label}
                    value={filters[menu.id]}
                    options={menu.options}
                    onChange={(value) => setFilters((current) => ({ ...current, [menu.id]: value }))}
                  />
                ))}
                <div className="flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
                  <button
                    type="button"
                    aria-label="List view"
                    onClick={() => setView('list')}
                    className={cn(
                      'grid size-7 place-items-center rounded-full transition-colors',
                      view === 'list' ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
                    )}
                  >
                    <List size={14} weight="bold" />
                  </button>
                  <button
                    type="button"
                    aria-label="Grid view"
                    onClick={() => setView('grid')}
                    className={cn(
                      'grid size-7 place-items-center rounded-full transition-colors',
                      view === 'grid' ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
                    )}
                  >
                    <SquaresFour size={14} weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            {visible.length === 0 ? (
              <p className="mt-8 rounded-2xl bg-white/5 px-4 py-12 text-center text-[14px] text-ink-mute">
                No kits match these filters.
              </p>
            ) : view === 'list' ? (
              <div className="mt-5 flex flex-col">
                {visible.map((kit) => (
                  <KitRow
                    key={kit.id}
                    kit={kit}
                    active={selectedId === kit.id}
                    onSelect={() => setSelectedId(kit.id)}
                    onAbout={() => openAbout(kit.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {visible.map((kit) => (
                  <GridCard
                    key={kit.id}
                    kit={kit}
                    active={selectedId === kit.id}
                    onSelect={() => setSelectedId(kit.id)}
                    onAbout={() => openAbout(kit.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <AnimatePresence initial={false}>
          {panelOpen ? (
            <motion.aside
              key="kit-panel"
              initial={reduce ? false : { width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={reduce ? undefined : { width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="hidden h-full shrink-0 overflow-hidden border-l border-white/10 xl:flex"
            >
              <div className="flex h-full w-75 flex-col overflow-auto">
                <div className="relative h-70 shrink-0 overflow-hidden">
                  <Cover kit={selected} className="size-full" />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-[#121214]" />
                  <button
                    type="button"
                    aria-label="Close about"
                    onClick={() => setPanelOpen(false)}
                    className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col bg-[#121214] px-5 pt-2 pb-6">
                  <p className="text-[12px] text-ink-mute">Catalog by</p>
                  <p className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-white">{current.name}</p>
                  <p className="mt-6 text-[12px] font-medium text-ink-mute">About the kit</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{selected.about}</p>
                  <p className="mt-3 text-[13px] text-ink-mute">
                    {selected.type} · {selected.sounds} sounds
                  </p>
                  <p className="mt-1 text-[13px] text-ink-mute">
                    From {selected.fromPrice} · {selected.status}
                  </p>
                  <div className="mt-auto grid grid-cols-2 gap-6 pt-10">
                    <div>
                      <p className="text-[12px] text-ink-mute">Plays</p>
                      <p className="mt-1 text-[22px] font-medium tracking-[-0.03em] text-white tnum">
                        {formatCount(selected.plays)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-ink-mute">Sales</p>
                      <p className="mt-1 text-[22px] font-medium tracking-[-0.03em] text-white tnum">
                        {formatCount(selected.sales)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
