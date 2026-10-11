import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaretDown, List, MagnifyingGlass, Plus, SquaresFour, Trash } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { ActionModal } from '@/components/shared/action-modal'
import { NowPlayingBar } from '@/components/shared/now-playing-bar'
import { formatCompact } from '@/features/dashboard/beats'
import { useWorkspace } from '@/features/dashboard/workspace'
import { AllTracksGrid } from '@/features/tracks/components/all-tracks-grid'
import { AllTracksTable } from '@/features/tracks/components/all-tracks-table'
import { MostPlayedTracksCard } from '@/features/tracks/components/most-played-tracks-card'
import { TrackDetailsPanel } from '@/features/tracks/components/track-details-panel'
import {
  AllTracksGridSkeleton,
  AllTracksTableSkeleton,
} from '@/features/tracks/components/tracks-catalog-skeleton'
import { formatClock } from '@/features/tracks/components/upload-track-steps/shared'
import {
  DEFAULT_TRACK_FILTERS,
  FILTER_MENUS,
  QUICK_TAGS,
  filterTracks,
  type FilterId,
  type TracksViewMode,
} from '@/features/tracks/lib/filter-tracks'
import { trackToBeat } from '@/features/tracks/lib/map-beat'
import { useArchiveTrack, useDeleteTrack, useTracks } from '@/features/tracks/services'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

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
      <CaretDown
        size={12}
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-ink-mute"
      />
    </label>
  )
}

export default function TracksPage() {
  const navigate = useNavigate()
  const { current } = useWorkspace()
  const reduce = useReducedMotion()
  const { data: tracks, isLoading } = useTracks()
  const archiveTrack = useArchiveTrack()
  const deleteTrack = useDeleteTrack()
  const catalog = useMemo(() => (tracks ?? []).map(trackToBeat), [tracks])
  const mostPlayed = useMemo(
    () =>
      [...catalog]
        .filter((track) => track.status !== 'Draft')
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 4),
    [catalog],
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [aboutId, setAboutId] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState('00:00')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [view, setView] = useState<TracksViewMode>('list')
  const [filters, setFilters] = useState(DEFAULT_TRACK_FILTERS)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [deleteTrackId, setDeleteTrackId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playingTrackIdRef = useRef<string | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onTimeUpdate = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return
      setProgress(audio.currentTime / audio.duration)
      setElapsed(formatClock(audio.currentTime))
    }
    const onEnded = () => {
      setPlayingId(null)
      setProgress(0)
      setElapsed('00:00')
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!playingId) {
      audio.pause()
      return
    }

    const track = catalog.find((item) => item.id === playingId)
    if (!track?.previewUrl) {
      audio.pause()
      setPlayingId(null)
      toast.error('Add a tagged preview to play this track')
      return
    }

    if (playingTrackIdRef.current !== playingId) {
      playingTrackIdRef.current = playingId
      audio.src = track.previewUrl
      audio.currentTime = 0
      setProgress(0)
      setElapsed('00:00')
    }

    void audio.play().catch(() => {
      setPlayingId(null)
      toast.error('Could not play preview')
    })
  }, [catalog, playingId])

  useEffect(() => {
    if (isLoading) {
      const id = window.setTimeout(() => setShowSkeleton(true), 0)
      return () => window.clearTimeout(id)
    }
    if (reduce) {
      const id = window.setTimeout(() => setShowSkeleton(false), 0)
      return () => window.clearTimeout(id)
    }
    const timeout = window.setTimeout(() => setShowSkeleton(false), 420)
    return () => window.clearTimeout(timeout)
  }, [isLoading, reduce])

  const visible = useMemo(
    () => filterTracks(catalog, { query, activeTag, filters }),
    [activeTag, catalog, filters, query],
  )

  const selected = catalog.find((track) => track.id === selectedId) ?? null
  const aboutTrack = catalog.find((track) => track.id === aboutId) ?? null
  const deleteTarget = catalog.find((track) => track.id === deleteTrackId) ?? null
  const playing = selected != null && playingId !== null && playingId === selected.id
  const live = catalog.filter((track) => track.status === 'Live').length
  const totalPlays = catalog.reduce((sum, track) => sum + track.plays, 0)

  function selectTrack(id: string) {
    setSelectedId(id)
    const track = catalog.find((item) => item.id === id)
    if (!track?.previewUrl) {
      setPlayingId(null)
      toast.error('Add a tagged preview to play this track')
      return
    }
    setPlayingId(id)
  }

  function togglePlayPause() {
    if (!selected) return
    if (playing) {
      setPlayingId(null)
      return
    }
    if (!selected.previewUrl) {
      toast.error('Add a tagged preview to play this track')
      return
    }
    setPlayingId(selected.id)
  }

  function openAbout(id: string) {
    setAboutId(id)
  }

  function openEdit(id: string) {
    navigate(`/tracks/${id}/edit`)
  }

  function openDelete(id: string) {
    setDeleteTrackId(id)
  }

  async function copyTrackLink(id: string) {
    const track = catalog.find((item) => item.id === id)
    if (!track?.slug) {
      toast.error('This track does not have a link yet')
      return
    }
    const path = `/${current.username}/${track.slug}`
    const url = `${window.location.origin}${path}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy link')
    }
  }

  async function confirmArchive(id: string) {
    try {
      await archiveTrack.mutateAsync(id)
      if (selectedId === id) {
        setSelectedId(null)
        setPlayingId(null)
      }
      if (aboutId === id) setAboutId(null)
      toast.success('Track archived')
    } catch {
      // Error toast is handled by the API client interceptor
    }
  }

  async function confirmDelete() {
    if (!deleteTrackId) return
    const title = deleteTarget?.title
    try {
      await deleteTrack.mutateAsync(deleteTrackId)
      if (selectedId === deleteTrackId) {
        setSelectedId(null)
        setPlayingId(null)
      }
      if (aboutId === deleteTrackId) setAboutId(null)
      setDeleteTrackId(null)
      toast.success(title ? `“${title}” deleted` : 'Track deleted')
    } catch {
      // Error toast is handled by the API client interceptor
    }
  }

  function setFilter(id: FilterId, value: string) {
    setFilters((current) => ({ ...current, [id]: value }))
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-h-0 flex-1 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-8 lg:pt-5">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]">
                Tracks
              </h1>
              <p className="mt-2 text-[14px] text-ink-mute">
                {catalog.length} tracks · {formatCompact(totalPlays)} plays · {live} live
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            >
              <Link
                to="/tracks/upload"
                className="inline-flex h-9 select-none items-center justify-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium tracking-[-0.01em] text-white"
              >
                <span
                  aria-hidden
                  className="grid size-4 place-items-center rounded-full bg-white text-rose-500"
                >
                  <Plus size={10} weight="bold" />
                </span>
                Upload
              </Link>
            </motion.div>
          </motion.div>

          {mostPlayed.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-[18px] font-medium text-white">Most played</h2>
              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                {mostPlayed.map((track) => (
                  <MostPlayedTracksCard
                    key={track.id}
                    track={track}
                    active={selectedId === track.id}
                    playing={playingId === track.id}
                    onSelect={() => selectTrack(track.id)}
                    onAbout={() => openAbout(track.id)}
                    onEdit={() => openEdit(track.id)}
                    onArchive={
                      track.status === 'Live' ? () => void confirmArchive(track.id) : undefined
                    }
                    onDelete={() => openDelete(track.id)}
                    onCopyLink={() => void copyTrackLink(track.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className={mostPlayed.length > 0 ? 'mt-12' : 'mt-10'}>
            <h2 className="text-[18px] font-medium text-white">All tracks</h2>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex w-full max-w-56 items-center gap-2 rounded-xl bg-white/8 px-3 py-2 sm:w-56">
                  <MagnifyingGlass size={14} className="shrink-0 text-ink-mute" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search"
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
                  />
                </label>

                <div className="flex min-w-0 items-center gap-2 overflow-x-auto sm:justify-end">
                  {QUICK_TAGS.map((tag) => {
                    const active = activeTag === tag
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setActiveTag(active ? null : tag)}
                        className={cn(
                          'shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors',
                          active
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/8 text-ink-2 hover:bg-white/12 hover:text-white',
                        )}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4 overflow-x-auto">
                  {FILTER_MENUS.map((menu) => (
                    <FilterSelect
                      key={menu.id}
                      label={menu.label}
                      value={filters[menu.id]}
                      options={menu.options}
                      onChange={(value) => setFilter(menu.id, value)}
                    />
                  ))}
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-xl bg-white/8 p-1">
                  <button
                    type="button"
                    aria-label="List view"
                    aria-pressed={view === 'list'}
                    onClick={() => setView('list')}
                    className={cn(
                      'grid size-8 place-items-center rounded-lg transition-colors',
                      view === 'list' ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
                    )}
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Grid view"
                    aria-pressed={view === 'grid'}
                    onClick={() => setView('grid')}
                    className={cn(
                      'grid size-8 place-items-center rounded-lg transition-colors',
                      view === 'grid' ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
                    )}
                  >
                    <SquaresFour size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              {showSkeleton ? (
                <div
                  aria-hidden={!isLoading}
                  className={cn(
                    'transition-opacity duration-400 ease-out',
                    isLoading
                      ? 'relative opacity-100'
                      : 'pointer-events-none absolute inset-x-0 top-0 z-10 opacity-0',
                  )}
                >
                  {view === 'list' ? <AllTracksTableSkeleton /> : <AllTracksGridSkeleton />}
                </div>
              ) : null}

              {!isLoading ? (
                <motion.div
                  initial={reduce || !showSkeleton ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {visible.length === 0 ? (
                    <p className="mt-8 rounded-2xl bg-white/5 px-4 py-12 text-center text-[14px] text-ink-mute">
                      {catalog.length === 0
                        ? 'No tracks yet. Upload your first master to get started.'
                        : 'No tracks match these filters.'}
                    </p>
                  ) : view === 'list' ? (
                    <AllTracksTable
                      tracks={visible}
                      selectedId={selectedId}
                      playingId={playingId}
                      onSelect={selectTrack}
                      onAbout={openAbout}
                      onEdit={openEdit}
                      onArchive={(id) => void confirmArchive(id)}
                      onDelete={openDelete}
                      onCopyLink={(id) => void copyTrackLink(id)}
                    />
                  ) : (
                    <AllTracksGrid
                      tracks={visible}
                      selectedId={selectedId}
                      playingId={playingId}
                      onSelect={selectTrack}
                      onAbout={openAbout}
                      onEdit={openEdit}
                      onArchive={(id) => void confirmArchive(id)}
                      onDelete={openDelete}
                      onCopyLink={(id) => void copyTrackLink(id)}
                    />
                  )}
                </motion.div>
              ) : null}
            </div>
          </section>
        </div>

        <TrackDetailsPanel
          track={aboutTrack}
          catalogBy={current.name}
          open={aboutTrack != null}
          onClose={() => setAboutId(null)}
        />
      </div>

      {selected ? (
        <NowPlayingBar
          coverSrc={selected.image}
          title={selected.title}
          subtitle={`${current.name} · ${selected.year}`}
          duration={selected.duration}
          progress={progress}
          playing={playing}
          elapsed={elapsed}
          metaPrimary={selected.fromPrice}
          metaSecondary={selected.status}
          onPlayPause={togglePlayPause}
        />
      ) : null}

      <ActionModal
        open={deleteTrackId != null}
        title="Delete track?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be removed from your catalog. Files are kept for now in case you need them later.`
            : 'This track will be removed from your catalog.'
        }
        icon={<Trash weight="duotone" />}
        confirmLabel="Delete"
        tone="destructive"
        busy={deleteTrack.isPending}
        onClose={() => {
          if (!deleteTrack.isPending) setDeleteTrackId(null)
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  )
}