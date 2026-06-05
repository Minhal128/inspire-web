import { Metadata } from "next";
import PublicHousingClient from "./PublicHousingClient";

export const metadata: Metadata = {
  title: "Public Affordable Housing Inspection Services | NSPIREinspection.AI",
  description: "Professional public and affordable housing inspection services nationwide. NSPIREinspection.AI helps housing authorities maintain federal compliance and safe living conditions.",
};

export default function PublicHousingPage() {
  return <PublicHousingClient />;
}
