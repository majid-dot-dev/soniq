import { AmbientBackground, ScrollProgressBar } from '@/components/marketing/motion'
import { Navbar } from '@/components/marketing/Navbar'
import { Hero } from '@/components/marketing/Hero'
import { TrustBar } from '@/components/marketing/TrustBar'
import { SecondSection } from '@/components/marketing/SecondSection'
import { ThirdSection } from '@/components/marketing/ThirdSection'
import { FourthSection } from '@/components/marketing/FourthSection'
// import { ProductOverview } from '@/components/marketing/ProductOverview'
// import { BeatMarketplace } from '@/components/marketing/BeatMarketplace'
// import { ReleaseThisSong } from '@/components/marketing/ReleaseThisSong'
// import { RoyaltySplits } from '@/components/marketing/RoyaltySplits'
// import { FinancialInfrastructure } from '@/components/marketing/FinancialInfrastructure'
// import { ForArtists, ForLabels, ForProducers } from '@/components/marketing/AudienceSections'
// import { RightsSection } from '@/components/marketing/RightsSection'
// import { GlobalDistribution } from '@/components/marketing/GlobalDistribution'
// import { AfricanRoots } from '@/components/marketing/AfricanRoots'
// import { FinalCTA } from '@/components/marketing/FinalCTA'
import { Footer } from '@/components/marketing/Footer'

function Home() {
  return (
    <div className="relative isolate min-h-screen bg-paper">
      <AmbientBackground />
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <SecondSection />
        <ThirdSection />
        <FourthSection />
        {/* <ProductOverview />
        <BeatMarketplace />
        <ReleaseThisSong />
        <RoyaltySplits />
        <FinancialInfrastructure />
        <ForArtists />
        <ForProducers />
        <ForLabels />
        <RightsSection />
        <GlobalDistribution />
        <AfricanRoots />
        <FinalCTA /> */}
      </main>
      <Footer />
    </div>
  )
}

export default Home
