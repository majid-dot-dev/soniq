import { Pause, Play, SkipBack, SkipForward } from '@phosphor-icons/react'
import { TrackCoverPlaceholder } from '@/features/tracks/components/track-cover'
import { cn } from '@/lib/utils'

export type NowPlayingBarProps = {
  coverSrc?: string | null
  title: string
  subtitle: string
  duration: string
  /** Playback position from 0 to 1 */
  progress: number
  playing: boolean
  elapsed?: string
  metaPrimary?: string
  metaSecondary?: string
  onPlayPause: () => void
  onPrevious?: () => void
  onNext?: () => void
  className?: string
}

export function NowPlayingBar({
  coverSrc,
  title,
  subtitle,
  duration,
  progress,
  playing,
  elapsed = '00:00',
  metaPrimary,
  metaSecondary,
  onPlayPause,
  onPrevious,
  onNext,
  className,
}: NowPlayingBarProps) {
  const clamped = Math.max(0, Math.min(1, progress))

  return (
    <div
      className={cn(
        'relative z-20 shrink-0 border-t border-white/10 bg-[rgba(18,18,20,0.55)] px-4 py-3.5 shadow-[0_-16px_48px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150 sm:px-6',
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt=""
            className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
          />
        ) : (
          <TrackCoverPlaceholder seed={title} className="size-12 shrink-0 rounded-lg" />
        )}
        <div className="min-w-0 w-40 sm:w-52">
          <p className="truncate text-[14px] font-medium text-white">{title}</p>
          <p className="mt-0.5 truncate text-[12px] text-ink-mute">{subtitle}</p>
        </div>

        <div className="mx-auto flex min-w-0 max-w-md flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous"
              onClick={onPrevious}
              disabled={!onPrevious}
              className="text-ink-mute transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <SkipBack size={18} weight="fill" />
            </button>
            <button
              type="button"
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={onPlayPause}
              className="grid size-10 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105"
            >
              {playing ? (
                <Pause size={16} weight="fill" />
              ) : (
                <Play size={16} weight="fill" className="ml-0.5" />
              )}
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={onNext}
              disabled={!onNext}
              className="text-ink-mute transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <SkipForward size={18} weight="fill" />
            </button>
          </div>
          <div className="flex w-full items-center gap-3">
            <span className="w-10 text-right text-[11px] text-ink-mute tnum">{elapsed}</span>
            <div className="relative h-px flex-1 bg-white/15">
              <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${clamped * 100}%` }} />
              <span
                aria-hidden
                className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-white"
                style={{ left: `calc(${clamped * 100}% - 5px)` }}
              />
            </div>
            <span className="w-10 text-[11px] text-ink-mute tnum">{duration}</span>
          </div>
        </div>

        {metaPrimary || metaSecondary ? (
          <div className="hidden w-28 shrink-0 text-right sm:block">
            {metaPrimary ? (
              <p className="text-[13px] font-medium text-white tnum">{metaPrimary}</p>
            ) : null}
            {metaSecondary ? (
              <p className="mt-0.5 text-[11px] text-ink-mute">{metaSecondary}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default NowPlayingBar
