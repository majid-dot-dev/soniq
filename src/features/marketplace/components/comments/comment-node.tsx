import { useEffect, useRef } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
import { AnimatePresence, motion } from 'motion/react'
import { HeartIcon, SealCheckIcon } from '@phosphor-icons/react'
import CommentComposer from '@/features/marketplace/components/comments/comment-composer'
import type { TrackComment } from '@/features/marketplace/data/track-comments'
import { cn } from '@/lib/utils'

const COMMENT_GAP = 'gap-2.5'
const MAX_COMMENT_DEPTH = 3
const EASE = [0.22, 1, 0.36, 1] as const

export default function CommentNode({
  comment,
  depth,
  replyTo,
  likedComments,
  onReply,
  onSubmitReply,
  onToggleLike,
  onCancelReply,
}: {
  comment: TrackComment
  depth: number
  replyTo: string | null
  likedComments: Record<string, boolean>
  onReply: (id: string) => void
  onSubmitReply: (parentId: string, body: string) => void
  onToggleLike: (id: string) => void
  onCancelReply: () => void
}) {
  const replyRef = useRef<HTMLDivElement>(null)
  const liked = !!likedComments[comment.id]
  const likes = comment.likes + (liked ? 1 : 0)
  const isReplying = replyTo === comment.id
  const canNest = depth < MAX_COMMENT_DEPTH
  const hasReplies = comment.replies.length > 0
  const isTopLevel = depth === 0

  useEffect(() => {
    if (!isReplying) return

    function onPointerDown(event: PointerEvent) {
      if (replyRef.current?.contains(event.target as Node)) return
      onCancelReply()
    }

    const id = window.setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown)
    }, 0)

    return () => {
      window.clearTimeout(id)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isReplying, onCancelReply])

  return (
    <li className={cn('min-w-0', isTopLevel ? 'py-4' : '')}>
      <div className={cn('flex items-start', COMMENT_GAP)}>
        <img
          src={comment.author.avatar}
          alt=""
          className="size-8 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-none">
            <span className="text-[13px] font-medium text-white">{comment.author.name}</span>
            {comment.author.verified ? (
              <SealCheckIcon size={12} weight="fill" className="shrink-0 text-sky-400" />
            ) : null}
            <span className="text-[12px] text-ink-mute">@{comment.author.username}</span>
            <span className="text-[11px] text-ink-faint">
              · {formatDistanceToNowStrict(new Date(comment.at), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{comment.body}</p>

          <div className="-ml-1.5 mt-1.5 flex items-center">
            <button
              type="button"
              onClick={() => onToggleLike(comment.id)}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1 rounded-full px-1.5 py-1 text-[12px] transition-colors',
                liked
                  ? 'text-rose-300'
                  : 'text-ink-mute hover:bg-white/6 hover:text-white',
              )}
            >
              <HeartIcon size={13} weight={liked ? 'fill' : 'regular'} />
              <span className="tnum">{likes}</span>
            </button>
            <button
              type="button"
              onClick={() => onReply(comment.id)}
              className={cn(
                'cursor-pointer rounded-full px-1.5 py-1 text-[12px] font-medium transition-colors',
                isReplying
                  ? 'text-white'
                  : 'text-ink-mute hover:bg-white/6 hover:text-white',
              )}
            >
              Reply
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isReplying ? (
              <motion.div
                ref={replyRef}
                key="reply"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="mt-3"
              >
                <CommentComposer
                  placeholder={`Reply to @${comment.author.username}…`}
                  onSubmit={(body) => onSubmitReply(comment.id, body)}
                  onCancel={onCancelReply}
                  autoFocus
                  compact
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {hasReplies ? (
            <ul
              className={cn(
                'mt-3 flex flex-col gap-3',
                canNest && 'border-l border-white/10 pl-3',
              )}
            >
              {comment.replies.map((reply) => (
                <CommentNode
                  key={reply.id}
                  comment={reply}
                  depth={canNest ? depth + 1 : depth}
                  replyTo={replyTo}
                  likedComments={likedComments}
                  onReply={onReply}
                  onSubmitReply={onSubmitReply}
                  onToggleLike={onToggleLike}
                  onCancelReply={onCancelReply}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  )
}
