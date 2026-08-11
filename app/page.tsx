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
  const [heroFlipped, setHeroFlipped] = useState(false);

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
    </div>

    <div className="flex-1 w-full flex justify-center lg:justify-end relative" style={{ perspective: '1000px' }}>
      <div 
        onMouseEnter={() => setHeroFlipped(true)}
        onMouseLeave={() => setHeroFlipped(false)}
        onClick={() => setHeroFlipped(f => !f)}
        className="relative w-full max-w-[700px] h-[320px] sm:h-[500px] lg:h-[820px] transition-transform duration-700 cursor-pointer"
        style={{ 
          transformStyle: 'preserve-3d', 
          transformOrigin: 'center',
          transform: heroFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
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
          className="absolute inset-0 backface-hidden flex items-center justify-center" 
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="relative w-2/3 h-2/3 max-w-[350px] max-h-[350px]">
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
    </div>
    </section>

    {/* APP DOWNLOAD SECTION */}
    <section className="bg-[#E8F4F8] py-16 md:py-24 text-center">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-[#006795] text-xs font-bold tracking-widest uppercase mb-4">TAKE IT WITH YOU</p>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-16">
          <span className="text-[#006795]">Download NSPIRE Inspection (International)</span>
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
          {/* iOS Section */}
          <div className="flex flex-col items-center">
            <a
              href="https://apps.apple.com/vn/app/nspire-international/id6761992254"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-900 transition-all hover:scale-105 cursor-pointer mb-6"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-tight text-gray-200">Download on the</div>
                <div className="text-sm font-semibold leading-tight">App Store</div>
              </div>
            </a>
            <div className="bg-white p-4 rounded-3xl shadow-xl mb-4">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://apps.apple.com/vn/app/nspire-international/id6761992254" alt="iOS QR Code" className="w-40 h-40" />
            </div>
            <p className="text-[#006795] font-medium text-sm">Scan (iOS)</p>
          </div>

          {/* Android Section */}
          <div className="flex flex-col items-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.minhal.inspire"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-900 transition-all hover:scale-105 cursor-pointer mb-6"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.18 23.76c.37.21.8.24 1.2.06l12.15-6.93L13.6 12 3.18 23.76z" fill="#EA4335"/>
                <path d="M20.47 9.93l-2.64-1.51-3.6 3.24.77.77 5.48-2.5z" fill="#FBBC05"/>
                <path d="M3.18.24C2.81.45 2.58.84 2.58 1.36v21.28c0 .52.23.91.6 1.12L13.6 12 3.18.24z" fill="#4285F4"/>
                <path d="M17.83 8.42L4.38.18C4 -.05 3.56.02 3.18.24L13.6 12l4.23-3.58z" fill="#34A853"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-tight text-gray-200">GET IT ON</div>
                <div className="text-sm font-semibold leading-tight">Google Play</div>
              </div>
            </a>
            <div className="bg-white p-4 rounded-3xl shadow-xl mb-4">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://play.google.com/store/apps/details?id=com.minhal.inspire" alt="Android QR Code" className="w-40 h-40" />
            </div>
            <p className="text-[#006795] font-medium text-sm">Scan (Android)</p>
          </div>
        </div>
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
