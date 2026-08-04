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
        NSPIRE (USA)
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

    {/* App Store Badges */}
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      {/* Google Play Store */}
      <a
        href="https://play.google.com/store/apps/details?id=com.minhal.inspire"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-all hover:scale-105 cursor-pointer w-full sm:w-auto"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.18 23.76c.37.21.8.24 1.2.06l12.15-6.93L13.6 12 3.18 23.76z" fill="#EA4335"/>
          <path d="M20.47 9.93l-2.64-1.51-3.6 3.24.77.77 5.48-2.5z" fill="#FBBC05"/>
          <path d="M3.18.24C2.81.45 2.58.84 2.58 1.36v21.28c0 .52.23.91.6 1.12L13.6 12 3.18.24z" fill="#4285F4"/>
          <path d="M17.83 8.42L4.38.18C4 -.05 3.56.02 3.18.24L13.6 12l4.23-3.58z" fill="#34A853"/>
        </svg>
        <div className="text-left">
          <div className="text-[10px] leading-tight text-gray-400">GET IT ON</div>
          <div className="text-sm font-semibold leading-tight">Google Play</div>
        </div>
      </a>

      {/* Apple App Store */}
      <a
        href="https://apps.apple.com/vn/app/nspire-international/id6761992254"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-all hover:scale-105 cursor-pointer w-full sm:w-auto"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <div className="text-left">
          <div className="text-[10px] leading-tight text-gray-400">Download on the</div>
          <div className="text-sm font-semibold leading-tight">App Store</div>
        </div>
      </a>
    </div>
    </div>

    <div className="group flex-1 w-full flex justify-center lg:justify-end relative" style={{ perspective: '1000px' }}>
      <div 
        className="relative w-full max-w-[700px] h-[820px] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]"
        style={{ transformStyle: 'preserve-3d', transformOrigin: 'center' }}
      >
        {/* Front Side (Original Hero) */}
        <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
          <Image
            src="/hero.png"
            alt="INSPIRE App Mockup"
            fill
            priority
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Back Side (New Hover Hero) */}
        <div 
          className="absolute inset-0 backface-hidden" 
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <Image
            src="/hover-hero.png"
            alt="Hover Alternate"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
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
