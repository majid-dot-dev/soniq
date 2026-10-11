import type { ReactNode, RefObject } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function ScrollerNav({
  canPrev,
  canNext,
  onPrev,
  onNext,
  className,
}: {
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  className?: string
}) {
  return (
    <div className={cn('hidden items-center gap-1 md:flex', className)}>
      <button
        type="button"
        aria-label="Scroll left"
        disabled={!canPrev}
        onClick={onPrev}
        className={cn(
          'grid size-8 cursor-pointer place-items-center rounded-full text-ink-2 transition-colors',
          'hover:bg-white/8 hover:text-white',
          'disabled:pointer-events-none disabled:opacity-25',
        )}
      >
        <CaretLeftIcon size={16} weight="bold" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        disabled={!canNext}
        onClick={onNext}
        className={cn(
          'grid size-8 cursor-pointer place-items-center rounded-full text-ink-2 transition-colors',
          'hover:bg-white/8 hover:text-white',
          'disabled:pointer-events-none disabled:opacity-25',
        )}
      >
        <CaretRightIcon size={16} weight="bold" />
      </button>
    </div>
  )
}

export default function HorizontalScroller({
  scrollerRef,
  children,
  className,
  contentClassName,
  'aria-label': ariaLabel = 'Scrollable list',
}: {
  scrollerRef: RefObject<HTMLDivElement | null>
  children: ReactNode
  className?: string
  contentClassName?: string
  'aria-label'?: string
}) {
  return (
    <div
      ref={scrollerRef}
      aria-label={ariaLabel}
      className={cn(
        '-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:-mx-6 lg:px-6 [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      <div className={cn('flex w-max pb-1', contentClassName)}>{children}</div>
    </div>
  )
}
