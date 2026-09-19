import { Container, Reveal, SectionHeading } from './primitives'
import { FloatingOrb } from './motion'

const cities = [
  'Lagos',
  'Accra',
  'Nairobi',
  'Johannesburg',
  'London',
  'Atlanta',
  'Toronto',
  'Dubai',
]

export function AfricanRoots() {
  return (
    <section className="relative overflow-hidden border-t border-line-dark bg-gradient-to-b from-ember-tint via-paper-dim to-paper py-24 sm:py-32">
      <FloatingOrb duration={20} travel={26} className="right-[10%] top-[15%] h-[360px] w-[360px] bg-[radial-gradient(circle,_rgba(226,85,31,0.14),_transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-10 select-none overflow-hidden opacity-[0.07]">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[...cities, ...cities].map((c, i) => (
            <span
              key={i}
              className="text-[96px] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[128px]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <Container className="relative">
        <SectionHeading
          align="center"
          eyebrow="African roots, global reach"
          title="Built from Africa. Designed for everywhere."
          className="mx-auto items-center"
        />

        <Reveal delay={80} className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-[16px] leading-relaxed text-ink-mute">
            Soniq is built around the real, everyday realities of independent creators in emerging
            music markets — patchy payout rails, fragmented rights, and platforms that weren&rsquo;t
            designed with them in mind. That same rigor is built for global distribution and
            monetization from day one, so growth was never the constraint.
          </p>
        </Reveal>

        <Reveal
          delay={140}
          className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {cities.map((c) => (
            <span key={c} className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              {c}
            </span>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
