import { useEffect, useState } from 'react'
import { SIDEBAR_COLLAPSED_KEY } from '@/features/marketplace/components/layout/constants'

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      // ignore quota / private mode
    }
  }, [collapsed])

  return [collapsed, setCollapsed] as const
}
