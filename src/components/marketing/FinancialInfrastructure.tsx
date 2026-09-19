import { Container, Eyebrow, Reveal } from './primitives'
import { FloatingOrb, GradientBorder } from './motion'
import { MockupChrome, StatBlock, BarRow, LineChart } from './mockups/shared'

const revenueByPlatform = [
  { label: 'Spotify', display: '₦612,400', percent: 44 },
  { label: 'Apple Music', display: '₦291,800', percent: 21 },
  { label: 'YouTube', display: '₦222,100', percent: 16 },
  { label: 'TikTok', display: '₦166,600', percent: 12 },
  { label: 'Other', display: '₦96,700', percent: 7 },
]

const payouts = [
  { date: 'Sep 08, 2026', amount: '₦148,200', status: 'Paid' },
  { date: 'Sep 01, 2026', amount: '₦162,940', status: 'Paid' },
  { date: 'Aug 25, 2026', amount: '₦139,500', status: 'Paid' },
]

export function FinancialInfrastructure() {
  return (
    <section id="financial" className="relative overflow-hidden bg-ink-dark py-24 text-white sm:py-32">
      <FloatingOrb duration={20} travel={36} className="right-[10%] top-[10%] h-[440px] w-[440px] bg-[radial-gradient(circle,_rgba(242,112,59,0.16),_transparent_70%)]" />
      <FloatingOrb duration={24} delay={3} travel={26} className="left-[6%] bottom-[-10%] h-[380px] w-[380px] bg-[radial-gradient(circle,_rgba(47,203,125,0.14),_transparent_70%)]" />
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <Eyebrow tone="paper">Financial infrastructure</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-5 max-w-2xl text-balance text-[34px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[44px] lg:text-[50px]">
            Your music. Your money. Your numbers.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/55">
            A revenue account built with the same rigor as a modern payments platform — clear
            balances, transparent breakdowns, and payouts you can rely on.
          </p>
        </Reveal>
      </Container>

      <Container className="relative mt-16">
        <Reveal className="mx-auto max-w-4xl">
          <GradientBorder
            radius={20}
            colors="#f2703b, #7b72e8, #2fcb7d, #f2703b"
            opacity={0.55}
            duration={12}
            surfaceClassName="bg-ink-dark"
          >
          <MockupChrome
            title="Revenue account · Coastline Records"
            meta="₦ NGN"
          >
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <StatBlock dark label="Available balance" value="₦186,240" />
              <StatBlock dark label="Pending royalties" value="₦42,900" />
              <StatBlock dark label="Lifetime earnings" value="₦2,384,600" tone="positive" />
              <StatBlock dark label="Last payout" value="₦148,200" hint="Sep 08, 2026" />
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-text-dark-mute">Revenue over time</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-yield-bright">
                    +22.6%
                  </span>
                </div>
                <div className="mt-3">
                  <LineChart
                    points={[24, 30, 27, 38, 44, 41, 52, 58, 55, 66, 72, 80]}
                    stroke="#f2703b"
                    fill="rgba(242,112,59,0.14)"
                    height={140}
                  />
                </div>

                <p className="mb-3 mt-6 text-[11px] font-medium text-text-dark-mute">
                  Recent payouts
                </p>
                <div className="flex flex-col divide-y divide-line-dark">
                  {payouts.map((p) => (
                    <div
                      key={p.date}
                      className="flex items-center justify-between py-2 text-[12.5px]"
                    >
                      <span className="text-text-dark-mute">{p.date}</span>
                      <span className="tnum font-medium text-white">{p.amount}</span>
                      <span className="rounded-full bg-yield/20 px-2 py-0.5 text-[10.5px] font-medium text-yield-bright">
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-medium text-text-dark-mute">
                  Revenue by platform
                </p>
                <div className="flex flex-col gap-3">
                  {revenueByPlatform.map((p) => (
                    <BarRow
                      key={p.label}
                      label={p.label}
                      display={p.display}
                      percent={p.percent}
                      color="bg-ember-bright"
                      dark
                    />
                  ))}
                </div>

                <p className="mb-3 mt-6 text-[11px] font-medium text-text-dark-mute">
                  Revenue by territory
                </p>
                <div className="flex flex-col gap-3">
                  <BarRow label="Nigeria" display="41%" percent={41} color="bg-signal" dark />
                  <BarRow label="United States" display="17%" percent={17} color="bg-signal" dark />
                  <BarRow
                    label="United Kingdom"
                    display="10%"
                    percent={10}
                    color="bg-signal"
                    dark
                  />
                </div>
              </div>
            </div>
          </MockupChrome>
          </GradientBorder>
        </Reveal>
      </Container>
    </section>
  )
}
