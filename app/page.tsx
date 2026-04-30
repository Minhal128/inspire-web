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
    setUnitSelectionOpen(true);
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
                  Home Inspections
                  <br />
                  <span className="text-[#F84B5F] italic font-bold">Across the USA</span>
                </h1>

                <p className="text-gray-700 mb-8 md:mb-12 leading-relaxed text-sm md:text-[15px] max-w-xl">
                  Inspire stands at the forefront of the home inspection industry, offering home inspections and advanced risk-mitigation solutions. Whether you are a first-time buyer or a seasoned property investor, our certified professionals provide comprehensive inspections backed by nationally recognized training.
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
                    alt="INSPIRE App Mockup"
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

        {/* Why INSPIRE Section */}
        <section className="px-4 md:px-6 pt-20 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20 bg-[#F8F9FA] relative">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-10 md:mb-14 lg:mb-16 pl-0 md:pl-6 lg:pl-10">
              <p className="text-xs font-bold text-[#006795] uppercase tracking-wider mb-2 md:mb-3">
                Comprehensive Services
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-black leading-tight mb-2 md:mb-3">
                What Is a Home Inspection?
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl">
                A professional evaluation helping buyers, sellers, and homeowners identify existing or potential issues. Our services are designed for single-family homes, condos, mobile homes, and newly constructed properties.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start px-0 md:px-6 lg:px-10">
              <div className="flex-1 space-y-4 md:space-y-6 w-full lg:pr-8">
                {[
                  { title: "Complete Inspection Checklist", desc: "Our inspectors evaluate roof conditions, HVAC, structural framing, plumbing, and electrical panels, highlighting things that fail a home inspection.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                  { title: "Certified Mold & Termite", desc: "Specialized home mold inspection, termite inspection, and foundation evaluations to uncover hidden structural or environmental threats.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                  { title: "New Home & Construction", desc: "Detailed new construction home inspections evaluating every phase to catch improper wiring or foundation shifts.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
                  { title: "Detailed Inspection Reports", desc: "Receive transparent digital reports with photos and repair recommendations for buyers, sellers, and agents.", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }
                ].map((benefit, idx) => (
                  <Card key={idx} className="bg-white border-none shadow-sm p-5 md:p-8 flex gap-4 md:gap-6 hover:shadow-md transition-all rounded-[30px] md:rounded-[50px]">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#F84B5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg md:text-xl text-black mb-1 md:mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">{benefit.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-3 md:gap-5">
                  <div className="col-span-1 row-span-2">
                    <div className="bg-white shadow-md rounded-[20px] md:rounded-[32px] overflow-hidden h-full">
                      <Image src="/why.jpg" alt="Modern Property" width={420} height={560} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="bg-white shadow-md rounded-[20px] md:rounded-[32px] overflow-hidden h-[180px] md:h-[268px]">
                      <Image src="/why2.jpg" alt="Interior Design" width={320} height={268} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="bg-white shadow-md rounded-[20px] md:rounded-[32px] overflow-hidden h-[180px] md:h-[268px]">
                      <Image src="/why3.jpg" alt="Living Space" width={320} height={268} className="w-full h-full object-cover" />
                    </div>
                  </div>
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
              <p className="text-xs font-semibold text-[#006795] uppercase tracking-wider mb-3 md:mb-4">The Process</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight text-black mb-6 md:mb-8">
                How Long It Takes &<br />What to <span className="text-[#F84B5F] italic">Expect</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-6 max-w-xl">
                Most standard home inspections take 2 to 4 hours depending on the property's size, age, and condition. Here is our structured process:
              </p>
            </div>
            <div className="hidden lg:flex flex-1 relative h-[400px] items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                <path d="M 350 80 Q 250 80 250 160 Q 250 240 350 240 Q 450 240 450 320" fill="none" stroke="#006795" strokeWidth="12" strokeLinecap="round" />
              </svg>
              {/* Steps */}
              <div className="absolute top-[50px] right-[30px] flex items-center gap-4 z-20">
                <div className="w-24 h-24 rounded-full bg-[#006795] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                  <div className="text-3xl font-bold">1</div>
                  <div className="text-xs font-semibold italic">Schedule</div>
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                  <p className="text-xs text-gray-800 leading-relaxed"><span className="font-bold">Book an inspection</span><br />with our local professionals.</p>
                </div>
              </div>
              <div className="absolute top-[180px] right-[30px] flex items-center gap-4 z-20">
                <div className="w-24 h-24 rounded-full bg-[#006795] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-xs font-semibold italic">Evaluate</div>
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                  <p className="text-xs text-gray-800 leading-relaxed"><span className="font-bold">System-by-system check</span><br />and detailed moisture or safety testing.</p>
                </div>
              </div>
              <div className="absolute top-[310px] right-[30px] flex items-center gap-4 z-20">
                <div className="w-24 h-24 rounded-full bg-[#006795] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-xs font-semibold italic">Report</div>
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                  <p className="text-xs text-gray-800 leading-relaxed"><span className="font-bold">Receive digital reports</span><br />with clear repair recommendations.</p>
                </div>
              </div>
            </div>
            {/* Mobile Steps */}
            <div className="lg:hidden flex-1 space-y-6 w-full">
              {[
                { num: "1", title: "Schedule", desc: "Book your inspection locally. Most standard evaluations take 2-4 hours." },
                { num: "2", title: "Evaluate", desc: "System-by-system check and detailed moisture or safety testing." },
                { num: "3", title: "Report", desc: "Receive digital reports with clear repair recommendations to ease negotiations." }
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

        {/* NSPIRE Standards Section */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-pink-200 via-pink-100 to-transparent"></div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight text-black mb-6 md:mb-8">
                Specialized FHA <br/>& VA Home Loan <br />Requirements
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-[15px] max-w-xl mb-4">
                Inspire assists buyers navigating federal loan programs with inspection services aligned fully with FHA home inspection requirements and VA home loan inspection requirements.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm md:text-[15px] max-w-xl">
                Our certified inspectors evaluate roofing integrity, heating systems, electrical safety, and environmental concerns to ensure homes meet fundamental safety, security, and structural standards.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <Image src="/nationalstandard.png" alt="NSPIRE Standards" width={400} height={400} priority className="drop-shadow-2xl w-48 h-48 md:w-64 md:h-64 lg:w-full lg:h-full" />
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="relative bg-[#006795] overflow-visible">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-20 md:py-28 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
            <div className="relative flex justify-center items-center order-2 lg:order-1">
              <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] bg-gradient-to-br from-[#FF6B8A] to-[#F84B5F] rounded-full blur-sm opacity-90"></div>
              <div className="relative z-10 -mb-0 lg:-mb-12 max-w-[250px] md:max-w-[300px] lg:max-w-none">
                <Image src="/inspectionWorkflow.png" alt="Inspection Workflow" width={320} height={650} priority className="object-contain drop-shadow-2xl w-full h-auto" />
              </div>
            </div>
            <div className="text-white z-10 order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight mb-4 md:mb-6">
                Local Home Inspection<br />Services Near You
              </h2>
              <p className="text-white/90 mb-8 md:mb-10 leading-relaxed text-sm md:text-[15px] max-w-xl">
                From Chicago to Houston, Denver, Orlando FL, and San Diego, our verified network provides fast, reliable, and compliant inspection services across the USA.
              </p>
              <div className="space-y-3 md:space-y-4">
                {[
                  "General, Mobile, & Elite Home Inspections",
                  "Aligns with InterNACHI Training Standards",
                  "Expertise in Foundation & Safety Deficiencies",
                  "Dedicated Solutions for Buyers, Sellers & Agents",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#006795] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white text-sm md:text-[16px] font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-white px-4 md:px-6 py-16 md:py-20 lg:py-24">
          <div className="max-w-[1400px] mx-auto flex justify-center px-0 md:px-6 lg:px-10">
            <div className="relative bg-gradient-to-r from-[#FF6B8A] to-[#F84B5F] rounded-[24px] md:rounded-[32px] px-8 md:px-16 lg:px-20 py-10 md:py-12 lg:py-14 shadow-2xl overflow-hidden w-full">
              <div className="absolute top-0 right-10 md:right-20 w-40 h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-[#FF9BAB] rounded-full opacity-40 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-[#FF9BAB] rounded-full opacity-40 translate-y-1/2 translate-x-1/4"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="text-white text-center md:text-left">
                  <h2 className="text-lg md:text-[20px] font-bold leading-tight mb-2 md:mb-3">
                    Transparent Home Inspection Pricing:<br/>What It Costs & What You Get
                  </h2>
                  <div className="mt-4 max-w-md text-sm md:text-base opacity-90 mb-4 font-normal">
                    Rates vary based on location, home size, age, and extra services. Use our cost calculator for quick, transparent estimates.
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-none">
                    $300<span className="text-2xl md:text-[32px]"> - $600 /avg.</span>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="lg" className="bg-white text-[#F84B5F] hover:bg-gray-50 border-none hover:scale-105 transition-all w-full md:w-auto">
                    Get Free Quote
                  </Button>
                </div>
              </div>
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
