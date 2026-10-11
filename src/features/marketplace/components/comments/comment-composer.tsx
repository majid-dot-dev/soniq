import { useState } from 'react'
import { marketplaceViewer } from '@/features/marketplace/data/track-comments'
import { cn } from '@/lib/utils'

const COMMENT_GAP = 'gap-2.5'

export default function CommentComposer({
  placeholder,
  onSubmit,
  onCancel,
  autoFocus = false,
  compact = false,
}: {
  placeholder: string
  onSubmit: (body: string) => void
  onCancel?: () => void
  autoFocus?: boolean
  compact?: boolean
}) {
  const [value, setValue] = useState('')

  function submit() {
    const body = value.trim()
    if (!body) return
    onSubmit(body)
    setValue('')
  }

  return (
    <div className={cn('flex items-center', COMMENT_GAP)}>
      <img
        src={marketplaceViewer.avatar}
        alt=""
        className="size-8 shrink-0 rounded-full object-cover"
      />
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
          if (e.key === 'Escape' && onCancel) onCancel()
        }}
        className="block min-w-0 flex-1 resize-none border-0 border-b border-white/12 bg-transparent py-1.5 text-[13px] leading-snug text-white outline-none transition-colors placeholder:text-ink-faint focus:border-white/35"
      />
      <button
        type="button"
        disabled={!value.trim()}
        onClick={submit}
        className="shrink-0 cursor-pointer rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-black transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {compact ? 'Reply' : 'Comment'}
      </button>
    </div>
  )
}
