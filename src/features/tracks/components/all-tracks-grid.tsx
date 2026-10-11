import { Pause, Play } from '@phosphor-icons/react'
import { formatCompact, type Beat } from '@/features/dashboard/beats'
import { TrackCover } from '@/features/tracks/components/track-cover'
import { TrackMenu } from '@/features/tracks/components/track-menu'

export function AllTracksGrid({
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
  return (
    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {tracks.map((track) => {
        const active = selectedId === track.id
        const playing = playingId === track.id

        return (
          <div key={track.id} className="group min-w-0">
            <button type="button" onClick={() => onSelect(track.id)} className="w-full text-left">
              <span className="relative block overflow-hidden rounded-xl">
                <TrackCover
                  track={track}
                  className="aspect-square w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="grid size-10 place-items-center rounded-full bg-white text-black">
                    {active && playing ? (
                      <Pause size={16} weight="fill" />
                    ) : (
                      <Play size={16} weight="fill" className="ml-0.5" />
                    )}
                  </span>
                </span>
              </span>
            </button>
            <div className="mt-3 flex items-start gap-2">
              <button type="button" onClick={() => onSelect(track.id)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[14px] font-medium text-white">{track.title}</span>
                <span className="mt-0.5 block truncate text-[12px] text-ink-mute">
                  {track.genre.join(', ')} · {track.status}
                </span>
              </button>
              <TrackMenu
                status={track.status}
                onAbout={() => onAbout(track.id)}
                onEdit={onEdit ? () => onEdit(track.id) : undefined}
                onArchive={onArchive ? () => onArchive(track.id) : undefined}
                onDelete={onDelete ? () => onDelete(track.id) : undefined}
                onCopyLink={onCopyLink ? () => onCopyLink(track.id) : undefined}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="rounded-lg bg-white/8 px-2.5 py-1.5 text-[12px] font-medium text-white tnum">
                {track.fromPrice}
              </span>
              <span className="text-[11px] text-ink-faint tnum">{formatCompact(track.plays)} plays</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AllTracksGrid
