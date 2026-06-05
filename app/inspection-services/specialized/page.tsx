import { Metadata } from "next";
import SpecializedClient from "./SpecializedClient";

export const metadata: Metadata = {
  title: "Special Inspection Services | NSPIREinspection.AI",
  description: "Comprehensive special inspection services nationwide. NSPIREinspection.AI addresses every residential, commercial, and specialized property need with precision.",
};

export default function SpecializedPage() {
  return <SpecializedClient />;
}
