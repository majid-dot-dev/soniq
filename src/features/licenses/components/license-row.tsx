import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { formatFiles, formatKind, formatMoney } from '@/features/licenses/lib/format'
import type { LicenseTemplate } from '@/features/licenses/types'

export function LicenseRow({
  license,
  selected,
  onSelectedChange,
  onEdit,
  onToggle,
}: {
  license: LicenseTemplate
  selected: boolean
  onSelectedChange: (checked: boolean) => void
  onEdit: () => void
  onToggle: (enabled: boolean) => void
}) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-white/8 px-2 py-3.5 lg:grid-cols-[2rem_minmax(0,1.3fr)_6.5rem_minmax(0,1fr)_5.5rem_4.5rem_5rem]">
      <Checkbox
        checked={selected}
        onCheckedChange={(checked) => onSelectedChange(checked === true)}
        aria-label={`Select ${license.name}`}
      />
      <button type="button" onClick={onEdit} className="min-w-0 text-left">
        <p className="truncate text-[14px] font-medium text-white">{license.name}</p>
        <p className="mt-0.5 truncate text-[12px] text-ink-mute">{license.description}</p>
        <p className="mt-1 text-[12px] text-ink-faint lg:hidden">
          {formatKind(license.kind)} · {license.kind === 'free' ? 'Free' : formatMoney(license.defaultPrice)} ·{' '}
          {license.itemCount} items
        </p>
      </button>
      <p className="hidden text-[13px] text-ink-2 lg:block">{formatKind(license.kind)}</p>
      <p className="hidden truncate text-[13px] text-ink-mute lg:block">{formatFiles(license.filesDelivered)}</p>
      <p className="hidden text-[13px] text-white tnum lg:block">
        {license.kind === 'free' ? 'Free' : formatMoney(license.defaultPrice)}
      </p>
      <p className="hidden text-[13px] text-ink-2 tnum lg:block">{license.itemCount}</p>
      <div className="flex justify-end">
        <Switch checked={license.enabled} onCheckedChange={onToggle} aria-label={`${license.name} active`} />
      </div>
    </div>
  )
}
