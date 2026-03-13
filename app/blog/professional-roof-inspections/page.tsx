import type { Metadata } from 'next'
import ProfessionalRoofInspections from './RoofInspectionsClient'

export const metadata: Metadata = {
  title: 'Professional Roof Inspections Across the U.S. to Prevent Leaks, Moisture Damage, and Costly Repairs',
  description: 'Expert roof inspection services across the U.S. detecting leaks, moisture damage, and structural issues using advanced technology like drone assessments and thermal imaging.',
}

export default function Page() {
  return <ProfessionalRoofInspections />
}
