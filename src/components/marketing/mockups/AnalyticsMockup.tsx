import { MockupChrome, LineChart, BarRow } from './shared'

const topTracks = [
  { name: 'Lagos Nights', streams: '184,204', revenue: '₦58,300' },
  { name: 'Half Light (feat. Selasi)', streams: '96,512', revenue: '₦27,140' },
  { name: 'Harmattan', streams: '61,880', revenue: '₦16,920' },
]

const territories = [
  { label: 'Nigeria', display: '38%', percent: 38 },
  { label: 'United States', display: '18%', percent: 18 },
  { label: 'United Kingdom', display: '11%', percent: 11 },
  { label: 'Ghana', display: '9%', percent: 9 },
  { label: 'South Africa', display: '8%', percent: 8 },
]

export function AnalyticsMockup() {
  return (
    <MockupChrome title="Analytics · Catalog overview" meta="Last 6 months" accent="signal">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-ink-mute">Streams, all platforms</p>
          <p className="mt-1 text-[22px] font-medium tnum tracking-[-0.01em] text-ink">2.41M</p>
        </div>
        <span className="rounded-full bg-yield-soft px-2 py-1 text-[11px] font-medium text-yield-deep">
          +18.4%
        </span>
      </div>
      <div className="mt-4">
        <LineChart
          points={[30, 34, 33, 42, 46, 44, 55, 60, 58, 66, 72, 78]}
          stroke="#7b72e8"
          fill="rgba(123,114,232,0.18)"
        />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-[11px] font-medium text-ink-mute">Top tracks</p>
          <div className="flex flex-col gap-2.5">
            {topTracks.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-[12.5px]">
                <span className="max-w-[130px] truncate text-ink-2">{t.name}</span>
                <span className="tnum text-ink-faint">{t.streams}</span>
                <span className="tnum font-medium text-ink">{t.revenue}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-medium text-ink-mute">Revenue by territory</p>
          <div className="flex flex-col gap-2.5">
            {territories.map((t) => (
              <BarRow
                key={t.label}
                label={t.label}
                display={t.display}
                percent={t.percent}
                color="bg-signal"
              />
            ))}
          </div>
        </div>
      </div>
    </MockupChrome>
  )
}
