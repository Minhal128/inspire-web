import type { Metadata } from 'next'
import SewerScopeBlogPost from './SewerScopeClient'

export const metadata: Metadata = {
  title: 'What Is a Sewer Scope Inspection and Why It Matters for Homeowners Across the U.S.',
  description: 'Learn what a sewer scope inspection is, how it works, and why it is essential for home buyers and owners to prevent costly pipe repairs and backups.',
}

export default function Page() {
  return <SewerScopeBlogPost />
}
