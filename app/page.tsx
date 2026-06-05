"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UnitSelectionModal } from "@/components/UnitSelectionModal";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  const router = useRouter();
  const [unitSelectionOpen, setUnitSelectionOpen] = useState(false);

  const handleGetStarted = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  };

  const handleUnitSelectionContinue = (selectedUnits: string[]) => {
    setUnitSelectionOpen(false);
    // Store selected units in localStorage or state management
    localStorage.setItem("selectedUnits", JSON.stringify(selectedUnits));
    // Redirect to profile selection
    router.push("/profile-selection");
  };

  return (
    <MainLayout>
      <div className="w-full overflow-x-hidden bg-[#E8F4F8]">
        {/* Hero Section */}
        <section className="bg-[#E8F4F8] relative pb-0">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-10 md:pt-16 lg:pt-20 pb-20 md:pb-28 lg:pb-32">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
              {/* Left Content */}
              <div className="flex-1 w-full lg:max-w-[600px] pt-4 md:pt-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-black mb-4 md:mb-6 leading-[1.1]">
                  Trusted and Certified
                  <br />
                  Multi-Unit Inspections
                  <br />
                  <span className="text-[#F84B5F] italic font-bold">Across the NATION</span>
                </h1>

                <p className="text-gray-700 mb-8 md:mb-12 leading-relaxed text-sm md:text-[15px] max-w-xl">
                  NSPIREinspection.AI stands at the forefront of the multi-unit inspection industry, offering multi-unit property inspections and advanced risk-mitigation solutions. Whether you are a first-time investor or a seasoned property manager, NSPIREinspection.AI provides professional and comprehensive PDF reports and Excel worksheets.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-8 md:mb-16">
                  <Button
                    onClick={handleGetStarted}
                    variant="default"
                    size="lg"
                    className="hover:scale-105 transition-all w-full sm:w-auto cursor-pointer"
                  >
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Right Content - Phone Mockup */}
              <div className="flex-1 w-full flex justify-center lg:justify-end items-start relative">
                <div className="absolute right-0 top-1/4 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-300/40 via-purple-300/30 to-blue-400/40 rounded-full blur-3xl"></div>
                <div className="relative z-10 -mt-0 lg:-mt-25 max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-none">
                  <Image
                    src="/hero.png"
                    alt="NSPIREinspection.AI App Mockup"
                    width={700}
                    height={820}
                    priority
                    className="object-contain drop-shadow-2xl w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Social Proof Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 pt-8 md:pt-16 pb-4 md:pb-8">
              <div className="bg-white rounded-[30px] md:rounded-[50px] px-5 md:px-8 py-4 md:py-5 shadow-md flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                <div className="flex -space-x-2 md:-space-x-3">
                  {[1, 2, 3, 1, 2].map((i, idx) => (
                    <div key={idx} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white overflow-hidden">
                      <Image
                        src={`/why${i === 1 ? "" : i === 2 ? "2" : "3"}.jpg`}
                        alt="Customer"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-xs md:text-[14px] leading-tight">
                  <div className="font-bold text-black">72+ Certified</div>
                  <div className="font-bold text-black">Inspectors</div>
                </div>
              </div>

              <div className="bg-white rounded-[30px] md:rounded-[50px] px-5 md:px-8 py-4 md:py-5 shadow-md flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/nationalstandard.png"
                    alt="Inspections"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs md:text-[14px] leading-tight">
                  <div className="font-bold text-black">200+ Local</div>
                  <div className="font-bold text-black">Inspections Daily!</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* How It Works Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/howitworksBG.png" alt="Background" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-l from-pink-300/60 via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-20 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="flex-1 max-w-xl w-full">
              <p className="text-xs font-semibold text-[#006795] uppercase tracking-wider mb-3 md:mb-4">THE PROCESS</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight text-black mb-6 md:mb-8">
                What to <span className="text-[#F84B5F] italic">Expect</span>
              </h2>
            </div>
            <div className="hidden lg:flex flex-1 relative h-[400px] items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                <path d="M 350 80 Q 250 80 250 160 Q 250 240 350 240 Q 450 240 450 320" fill="none" stroke="#006795" strokeWidth="12" strokeLinecap="round" />
              </svg>
              {/* Steps */}
              <div className="absolute top-[50px] right-[30px] flex items-center gap-4 z-20">
                <div className="w-24 h-24 rounded-full bg-[#006795] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                  <div className="text-xs font-semibold italic">Schedule</div>
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                  <p className="text-xs text-gray-800 leading-relaxed"><span className="font-bold">Start inspection</span></p>
                </div>
              </div>
              <div className="absolute top-[180px] right-[30px] flex items-center gap-4 z-20">
                <div className="w-24 h-24 rounded-full bg-[#006795] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-xs font-semibold italic">Evaluate</div>
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                  <p className="text-xs text-gray-800 leading-relaxed"><span className="font-bold">System by System check</span></p>
                </div>
              </div>
              <div className="absolute top-[310px] right-[30px] flex items-center gap-4 z-20">
                <div className="w-24 h-24 rounded-full bg-[#006795] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-xs font-semibold italic">Report</div>
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                  <p className="text-xs text-gray-800 leading-relaxed"><span className="font-bold">Receive digital report (PDF)</span><br />and clear repair recommendation (Excel format)</p>
                </div>
              </div>
            </div>
            {/* Mobile Steps */}
            <div className="lg:hidden flex-1 space-y-6 w-full">
              {[
                { num: "1", title: "Schedule", desc: "Start inspection" },
                { num: "2", title: "Evaluate", desc: "System by System check" },
                { num: "3", title: "Report", desc: "Receive digital report (PDF) and clear repair recommendation (Excel format)" }
              ].map((step) => (
                <div key={step.num} className="bg-white rounded-2xl p-5 shadow-lg flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-[#006795] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white flex-shrink-0">
                    <div className="text-2xl font-bold">{step.num}</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-700">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>




        {/* Unit Selection Modal */}
        <UnitSelectionModal
          isOpen={unitSelectionOpen}
          onClose={() => setUnitSelectionOpen(false)}
          onContinue={handleUnitSelectionContinue}
        />
      </div>
    </MainLayout>
  );
}
