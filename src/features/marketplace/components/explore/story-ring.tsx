import { cn } from '@/lib/utils'
import { storyInitials, type ExploreStory } from './types'

export function StoryRing({
  story,
  active,
  onSelect,
}: {
  story: ExploreStory
  active: boolean
  onSelect: () => void
}) {
  const unseen = !story.seen

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-[76px] shrink-0 flex-col items-center gap-2 outline-none"
    >
      <span
        className={cn(
          'grid size-[68px] place-items-center rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-[1.04] group-active:scale-[0.98]',
          unseen
            ? 'bg-[linear-gradient(135deg,#fb7185_0%,#e11d48_45%,#9f1239_100%)]'
            : 'bg-white/15',
          active && 'ring-2 ring-white/40 ring-offset-2 ring-offset-transparent',
        )}
      >
        <span
          className={cn(
            'grid size-full place-items-center rounded-full border-[2.5px] border-[#141216] text-[13px] font-semibold tracking-tight text-white',
            story.cover,
          )}
        >
          {storyInitials(story.name)}
        </span>
      </span>
      <span className="w-full truncate text-center text-[12px] font-medium text-ink-2 group-hover:text-white">
        {story.name}
      </span>
    </button>
  )
}
