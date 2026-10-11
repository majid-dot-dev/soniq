import { X } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { formatCount, type Beat } from '@/features/dashboard/beats'
import { TrackCover } from '@/features/tracks/components/track-cover'

const EASE = [0.16, 1, 0.3, 1] as const

export function TrackDetailsPanel({
  track,
  catalogBy,
  open,
  onClose,
}: {
  track: Beat | null
  catalogBy: string
  open: boolean
  onClose: () => void
}) {
  const reduce = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {open && track ? (
        <motion.aside
          key="track-panel"
          initial={reduce ? false : { width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={reduce ? undefined : { width: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="hidden h-full shrink-0 overflow-hidden border-l border-white/10 xl:flex"
        >
          <div className="flex h-full w-90 flex-col overflow-auto">
            <div className="relative h-70 shrink-0 overflow-hidden">
              <TrackCover track={track} className="size-full" />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-[#121214]" />
              <button
                type="button"
                aria-label="Close about"
                onClick={onClose}
                className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <X size={14} weight="bold" />
              </button>
            </div>
            <div className="flex flex-1 flex-col bg-[#121214] px-5 pt-2 pb-6">
              <p className="text-[12px] text-ink-mute">Catalog by</p>
              <p className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-white">{catalogBy}</p>
              <p className="mt-6 text-[12px] font-medium text-ink-mute">About the track</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{track.about}</p>
              <p className="mt-3 text-[13px] text-ink-mute">
                {track.bpm} BPM · {track.key} · {track.genre.join(', ')}
              </p>
              <p className="mt-1 text-[13px] text-ink-mute">
                From {track.fromPrice} · {track.status}
              </p>
              <div className="mt-auto grid grid-cols-2 gap-6 pt-10">
                <div>
                  <p className="text-[12px] text-ink-mute">Plays</p>
                  <p className="mt-1 text-[22px] font-medium tracking-[-0.03em] text-white tnum">
                    {formatCount(track.plays)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-ink-mute">Sales</p>
                  <p className="mt-1 text-[22px] font-medium tracking-[-0.03em] text-white tnum">
                    {formatCount(track.sales)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}

export default TrackDetailsPanel