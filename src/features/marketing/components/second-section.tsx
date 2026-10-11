import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { EASE } from './motion'
import { Container, MarketingButton } from './primitives'

const steps = ['License', 'Release', 'Split', 'Paid']

const lineReveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

function PlayDisc() {
  return (
    <span aria-hidden className="grid h-4 w-4 place-items-center rounded-full bg-white text-rose-500">
      <svg viewBox="0 0 10 10" className="h-3 w-3 translate-x-px">
        <path d="M2.6 1.15v7.7L8.7 5z" fill="currentColor" />
      </svg>
    </span>
  )
}

function RecordCard({ reduceMotion }: { reduceMotion: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const travel = inView && !reduceMotion

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-ink-dark p-6 text-white shadow-[0_28px_60px_-32px_rgba(0,0,0,0.7)] sm:p-8"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-12 h-56 w-56 rounded-full bg-rose-500/25 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -32, 10, 0], y: [0, 24, -10, 0], scale: [1, 1.16, 0.94, 1], opacity: [0.65, 1, 0.7, 0.65] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex items-center justify-between text-[12px] text-white/40">
        <span>The record</span>
        <span className="font-mono">Out</span>
      </div>

      <div className="relative">
        <p className="text-[40px] leading-none font-medium tracking-[-0.04em] sm:text-[52px]">Night Drive</p>
        <p className="mt-3 text-[14px] text-white/45">One song, from the session to the payout.</p>
      </div>

      <div className="relative">
        <div className="relative px-1.5">
          <div className="absolute top-[5px] right-1.5 left-1.5 h-px bg-white/15" />
          <motion.div
            className="absolute top-[5px] right-1.5 left-1.5 h-px origin-left bg-rose-400"
            initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.1, ease: EASE }}
          />
          {travel && (
            <motion.span
              aria-hidden
              className="absolute top-[5px] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(251,113,133,0.7)]"
              initial={{ left: '6px' }}
              animate={{ left: 'calc(100% - 6px)' }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
            />
          )}
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step} className="flex w-14 flex-col items-center gap-3">
                <span className="h-[11px] w-[11px] rounded-full border border-white/30 bg-ink-dark" />
                <span className="text-[12px] text-white/45">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-[48px] leading-none font-medium tracking-[-0.045em] sm:text-[60px]">$2,840</p>
        <p className="mt-3 text-[14px] text-white/45">This payout</p>
      </div>
    </motion.div>
  )
}

export function SecondSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="second" className="relative overflow-hidden bg-white py-24 text-black sm:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 -left-3 text-[168px] leading-none font-medium tracking-[-0.06em] text-black/[0.045] select-none sm:text-[210px]"
            >
              01
            </span>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.45 }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.04 },
                },
              }}
              className="relative"
            >
              <motion.p variants={reduceMotion ? undefined : lineReveal} className="text-[13px] font-medium text-black/35">
                Indie artist
              </motion.p>
              <h2 className="mt-4 max-w-md text-[40px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[52px]">
                <motion.span variants={reduceMotion ? undefined : lineReveal} className="block">
                  From the session
                </motion.span>
                <motion.span variants={reduceMotion ? undefined : lineReveal} className="block">
                  to the payouts.
                </motion.span>
              </h2>
              <motion.p
                variants={reduceMotion ? undefined : lineReveal}
                className="mt-5 max-w-md text-[16px] leading-relaxed text-black/50"
              >
                License the beat, release the record, split the money, and keep the catalog together.
                Nothing has to be typed in again when the song moves on.
              </motion.p>
              <motion.div variants={reduceMotion ? undefined : lineReveal} className="mt-8 flex items-center gap-6">
                <MarketingButton variant="primary" href="/signup" magnetic>
                  <PlayDisc />
                  Get started
                </MarketingButton>
                <a
                  href="#platform"
                  className="text-[15px] font-medium text-black transition-colors hover:text-rose-600"
                >
                  Explore the platform
                </a>
              </motion.div>
            </motion.div>
          </div>

          <RecordCard reduceMotion={reduceMotion} />
        </div>
      </Container>
    </section>
  )
}
