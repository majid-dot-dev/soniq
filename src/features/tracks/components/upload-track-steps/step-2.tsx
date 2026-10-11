import { SparkleIcon } from '@phosphor-icons/react'
import {
  CoverPicker,
  Field,
  ReleaseDateField,
  Select,
  fieldClass,
  trackTypes,
  visibilities,
} from '@/features/tracks/components/upload-track-steps/shared'
import { cn } from '@/lib/utils'

export default function UploadTrackStep2({
  coverUrl,
  uploadingCover,
  title,
  about,
  trackType,
  visibility,
  releaseDate,
  writing,
  onCover,
  onTitle,
  onAbout,
  onTrackType,
  onVisibility,
  onReleaseDate,
  onGenerateDescription,
}: {
  coverUrl: string | null
  uploadingCover: boolean
  title: string
  about: string
  trackType: string
  visibility: (typeof visibilities)[number]
  releaseDate: string
  writing: boolean
  onCover: (file: File | null) => void
  onTitle: (value: string) => void
  onAbout: (value: string) => void
  onTrackType: (value: string) => void
  onVisibility: (value: (typeof visibilities)[number]) => void
  onReleaseDate: (value: string) => void
  onGenerateDescription: () => void
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <CoverPicker url={coverUrl} uploading={uploadingCover} onFile={onCover} />
      <div className="grid min-w-0 flex-1 gap-5">
        <Field label="Title">
          <input
            value={title}
            onChange={(event) => onTitle(event.target.value)}
            placeholder="Half Light"
            className={fieldClass}
          />
        </Field>
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-medium text-ink-2">Description</span>
            <button
              type="button"
              onClick={onGenerateDescription}
              disabled={writing}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white/8 px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-white/12 disabled:opacity-60"
            >
              <SparkleIcon size={13} weight="fill" className={writing ? 'animate-pulse' : undefined} />
              {writing ? 'Writing' : 'Generate'}
            </button>
          </div>
          <p className="mt-0.5 text-[12px] text-ink-mute">What a buyer should know before they play it.</p>
          <textarea
            value={about}
            onChange={(event) => onAbout(event.target.value)}
            rows={5}
            placeholder="Soft keys and a patient log line."
            className={cn(fieldClass, 'mt-2 resize-none leading-relaxed')}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Track type">
            <Select value={trackType} onChange={onTrackType} placeholder="Track type" options={trackTypes} />
          </Field>
          <Field label="Visibility">
            <Select
              value={visibility}
              onChange={(value) => onVisibility(value as (typeof visibilities)[number])}
              placeholder="Visibility"
              options={visibilities}
            />
          </Field>
          <div className="sm:col-span-2">
            <div>
              <span className="text-[12px] font-medium text-ink-2">Release date</span>
              <p className="mt-0.5 text-[12px] text-ink-mute">Leave this empty to release when you publish.</p>
              <div className="mt-2">
                <ReleaseDateField value={releaseDate} onChange={onReleaseDate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
