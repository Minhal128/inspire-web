import type { Metadata } from 'next'
import HomeInspectionChecklist from './ChecklistClient'

export const metadata: Metadata = {
  title: 'Home Inspection Checklist for Buyers: What to Look for Before Buying a Home',
  description: 'A comprehensive home inspection checklist for buyers, covering exterior and interior evaluations to help you make a confident home purchase decision.',
}

export default function Page() {
  return <HomeInspectionChecklist />
}
