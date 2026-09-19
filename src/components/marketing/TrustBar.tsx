import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Pause, Play, Plus } from 'lucide-react'
import { Waveform } from './primitives'
import { SealCheck } from '@phosphor-icons/react'

const avatars = ['/assets/avatar-1.jpg', '/assets/avatar-2.jpg', '/assets/avatar-3.jpg']

const listings = [
  { title: 'Half Light', producer: 'Kelu', genre: 'Amapiano', bpm: 96, key: 'F#m', price: '$60', license: 'Non-exclusive' },
  { title: 'Glass City', producer: 'Dëwit', genre: 'Afrobeats', bpm: 140, key: 'Cmaj', price: '$85', license: 'Exclusive' },
  { title: 'Quiet Riot', producer: 'Nao Beats', genre: 'Log Drum', bpm: 172, key: 'Gm', price: '$50', license: 'Non-exclusive' },
  { title: 'Harmattan', producer: 'Selasi', genre: 'Afro-fusion', bpm: 102, key: 'Dm', price: '$75', license: 'Non-exclusive' },
]

function MarketplaceList() {
  const [playing, setPlaying] = useState<string | null>(listings[0].title)

  return (
    <ul className="relative mt-5 flex flex-col gap-1">
      {listings.map((listing) => {
        const on = playing === listing.title
        return (
          <li
            key={listing.title}
            className={`rounded-2xl px-2 py-2.5 transition-colors ${on ? 'bg-rose-500/12' : 'hover:bg-white/6'}`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-pressed={on}
                aria-label={on ? `Pause ${listing.title}` : `Play ${listing.title}`}
                onClick={() => setPlaying(on ? null : listing.title)}
                className={`grid h-9 w-9 flex-none place-items-center rounded-full border backdrop-blur-md transition-shadow ${
                  on
                    ? 'border-rose-300/40 bg-rose-500/85 text-white shadow-[0_0_18px_rgba(251,113,133,0.45)]'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {on ? (
                  <Pause className="h-3.5 w-3.5" fill="currentColor" />
                ) : (
                  <Play className="h-3.5 w-3.5 translate-x-px" fill="currentColor" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-[15px] font-medium">{listing.title}</p>
                    {on && (
                      <Waveform bars={14} className="h-4 w-12 shrink-0 text-rose-300" barClassName="w-[2px]" animated />
                    )}
                  </div>
                  <p className="shrink-0 text-[15px] font-medium tabular-nums">{listing.price}</p>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="truncate text-[12px] text-white/45">
                    {listing.producer} · {listing.genre} · {listing.bpm} BPM · {listing.key}
                  </p>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/55">
                    {listing.license}
                  </span>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function TrustBar() {
  const reduce = useReducedMotion()

  return (
    <section id="marketplace" className="relative isolate overflow-hidden bg-ink-dark text-white">
      <div className="mx-auto grid w-full max-w-[1240px] gap-14 px-6 py-16 sm:py-24 lg:min-h-[760px] lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:px-10 lg:py-28">
        <div className="flex flex-col justify-between gap-16">
          <h2 className="max-w-xl text-[44px] leading-[0.96] font-medium tracking-[-0.04em] sm:text-[64px] lg:text-[76px]">
            There&apos;s a
            <span className="block">marketplace.</span>
          </h2>

          <div>
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {avatars.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-12 w-12 rounded-full border-2 border-ink-dark object-cover"
                  />
                ))}
              </div>
              <span className="relative z-10 -ml-3 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-black">
                Open
              </span>
            </div>
            <p className="mt-6 text-[56px] leading-none font-medium tracking-[-0.045em] sm:text-[72px]">Both.</p>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/55">
              For anyone looking, and anyone listing. Beats, packs, and stems.
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-end">
            <a
              href="#get-started"
              aria-label="Get started"
              className="grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M7 7l10 10M17 17V9M17 17H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="relative mt-8 flex flex-1 flex-col justify-end pt-8 sm:mt-4">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-10 right-6 h-56 w-56 rounded-full bg-rose-500/35 blur-3xl"
              animate={reduce ? undefined : { x: [0, -28, 12, 0], y: [0, 16, -10, 0], scale: [1, 1.12, 0.96, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-violet-400/25 blur-3xl"
              animate={reduce ? undefined : { x: [0, 22, -8, 0], y: [0, -14, 8, 0], opacity: [0.7, 1, 0.75, 0.7] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />

            <article className="relative z-10 overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-5 text-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/16 via-white/5 to-transparent"
              />
              {/* <img
                src="/assets/avatar-2.jpg"
                alt=""
                className="absolute -top-7 -right-1 h-16 w-16 rounded-full border-4 border-white/15 object-cover sm:-right-3 sm:h-20 sm:w-20"
              /> */}
              {/* <div className="relative flex items-center justify-between gap-4 pr-16">
                <span className="text-[18px] font-medium tracking-[-0.02em]">Soniq</span>
                <span className="rounded-full border border-rose-300/30 bg-rose-500/80 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">
                  Open
                </span>
              </div> */}
              <MarketplaceList />
            </article>

            <article className="relative z-0 -mt-5 ml-10 flex items-center justify-between gap-4 overflow-hidden rounded-[1.75rem] rounded-t-none border border-white/10 bg-white/6 px-5 pt-12 pb-5 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:ml-16 sm:px-6 sm:pt-10 sm:pb-6">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/10 to-transparent"
              />
              <div className="relative text-left">
                <p className="flex items-center gap-2 text-[32px] leading-none font-medium tracking-[-0.04em]">
                  Aurora
                  <SealCheck size={24} weight="fill" className="text-sky-400" />
                </p>
                {/* <p className="mt-1.5 text-[12px] text-white/45">1,475 subscribers</p> */}
              </div>
              <span className="relative inline-flex items-center gap-1.5 rounded-2xl border border-rose-300/30 bg-rose-500/85 px-4 py-3 text-[13px] font-medium text-white backdrop-blur-md">
                <Plus className="h-4 w-4" /> Follow
              </span>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
