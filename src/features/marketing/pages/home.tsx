import { Hero } from '@/features/marketing/components/hero'
import { TrustBar } from '@/features/marketing/components/trust-bar'
import { SecondSection } from '@/features/marketing/components/second-section'
import { ThirdSection } from '@/features/marketing/components/third-section'
import { FourthSection } from '@/features/marketing/components/fourth-section'
import { ScrollProgressBar } from '@/features/marketing/components/motion'
// import { ProductOverview } from '@/features/marketing/components/product-overview'
// import { BeatMarketplace } from '@/features/marketing/components/beat-marketplace'
// import { ReleaseThisSong } from '@/features/marketing/components/release-this-song'
// import { RoyaltySplits } from '@/features/marketing/components/royalty-splits'
// import { FinancialInfrastructure } from '@/features/marketing/components/financial-infrastructure'
// import { ForArtists, ForLabels, ForProducers } from '@/features/marketing/components/audience-sections'
// import { RightsSection } from '@/features/marketing/components/rights-section'
// import { GlobalDistribution } from '@/features/marketing/components/global-distribution'
// import { AfricanRoots } from '@/features/marketing/components/african-roots'
// import { FinalCTA } from '@/features/marketing/components/final-cta'

function Home() {
  return (
    <>
      <ScrollProgressBar />
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
    </>
  )
}

export default Home
