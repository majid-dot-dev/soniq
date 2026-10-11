import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import {
  ArrowLeft,
  CalendarBlank,
  CaretDown,
  ImageSquare,
  MusicNote,
  Package,
  Pause,
  Play,
  Sparkle,
  X,
} from '@phosphor-icons/react'
import { format } from 'date-fns'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import type { SoundKit, SoundKitStatus, SoundKitType } from '@/features/dashboard/sound-kits'
import { kitTypes } from '@/features/dashboard/sound-kits'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const steps = [
  { id: 'files', label: 'Files' },
  { id: 'details', label: 'Details' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'pricing', label: 'Pricing' },
] as const

const genres = ['Amapiano', 'Afrobeats', 'Afro-fusion', 'Log Drum', 'R&B'] as const
const visibilities = ['Private', 'Public', 'Unlisted'] as const

type KitLicense = {
  id: string
  name: string
  detail: string
  price: string
  enabled: boolean
}

const defaultLicenses: KitLicense[] = [
  {
    id: 'standard',
    name: 'Standard',
    detail: 'Royalty-free use in your own records. Don’t resell the raw files.',
    price: '29',
    enabled: true,
  },
  {
    id: 'commercial',
    name: 'Commercial',
    detail: 'Same rights, plus sync and larger commercial projects.',
    price: '79',
    enabled: true,
  },
]

const fieldClass =
  'w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-ink-mute'

export function UploadSoundKit({
  onCancel,
  onComplete,
}: {
  onCancel: () => void
  onComplete: (kit: SoundKit) => void
}) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [pack, setPack] = useState<File | null>(null)
  const [preview, setPreview] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [previewDuration, setPreviewDuration] = useState('00:00')
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [kitType, setKitType] = useState('')
  const [sounds, setSounds] = useState('')
  const [genre, setGenre] = useState<string[]>([])
  const [visibility, setVisibility] = useState<(typeof visibilities)[number]>('Public')
  const [releaseDate, setReleaseDate] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagDraft, setTagDraft] = useState('')
  const [licenses, setLicenses] = useState(defaultLicenses)
  const [writing, setWriting] = useState(false)

  useEffect(() => {
    if (!preview) return
    const url = URL.createObjectURL(preview)
    const audio = new Audio()
    audio.preload = 'metadata'
    const onMeta = () => setPreviewDuration(formatClock(audio.duration))
    audio.addEventListener('loadedmetadata', onMeta)
    audio.src = url
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.src = ''
      URL.revokeObjectURL(url)
    }
  }, [preview])

  function choosePack(file: File | null) {
    if (file && !hasExtension(file, ['.zip', '.rar'])) {
      setError('The pack needs to be a ZIP or RAR.')
      return
    }
    setError(null)
    setPack(file)
    if (file && !title.trim()) setTitle(nameFromFile(file))
  }

  function choosePreview(file: File | null) {
    if (file && !hasExtension(file, ['.mp3', '.wav', '.wave'])) {
      setError('The preview needs to be a WAV or MP3.')
      return
    }
    setError(null)
    setPreviewDuration('00:00')
    setPreview(file)
  }

  function chooseCover(file: File | null) {
    if (file && !hasExtension(file, ['.jpg', '.jpeg', '.png', '.webp'])) {
      setError('Cover art needs to be a JPG, PNG, or WebP.')
      return
    }
    setError(null)
    setCoverUrl((current) => {
      if (current?.startsWith('blob:')) URL.revokeObjectURL(current)
      return file ? URL.createObjectURL(file) : null
    })
  }

  function generateDescription() {
    if (writing) return
    const name = title.trim() || (pack ? nameFromFile(pack) : 'This kit')
    const next = describeKit(name, kitType)
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
    if (index === 0 && !pack) return 'Add the ZIP pack. That is what the buyer downloads.'
    if (index === 1) {
      if (!title.trim()) return 'Give the kit a title.'
      if (!kitType) return 'Choose a kit type.'
    }
    if (index === 2) {
      const count = Number(sounds)
      if (!sounds.trim() || !Number.isFinite(count) || count < 1) return 'Enter how many sounds are in the pack.'
    }
    if (index === 3) {
      const offered = licenses.filter((license) => license.enabled)
      if (offered.length === 0) return 'Turn on at least one license before publishing.'
      if (offered.some((license) => !(Number(license.price) > 0))) return 'Each license you offer needs a price.'
    }
    return null
  }

  function goTo(index: number) {
    if (index === step) return
    if (index < step) {
      setError(null)
      setStep(index)
      return
    }
    for (let cursor = step; cursor < index; cursor += 1) {
      const problem = problemFor(cursor)
      if (problem) {
        setStep(cursor)
        setError(problem)
        return
      }
    }
    setError(null)
    setStep(index)
  }

  function continueStep() {
    const problem = problemFor(step)
    if (problem) {
      setError(problem)
      return
    }
    setError(null)
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  function toKit(status: SoundKitStatus): SoundKit {
    const offered = licenses.filter((license) => license.enabled && Number(license.price) > 0)
    const from = offered.length ? Math.min(...offered.map((license) => Number(license.price))) : 0
    const resolvedTitle = title.trim() || (pack ? nameFromFile(pack) : '') || 'Untitled kit'
    return {
      id: `${slug(resolvedTitle)}-${Date.now().toString(36)}`,
      title: resolvedTitle,
      type: (kitType as SoundKitType) || 'Drum kit',
      sounds: Number(sounds) || 0,
      status,
      plays: 0,
      sales: 0,
      fromPrice: from ? `$${from}` : '—',
      licenses: offered.length,
      year: String(new Date().getFullYear()),
      updated: 'Just now',
      image: coverUrl ?? '/assets/avatar-1.jpg',
      about: about.trim() || 'No description yet.',
      tags: tags.length ? tags : undefined,
      genre: genre.length ? genre : undefined,
      visibility,
    }
  }

  function saveDraft() {
    if (!pack && !title.trim()) {
      setError('Add a pack or a title to keep a draft.')
      return
    }
    onComplete(toKit('Draft'))
  }

  function publish() {
    for (let index = 0; index < steps.length; index += 1) {
      const problem = problemFor(index)
      if (problem) {
        setStep(index)
        setError(problem)
        return
      }
    }
    onComplete(toKit('Live'))
  }

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
          Sound kits
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-center text-[32px] font-semibold tracking-[-0.04em] text-white sm:text-[40px]">
            Upload kit
          </h1>
          <p className="mx-auto mt-2 max-w-md text-center text-[14px] text-ink-mute">
            The pack a buyer downloads, then the details that help them find it.
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
                  <div className="grid gap-3">
                    <FileSlot
                      icon={<Package size={18} />}
                      label="Sound pack"
                      hint="ZIP or RAR. This is what the buyer downloads."
                      file={pack}
                      accept=".zip,.rar,application/zip,application/x-rar-compressed"
                      onFile={choosePack}
                    />
                    <FileSlot
                      icon={<MusicNote size={18} />}
                      label="Preview audio"
                      hint="Optional MP3 or WAV demo reel for the store."
                      file={preview}
                      extra={preview ? previewDuration : undefined}
                      accept=".mp3,.wav,.wave,audio/mpeg,audio/wav"
                      playable
                      onFile={choosePreview}
                    />
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <CoverPicker url={coverUrl} onFile={chooseCover} />
                    <div className="grid min-w-0 flex-1 gap-5">
                      <Field label="Title">
                        <input
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                          placeholder="Log Room Drums"
                          className={fieldClass}
                        />
                      </Field>
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[12px] font-medium text-ink-2">Description</span>
                          <button
                            type="button"
                            onClick={generateDescription}
                            disabled={writing}
                            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white/8 px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-white/12 disabled:opacity-60"
                          >
                            <Sparkle size={13} weight="fill" className={writing ? 'animate-pulse' : undefined} />
                            {writing ? 'Writing' : 'Generate'}
                          </button>
                        </div>
                        <p className="mt-0.5 text-[12px] text-ink-mute">What a producer gets inside the pack.</p>
                        <textarea
                          value={about}
                          onChange={(event) => setAbout(event.target.value)}
                          rows={5}
                          placeholder="Dry kicks, snappy claps, and log-friendly hats."
                          className={cn(fieldClass, 'mt-2 resize-none leading-relaxed')}
                        />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Kit type">
                          <Select value={kitType} onChange={setKitType} placeholder="Kit type" options={kitTypes} />
                        </Field>
                        <Field label="Visibility">
                          <Select
                            value={visibility}
                            onChange={(value) => setVisibility(value as (typeof visibilities)[number])}
                            placeholder="Visibility"
                            options={visibilities}
                          />
                        </Field>
                        <div className="sm:col-span-2">
                          <div>
                            <span className="text-[12px] font-medium text-ink-2">Release date</span>
                            <p className="mt-0.5 text-[12px] text-ink-mute">Leave this empty to release when you publish.</p>
                            <div className="mt-2">
                              <ReleaseDateField value={releaseDate} onChange={setReleaseDate} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Number of sounds">
                      <input
                        inputMode="numeric"
                        value={sounds}
                        onChange={(event) => setSounds(event.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                        placeholder="64"
                        className={cn(fieldClass, 'tnum')}
                      />
                    </Field>
                    <div>
                      <span className="text-[12px] font-medium text-ink-2">Genre</span>
                      <div className="mt-2">
                        <MultiSelect value={genre} onChange={setGenre} placeholder="Genre" options={genres} />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[12px] font-medium text-ink-2">Tags</p>
                      <p className="mt-0.5 text-[12px] text-ink-mute">Up to three. Type a tag and press enter.</p>
                      <div className="mt-2 flex min-h-11 flex-wrap items-center gap-2 rounded-xl bg-white/8 px-3 py-2">
                        {tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                            className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[12px] font-medium text-white"
                          >
                            #{tag}
                            <X size={10} weight="bold" />
                          </button>
                        ))}
                        {tags.length < 3 ? (
                          <input
                            value={tagDraft}
                            onChange={(event) => setTagDraft(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ',') {
                                event.preventDefault()
                                addTag(tagDraft)
                              }
                              if (event.key === 'Backspace' && !tagDraft) {
                                setTags((current) => current.slice(0, -1))
                              }
                            }}
                            placeholder={tags.length === 0 ? 'drums' : ''}
                            className="min-w-32 flex-1 bg-transparent py-1 text-[14px] text-white outline-none placeholder:text-ink-mute"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div>
                    <p className="text-[13px] leading-relaxed text-ink-mute">
                      Pick which offers are on this kit and the price. Contract terms stay in Licenses.
                    </p>
                    <ul className="mt-4 flex flex-col gap-2">
                      {licenses.map((license) => (
                        <li key={license.id} className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
                          <Switch
                            checked={license.enabled}
                            aria-label={`${license.enabled ? 'Remove' : 'Offer'} ${license.name}`}
                            onCheckedChange={(checked) =>
                              setLicenses((current) =>
                                current.map((item) =>
                                  item.id === license.id ? { ...item, enabled: checked } : item,
                                ),
                              )
                            }
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-medium text-white">{license.name}</span>
                            <span className="mt-0.5 block text-[12px] text-ink-mute">{license.detail}</span>
                          </span>
                          <label className="flex shrink-0 items-center gap-1 rounded-lg bg-white/8 px-2.5 py-1.5">
                            <span className="text-[13px] text-ink-mute">$</span>
                            <input
                              inputMode="numeric"
                              aria-label={`${license.name} price`}
                              disabled={!license.enabled}
                              value={license.price}
                              onChange={(event) => {
                                const price = event.target.value.replace(/[^\d]/g, '').slice(0, 5)
                                setLicenses((current) =>
                                  current.map((item) => (item.id === license.id ? { ...item, price } : item)),
                                )
                              }}
                              className="w-12 bg-transparent text-[13px] text-white outline-none tnum disabled:text-ink-mute"
                            />
                          </label>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 rounded-2xl bg-white/5 px-4 py-3 text-[13px] text-ink-2">
                      <p className="font-medium text-white">{title.trim() || 'Untitled kit'}</p>
                      <p className="mt-1 text-ink-mute">
                        {[pack?.name, preview ? `Preview · ${previewDuration}` : null].filter(Boolean).join(' · ')}
                      </p>
                      <p className="mt-1 text-ink-mute">
                        {[kitType, sounds && `${sounds} sounds`, genre.join(', '), visibility]
                          .filter(Boolean)
                          .join(' · ') || 'Metadata still open'}
                      </p>
                    </div>
                  </div>
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
              onClick={saveDraft}
              className="inline-flex h-9 items-center rounded-full bg-white/8 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white/12"
            >
              Save draft
            </button>
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={continueStep}
                className="inline-flex h-9 items-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={publish}
                className="inline-flex h-9 items-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const SIMULATED_UPLOAD_MS = 2200

function useUploadMotion(active: boolean) {
  const reduce = useReducedMotion()
  const play = useRef(false)
  const [generation, setGeneration] = useState(0)
  const [progress, setProgress] = useState<number | null>(null)

  function arm() {
    if (reduce) return
    play.current = true
    setProgress(0)
    setGeneration((current) => current + 1)
  }

  useEffect(() => {
    if (!active || !play.current || reduce) return
    const started = performance.now()
    const length = SIMULATED_UPLOAD_MS
    let frame = 0
    const tick = (now: number) => {
      const next = Math.min(1, (now - started) / length)
      if (next < 1) {
        setProgress(1 - (1 - next) ** 3)
        frame = requestAnimationFrame(tick)
        return
      }
      play.current = false
      setProgress(null)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, generation, reduce])

  const running = active && progress !== null
  return { progress: progress ?? (active ? 1 : 0), running, arm }
}

function CoverPicker({ url, onFile }: { url: string | null; onFile: (file: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { progress, running, arm } = useUploadMotion(Boolean(url))

  return (
    <div className="mx-auto w-36 shrink-0 sm:mx-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border border-dashed bg-white/5 text-ink-mute transition-colors',
          running ? 'border-solid border-rose-400' : 'border-white/15 hover:border-white/30',
        )}
      >
        {url ? (
          <img src={url} alt="" className={cn('size-full object-cover', running && 'scale-105 opacity-40')} />
        ) : (
          <span className="flex flex-col items-center gap-1.5">
            <ImageSquare size={22} />
            <span className="text-[12px] font-medium">Cover</span>
          </span>
        )}
        {running ? (
          <>
            <WaterFill progress={progress} />
            <span className="relative text-[12px] font-medium text-white tnum">{Math.round(progress * 100)}%</span>
          </>
        ) : null}
      </button>
      {url && !running ? (
        <button
          type="button"
          onClick={() => onFile(null)}
          className="mt-2 w-full text-center text-[12px] text-ink-mute transition-colors hover:text-white"
        >
          Remove
        </button>
      ) : (
        <p className="mt-2 text-center text-[12px] text-ink-mute">{running ? 'Uploading cover' : 'JPG, PNG, or WebP'}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) arm()
          onFile(file ?? null)
          event.target.value = ''
        }}
      />
    </div>
  )
}

function WaterFill({ progress }: { progress: number }) {
  const level = Math.max(0, Math.min(1, progress))
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <span className="absolute inset-x-0 bottom-0" style={{ height: `${level * 100}%` }}>
        <span className="absolute inset-0 bg-linear-to-t from-rose-700/85 via-rose-500/70 to-rose-400/45" />
        <motion.span
          className="absolute -top-3 left-0 block h-4 w-[200%]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 120 16" preserveAspectRatio="none" className="size-full">
            <path
              d="M0 10 C10 4 20 16 30 10 C40 4 50 16 60 10 C70 4 80 16 90 10 C100 4 110 16 120 10 V16 H0 Z"
              fill="rgba(251,113,133,0.95)"
            />
          </svg>
        </motion.span>
        <motion.span
          className="absolute -top-2 left-0 block h-3 w-[200%] opacity-70"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 3.1, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 120 12" preserveAspectRatio="none" className="size-full">
            <path
              d="M0 7 C12 2 18 12 30 7 C42 2 48 12 60 7 C72 2 78 12 90 7 C102 2 108 12 120 7 V12 H0 Z"
              fill="rgba(255,255,255,0.28)"
            />
          </svg>
        </motion.span>
      </span>
    </span>
  )
}

function ReleaseDateField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const selected = value ? dateFromInput(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(fieldClass, 'flex items-center justify-between text-left', !value && 'text-ink-mute')}
      >
        <span>{selected ? format(selected, 'MMM d, yyyy') : 'Pick a date'}</span>
        <CalendarBlank size={16} className="text-ink-mute" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto bg-[#121214] p-0 text-white ring-white/15">
        <Calendar
          mode="single"
          selected={selected}
          disabled={{ before: startOfToday() }}
          onSelect={(date) => {
            onChange(date ? dateToInput(date) : '')
            setOpen(false)
          }}
          className="bg-[#121214] text-white [&_button]:text-white [&_button:hover]:bg-white/10 [&_button:hover]:text-white [&_button[data-selected-single=true]]:bg-rose-500 [&_button[data-selected-single=true]]:text-white [&_button[data-selected-single=true]:hover]:bg-rose-400"
          classNames={{
            caption_label: 'text-sm font-medium text-white',
            weekday: 'flex-1 text-[0.8rem] font-normal text-ink-mute',
            today: 'rounded-lg bg-white/10 text-white',
            outside: 'text-ink-faint',
            disabled: 'text-ink-faint opacity-40',
          }}
          components={{
            DayButton: (props) => (
              <CalendarDayButton
                {...props}
                className="text-white hover:bg-white/10 hover:text-white data-[selected-single=true]:bg-rose-500 data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-rose-400 data-[selected-single=true]:hover:text-white"
              />
            ),
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-ink-2">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

function MultiSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  options: readonly string[]
}) {
  function toggle(option: string, checked: boolean) {
    onChange(checked ? [...value, option] : value.filter((item) => item !== option))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(fieldClass, 'flex items-center justify-between gap-2 text-left', value.length === 0 && 'text-ink-mute')}
      >
        <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {value.length === 0 ? (
            placeholder
          ) : (
            value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[12px] font-medium text-white"
              >
                {item}
                <span
                  role="button"
                  aria-label={`Remove ${item}`}
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onChange(value.filter((current) => current !== item))
                  }}
                  className="grid size-3.5 place-items-center"
                >
                  <X size={10} weight="bold" />
                </span>
              </span>
            ))
          )}
        </span>
        <CaretDown size={14} className="shrink-0 text-ink-mute" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[rgba(16,16,18,0.96)] p-1.5 text-white ring-white/15">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={value.includes(option)}
            closeOnClick={false}
            onCheckedChange={(checked) => toggle(option, checked)}
            className="cursor-pointer rounded-lg py-2 pr-8 pl-2.5 text-[13px] text-ink-2 focus:bg-white/8 focus:text-white focus:**:text-white data-checked:text-white"
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: readonly string[]
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(fieldClass, 'cursor-pointer', !value && 'text-ink-mute')}
    >
      <option value="" className="bg-[#121214] text-ink-mute">
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-[#121214] text-white">
          {option}
        </option>
      ))}
    </select>
  )
}

let activeClip: HTMLAudioElement | null = null

function FileSlot({
  icon,
  label,
  hint,
  file,
  extra,
  accept,
  playable = false,
  onFile,
}: {
  icon: ReactNode
  label: string
  hint: string
  file: File | null
  extra?: string
  accept: string
  playable?: boolean
  onFile: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [over, setOver] = useState(false)
  const [playingFile, setPlayingFile] = useState<File | null>(null)
  const filled = Boolean(file)
  const { progress, running, arm } = useUploadMotion(Boolean(file))
  const canPlay = playable && Boolean(file) && !running
  const playing = playingFile === file

  useEffect(() => {
    if (!playable || !file) return
    const url = URL.createObjectURL(file)
    const audio = new Audio(url)
    audioRef.current = audio
    const onStop = () => setPlayingFile((current) => (current === file ? null : current))
    const onPlay = () => setPlayingFile(file)
    audio.addEventListener('pause', onStop)
    audio.addEventListener('ended', onStop)
    audio.addEventListener('play', onPlay)
    return () => {
      audio.removeEventListener('pause', onStop)
      audio.removeEventListener('ended', onStop)
      audio.removeEventListener('play', onPlay)
      audio.pause()
      URL.revokeObjectURL(url)
      if (activeClip === audio) activeClip = null
      audioRef.current = null
    }
  }, [file, playable])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      audio.pause()
      return
    }
    if (activeClip && activeClip !== audio) activeClip.pause()
    activeClip = audio
    void audio.play()
  }

  function take(list: FileList | null) {
    const next = list?.[0] ?? null
    if (next) arm()
    onFile(next)
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setOver(false)
    take(event.dataTransfer.files)
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        'relative flex items-center gap-3 overflow-hidden rounded-2xl border border-dashed px-4 py-4 transition-colors',
        running
          ? 'border-solid border-rose-400 bg-rose-500/10'
          : over
            ? 'border-rose-400 bg-rose-500/10'
            : 'border-white/15 bg-white/5 hover:border-white/30',
      )}
    >
      {canPlay ? (
        <button
          type="button"
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          onClick={togglePlay}
          className="grid size-12 shrink-0 place-items-center rounded-lg bg-white text-black"
        >
          {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" className="ml-0.5" />}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {canPlay ? null : (
          <span className="relative grid size-12 shrink-0 place-items-center rounded-lg bg-white/8 text-ink-2">
            {icon}
            {running ? (
              <span className="absolute inset-1 animate-spin rounded-full border-2 border-white/15 border-t-rose-400" />
            ) : null}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-medium text-white">{label}</span>
          <span className="mt-0.5 block min-w-0 text-[12px] leading-relaxed text-ink-mute">
            {running ? (
              <span className="text-rose-300 tnum">Uploading {Math.round(progress * 100)}%</span>
            ) : filled ? (
              <>
                <span className="line-clamp-2 text-ink-2">{file?.name}</span>
                {extra ? <span className="mt-0.5 block text-ink-mute tnum">{extra}</span> : null}
              </>
            ) : (
              hint
            )}
          </span>
        </span>
      </button>
      {filled && !running ? (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={() => onFile(null)}
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          take(event.target.files)
          event.target.value = ''
        }}
      />
      {running ? (
        <span className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
          <span className="block h-full bg-rose-500" style={{ width: `${progress * 100}%` }} />
        </span>
      ) : null}
    </div>
  )
}

function describeKit(name: string, type: string) {
  const kind = type || 'sound kit'
  const lines = [
    `${name} is a ${kind.toLowerCase()} built for quick drops. Clean files, ready to load.`,
    `${name} packs production-ready sounds with room left for your own arrangement.`,
    `Inside ${name}: focused ${kind.toLowerCase()} material you can write on without digging.`,
  ]
  return lines[Math.floor(Math.random() * lines.length)] ?? lines[0]
}

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function dateFromInput(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function dateToInput(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function hasExtension(file: File, extensions: string[]) {
  const name = file.name.toLowerCase()
  return extensions.some((extension) => name.endsWith(extension))
}

function nameFromFile(file: File) {
  return file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const remain = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remain).padStart(2, '0')}`
}
