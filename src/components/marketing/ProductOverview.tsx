import { motion } from 'motion/react'
import { Container, Reveal, SectionHeading } from './primitives'
import { FloatingOrb, Stagger, StaggerItem } from './motion'
import { BeatListMockup } from './mockups/BeatListMockup'
import { ReleaseFlowMockup } from './mockups/ReleaseFlowMockup'
import { RevenueMockup } from './mockups/RevenueMockup'
import { AnalyticsMockup } from './mockups/AnalyticsMockup'
import { cn } from '@/lib/utils'

const chapters = [
  {
    index: '01',
    id: 'create',
    tone: 'ember',
    kicker: 'Create',
    title: 'Find the sound. Build the record.',
    body: 'A beat marketplace where artists discover sounds worth building on, and producers turn beats into an ongoing business.',
    features: ['Beat marketplace', 'Beat licensing', 'Stems', 'Producer profiles', 'Samples', 'Collaborations'],
    Visual: BeatListMockup,
  },
  {
    index: '02',
    id: 'release',
    tone: 'signal',
    kicker: 'Release',
    title: 'Put your music everywhere.',
    body: 'Distribution infrastructure that gets singles, EPs, and albums onto every major streaming, social, and download platform — with metadata handled correctly the first time.',
    features: ['Singles, EPs & albums', 'Release scheduling', 'Metadata & ISRC/UPC', 'Global distribution', 'Store delivery tracking', 'Takedowns'],
    Visual: ReleaseFlowMockup,
  },
  {
    index: '03',
    id: 'royalties',
    tone: 'yield',
    kicker: 'Earn',
    title: 'Know what your music is worth.',
    body: 'Royalty accounting built like financial infrastructure — revenue tracking, splits, and statements down to the platform, territory, and track.',
    features: ['Revenue tracking', 'Royalty statements', 'Splits', 'Collaborator payments', 'Territory reporting', 'Payouts'],
    Visual: RevenueMockup,
  },
  {
    index: '04',
    id: 'grow',
    tone: 'signal',
    kicker: 'Grow',
    title: 'Turn streams into a business.',
    body: 'Analytics that help artists, producers, and labels understand their catalog, their audience, and where their next opportunity is.',
    features: ['Streaming analytics', 'Audience insights', 'Catalog performance', 'Release analytics', 'Label dashboards'],
    Visual: AnalyticsMockup,
  },
] as const

const toneDot: Record<string, string> = {
  ember: 'bg-ember',
  signal: 'bg-signal',
  yield: 'bg-yield-bright',
}
const toneText: Record<string, string> = {
  ember: 'text-ember',
  signal: 'text-signal',
  yield: 'text-yield-bright',
}
const toneNumeral: Record<string, string> = {
  ember: 'text-ember/[0.16]',
  signal: 'text-signal/[0.18]',
  yield: 'text-yield-bright/[0.16]',
}
const toneTagHover: Record<string, string> = {
  ember: 'hover:border-ember/30 hover:bg-ember-tint hover:text-ember-bright',
  signal: 'hover:border-signal/30 hover:bg-signal-tint hover:text-signal',
  yield: 'hover:border-yield/30 hover:bg-yield-tint hover:text-yield-bright',
}
const toneOrb: Record<string, string> = {
  ember: 'bg-[radial-gradient(circle,_rgba(226,85,31,0.22),_transparent_70%)]',
  signal: 'bg-[radial-gradient(circle,_rgba(123,114,232,0.2),_transparent_70%)]',
  yield: 'bg-[radial-gradient(circle,_rgba(47,203,125,0.2),_transparent_70%)]',
}

export function ProductOverview() {
  return (
    <section id="platform" className="relative overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="One music business platform"
          title="From the first beat to the first payout."
          description="Soniq connects the fragmented parts of the modern music business — creation, distribution, rights, and revenue — into a single, coherent system."
        />
      </Container>

      <Container className="mt-20 flex flex-col gap-28 sm:gap-36">
        {chapters.map((chapter, i) => {
          const Visual = chapter.Visual
          const reversed = i % 2 === 1
          return (
            <div key={chapter.id} id={chapter.id} className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <FloatingOrb
                duration={16 + i}
                travel={30}
                className={cn('left-1/4 top-1/2 -z-10 h-[380px] w-[380px] -translate-y-1/2', toneOrb[chapter.tone])}
              />

              <Reveal className={cn('flex flex-col gap-6', reversed && 'lg:order-2')}>
                <span className={cn('text-[68px] font-light leading-none tracking-[-0.03em] sm:text-[84px]', toneNumeral[chapter.tone])}>
                  {chapter.index}
                </span>
                <div className="flex items-center gap-2">
                  <span className={cn('h-1.5 w-1.5 rounded-full', toneDot[chapter.tone])} />
                  <span className={cn('text-[12px] font-semibold uppercase tracking-[0.12em]', toneText[chapter.tone])}>
                    {chapter.kicker}
                  </span>
                </div>
                <h3 className="max-w-md text-balance text-[28px] font-medium leading-[1.15] tracking-[-0.02em] text-ink sm:text-[34px]">
                  {chapter.title}
                </h3>
                <p className="max-w-md text-[15.5px] leading-relaxed text-ink-mute">{chapter.body}</p>
                <Stagger className="flex flex-wrap gap-2" stagger={0.05}>
                  {chapter.features.map((f) => (
                    <StaggerItem key={f} className="inline-flex">
                      <span
                        className={cn(
                          'inline-flex rounded-full border border-line-dark bg-surface-dark px-3 py-1.5 text-[12.5px] text-ink-2 transition-colors',
                          toneTagHover[chapter.tone],
                        )}
                      >
                        {f}
                      </span>
                    </StaggerItem>
                  ))}
                </Stagger>
              </Reveal>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={cn(reversed && 'lg:order-1')}
              >
                <Visual />
              </motion.div>
            </div>
          )
        })}
      </Container>
    </section>
  )
}
