import CreatorsToWatch from '@/features/marketplace/components/explore/creators-to-watch'
import { ExploreStories } from '@/features/marketplace/components/explore/explore-stories'
import Mood from '@/features/marketplace/components/explore/mood'
import NewThisWeek from '@/features/marketplace/components/explore/new-this-week'
import TrendingNow from '@/features/marketplace/components/explore/trending-now'

export default function ExplorePage() {
  return (
    <div className="relative h-full overflow-auto px-4 py-6 lg:px-6 lg:py-4">
      <ExploreStories />
      <NewThisWeek />
      <TrendingNow />
      <CreatorsToWatch showSubtitle={false} />
      <Mood />
    </div>
  )
}
