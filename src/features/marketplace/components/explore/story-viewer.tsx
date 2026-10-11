import { XIcon } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { storyInitials, type ExploreStory } from './types'

export function StoryViewer({
  story,
  open,
  onClose,
  onNext,
  onPrev,
}: {
  story: ExploreStory | null
  open: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/70 backdrop-blur-md"
        className={cn(
          'flex h-[min(640px,calc(100svh-2rem))] w-full max-w-[360px] flex-col gap-0 overflow-hidden rounded-[1.5rem] p-0 text-white ring-0 sm:max-w-[360px]',
          story?.cover ?? 'bg-neutral-900',
        )}
      >
        {story ? (
          <>
            <DialogTitle className="sr-only">{story.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Story from {story.name}. Tap left or right to switch creators.
            </DialogDescription>

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

            <div className="relative flex items-center gap-2.5 px-4 pt-4">
              <span className="grid size-9 place-items-center rounded-full bg-white/15 text-[11px] font-semibold text-white">
                {storyInitials(story.name)}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-white">
                {story.name}
              </span>
              <DialogClose
                aria-label="Close story"
                className="grid size-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <XIcon className="size-4" />
              </DialogClose>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-6">
              <p className="text-center text-[22px] font-medium tracking-[-0.02em] text-white">
                {story.name}
              </p>
            </div>

            <p className="relative px-6 pb-6 text-center text-[13px] text-white/70">
              Story content comes next — beats, drops, and updates from this creator.
            </p>

            <button
              type="button"
              aria-label="Previous story"
              className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-w-resize"
              onClick={onPrev}
            />
            <button
              type="button"
              aria-label="Next story"
              className="absolute inset-y-0 right-0 z-10 w-1/3 cursor-e-resize"
              onClick={onNext}
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
