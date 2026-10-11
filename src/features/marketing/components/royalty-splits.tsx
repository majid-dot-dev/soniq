import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { Container, Reveal, SectionHeading } from './primitives'
import { FloatingOrb, GradientBorder, Stagger, StaggerItem } from './motion'
import { useCountUp } from '@/features/marketing/use-count-up'
import { cn } from '@/lib/utils'

const sources = [
  { label: 'Spotify', amount: 42300, color: 'bg-ember' },
  { label: 'Apple Music', amount: 18500, color: 'bg-signal' },
  { label: 'YouTube', amount: 12200, color: 'bg-yield-bright' },
  { label: 'TikTok', amount: 5400, color: 'bg-[#8f8672]' },
]

const total = sources.reduce((sum, s) => sum + s.amount, 0)

const recipients = [
  { role: 'Artist', name: 'Amara O.', percent: 70, amount: 54880, tone: 'ember' as const },
  { role: 'Producer', name: 'Dëwit', percent: 20, amount: 15680, tone: 'signal' as const },
  { role: 'Featured artist', name: 'Selasi', percent: 10, amount: 7840, tone: 'yield' as const },
]

const toneStyles = {
  ember: { ring: 'border-ember/25', bg: 'bg-ember-soft', text: 'text-ember-deep' },
  signal: { ring: 'border-signal/25', bg: 'bg-signal-soft', text: 'text-signal-deep' },
  yield: { ring: 'border-yield/25', bg: 'bg-yield-soft', text: 'text-yield-deep' },
}

function AmountCounter({ target }: { target: number }) {
  const { ref, value } = useCountUp<HTMLSpanElement>(target, { duration: 1600 })
  return (
    <span ref={ref} className="tnum">
      ₦{Math.round(value).toLocaleString('en-US')}
    </span>
  )
}

export function RoyaltySplits() {
  return (
    <section id="royalties" className="relative overflow-hidden border-t border-line-dark py-24 sm:py-32">
      <FloatingOrb duration={18} travel={30} className="left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2 bg-[radial-gradient(circle,_rgba(47,203,125,0.16),_transparent_70%)]" />

      <Container>
        <SectionHeading
          align="center"
          eyebrow="Royalty splits"
          eyebrowTone="yield"
          title="Everyone gets their share. Automatically."
          description="Set up a split once. Every time the song earns, Soniq calculates and routes each contributor's share."
          className="mx-auto items-center"
        />
      </Container>

      <Container className="relative mt-16 max-w-3xl">
        <Reveal>
          <GradientBorder
            radius={26}
            colors="#e2551f, #7b72e8, #2fcb7d, #e2551f"
            opacity={0.55}
            duration={11}
            surfaceClassName="bg-surface"
          >
            <div className="p-6 sm:p-9">
              <p className="text-center text-[12px] font-medium uppercase tracking-[0.1em] text-ink-mute">
                Revenue this period · "Lagos Nights"
              </p>

              <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.06}>
                {sources.map((s) => (
                  <StaggerItem key={s.label}>
                    <div className="flex flex-col gap-2 rounded-xl border border-line-dark bg-surface-dark-2 px-3.5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={cn('h-1.5 w-1.5 rounded-full', s.color)} />
                        <span className="text-[11.5px] text-ink-mute">{s.label}</span>
                      </div>
                      <span className="tnum text-[15px] font-medium text-ink">₦{s.amount.toLocaleString('en-US')}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <div className="my-6 flex items-center justify-center">
                <ChevronDown className="h-5 w-5 text-ink-faint" />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-ink-dark px-5 py-4 text-white">
                <span className="text-[13px] font-medium text-white/60">Total revenue</span>
                <span className="tnum text-[22px] font-medium tracking-[-0.01em]">₦{total.toLocaleString('en-US')}</span>
              </div>

              <div className="my-6 flex items-center justify-center">
                <ChevronDown className="h-5 w-5 text-ink-faint" />
              </div>

              <Stagger className="grid gap-3 sm:grid-cols-3" stagger={0.08}>
                {recipients.map((r) => {
                  const tone = toneStyles[r.tone]
                  return (
                    <StaggerItem key={r.name}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className={cn('flex flex-col gap-3 rounded-2xl border bg-surface-dark-2 p-4', tone.ring)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] font-medium text-ink-mute">{r.role}</span>
                          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', tone.bg, tone.text)}>
                            {r.percent}%
                          </span>
                        </div>
                        <span className="text-[13.5px] font-medium text-ink">{r.name}</span>
                        <span className="text-[19px] font-medium tracking-[-0.01em] text-ink">
                          <AmountCounter target={r.amount} />
                        </span>
                      </motion.div>
                    </StaggerItem>
                  )
                })}
              </Stagger>
            </div>
          </GradientBorder>
        </Reveal>

        <p className="mt-6 text-center text-[12px] text-ink-faint">
          Figures shown are illustrative examples. Actual royalty calculations depend on your split
          agreements, applicable rights, and DSP reporting.
        </p>
      </Container>
    </section>
  )
}
