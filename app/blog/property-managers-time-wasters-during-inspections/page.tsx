import type { Metadata } from 'next'
import TimeWastersClient from './TimeWastersClient'

export const metadata: Metadata = {
  title: 'Biggest Property Manager Time Wasters During Inspections',
  description: 'Property Manager Time Wasters affect your workflow and discover strategies to save hours, reduce admin, and improve efficiency.',
}

export default function Page() {
  return <TimeWastersClient />
}
