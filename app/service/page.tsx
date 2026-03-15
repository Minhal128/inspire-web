import { Metadata } from 'next';
import ServiceClient from './ServiceClient';

export const metadata: Metadata = {
  title: 'Inspection Services in USA | Inspire',
  description: 'Inspire provides professional Inspection Services across the USA, delivering end-to-end solutions for buyers, owners, sellers, landlords, investors, and public housing authorities.',
};

export default function ServicePage() {
  return <ServiceClient />;
}
