import { Metadata } from "next";
import InspectionServicesClient from "./InspectionServicesClient";

export const metadata: Metadata = {
  title: "Inspection Services | NSPIREinspection.AI",
  description: "Professional inspection services nationwide. NSPIREinspection.AI delivers end-to-end solutions for buyers, owners, sellers, landlords, and public housing authorities.",
};

export default function InspectionServicesPage() {
  return <InspectionServicesClient />;
}
