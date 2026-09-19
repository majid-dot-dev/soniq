import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  BarChart3,
  Coins,
  Globe2,
  Headphones,
  LineChart,
  ListMusic,
  Percent,
  ShieldCheck,
  ShoppingBag,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Container, MarketingButton, Reveal, SectionHeading } from './primitives'
import { FloatingOrb, Stagger, StaggerItem } from './motion'
import { ArtistDashboardMockup } from './mockups/ArtistDashboardMockup'
import { ProducerDashboardMockup } from './mockups/ProducerDashboardMockup'
import { LabelDashboardMockup } from './mockups/LabelDashboardMockup'
import { cn } from '@/lib/utils'

interface AudienceCopy {
  id: string
  eyebrow: string
  title: string
  description: string
  points: { icon: LucideIcon; label: string }[]
  cta: string
  reversed?: boolean
  tone: 'ember' | 'signal' | 'yield'
}

const toneIconChip: Record<AudienceCopy['tone'], string> = {
  ember: 'bg-ember-tint text-ember-bright',
  signal: 'bg-signal-tint text-signal',
  yield: 'bg-yield-tint text-yield-bright',
}
const toneOrb: Record<AudienceCopy['tone'], string> = {
  ember: 'bg-[radial-gradient(circle,_rgba(226,85,31,0.18),_transparent_70%)]',
  signal: 'bg-[radial-gradient(circle,_rgba(123,114,232,0.16),_transparent_70%)]',
  yield: 'bg-[radial-gradient(circle,_rgba(47,203,125,0.16),_transparent_70%)]',
}

function AudienceSection({ copy, visual }: { copy: AudienceCopy; visual: ReactNode }) {
  return (
    <div
      id={copy.id}
      className="relative grid items-center gap-10 border-t border-line-dark py-20 lg:grid-cols-2 lg:gap-16 sm:py-24"
    >
      <FloatingOrb duration={18} travel={28} className={cn('right-1/4 top-1/2 -z-10 h-[360px] w-[360px] -translate-y-1/2', toneOrb[copy.tone])} />

      <Reveal className={cn('flex flex-col gap-6', copy.reversed && 'lg:order-2')}>
        <SectionHeading eyebrow={copy.eyebrow} eyebrowTone={copy.tone} title={copy.title} description={copy.description} size="md" />
        <Stagger className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2" stagger={0.05}>
          {copy.points.map((p) => (
            <StaggerItem key={p.label}>
              <span className="flex items-center gap-2.5 text-[14px] text-ink-2">
                <span className={cn('flex h-7 w-7 flex-none items-center justify-center rounded-full', toneIconChip[copy.tone])}>
                  <p.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                {p.label}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
        <div>
          <MarketingButton variant="primary" href="#get-started">
            {copy.cta}
          </MarketingButton>
        </div>
      </Reveal>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className={cn(copy.reversed && 'lg:order-1')}
      >
        {visual}
      </motion.div>
    </div>
  )
}

export function ForArtists() {
  const copy: AudienceCopy = {
    id: 'artists',
    eyebrow: 'For artists',
    title: 'Built around the artist.',
    description:
      'Release your music globally, understand every stream, and manage the business side of your catalog without a label or a lawyer on speed dial.',
    points: [
      { icon: Globe2, label: 'Release music globally' },
      { icon: ListMusic, label: 'Track every release' },
      { icon: LineChart, label: 'Understand revenue' },
      { icon: Users, label: 'Manage collaborators' },
      { icon: ShieldCheck, label: 'Manage rights' },
      { icon: Wallet, label: 'Receive payouts' },
    ],
    cta: 'Start releasing',
    tone: 'ember',
  }
  return (
    <Container>
      <AudienceSection copy={copy} visual={<ArtistDashboardMockup />} />
    </Container>
  )
}

export function ForProducers() {
  const copy: AudienceCopy = {
    id: 'producers',
    eyebrow: 'For producers',
    title: 'Turn beats into a business.',
    description:
      'List beats, license your catalog, and get paid — with the same infrastructure that powers releases and royalties on the other side of the platform.',
    points: [
      { icon: ShoppingBag, label: 'Sell beats' },
      { icon: ShieldCheck, label: 'License music' },
      { icon: Headphones, label: 'Sell stems' },
      { icon: UserCog, label: 'Build a producer profile' },
      { icon: BarChart3, label: 'Track sales' },
      { icon: Percent, label: 'Participate in splits' },
    ],
    cta: 'Sell your beats',
    reversed: true,
    tone: 'signal',
  }
  return (
    <Container>
      <AudienceSection copy={copy} visual={<ProducerDashboardMockup />} />
    </Container>
  )
}

export function ForLabels() {
  const copy: AudienceCopy = {
    id: 'labels',
    eyebrow: 'For labels',
    title: 'Run your catalog like a business.',
    description:
      'Manage a full roster of artists, releases, and royalty accounting from one place — with team permissions built for how labels actually work.',
    points: [
      { icon: Users, label: 'Artist management' },
      { icon: ListMusic, label: 'Catalog management' },
      { icon: Globe2, label: 'Release management' },
      { icon: Coins, label: 'Royalty accounting' },
      { icon: Percent, label: 'Splits & statements' },
      { icon: UserCog, label: 'Team permissions' },
    ],
    cta: 'Explore for labels',
    tone: 'yield',
  }
  return (
    <Container>
      <AudienceSection copy={copy} visual={<LabelDashboardMockup />} />
    </Container>
  )
}
