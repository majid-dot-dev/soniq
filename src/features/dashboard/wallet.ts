export type ActivityKind = 'sale' | 'fee' | 'refund' | 'payout'
export type PayoutStatus = 'Paid' | 'Processing' | 'Failed'
export type ActivityStatus = 'Cleared' | 'Pending' | 'Reversed' | PayoutStatus

export type PayoutMethod = {
  id: string
  label: string
  detail: string
  type: 'bank' | 'paypal'
}

export type BalanceSummary = {
  available: number
  pending: number
  lifetimeEarned: number
  paidOut: number
  currency: 'USD'
  clearingNote: string
  nextPayoutEstimate: string
}

export type LedgerEntry = {
  id: string
  kind: ActivityKind
  title: string
  detail: string
  amount: number
  status: ActivityStatus
  at: string
  saleId?: string
}

export type PayoutRecord = {
  id: string
  amount: number
  fee: number
  net: number
  methodLabel: string
  status: PayoutStatus
  requestedAt: string
  arrivedAt?: string
}

export const payoutMethod: PayoutMethod = {
  id: 'bank-chase',
  label: 'Chase ····4821',
  detail: 'ACH · 1–3 business days',
  type: 'bank',
}

export const balanceSummary: BalanceSummary = {
  available: 1240,
  pending: 190,
  lifetimeEarned: 6840,
  paidOut: 5410,
  currency: 'USD',
  clearingNote: 'Pending sales clear in 3–7 days after the buyer pays.',
  nextPayoutEstimate: 'Withdrawals usually land in 1–3 business days.',
}

export const ledgerEntries: LedgerEntry[] = [
  {
    id: 'le-01',
    kind: 'sale',
    title: 'Half Light · WAV lease',
    detail: 'Sade Mensah · SQ-1842',
    amount: 60,
    status: 'Cleared',
    at: '2026-09-18T15:42:00',
    saleId: 'SQ-1842',
  },
  {
    id: 'le-02',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1842',
    amount: -2.04,
    status: 'Cleared',
    at: '2026-09-18T15:42:00',
    saleId: 'SQ-1842',
  },
  {
    id: 'le-03',
    kind: 'sale',
    title: 'Quiet Riot · MP3 lease',
    detail: 'Jonah Hale · SQ-1836',
    amount: 40,
    status: 'Cleared',
    at: '2026-09-14T11:18:00',
    saleId: 'SQ-1836',
  },
  {
    id: 'le-03b',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1836',
    amount: -1.36,
    status: 'Cleared',
    at: '2026-09-14T11:18:00',
    saleId: 'SQ-1836',
  },
  {
    id: 'le-04',
    kind: 'payout',
    title: 'Withdrawal',
    detail: 'Chase ····4821',
    amount: -420,
    status: 'Paid',
    at: '2026-09-12T09:10:00',
  },
  {
    id: 'le-05',
    kind: 'sale',
    title: 'Harmattan · Stems lease',
    detail: 'Amara Cole · SQ-1831',
    amount: 150,
    status: 'Pending',
    at: '2026-09-09T20:05:00',
    saleId: 'SQ-1831',
  },
  {
    id: 'le-11',
    kind: 'sale',
    title: 'Soft Wiring · WAV lease',
    detail: 'Tunde Adebayo · SQ-1828',
    amount: 60,
    status: 'Cleared',
    at: '2026-09-08T12:40:00',
    saleId: 'SQ-1828',
  },
  {
    id: 'le-12',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1828',
    amount: -2.04,
    status: 'Cleared',
    at: '2026-09-08T12:40:00',
    saleId: 'SQ-1828',
  },
  {
    id: 'le-13',
    kind: 'sale',
    title: 'Night Bus Loops · MP3 lease',
    detail: 'Ria Cho · SQ-1826',
    amount: 40,
    status: 'Cleared',
    at: '2026-09-05T19:15:00',
    saleId: 'SQ-1826',
  },
  {
    id: 'le-14',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1826',
    amount: -1.36,
    status: 'Cleared',
    at: '2026-09-05T19:15:00',
    saleId: 'SQ-1826',
  },
  {
    id: 'le-06',
    kind: 'sale',
    title: 'Glass City · Exclusive',
    detail: 'Leo Park · SQ-1824',
    amount: 850,
    status: 'Cleared',
    at: '2026-09-03T14:22:00',
    saleId: 'SQ-1824',
  },
  {
    id: 'le-15',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1824',
    amount: -28.9,
    status: 'Cleared',
    at: '2026-09-03T14:22:00',
    saleId: 'SQ-1824',
  },
  {
    id: 'le-16',
    kind: 'sale',
    title: 'Half Light · MP3 lease',
    detail: 'Devon Miles · SQ-1819',
    amount: 40,
    status: 'Cleared',
    at: '2026-09-01T09:05:00',
    saleId: 'SQ-1819',
  },
  {
    id: 'le-17',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1819',
    amount: -1.36,
    status: 'Cleared',
    at: '2026-09-01T09:05:00',
    saleId: 'SQ-1819',
  },
  {
    id: 'le-07',
    kind: 'refund',
    title: 'Refund · Night Bus Loops',
    detail: 'Buyer dispute · SQ-1798',
    amount: -45,
    status: 'Reversed',
    at: '2026-08-28T16:40:00',
    saleId: 'SQ-1798',
  },
  {
    id: 'le-18',
    kind: 'sale',
    title: 'Quiet Riot · WAV lease',
    detail: 'Nia Brooks · SQ-1814',
    amount: 60,
    status: 'Cleared',
    at: '2026-08-22T15:10:00',
    saleId: 'SQ-1814',
  },
  {
    id: 'le-19',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1814',
    amount: -2.04,
    status: 'Cleared',
    at: '2026-08-22T15:10:00',
    saleId: 'SQ-1814',
  },
  {
    id: 'le-08',
    kind: 'payout',
    title: 'Withdrawal',
    detail: 'Chase ····4821',
    amount: -980,
    status: 'Paid',
    at: '2026-08-20T11:05:00',
  },
  {
    id: 'le-09',
    kind: 'sale',
    title: 'Glass City Kit · Standard',
    detail: 'Mira Cole · SQ-1810',
    amount: 29,
    status: 'Cleared',
    at: '2026-08-15T13:28:00',
    saleId: 'SQ-1810',
  },
  {
    id: 'le-20',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1810',
    amount: -0.99,
    status: 'Cleared',
    at: '2026-08-15T13:28:00',
    saleId: 'SQ-1810',
  },
  {
    id: 'le-21',
    kind: 'sale',
    title: 'Red Dust · Stems lease',
    detail: 'Omar Sy · SQ-1806',
    amount: 150,
    status: 'Cleared',
    at: '2026-08-04T17:50:00',
    saleId: 'SQ-1806',
  },
  {
    id: 'le-22',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1806',
    amount: -5.1,
    status: 'Cleared',
    at: '2026-08-04T17:50:00',
    saleId: 'SQ-1806',
  },
  {
    id: 'le-10',
    kind: 'sale',
    title: 'Red Dust · WAV lease',
    detail: 'Kai Okonkwo · SQ-1802',
    amount: 60,
    status: 'Pending',
    at: '2026-09-20T10:12:00',
    saleId: 'SQ-1802',
  },
  {
    id: 'le-23',
    kind: 'sale',
    title: 'Soft Wiring · Exclusive',
    detail: 'Harbor A&R · SQ-1788',
    amount: 900,
    status: 'Cleared',
    at: '2026-07-18T11:20:00',
    saleId: 'SQ-1788',
  },
  {
    id: 'le-24',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1788',
    amount: -30.6,
    status: 'Cleared',
    at: '2026-07-18T11:20:00',
    saleId: 'SQ-1788',
  },
  {
    id: 'le-25',
    kind: 'sale',
    title: 'Half Light · WAV lease',
    detail: 'Ellis Ward · SQ-1772',
    amount: 60,
    status: 'Cleared',
    at: '2026-07-02T16:05:00',
    saleId: 'SQ-1772',
  },
  {
    id: 'le-26',
    kind: 'fee',
    title: 'Processing fee',
    detail: 'SQ-1772',
    amount: -2.04,
    status: 'Cleared',
    at: '2026-07-02T16:05:00',
    saleId: 'SQ-1772',
  },
]

export const payoutHistory: PayoutRecord[] = [
  {
    id: 'PO-2041',
    amount: 420,
    fee: 0.5,
    net: 419.5,
    methodLabel: 'Chase ····4821',
    status: 'Paid',
    requestedAt: '2026-09-12T09:10:00',
    arrivedAt: '2026-09-14T08:02:00',
  },
  {
    id: 'PO-2018',
    amount: 980,
    fee: 0.5,
    net: 979.5,
    methodLabel: 'Chase ····4821',
    status: 'Paid',
    requestedAt: '2026-08-20T11:05:00',
    arrivedAt: '2026-08-22T07:41:00',
  },
  {
    id: 'PO-1994',
    amount: 250,
    fee: 0.5,
    net: 249.5,
    methodLabel: 'PayPal · nao@soniq.co',
    status: 'Failed',
    requestedAt: '2026-07-30T18:22:00',
  },
  {
    id: 'PO-1971',
    amount: 1100,
    fee: 0.5,
    net: 1099.5,
    methodLabel: 'Chase ····4821',
    status: 'Paid',
    requestedAt: '2026-07-08T10:40:00',
    arrivedAt: '2026-07-10T09:15:00',
  },
  {
    id: 'PO-2055',
    amount: 180,
    fee: 0.5,
    net: 179.5,
    methodLabel: 'Chase ····4821',
    status: 'Processing',
    requestedAt: '2026-09-21T16:05:00',
  },
]

export const MIN_WITHDRAW = 10

export function formatPayoutMoney(amount: number) {
  const absolute = Math.abs(amount)
  const formatted = absolute.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: absolute % 1 === 0 && absolute >= 1 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  if (amount > 0) return `+${formatted}`
  if (amount < 0) return `-${formatted}`
  return formatted
}

export function formatSignedMoney(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}
