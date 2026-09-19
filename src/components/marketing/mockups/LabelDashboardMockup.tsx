import { MockupChrome, StatBlock } from './shared'

const roster = [
  { name: 'Amara O.', releases: 12, revenue: '₦2.38M' },
  { name: 'Selasi', releases: 6, revenue: '₦940K' },
  { name: 'Kelu', releases: 21, revenue: '₦1.12M' },
]

export function LabelDashboardMockup() {
  return (
    <MockupChrome title="Coastline Records · Label dashboard" meta="3 artists · 4 team seats" accent="yield">
      <div className="grid grid-cols-3 gap-2.5">
        <StatBlock label="Artists" value="3" hint="Active roster" />
        <StatBlock label="Releases" value="39" hint="Across catalog" />
        <StatBlock label="Revenue" value="₦4.44M" tone="positive" hint="Trailing 12mo" />
      </div>

      <p className="mb-3 mt-5 text-[11px] font-medium text-ink-mute">Roster</p>
      <div className="flex flex-col divide-y divide-line-dark">
        {roster.map((a) => (
          <div key={a.name} className="flex items-center justify-between py-2.5 text-[12.5px]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07] text-[10px] font-semibold text-ink-2">
                {a.name.slice(0, 1)}
              </span>
              <span className="text-ink">{a.name}</span>
            </div>
            <span className="text-ink-mute">{a.releases} releases</span>
            <span className="tnum font-medium text-ink">{a.revenue}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-line-dark bg-surface-dark-2 px-3.5 py-2.5 text-[11.5px] text-ink-mute">
        <span>Team permissions</span>
        <span className="flex -space-x-1.5">
          {['A', 'B', 'C', 'D'].map((l) => (
            <span
              key={l}
              className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface-dark bg-white/[0.08] text-[9px] font-semibold text-ink-2"
            >
              {l}
            </span>
          ))}
        </span>
      </div>
    </MockupChrome>
  )
}
