import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { Checkbox } from '@/components/ui/checkbox'
import { LicenseEditor } from '@/features/licenses/components/license-editor'
import { LicenseRow } from '@/features/licenses/components/license-row'
import { LicensesEmptyState } from '@/features/licenses/components/licenses-empty-state'
import { LicensesTableSkeleton } from '@/features/licenses/components/licenses-table-skeleton'
import {
  draftFromLicense,
  draftToTemplateFields,
  type LicenseDraft,
} from '@/features/licenses/lib/draft'
import { formatKind } from '@/features/licenses/lib/format'
import { useLicenseTemplates, useUpdateLicenseTemplate } from '@/features/licenses/services'
import type { LicenseCatalog, LicenseTemplate } from '@/features/licenses/types'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const tabs = [
  { id: 'beat' as const, label: 'Tracks' },
  { id: 'kit' as const, label: 'Sound kits' },
]

export default function Licenses() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [tab, setTab] = useState<LicenseCatalog>('beat')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<LicenseDraft | null>(null)
  const [saving, setSaving] = useState(false)

  const licensesQuery = useLicenseTemplates(tab)
  const updateLicense = useUpdateLicenseTemplate()

  const catalog = licensesQuery.data ?? []

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return catalog.filter((item) => {
      if (!needle) return true
      return [item.name, item.description, formatKind(item.kind), ...item.filesDelivered].some((value) =>
        value.toLowerCase().includes(needle),
      )
    })
  }, [catalog, query])

  const visibleIds = rows.map((item) => item.id)
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id))
  const someSelected = visibleIds.some((id) => selected.has(id))
  const enabledCount = catalog.filter((item) => item.enabled).length
  const editing = editingId ? catalog.find((item) => item.id === editingId) : null

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
    navigate(`/licenses/new?catalog=${tab}`)
  }

  function openEdit(license: LicenseTemplate) {
    setEditingId(license.id)
    setDraft(draftFromLicense(license))
  }

  function closeEditor() {
    setEditingId(null)
    setDraft(null)
  }

  async function save() {
    if (!editingId || !draft) return
    const fields = draftToTemplateFields(tab, draft)
    if (!fields.name) return
    if (fields.kind !== 'free' && fields.defaultPrice <= 0) return
    if (fields.filesDelivered.length === 0) return

    setSaving(true)
    try {
      await updateLicense.mutateAsync({ licenseId: editingId, ...fields })
      closeEditor()
    } finally {
      setSaving(false)
    }
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    await updateLicense.mutateAsync({ licenseId: id, enabled })
  }

  if (editingId && draft) {
    return (
      <LicenseEditor
        catalog={tab}
        draft={draft}
        onChange={setDraft}
        onCancel={closeEditor}
        onSave={() => void save()}
        reduce={!!reduce}
        mode="edit"
        title={editing?.name ?? 'Edit license'}
        saving={saving}
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="flex shrink-0 flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]">Licenses</h1>
          <p className="mt-2 text-[14px] text-ink-mute">
            {licensesQuery.isLoading
              ? 'Loading templates…'
              : `${enabledCount} active · ${catalog.length} templates · Contract terms buyers agree to`}
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
          New license
        </motion.button>
      </motion.div>

      <div className="mt-8 flex w-fit shrink-0 gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id)
              setQuery('')
              clearSelection()
            }}
            className={cn(
              'rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors',
              tab === item.id ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[18px] font-medium text-white">
            {tab === 'beat' ? 'Beat licenses' : 'Sound kit licenses'}
          </h2>
          <label className="flex w-full max-w-48 items-center gap-2 rounded-xl bg-white/8 px-3 py-2 sm:w-48">
            <MagnifyingGlass size={14} className="shrink-0 text-ink-mute" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search licenses"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
            />
          </label>
        </div>

        {licensesQuery.isLoading ? (
          <LicensesTableSkeleton />
        ) : rows.length === 0 ? (
          <LicensesEmptyState
            reduce={!!reduce}
            searching={Boolean(query.trim())}
            catalog={tab}
            onCreate={openCreate}
          />
        ) : (
          <div className="mt-4 min-h-0 flex-1 overflow-auto">
            <div className="hidden grid-cols-[2rem_minmax(0,1.3fr)_6.5rem_minmax(0,1fr)_5.5rem_4.5rem_5rem] items-center gap-3 px-2 pb-2 text-[11px] font-medium tracking-[0.04em] text-ink-faint uppercase lg:grid">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onCheckedChange={(checked) => toggleAll(checked === true)}
                aria-label="Select all licenses"
              />
              <span>License</span>
              <span>Kind</span>
              <span>Files</span>
              <span>Price</span>
              <span>Items</span>
              <span className="text-right">Active</span>
            </div>
            <div className="flex flex-col">
              {rows.map((license) => (
                <LicenseRow
                  key={license.id}
                  license={license}
                  selected={selected.has(license.id)}
                  onSelectedChange={(checked) => toggleOne(license.id, checked)}
                  onEdit={() => openEdit(license)}
                  onToggle={(enabled) => void toggleEnabled(license.id, enabled)}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
