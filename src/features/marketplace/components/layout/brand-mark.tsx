import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function BrandMark({
  compact,
  size = 'default',
  className,
}: {
  compact?: boolean
  /** Header chrome uses a quieter mark; sidebar keeps the fuller brand size. */
  size?: 'default' | 'header'
  className?: string
}) {
  return (
    <Link
      to="/marketplace"
      className={cn(
        'font-semibold tracking-[-0.02em] text-white',
        compact
          ? 'text-[18px]'
          : size === 'header'
            ? 'text-[16px] sm:text-[17px]'
            : 'text-[20px] sm:text-[22px]',
        className,
      )}
      title="SoundSoniq"
    >
      {compact ? (
        <>
          S<span className="text-rose-500">S</span>
        </>
      ) : (
        <>
          Sound<span className="text-rose-500">Soniq</span>
        </>
      )}
    </Link>
  )
}
