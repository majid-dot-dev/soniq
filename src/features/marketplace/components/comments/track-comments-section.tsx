import { useState } from 'react'
import CommentComposer from '@/features/marketplace/components/comments/comment-composer'
import CommentNode from '@/features/marketplace/components/comments/comment-node'
import {
  addComment,
  // countComments,
  getTrackComments,
  marketplaceViewer,
  type TrackComment,
} from '@/features/marketplace/data/track-comments'

export default function TrackCommentsSection({ trackId }: { trackId: string }) {
  const [thread, setThread] = useState(() => getTrackComments(trackId))
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
  // const commentCount = countComments(thread)

  function submitComment(parentId: string | null, body: string) {
    const next: TrackComment = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: marketplaceViewer,
      body,
      at: new Date().toISOString(),
      likes: 0,
      replies: [],
    }
    setThread((current) => addComment(current, parentId, next))
    setReplyTo(null)
  }

  return (
    <section id="track-comments" className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/8 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-medium tracking-[-0.02em] text-white">Comments</h2>
        {/* <p className="tnum shrink-0 text-[15px] font-semibold text-white">{commentCount}</p> */}
      </div>

      <div className="mt-6">
        <CommentComposer
          placeholder="Add a comment…"
          onSubmit={(body) => submitComment(null, body)}
        />
      </div>

      {thread.length === 0 ? (
        <p className="mt-4 text-[13px] text-ink-mute">No comments yet.</p>
      ) : (
        <ul className="mt-6">
          {thread.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              depth={0}
              replyTo={replyTo}
              likedComments={likedComments}
              onReply={(id) => setReplyTo((current) => (current === id ? null : id))}
              onSubmitReply={(parentId, body) => submitComment(parentId, body)}
              onToggleLike={(id) => setLikedComments((prev) => ({ ...prev, [id]: !prev[id] }))}
              onCancelReply={() => setReplyTo(null)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}