import type { Metadata } from 'next'
import AITimeSavingsClient from './AITimeSavingsClient'

export const metadata: Metadata = {
  title: 'Where AI Is Saving Property Managers the Most Time',
  description: 'AI time savings for property managers biggest impact—from inspections to maintenance and leasing workflows like Inspection Express 360AI.',
}

export default function Page() {
  return <AITimeSavingsClient />
}
