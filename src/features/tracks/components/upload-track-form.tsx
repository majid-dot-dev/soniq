import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Beat } from '@/features/dashboard/beats'
import {
  describeTrack,
  formatClock,
  hasExtension,
  nameFromFile,
  visibilities,
  type LicenseOffer,
} from '@/features/tracks/components/upload-track-steps/shared'
import { useLicenseTemplates } from '@/features/licenses/services'
import UploadTrackStep1 from '@/features/tracks/components/upload-track-steps/step-1'
import UploadTrackStep2 from '@/features/tracks/components/upload-track-steps/step-2'
import UploadTrackStep3 from '@/features/tracks/components/upload-track-steps/step-3'
import UploadTrackStep4 from '@/features/tracks/components/upload-track-steps/step-4'
import {
  durationMsFromClock,
  formatDurationMs,
  offersFromTemplates,
  pendingAssetsFromTrack,
  trackToBeat,
  trackTypeFromApi,
  trackTypeToApi,
  visibilityFromApi,
  visibilityToApi,
  type PendingSlot,
} from '@/features/tracks/lib/map-beat'
import {
  useAttachTrackAsset,
  useCreateTrack,
  usePublishTrack,
  useUpdateTrack,
} from '@/features/tracks/services'
import {
  useGenres,
  useInstruments,
  useMoods,
  useMusicalKeys,
} from '@/features/tracks/services/taxonomy'
import type { Track, TrackAssetSlot, PendingTrackAsset } from '@/features/tracks/types'
import { uploadFileToStorage, type UploadKind } from '@/features/uploads/upload-file'
import { getErrorMessage } from '@/lib/api/errors'
import { toastApiError } from '@/lib/toast'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const steps = [
  { id: 'files', label: 'Files' },
  { id: 'details', label: 'Details' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'pricing', label: 'Pricing' },
] as const

const SLOT_KIND: Record<TrackAssetSlot, UploadKind> = {
  master: 'tracks',
  tagged: 'tracks',
  stems: 'kits',
  cover: 'covers',
}

export function UploadTrackForm({
  initialTrack,
  onCancel,
  onComplete,
}: {
  initialTrack?: Track
  onCancel: () => void
  onComplete: (beat: Beat) => void
}) {
  const reduce = useReducedMotion()
  const createTrack = useCreateTrack()
  const updateTrack = useUpdateTrack()
  const attachAsset = useAttachTrackAsset()
  const publishTrack = usePublishTrack()

  const editing = Boolean(initialTrack)
  const alreadyLive = initialTrack?.status === 'live' || initialTrack?.status === 'sold'

  const [trackId, setTrackId] = useState<string | null>(initialTrack?.id ?? null)
  const trackIdRef = useRef<string | null>(initialTrack?.id ?? null)
  const [saving, setSaving] = useState(false)
  const [uploadingSlot, setUploadingSlot] = useState<TrackAssetSlot | null>(null)
  const [pending, setPending] = useState<Partial<Record<TrackAssetSlot, PendingSlot>>>(() =>
    initialTrack ? pendingAssetsFromTrack(initialTrack) : {},
  )

  useEffect(() => {
    trackIdRef.current = trackId
  }, [trackId])

  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [master, setMaster] = useState<File | null>(null)
  const [tagged, setTagged] = useState<File | null>(null)
  const [stems, setStems] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(() => initialTrack?.coverUrl ?? null)
  const [duration, setDuration] = useState(() =>
    initialTrack ? formatDurationMs(initialTrack.durationMs) : '00:00',
  )
  const [title, setTitle] = useState(() => initialTrack?.title ?? '')
  const [about, setAbout] = useState(() => initialTrack?.about ?? '')
  const [genre, setGenre] = useState<string[]>(() => initialTrack?.genreIds ?? [])
  const [mood, setMood] = useState<string[]>(() => initialTrack?.moodIds ?? [])
  const [bpm, setBpm] = useState(() => (initialTrack?.bpm != null ? String(initialTrack.bpm) : ''))
  const [keyName, setKeyName] = useState(() => initialTrack?.musicalKeyId ?? '')
  const [instrument, setInstrument] = useState<string[]>(() => initialTrack?.instrumentIds ?? [])
  const genresQuery = useGenres()
  const moodsQuery = useMoods()
  const instrumentsQuery = useInstruments()
  const keysQuery = useMusicalKeys()
  const genreOptions = genresQuery.data ?? []
  const moodOptions = moodsQuery.data ?? []
  const instrumentOptions = instrumentsQuery.data ?? []
  const keyOptions = keysQuery.data ?? []
  const [trackType, setTrackType] = useState(() =>
    initialTrack ? trackTypeFromApi(initialTrack.trackType) : '',
  )
  const [visibility, setVisibility] = useState<(typeof visibilities)[number]>(() =>
    initialTrack
      ? (visibilityFromApi(initialTrack.visibility) as (typeof visibilities)[number])
      : 'Public',
  )
  const [releaseDate, setReleaseDate] = useState(() =>
    initialTrack?.releaseDate ? new Date(initialTrack.releaseDate).toISOString().slice(0, 10) : '',
  )
  const [tags, setTags] = useState<string[]>(() => initialTrack?.tags ?? [])
  const [tagDraft, setTagDraft] = useState('')
  const [licenses, setLicenses] = useState<LicenseOffer[]>([])
  const [licensesReady, setLicensesReady] = useState(false)
  const [writing, setWriting] = useState(false)

  const licenseTemplatesQuery = useLicenseTemplates('beat')

  useEffect(() => {
    if (!licenseTemplatesQuery.data || licensesReady) return
    setLicenses(
      offersFromTemplates(licenseTemplatesQuery.data, initialTrack?.licenses ?? []),
    )
    setLicensesReady(true)
  }, [licenseTemplatesQuery.data, initialTrack?.licenses, licensesReady])

  const hasStems = Boolean(stems || pending.stems)
  const masterLabel = master ? undefined : pending.master?.originalFilename
  const taggedLabel = tagged ? undefined : pending.tagged?.originalFilename
  const stemsLabel = stems ? undefined : pending.stems?.originalFilename

  useEffect(() => {
    if (!master) return
    const url = URL.createObjectURL(master)
    const audio = new Audio()
    audio.preload = 'metadata'
    const onMeta = () => {
      const clock = formatClock(audio.duration)
      setDuration(clock)
      const ms = durationMsFromClock(clock) ?? undefined
      setPending((current) =>
        current.master ? { ...current, master: { ...current.master, durationMs: ms } } : current,
      )
    }
    audio.addEventListener('loadedmetadata', onMeta)
    audio.src = url
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.src = ''
      URL.revokeObjectURL(url)
    }
  }, [master])

  async function uploadToS3(slot: TrackAssetSlot, file: File) {
    setUploadingSlot(slot)
    try {
      const uploaded = await uploadFileToStorage({ kind: SLOT_KIND[slot], file })
      const next: PendingSlot = {
        key: uploaded.key,
        originalFilename: file.name,
        durationMs: slot === 'master' ? (durationMsFromClock(duration) ?? undefined) : undefined,
      }
      setPending((current) => ({ ...current, [slot]: next }))

      const existingId = trackIdRef.current
      if (existingId) {
        await attachAsset.mutateAsync({
          trackId: existingId,
          slot,
          key: uploaded.key,
          originalFilename: file.name,
          durationMs: next.durationMs,
        })
      }
    } finally {
      setUploadingSlot(null)
    }
  }

  async function chooseMaster(file: File | null) {
    if (file && !hasExtension(file, ['.mp3', '.wav', '.wave'])) {
      setError('The master needs to be a WAV or MP3.')
      return
    }
    setError(null)
    setDuration('00:00')
    setMaster(file)
    if (file && !title.trim()) setTitle(nameFromFile(file))
    if (!file) {
      setPending((current) => {
        const next = { ...current }
        delete next.master
        return next
      })
      return
    }
    try {
      await uploadToS3('master', file)
    } catch (err) {
      setMaster(null)
      toastApiError(err, getErrorMessage(err, 'Could not upload master'))
    }
  }

  async function chooseTagged(file: File | null) {
    if (file && !hasExtension(file, ['.mp3'])) {
      setError('The tagged preview needs to be an MP3.')
      return
    }
    setError(null)
    setTagged(file)
    if (!file) {
      setPending((current) => {
        const next = { ...current }
        delete next.tagged
        return next
      })
      return
    }
    try {
      await uploadToS3('tagged', file)
    } catch (err) {
      setTagged(null)
      toastApiError(err, getErrorMessage(err, 'Could not upload tagged file'))
    }
  }

  async function chooseStems(file: File | null) {
    if (file && !hasExtension(file, ['.zip'])) {
      setError('Stems need to be a zip of the trackouts.')
      return
    }
    setError(null)
    setStems(file)
    if (!file) {
      setLicenses((current) =>
        current.map((license) => (license.id === 'stems' ? { ...license, enabled: false } : license)),
      )
      setPending((current) => {
        const next = { ...current }
        delete next.stems
        return next
      })
      return
    }
    try {
      await uploadToS3('stems', file)
    } catch (err) {
      setStems(null)
      toastApiError(err, getErrorMessage(err, 'Could not upload stems'))
    }
  }

  async function chooseCover(file: File | null) {
    if (file && !hasExtension(file, ['.jpg', '.jpeg', '.png', '.webp'])) {
      setError('Cover art needs to be a JPG, PNG, or WebP.')
      return
    }
    setError(null)
    setCoverUrl((current) => {
      if (current?.startsWith('blob:')) URL.revokeObjectURL(current)
      return file ? URL.createObjectURL(file) : null
    })
    if (!file) {
      setPending((current) => {
        const next = { ...current }
        delete next.cover
        return next
      })
      return
    }
    try {
      await uploadToS3('cover', file)
    } catch (err) {
      setCoverUrl((current) => {
        if (current?.startsWith('blob:')) URL.revokeObjectURL(current)
        return null
      })
      toastApiError(err, getErrorMessage(err, 'Could not upload cover'))
    }
  }

  function generateDescription() {
    if (writing) return
    const name = title.trim() || (master ? nameFromFile(master) : 'This track')
    const next = describeTrack(name)
    if (reduce) {
      setAbout(next)
      return
    }
    setWriting(true)
    window.setTimeout(() => {
      setAbout(next)
      setWriting(false)
    }, 1400)
  }

  function addTag(raw: string) {
    const next = raw.trim().replace(/^#/, '').toLowerCase()
    if (!next || tags.includes(next) || tags.length >= 3) return
    setTags((current) => [...current, next])
    setTagDraft('')
  }

  function problemFor(index: number) {
    if (index === 0) {
      if (!pending.master) return 'Add the untagged master. That is the file the buyer downloads.'
      if (uploadingSlot) return 'Wait for the current upload to finish.'
    }
    if (index === 1) {
      if (!title.trim()) return 'Give the track a title.'
      if (!trackType) return 'Choose a track type.'
    }
    if (index === 2) {
      if (genre.length === 0 || mood.length === 0 || !keyName || instrument.length === 0) {
        return 'Add a genre, mood, key, and instrument so buyers can filter it.'
      }
      const tempo = Number(bpm)
      if (!bpm.trim() || !Number.isFinite(tempo) || tempo < 40 || tempo > 240) return 'Enter a BPM between 40 and 240.'
    }
    if (index === 3) {
      const offered = licenses.filter((license) => license.enabled)
      if (offered.length === 0) return 'Turn on at least one license before publishing.'
      if (offered.some((license) => !(Number(license.price) > 0))) return 'Each license you offer needs a price.'
      if (offered.some((license) => license.needsStems) && !hasStems) {
        return 'Upload stems before offering a stems license.'
      }
    }
    return null
  }

  function pendingAssetsPayload(): PendingTrackAsset[] {
    return (Object.entries(pending) as [TrackAssetSlot, PendingSlot][]).map(([slot, asset]) => ({
      slot,
      key: asset.key,
      originalFilename: asset.originalFilename,
      durationMs: asset.durationMs,
    }))
  }

  async function ensureDraft() {
    if (trackId) return trackId
    if (!pending.master) throw new Error('Master upload is required')

    const track = await createTrack.mutateAsync({
      title: title.trim() || undefined,
      assets: pendingAssetsPayload(),
    })
    trackIdRef.current = track.id
    setTrackId(track.id)
    return track.id
  }

  function goTo(index: number) {
    if (index === step) return
    if (index < step) {
      setError(null)
      setStep(index)
      return
    }
    void (async () => {
      for (let cursor = step; cursor < index; cursor += 1) {
        const problem = problemFor(cursor)
        if (problem) {
          setStep(cursor)
          setError(problem)
          return
        }
        if (cursor === 0 && !trackId) {
          setSaving(true)
          try {
            await ensureDraft()
          } catch (err) {
            toastApiError(err, getErrorMessage(err, 'Could not create draft'))
            return
          } finally {
            setSaving(false)
          }
        }
      }
      setError(null)
      setStep(index)
    })()
  }

  async function continueStep() {
    const problem = problemFor(step)
    if (problem) {
      setError(problem)
      return
    }

    if (step === 0 && !trackId) {
      setSaving(true)
      setError(null)
      try {
        await ensureDraft()
        setStep(1)
      } catch (err) {
        toastApiError(err, getErrorMessage(err, 'Could not create draft'))
      } finally {
        setSaving(false)
      }
      return
    }

    setError(null)
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  function licensesPayload() {
    return licenses.map((license) => ({
      licenseTemplateId: license.id,
      priceCents: license.isFree ? 0 : Math.round(Number(license.price) * 100),
      enabled: license.enabled,
    }))
  }

  async function persistDetails(id: string) {
    return updateTrack.mutateAsync({
      trackId: id,
      title: title.trim(),
      about: about.trim(),
      trackType: trackTypeToApi(trackType),
      genreIds: genre,
      moodIds: mood,
      instrumentIds: instrument,
      tags,
      bpm: bpm.trim() ? Number(bpm) : null,
      musicalKeyId: keyName || null,
      durationMs: durationMsFromClock(duration),
      visibility: visibilityToApi(visibility),
      releaseDate: releaseDate ? new Date(releaseDate).toISOString() : null,
      licenses: licensesPayload(),
    })
  }

  async function saveDraft() {
    if (!pending.master && !title.trim()) {
      setError('Add a file or a title to keep a draft.')
      return
    }
    if (!pending.master) {
      setError('Upload the master file before saving a draft.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const id = await ensureDraft()
      const track = await persistDetails(id)
      onComplete(trackToBeat(track))
    } catch (err) {
      toastApiError(err, getErrorMessage(err, 'Could not save draft'))
    } finally {
      setSaving(false)
    }
  }

  async function saveChanges() {
    if (!trackId) {
      setError('This track could not be loaded for editing.')
      return
    }
    if (!pending.master) {
      setError('Keep a master file on this track.')
      return
    }
    for (let index = 0; index < steps.length; index += 1) {
      const problem = problemFor(index)
      if (problem) {
        setStep(index)
        setError(problem)
        return
      }
    }
    setSaving(true)
    setError(null)
    try {
      const track = await persistDetails(trackId)
      onComplete(trackToBeat(track))
    } catch (err) {
      toastApiError(err, getErrorMessage(err, 'Could not save changes'))
    } finally {
      setSaving(false)
    }
  }

  async function publish() {
    for (let index = 0; index < steps.length; index += 1) {
      const problem = problemFor(index)
      if (problem) {
        setStep(index)
        setError(problem)
        return
      }
    }
    setSaving(true)
    setError(null)
    try {
      const id = trackId ?? (await ensureDraft())
      await persistDetails(id)
      const track = await publishTrack.mutateAsync(id)
      onComplete(trackToBeat(track))
    } catch (err) {
      toastApiError(err, getErrorMessage(err, 'Could not publish track'))
    } finally {
      setSaving(false)
    }
  }

  const busy = saving || uploadingSlot != null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-5 pt-5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            if (coverUrl?.startsWith('blob:')) URL.revokeObjectURL(coverUrl)
            onCancel()
          }}
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-mute transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Tracks
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-center text-[32px] font-semibold tracking-[-0.04em] text-white sm:text-[40px]">
            {editing ? 'Edit Track' : 'Upload Track'}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-center text-[14px] text-ink-mute">
            {editing
              ? 'Update files, details, or pricing — changes apply when you save.'
              : 'The file a buyer downloads, then the details that help them find it.'}
          </p>

          <ol className="mx-auto mt-8 flex items-start justify-center pb-7">
            {steps.map((item, index) => {
              const current = index === step
              const done = index < step
              return (
                <li key={item.id} className="flex items-start">
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className={cn(
                        'mx-3 mt-3.25 h-px w-8 shrink-0 sm:w-14',
                        index <= step ? 'bg-rose-400' : 'bg-white/35',
                      )}
                    />
                  ) : null}
                  <div className="relative flex w-7 shrink-0 flex-col items-center">
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={current ? 'step' : undefined}
                      className={cn(
                        'grid size-7 place-items-center rounded-full border-0 p-0 text-[13px] font-semibold tnum',
                        (current || done) && 'bg-rose-500 text-white',
                        !current && !done && 'bg-[#3a3a40] text-white/80',
                      )}
                    >
                      {index + 1}
                    </button>
                    <span
                      className={cn(
                        'absolute top-9 left-1/2 -translate-x-1/2 text-[12px] leading-none font-medium whitespace-nowrap',
                        current ? 'text-white' : 'text-ink-mute',
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="mt-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={steps[step].id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {step === 0 ? (
                  <UploadTrackStep1
                    master={master}
                    tagged={tagged}
                    stems={stems}
                    masterLabel={masterLabel}
                    taggedLabel={taggedLabel}
                    stemsLabel={stemsLabel}
                    duration={duration}
                    uploadingSlot={uploadingSlot}
                    onMaster={(file) => void chooseMaster(file)}
                    onTagged={(file) => void chooseTagged(file)}
                    onStems={(file) => void chooseStems(file)}
                  />
                ) : null}

                {step === 1 ? (
                  <UploadTrackStep2
                    coverUrl={coverUrl}
                    uploadingCover={uploadingSlot === 'cover'}
                    title={title}
                    about={about}
                    trackType={trackType}
                    visibility={visibility}
                    releaseDate={releaseDate}
                    writing={writing}
                    onCover={(file) => void chooseCover(file)}
                    onTitle={setTitle}
                    onAbout={setAbout}
                    onTrackType={setTrackType}
                    onVisibility={setVisibility}
                    onReleaseDate={setReleaseDate}
                    onGenerateDescription={generateDescription}
                  />
                ) : null}

                {step === 2 ? (
                  <UploadTrackStep3
                    genre={genre}
                    mood={mood}
                    bpm={bpm}
                    keyName={keyName}
                    instrument={instrument}
                    tags={tags}
                    tagDraft={tagDraft}
                    genreOptions={genreOptions}
                    moodOptions={moodOptions}
                    keyOptions={keyOptions}
                    instrumentOptions={instrumentOptions}
                    onGenre={setGenre}
                    onMood={setMood}
                    onBpm={setBpm}
                    onKeyName={setKeyName}
                    onInstrument={setInstrument}
                    onTags={setTags}
                    onTagDraft={setTagDraft}
                    onAddTag={addTag}
                  />
                ) : null}

                {step === 3 ? (
                  <UploadTrackStep4
                    licenses={licenses}
                    hasStems={hasStems}
                    loading={!licensesReady || licenseTemplatesQuery.isLoading}
                    onLicenses={setLicenses}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 bg-[#121214] px-5 py-3.5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 text-[13px] text-rose-300" role="alert">
            {error}
          </p>
          <div className="ml-auto flex items-center gap-2">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium text-ink-2 transition-colors hover:text-white"
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void (alreadyLive ? saveChanges() : saveDraft())}
              disabled={busy}
              className="inline-flex h-9 items-center rounded-full bg-white/8 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white/12 disabled:pointer-events-none disabled:opacity-50"
            >
              {saving ? 'Saving…' : alreadyLive ? 'Save changes' : 'Save draft'}
            </button>
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => void continueStep()}
                disabled={busy}
                className="inline-flex h-9 items-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white disabled:pointer-events-none disabled:opacity-50"
              >
                {uploadingSlot ? 'Uploading…' : saving ? 'Saving…' : 'Continue'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void (alreadyLive ? saveChanges() : publish())}
                disabled={busy}
                className="inline-flex h-9 items-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white disabled:pointer-events-none disabled:opacity-50"
              >
                {saving
                  ? alreadyLive
                    ? 'Saving…'
                    : 'Publishing…'
                  : alreadyLive
                    ? 'Save changes'
                    : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
