import { ArrowLeft } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { CapField } from '@/features/licenses/components/cap-field'
import { buildContractPreview } from '@/features/licenses/lib/contract'
import {
  LICENSE_FIELD_CLASS,
  draftToTemplateFields,
  type LicenseDraft,
} from '@/features/licenses/lib/draft'
import {
  beatFileOptions,
  kitFileOptions,
  publishingSplitOptions,
  type DeliverableFile,
  type LicenseCatalog,
  type LicenseKind,
  type LicenseTemplate,
  type PublishingSplit,
} from '@/features/licenses/types'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

export function LicenseEditor({
  catalog,
  draft,
  onChange,
  onCancel,
  onSave,
  reduce,
  mode,
  title,
  saving = false,
}: {
  catalog: LicenseCatalog
  draft: LicenseDraft
  onChange: (draft: LicenseDraft) => void
  onCancel: () => void
  onSave: () => void
  reduce: boolean
  mode: 'create' | 'edit'
  title: string
  saving?: boolean
}) {
  const fileOptions = catalog === 'beat' ? beatFileOptions : kitFileOptions
  const kindOptions: { id: LicenseKind; label: string }[] =
    catalog === 'beat'
      ? [
          { id: 'lease', label: 'Non-exclusive' },
          { id: 'exclusive', label: 'Exclusive' },
          { id: 'free', label: 'Free download' },
        ]
      : [{ id: 'royalty-free', label: 'Royalty-free' }]

  const showCaps = draft.kind === 'lease' || draft.kind === 'free'
  const isFree = draft.kind === 'free'
  const priceOk = isFree || Number(draft.defaultPrice) > 0
  const canSave =
    !saving && draft.name.trim().length > 0 && priceOk && draft.filesDelivered.length > 0

  const previewFields = draftToTemplateFields(catalog, draft)
  const previewLicense: LicenseTemplate = {
    id: 'preview',
    itemCount: 0,
    ...previewFields,
    name: previewFields.name || 'Untitled license',
  }

  const livePreviewBody = buildContractPreview(previewLicense)

  function toggleFile(file: DeliverableFile) {
    onChange({
      ...draft,
      filesDelivered: draft.filesDelivered.includes(file)
        ? draft.filesDelivered.filter((item) => item !== file)
        : [...draft.filesDelivered, file],
    })
  }

  function setKind(kind: LicenseKind) {
    const unlocked = kind === 'exclusive' || kind === 'royalty-free'
    onChange({
      ...draft,
      kind,
      defaultPrice: kind === 'free' ? '0' : draft.defaultPrice === '0' ? '40' : draft.defaultPrice,
      minOfferPrice: kind === 'free' ? '' : draft.minOfferPrice,
      unlimitedStreams: unlocked ? true : draft.unlimitedStreams,
      unlimitedDistributionCopies: unlocked ? true : draft.unlimitedDistributionCopies,
      unlimitedFreeDownloads: unlocked ? true : draft.unlimitedFreeDownloads,
      unlimitedRadio: unlocked ? true : draft.unlimitedRadio,
      unlimitedMonetizedVideos: unlocked ? true : draft.unlimitedMonetizedVideos,
      unlimitedNonMonetizedVideos: unlocked ? true : draft.unlimitedNonMonetizedVideos,
      unlimitedMonetizedVideoStreams: unlocked ? true : draft.unlimitedMonetizedVideoStreams,
      unlimitedNonMonetizedVideoStreams: unlocked ? true : draft.unlimitedNonMonetizedVideoStreams,
      unlimitedPaidShows: unlocked ? true : draft.unlimitedPaidShows,
      unlimitedFreeShows: unlocked ? true : draft.unlimitedFreeShows,
      termYears: kind === 'lease' || kind === 'free' ? draft.termYears || '2' : '',
      contractCustomized: false,
      contractBody: '',
    })
  }

  function regenerateContract() {
    const generated = buildContractPreview({ ...previewLicense, contractBody: '' })
    onChange({ ...draft, contractBody: generated, contractCustomized: true })
  }

  return (
    <div className="h-full min-h-0 overflow-auto px-5 pt-6 pb-8 sm:px-6 lg:px-6 lg:pt-5">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-[13px] text-ink-mute transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to licenses
        </button>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[36px] font-semibold tracking-[-0.04em] text-white sm:text-[42px]">{title}</h1>
            <p className="mt-2 text-[14px] text-ink-mute">
              {mode === 'edit'
                ? 'Update price, files, usage rights, and the contract buyers accept.'
                : 'Set the default offer used on upload. Per-track price can still change there.'}
            </p>
          </div>
          <button
            type="button"
            disabled={!canSave}
            onClick={onSave}
            className="inline-flex h-9 items-center justify-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Publish license'}
          </button>
        </div>
      </motion.div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(28rem,34rem)]">
        <div className="flex flex-col gap-5">
          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <h2 className="text-[18px] font-medium text-white">License details</h2>
            <p className="mt-1 text-[13px] text-ink-mute">Name, type, price, and a short description for buyers.</p>

            <label className="mt-5 block">
              <span className="text-[12px] font-medium text-ink-mute">Name</span>
              <input
                value={draft.name}
                onChange={(event) => onChange({ ...draft, name: event.target.value })}
                placeholder={catalog === 'beat' ? 'WAV lease' : 'Standard'}
                className={LICENSE_FIELD_CLASS}
              />
            </label>

            <div className="mt-4">
              <p className="text-[12px] font-medium text-ink-mute">Type</p>
              <div className="mt-2 flex w-fit flex-wrap gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
                {kindOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setKind(option.id)}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                      draft.kind === option.id ? 'bg-white/12 text-white' : 'text-ink-mute hover:text-white',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-[12px] font-medium text-ink-mute">Short description</span>
              <textarea
                value={draft.description}
                onChange={(event) => onChange({ ...draft, description: event.target.value })}
                rows={3}
                placeholder="What this offer includes for the buyer"
                className={cn(LICENSE_FIELD_CLASS, 'resize-none')}
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] font-medium text-ink-mute">
                  {isFree ? 'Price' : 'Default price (USD)'}
                </span>
                <input
                  type="number"
                  min={0}
                  disabled={isFree}
                  value={isFree ? '0' : draft.defaultPrice}
                  onChange={(event) => onChange({ ...draft, defaultPrice: event.target.value })}
                  className={cn(LICENSE_FIELD_CLASS, 'tnum disabled:opacity-40')}
                />
              </label>
              {!isFree ? (
                <label className="block">
                  <span className="text-[12px] font-medium text-ink-mute">Minimum offer (USD)</span>
                  <input
                    type="number"
                    min={0}
                    value={draft.minOfferPrice}
                    onChange={(event) => onChange({ ...draft, minOfferPrice: event.target.value })}
                    placeholder="Optional"
                    className={cn(LICENSE_FIELD_CLASS, 'tnum')}
                  />
                </label>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <h2 className="text-[18px] font-medium text-white">Files delivered</h2>
            <p className="mt-1 text-[13px] text-ink-mute">What the buyer downloads after purchase.</p>
            <div className="mt-4 flex flex-col gap-2">
              {fileOptions.map((file) => {
                const on = draft.filesDelivered.includes(file)
                return (
                  <label
                    key={file}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white/5 px-3 py-3"
                  >
                    <Checkbox checked={on} onCheckedChange={() => toggleFile(file)} />
                    <span className="text-[14px] font-medium text-white">{file}</span>
                  </label>
                )
              })}
            </div>
          </section>

          {showCaps ? (
            <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
              <h2 className="text-[18px] font-medium text-white">Usage limits</h2>
              <p className="mt-1 text-[13px] text-ink-mute">
                Caps for non-exclusive and free licenses. Exclusive stays unlimited.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <CapField
                  label="Audio streams"
                  value={draft.streams}
                  unlimited={draft.unlimitedStreams}
                  onValue={(streams) => onChange({ ...draft, streams })}
                  onUnlimited={(unlimitedStreams) => onChange({ ...draft, unlimitedStreams })}
                />
                <CapField
                  label="Distribution copies"
                  value={draft.distributionCopies}
                  unlimited={draft.unlimitedDistributionCopies}
                  onValue={(distributionCopies) => onChange({ ...draft, distributionCopies })}
                  onUnlimited={(unlimitedDistributionCopies) =>
                    onChange({ ...draft, unlimitedDistributionCopies })
                  }
                />
                <CapField
                  label="Free downloads"
                  value={draft.freeDownloads}
                  unlimited={draft.unlimitedFreeDownloads}
                  onValue={(freeDownloads) => onChange({ ...draft, freeDownloads })}
                  onUnlimited={(unlimitedFreeDownloads) => onChange({ ...draft, unlimitedFreeDownloads })}
                />
                <CapField
                  label="Radio stations"
                  value={draft.radioStations}
                  unlimited={draft.unlimitedRadio}
                  onValue={(radioStations) => onChange({ ...draft, radioStations })}
                  onUnlimited={(unlimitedRadio) => onChange({ ...draft, unlimitedRadio })}
                />
                <CapField
                  label="Monetized music videos"
                  value={draft.monetizedMusicVideos}
                  unlimited={draft.unlimitedMonetizedVideos}
                  onValue={(monetizedMusicVideos) => onChange({ ...draft, monetizedMusicVideos })}
                  onUnlimited={(unlimitedMonetizedVideos) => onChange({ ...draft, unlimitedMonetizedVideos })}
                />
                <CapField
                  label="Non-monetized music videos"
                  value={draft.nonMonetizedMusicVideos}
                  unlimited={draft.unlimitedNonMonetizedVideos}
                  onValue={(nonMonetizedMusicVideos) => onChange({ ...draft, nonMonetizedMusicVideos })}
                  onUnlimited={(unlimitedNonMonetizedVideos) =>
                    onChange({ ...draft, unlimitedNonMonetizedVideos })
                  }
                />
                <CapField
                  label="Monetized video streams"
                  value={draft.monetizedVideoStreams}
                  unlimited={draft.unlimitedMonetizedVideoStreams}
                  onValue={(monetizedVideoStreams) => onChange({ ...draft, monetizedVideoStreams })}
                  onUnlimited={(unlimitedMonetizedVideoStreams) =>
                    onChange({ ...draft, unlimitedMonetizedVideoStreams })
                  }
                />
                <CapField
                  label="Non-monetized video streams"
                  value={draft.nonMonetizedVideoStreams}
                  unlimited={draft.unlimitedNonMonetizedVideoStreams}
                  onValue={(nonMonetizedVideoStreams) => onChange({ ...draft, nonMonetizedVideoStreams })}
                  onUnlimited={(unlimitedNonMonetizedVideoStreams) =>
                    onChange({ ...draft, unlimitedNonMonetizedVideoStreams })
                  }
                />
                <CapField
                  label="Paid live performances"
                  value={draft.performancesForProfit}
                  unlimited={draft.unlimitedPaidShows}
                  onValue={(performancesForProfit) => onChange({ ...draft, performancesForProfit })}
                  onUnlimited={(unlimitedPaidShows) => onChange({ ...draft, unlimitedPaidShows })}
                />
                <CapField
                  label="Non-profit live performances"
                  value={draft.performancesNonProfit}
                  unlimited={draft.unlimitedFreeShows}
                  onValue={(performancesNonProfit) => onChange({ ...draft, performancesNonProfit })}
                  onUnlimited={(unlimitedFreeShows) => onChange({ ...draft, unlimitedFreeShows })}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] font-medium text-ink-mute">Lease term (years)</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={draft.termYears}
                    onChange={(event) => onChange({ ...draft, termYears: event.target.value })}
                    placeholder="Optional"
                    className={cn(LICENSE_FIELD_CLASS, 'tnum')}
                  />
                </label>
              </div>
            </section>
          ) : null}

          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <h2 className="text-[18px] font-medium text-white">Publishing & credit</h2>
            <p className="mt-1 text-[13px] text-ink-mute">Who keeps publishing, and how buyers should credit you.</p>

            <label className="mt-5 block">
              <span className="text-[12px] font-medium text-ink-mute">Credit line</span>
              <input
                value={draft.creditLine}
                onChange={(event) => onChange({ ...draft, creditLine: event.target.value })}
                placeholder="Produced by Nao"
                className={LICENSE_FIELD_CLASS}
              />
            </label>

            {catalog === 'beat' ? (
              <div className="mt-5">
                <p className="text-[12px] font-medium text-ink-mute">Publishing split</p>
                <RadioGroup
                  value={draft.publishingSplit}
                  onValueChange={(publishingSplit) =>
                    onChange({ ...draft, publishingSplit: publishingSplit as PublishingSplit })
                  }
                  className="mt-2"
                >
                  {publishingSplitOptions.map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-3 ring-1 transition-colors',
                        draft.publishingSplit === option.id
                          ? 'bg-white/8 ring-white/16'
                          : 'bg-white/5 ring-transparent hover:bg-white/7',
                      )}
                    >
                      <RadioGroupItem value={option.id} className="mt-0.5" />
                      <span>
                        <span className="block text-[14px] font-medium text-white">{option.label}</span>
                        <span className="mt-0.5 block text-[12px] text-ink-mute">{option.hint}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                {draft.publishingSplit === 'custom' ? (
                  <label className="mt-3 block max-w-48">
                    <span className="text-[12px] font-medium text-ink-mute">Producer publishing %</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={draft.publishingProducerPercent}
                      onChange={(event) =>
                        onChange({ ...draft, publishingProducerPercent: event.target.value })
                      }
                      className={cn(LICENSE_FIELD_CLASS, 'tnum')}
                    />
                  </label>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <h2 className="text-[18px] font-medium text-white">Defaults</h2>
            <p className="mt-1 text-[13px] text-ink-mute">How this license behaves on new uploads and in your catalog.</p>
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-3 py-3">
              <div>
                <p className="text-[14px] font-medium text-white">Offer on new uploads</p>
                <p className="mt-0.5 text-[12px] text-ink-mute">Turn this license on by default when you upload.</p>
              </div>
              <Switch
                checked={draft.defaultOnNewUploads}
                onCheckedChange={(defaultOnNewUploads) => onChange({ ...draft, defaultOnNewUploads })}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-3 py-3">
              <div>
                <p className="text-[14px] font-medium text-white">Active</p>
                <p className="mt-0.5 text-[12px] text-ink-mute">Inactive licenses stay hidden from new offers.</p>
              </div>
              <Switch checked={draft.enabled} onCheckedChange={(enabled) => onChange({ ...draft, enabled })} />
            </div>
          </section>
        </div>

        <aside className="xl:sticky xl:top-5 xl:self-start">
          <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-medium text-white">Contract</h2>
                <p className="mt-1 text-[13px] text-ink-mute">
                  Auto-built from your terms. Customize for legal wording buyers accept at checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={regenerateContract}
                className="rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
              >
                {draft.contractCustomized ? 'Reset from terms' : 'Edit contract'}
              </button>
            </div>
            <textarea
              value={draft.contractCustomized ? draft.contractBody : livePreviewBody}
              onChange={(event) =>
                onChange({ ...draft, contractBody: event.target.value, contractCustomized: true })
              }
              onFocus={() => {
                if (!draft.contractCustomized) {
                  onChange({ ...draft, contractBody: livePreviewBody, contractCustomized: true })
                }
              }}
              rows={28}
              className={cn(LICENSE_FIELD_CLASS, 'mt-4 min-h-112 resize-y font-mono text-[12px] leading-relaxed text-ink-2')}
            />
          </section>
        </aside>
      </div>
    </div>
  )
}
