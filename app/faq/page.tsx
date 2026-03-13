import type { Metadata } from 'next'
import FAQClient from './FAQClient'

export const metadata: Metadata = {
  title: 'FAQ | Nspire Home Inspections',
  description: 'Frequently asked questions about home inspections, pre-buy inspections, cost, and commercial services from Nspire experts.',
}

export default function Page() {
  return <FAQClient />
}
