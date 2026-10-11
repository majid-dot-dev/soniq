import { Pause, Play } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { formatCompact, type Beat } from '@/features/dashboard/beats'
import { TrackCover } from '@/features/tracks/components/track-cover'
import { TrackMenu } from '@/features/tracks/components/track-menu'
import { cn } from '@/lib/utils'

function rowTags(track: Beat) {
  return [...track.genre, ...track.mood, track.key].map((tag) => tag.toLowerCase())
}

const PLAYING_BARS = [
  { height: '48%', duration: '0.68s', delay: '0.02s' },
  { height: '100%', duration: '1.14s', delay: '0.27s' },
  { height: '62%', duration: '0.84s', delay: '0.09s' },
  { height: '86%', duration: '1.31s', delay: '0.41s' },
] as const

export function AllTracksTable({
  tracks,
  selectedId,
  playingId,
  onSelect,
  onAbout,
  onEdit,
  onArchive,
  onDelete,
  onCopyLink,
}: {
  tracks: Beat[]
  selectedId: string | null
  playingId: string | null
  onSelect: (id: string) => void
  onAbout: (id: string) => void
  onEdit?: (id: string) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
  onCopyLink?: (id: string) => void
}) {
  const reduce = useReducedMotion()

  return (
    <div className="mt-5 flex flex-col">
      {tracks.map((track) => {
        const active = selectedId === track.id
        const playing = playingId === track.id

        return (
          <div
            key={track.id}
            className={cn(
              'group relative flex w-full items-center gap-3 rounded-xl px-2 py-3 sm:gap-4 sm:px-3',
              !active && 'hover:bg-white/6',
            )}
          >
            {active ? (
              <motion.div
                layoutId={reduce ? undefined : 'tracks-table-selection'}
                className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-r from-rose-500/12 via-rose-500/6 to-transparent"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 }
                }
              />
            ) : null}

            <button
              type="button"
              onClick={() => onSelect(track.id)}
              className="relative flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
            >
              <span className="relative block size-12 shrink-0 overflow-hidden rounded-lg sm:size-14">
                <TrackCover track={track} className="size-full" />
                <span
                  className={cn(
                    'absolute inset-0 transition-colors duration-300',
                    playing ? 'bg-black/65' : 'bg-black/0 group-hover:bg-black/65',
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-0 grid place-items-center transition-opacity duration-300',
                    playing ? 'opacity-100 group-hover:opacity-0' : 'opacity-0',
                  )}
                  aria-hidden={!playing}
                >
                  <span className="flex h-3.5 items-end gap-[2.5px] text-rose-400 sm:h-4">
                    {PLAYING_BARS.map((bar, i) => (
                      <span
                        key={i}
                        className="w-[2.5px] origin-bottom rounded-full bg-current sm:w-[3px]"
                        style={{
                          height: bar.height,
                          animation: playing
                            ? `wave ${bar.duration} ease-in-out ${bar.delay} infinite`
                            : undefined,
                        }}
                      />
                    ))}
                  </span>
                </span>
                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="grid size-7 place-items-center rounded-full bg-white text-black sm:size-8">
                    {playing ? (
                      <Pause size={12} weight="fill" />
                    ) : (
                      <Play size={12} weight="fill" className="ml-0.5" />
                    )}
                  </span>
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[15px] font-medium text-white">{track.title}</span>
                  <span
                    className={cn(
                      'hidden shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase sm:inline',
                      track.status === 'Live' && 'bg-yield-tint text-yield-bright',
                      track.status === 'Draft' && 'bg-white/8 text-ink-mute',
                      track.status === 'Sold' && 'bg-rose-500/15 text-rose-300',
                    )}
                  >
                    {track.status}
                  </span>
                </span>
                <span className="mt-1 block truncate text-[12px] text-ink-mute">
                  {track.bpm} BPM · {track.key} · {formatCompact(track.plays)} plays
                </span>
              </span>
            </button>

            <div className="relative hidden min-w-0 max-w-sm flex-wrap items-center justify-end gap-1.5 lg:flex">
              {rowTags(track).map((tag) => (
                <span
                  key={tag}
                  className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-2"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={() => onSelect(track.id)}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className="relative hidden h-7 shrink-0 select-none items-center rounded-lg bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-2 text-[12px] font-medium tracking-[-0.01em] text-white sm:inline-flex"
            >
              <span className="tnum">{track.fromPrice}</span>
            </motion.button>

            <div className="relative">
              <TrackMenu
                status={track.status}
                onAbout={() => onAbout(track.id)}
                onEdit={onEdit ? () => onEdit(track.id) : undefined}
                onArchive={onArchive ? () => onArchive(track.id) : undefined}
                onDelete={onDelete ? () => onDelete(track.id) : undefined}
                onCopyLink={onCopyLink ? () => onCopyLink(track.id) : undefined}
                vertical
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AllTracksTable
