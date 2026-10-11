import { Link } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'
import type { LicenseOffer } from '@/features/tracks/components/upload-track-steps/shared'
import { cn } from '@/lib/utils'

export default function UploadTrackStep4({
  licenses,
  hasStems,
  loading,
  onLicenses,
}: {
  licenses: LicenseOffer[]
  hasStems: boolean
  loading?: boolean
  onLicenses: (licenses: LicenseOffer[]) => void
}) {
  if (loading) {
    return (
      <div>
        <p className="text-[13px] leading-relaxed text-ink-mute">
          Pick which offers are on this track and the price. Contract terms stay in Licenses.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className="h-16 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </ul>
      </div>
    )
  }

  if (licenses.length === 0) {
    return (
      <div>
        <p className="text-[13px] leading-relaxed text-ink-mute">
          Pick which offers are on this track and the price. Contract terms stay in Licenses.
        </p>
        <div className="mt-4 rounded-2xl bg-white/5 px-4 py-6 text-center">
          <p className="text-[14px] font-medium text-white">No beat licenses yet</p>
          <p className="mt-1 text-[13px] text-ink-mute">
            Create a template first, then come back to attach it here.
          </p>
          <Link
            to="/licenses/new?catalog=beat"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white"
          >
            Create license
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[13px] leading-relaxed text-ink-mute">
        Pick which offers are on this track and the price. Contract terms stay in Licenses.
      </p>
      <ul className="mt-4 flex flex-col gap-2">
        {licenses.map((license) => {
          const locked = Boolean(license.needsStems && !hasStems)
          return (
            <li
              key={license.id}
              className={cn(
                'flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3',
                locked && 'opacity-50',
              )}
            >
              <Switch
                checked={license.enabled}
                disabled={locked}
                aria-label={`${license.enabled ? 'Remove' : 'Offer'} ${license.name}`}
                onCheckedChange={(checked) =>
                  onLicenses(
                    licenses.map((item) =>
                      item.id === license.id ? { ...item, enabled: checked } : item,
                    ),
                  )
                }
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium text-white">{license.name}</span>
                <span className="mt-0.5 block text-[12px] text-ink-mute">
                  {locked ? 'Add a stems zip to offer this.' : license.detail || 'License offer'}
                </span>
              </span>
              <label className="flex shrink-0 items-center gap-1 rounded-lg bg-white/8 px-2.5 py-1.5">
                <span className="text-[13px] text-ink-mute">$</span>
                <input
                  inputMode="numeric"
                  aria-label={`${license.name} price`}
                  disabled={locked || !license.enabled || license.isFree}
                  value={license.isFree ? '0' : license.price}
                  onChange={(event) => {
                    const price = event.target.value.replace(/[^\d]/g, '').slice(0, 5)
                    onLicenses(
                      licenses.map((item) => (item.id === license.id ? { ...item, price } : item)),
                    )
                  }}
                  className="w-12 bg-transparent text-[13px] text-white outline-none tnum disabled:text-ink-mute"
                />
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
