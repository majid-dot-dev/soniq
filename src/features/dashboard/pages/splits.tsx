import { DashboardPage } from '@/features/dashboard/components/dashboard-page'
import { useWorkspace } from '@/features/dashboard/workspace'

const description = {
  Artist: 'Who shares the earnings on a song, and what they are owed.',
  Producer: 'Who shares the earnings on a song, and what they are owed.',
  Label: 'How royalties are divided across the roster.',
}

export default function Splits() {
  const { current } = useWorkspace()

  return <DashboardPage title="Splits" description={description[current.type]} />
}
