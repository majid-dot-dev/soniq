import { useNavigate, useParams } from 'react-router-dom'
import { UploadTrackForm } from '@/features/tracks/components/upload-track-form'
import { useTrack } from '@/features/tracks/services'

export default function EditTrackPage() {
  const navigate = useNavigate()
  const { trackId } = useParams<{ trackId: string }>()
  const { data: track, isLoading, isError } = useTrack(trackId)

  if (isLoading) {
    return (
      <div className="grid h-full place-items-center px-5 text-[14px] text-ink-mute">
        Loading track…
      </div>
    )
  }

  if (isError || !track) {
    return (
      <div className="grid h-full place-items-center gap-3 px-5 text-center">
        <p className="text-[14px] text-ink-mute">This track could not be found.</p>
        <button
          type="button"
          onClick={() => navigate('/tracks')}
          className="text-[13px] font-medium text-white transition-colors hover:text-rose-300"
        >
          Back to tracks
        </button>
      </div>
    )
  }

  return (
    <UploadTrackForm
      initialTrack={track}
      onCancel={() => navigate('/tracks')}
      onComplete={() => navigate('/tracks')}
    />
  )
}
