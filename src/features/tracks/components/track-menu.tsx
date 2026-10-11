import type { MouseEvent } from 'react'
import {
  Archive,
  Copy,
  DownloadSimple,
  Info,
  DotsThree,
  DotsThreeVertical,
  PencilSimple,
  RocketLaunch,
  Trash,
} from '@phosphor-icons/react'
import type { BeatStatus } from '@/features/dashboard/beats'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const itemClass =
  'cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-2 focus:bg-white/8 focus:text-white'

export function TrackMenu({
  status,
  vertical = false,
  onAbout,
  onEdit,
  onPublish,
  onArchive,
  onCopyLink,
  onDownload,
  onDelete,
}: {
  status: BeatStatus
  vertical?: boolean
  onAbout?: () => void
  onEdit?: () => void
  onPublish?: () => void
  onArchive?: () => void
  onCopyLink?: () => void
  onDownload?: () => void
  onDelete?: () => void
}) {
  function run(handler?: () => void) {
    return (event: MouseEvent) => {
      event.stopPropagation()
      handler?.()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Track options"
        className="grid size-8 shrink-0 place-items-center rounded-full text-ink-mute outline-none transition-colors hover:bg-white/10 hover:text-white data-popup-open:bg-white/10 data-popup-open:text-white"
        onClick={(event) => event.stopPropagation()}
      >
        {vertical ? <DotsThreeVertical size={18} weight="bold" /> : <DotsThree size={18} weight="bold" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-48 rounded-xl border border-white/10 bg-[rgba(18,18,20,0.72)] p-1.5 text-ink shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] ring-0 backdrop-blur-2xl backdrop-saturate-150"
      >
        <DropdownMenuItem onClick={run(onEdit)} className={itemClass}>
          <PencilSimple size={15} />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={run(onAbout)} className={itemClass}>
          <Info size={15} />
          About track
        </DropdownMenuItem>

        {status === 'Draft' || status === 'Live' ? (
          <>
            <DropdownMenuSeparator className="mx-1 my-1.5 bg-white/10" />
            {status === 'Draft' ? (
              <DropdownMenuItem onClick={run(onPublish)} className={itemClass}>
                <RocketLaunch size={15} />
                Publish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={run(onArchive)} className={itemClass}>
                <Archive size={15} />
                Archive
              </DropdownMenuItem>
            )}
          </>
        ) : null}

        <DropdownMenuSeparator className="mx-1 my-1.5 bg-white/10" />
        <DropdownMenuItem onClick={run(onCopyLink)} className={itemClass}>
          <Copy size={15} />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={run(onDownload)} className={itemClass}>
          <DownloadSimple size={15} />
          Download master
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-1 my-1.5 bg-white/10" />
        <DropdownMenuItem
          onClick={run(onDelete)}
          // variant="destructive"
          className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-rose-300 focus:bg-rose-500/12 focus:text-rose-300"
        >
          <Trash size={15} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TrackMenu