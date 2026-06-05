import { Metadata } from "next";
import InsuranceRiskClient from "./InsuranceRiskClient";

export const metadata: Metadata = {
  title: "Insurance Risk Management Services | NSPIREinspection.AI",
  description: "Identify and mitigate property risks with NSPIREinspection.AI. Comprehensive insurance risk management services for residential, commercial, and enterprise properties.",
};

export default function InsuranceRiskPage() {
  return <InsuranceRiskClient />;
}
