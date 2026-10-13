import type { RefObject } from 'react'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function SearchForm({
  className,
  autoFocus,
  inputRef,
  onDone,
  onCancel,
}: {
  className?: string
  autoFocus?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  onDone?: () => void
  onCancel?: () => void
}) {
  const navigate = useNavigate()

  return (
    <form
      className={cn(
        'flex min-w-0 items-center gap-2 rounded-full bg-white/8 px-3.5 py-2',
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const q = String(data.get('q') ?? '').trim()
        navigate(q ? `/marketplace?q=${encodeURIComponent(q)}` : '/marketplace')
        onDone?.()
      }}
    >
      <MagnifyingGlassIcon size={16} className="shrink-0 text-ink-mute" />
      <input
        ref={inputRef}
        name="q"
        type="search"
        autoFocus={autoFocus}
        placeholder="Search beats, producers, tags"
        className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-ink-mute"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onCancel?.()
        }}
      />
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close search"
          className="grid size-6 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/10 hover:text-white"
        >
          <XIcon size={14} />
        </button>
      ) : null}
    </form>
  )
}
