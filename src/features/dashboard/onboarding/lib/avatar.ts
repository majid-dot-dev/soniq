const MAX_SOURCE_BYTES = 8 * 1024 * 1024
const OUTPUT_SIZE = 512
const OUTPUT_QUALITY = 0.82
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Use a JPG, PNG, or WebP image')
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Image must be under 8MB')
  }

  const bitmap = await createImageBitmap(file)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not process image')

    const scale = Math.max(OUTPUT_SIZE / bitmap.width, OUTPUT_SIZE / bitmap.height)
    const drawW = bitmap.width * scale
    const drawH = bitmap.height * scale
    const dx = (OUTPUT_SIZE - drawW) / 2
    const dy = (OUTPUT_SIZE - drawH) / 2

    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
    ctx.drawImage(bitmap, dx, dy, drawW, drawH)

    const dataUrl = canvas.toDataURL('image/jpeg', OUTPUT_QUALITY)
    if (dataUrl.length > 900_000) {
      throw new Error('Image is too large after compression — try another photo')
    }
    return dataUrl
  } finally {
    bitmap.close()
  }
}
