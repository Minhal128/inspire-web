import { Metadata } from "next";
import SellersClient from "./SellersClient";

export const metadata: Metadata = {
  title: "Sellers Inspection Services | NSPIREinspection.AI",
  description: "Get accurate insights before listing your property. NSPIREinspection.AI provides comprehensive sellers inspection services, REAC prep, and transparency reports.",
};

export default function SellersPage() {
  return <SellersClient />;
}
