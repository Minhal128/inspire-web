import { Metadata } from "next";
import BuyersClient from "./BuyersClient";

export const metadata: Metadata = {
  title: "Buyers Inspection Services | NSPIREinspection.AI",
  description: "Support confident purchasing decisions with detailed buyer inspection services nationwide. NSPIREinspection.AI identifies risks and supports informed negotiation.",
};

export default function BuyersPage() {
  return <BuyersClient />;
}
