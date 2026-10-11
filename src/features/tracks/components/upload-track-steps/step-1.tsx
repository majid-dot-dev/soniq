import { FileZipIcon, MusicNoteIcon, WaveformIcon } from '@phosphor-icons/react'
import { FileSlot } from '@/features/tracks/components/upload-track-steps/shared'
import type { TrackAssetSlot } from '@/features/tracks/types'

export default function UploadTrackStep1({
  master,
  tagged,
  stems,
  masterLabel,
  taggedLabel,
  stemsLabel,
  duration,
  uploadingSlot,
  onMaster,
  onTagged,
  onStems,
}: {
  master: File | null
  tagged: File | null
  stems: File | null
  masterLabel?: string
  taggedLabel?: string
  stemsLabel?: string
  duration: string
  uploadingSlot: TrackAssetSlot | null
  onMaster: (file: File | null) => void
  onTagged: (file: File | null) => void
  onStems: (file: File | null) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FileSlot
        className="sm:col-span-2"
        icon={<WaveformIcon size={18} />}
        label="Untagged master"
        hint="WAV or MP3. This is what the buyer downloads."
        file={master}
        fileLabel={masterLabel}
        extra={master || masterLabel ? duration : undefined}
        accept=".mp3,.wav,.wave,audio/mpeg,audio/wav"
        playable={Boolean(master)}
        uploading={uploadingSlot === 'master'}
        onFile={onMaster}
      />
      <FileSlot
        icon={<MusicNoteIcon size={18} />}
        label="Tagged preview"
        hint="Optional MP3. Leave it empty and the stream uses your voice tag."
        file={tagged}
        fileLabel={taggedLabel}
        accept=".mp3,audio/mpeg"
        playable={Boolean(tagged)}
        uploading={uploadingSlot === 'tagged'}
        onFile={onTagged}
      />
      <FileSlot
        icon={<FileZipIcon size={18} />}
        label="Stems"
        hint="Optional zip. Needed if you want to sell a stems lease."
        file={stems}
        fileLabel={stemsLabel}
        accept=".zip,application/zip"
        uploading={uploadingSlot === 'stems'}
        onFile={onStems}
      />
    </div>
  )
}
