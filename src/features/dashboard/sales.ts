export type SaleStatus = 'Completed' | 'Pending' | 'Canceled'

export type Sale = {
  id: string
  beatId: string
  beatTitle: string
  buyerName: string
  buyerEmail: string
  buyerAvatar: string
  country: string
  licenseName: string
  terms: string
  amount: number
  files: string[]
  status: SaleStatus
  soldAt: string
  downloadedAt?: string
}

export const sales: Sale[] = [
  {
    id: 'SQ-1842',
    beatId: 'half-light',
    beatTitle: 'Half Light',
    buyerName: 'Sade Mensah',
    buyerEmail: 'sade.mensah@example.com',
    buyerAvatar: '/assets/avatar-1.jpg',
    country: 'United States',
    licenseName: 'WAV lease',
    terms: 'Untagged WAV for the record. Limited commercial use.',
    amount: 60,
    files: ['MP3', 'WAV'],
    status: 'Completed',
    soldAt: '2026-09-18T15:42:00',
    downloadedAt: '2026-09-18T16:05:00',
  },
  {
    id: 'SQ-1836',
    beatId: 'quiet-riot',
    beatTitle: 'Quiet Riot',
    buyerName: 'Jonah Hale',
    buyerEmail: 'jonah.hale@example.com',
    buyerAvatar: '/assets/avatar-2.jpg',
    country: 'United Kingdom',
    licenseName: 'MP3 lease',
    terms: 'MP3 download, limited use.',
    amount: 40,
    files: ['MP3'],
    status: 'Completed',
    soldAt: '2026-09-14T11:18:00',
    downloadedAt: '2026-09-14T11:22:00',
  },
  {
    id: 'SQ-1831',
    beatId: 'harmattan',
    beatTitle: 'Harmattan',
    buyerName: 'Amara Cole',
    buyerEmail: 'amara.cole@example.com',
    buyerAvatar: '/assets/avatar-3.jpg',
    country: 'Nigeria',
    licenseName: 'Stems lease',
    terms: 'WAV plus the stems zip.',
    amount: 150,
    files: ['MP3', 'WAV', 'Stems'],
    status: 'Completed',
    soldAt: '2026-09-09T20:05:00',
  },
  {
    id: 'SQ-1824',
    beatId: 'glass-city',
    beatTitle: 'Glass City',
    buyerName: 'Leo Park',
    buyerEmail: 'leo.park@example.com',
    buyerAvatar: '/assets/caught-in-joy-ptVBlniJi50-unsplash.jpg',
    country: 'United States',
    licenseName: 'Exclusive',
    terms: 'Buyer owns the master. The beat comes off sale.',
    amount: 850,
    files: ['MP3', 'WAV', 'Stems'],
    status: 'Completed',
    soldAt: '2026-09-04T09:31:00',
    downloadedAt: '2026-09-05T13:10:00',
  },
  {
    id: 'SQ-1820',
    beatId: 'static-bloom',
    beatTitle: 'Static Bloom',
    buyerName: 'Imani Brooks',
    buyerEmail: 'imani.brooks@example.com',
    buyerAvatar: '/assets/avatar-1.jpg',
    country: 'Germany',
    licenseName: 'WAV lease',
    terms: 'Untagged WAV for the record. Limited commercial use.',
    amount: 55,
    files: ['MP3', 'WAV'],
    status: 'Pending',
    soldAt: '2026-09-02T18:47:00',
  },
  {
    id: 'SQ-1798',
    beatId: 'red-dust',
    beatTitle: 'Red Dust',
    buyerName: 'Chris Adeyemi',
    buyerEmail: 'chris.adeyemi@example.com',
    buyerAvatar: '/assets/avatar-2.jpg',
    country: 'Nigeria',
    licenseName: 'MP3 lease',
    terms: 'MP3 download, limited use.',
    amount: 40,
    files: ['MP3'],
    status: 'Canceled',
    soldAt: '2026-08-22T14:03:00',
  },
  {
    id: 'SQ-1760',
    beatId: 'half-light',
    beatTitle: 'Half Light',
    buyerName: 'Noor Elamin',
    buyerEmail: 'noor.elamin@example.com',
    buyerAvatar: '/assets/avatar-3.jpg',
    country: 'United Kingdom',
    licenseName: 'MP3 lease',
    terms: 'MP3 download, limited use.',
    amount: 40,
    files: ['MP3'],
    status: 'Completed',
    soldAt: '2026-08-11T10:26:00',
    downloadedAt: '2026-08-11T10:40:00',
  },
  {
    id: 'SQ-1712',
    beatId: 'quiet-riot',
    beatTitle: 'Quiet Riot',
    buyerName: 'Malik Reed',
    buyerEmail: 'malik.reed@example.com',
    buyerAvatar: '/assets/avatar-1.jpg',
    country: 'Brazil',
    licenseName: 'WAV lease',
    terms: 'Untagged WAV for the record. Limited commercial use.',
    amount: 60,
    files: ['MP3', 'WAV'],
    status: 'Completed',
    soldAt: '2026-07-28T16:55:00',
    downloadedAt: '2026-07-29T08:12:00',
  },
  {
    id: 'SQ-1688',
    beatId: 'harmattan',
    beatTitle: 'Harmattan',
    buyerName: 'Elena Voss',
    buyerEmail: 'elena.voss@example.com',
    buyerAvatar: '/assets/avatar-2.jpg',
    country: 'Germany',
    licenseName: 'MP3 lease',
    terms: 'MP3 download, limited use.',
    amount: 50,
    files: ['MP3'],
    status: 'Completed',
    soldAt: '2026-06-03T12:14:00',
    downloadedAt: '2026-06-03T12:20:00',
  },
]

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US')}`
}
