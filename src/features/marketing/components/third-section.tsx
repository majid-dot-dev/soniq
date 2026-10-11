import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { EASE } from './motion'
import { Container, MarketingButton, Waveform } from './primitives'

const stats = [
  { value: '86,204', label: 'Plays' },
  { value: '$12,480', label: 'Revenue' },
  { value: '14', label: 'Countries' },
]

const notes = [
  { title: 'Listed once', body: 'The price and the terms go up with the beat.' },
  { title: 'Used on their records', body: 'Each song that takes it keeps the link.' },
  { title: 'Paid on one statement', body: 'Every use comes back. Nothing to invoice.' },
]

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

function PlayerScreen({ reduceMotion }: { reduceMotion: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: EASE }}
      className="overflow-hidden rounded-[1.75rem] bg-ink-dark text-white shadow-[0_28px_60px_-32px_rgba(0,0,0,0.7)]"
    >
      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-6">
        <div
          aria-hidden
          className="relative grid h-36 w-36 flex-none place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-400 via-rose-500 to-violet-400 sm:h-40 sm:w-40"
        >
          <motion.div
            className="relative h-[86%] w-[86%] rounded-full shadow-[0_8px_18px_-10px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.12)]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, #1a120f 0 6.5%, transparent 7%), radial-gradient(circle at 50% 50%, #fb7185 0 20%, #e11d48 20% 22%, transparent 22.5%), repeating-radial-gradient(circle at 50% 50%, #100e0c 0 1px, #2c261f 1px 3px)',
            }}
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={reduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(115deg,transparent_36%,rgba(255,255,255,0.18)_46%,transparent_56%)]" />
          </motion.div>
        </div>

        <div className="min-w-0 flex-1">
          {/* <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-white/45">Now playing</span>
            <span className="font-mono text-[11px] text-white/35">98 BPM</span>
          </div> */}
          <p className="truncate text-[26px] font-medium tracking-[-0.03em] sm:text-[28px]">Amapiano Breeze</p>
          <p className="mt-1 text-[13px] text-white/45">Amapiano · F# minor · 98 BPM</p>

          <div className="mt-5 h-10 w-full text-rose-400">
            <Waveform
              bars={64}
              className="w-full justify-between gap-0"
              barClassName="w-[2.5px]"
              animated={!reduceMotion}
            />
          </div>
          <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-white/40">
            <span>1:12</span>
            <span className="relative h-px flex-1 bg-white/15">
              <motion.span
                className="absolute inset-y-0 left-0 bg-rose-400"
                initial={reduceMotion ? { width: '38%' } : { width: '0%' }}
                animate={inView ? { width: '38%' } : undefined}
                transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              >
                <span className="absolute top-1/2 right-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </motion.span>
            </span>
            <span>3:04</span>
          </div>

          <div aria-hidden className="mt-4 flex items-center justify-center gap-6 text-white/70">
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5">
              <path d="M8.5 1.5 L3.5 6 L8.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-rose-500">
              <svg viewBox="0 0 12 12" className="h-3.5 w-3.5">
                <rect x="2.1" y="1.4" width="2.3" height="9.2" rx="0.5" fill="currentColor" />
                <rect x="7.6" y="1.4" width="2.3" height="9.2" rx="0.5" fill="currentColor" />
              </svg>
            </span>
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5">
              <path d="M3.5 1.5 L8.5 6 L3.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-white/10">
        {stats.map((stat, index) => (
          <div key={stat.label} className={index > 0 ? 'border-l border-white/10 px-4 py-4 sm:px-5' : 'px-5 py-4'}>
            <p className="font-mono text-[18px] tracking-[-0.03em] text-white sm:text-[20px]">{stat.value}</p>
            <p className="mt-1 text-[12px] text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function ThirdSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="third" className="relative overflow-hidden bg-muted pt-28 pb-24 text-black sm:pt-36 sm:pb-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.14fr_0.86fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <PlayerScreen reduceMotion={reduceMotion} />
          </div>

          <div className="relative order-1 lg:order-2">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 -left-3 text-[168px] leading-none font-medium tracking-[-0.06em] text-black/[0.045] select-none sm:text-[210px]"
            >
              02
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
                Producer
              </motion.p>
              <h2 className="mt-4 max-w-md text-[40px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[52px]">
                <motion.span variants={reduceMotion ? undefined : lineReveal} className="block">
                  From your studio
                </motion.span>
                <motion.span variants={reduceMotion ? undefined : lineReveal} className="block">
                  to global audiences.
                </motion.span>
              </h2>
              <motion.p
                variants={reduceMotion ? undefined : lineReveal}
                className="mt-5 max-w-md text-[16px] leading-relaxed text-black/50"
              >
                List the beat, set who can use it, and get paid when they do. The song that comes out still
                points back to the producer who made it.
              </motion.p>
              <motion.ul variants={reduceMotion ? undefined : lineReveal} className="mt-8 flex max-w-md flex-col gap-4">
                {notes.map((note) => (
                  <li key={note.title} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-rose-500" />
                    <span>
                      <span className="block text-[15px] font-medium tracking-[-0.02em]">{note.title}</span>
                      <span className="mt-0.5 block text-[13.5px] leading-relaxed text-black/45">{note.body}</span>
                    </span>
                  </li>
                ))}
              </motion.ul>
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
        </div>
      </Container>
    </section>
  )
}
