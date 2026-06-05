import { Metadata } from 'next';
import ServiceClient from './ServiceClient';

export const metadata: Metadata = {
  title: "Inspection Services | NSPIREinspection.AI",
  description: "Professional inspection services nationwide. NSPIREinspection.AI delivers end-to-end solutions for buyers, owners, sellers, landlords, and public housing authorities.",
};

export default function ServicePage() {
  return <ServiceClient />;
}
