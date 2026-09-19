import { motion } from 'motion/react'
import { Container, Reveal, SectionHeading, Tag } from './primitives'
import { FloatingOrb } from './motion'

function FanConnector({ count, height = 44 }: { count: number; height?: number }) {
  const points = Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * 100)
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full" style={{ height }}>
      {points.map((x) => (
        <motion.path
          key={x}
          d={`M50,0 L${x},40`}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />
      ))}
      <circle cx="50" cy="0" r="1.8" fill="#f2703b" />
    </svg>
  )
}

export function RightsSection() {
  return (
    <section id="rights" className="relative overflow-hidden border-t border-line-dark py-24 sm:py-32">
      <FloatingOrb
        duration={20}
        travel={30}
        className="left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(226,85,31,0.12),_transparent_70%)]"
      />

      <Container>
        <SectionHeading
          align="center"
          eyebrow="Rights infrastructure"
          title="Music has rights. We keep them connected."
          description="Every song carries two bundles of rights — the master and the composition. Soniq keeps them attached to distribution, licensing, reporting, and payments, automatically."
          className="mx-auto items-center"
        />
      </Container>

      <Container className="relative mt-16 max-w-3xl">
        <Reveal className="flex flex-col items-center">
          <div className="rounded-2xl border border-line-dark bg-surface px-6 py-3 text-[14px] font-medium text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
            "Lagos Nights" — Song
          </div>

          <FanConnector count={2} />

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-ember/25 bg-surface p-5">
              <p className="text-[13px] font-semibold text-ember-bright">Master</p>
              <p className="mt-1 text-[12px] text-ink-mute">The recording itself</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag tone="ember">Artist</Tag>
                <Tag tone="ember">Producer</Tag>
                <Tag tone="ember">Label</Tag>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-signal/25 bg-surface p-5">
              <p className="text-[13px] font-semibold text-signal">Composition</p>
              <p className="mt-1 text-[12px] text-ink-mute">The underlying song</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag tone="signal">Songwriter</Tag>
                <Tag tone="signal">Publisher</Tag>
              </div>
            </motion.div>
          </div>

          <FanConnector count={4} />

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {['Distribution', 'Licensing', 'Royalty reporting', 'Payments'].map((d) => (
              <motion.div
                key={d}
                whileHover={{ y: -3 }}
                className="rounded-xl border border-line-dark bg-ink-dark px-3 py-3 text-center text-[12.5px] font-medium text-white"
              >
                {d}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
