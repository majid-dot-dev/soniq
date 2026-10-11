import { MockupChrome, StatBlock } from './shared'

const releases = [
  { title: 'Lagos Nights', type: 'Single', status: 'Live', streams: '184,204' },
  { title: 'Half Light (feat. Selasi)', type: 'Single', status: 'Live', streams: '96,512' },
  { title: 'Harmattan EP', type: 'EP · 4 tracks', status: 'Scheduled', streams: '—' },
]

export function ArtistDashboardMockup() {
  return (
    <MockupChrome title="Amara O. · Artist dashboard" meta="Catalog · 12 releases" accent="ember">
      <div className="grid grid-cols-3 gap-2.5">
        <StatBlock label="Catalog" value="12" hint="Releases" />
        <StatBlock label="Streams" value="2.41M" tone="positive" />
        <StatBlock label="Collaborators" value="5" hint="Active" />
      </div>

      <p className="mb-3 mt-5 text-[11px] font-medium text-ink-mute">Recent releases</p>
      <div className="flex flex-col divide-y divide-line-dark">
        {releases.map((r) => (
          <div key={r.title} className="flex items-center justify-between py-2.5 text-[12.5px]">
            <div>
              <p className="text-ink">{r.title}</p>
              <p className="text-[11px] text-ink-faint">{r.type}</p>
            </div>
            <span className="tnum text-ink-mute">{r.streams}</span>
            <span
              className={
                r.status === 'Live'
                  ? 'rounded-full bg-yield-soft px-2 py-0.5 text-[10.5px] font-medium text-yield-deep'
                  : 'rounded-full bg-ink/[0.06] px-2 py-0.5 text-[10.5px] font-medium text-ink-mute'
              }
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </MockupChrome>
  )
}
