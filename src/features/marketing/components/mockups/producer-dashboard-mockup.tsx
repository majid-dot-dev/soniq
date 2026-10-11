import { MockupChrome, StatBlock } from './shared'

const sales = [
  { title: 'Glass City', buyer: 'Amara O.', license: 'Exclusive', amount: '$85' },
  { title: 'Half Light', buyer: 'Tomiwa B.', license: 'Non-exclusive', amount: '$60' },
  { title: 'Static Bloom', buyer: 'Rue', license: 'Non-exclusive', amount: '$55' },
]

export function ProducerDashboardMockup() {
  return (
    <MockupChrome title="Kelu · Producer dashboard" meta="14 beats listed" accent="signal">
      <div className="grid grid-cols-3 gap-2.5">
        <StatBlock label="Total sales" value="342" hint="All-time" />
        <StatBlock label="Earnings" value="$18,240" tone="positive" />
        <StatBlock label="Customers" value="211" hint="Unique buyers" />
      </div>

      <p className="mb-3 mt-5 text-[11px] font-medium text-ink-mute">Recent sales</p>
      <div className="flex flex-col divide-y divide-line-dark">
        {sales.map((s) => (
          <div
            key={s.title + s.buyer}
            className="flex items-center justify-between py-2.5 text-[12.5px]"
          >
            <div>
              <p className="text-ink">{s.title}</p>
              <p className="text-[11px] text-ink-faint">
                {s.buyer} · {s.license}
              </p>
            </div>
            <span className="tnum font-medium text-ink">{s.amount}</span>
          </div>
        ))}
      </div>
    </MockupChrome>
  )
}
