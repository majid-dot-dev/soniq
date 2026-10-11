import { Plus } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import type { LicenseCatalog } from '@/features/licenses/types'

const EASE = [0.16, 1, 0.3, 1] as const

export function LicensesEmptyState({
  reduce,
  searching,
  catalog,
  onCreate,
}: {
  reduce: boolean
  searching: boolean
  catalog: LicenseCatalog
  onCreate: () => void
}) {
  const title = searching
    ? 'No matches'
    : catalog === 'beat'
      ? 'No beat licenses yet'
      : 'No kit licenses yet'

  const subtitle = searching
    ? 'Try a different search, or clear the filter to see everything.'
    : 'Create a template once — attach it to tracks when you upload.'

  const particles = [
    { x: '8%', y: '18%', kind: 'dot' as const, delay: 0.1 },
    { x: '88%', y: '22%', kind: 'ring' as const, delay: 0.25 },
    { x: '18%', y: '78%', kind: 'plus' as const, delay: 0.15 },
    { x: '82%', y: '72%', kind: 'dot' as const, delay: 0.35 },
    { x: '4%', y: '48%', kind: 'ring' as const, delay: 0.2 },
    { x: '94%', y: '52%', kind: 'plus' as const, delay: 0.3 },
    { x: '42%', y: '8%', kind: 'dot' as const, delay: 0.05 },
    { x: '58%', y: '88%', kind: 'ring' as const, delay: 0.4 },
  ]

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-4 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10"
    >
      <div className="relative grid h-44 w-56 place-items-center sm:h-48 sm:w-64">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-6 rounded-full bg-white/6 blur-2xl"
        />

        {particles.map((particle, index) => (
          <motion.span
            key={`${particle.kind}-${index}`}
            aria-hidden
            className="pointer-events-none absolute text-white/25"
            style={{ left: particle.x, top: particle.y }}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={
              reduce
                ? { opacity: 0.45 }
                : {
                    opacity: [0.2, 0.55, 0.2],
                    y: [0, -5, 0],
                    scale: [1, 1.08, 1],
                  }
            }
            transition={
              reduce
                ? undefined
                : {
                    opacity: { duration: 3.6, repeat: Infinity, delay: particle.delay, ease: 'easeInOut' },
                    y: { duration: 4.2, repeat: Infinity, delay: particle.delay, ease: 'easeInOut' },
                    scale: { duration: 3.6, repeat: Infinity, delay: particle.delay, ease: 'easeInOut' },
                  }
            }
          >
            {particle.kind === 'dot' ? (
              <span className="block size-1.5 rounded-full bg-current" />
            ) : particle.kind === 'ring' ? (
              <span className="block size-3 rounded-full border border-current" />
            ) : (
              <Plus size={10} weight="bold" />
            )}
          </motion.span>
        ))}

        <motion.div
          aria-hidden
          className="absolute left-[18%] top-[22%] h-24 w-30 rounded-2xl bg-white/8 ring-1 ring-white/10 sm:h-28 sm:w-36"
          initial={reduce ? false : { opacity: 0, x: 10, y: 8, rotate: 4 }}
          animate={
            reduce
              ? { opacity: 1, rotate: 6 }
              : { opacity: 1, x: 0, y: [0, -4, 0], rotate: 6 }
          }
          transition={
            reduce
              ? { duration: 0.4, ease: EASE }
              : {
                  opacity: { duration: 0.5, ease: EASE },
                  x: { duration: 0.5, ease: EASE },
                  rotate: { duration: 0.5, ease: EASE },
                  y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                }
          }
        >
          <div className="flex h-full flex-col justify-center gap-2 px-4">
            <span className="h-1.5 w-14 rounded-full bg-white/15" />
            <span className="h-1.5 w-9 rounded-full bg-white/10" />
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute left-[28%] top-[30%] z-10 h-28 w-34 rounded-2xl bg-white/12 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] ring-1 ring-white/16 sm:h-32 sm:w-40"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -6, 0] }}
          transition={
            reduce
              ? { duration: 0.45, ease: EASE, delay: 0.05 }
              : {
                  opacity: { duration: 0.45, ease: EASE, delay: 0.08 },
                  y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
                }
          }
        >
          <div className="flex h-full flex-col justify-center gap-2.5 px-4">
            <span className="h-2 w-16 rounded-full bg-white/25" />
            <span className="h-1.5 w-12 rounded-full bg-white/15" />
            <span className="mt-1 h-1.5 w-8 rounded-full bg-rose-500/50" />
          </div>
        </motion.div>
      </div>

      <motion.h3
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : 0.12 }}
        className="mt-8 text-center text-[20px] font-semibold tracking-[-0.03em] text-white sm:text-[22px]"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : 0.18 }}
        className="mt-2 max-w-xs text-center text-[13px] leading-relaxed text-ink-mute sm:text-[14px]"
      >
        {subtitle}
      </motion.p>

      {!searching ? (
        <motion.button
          type="button"
          onClick={onCreate}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : 0.24 }}
          whileHover={reduce ? undefined : { scale: 1.03 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          className="mt-6 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white"
        >
          <Plus size={12} weight="bold" />
          New license
        </motion.button>
      ) : null}
    </motion.div>
  )
}
