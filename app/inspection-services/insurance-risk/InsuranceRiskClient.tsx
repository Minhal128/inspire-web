"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    "title": "Comprehensive Property Risk Assessment Services to Identify Structural, Electrical, and Liability Hazards",
    "content": "Our Property Risk Assessment services provide a detailed evaluation of residential and commercial properties to identify potential threats to safety and insurance coverage. This includes foundation inspections, electrical systems audits, and structural integrity reviews. By assessing properties comprehensively, we help clients understand exposure to risks such as fire, water damage, and natural hazards. Our team creates detailed reports with actionable recommendations for mitigation, ensuring properties comply with insurance policies and legal requirements. Whether for new acquisitions, multi-unit complexes, or corporate facilities, Inspire’s assessment services enhance decision-making, reduce liability, and optimize insurance premiums while maintaining maximum safety standards."
  },
  {
    "title": "Professional Hazard & Liability Review Services to Minimize Insurance Exposure",
    "content": "Our Hazard & Liability Review services are designed to identify all potential risks that could result in insurance claims or legal liability. We evaluate structural stability, electrical compliance, fire hazards, and environmental threats across residential and commercial properties. Inspire’s risk specialists provide precise documentation of vulnerabilities and actionable strategies for risk mitigation. These reviews help businesses and property owners maintain full compliance with insurance standards, avoid costly claims, and reduce operational exposure. By offering professional liability assessments, hazard reviews, and risk exposure analysis, we enable clients to implement targeted risk management strategies for maximum financial and safety protection."
  },
  {
    "title": "Multi-Unit Insurance Inspection Services to Safeguard Residential and Commercial Properties",
    "content": "Our Multi-Unit Insurance Inspection services focus on assessing properties such as apartments, condominiums, and commercial complexes to ensure insurance compliance and structural safety. Inspire evaluates each unit’s foundation, electrical systems, fire safety, and potential hazards that may affect insurance coverage. This inspection process provides a comprehensive risk analysis, highlighting vulnerabilities and recommending mitigation strategies. By conducting detailed property audits, we help insurance providers, property managers, and business owners reduce liability risks, prevent claims, and optimize insurance policies. Our team ensures multi-unit properties comply with national insurance standards, enhancing safety, financial stability, and long-term operational efficiency."
  },
  {
    "title": "Expert Commercial Insurance Inspection Services for Corporate Risk Management",
    "content": "Inspire’s Commercial Insurance Inspection services deliver a thorough evaluation of businesses and corporate facilities, addressing property, liability, and operational risks. We conduct structural risk assessments, electrical audits, fire safety reviews, and compliance checks to prevent potential insurance issues. These inspections support corporate insurance risk management by identifying gaps in coverage and implementing risk reduction strategies. Our reports provide actionable insights into risk exposure, ensuring businesses remain compliant with federal and state insurance regulations. By integrating advanced risk assessment tools and professional consulting, Inspire empowers organizations to mitigate hazards, reduce insurance costs, and safeguard assets from unforeseen liabilities."
  },
  {
    "title": "Fire & Safety Risk Reporting Services to Prevent Losses and Insurance Claims",
    "content": "Our Fire & Safety Risk Reporting services assess the potential hazards associated with fire, electrical systems, and operational safety across residential and commercial properties. We evaluate compliance with national fire codes, identify unsafe conditions, and recommend actionable mitigation strategies. By implementing these reports, property owners and businesses can proactively reduce insurance claims, maintain regulatory compliance, and ensure occupant safety. Inspire’s risk specialists also provide detailed documentation for insurance providers, enabling faster claims processing and evidence-based risk management. These services are essential for high-risk commercial spaces, multi-unit residences, and corporate offices seeking to optimize safety and reduce exposure to financial and legal liabilities."
  },
  {
    "title": "Environmental Risk Analysis and Compliance Services to Safeguard Your Assets",
    "content": "Our Environmental Risk Analysis services help clients identify hazards related to pollution, mold, air quality, and chemical exposure that may impact insurance coverage or property value. Inspire conducts thorough inspections and provides actionable recommendations to mitigate environmental risks. This includes compliance checks for federal and state regulations, insurance risk evaluations, and preventive strategies to reduce liability. Environmental audits are critical for commercial properties, residential complexes, and enterprise facilities to maintain operational safety and avoid insurance disputes. By integrating environmental risk management with our property assessment and insurance consulting services, Inspire ensures comprehensive protection for your assets, people, and investments."
  },
  {
    "title": "Foundation, Electrical, and Structural Risk Review Services for Residential and Commercial Properties",
    "content": "Inspire’s Foundation, Electrical, and Structural Risk Review services provide an in-depth assessment of the critical components of properties, including foundations, electrical wiring, and structural frameworks. These inspections evaluate risks such as foundation settlement, electrical malfunctions, and structural weaknesses that may result in insurance claims or property damage. Our reports include a detailed analysis of potential vulnerabilities, recommended mitigations, and compliance verification with insurance policies. Property owners, businesses, and corporate clients benefit from this proactive risk management approach, which reduces liability exposure, enhances safety, and ensures property resilience. These reviews are essential for maintaining long-term property integrity and financial security."
  },
  {
    "title": "Insurance Claim Prevention Report Services to Minimize Risk Exposure",
    "content": "Inspire’s Insurance Claim Prevention Report services aim to proactively identify potential causes of insurance claims before they occur. These reports evaluate residential and commercial properties for structural, electrical, fire, and liability risks, providing actionable recommendations for risk mitigation. By implementing preventive strategies, businesses and homeowners can reduce the likelihood of claims, ensure compliance with insurance policies, and maintain safe environments. Our reports also enhance insurance negotiations by documenting proactive risk management measures. With Inspire’s expertise in risk assessment, liability reduction, and compliance monitoring, clients gain comprehensive insight into property vulnerabilities, enabling smarter decision-making and increased protection against financial losses."
  },
  {
    "title": "Pre-Coverage Inspection Services for Insurance Risk Evaluation and Compliance",
    "content": "Our Pre-Coverage Inspection services are designed to evaluate properties before insurance coverage is initiated, ensuring all structural, electrical, and safety standards are met. Inspire conducts thorough audits of residential, commercial, and enterprise properties, highlighting risk factors that could affect insurance eligibility or premiums. These inspections include foundation reviews, fire safety evaluations, hazard identification, and compliance verification. By addressing potential issues before coverage begins, clients reduce exposure to claims, improve insurance terms, and strengthen risk management strategies. Inspire’s proactive inspections ensure peace of mind for property owners and insurance providers, creating a secure foundation for long-term asset protection and liability reduction."
  },
  {
    "title": "Annual Insurance Compliance Check Services to Maintain Regulatory and Policy Adherence",
    "content": "Our Annual Insurance Compliance Check services ensure that residential, commercial, and corporate properties consistently adhere to insurance regulations, safety standards, and liability requirements. Inspire conducts yearly audits, evaluating property risk exposure, structural safety, fire hazards, and electrical systems. These checks identify gaps in compliance, recommend mitigation strategies, and provide documented verification for insurance providers. By maintaining ongoing compliance, businesses and homeowners minimize risk exposure, prevent policy violations, and optimize insurance premiums. Our annual services support continuous improvement in risk management practices, ensuring properties remain protected, policies remain valid, and insurance claims are minimized through proactive, professional oversight."
  }
];

export default function InsuranceRiskClient() {
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
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#DC2626] to-[#991B1B] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-15"><Image src="/why2.jpg" alt="" fill className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#991B1B] via-[#991B1B]/60 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Protect Your Assets</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Insurance Risk Management <span className="italic">Services</span>
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
            At Inspire, we provide comprehensive Insurance Risk Management Services in the USA, designed to protect residential, commercial, and enterprise properties from potential hazards, structural risks, and insurance liabilities. Our expert team combines advanced inspection techniques, risk assessment methodologies, and compliance audits to ensure your property and business remain secure. We focus on proactive risk mitigation, evaluating property structures, electrical systems, and liability exposures while aligning with insurance requirements. By integrating both traditional and AI-driven analysis, Inspire helps businesses and homeowners anticipate risks, reduce premiums, and prevent claims, ensuring peace of mind through strategic risk management solutions.
          </p>
        </div>
      </section>

      {/* Service Sections */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#DC2626] uppercase tracking-widest mb-4">Risk Mitigation</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black">Comprehensive Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-12 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-bold text-black group-hover:text-[#DC2626] transition-colors">{s.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Reduce Risk, Reduce Premiums</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a comprehensive risk assessment and protect your property investments today.</p>
        <Button onClick={() => router.push("/contact")} className="bg-[#DC2626] hover:bg-[#991B1B] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Get a Risk Assessment</Button>
      </section>

      <footer className="bg-black text-white py-12 px-4"><div className="max-w-7xl mx-auto text-center"><Image src="/logo.png" alt="INSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" /><div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mb-6"><Link href="/" className="hover:text-white">Home</Link><Link href="/about" className="hover:text-white">About</Link><Link href="/inspection-services" className="hover:text-white">Services</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/blog" className="hover:text-white">Blog</Link></div><p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p></div></footer>
    </main>
  );
}


