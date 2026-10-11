import { api } from '@/lib/api/client'

export const UPLOAD_KINDS = ['avatars', 'covers', 'tracks', 'kits', 'attachments'] as const
export type UploadKind = (typeof UPLOAD_KINDS)[number]

type SignResponse = {
  bucket: string
  key: string
  uploadUrl: string
  headers: Record<string, string>
  expiresIn: number
}

export type UploadedObject = {
  bucket: string
  key: string
  contentType: string
  byteSize: number
}

const EXT_MIME: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  wave: 'audio/wav',
  flac: 'audio/flac',
  aiff: 'audio/aiff',
  aif: 'audio/aiff',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  zip: 'application/zip',
}

export function mimeForFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const fromExt = EXT_MIME[ext]
  const raw = file.type.trim().toLowerCase()
  if (!raw || raw === 'application/octet-stream') {
    return fromExt ?? 'application/octet-stream'
  }
  // Prefer known extension mapping when the browser guesses oddly (e.g. audio/wave).
  if (fromExt && (ext === 'wav' || ext === 'wave' || ext === 'mp3')) {
    return fromExt
  }
  return raw
}

/**
 * Sign → PUT to S3. Verification happens when the track is created/attached
 * (server HEADs the object) — no separate confirm round-trip.
 */
export async function uploadFileToStorage(input: {
  kind: UploadKind
  file: File
}): Promise<UploadedObject> {
  const contentType = mimeForFile(input.file)
  const { data: signed } = await api.post<SignResponse>('/api/v1/uploads', {
    kind: input.kind,
    filename: input.file.name,
    contentType,
    byteSize: input.file.size,
  })

  const put = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: signed.headers,
    body: input.file,
  })

  if (!put.ok) {
    throw new Error(`Upload failed (${put.status})`)
  }

  return {
    bucket: signed.bucket,
    key: signed.key,
    contentType,
    byteSize: input.file.size,
  }
}
