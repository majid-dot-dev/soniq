import type { WorkspaceType } from '@/features/dashboard/workspace'

export type ChatMessage = {
  id: string
  from: 'them' | 'me'
  body: string
  sentAt: string
  kind?: 'text' | 'file' | 'voice'
  fileName?: string
  durationSec?: number
}

export type ChatPresence = 'online' | 'away' | 'offline'

export type ChatThread = {
  id: string
  name: string
  initials: string
  avatar?: string
  role: string
  presence: ChatPresence
  preview: string
  time: string
  unread: number
  context?: string
  handle: string
  location: string
  joined: string
  bio: string
  purchases: number
  messages: ChatMessage[]
}

const producerThreads: ChatThread[] = [
  {
    id: 'sade',
    name: 'Sade Mensah',
    initials: 'SM',
    avatar: '/assets/avatar-1.jpg',
    role: 'Buyer',
    presence: 'online',
    handle: '@sade.m',
    location: 'Lagos, NG',
    joined: 'Mar 2024',
    bio: 'Vocalist and songwriter shopping leases for the next EP. Usually after dark, melodic stuff.',
    purchases: 7,
    preview: 'Can I get the stems on that WAV lease?',
    time: '12m',
    unread: 2,
    context: 'Half Light',
    messages: [
      {
        id: 's1',
        from: 'them',
        body: 'Hey — just grabbed the WAV lease for Half Light. Loving it.',
        sentAt: 'Yesterday 4:12 PM',
      },
      {
        id: 's2',
        from: 'me',
        body: 'Appreciate you. Receipt and files should be in your email.',
        sentAt: 'Yesterday 4:28 PM',
      },
      {
        id: 's3',
        from: 'them',
        body: 'Got them. Quick one — can I get the stems on that WAV lease, or do I need to upgrade?',
        sentAt: '12m ago',
      },
      {
        id: 's4',
        from: 'them',
        body: 'Also open to exclusive if the price is right.',
        sentAt: '12m ago',
      },
    ],
  },
  {
    id: 'jonah',
    name: 'Jonah Hale',
    initials: 'JH',
    avatar: '/assets/avatar-2.jpg',
    role: 'Buyer',
    presence: 'away',
    handle: '@jonahh',
    location: 'Atlanta, US',
    joined: 'Nov 2023',
    bio: 'Independent artist. Buys MP3 and WAV leases for demos and singles.',
    purchases: 3,
    preview: 'Got the download. Thanks again.',
    time: '2h',
    unread: 0,
    context: 'Quiet Riot',
    messages: [
      {
        id: 'j1',
        from: 'them',
        body: 'Is Quiet Riot still available for an MP3 lease?',
        sentAt: 'Today 10:04 AM',
      },
      {
        id: 'j2',
        from: 'me',
        body: 'Yes — MP3 and WAV are both live on the store.',
        sentAt: 'Today 10:11 AM',
      },
      {
        id: 'j3',
        from: 'them',
        body: 'Perfect, just bought it. Got the download. Thanks again.',
        sentAt: '2h ago',
      },
    ],
  },
  {
    id: 'nao',
    name: 'Nao Okonkwo',
    initials: 'NO',
    avatar: '/assets/avatar-3.jpg',
    role: 'Collaborator',
    presence: 'online',
    handle: '@nao',
    location: 'London, UK',
    joined: 'Jan 2023',
    bio: 'Producer collaborator. Pads, textures, and late-night construction kits.',
    purchases: 0,
    preview: 'I can send you the pads tonight.',
    time: '1d',
    unread: 0,
    context: 'Glass City Kit',
    messages: [
      {
        id: 'n1',
        from: 'me',
        body: 'Want to throw some pads on the Glass City construction kit with me?',
        sentAt: 'Mon 6:40 PM',
      },
      {
        id: 'n2',
        from: 'them',
        body: 'Down. I can send you the pads tonight.',
        sentAt: '1d ago',
      },
    ],
  },
  {
    id: 'mira',
    name: 'Mira Cole',
    initials: 'MC',
    role: 'Buyer',
    presence: 'offline',
    handle: '@miracole',
    location: 'Toronto, CA',
    joined: 'Aug 2024',
    bio: 'Looking for darker loops in the 90–100 BPM range for a short film score.',
    purchases: 1,
    preview: 'Do you have anything darker in that BPM range?',
    time: '3d',
    unread: 1,
    context: 'Night Bus Loops',
    messages: [
      {
        id: 'm1',
        from: 'them',
        body: 'Heard Night Bus Loops — do you have anything darker in that BPM range?',
        sentAt: '3d ago',
      },
    ],
  },
]

const artistThreads: ChatThread[] = [
  {
    id: 'kelu-collab',
    name: 'Nao Producer',
    initials: 'NP',
    avatar: '/assets/avatar-2.jpg',
    role: 'Producer',
    presence: 'online',
    handle: '@nao',
    location: 'London, UK',
    joined: 'Jan 2023',
    bio: 'Beatmaker and sound designer. Flips, darker passes, and custom edits.',
    purchases: 12,
    preview: 'I can send a darker pass tomorrow.',
    time: '40m',
    unread: 1,
    context: 'Half Light',
    messages: [
      {
        id: 'a1',
        from: 'me',
        body: 'Can we try a darker flip of Half Light for the verse?',
        sentAt: 'Today 11:02 AM',
      },
      {
        id: 'a2',
        from: 'them',
        body: 'I can send a darker pass tomorrow.',
        sentAt: '40m ago',
      },
    ],
  },
  {
    id: 'harbor',
    name: 'Harbor Label',
    initials: 'HL',
    role: 'Label',
    presence: 'offline',
    handle: '@harbor',
    location: 'Accra, GH',
    joined: 'Jun 2022',
    bio: 'Independent label A&R. Sampler placements, stems, and release calendars.',
    purchases: 0,
    preview: 'Send stems when the mix is locked.',
    time: '2d',
    unread: 0,
    context: 'Quiet Riot',
    messages: [
      {
        id: 'h1',
        from: 'them',
        body: 'We want Quiet Riot on the next sampler. Send stems when the mix is locked.',
        sentAt: '2d ago',
      },
      {
        id: 'h2',
        from: 'me',
        body: 'Will do — targeting end of week.',
        sentAt: '2d ago',
      },
    ],
  },
]

const labelThreads: ChatThread[] = [
  {
    id: 'kelu',
    name: 'Kelu Artist',
    initials: 'KE',
    avatar: '/assets/avatar-1.jpg',
    role: 'Artist',
    presence: 'away',
    handle: '@kelu',
    location: 'Lagos, NG',
    joined: 'Feb 2023',
    bio: 'Signed artist finishing Soft Wiring. Mix notes, features, and rollout timing.',
    purchases: 0,
    preview: 'Mix notes are in the folder.',
    time: '1h',
    unread: 2,
    context: 'Soft Wiring',
    messages: [
      {
        id: 'l1',
        from: 'them',
        body: 'Soft Wiring is almost done. Mix notes are in the folder.',
        sentAt: '1h ago',
      },
      {
        id: 'l2',
        from: 'them',
        body: 'Can A&R listen before Friday?',
        sentAt: '1h ago',
      },
    ],
  },
  {
    id: 'nao-label',
    name: 'Nao Producer',
    initials: 'NP',
    avatar: '/assets/avatar-3.jpg',
    role: 'Producer',
    presence: 'online',
    handle: '@nao',
    location: 'London, UK',
    joined: 'Jan 2023',
    bio: 'Catalog producer. Exclusive holds, sync-ready masters, and beat placements.',
    purchases: 18,
    preview: 'Exclusive hold until Monday works.',
    time: '5h',
    unread: 0,
    context: 'Red Dust',
    messages: [
      {
        id: 'nl1',
        from: 'me',
        body: 'Can we hold Red Dust exclusive for Kelu through Monday?',
        sentAt: 'Yesterday 7:15 PM',
      },
      {
        id: 'nl2',
        from: 'them',
        body: 'Exclusive hold until Monday works.',
        sentAt: '5h ago',
      },
    ],
  },
]

export function threadsFor(type: WorkspaceType): ChatThread[] {
  if (type === 'Artist') return artistThreads
  if (type === 'Label') return labelThreads
  return producerThreads
}
