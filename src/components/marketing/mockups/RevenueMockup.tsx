import { MockupChrome, StatBlock, BarRow, LineChart } from './shared'

const platformRevenue = [
  { label: 'Spotify', display: '₦42,300', percent: 54 },
  { label: 'Apple Music', display: '₦18,500', percent: 24 },
  { label: 'YouTube', display: '₦12,200', percent: 16 },
  { label: 'TikTok', display: '₦5,400', percent: 7 },
]

export function RevenueMockup({ compact = false }: { compact?: boolean }) {
  return (
    <MockupChrome title="Balance · Amara O." meta="Last updated 4m ago" accent="yield">
      <div className="grid grid-cols-3 gap-2.5">
        <StatBlock label="Available" value="₦186,240" />
        <StatBlock label="Pending" value="₦42,900" />
        <StatBlock label="Lifetime" value="₦2,384,600" tone="positive" />
      </div>

      {!compact && (
        <div className="mt-5">
          <LineChart
            points={[38, 44, 40, 52, 61, 58, 70, 66, 78, 84, 80, 92]}
            stroke="#2fcb7d"
            fill="rgba(47,203,125,0.18)"
          />
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2.5">
        {platformRevenue.map((row, i) => (
          <BarRow
            key={row.label}
            label={row.label}
            display={row.display}
            percent={row.percent}
            color={['bg-ember', 'bg-signal', 'bg-yield', 'bg-ink-2'][i]}
          />
        ))}
      </div>
    </MockupChrome>
  )
}
