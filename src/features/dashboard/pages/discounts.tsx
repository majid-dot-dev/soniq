import { useMemo, useState } from 'react'
import { ArrowLeft, CaretDown, Copy, MagnifyingGlass, Package, Plus, Tag } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  couponCodes as seedCodes,
  formatBeatScope,
  formatCouponValue,
  formatDiscountWindow,
  formatLicenseScope,
  formatPackageDeal,
  formatPerBuyerLimit,
  licenseOptions,
  packageDeals as seedPackages,
  type CouponCode,
  type DiscountStatus,
  type DiscountValueType,
  type PackageDeal,
} from '@/features/dashboard/discounts'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const statuses = ['All', 'Active', 'Scheduled', 'Expired', 'Disabled'] as const
const tabs = ['Codes', 'Packages'] as const

type StatusFilter = (typeof statuses)[number]
type Tab = (typeof tabs)[number]
type Creating = 'code' | 'package' | null

type CodeDraft = {
  code: string
  valueType: DiscountValueType
  amount: string
  licenses: string[]
  startsAt: string
  endsAt: string
  neverExpires: boolean
  maxUses: string
  unlimitedUses: boolean
  perBuyerLimit: string
  noPerBuyerLimit: boolean
}

type PackageDraft = {
  buyQuantity: string
  freeQuantity: string
  licenses: string[]
  startsAt: string
  endsAt: string
  neverExpires: boolean
}

const emptyCodeDraft = (): CodeDraft => ({
  code: '',
  valueType: 'percent',
  amount: '20',
  licenses: ['MP3 lease', 'WAV lease'],
  startsAt: new Date().toISOString().slice(0, 10),
  endsAt: '',
  neverExpires: true,
  maxUses: '',
  unlimitedUses: true,
  perBuyerLimit: '1',
  noPerBuyerLimit: false,
})

const emptyPackageDraft = (): PackageDraft => ({
  buyQuantity: '2',
  freeQuantity: '1',
  licenses: ['MP3 lease', 'WAV lease'],
  startsAt: new Date().toISOString().slice(0, 10),
  endsAt: '',
  neverExpires: true,
})

export default function Discounts() {
  const reduce = useReducedMotion()
  const [codes, setCodes] = useState(seedCodes)
  const [packages, setPackages] = useState(seedPackages)
  const [tab, setTab] = useState<Tab>('Codes')
  const [creating, setCreating] = useState<Creating>(null)
  const [status, setStatus] = useState<StatusFilter>('All')
  const [query, setQuery] = useState('')
  const [codeDraft, setCodeDraft] = useState<CodeDraft>(emptyCodeDraft)
  const [packageDraft, setPackageDraft] = useState<PackageDraft>(emptyPackageDraft)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())

  const activeCodes = codes.filter((item) => item.status === 'Active').length
  const activePackages = packages.filter((item) => item.status === 'Active').length
  const redemptions = codes.reduce((sum, item) => sum + item.uses, 0) + packages.reduce((sum, item) => sum + item.uses, 0)

  const codeRows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return codes.filter((item) => {
      if (status !== 'All' && item.status !== status) return false
      if (!needle) return true
      return [item.code, formatCouponValue(item), ...item.licenses, formatBeatScope(item.beatScope)].some((value) =>
        value.toLowerCase().includes(needle),
      )
    })
  }, [codes, query, status])

  const packageRows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return packages.filter((item) => {
      if (status !== 'All' && item.status !== status) return false
      if (!needle) return true
      return [item.name, formatPackageDeal(item.buyQuantity, item.freeQuantity), ...item.licenses].some((value) =>
        value.toLowerCase().includes(needle),
      )
    })
  }, [packages, query, status])

  const visibleIds = tab === 'Codes' ? codeRows.map((item) => item.id) : packageRows.map((item) => item.id)
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id))
  const someSelected = visibleIds.some((id) => selected.has(id))

  function clearSelection() {
    setSelected(new Set())
  }

  function toggleAll(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      for (const id of visibleIds) {
        if (checked) next.add(id)
        else next.delete(id)
      }
      return next
    })
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function openCreate() {
    if (tab === 'Codes') {
      setCodeDraft(emptyCodeDraft())
      setCreating('code')
      return
    }
    setPackageDraft(emptyPackageDraft())
    setCreating('package')
  }

  function publishCode() {
    const code = codeDraft.code.trim().toUpperCase().replace(/\s+/g, '')
    const amount = Number(codeDraft.amount)
    if (!code || !Number.isFinite(amount) || amount <= 0) return
    if (codeDraft.valueType === 'percent' && amount > 100) return
    if (codeDraft.licenses.length === 0) return

    const next: CouponCode = {
      id: `dc-${Date.now()}`,
      code,
      valueType: codeDraft.valueType,
      amount,
      licenses: codeDraft.licenses,
      beatScope: 'All',
      startsAt: codeDraft.startsAt,
      endsAt: codeDraft.neverExpires || !codeDraft.endsAt ? null : codeDraft.endsAt,
      uses: 0,
      maxUses: codeDraft.unlimitedUses || !codeDraft.maxUses ? null : Number(codeDraft.maxUses),
      perBuyerLimit: codeDraft.noPerBuyerLimit || !codeDraft.perBuyerLimit ? null : Number(codeDraft.perBuyerLimit),
      status: codeDraft.startsAt > new Date().toISOString().slice(0, 10) ? 'Scheduled' : 'Active',
    }

    setCodes((current) => [next, ...current])
    setCreating(null)
    setTab('Codes')
  }

  function publishPackage() {
    const buyQuantity = Number(packageDraft.buyQuantity)
    const freeQuantity = Number(packageDraft.freeQuantity)
    if (!Number.isFinite(buyQuantity) || buyQuantity < 1) return
    if (!Number.isFinite(freeQuantity) || freeQuantity < 1) return
    if (packageDraft.licenses.length === 0) return

    const next: PackageDeal = {
      id: `pk-${Date.now()}`,
      name: formatPackageDeal(buyQuantity, freeQuantity),
      buyQuantity,
      freeQuantity,
      licenses: packageDraft.licenses,
      beatScope: 'All',
      startsAt: packageDraft.startsAt,
      endsAt: packageDraft.neverExpires || !packageDraft.endsAt ? null : packageDraft.endsAt,
      uses: 0,
      status: packageDraft.startsAt > new Date().toISOString().slice(0, 10) ? 'Scheduled' : 'Active',
    }

    setPackages((current) => [next, ...current])
    setCreating(null)
    setTab('Packages')
  }

  async function copyCode(item: CouponCode) {
    try {
      await navigator.clipboard.writeText(item.code)
      setCopiedId(item.id)
      window.setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 1400)
    } catch {
      // ignore clipboard failures in restricted contexts
    }
  }

  if (creating === 'code') {
    return (
      <CreateCode
        draft={codeDraft}
        onChange={setCodeDraft}
        onCancel={() => setCreating(null)}
        onPublish={publishCode}
        reduce={!!reduce}
      />
    )
  }

  if (creating === 'package') {
    return (
      <CreatePackage
        draft={packageDraft}
        onChange={setPackageDraft}
        onCancel={() => setCreating(null)}
        onPublish={publishPackage}
        reduce={!!reduce}
      />
    )
  }

  return (
    <div className="h-full min-h-0 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]">Discounts</h1>
          <p className="mt-2 text-[14px] text-ink-mute">
            {activeCodes} codes · {activePackages} packages · {redemptions} redemptions
          </p>
        </div>
        <motion.button
          type="button"
          onClick={openCreate}
          whileHover={{ scale: 1.035 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          className="inline-flex h-9 select-none items-center justify-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium tracking-[-0.01em] text-white"
        >
          <span aria-hidden className="grid size-4 place-items-center rounded-full bg-white text-rose-500">
            <Plus size={10} weight="bold" />
          </span>
          {tab === 'Codes' ? 'New code' : 'New package'}
        </motion.button>
      </motion.div>

      <div className="mt-8 flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 w-fit">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setTab(item)
              setQuery('')
              setStatus('All')
              clearSelection()
            }}
            className={cn(
              'rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors',
              tab === item ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="mt-5 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[18px] font-medium text-white">{tab === 'Codes' ? 'Coupon codes' : 'Package deals'}</h2>
          <div className="flex items-center gap-4">
            <label className="flex w-full max-w-48 items-center gap-2 rounded-xl bg-white/8 px-3 py-2 sm:w-48">
              <MagnifyingGlass size={14} className="shrink-0 text-ink-mute" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tab === 'Codes' ? 'Search codes' : 'Search packages'}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
              />
            </label>
            <FilterSelect
              label="Status"
              value={status}
              options={statuses}
              onChange={(value) => setStatus(value as StatusFilter)}
            />
          </div>
        </div>

        {tab === 'Codes' ? (
          codeRows.length === 0 ? (
            <EmptyState label="No codes match these filters." />
          ) : (
            <div className="mt-4">
              <div className="hidden grid-cols-[2rem_minmax(0,1.05fr)_5.5rem_minmax(0,1.15fr)_minmax(0,0.95fr)_7rem_5.5rem_6.5rem] items-center gap-3 px-2 pb-2 text-[11px] font-medium tracking-[0.04em] text-ink-faint uppercase lg:grid">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                  aria-label="Select all codes"
                />
                <span>Code</span>
                <span>Off</span>
                <span>Applies to</span>
                <span>Window</span>
                <span>Uses</span>
                <span>Status</span>
                <span className="text-right"> </span>
              </div>
              <div className="flex flex-col">
                {codeRows.map((item) => (
                  <CodeRow
                    key={item.id}
                    item={item}
                    selected={selected.has(item.id)}
                    onSelectedChange={(checked) => toggleOne(item.id, checked)}
                    copied={copiedId === item.id}
                    onCopy={() => copyCode(item)}
                  />
                ))}
              </div>
            </div>
          )
        ) : packageRows.length === 0 ? (
          <EmptyState label="No packages match these filters." />
        ) : (
          <div className="mt-4">
            <div className="hidden grid-cols-[2rem_minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1fr)_5rem_5.5rem] items-center gap-3 px-2 pb-2 text-[11px] font-medium tracking-[0.04em] text-ink-faint uppercase lg:grid">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onCheckedChange={(checked) => toggleAll(checked === true)}
                aria-label="Select all packages"
              />
              <span>Deal</span>
              <span>Applies to</span>
              <span>Window</span>
              <span>Uses</span>
              <span>Status</span>
            </div>
            <div className="flex flex-col">
              {packageRows.map((item) => (
                <PackageRow
                  key={item.id}
                  item={item}
                  selected={selected.has(item.id)}
                  onSelectedChange={(checked) => toggleOne(item.id, checked)}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return <p className="mt-8 rounded-2xl bg-white/5 px-4 py-12 text-center text-[14px] text-ink-mute">{label}</p>
}

function CodeRow({
  item,
  selected,
  onSelectedChange,
  copied,
  onCopy,
}: {
  item: CouponCode
  selected: boolean
  onSelectedChange: (checked: boolean) => void
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2 py-2.5 lg:grid-cols-[2rem_minmax(0,1.05fr)_5.5rem_minmax(0,1.15fr)_minmax(0,0.95fr)_7rem_5.5rem_6.5rem]">
      <Checkbox
        checked={selected}
        onCheckedChange={(checked) => onSelectedChange(checked === true)}
        aria-label={`Select ${item.code}`}
      />
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium tracking-[0.04em] text-white tnum">{item.code}</p>
        <p className="mt-0.5 truncate text-[12px] text-ink-mute">
          <span className="lg:hidden">
            {formatCouponValue(item)} · {formatLicenseScope(item.licenses)} ·{' '}
          </span>
          {formatPerBuyerLimit(item.perBuyerLimit)}
        </p>
        <div className="mt-1 lg:hidden">
          <StatusPill status={item.status} />
        </div>
      </div>
      <p className="hidden text-[13px] font-medium text-white tnum lg:block">{formatCouponValue(item)}</p>
      <div className="hidden min-w-0 lg:block">
        <p className="truncate text-[13px] text-ink-2">{formatLicenseScope(item.licenses)}</p>
        <p className="mt-0.5 truncate text-[12px] text-ink-mute">{formatBeatScope(item.beatScope)}</p>
      </div>
      <p className="hidden text-[13px] text-ink-mute lg:block">{formatDiscountWindow(item.startsAt, item.endsAt)}</p>
      <p className="hidden text-[13px] text-ink-2 tnum lg:block">
        {item.uses}
        {item.maxUses != null ? ` / ${item.maxUses}` : ''}
      </p>
      <div className="hidden lg:block">
        <StatusPill status={item.status} />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
        >
          <Copy size={12} weight="bold" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

function PackageRow({
  item,
  selected,
  onSelectedChange,
}: {
  item: PackageDeal
  selected: boolean
  onSelectedChange: (checked: boolean) => void
}) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 rounded-xl px-2 py-2.5 lg:grid-cols-[2rem_minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1fr)_5rem_5.5rem]">
      <Checkbox
        checked={selected}
        onCheckedChange={(checked) => onSelectedChange(checked === true)}
        aria-label={`Select ${item.name}`}
      />
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium text-white">{item.name}</p>
        <p className="mt-0.5 truncate text-[12px] text-ink-mute lg:hidden">
          {formatLicenseScope(item.licenses)} · {formatDiscountWindow(item.startsAt, item.endsAt)}
        </p>
        <div className="mt-1 lg:hidden">
          <StatusPill status={item.status} />
        </div>
      </div>
      <div className="hidden min-w-0 lg:block">
        <p className="truncate text-[13px] text-ink-2">{formatLicenseScope(item.licenses)}</p>
        <p className="mt-0.5 truncate text-[12px] text-ink-mute">{formatBeatScope(item.beatScope)}</p>
      </div>
      <p className="hidden text-[13px] text-ink-mute lg:block">{formatDiscountWindow(item.startsAt, item.endsAt)}</p>
      <p className="hidden text-[13px] text-ink-2 tnum lg:block">{item.uses}</p>
      <div className="hidden lg:block">
        <StatusPill status={item.status} />
      </div>
    </div>
  )
}

function CreateCode({
  draft,
  onChange,
  onCancel,
  onPublish,
  reduce,
}: {
  draft: CodeDraft
  onChange: (draft: CodeDraft) => void
  onCancel: () => void
  onPublish: () => void
  reduce: boolean
}) {
  const amountOk =
    Number(draft.amount) > 0 && (draft.valueType === 'fixed' || Number(draft.amount) <= 100)
  const canPublish =
    draft.code.trim().length > 0 &&
    amountOk &&
    draft.licenses.length > 0 &&
    Boolean(draft.startsAt) &&
    (draft.neverExpires || Boolean(draft.endsAt)) &&
    (draft.noPerBuyerLimit || Number(draft.perBuyerLimit) > 0)

  function toggleLicense(name: string) {
    onChange({
      ...draft,
      licenses: draft.licenses.includes(name)
        ? draft.licenses.filter((item) => item !== name)
        : [...draft.licenses, name],
    })
  }

  return (
    <div className="h-full min-h-0 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <CreateHeader
        reduce={reduce}
        onCancel={onCancel}
        title="New code"
        subtitle="Buyers enter this at checkout for a discount."
      />

      <div className="mt-8 grid max-w-2xl gap-5">
        <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-white/8 text-ink-mute">
              <Tag size={16} weight="bold" />
            </span>
            <h2 className="text-[18px] font-medium text-white">Code details</h2>
          </div>

          <label className="mt-5 block">
            <span className="text-[12px] font-medium text-ink-mute">Code</span>
            <input
              value={draft.code}
              onChange={(event) =>
                onChange({ ...draft, code: event.target.value.toUpperCase().replace(/\s+/g, '') })
              }
              placeholder="SONIQ20"
              className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] tracking-[0.06em] text-white outline-none placeholder:text-ink-mute tnum"
            />
          </label>

          <div className="mt-4">
            <p className="text-[12px] font-medium text-ink-mute">Discount type</p>
            <div className="mt-2 flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10 w-fit">
              {(
                [
                  { id: 'percent', label: 'Percent off' },
                  { id: 'fixed', label: 'Fixed $ off' },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...draft,
                      valueType: option.id,
                      amount: option.id === 'percent' ? '20' : '10',
                    })
                  }
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                    draft.valueType === option.id ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 block max-w-xs">
            <span className="text-[12px] font-medium text-ink-mute">
              {draft.valueType === 'percent' ? 'Percent off' : 'Amount off'}
            </span>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2.5">
              {draft.valueType === 'fixed' ? <span className="text-[13px] text-ink-mute">$</span> : null}
              <input
                inputMode="numeric"
                value={draft.amount}
                onChange={(event) =>
                  onChange({ ...draft, amount: event.target.value.replace(/[^\d]/g, '').slice(0, 4) })
                }
                className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none tnum"
              />
              {draft.valueType === 'percent' ? <span className="text-[13px] text-ink-mute">%</span> : null}
            </div>
          </label>
        </section>

        <LicensePicker licenses={draft.licenses} onToggle={toggleLicense} />

        <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
          <h2 className="text-[18px] font-medium text-white">Schedule & limits</h2>
          <ScheduleFields
            startsAt={draft.startsAt}
            endsAt={draft.endsAt}
            neverExpires={draft.neverExpires}
            onStartsAt={(startsAt) => onChange({ ...draft, startsAt })}
            onEndsAt={(endsAt) => onChange({ ...draft, endsAt })}
            onNeverExpires={(neverExpires) =>
              onChange({ ...draft, neverExpires, endsAt: neverExpires ? '' : draft.endsAt })
            }
          />

          <label className="mt-5 block">
            <span className="text-[12px] font-medium text-ink-mute">Max uses</span>
            <input
              inputMode="numeric"
              value={draft.maxUses}
              disabled={draft.unlimitedUses}
              onChange={(event) =>
                onChange({ ...draft, maxUses: event.target.value.replace(/[^\d]/g, '').slice(0, 5) })
              }
              placeholder="100"
              className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-ink-mute tnum disabled:opacity-40"
            />
          </label>
          <label className="mt-3 flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={draft.unlimitedUses}
              onChange={(event) =>
                onChange({
                  ...draft,
                  unlimitedUses: event.target.checked,
                  maxUses: event.target.checked ? '' : draft.maxUses,
                })
              }
              className="size-4 rounded border-white/20 bg-white/8"
            />
            <span className="text-[13px] text-ink-2">Unlimited uses</span>
          </label>

          <label className="mt-5 block">
            <span className="text-[12px] font-medium text-ink-mute">Per buyer limit</span>
            <input
              inputMode="numeric"
              value={draft.perBuyerLimit}
              disabled={draft.noPerBuyerLimit}
              onChange={(event) =>
                onChange({ ...draft, perBuyerLimit: event.target.value.replace(/[^\d]/g, '').slice(0, 3) })
              }
              placeholder="1"
              className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-ink-mute tnum disabled:opacity-40"
            />
          </label>
          <label className="mt-3 flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={draft.noPerBuyerLimit}
              onChange={(event) =>
                onChange({
                  ...draft,
                  noPerBuyerLimit: event.target.checked,
                  perBuyerLimit: event.target.checked ? '' : draft.perBuyerLimit || '1',
                })
              }
              className="size-4 rounded border-white/20 bg-white/8"
            />
            <span className="text-[13px] text-ink-2">No per-buyer limit</span>
          </label>
        </section>

        <CreateActions onCancel={onCancel} onPublish={onPublish} disabled={!canPublish} label="Publish code" />
      </div>
    </div>
  )
}

function CreatePackage({
  draft,
  onChange,
  onCancel,
  onPublish,
  reduce,
}: {
  draft: PackageDraft
  onChange: (draft: PackageDraft) => void
  onCancel: () => void
  onPublish: () => void
  reduce: boolean
}) {
  const buyQuantity = Number(draft.buyQuantity)
  const freeQuantity = Number(draft.freeQuantity)
  const canPublish =
    buyQuantity >= 1 &&
    freeQuantity >= 1 &&
    draft.licenses.length > 0 &&
    Boolean(draft.startsAt) &&
    (draft.neverExpires || Boolean(draft.endsAt))

  function toggleLicense(name: string) {
    onChange({
      ...draft,
      licenses: draft.licenses.includes(name)
        ? draft.licenses.filter((item) => item !== name)
        : [...draft.licenses, name],
    })
  }

  const preview =
    buyQuantity >= 1 && freeQuantity >= 1 ? formatPackageDeal(buyQuantity, freeQuantity) : 'Buy X get Y free'

  return (
    <div className="h-full min-h-0 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <CreateHeader
        reduce={reduce}
        onCancel={onCancel}
        title="New package"
        subtitle="Applies automatically when the cart hits the quantity."
      />

      <div className="mt-8 grid max-w-2xl gap-5">
        <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-white/8 text-ink-mute">
              <Package size={16} weight="bold" />
            </span>
            <h2 className="text-[18px] font-medium text-white">Deal</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-medium text-ink-mute">Buy</span>
              <input
                inputMode="numeric"
                value={draft.buyQuantity}
                onChange={(event) =>
                  onChange({ ...draft, buyQuantity: event.target.value.replace(/[^\d]/g, '').slice(0, 2) })
                }
                className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none tnum"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-ink-mute">Get free</span>
              <input
                inputMode="numeric"
                value={draft.freeQuantity}
                onChange={(event) =>
                  onChange({ ...draft, freeQuantity: event.target.value.replace(/[^\d]/g, '').slice(0, 2) })
                }
                className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none tnum"
              />
            </label>
          </div>
          <p className="mt-4 rounded-2xl bg-white/5 px-3.5 py-3 text-[14px] font-medium text-white ring-1 ring-white/8">
            {preview}
          </p>
          <p className="mt-2 text-[12px] text-ink-faint">Lowest-priced eligible track in the cart is free.</p>
        </section>

        <LicensePicker licenses={draft.licenses} onToggle={toggleLicense} />

        <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
          <h2 className="text-[18px] font-medium text-white">Schedule</h2>
          <ScheduleFields
            startsAt={draft.startsAt}
            endsAt={draft.endsAt}
            neverExpires={draft.neverExpires}
            onStartsAt={(startsAt) => onChange({ ...draft, startsAt })}
            onEndsAt={(endsAt) => onChange({ ...draft, endsAt })}
            onNeverExpires={(neverExpires) =>
              onChange({ ...draft, neverExpires, endsAt: neverExpires ? '' : draft.endsAt })
            }
          />
        </section>

        <CreateActions onCancel={onCancel} onPublish={onPublish} disabled={!canPublish} label="Publish package" />
      </div>
    </div>
  )
}

function CreateHeader({
  reduce,
  onCancel,
  title,
  subtitle,
}: {
  reduce: boolean
  onCancel: () => void
  title: string
  subtitle: string
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-mute transition-colors hover:text-white"
      >
        <ArrowLeft size={14} weight="bold" />
        Discounts
      </button>
      <h1 className="mt-4 text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]">{title}</h1>
      <p className="mt-2 text-[14px] text-ink-mute">{subtitle}</p>
    </motion.div>
  )
}

function LicensePicker({ licenses, onToggle }: { licenses: string[]; onToggle: (name: string) => void }) {
  return (
    <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
      <h2 className="text-[18px] font-medium text-white">Applies to</h2>
      <p className="mt-1 text-[13px] text-ink-mute">Choose which licenses this works with.</p>
      <ul className="mt-4 flex flex-col gap-2">
        {licenseOptions.map((name) => {
          const on = licenses.includes(name)
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => onToggle(name)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left transition-colors',
                  on ? 'bg-rose-500/15 ring-1 ring-rose-500/35' : 'bg-white/5 ring-1 ring-white/8',
                )}
              >
                <span className="text-[14px] font-medium text-white">{name}</span>
                <span
                  className={cn(
                    'grid size-5 place-items-center rounded-full text-[11px] font-bold',
                    on ? 'bg-rose-500 text-white' : 'bg-white/10 text-ink-mute',
                  )}
                >
                  {on ? '✓' : ''}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-[12px] text-ink-faint">Applies to all tracks for now.</p>
    </section>
  )
}

function ScheduleFields({
  startsAt,
  endsAt,
  neverExpires,
  onStartsAt,
  onEndsAt,
  onNeverExpires,
}: {
  startsAt: string
  endsAt: string
  neverExpires: boolean
  onStartsAt: (value: string) => void
  onEndsAt: (value: string) => void
  onNeverExpires: (value: boolean) => void
}) {
  return (
    <>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[12px] font-medium text-ink-mute">Starts</span>
          <input
            type="date"
            value={startsAt}
            onChange={(event) => onStartsAt(event.target.value)}
            className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none tnum scheme-dark"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-ink-mute">Ends</span>
          <input
            type="date"
            value={endsAt}
            disabled={neverExpires}
            onChange={(event) => onEndsAt(event.target.value)}
            className="mt-2 w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none tnum disabled:opacity-40 scheme-dark"
          />
        </label>
      </div>
      <label className="mt-3 flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={neverExpires}
          onChange={(event) => onNeverExpires(event.target.checked)}
          className="size-4 rounded border-white/20 bg-white/8"
        />
        <span className="text-[13px] text-ink-2">Never expires</span>
      </label>
    </>
  )
}

function CreateActions({
  onCancel,
  onPublish,
  disabled,
  label,
}: {
  onCancel: () => void
  onPublish: () => void
  disabled: boolean
  label: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full px-4 py-2 text-[13px] font-medium text-ink-mute transition-colors hover:text-white"
      >
        Cancel
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onPublish}
        className="inline-flex h-10 items-center justify-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-5 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {label}
      </button>
    </div>
  )
}

function StatusPill({ status }: { status: DiscountStatus }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2 py-1 text-[11px] font-medium',
        status === 'Active' && 'bg-yield-tint text-yield-bright',
        status === 'Scheduled' && 'bg-amber-400/12 text-amber-300',
        status === 'Expired' && 'bg-white/8 text-ink-mute',
        status === 'Disabled' && 'bg-rose-500/15 text-rose-300',
      )}
    >
      {status}
    </span>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="relative inline-flex shrink-0 items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent py-1.5 pr-5 pl-0 text-[13px] font-medium text-ink-2 outline-none transition-colors hover:text-white"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#121214] text-white">
            {option === 'All' ? label : option}
          </option>
        ))}
      </select>
      <CaretDown size={12} className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-ink-mute" />
    </label>
  )
}
