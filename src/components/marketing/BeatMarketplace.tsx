import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { FileCheck2, Mic, Percent, Play, Send, ShoppingCart } from 'lucide-react'
import { Container, MarketingButton, Reveal, SectionHeading, Waveform } from './primitives'
import { FloatingOrb, Stagger, StaggerItem, TiltCard } from './motion'
import { cn } from '@/lib/utils'

const marketplaceBeats = [
  {
    title: 'Half Light',
    producer: 'Kelu',
    bpm: 96,
    key: 'F#m',
    genre: 'Amapiano',
    price: '$60',
    art: 'from-ember to-ember-deep',
    glow: 'rgba(226,85,31,0.45)',
  },
  {
    title: 'Glass City',
    producer: 'Dëwit',
    bpm: 140,
    key: 'Cmaj',
    genre: 'Afrobeats',
    price: '$85',
    art: 'from-signal to-signal-deep',
    glow: 'rgba(123,114,232,0.45)',
  },
  {
    title: 'Quiet Riot',
    producer: 'Nao Beats',
    bpm: 172,
    key: 'Gm',
    genre: 'Log Drum',
    price: '$50',
    art: 'from-yield to-yield-deep',
    glow: 'rgba(47,203,125,0.4)',
  },
  {
    title: 'Harmattan',
    producer: 'Selasi',
    bpm: 102,
    key: 'Dm',
    genre: 'Afro-fusion',
    price: '$75',
    art: 'from-ink-dark-2 to-ink-dark',
    glow: 'rgba(255,255,255,0.15)',
  },
  {
    title: 'Low Light',
    producer: 'Riven',
    bpm: 108,
    key: 'Bbm',
    genre: 'Alté',
    price: '$65',
    art: 'from-ember-bright to-ember',
    glow: 'rgba(242,112,59,0.45)',
  },
  {
    title: 'Static Bloom',
    producer: 'Kelu',
    bpm: 132,
    key: 'Am',
    genre: 'Gqom',
    price: '$55',
    art: 'from-signal-deep to-ink-dark',
    glow: 'rgba(87,79,201,0.4)',
  },
]

const workflow = [
  { label: 'Beat purchase', icon: ShoppingCart, tone: 'ember' as const },
  { label: 'License', icon: FileCheck2, tone: 'signal' as const },
  { label: 'Record', icon: Mic, tone: 'ember' as const },
  { label: 'Release', icon: Send, tone: 'signal' as const },
  { label: 'Royalties', icon: Percent, tone: 'yield' as const },
]

const toneIcon: Record<string, string> = {
  ember: 'bg-ember-tint text-ember-bright',
  signal: 'bg-signal-tint text-signal',
  yield: 'bg-yield-tint text-yield-bright',
}

function BeatCard({ beat, index }: { beat: (typeof marketplaceBeats)[number]; index: number }) {
  return (
    <TiltCard
      max={6}
      className="w-[272px] flex-none overflow-hidden rounded-2xl border border-line-dark bg-surface-dark shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-shadow duration-300 hover:shadow-[0_28px_54px_-20px_var(--glow)]"
      style={{ '--glow': beat.glow } as CSSProperties}
    >
      <div className="group flex flex-col">
        <div className={cn('relative flex h-[152px] items-center justify-center overflow-hidden bg-gradient-to-br', beat.art)}>
          <motion.span
            className="text-[34px] font-semibold tracking-tight text-white/25"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {beat.title.split(' ').map((w) => w[0]).join('')}
          </motion.span>
          <span className="absolute right-3 top-3 rounded-full bg-black/35 px-2 py-1 text-[10.5px] font-medium text-white backdrop-blur-sm">
            {beat.genre}
          </span>
          <button
            type="button"
            aria-label={`Play ${beat.title}`}
            className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/25 group-hover:opacity-100"
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-onlight shadow-lg"
            >
              <Play className="h-4 w-4" fill="currentColor" />
            </motion.span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <p className="truncate text-[14.5px] font-medium text-ink">{beat.title}</p>
            <p className="text-[12px] text-ink-mute">{beat.producer}</p>
          </div>

          <Waveform bars={28} className="h-7 text-ember/55" animated={index === 0} />

          <div className="flex items-center gap-2 text-[11px] text-ink-mute">
            <span>{beat.bpm} BPM</span>
            <span>·</span>
            <span>{beat.key}</span>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-line-dark pt-3">
            <span className="text-[15px] font-medium tnum text-ink">{beat.price}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="rounded-full bg-ink-dark px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-ink-dark/70"
            >
              License
            </motion.button>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

export function BeatMarketplace() {
  return (
    <section id="marketplace" className="relative overflow-hidden border-t border-line-dark py-24 sm:py-32">
      <FloatingOrb duration={18} travel={34} className="right-[8%] top-[6%] h-[380px] w-[380px] bg-[radial-gradient(circle,_rgba(226,85,31,0.2),_transparent_70%)]" />
      <FloatingOrb duration={22} delay={2} travel={28} className="left-[4%] top-[40%] h-[340px] w-[340px] bg-[radial-gradient(circle,_rgba(123,114,232,0.16),_transparent_70%)]" />

      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Beat marketplace"
            title="The beat is where the record starts."
            description="A marketplace built for both sides of the transaction — artists discovering their next record, and producers building a real catalog business."
          />
          <MarketingButton variant="secondary" href="#marketplace-browse" className="flex-none">
            Browse beats
          </MarketingButton>
        </div>
      </Container>

      <Reveal delay={80} className="mt-14">
        <div className="mask-fade-x flex gap-5 overflow-x-auto px-6 pb-2 lg:px-10">
          {marketplaceBeats.map((beat, i) => (
            <BeatCard key={beat.title} beat={beat} index={i} />
          ))}
        </div>
      </Reveal>

      <Container className="mt-24">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <h3 className="max-w-lg text-balance text-[26px] font-medium tracking-[-0.02em] text-ink sm:text-[32px]">
            Buy a beat.{' '}
            <span className="bg-gradient-to-r from-ember-bright to-signal bg-clip-text text-transparent">
              Make the record.
            </span>{' '}
            Release it.
          </h3>
          <p className="max-w-md text-[15px] text-ink-mute">
            No other platform connects a beat purchase directly to a finished, distributed,
            royalty-tracked release.
          </p>
        </Reveal>

        <Stagger className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-2 sm:flex-nowrap" stagger={0.1}>
          {workflow.map((step, i) => (
            <StaggerItem key={step.label} className="flex flex-1 items-center gap-2">
              <motion.div
                whileHover={{ y: -4 }}
                className="flex flex-1 flex-col items-center gap-2.5 rounded-2xl border border-line-dark bg-surface-dark px-3 py-5 text-center transition-shadow hover:shadow-[0_16px_32px_-16px_rgba(0,0,0,0.5)]"
              >
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', toneIcon[step.tone])}>
                  <step.icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <span className="text-[12.5px] font-medium text-ink">{step.label}</span>
              </motion.div>
              {i < workflow.length - 1 && <span className="hidden text-ink-faint sm:block">→</span>}
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
