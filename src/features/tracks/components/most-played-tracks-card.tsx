import { Pause, Play } from '@phosphor-icons/react'
import type { Beat } from '@/features/dashboard/beats'
import { TrackCover } from '@/features/tracks/components/track-cover'
import { TrackMenu } from '@/features/tracks/components/track-menu'
import { cn } from '@/lib/utils'

export function MostPlayedTracksCard({
  track,
  active,
  playing,
  onSelect,
  onAbout,
  onEdit,
  onArchive,
  onDelete,
  onCopyLink,
}: {
  track: Beat
  active: boolean
  playing: boolean
  onSelect: () => void
  onAbout: () => void
  onEdit?: () => void
  onArchive?: () => void
  onDelete?: () => void
  onCopyLink?: () => void
}) {
  return (
    <div className="group min-w-0 flex-1">
      <button type="button" onClick={onSelect} className="w-full text-left">
        <span className="relative block overflow-hidden rounded-xl">
          <TrackCover
            track={track}
            className="aspect-square w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          <span
            className={cn(
              'absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25',
              active && playing && 'bg-black/30',
            )}
          />
          <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="grid size-11 place-items-center rounded-full bg-white text-black">
              {active && playing ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" className="ml-0.5" />}
            </span>
          </span>
        </span>
      </button>
      <div className="mt-3 flex items-start gap-2">
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[15px] font-medium text-white">{track.title}</span>
          <span className="mt-0.5 block truncate text-[13px] text-ink-mute">
            {track.genre.join(', ')} · {track.year}
          </span>
        </button>
        <TrackMenu
          status={track.status}
          onAbout={onAbout}
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
          onCopyLink={onCopyLink}
        />
      </div>
    </div>
  )
}

export default MostPlayedTracksCard
