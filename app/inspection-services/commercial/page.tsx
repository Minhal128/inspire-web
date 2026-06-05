import { Metadata } from "next";
import CommercialClient from "./CommercialClient";

export const metadata: Metadata = {
  title: "Commercial Building Inspection Services | NSPIREinspection.AI",
  description: "Top-tier commercial buildings multi-unit, mixed-use inspection services nationwide. Ensuring safety, functionality, and compliance with NSPIREinspection.AI.",
};

export default function CommercialPage() {
  return <CommercialClient />;
}
