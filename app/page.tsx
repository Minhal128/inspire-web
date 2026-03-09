"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UnitSelectionModal } from "@/components/UnitSelectionModal";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unitSelectionOpen, setUnitSelectionOpen] = useState(false);

  const handleGetStarted = () => {
    setUnitSelectionOpen(true);
  };

  const handleUnitSelectionContinue = (selectedUnits: string[]) => {
    setUnitSelectionOpen(false);
    // Store selected units in localStorage or state management
    localStorage.setItem('selectedUnits', JSON.stringify(selectedUnits));
    // Redirect to profile selection
    router.push("/profile-selection");
  };

  return (
    <main className="w-full overflow-x-hidden bg-[#E8F4F8]">
      {/* Logo Section */}
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center">
        <Image
          src="/logo.png"
          alt="INSPIRE"
          width={500}
          height={600}
          priority
          className="h-14 md:h-32 lg:h-40 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}

          {/* Mobile Menu */}
          <div
            className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex flex-col gap-6 p-8 pt-20">
              <a
                href="#home"
                className="text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </a>
              <a
                href="#services"
                className="text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                SERVICES
              </a>
              <a
                href="#education"
                className="text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                EDUCATION AND TRAINING
              </a>
              <a
                href="#purpose"
                className="text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                PURPOSE OF INSPECTION
              </a>
              <a
                href="#contact"
                className="text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </a>
              <a
                href="#resources"
                className="text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                RESOURCES
              </a>
            </div>
          </div>

          {/* Desktop Menu - Left aligned */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#home"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              HOME
            </a>
            <a
              href="#services"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              SERVICES
            </a>
            <a
              href="#education"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              EDUCATION AND TRAINING
            </a>
            <a
              href="#purpose"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              PURPOSE OF INSPECTION
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              CONTACT
            </a>
            <a
              href="#resources"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              RESOURCES
            </a>
          </div>

          {/* Login/Register Button */}
          <Button
            onClick={() => router.push("/profile-selection")}
            className="bg-[#1E88A8] hover:bg-[#176B87] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden sm:inline">Login/Register</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#E8F4F8] relative pb-0">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-10 md:pt-16 lg:pt-20 pb-20 md:pb-28 lg:pb-32">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 w-full lg:max-w-[600px] pt-4 md:pt-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-black mb-4 md:mb-6 leading-[1.1]">
                Efficient Property
                <br />
                Inspections Made
                <br />
                <span className="text-[#FF4757] italic font-bold">Simple</span>
              </h1>

              <p className="text-gray-700 mb-8 md:mb-12 leading-relaxed text-sm md:text-[15px] max-w-xl">
                Empower your team with INSPIRE the self-inspection app built on
                NSPIRE national standards. Ensure safety, streamline workflows,
                and stay compliant, all in one platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-8 md:mb-16">
                <Button
                  onClick={handleGetStarted}
                  className="bg-[#0D6A8D] hover:bg-[#0A5670] text-white rounded-full px-8 md:px-11 py-5 md:py-6 text-sm md:text-[15px] font-semibold shadow-lg transition-all hover:shadow-xl w-full sm:w-auto cursor-pointer"
                >
                  Get Started
                </Button>
                {/* <Button
                  onClick={handleGetStarted}
                  className="bg-[#FF4757] hover:bg-[#EE3646] text-white rounded-full px-8 md:px-11 py-5 md:py-6 text-sm md:text-[15px] font-semibold shadow-lg transition-all hover:shadow-xl w-full sm:w-auto cursor-pointer"
                >
                  Get Started
                </Button> */}
              </div>
            </div>

            {/* Right Content - Phone Mockup - Positioned to overlap sections */}
            <div className="flex-1 w-full flex justify-center lg:justify-end items-start relative">
              {/* Decorative gradient blob */}
              <div className="absolute right-0 top-1/4 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-300/40 via-purple-300/30 to-blue-400/40 rounded-full blur-3xl"></div>

              {/* Phone Mockup - Larger and positioned to overlap */}
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

          {/* Social Proof Section - Below Hero Content */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 pt-8 md:pt-16 pb-4 md:pb-8">
            {/* Happy Customers Box */}
            <div className="bg-white rounded-[30px] md:rounded-[50px] px-5 md:px-8 py-4 md:py-5 shadow-md flex items-center gap-3 md:gap-4 w-full sm:w-auto">
              <div className="flex -space-x-2 md:-space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white overflow-hidden">
                  <Image
                    src="/freepik1.jpg"
                    alt="Customer"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white overflow-hidden">
                  <Image
                    src="/freepik2.jpg"
                    alt="Customer"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white overflow-hidden">
                  <Image
                    src="/freepik3.jpg"
                    alt="Customer"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white overflow-hidden">
                  <Image
                    src="/freepik4.jpg"
                    alt="Customer"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-[3px] border-white overflow-hidden">
                  <Image
                    src="/freepik5.jpg"
                    alt="Customer"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-xs md:text-[14px] leading-tight">
                <div className="font-bold text-black">72+ Happy</div>
                <div className="font-bold text-black">Customers</div>
              </div>
            </div>

            {/* New Inspections Box */}
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
                <div className="font-bold text-black">200+ New</div>
                <div className="font-bold text-black">
                  Inspections Everyday!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why INSPIRE Section */}
      <section className="px-4 md:px-6 pt-20 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20 bg-[#F8F9FA] relative">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-10 md:mb-14 lg:mb-16 pl-0 md:pl-6 lg:pl-10">
            <p className="text-xs font-bold text-[#0D6A8D] uppercase tracking-wider mb-2 md:mb-3">
              Key Benefits
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-black leading-tight mb-2 md:mb-3">
              Why INSPIRE?
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Why Property Managers Choose INSPIRE
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start px-0 md:px-6 lg:px-10">
            {/* Left Side - Benefits */}
            <div className="flex-1 space-y-4 md:space-y-6 w-full lg:pr-8">
              {/* Compliance First */}
              <Card className="bg-white border-none shadow-sm p-5 md:p-8 flex gap-4 md:gap-6 hover:shadow-md transition-all rounded-[30px] md:rounded-[50px]">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#FF4757]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-black mb-1 md:mb-2">
                    Compliance First
                  </h3>
                  <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                    Every inspection is aligned with NSPIRE national standards.
                  </p>
                </div>
              </Card>

              {/* Safety Guaranteed */}
              <Card className="bg-white border-none shadow-sm p-5 md:p-8 flex gap-4 md:gap-6 hover:shadow-md transition-all rounded-[30px] md:rounded-[50px]">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#FF4757]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-black mb-1 md:mb-2">
                    Safety Guaranteed
                  </h3>
                  <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                    Protect your residents with health & safety-focused
                    checklists.
                  </p>
                </div>
              </Card>

              {/* Streamlined Efficiency */}
              <Card className="bg-white border-none shadow-sm p-5 md:p-8 flex gap-4 md:gap-6 hover:shadow-md transition-all rounded-[30px] md:rounded-[50px]">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#FF4757]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-black mb-1 md:mb-2">
                    Streamlined Efficiency
                  </h3>
                  <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                    Manage multiple properties and inspections with ease.
                  </p>
                </div>
              </Card>

              {/* Powerful Reporting */}
              <Card className="bg-white border-none shadow-sm p-5 md:p-8 flex gap-4 md:gap-6 hover:shadow-md transition-all rounded-[30px] md:rounded-[50px]">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#FF4757]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-black mb-1 md:mb-2">
                    Powerful Reporting
                  </h3>
                  <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                    Get instant insights and share compliance-ready reports.
                  </p>
                </div>
              </Card>
            </div>

            {/* Right Side - Images Grid */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-3 md:gap-5">
                {/* Top Left - Large Image spanning 2 rows */}
                <div className="col-span-1 row-span-2">
                  <div className="bg-white shadow-md rounded-[20px] md:rounded-[32px] overflow-hidden h-full">
                    <Image
                      src="/why.jpg"
                      alt="Modern Property"
                      width={420}
                      height={560}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Top Right - Small Image */}
                <div className="col-span-1">
                  <div className="bg-white shadow-md rounded-[20px] md:rounded-[32px] overflow-hidden h-[180px] md:h-[268px]">
                    <Image
                      src="/why2.jpg"
                      alt="Interior Design"
                      width={320}
                      height={268}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Bottom Right - Small Image */}
                <div className="col-span-1">
                  <div className="bg-white shadow-md rounded-[20px] md:rounded-[32px] overflow-hidden h-[180px] md:h-[268px]">
                    <Image
                      src="/why3.jpg"
                      alt="Living Space"
                      width={320}
                      height={268}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/howitworksBG.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          {/* Red gradient overlay on right side */}
          <div className="absolute inset-0 bg-gradient-to-l from-pink-300/60 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-20 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-xl w-full">
            <p className="text-xs font-semibold text-[#0D6A8D] uppercase tracking-wider mb-3 md:mb-4">
              How it Works
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight text-black mb-6 md:mb-8">
              Inspections in
              <br />
              Just <span className="text-[#FF4757] italic">Three Steps</span>
            </h2>
          </div>

          {/* Right Side - Curved Path with Steps - Hidden on mobile, use simple list */}
          <div className="hidden lg:flex flex-1 relative h-[400px] items-center justify-center">
            {/* SVG Curved Path */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Curved path - S-curve shape */}
              <path
                d="M 350 80 Q 250 80 250 160 Q 250 240 350 240 Q 450 240 450 320"
                fill="none"
                stroke="#0D6A8D"
                strokeWidth="12"
                strokeLinecap="round"
              />
            </svg>

            {/* Step 1 - Register */}
            <div className="absolute top-[50px] right-[30px] flex items-center gap-4 z-20">
              <div className="w-24 h-24 rounded-full bg-[#0D6A8D] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                <div className="text-3xl font-bold">1</div>
                <div className="text-xs font-semibold italic">Register</div>
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                <p className="text-xs text-gray-800 leading-relaxed">
                  <span className="font-bold">Create your account</span>
                  <br />
                  and add your properties.
                </p>
              </div>
            </div>

            {/* Step 2 - Inspect */}
            <div className="absolute top-[180px] right-[30px] flex items-center gap-4 z-20">
              <div className="w-24 h-24 rounded-full bg-[#0D6A8D] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                <div className="text-3xl font-bold">2</div>
                <div className="text-xs font-semibold italic">Inspect</div>
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                <p className="text-xs text-gray-800 leading-relaxed">
                  <span className="font-bold">Use guided checklists,</span>
                  <br />
                  capture photos, and flag issues.
                </p>
              </div>
            </div>

            {/* Step 3 - Report */}
            <div className="absolute top-[310px] right-[30px] flex items-center gap-4 z-20">
              <div className="w-24 h-24 rounded-full bg-[#0D6A8D] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white">
                <div className="text-3xl font-bold">3</div>
                <div className="text-xs font-semibold italic">Report</div>
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 shadow-lg max-w-[200px]">
                <p className="text-xs text-gray-800 leading-relaxed">
                  <span className="font-bold">Generate and share</span>
                  <br />
                  compliance-ready reports instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Steps - Simple list for mobile */}
          <div className="lg:hidden flex-1 space-y-6 w-full">
            {[
              {
                num: "1",
                title: "Register",
                desc: "Create your account and add your properties.",
              },
              {
                num: "2",
                title: "Inspect",
                desc: "Use guided checklists, capture photos, and flag issues.",
              },
              {
                num: "3",
                title: "Report",
                desc: "Generate and share compliance-ready reports instantly.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-5 shadow-lg flex gap-4 items-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#0D6A8D] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white flex-shrink-0">
                  <div className="text-2xl font-bold">{step.num}</div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-700">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NSPIRE Standards Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Pink gradient shape on right side */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-pink-200 via-pink-100 to-transparent"></div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight text-black mb-6 md:mb-8">
              Aligned with NSPIRE
              <br />
              National Standards
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-[15px] max-w-xl">
              INSPIRE is designed to help property managers and owners meet
              HUD's NSPIRE requirements with confidence. Every checklist, every
              report, and every inspection is built around the highest standards
              of safety and compliance.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Image
              src="/nationalstandard.png"
              alt="NSPIRE Standards"
              width={400}
              height={400}
              priority
              className="drop-shadow-2xl w-48 h-48 md:w-64 md:h-64 lg:w-full lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* Workflow Section - with overlapping phone mockup */}
      <section className="relative bg-[#006795] overflow-visible">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 py-20 md:py-28 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
          {/* Left Side - Phone Mockup with Red Circular Background */}
          <div className="relative flex justify-center items-center order-2 lg:order-1">
            {/* Red circular background blob */}
            <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] bg-gradient-to-br from-[#FF6B8A] to-[#FF4757] rounded-full blur-sm opacity-90"></div>

            {/* Phone Mockup - positioned to extend beyond section */}
            <div className="relative z-10 -mb-0 lg:-mb-12 max-w-[250px] md:max-w-[300px] lg:max-w-none">
              <Image
                src="/inspectionWorkflow.png"
                alt="Inspection Workflow"
                width={320}
                height={650}
                priority
                className="object-contain drop-shadow-2xl w-full h-auto"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="text-white z-10 order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight mb-4 md:mb-6">
              Your Entire Inspection
              <br />
              Workflow, Simplified
            </h2>
            <p className="text-white/90 mb-8 md:mb-10 leading-relaxed text-sm md:text-[15px] max-w-xl">
              Whether you're managing a single building or a portfolio of
              properties, INSPIRE brings every tool you need into one platform.
            </p>

            <div className="space-y-3 md:space-y-4">
              {[
                "Guided Self-Inspection Tool",
                "Multi-Property Management",
                "Compliance Dashboard & Analytics",
                "Easy Report Generation (PDF/Email)",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-[#7FFF00] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-white text-sm md:text-[16px] font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white px-4 md:px-6 py-16 md:py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto flex justify-center px-0 md:px-6 lg:px-10">
          {/* Pricing Card */}
          <div className="relative bg-gradient-to-r from-[#FF6B8A] to-[#FF4757] rounded-[24px] md:rounded-[32px] px-8 md:px-16 lg:px-20 py-10 md:py-12 lg:py-14 shadow-2xl overflow-hidden w-full">
            {/* Decorative circles */}
            <div className="absolute top-0 right-10 md:right-20 w-40 h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-[#FF9BAB] rounded-full opacity-40 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-[#FF9BAB] rounded-full opacity-40 translate-y-1/2 translate-x-1/4"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              {/* Left side - Text */}
              <div className="text-white text-center md:text-left">
                <h2 className="text-lg md:text-[20px] font-bold leading-tight mb-2 md:mb-3">
                  Start your inspections
                  <br />
                  today for just
                </h2>
                <div className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-none">
                  $99<span className="text-2xl md:text-[32px]">/year.</span>
                </div>
              </div>

              {/* Right side - Button */}
              <div>
                <Button className="bg-white text-[#FF4757] hover:bg-gray-50 rounded-full px-8 md:px-10 py-5 md:py-6 text-sm md:text-[16px] font-bold shadow-lg hover:shadow-xl transition-all w-full md:w-auto">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Quick Links */}
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href="mailto:support@inspire.com"
                    className="hover:text-white"
                  >
                    support@inspire.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:9202202220" className="hover:text-white">
                    9202202220
                  </a>
                </p>
              </div>
            </div>

            {/* Subscribe */}
            <div>
              <h3 className="font-bold mb-4">Subscribe</h3>
              <div className="flex mb-4">
                <div className="relative flex-1">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10 pr-4 py-3 rounded-l bg-white text-gray-900 placeholder-gray-500 w-full border-0 outline-none"
                  />
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-r flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                Hello we are UI Monks. Our goal is to translate the positive
                effects from revolutionizing how companies engage with their
                clients & their team.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <Image
              src="/logo.png"
              alt="INSPIRE"
              width={200}
              height={100}
              className="object-contain h-16 md:h-20 w-auto"
            />

            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white">
                Terms
              </a>
              <a href="#" className="hover:text-white">
                Privacy
              </a>
              <a href="#" className="hover:text-white">
                Cookies
              </a>
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="X (Twitter)">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Unit Selection Modal */}
      <UnitSelectionModal
        isOpen={unitSelectionOpen}
        onClose={() => setUnitSelectionOpen(false)}
        onContinue={handleUnitSelectionContinue}
      />
    </main>
  );
}
