import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { CalendarBlank, CaretDown, ImageSquare, Pause, Play, X } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { motion } from 'motion/react'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export const fieldClass =
  'w-full rounded-xl bg-white/8 px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-ink-mute'

export const trackTypes = ['Beat', 'Beat with hook', 'Song', 'Top line'] as const
export const visibilities = ['Private', 'Public', 'Unlisted'] as const

export type TaxonomyOption = {
  id: string
  label: string
}

export type LicenseOffer = {
  id: string
  name: string
  detail: string
  kind: 'lease' | 'exclusive' | 'free' | 'royalty-free'
  price: string
  enabled: boolean
  needsStems: boolean
  isFree: boolean
  minOfferCents: number | null
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-ink-2">{label}</span>
      {hint ? <span className="mt-0.5 block text-[12px] text-ink-mute">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

export function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: readonly string[] | readonly TaxonomyOption[]
}) {
  const normalized = options.map((option) =>
    typeof option === 'string' ? { id: option, label: option } : option,
  )
  const selectedLabel = normalized.find((option) => option.id === value)?.label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(fieldClass, 'flex items-center justify-between gap-2 text-left', !value && 'text-ink-mute')}
      >
        <span className="min-w-0 truncate">{selectedLabel ?? placeholder}</span>
        <CaretDown size={14} className="shrink-0 text-ink-mute" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={menuPanelClass}>
        {normalized.map((option) => (
          <TaxonomyMenuItem
            key={option.id}
            label={option.label}
            checked={value === option.id}
            onCheckedChange={(checked) => {
              if (checked) onChange(option.id)
            }}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MultiSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  options: readonly string[] | readonly TaxonomyOption[]
}) {
  const normalized = options.map((option) =>
    typeof option === 'string' ? { id: option, label: option } : option,
  )
  const labelById = new Map(normalized.map((option) => [option.id, option.label]))

  function toggle(optionId: string, checked: boolean) {
    onChange(checked ? [...value, optionId] : value.filter((item) => item !== optionId))
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
                {labelById.get(item) ?? item}
                <span
                  role="button"
                  aria-label={`Remove ${labelById.get(item) ?? item}`}
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
      <DropdownMenuContent className={menuPanelClass}>
        {normalized.map((option) => (
          <TaxonomyMenuItem
            key={option.id}
            label={option.label}
            checked={value.includes(option.id)}
            closeOnClick={false}
            onCheckedChange={(checked) => toggle(option.id, checked)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const menuPanelClass =
  'max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-[rgba(18,18,20,0.72)] p-1.5 text-ink shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] ring-0 backdrop-blur-2xl backdrop-saturate-150'

const menuEase = [0.16, 1, 0.3, 1] as const

function TaxonomyMenuItem({
  label,
  checked,
  closeOnClick,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  closeOnClick?: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const [hot, setHot] = useState(false)

  return (
    <DropdownMenuCheckboxItem
      checked={checked}
      closeOnClick={closeOnClick}
      onCheckedChange={onCheckedChange}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      className="relative cursor-pointer overflow-hidden rounded-lg bg-transparent py-2 pr-8 pl-2.5 text-[13px] focus:bg-transparent data-highlighted:bg-transparent"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-white/10"
        initial={false}
        animate={{ opacity: hot ? 1 : 0 }}
        transition={{ duration: 0.32, ease: menuEase }}
      />
      <motion.span
        className="relative"
        initial={false}
        animate={{
          color: hot || checked ? 'rgb(255, 255, 255)' : 'rgb(205, 195, 174)',
          x: hot ? 3 : 0,
        }}
        transition={{ duration: 0.32, ease: menuEase }}
      >
        {label}
      </motion.span>
    </DropdownMenuCheckboxItem>
  )
}

export function CoverPicker({
  url,
  uploading,
  onFile,
}: {
  url: string | null
  uploading?: boolean
  onFile: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const running = Boolean(uploading)

  return (
    <div className="mx-auto w-36 shrink-0 sm:mx-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={running}
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
            <WaterFill progress={0.55} />
            <span className="relative text-[12px] font-medium text-white">Uploading…</span>
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
        disabled={running}
        onChange={(event) => {
          const file = event.target.files?.[0]
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

export function ReleaseDateField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
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

let activeClip: HTMLAudioElement | null = null

export function FileSlot({
  icon,
  label,
  hint,
  file,
  fileLabel,
  extra,
  preview,
  accept,
  playable = false,
  uploading = false,
  onFile,
  className,
}: {
  icon: ReactNode
  label: string
  hint: string
  file: File | null
  fileLabel?: string
  extra?: string
  preview?: string | null
  accept: string
  playable?: boolean
  uploading?: boolean
  onFile: (file: File | null) => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [over, setOver] = useState(false)
  const [playingFile, setPlayingFile] = useState<File | null>(null)
  const filled = Boolean(file || fileLabel || preview)
  const running = Boolean(uploading)
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
    onFile(list?.[0] ?? null)
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
        className,
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
        disabled={running}
        className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:pointer-events-none"
      >
        {canPlay ? null : preview ? (
          <img src={preview} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
        ) : (
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
              <span className="text-rose-300">Uploading to storage…</span>
            ) : filled ? (
              <>
                <span className="line-clamp-2 text-ink-2">{file?.name ?? fileLabel}</span>
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
        disabled={running}
        onChange={(event) => {
          take(event.target.files)
          event.target.value = ''
        }}
      />
      {running ? (
        <span className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-white/10">
          <motion.span
            className="block h-full w-1/3 bg-rose-500"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />
        </span>
      ) : null}
    </div>
  )
}

export function hasExtension(file: File, extensions: string[]) {
  const name = file.name.toLowerCase()
  return extensions.some((extension) => name.endsWith(extension))
}

export function nameFromFile(file: File) {
  return file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const remain = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remain).padStart(2, '0')}`
}

export function describeTrack(name: string) {
  const lines = [
    `${name} sits on a patient groove, with room left for a verse.`,
    `${name} is a late-night sketch. The drums stay dry so a vocal can sit forward.`,
    `Soft keys under ${name}. Built for a hook that does not rush.`,
    `${name} leaves space in the middle. Easy to write on, hard to talk over.`,
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
