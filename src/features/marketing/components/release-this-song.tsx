import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Container, Reveal, SectionHeading, Tag } from './primitives'
import { MockupChrome } from './mockups/shared'

export function ReleaseThisSong() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="From purchase to release"
          title={
            <>
              The platform already knows
              <br className="hidden sm:block" /> what this record is.
            </>
          }
          description="When an artist buys a beat on Soniq, the producer, license, and collaborators come with it — straight into the release workflow."
          className="mx-auto items-center"
        />
      </Container>

      <Container className="mt-16">
        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          <Reveal>
            <MockupChrome title="License confirmed" meta="Just now">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-signal to-signal-deep text-[12px] font-semibold text-white">
                  GC
                </div>
                <div>
                  <p className="text-[14px] font-medium text-ink">Glass City</p>
                  <p className="text-[12px] text-ink-mute">Produced by Dëwit</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-mute">License</span>
                  <span className="font-medium text-ink">Exclusive</span>
                </div>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-mute">Purchase price</span>
                  <span className="tnum font-medium text-ink">$85.00</span>
                </div>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-mute">Rights</span>
                  <span className="font-medium text-ink">Master + composition share</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-yield/20 bg-yield-tint px-3 py-2.5 text-[12px] font-medium text-yield-bright">
                <CheckCircle2 className="h-3.5 w-3.5 flex-none" />
                Producer credit &amp; split detected — 20% to Dëwit
              </div>
            </MockupChrome>
          </Reveal>

          <div className="flex justify-center py-4 lg:py-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-ember to-ember-deep px-5 py-3 text-white shadow-[0_16px_40px_-16px_rgba(226,85,31,0.6)]"
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span className="whitespace-nowrap text-[13.5px] font-medium">Release this song</span>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </div>

          <Reveal delay={120}>
            <MockupChrome title="New release · Draft" meta="Autofilled">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-ink">Untitled — “Glass City”</p>
                <Tag tone="signal">Autofilled</Tag>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 text-[12.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-ink-mute">Primary artist</span>
                  <span className="font-medium text-ink">Amara O.</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-mute">Producer credit</span>
                  <span className="font-medium text-ink">Dëwit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-mute">Collaborator split</span>
                  <span className="tnum font-medium text-ink">80 / 20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-mute">ISRC</span>
                  <span className="font-medium text-ink">Pending assignment</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-mute">Rights basis</span>
                  <span className="font-medium text-ink">Exclusive beat license</span>
                </div>
              </div>
            </MockupChrome>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
