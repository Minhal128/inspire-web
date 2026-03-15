"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    "title": "Comprehensive Public Housing Inspection Services USA",
    "content": "Our housing inspection services in the USA are designed to cover all aspects of public and multifamily housing compliance. Inspire conducts detailed inspections to ensure your property aligns with HUD, Section 8, and local housing authority regulations. We focus on habitability, safety, and code compliance, providing actionable recommendations to address deficiencies. By using a standardized Inspire framework, we support property managers in preparing for federal inspections, minimizing risks, and maintaining excellent REAC scores. Our team combines technical expertise with practical knowledge of multifamily housing operations to deliver accurate, reliable, and compliant inspection services."
  },
  {
    "title": "HUD Property Inspection Prep And Compliance",
    "content": "Inspire offers specialized HUD property inspection prep to streamline federal audits and REAC inspections. Our inspectors conduct pre-assessment evaluations, identifying gaps in compliance and correcting deficiencies before official HUD visits. We focus on safety, structural integrity, and regulatory adherence, providing a detailed report for property managers. With our guidance, properties achieve higher REAC scores and improved HUD compliance ratings. Our team ensures that all Section 8 housing, affordable housing, and federal properties are prepared for rigorous inspections, maintaining accountability, transparency, and resident safety while reducing the likelihood of penalties or non-compliance issues."
  },
  {
    "title": "Multifamily Property Compliance Inspections",
    "content": "Our multifamily property compliance inspections cover every element of apartment communities and residential complexes. Inspire ensures your property meets HUD and Inspire public housing inspection standards, addressing habitability, energy efficiency, and code adherence. Our team evaluates occupancy health, safety protocols, and documentation accuracy for PHAs. These inspections not only improve compliance but also enhance tenant satisfaction and property reputation. From common areas to individual units, we provide thorough assessments, detailed reports, and practical recommendations, helping housing authorities and property managers maintain federal compliance, minimize risk, and ensure that multifamily communities are safe, healthy, and well-maintained for all residents."
  },
  {
    "title": "Public Housing Compliance Inspection Services USA",
    "content": "We provide property compliance inspection services in the USA for public housing authorities and private operators. Inspire’s inspection services focus on HUD/REAC readiness, Section 8 compliance, and multifamily safety evaluations. Our team identifies deficiencies in building structure, fire safety, environmental hazards, and occupancy health. By offering detailed reporting, remediation guidance, and scoring improvement strategies, we ensure properties meet or exceed federal standards. Our inspectors are experienced in federal and state regulations, Inspire compliance, and local housing codes, providing reliable insights for property owners and managers seeking to improve public housing quality, efficiency, and safety across the nation."
  },
  {
    "title": "Federal Property Inspection Services And HUD IInspire",
    "content": "Inspire delivers federal property inspection services for HUD, Section 8, and other government-managed housing. Our Inspire inspections assess habitability, energy standards, and environmental safety, helping property managers prepare for federal evaluations. We also conduct REAC inspections and provide score improvement support to enhance compliance ratings. Inspire ensures that public housing authorities meet regulatory expectations, minimize risks, and address deficiencies proactively. Our structured inspections follow federal guidelines, emphasizing documentation accuracy, risk assessment, and actionable reporting, offering comprehensive solutions that strengthen operational efficiency, occupant safety, and federal compliance in affordable housing communities across the USA."
  },
  {
    "title": "HUD REAC Inspection Preparation And Support",
    "content": "Our HUD REAC inspection services help property managers navigate the complex federal inspection process. Inspire offers comprehensive REAC inspection prep services, including pre-assessment evaluations, risk identification, and compliance gap analysis. We provide detailed documentation, training for staff, and practical guidance to ensure readiness for official HUD inspections. Our team focuses on Section 8, multifamily housing, and public housing compliance, helping communities achieve higher REAC scores. With Inspire, property managers can proactively manage deficiencies, maintain regulatory adherence, and protect residents’ well-being while strengthening relationships with housing authorities through meticulous preparation, transparent reporting, and consistent compliance improvement."
  },
  {
    "title": "Apartment Community Safety And Compliance Inspections",
    "content": "Inspire conducts apartment community compliance inspection services to maintain tenant safety, habitability, and federal code adherence. Our inspections cover fire safety, structural integrity, environmental hazards, and operational efficiency. We assess energy and health standards while documenting any deficiencies for PHAs. These inspections are designed to prepare communities for HUD/REAC and Inspire evaluations, providing actionable recommendations for remediation and improvement. By partnering with Inspire, property managers ensure federal compliance, enhance resident satisfaction, and reduce liability risks. Our expertise in affordable housing and multifamily communities enables properties to maintain optimal safety, efficiency, and regulatory alignment across all apartment units and shared spaces."
  },
  {
    "title": "Inspire Public Housing Inspection And Standards",
    "content": "Our Inspire public housing inspection services are tailored for compliance with HUD regulations and federal housing standards. We assess habitability, safety, and code adherence in multifamily and public housing projects. Inspire helps property managers implement improvements, streamline reporting, and ensure consistent compliance with Inspire and REAC guidelines. By evaluating energy efficiency, occupancy health, and documentation accuracy, we provide actionable insights to enhance federal inspection readiness. Our inspections support PHAs in achieving higher HUD scores, improving resident satisfaction, and maintaining long-term operational efficiency. Inspire ensures public housing authorities and property owners uphold quality, safety, and regulatory compliance."
  },
  {
    "title": "Documentation And Risk Management For Public Housing Authorities",
    "content": "Inspire offers documentation for public housing authorities (PHAs) to streamline inspection reporting, compliance tracking, and deficiency remediation. Our services include HUD inspection preparation, Inspire compliance verification, and REAC scoring improvement strategies. We provide comprehensive reports detailing risk areas, safety hazards, and occupancy issues, enabling housing authorities to make informed decisions. Inspire’s experts assist in regulatory interpretation, code compliance, and operational optimization, ensuring that public housing units meet federal standards. By offering clear documentation and structured guidance, we support PHAs in maintaining safe, habitable, and compliant housing, minimizing risk, and enhancing the effectiveness of multifamily property management across the USA."
  },
  {
    "title": "REAC Score Improvement And HUD Inspire Compliance",
    "content": "Inspire’s HUD REAC score improvement services focus on elevating property compliance ratings through pre-inspection assessments and targeted remediation. We analyze deficiencies in habitability, safety, and energy compliance, providing actionable solutions to enhance federal inspection results. Our team supports Inspire and HUD compliance inspections, ensuring properties meet public housing standards and Section 8 requirements. By identifying risks, documenting improvements, and guiding property managers, Inspire improves overall federal inspection readiness. These services are essential for public housing authorities seeking to maximize REAC scores, protect resident well-being, and maintain federal compliance efficiently across multifamily and affordable housing properties nationwide."
  }
];

export default function PublicHousingClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="bg-[#E8F4F8] pt-0 pb-4 flex justify-center">
        <Image src="/logo.png" alt="INSPIRE" width={500} height={600} priority className="h-14 md:h-32 lg:h-40 w-auto" />
      </div>

      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden z-50 flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
          {mobileMenuOpen && (<div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)}></div>)}
          <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col gap-6 p-8 pt-36">
              <Link href="/" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
              <Link href="/about" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>ABOUT</Link>
              <Link href="/inspection-services" className="text-lg font-bold text-[#0D6A8D]" onClick={() => setMobileMenuOpen(false)}>SERVICES</Link>
              <Link href="/contact" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>
              <Link href="/blog" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>BLOG</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">HOME</Link>
            <Link href="/about" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">ABOUT</Link>
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                href="/service"
                className="flex items-center gap-1 text-sm font-bold text-[#0D6A8D] cursor-pointer"
              >
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
                      <span className="text-sm text-[#0D6A8D] font-medium">
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
            <Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">CONTACT</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">BLOG</Link>
          </div>
          <Button onClick={() => router.push("/profile-selection")} className="bg-[#1E88A8] hover:bg-[#176B87] text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-md cursor-pointer">Login/Register</Button>
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-15"><Image src="/why.jpg" alt="" fill className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#6D28D9] via-[#6D28D9]/60 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">HUD/REAC Compliance</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Public Housing Inspection <span className="italic">Services</span>
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
            Inspire provides professional Public Housing Inspection Services across the USA, helping housing authorities, property managers, and multifamily communities maintain federal compliance and safe living conditions. Our team specializes in HUD and REAC inspection preparation, ensuring every property meets federal housing standards, Section 8 requirements, and energy and safety regulations. From apartment communities to large public housing developments, Inspire ensures compliance inspections are thorough, timely, and precise. We focus on identifying deficiencies, supporting risk management, and improving HUD REAC scores, providing a comprehensive solution for all public housing inspection needs while streamlining documentation and reporting for PHAs.
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16"><p className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-4">Federal Compliance</p><h2 className="text-4xl md:text-5xl font-bold text-black">Comprehensive Services</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-6"><span className="w-12 h-12 rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-[#8B5CF6] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span><h3 className="text-xl font-bold text-black group-hover:text-[#8B5CF6] transition-colors">{s.title}</h3></div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-20 px-4 text-center"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ensure Federal Compliance</h2><p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a HUD/REAC preparation inspection and improve your compliance scores today.</p><Button onClick={() => router.push("/contact")} className="bg-[#8B5CF6] hover:bg-[#6D28D9] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Get REAC Ready</Button></section>

      <footer className="bg-black text-white py-12 px-4"><div className="max-w-7xl mx-auto text-center"><Image src="/logo.png" alt="INSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" /><div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mb-6"><Link href="/" className="hover:text-white">Home</Link><Link href="/about" className="hover:text-white">About</Link><Link href="/inspection-services" className="hover:text-white">Services</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/blog" className="hover:text-white">Blog</Link></div><p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p></div></footer>
    </main>
  );
}

