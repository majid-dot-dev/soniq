import { Navigate, Route, Routes } from 'react-router-dom'
import ForgotPassword from '@/features/auth/pages/forgot-password'
import Login from '@/features/auth/pages/login'
import Signup from '@/features/auth/pages/signup'
import { RedirectIfAuthed, RequireAuth, RequireProfile } from '@/features/auth/require-auth'
import { DashboardLayout } from '@/features/dashboard/components/dashboard-layout'
import Account from '@/features/dashboard/pages/account'
import Analytics from '@/features/dashboard/pages/analytics'
import Artists from '@/features/dashboard/pages/artists'
import Tracks from '@/features/tracks/pages'
import UploadTrack from '@/features/tracks/pages/upload-track'
import EditTrack from '@/features/tracks/pages/edit-track'
import Billing from '@/features/dashboard/pages/billing'
import Chats from '@/features/dashboard/pages/chats'
import Dashboard from '@/features/dashboard/pages/dashboard'
import Discounts from '@/features/dashboard/pages/discounts'
import Earnings from '@/features/dashboard/pages/earnings'
import Insights from '@/features/dashboard/pages/insights'
import Licenses from '@/features/licenses/pages'
import CreateLicense from '@/features/licenses/pages/create-license'
import Music from '@/features/dashboard/pages/music'
import Notifications from '@/features/dashboard/pages/notifications'
import Onboarding from '@/features/dashboard/onboarding'
import Payees from '@/features/dashboard/pages/payees'
import Releases from '@/features/dashboard/pages/releases'
import Royalties from '@/features/dashboard/pages/royalties'
import Sales from '@/features/dashboard/pages/sales'
import Settings from '@/features/dashboard/pages/settings'
import SoundKits from '@/features/dashboard/pages/sound-kits'
import Splits from '@/features/dashboard/pages/splits'
import Statements from '@/features/dashboard/pages/statements'
import Stats from '@/features/dashboard/pages/stats'
import Store from '@/features/dashboard/pages/store'
import Wallet from '@/features/dashboard/pages/wallet'
import { MarketingLayout } from '@/features/marketing/components/marketing-layout'
import Home from '@/features/marketing/pages/home'
import { MarketplaceLayout } from '@/features/marketplace/components/marketplace-layout'
import Marketplace from '@/features/marketplace/pages'
import ExplorePage from '@/features/marketplace/pages/explore'
import CheckoutPage from '@/features/marketplace/pages/checkout'
import TopChartsPage from '@/features/marketplace/pages/top-charts'
import ProducerPage from '@/features/marketplace/pages/producer'
import TrackPage from '@/features/marketplace/pages/track'
import TracksIndexPage from '@/features/marketplace/pages/tracks-index'
import FavoritesPage from '@/features/marketplace/pages/favorites'
import GenresPage from '@/features/marketplace/pages/genres'
import MoodsPage from '@/features/marketplace/pages/moods'
import CreatorsPage from '@/features/marketplace/pages/creators'
import PacksPage from '@/features/marketplace/pages/packs'
import MarketplacePlaceholder from '@/features/marketplace/pages/placeholder'
import { isDashboardHost } from '@/lib/host'

function MarketingRoutes() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route index element={<Home />} path="/" />
        <Route path="/marketplace" element={<MarketplaceLayout />}>
          <Route index element={<Marketplace />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="charts" element={<TopChartsPage />} />
          <Route path="tracks" element={<TracksIndexPage />} />
          <Route path="tracks/:trackId" element={<TrackPage />} />
          <Route path="producers/:producerSlug" element={<ProducerPage />} />
          <Route
            path="type-beats"
            element={
              <MarketplacePlaceholder
                title="Type Beats"
                description="Browse by artist style and type-beat tags."
              />
            }
          />
          <Route path="genres" element={<GenresPage />} />
          <Route path="moods" element={<MoodsPage />} />
          <Route path="creators" element={<CreatorsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="packs" element={<PacksPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="cart" element={<Navigate to="/marketplace/checkout" replace />} />
        </Route>
      </Route>
      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <Login />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuthed>
            <Signup />
          </RedirectIfAuthed>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}

function DashboardRoutes() {
  return (
    <RequireAuth>
      <RequireProfile>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="/music" element={<Music />} />
            <Route path="/splits" element={<Splits />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/tracks/upload" element={<UploadTrack />} />
            <Route path="/tracks/:trackId/edit" element={<EditTrack />} />
            <Route path="/beats" element={<Navigate to="/tracks" replace />} />
            <Route path="/sound-kits" element={<SoundKits />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route path="/licenses/new" element={<CreateLicense />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/payouts" element={<Navigate to="/wallet" replace />} />
            <Route path="/statements" element={<Statements />} />
            <Route path="/payees" element={<Payees />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/royalties" element={<Royalties />} />
            <Route path="/store" element={<Store />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
            <Route path="/billing" element={<Billing />} />
          </Route>
        </Routes>
      </RequireProfile>
    </RequireAuth>
  )
}

function App() {
  return isDashboardHost() ? <DashboardRoutes /> : <MarketingRoutes />
}

export default App
