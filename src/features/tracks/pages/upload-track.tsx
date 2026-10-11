import { useNavigate } from 'react-router-dom'
import { UploadTrackForm } from '@/features/tracks/components/upload-track-form'

export default function UploadTrackPage() {
  const navigate = useNavigate()

  return (
    <UploadTrackForm
      onCancel={() => navigate('/tracks')}
      onComplete={() => navigate('/tracks')}
    />
  )
}
