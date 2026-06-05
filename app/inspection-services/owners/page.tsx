import { Metadata } from "next";
import OwnersClient from "./OwnersClient";

export const metadata: Metadata = {
  title: "Owners Inspection Services | NSPIREinspection.AI",
  description: "Comprehensive owners inspection services nationwide. NSPIREinspection.AI helps property owners and landlords maintain property health and protect investments.",
};

export default function OwnersPage() {
  return <OwnersClient />;
}
