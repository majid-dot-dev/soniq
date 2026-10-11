import { useSyncExternalStore } from 'react'

export type Notification = {
  id: string
  name: string
  initials: string
  detail: string
  amount?: string
  direction: 'in' | 'out'
  status: string
  statusTone: 'paid' | 'pending' | 'live'
  category: string
  time: string
  unread: boolean
}

const initialNotifications: Notification[] = [
  {
    id: 'half-light',
    name: 'Kelu',
    initials: 'KE',
    detail: 'Licensed Half Light for',
    amount: '+$60',
    direction: 'in',
    status: 'Paid',
    statusTone: 'paid',
    category: 'License',
    time: '2h',
    unread: true,
  },
  {
    id: 'payout',
    name: 'SoundSoniq',
    initials: 'SS',
    detail: 'Sent a payout to your bank for',
    amount: '-$240',
    direction: 'out',
    status: 'Paid',
    statusTone: 'paid',
    category: 'Payout',
    time: '1d',
    unread: true,
  },
  {
    id: 'quiet-riot',
    name: 'Nao Beats',
    initials: 'NB',
    detail: 'Royalty on Quiet Riot for',
    amount: '+$18',
    direction: 'in',
    status: 'Pending',
    statusTone: 'pending',
    category: 'Royalties',
    time: '12m',
    unread: false,
  },
  {
    id: 'glass-city',
    name: 'Dëwit',
    initials: 'DW',
    detail: 'Accepted the split on Glass City.',
    direction: 'in',
    status: 'Paid',
    statusTone: 'paid',
    category: 'Split',
    time: '5d',
    unread: false,
  },
  {
    id: 'harmattan',
    name: 'Selasi',
    initials: 'SE',
    detail: 'Harmattan earned',
    amount: '+$42',
    direction: 'in',
    status: 'Live',
    statusTone: 'live',
    category: 'Release',
    time: '3h',
    unread: true,
  },
]

let notifications = initialNotifications
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useNotifications() {
  return useSyncExternalStore(subscribe, () => notifications, () => notifications)
}

export function markNotificationRead(id: string) {
  if (!notifications.some((item) => item.id === id && item.unread)) return
  notifications = notifications.map((item) => (item.id === id ? { ...item, unread: false } : item))
  emit()
}

export function markNotificationsRead() {
  if (notifications.every((item) => !item.unread)) return
  notifications = notifications.map((item) => ({ ...item, unread: false }))
  emit()
}
