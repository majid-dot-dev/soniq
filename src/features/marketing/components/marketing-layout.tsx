import { Outlet, useLocation } from 'react-router-dom'
import { AmbientBackground } from '@/features/marketing/components/motion'
import { Footer } from '@/features/marketing/components/footer'
import { Navbar } from '@/features/marketing/components/navbar'

export function MarketingLayout() {
  const { pathname } = useLocation()

  // Marketplace has its own shell — never show the marketing navbar or footer there.
  if (pathname.startsWith('/marketplace')) {
    return <Outlet />
  }

  return (
    <div className="relative isolate min-h-screen bg-paper">
      <AmbientBackground />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
