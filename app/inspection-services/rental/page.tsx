import { Metadata } from "next";
import RentalClient from "./RentalClient";

export const metadata: Metadata = {
  title: "Rental Property Inspection Services | NSPIREinspection.AI",
  description: "Comprehensive rental property inspection services nationwide. NSPIREinspection.AI helps landlords and property managers maintain safe and compliant rental properties.",
};

export default function RentalPage() {
  return <RentalClient />;
}
