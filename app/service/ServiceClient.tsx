"use client";


import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Buyer Inspection Services",
    subtitle: "Informed Property Decisions",
    description: "Inspire’s Buyer Inspection Services support confident purchasing decisions for residential, multi-family, commercial, and public housing properties across the USA. Our inspections include multi-unit buyer inspection, single-family home buyer inspection, condominium and townhome buyer inspection, and commercial property pre-purchase evaluation. We conduct comprehensive property condition assessments for buyers, covering structural, mechanical, and electrical review while identifying hazards and compliance risks. Each buyer inspection includes Inspire buyer safety compliance checks, repair and maintenance cost estimation, and buyer decision support reports.",
    moreText: "Buyer Risk Analysis, Compliance, and Negotiation Support: Our buyer-focused inspections emphasize hazard and risk identification, safety compliance, and financial clarity. Inspire delivers buyer decision support reports that highlight structural deficiencies, system failures, and safety concerns affecting value and insurability.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "bg-blue-50"
  },
  {
    title: "Owner Inspection Services",
    subtitle: "Asset Protection and Longevity",
    description: "Inspire’s Owner Inspection Services help property owners maintain asset value, ensure compliance, and plan preventive maintenance. Our annual owner property inspection, multi-unit owner inspection, and building health and maintenance evaluation identify issues before they escalate. We perform property condition assessments (PCA), insurance risk checks for owners, and tenant safety and habitability reviews.",
    moreText: "Preventive Maintenance and Owner Compliance Reporting: Our owner inspections focus on actionable intelligence, including pre-renovation inspections and owner repair priority reports. Inspire evaluates structural integrity, MEP systems, and safety features to identify early-stage deterioration.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "bg-red-50"
  },
  {
    title: "Seller Inspection Services",
    subtitle: "Maximize Marketability",
    description: "Inspire’s Seller Inspection Services prepare properties for listing with transparency and confidence. Our pre-listing inspection, multi-unit seller inspection, and property readiness evaluation identify major and minor defects before marketing. We provide HUD/REAC pre-sale support, repair and upgrade recommendations, and pricing advantage inspection reports. Marketability enhancement reviews focus on safety, compliance, and presentation factors that influence buyer perception.",
    moreText: "Seller Transparency and Pricing Advantage Reports: Seller inspections include detailed seller transparency reports designed to minimize post-offer disputes. Inspire documents defects, compliance gaps, and improvement opportunities with clear prioritization.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "bg-orange-50"
  },
  {
    title: "Rental Property Inspection",
    subtitle: "Compliance and Safety",
    description: "Inspire delivers comprehensive rental property inspection services, including move-in inspection, move-out inspection, annual rental safety inspection, and habitability standards review. We assess tenant damage, occupancy health and safety, and multi-unit rental inspection requirements. Inspire rental compliance and HUD/REAC pre-audit support ensure landlords meet federal and local housing standards.",
    moreText: "Rental Risk Management and Documentation Support: Our rental inspections focus on risk mitigation and regulatory readiness. Inspire evaluates life-safety systems, habitability conditions, and compliance gaps that impact leasing and audits.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "bg-green-50"
  },
  {
    title: "Commercial Building Inspection",
    subtitle: "Nationwide Services",
    description: "Inspire provides commercial building inspection services for multi-unit commercial facilities, industrial properties, office buildings, retail spaces, warehouses, and shopping centers. Our inspections include construction quality assessment, safety and code compliance, fire and life safety checks, and roof, HVAC, electrical, and plumbing analysis.",
    moreText: "Commercial Compliance, Systems, and Structural Evaluation: Commercial inspections emphasize operational continuity and regulatory alignment. Inspire identifies deficiencies affecting safety, insurability, and asset performance. Our reporting supports capital planning, compliance remediation, and insurance coordination.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "bg-yellow-50"
  },
  {
    title: "Public Housing Inspection",
    subtitle: "HUD/REAC Support",
    description: "Inspire specializes in public housing inspection services aligned with Inspire standards. We provide HUD/REAC inspection preparation, multi-family housing inspection, apartment community compliance, and federal housing standards review. Our habitability and safety evaluations, energy and environmental standards checks, and occupancy health inspections support REAC scoring improvement and regulatory readiness for public housing authorities (PHAs).",
    moreText: "Public Housing Risk, Compliance, and Documentation: Our public housing inspections deliver risk and deficiency reporting with clear remediation guidance. Inspire supports PHAs with documentation, compliance verification, and audit preparation.",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "bg-purple-50"
  },
  {
    title: "Insurance Risk Management",
    subtitle: "Property Risk Assessment",
    description: "Inspire’s insurance risk management inspections address property risk assessment, hazard and liability review, and multi-unit insurance inspection requirements. We conduct commercial insurance inspections, fire and safety risk reporting, and environmental risk analysis. Our foundation, electrical, and structural risk reviews support insurance claim prevention and pre-coverage inspection needs.",
    moreText: "Insurance Compliance and Claim Prevention Reporting: Insurance-focused inspections emphasize loss prevention and underwriting readiness. Inspire provides annual insurance compliance checks and actionable recommendations to reduce exposure.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "bg-teal-50"
  },
  {
    title: "Specialized & Add-On",
    subtitle: "Environmental, Air Quality & More",
    description: "Inspire offers specialized inspection services, including sewer scope video inspections, pool and spa inspections, mold sampling, roof inspection, and foundation and crawlspace inspection. We also provide luxury home inspections, historic homes inspections, Malibu and beach home inspections, and general home inspections. Commercial add-on inspections and multi-unit specialized evaluations extend our capabilities across property types.",
    moreText: "Environmental, Air Quality, and Advanced Evaluations: Our environmental and air quality sampling services address health, safety, and regulatory concerns. Inspire evaluates indoor air quality, moisture intrusion, and environmental risks affecting occupancy and compliance.",
    image: "https://img.freepik.com/free-photo/building-contractor-doing-home-inspection_53876-137128.jpg?size=626&ext=jpg",
    color: "bg-indigo-50"
  }
];

const processSteps = [
  { num: "Step 1", title: "Schedule Inspection", desc: "Clients book inspections online or by phone, choosing a convenient date and property type for comprehensive evaluation." },
  { num: "Step 2", title: "On-Site Evaluation", desc: "Certified inspectors perform thorough on-site assessments of structural, mechanical, electrical, and safety systems for accurate property analysis." },
  { num: "Step 3", title: "Compliance & Risk Review", desc: "Inspection results are reviewed against Inspire, HUD, REAC, and local codes to identify hazards, code violations, and compliance risks." },
  { num: "Step 4", title: "Digital Report Delivery", desc: "Clients receive detailed digital reports with photos, risk assessments, repair estimates, and actionable insights for informed property decisions." },
  { num: "Step 5", title: "Post-Inspection Support", desc: "Our team provides follow-up guidance, clarifies findings, and advises on repairs, preventive measures, or negotiation strategies." }
];

export default function ServiceClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logo Section */}
      <div className="bg-[#E8F4F8] pt-0 pb-4 flex justify-center">
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
            <div className="flex flex-col gap-6 p-8 pt-36">
              <a
                href="#home"
                className="flex flex-col group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                  HOME
                </span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">
                  Welcome
                </span>
              </a>
              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex flex-col group w-full"
                >
                  <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight flex items-center gap-2">
                    SERVICES{" "}
                    <svg
                      className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                  <span className="text-[11px] text-gray-500 italic tracking-wider">
                    Professional Solutions
                  </span>
                </button>
                {mobileServicesOpen && (
                  <div className="pl-4 pt-3 space-y-3">
                    <Link
                      href="/service"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Service Details
                    </Link>
                    <Link
                      href="/inspection-services"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      All Services
                    </Link>
                    <Link
                      href="/inspection-services/buyers"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Buyers Inspections
                    </Link>
                    <Link
                      href="/inspection-services/owners"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Owners Inspections
                    </Link>
                    <Link
                      href="/inspection-services/sellers"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sellers Inspections
                    </Link>
                    <Link
                      href="/inspection-services/specialized"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Specialized Services
                    </Link>
                    <Link
                      href="/inspection-services/commercial"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Commercial Inspections
                    </Link>
                    <Link
                      href="/inspection-services/public-housing"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Public Housing
                    </Link>
                    <Link
                      href="/inspection-services/rental"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Rental Inspections
                    </Link>
                    <Link
                      href="/inspection-services/insurance-risk"
                      className="block text-sm text-gray-600 hover:text-[#0D6A8D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Insurance Risk
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/about"
                className="flex flex-col group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                  ABOUT
                </span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">
                  Our Story
                </span>
              </Link>
              <Link
                href="/contact"
                className="flex flex-col group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                  CONTACT
                </span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">
                  Get in Touch
                </span>
              </Link>
              <Link
                href="/faq"
                className="flex flex-col group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                  FAQ
                </span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">
                  Answers to Questions
                </span>
              </Link>
              <Link
                href="/blog"
                className="flex flex-col group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                  BLOG
                </span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">
                  Articles & Insights
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Menu - Left aligned */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#home" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                HOME
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Welcome
              </span>
            </a>
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                href="/service"
                className="flex flex-col group items-center cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight flex items-center gap-1">
                  SERVICES{" "}
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      servicesDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
                <span className="text-[10px] text-gray-500 italic tracking-wider">
                  Professional Solutions
                </span>
              </Link>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[220px]">
                    <Link
                      href="/service"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0D6A8D]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Service Details
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/buyers"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0D6A8D]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Buyers Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/owners"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#FF4757]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Owners Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/sellers"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Sellers Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/rental"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Rental Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/specialized"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Specialized Services
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/commercial"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Commercial Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/public-housing"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Public Housing
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/insurance-risk"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                      <span className="text-sm text-gray-700 hover:text-[#0D6A8D]">
                        Insurance Risk
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/about" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight text-center">
                ABOUT
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">
                Our Story
              </span>
            </Link>
            <Link href="/contact" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                CONTACT
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Get in Touch
              </span>
            </Link>
            <Link href="/faq" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                FAQ
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Answers to Questions
              </span>
            </Link>
            <Link href="/blog" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">
                BLOG
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Articles & Insights
              </span>
            </Link>
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


      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0D6A8D] text-white py-20 px-4 md:px-8">
          <div className="absolute inset-0 opacity-20">
            <Image 
              src="/howitworksBG.png" 
              fill 
              className="object-cover" 
              alt="Inspection background" 
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Inspection Services in USA – Inspire
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-3xl mb-8 leading-relaxed">
                Inspire provides professional Inspection Services across the USA, delivering end-to-end solutions for buyers, owners, sellers, landlords, investors, and public housing authorities. Our inspection services are designed to satisfy commercial, navigational, transactional, and problem-solving search intent, ensuring property stakeholders receive accurate, compliant, and decision-ready reports.
              </p>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm mx-auto md:mx-0 max-w-3xl border border-white/20">
                <p className="text-sm md:text-base leading-relaxed text-white">
                  From single-family homes to multi-unit commercial buildings, Inspire combines structural, mechanical, electrical, and safety evaluations under one trusted framework. We support purchase decisions, risk management, compliance verification, and long-term asset planning through data-driven inspections. With industry-aligned documentation and regulatory awareness, Inspire helps clients reduce liability, control costs, and protect property value while meeting federal, state, and local standards across diverse property types in the United States.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Professional Inspection Solutions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive, transparent, and accurate evaluations tailored for every stage of property ownership and investment.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full">
                  <div className="h-64 sm:h-72 w-full relative">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                      <p className="text-white/90 font-medium">{service.subtitle}</p>
                    </div>
                  </div>
                  <div className={`p-8 flex-1 ${service.color}`}>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="bg-white/60 p-5 rounded-2xl border border-white/80">
                      <p className="text-gray-800 text-sm leading-relaxed font-medium">
                        {service.moreText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Inspire Inspection Process</h2>
              <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our inspection process is designed for clarity, efficiency, and compliance, ensuring every client receives accurate, actionable insights. Inspire’s step-by-step workflow minimizes risk, maximizes property understanding, and supports informed decision-making for buyers, owners, sellers, landlords, and commercial operators nationwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:bg-[#0D6A8D] hover:text-white transition-colors group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#0D6A8D] group-hover:text-[#0D6A8D] font-bold text-xl">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-blue-100 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance and Reporting Section */}
        <section className="py-20 px-4 md:px-8 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">Compliance, Standards & Certifications</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Inspire prioritizes regulatory compliance, quality, and safety, ensuring every inspection meets federal, state, and local standards. Our certified inspectors follow Inspire, HUD, REAC, and industry-specific guidelines, delivering trustworthy results. Adherence to these standards mitigates liability, supports insurance requirements, and protects asset value.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Clients benefit from inspections that are not only comprehensive but also recognized by public housing authorities, lenders, and commercial stakeholders across the USA. This emphasis on compliance strengthens client confidence, enhances report credibility, and improves long-term property management and decision-making outcomes.
              </p>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                <h4 className="font-bold text-lg text-[#FF4757] mb-2">Why it matters</h4>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Compliance ensures properties meet legal, safety, and regulatory requirements, reducing risk, avoiding penalties, and enhancing trust for buyers, owners, and public housing authorities.
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Reporting & Deliverables</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Inspire delivers comprehensive, actionable reports for all inspections. Reports include detailed property condition summaries, hazard identification, repair cost estimates, and Inspire compliance status. Clients receive photos, annotated diagrams, and executive summaries to support negotiations, insurance claims, and long-term maintenance planning.
              </p>
              <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/inspectionWorkflow.png" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Reports and deliverables"
                />
              </div>
              <p className="text-sm text-gray-400 mt-6 leading-relaxed">
                These deliverables are formatted for clarity, accessibility, and regulatory alignment, ensuring property stakeholders can act confidently. Reports are provided digitally for easy sharing and storage, enhancing transparency and decision-making efficiency for buyers, owners, landlords, sellers, and commercial property managers across the USA.
              </p>
            </div>
          </div>
        </section>
      </main>

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
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:support@inspire.com"
                    className="hover:text-white"
                  >
                    support@inspire.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
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
                  <svg
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10 pr-4 py-3 rounded-l bg-white text-gray-900 placeholder-gray-500 w-full border-0 outline-none"
                  />
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-r flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
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
              className="object-contain h-16 md:h-20 w-auto brightness-0 invert"
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
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
