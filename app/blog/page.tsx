import type { Metadata } from 'next'
import BlogIndex from './BlogIndexClient'

export const metadata: Metadata = {
  title: 'Inspection Guide | NSPIREinspection.AI',
  description: 'NSPIRE-Aligned Property Inspection Guide - Comprehensive guide to apartment inspections following National Standard for Inspection of Real Estate (NSPIRE).',
}

export default function Page() {
  return <BlogIndex />
}
