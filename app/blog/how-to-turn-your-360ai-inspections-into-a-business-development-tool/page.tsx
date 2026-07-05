import type { Metadata } from 'next'
import BusinessDevelopmentClient from './BusinessDevelopmentClient'

export const metadata: Metadata = {
  title: 'Turn 360AI Inspections Into a Business Development Tool',
  description: 'Learn how 360AI inspections, virtual tours and branded appraisal kits can help agencies win landlords, attract tenants and support growth.',
}

export default function Page() {
  return <BusinessDevelopmentClient />
}
