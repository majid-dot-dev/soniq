import { DashboardPage } from '@/features/dashboard/components/dashboard-page'
import { useWorkspace } from '@/features/dashboard/workspace'

const description = {
  Artist: 'Music you send to streaming services.',
  Producer: 'Music you send to streaming services.',
  Label: 'Releases for the artists on this label.',
}

export default function Releases() {
  const { current } = useWorkspace()

  return <DashboardPage title="Releases" description={description[current.type]} />
}
