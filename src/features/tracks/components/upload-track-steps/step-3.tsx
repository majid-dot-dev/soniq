import { X } from '@phosphor-icons/react'
import {
  Field,
  MultiSelect,
  Select,
  fieldClass,
  type TaxonomyOption,
} from '@/features/tracks/components/upload-track-steps/shared'
import { cn } from '@/lib/utils'

export default function UploadTrackStep3({
  genre,
  mood,
  bpm,
  keyName,
  instrument,
  tags,
  tagDraft,
  genreOptions,
  moodOptions,
  keyOptions,
  instrumentOptions,
  onGenre,
  onMood,
  onBpm,
  onKeyName,
  onInstrument,
  onTags,
  onTagDraft,
  onAddTag,
}: {
  genre: string[]
  mood: string[]
  bpm: string
  keyName: string
  instrument: string[]
  tags: string[]
  tagDraft: string
  genreOptions: TaxonomyOption[]
  moodOptions: TaxonomyOption[]
  keyOptions: TaxonomyOption[]
  instrumentOptions: TaxonomyOption[]
  onGenre: (value: string[]) => void
  onMood: (value: string[]) => void
  onBpm: (value: string) => void
  onKeyName: (value: string) => void
  onInstrument: (value: string[]) => void
  onTags: (value: string[]) => void
  onTagDraft: (value: string) => void
  onAddTag: (raw: string) => void
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <span className="text-[12px] font-medium text-ink-2">Genre</span>
        <div className="mt-2">
          <MultiSelect
            value={genre}
            onChange={onGenre}
            placeholder="Genre"
            options={genreOptions}
          />
        </div>
      </div>
      <div>
        <span className="text-[12px] font-medium text-ink-2">Mood</span>
        <div className="mt-2">
          <MultiSelect value={mood} onChange={onMood} placeholder="Mood" options={moodOptions} />
        </div>
      </div>
      <Field label="BPM">
        <input
          inputMode="numeric"
          value={bpm}
          onChange={(event) => onBpm(event.target.value.replace(/[^\d]/g, '').slice(0, 3))}
          placeholder="96"
          className={cn(fieldClass, 'tnum')}
        />
      </Field>
      <Field label="Key">
        <Select value={keyName} onChange={onKeyName} placeholder="Key" options={keyOptions} />
      </Field>
      <div className="sm:col-span-2">
        <span className="text-[12px] font-medium text-ink-2">Instruments</span>
        <div className="mt-2">
          <MultiSelect
            value={instrument}
            onChange={onInstrument}
            placeholder="Instruments"
            options={instrumentOptions}
          />
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
              onClick={() => onTags(tags.filter((item) => item !== tag))}
              className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[12px] font-medium text-white"
            >
              #{tag}
              <X size={12} weight="bold" />
            </button>
          ))}
          {tags.length < 3 ? (
            <input
              value={tagDraft}
              onChange={(event) => onTagDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault()
                  onAddTag(tagDraft)
                }
              }}
              onBlur={() => onAddTag(tagDraft)}
              placeholder={tags.length ? 'Add another' : 'e.g. wizkid type'}
              className="min-w-32 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-ink-mute"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}