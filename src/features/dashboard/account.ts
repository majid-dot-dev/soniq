import { beats, formatCompact } from '@/features/dashboard/beats'
import { defaultProfile, type ProfileSettings } from '@/features/dashboard/settings'

export type AccountTab = 'posts' | 'followers' | 'following'

export type AccountPerson = {
  id: string
  name: string
  username: string
  avatar: string
  role: string
  detail: string
  following: boolean
}

export type CommentAuthor = {
  name: string
  username: string
  avatar: string
  verified?: boolean
}

export type AccountComment = {
  id: string
  author: CommentAuthor
  body: string
  at: string
  likes: number
  replies: AccountComment[]
}

export type AccountPost = {
  id: string
  body: string
  at: string
  likes: number
  image?: string
  beatId?: string
  thread: AccountComment[]
}

export type AccountProfile = ProfileSettings & {
  cover: string
  joinedAt: string
  role: string
  verified: boolean
  postsCount: number
  followersCount: number
  followingCount: number
}

export const accountProfile: AccountProfile = {
  ...defaultProfile,
  cover: '/assets/hero-background.jpg',
  joinedAt: '2024-03-12',
  role: 'Producer',
  verified: true,
  postsCount: 18,
  followersCount: 2840,
  followingCount: 126,
}

const selfAuthor: CommentAuthor = {
  name: accountProfile.displayName,
  username: accountProfile.username,
  avatar: accountProfile.avatar,
  verified: accountProfile.verified,
}

export const accountPosts: AccountPost[] = [
  {
    id: 'post-1',
    body: 'Half Light just crossed 24k plays. Late-night Amapiano for anyone writing vocals this week.',
    at: '2026-09-21T19:20:00',
    likes: 214,
    beatId: 'half-light',
    thread: [
      {
        id: 'c1',
        author: {
          name: 'Kelu',
          username: 'kelu',
          avatar: '/assets/avatar-1.jpg',
        },
        body: 'This pocket is dangerous. Sending a rough verse tonight.',
        at: '2026-09-21T20:05:00',
        likes: 18,
        replies: [
          {
            id: 'c1r1',
            author: selfAuthor,
            body: 'Send it — leave space around 0:48 for the hook.',
            at: '2026-09-21T20:22:00',
            likes: 9,
            replies: [
              {
                id: 'c1r1r1',
                author: {
                  name: 'Kelu',
                  username: 'kelu',
                  avatar: '/assets/avatar-1.jpg',
                },
                body: 'Got it. Writing around the keys.',
                at: '2026-09-21T20:31:00',
                likes: 4,
                replies: [],
              },
            ],
          },
          {
            id: 'c1r2',
            author: {
              name: 'Sade Mensah',
              username: 'sade',
              avatar: '/assets/avatar-3.jpg',
            },
            body: 'Same energy — that log line sits perfect under a soft vocal.',
            at: '2026-09-21T21:10:00',
            likes: 6,
            replies: [],
          },
        ],
      },
      {
        id: 'c2',
        author: {
          name: 'Harbor',
          username: 'harbor',
          avatar: '/assets/hero-background.jpg',
        },
        body: 'A&R note: this could sit on a late-night playlist with the right feature.',
        at: '2026-09-22T09:40:00',
        likes: 22,
        replies: [
          {
            id: 'c2r1',
            author: selfAuthor,
            body: 'Appreciate you. Happy to send stems if you want a cleaner pass.',
            at: '2026-09-22T10:05:00',
            likes: 7,
            replies: [],
          },
        ],
      },
      {
        id: 'c3',
        author: {
          name: 'Jonah Hale',
          username: 'jonahhale',
          avatar: '/assets/avatar-2.jpg',
        },
        body: 'Leasing the exclusive? DMing.',
        at: '2026-09-22T14:18:00',
        likes: 3,
        replies: [],
      },
    ],
  },
  {
    id: 'post-2',
    body: 'New stems pack in the works. Soft keys, dry drums, and room for a hook that doesn’t rush.',
    at: '2026-09-18T11:05:00',
    likes: 96,
    thread: [
      {
        id: 'c4',
        author: {
          name: 'Mira Cole',
          username: 'mira',
          avatar: '/assets/avatar-1.jpg',
        },
        body: 'Need those dry drums yesterday. Tag me when it’s up.',
        at: '2026-09-18T12:20:00',
        likes: 11,
        replies: [
          {
            id: 'c4r1',
            author: selfAuthor,
            body: 'Will drop a preview clip tomorrow.',
            at: '2026-09-18T13:02:00',
            likes: 5,
            replies: [],
          },
        ],
      },
      {
        id: 'c5',
        author: {
          name: 'Leo Park',
          username: 'leopark',
          avatar: '/assets/avatar-1.jpg',
        },
        body: 'Patient drums are underrated. Following for this.',
        at: '2026-09-19T08:15:00',
        likes: 4,
        replies: [],
      },
    ],
  },
  {
    id: 'post-3',
    body: 'Quiet Riot found a home on a UK project. Grateful for the artists who trust the sketch.',
    at: '2026-09-12T16:40:00',
    likes: 178,
    beatId: 'quiet-riot',
    thread: [
      {
        id: 'c6',
        author: {
          name: 'Amara Cole',
          username: 'amaracole',
          avatar: '/assets/caught-in-joy-ptVBlniJi50-unsplash.jpg',
        },
        body: 'Deserved. That sketch already felt finished.',
        at: '2026-09-12T17:05:00',
        likes: 14,
        replies: [
          {
            id: 'c6r1',
            author: {
              name: 'Dëwit',
              username: 'dewit',
              avatar: '/assets/avatar-3.jpg',
            },
            body: 'Agreed — the mid section writes itself.',
            at: '2026-09-12T17:40:00',
            likes: 8,
            replies: [
              {
                id: 'c6r1r1',
                author: selfAuthor,
                body: 'They kept the original drum bus almost untouched.',
                at: '2026-09-12T18:10:00',
                likes: 12,
                replies: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'post-4',
    body: 'Studio day in Lagos. Log drums first, then the melody that sits under the verse.',
    at: '2026-09-04T09:15:00',
    likes: 142,
    image: '/assets/caught-in-joy-ptVBlniJi50-unsplash.jpg',
    thread: [
      {
        id: 'c7',
        author: {
          name: 'Selasi',
          username: 'selasi',
          avatar: '/assets/avatar-2.jpg',
        },
        body: 'Which room is this? The air in that take is unreal.',
        at: '2026-09-04T10:02:00',
        likes: 9,
        replies: [],
      },
    ],
  },
  {
    id: 'post-5',
    body: 'If you leased Glass City — stems are still available under the same license. Check your downloads.',
    at: '2026-08-28T14:50:00',
    likes: 67,
    beatId: 'glass-city',
    thread: [
      {
        id: 'c8',
        author: {
          name: 'Jonah Hale',
          username: 'jonahhale',
          avatar: '/assets/avatar-2.jpg',
        },
        body: 'Found them. Thanks for keeping the folder clean.',
        at: '2026-08-28T16:20:00',
        likes: 2,
        replies: [
          {
            id: 'c8r1',
            author: selfAuthor,
            body: 'Anytime — shout if a stem is missing.',
            at: '2026-08-28T16:45:00',
            likes: 1,
            replies: [],
          },
        ],
      },
    ],
  },
]

export const accountFollowers: AccountPerson[] = [
  {
    id: 'f1',
    name: 'Kelu',
    username: 'kelu',
    avatar: '/assets/avatar-1.jpg',
    role: 'Artist',
    detail: 'Lagos · R&B',
    following: true,
  },
  {
    id: 'f2',
    name: 'Sade Mensah',
    username: 'sade',
    avatar: '/assets/avatar-3.jpg',
    role: 'Artist',
    detail: 'NYC · Amapiano',
    following: false,
  },
  {
    id: 'f3',
    name: 'Jonah Hale',
    username: 'jonahhale',
    avatar: '/assets/avatar-2.jpg',
    role: 'Artist',
    detail: 'London · Drill',
    following: true,
  },
  {
    id: 'f4',
    name: 'Amara Cole',
    username: 'amaracole',
    avatar: '/assets/caught-in-joy-ptVBlniJi50-unsplash.jpg',
    role: 'Artist',
    detail: 'Accra · Afro-fusion',
    following: false,
  },
  {
    id: 'f5',
    name: 'Harbor',
    username: 'harbor',
    avatar: '/assets/hero-background.jpg',
    role: 'Label',
    detail: 'A&R · West Africa',
    following: true,
  },
  {
    id: 'f6',
    name: 'Leo Park',
    username: 'leopark',
    avatar: '/assets/avatar-1.jpg',
    role: 'Artist',
    detail: 'Seoul · Pop',
    following: false,
  },
]

export const accountFollowing: AccountPerson[] = [
  {
    id: 'g1',
    name: 'Dëwit',
    username: 'dewit',
    avatar: '/assets/avatar-3.jpg',
    role: 'Producer',
    detail: 'Berlin · Log Drum',
    following: true,
  },
  {
    id: 'g2',
    name: 'Selasi',
    username: 'selasi',
    avatar: '/assets/avatar-2.jpg',
    role: 'Artist',
    detail: 'Accra · Afrobeats',
    following: true,
  },
  {
    id: 'g3',
    name: 'Mira Cole',
    username: 'mira',
    avatar: '/assets/avatar-1.jpg',
    role: 'Producer',
    detail: 'Toronto · R&B',
    following: true,
  },
  {
    id: 'g4',
    name: 'Harbor',
    username: 'harbor',
    avatar: '/assets/hero-background.jpg',
    role: 'Label',
    detail: 'A&R · West Africa',
    following: true,
  },
]

export const accountTabs: { id: AccountTab; label: string }[] = [
  { id: 'posts', label: 'Posts' },
  { id: 'followers', label: 'Followers' },
  { id: 'following', label: 'Following' },
]

export function formatStat(value: number) {
  return formatCompact(value)
}

export function beatForPost(beatId?: string) {
  if (!beatId) return null
  return beats.find((beat) => beat.id === beatId) ?? null
}

export function countComments(comments: AccountComment[]): number {
  return comments.reduce((sum, comment) => sum + 1 + countComments(comment.replies), 0)
}

export function addComment(
  comments: AccountComment[],
  parentId: string | null,
  next: AccountComment,
): AccountComment[] {
  if (parentId === null) return [...comments, next]
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return { ...comment, replies: [...comment.replies, next] }
    }
    if (comment.replies.length === 0) return comment
    return { ...comment, replies: addComment(comment.replies, parentId, next) }
  })
}

export function socialHref(kind: keyof ProfileSettings['social'], value: string) {
  if (!value) return null
  if (kind === 'website') return value.startsWith('http') ? value : `https://${value}`
  if (kind === 'instagram') return `https://instagram.com/${value.replace(/^@/, '')}`
  if (kind === 'twitter') return `https://x.com/${value.replace(/^@/, '')}`
  if (kind === 'tiktok') return `https://tiktok.com/${value.startsWith('@') ? value : `@${value}`}`
  if (kind === 'youtube') return `https://youtube.com/channel/${value}`
  return null
}

export const socialLabels: Record<keyof ProfileSettings['social'], string> = {
  instagram: 'Instagram',
  twitter: 'X',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  website: 'Website',
}
