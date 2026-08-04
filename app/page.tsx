"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UnitSelectionModal } from "@/components/UnitSelectionModal";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  const router = useRouter();
  const [unitSelectionOpen, setUnitSelectionOpen] = useState(false);

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const userRole = user.role;
        
        if (userRole === 'admin') {
          router.push('/admin/dashboard');
        } else if (userRole === 'management' || userRole === 'property-manager' || userRole === 'supervisor') {
          router.push('/management/dashboard');
        } else if (userRole === 'inspector') {
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  };

  const handleUnitSelectionContinue = (selectedUnits: string[]) => {
    setUnitSelectionOpen(false);
    localStorage.setItem("selectedUnits", JSON.stringify(selectedUnits));
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const userRole = user.role;
        
        if (userRole === 'admin') {
          router.push('/admin/dashboard');
        } else if (userRole === 'management' || userRole === 'property-manager' || userRole === 'supervisor') {
          router.push('/management/dashboard');
        } else if (userRole === 'inspector') {
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch (e) {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <MainLayout>
    <div className="w-full overflow-x-hidden bg-[#E8F4F8]">
    {/* Hero Section */}
    <section className="bg-[#E8F4F8] relative pb-0">
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-10 md:pt-16 lg:pt-20 pb-20 md:pb-28 lg:pb-32">
    <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
    <div className="flex-1 w-full lg:max-w-[600px] pt-4 md:pt-8">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-black mb-4 md:mb-6 leading-[1.1]">
    A project Of StateLicensees
    <br />
    <span className="text-[#006795]">National Standard for the Physical Inspection of Real Estate</span>
    <br />
    <span className="text-[#F84B5F] italic font-bold">Across the Nation</span>
    </h1>

    <p className="text-gray-700 mb-8 md:mb-12 leading-relaxed text-sm md:text-[15px] max-w-xl">
    <strong>Services</strong> — Public and Affordable Housing Inspections • Buyer Inspections
    </p>

    <p className="text-gray-600 mb-4 text-xs md:text-sm max-w-xl">
    <strong>NspireInspectionApp.Com/Public & NspireInspection.Ai</strong>
    </p>

    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        onClick={() => window.open('https://nspireinspectionapp.com/', '_blank')}
        variant="default"
        size="lg"
        className="hover:scale-105 transition-all w-full sm:w-auto cursor-pointer px-8 rounded-full"
      >
        Nspire Public
      </Button>
      <Button
        onClick={() => router.push("/find-inspectors")}
        variant="outline"
        size="lg"
        className="hover:scale-105 transition-all w-full sm:w-auto cursor-pointer px-8 rounded-full border-[#006795] text-[#006795] bg-transparent hover:bg-[#E8F4F8]"
      >
        View Inspectors
      </Button>
    </div>
    </div>

    <div className="flex-1 w-full flex justify-center lg:justify-end">
    <Image
    src="/hero.png"
    alt="INSPIRE App Mockup"
    width={700}
    height={820}
    priority
    className="object-contain drop-shadow-2xl"
    />
    </div>
    </div>
    </div>
    </section>

    {/* THE PROCESS */}
    

    {/* Public Housing Section */}
    <section className="bg-[#0F172A] text-white py-20">
    <div className="max-w-[1400px] mx-auto px-6 text-center">
    <h2 className="text-4xl md:text-5xl font-bold mb-8">Government Housing Compliance</h2>
    <p className="text-lg text-gray-300 max-w-4xl mx-auto">
    {`NSPIREinspection.AI provides professional, Public, and affordable Housing Inspections nationwide, helping housing authorities, property managers, and multifamily communities maintain federal compliance and safe living conditions. Qualified NSPIRE inspectors specialize in Real Estate Assessment inspection, ensuring every property meets federal housing standards.`}
    </p>
    </div>
    </section>

    <UnitSelectionModal
    isOpen={unitSelectionOpen}
    onClose={() => setUnitSelectionOpen(false)}
    onContinue={handleUnitSelectionContinue}
    />
    </div>
    </MainLayout>
  );
}
