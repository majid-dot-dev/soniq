import { ArrowRight } from 'lucide-react'
import { Container, MarketingButton, Reveal } from './primitives'
import { FloatingOrb } from './motion'

export function FinalCTA() {
  return (
    <section
      id="get-started"
      className="relative overflow-hidden bg-ink-dark py-24 text-white sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          duration={16}
          travel={40}
          className="left-1/2 top-[-220px] h-[560px] w-[980px] -translate-x-1/2 bg-[radial-gradient(circle,_rgba(226,85,31,0.32),_transparent_65%)]"
        />
        <FloatingOrb
          duration={22}
          delay={2}
          travel={26}
          className="right-[-140px] bottom-[-160px] h-[380px] w-[380px] bg-[radial-gradient(circle,_rgba(123,114,232,0.18),_transparent_70%)]"
        />
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="max-w-2xl text-balance text-[36px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[48px] lg:text-[54px]">
            Your music is a business. Build it like one.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/60">
            Create your catalog. Release everywhere. Track your money. Keep building.
          </p>
        </Reveal>
        <Reveal delay={140} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <MarketingButton variant="on-dark-primary" size="lg" href="#" magnetic>
            Get started
          </MarketingButton>
          <MarketingButton variant="on-dark-secondary" size="lg" href="#platform">
            Explore the platform
            <ArrowRight className="h-4 w-4" />
          </MarketingButton>
        </Reveal>
      </Container>
    </section>
  )
}
