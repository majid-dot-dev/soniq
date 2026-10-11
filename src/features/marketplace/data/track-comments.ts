export type TrackCommentAuthor = {
  name: string
  username: string
  avatar: string
  verified?: boolean
}

export type TrackComment = {
  id: string
  author: TrackCommentAuthor
  body: string
  at: string
  likes: number
  replies: TrackComment[]
}

/** Mock signed-in viewer used by the composer until marketplace auth lands. */
export const marketplaceViewer: TrackCommentAuthor = {
  name: 'Nao',
  username: 'nao',
  avatar: '/assets/avatar-2.jpg',
  verified: true,
}

const AUTHORS = {
  kelu: {
    name: 'Kelu',
    username: 'kelu',
    avatar: '/assets/avatar-1.jpg',
  },
  jules: {
    name: 'Jules',
    username: 'jules',
    avatar: '/assets/avatar-3.jpg',
    verified: true,
  },
  amara: {
    name: 'Amara',
    username: 'amara',
    avatar: '/assets/avatar-1.jpg',
    verified: true,
  },
  dewit: {
    name: 'Dëwit',
    username: 'dewit',
    avatar: '/assets/avatar-3.jpg',
  },
} as const satisfies Record<string, TrackCommentAuthor>

const SEEDS: Record<string, TrackComment[]> = {
  'night-market': [
    {
      id: 'nm-1',
      author: AUTHORS.kelu,
      body: 'That log drum bounce is illegal. Melodic top would sit perfect over the pads.',
      at: '2026-09-28T18:12:00',
      likes: 24,
      replies: [
        {
          id: 'nm-1r1',
          author: AUTHORS.jules,
          body: 'Appreciate it — leave space around the drop if you write to it.',
          at: '2026-09-28T18:40:00',
          likes: 11,
          replies: [
            {
              id: 'nm-1r1r1',
              author: AUTHORS.kelu,
              body: 'Already sketched a hook. Sending a rough when it’s cleaner.',
              at: '2026-09-28T19:05:00',
              likes: 4,
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 'nm-2',
      author: AUTHORS.amara,
      body: 'Club energy without sounding cheap. WAV lease incoming.',
      at: '2026-09-30T11:22:00',
      likes: 9,
      replies: [],
    },
    {
      id: 'nm-3',
      author: AUTHORS.dewit,
      body: 'Key / BPM labeled clean — makes writing so much faster. More like this.',
      at: '2026-10-02T09:48:00',
      likes: 6,
      replies: [],
    },
  ],
  'glass-city': [
    {
      id: 'gc-1',
      author: AUTHORS.jules,
      body: 'Guitar chops are radio-ready. Hearing a Wizkid-type topline already.',
      at: '2026-09-20T14:10:00',
      likes: 17,
      replies: [
        {
          id: 'gc-1r1',
          author: AUTHORS.dewit,
          body: 'That’s the vibe. Exclusive still open if you want the stems locked.',
          at: '2026-09-20T15:01:00',
          likes: 8,
          replies: [],
        },
      ],
    },
  ],
  'half-light': [
    {
      id: 'hl-1',
      author: AUTHORS.amara,
      body: 'Sunset Amapiano done right. Soft enough for vocals, still moves.',
      at: '2026-09-25T20:33:00',
      likes: 14,
      replies: [],
    },
  ],
  'iron-choir': [
    {
      id: 'ic-1',
      author: AUTHORS.kelu,
      body: 'Choir stabs hit hard. Perfect for a UK drill verse.',
      at: '2026-09-18T16:05:00',
      likes: 21,
      replies: [],
    },
    {
      id: 'ic-2',
      author: AUTHORS.jules,
      body: '808 slides are nasty. Taking the trackout.',
      at: '2026-09-19T08:44:00',
      likes: 7,
      replies: [],
    },
  ],
}

export function getTrackComments(trackId: string): TrackComment[] {
  const seed = SEEDS[trackId]
  return seed ? structuredClone(seed) : []
}

export function countComments(comments: TrackComment[]): number {
  return comments.reduce((sum, comment) => sum + 1 + countComments(comment.replies), 0)
}

export function addComment(
  comments: TrackComment[],
  parentId: string | null,
  next: TrackComment,
): TrackComment[] {
  if (parentId === null) return [...comments, next]
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return { ...comment, replies: [...comment.replies, next] }
    }
    if (comment.replies.length === 0) return comment
    return { ...comment, replies: addComment(comment.replies, parentId, next) }
  })
}
