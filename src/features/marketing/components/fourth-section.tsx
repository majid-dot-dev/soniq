import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { EASE } from './motion'
import { Container, MarketingButton } from './primitives'

const shares = [
  { name: 'Amara', width: '54%', color: 'bg-rose-500' },
  { name: 'Selasi', width: '21%', color: 'bg-violet-400' },
  { name: 'Kelu', width: '25%', color: 'bg-amber-400' },
]

const avatars = ['/assets/avatar-1.jpg', '/assets/avatar-2.jpg', '/assets/avatar-3.jpg']

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

function StatementCard({ reduceMotion }: { reduceMotion: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

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
            : { x: [0, -36, 8, 0], y: [0, 28, -12, 0], scale: [1, 1.18, 0.94, 1], opacity: [0.7, 1, 0.75, 0.7] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 24, -10, 0], y: [0, -20, 8, 0], opacity: [0.45, 0.8, 0.5, 0.45] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex items-center justify-between text-[12px] text-white/40">
        <span className="inline-flex items-center gap-2">
          <motion.span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-rose-400"
            animate={reduceMotion ? undefined : { opacity: [1, 0.35, 1], scale: [1, 0.8, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          Total Royalties
        </span>
        <span className="font-mono">See Breakdown</span>
      </div>

      <div className="relative">
        <div className="flex -space-x-3">
          {avatars.map((src, index) => (
            <motion.img
              key={src}
              src={src}
              alt=""
              className="h-12 w-12 rounded-full border-2 border-ink-dark object-cover"
              initial={reduceMotion ? false : { opacity: 0, x: -10, scale: 0.9 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : undefined}
              transition={{ duration: 0.55, delay: 0.08 + index * 0.1, ease: EASE }}
            />
          ))}
        </div>
        <p className="mt-6 text-[56px] leading-none font-medium tracking-[-0.045em] sm:text-[72px]">$40.44K</p>
        <p className="mt-3 text-[14px] text-white/45">One payment, from the whole roster.</p>
      </div>

      <div className="relative">
        <div className="relative flex h-1.5 overflow-hidden rounded-full bg-white/10">
          {shares.map((share, index) => (
            <motion.span
              key={share.name}
              className={share.color}
              initial={reduceMotion ? { width: share.width } : { width: '0%' }}
              animate={inView ? { width: share.width } : undefined}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: EASE }}
            />
          ))}
          {!reduceMotion && inView && (
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-10 bg-white/35 blur-[2px]"
              initial={{ left: '-12%' }}
              animate={{ left: '108%' }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1.1, repeatDelay: 1.4 }}
            />
          )}
        </div>
        <div className="mt-3 grid grid-cols-[54fr_21fr_25fr] text-[12px] text-white/45">
          {shares.map((share) => (
            <span key={share.name} className="truncate">
              {share.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function FourthSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="fourth" className="relative overflow-hidden bg-white pt-28 pb-28 text-black sm:pt-36 sm:pb-36">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 -left-3 text-[168px] leading-none font-medium tracking-[-0.06em] text-black/[0.045] select-none sm:text-[210px]"
            >
              03
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
                Label
              </motion.p>
              <h2 className="mt-4 max-w-md text-[40px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[52px]">
                <motion.span variants={reduceMotion ? undefined : lineReveal} className="block">
                  From the roster
                </motion.span>
                <motion.span variants={reduceMotion ? undefined : lineReveal} className="block">
                  to one statement.
                </motion.span>
              </h2>
              <motion.p
                variants={reduceMotion ? undefined : lineReveal}
                className="mt-5 max-w-md text-[16px] leading-relaxed text-black/50"
              >
                Every artist, every release, and every split stays on the same books. Nothing has to be rebuilt
                when someone on the roster puts a song out.
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

          <StatementCard reduceMotion={reduceMotion} />
        </div>
      </Container>
    </section>
  )
}
