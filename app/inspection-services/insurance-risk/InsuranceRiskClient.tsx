"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  { title: "Property Risk Assessment", content: "Our Property Risk Assessment services provide a detailed evaluation of residential and commercial properties to identify potential threats to safety and insurance coverage. This includes foundation inspections, electrical systems audits, and structural integrity reviews. We help clients understand exposure to risks such as fire, water damage, and natural hazards with actionable recommendations for mitigation." },
  { title: "Hazard & Liability Review", content: "Our Hazard & Liability Review services identify all potential risks that could result in insurance claims or legal liability. We evaluate structural stability, electrical compliance, fire hazards, and environmental threats across residential and commercial properties. These reviews help businesses and property owners maintain full compliance with insurance standards and avoid costly claims." },
  { title: "Multi-Unit Insurance Inspections", content: "Our Multi-Unit Insurance Inspection services focus on assessing properties such as apartments, condominiums, and commercial complexes to ensure insurance compliance and structural safety. We evaluate each unit's foundation, electrical systems, fire safety, and potential hazards that may affect insurance coverage, providing a comprehensive risk analysis." },
  { title: "Commercial Insurance Inspections", content: "Inspire's Commercial Insurance Inspection services deliver a thorough evaluation of businesses and corporate facilities, addressing property, liability, and operational risks. We conduct structural risk assessments, electrical audits, fire safety reviews, and compliance checks to prevent potential insurance issues and support corporate insurance risk management." },
  { title: "Fire & Safety Risk Reporting", content: "Our Fire & Safety Risk Reporting services assess potential hazards associated with fire, electrical systems, and operational safety across residential and commercial properties. We evaluate compliance with national fire codes, identify unsafe conditions, and recommend actionable mitigation strategies to reduce insurance claims and maintain occupant safety." },
  { title: "Environmental Risk Analysis", content: "Our Environmental Risk Analysis services help clients identify hazards related to pollution, mold, air quality, and chemical exposure that may impact insurance coverage or property value. This includes compliance checks for federal and state regulations, insurance risk evaluations, and preventive strategies to reduce liability." },
  { title: "Foundation, Electrical & Structural Risk Review", content: "Inspire provides in-depth assessment of critical property components including foundations, electrical wiring, and structural frameworks. These inspections evaluate risks such as foundation settlement, electrical malfunctions, and structural weaknesses that may result in insurance claims or property damage." },
  { title: "Insurance Claim Prevention Reports", content: "Our Insurance Claim Prevention Report services proactively identify potential causes of insurance claims before they occur. These reports evaluate properties for structural, electrical, fire, and liability risks, providing actionable recommendations for risk mitigation to reduce the likelihood of claims." },
  { title: "Pre-Coverage Inspections", content: "Our Pre-Coverage Inspection services evaluate properties before insurance coverage is initiated, ensuring all structural, electrical, and safety standards are met. By addressing potential issues before coverage begins, clients reduce exposure to claims, improve insurance terms, and strengthen risk management strategies." },
  { title: "Annual Insurance Compliance Checks", content: "Our Annual Insurance Compliance Check services ensure properties consistently adhere to insurance regulations, safety standards, and liability requirements. Yearly audits evaluate property risk exposure, structural safety, fire hazards, and electrical systems, identifying gaps in compliance and recommending mitigation strategies." },
];

export default function InsuranceRiskClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center">
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
            <div className="flex flex-col gap-6 p-8 pt-20">
              <Link href="/" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
              <Link href="/inspection-services" className="text-lg font-bold text-[#0D6A8D]" onClick={() => setMobileMenuOpen(false)}>SERVICES</Link>
              <Link href="/contact" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>
              <Link href="/blog" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>BLOG</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">HOME</Link>
            <Link href="/about" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">ABOUT</Link>
            <Link href="/inspection-services" className="text-sm font-bold text-[#0D6A8D]">SERVICES</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">CONTACT</Link>
            <Link href="/resources" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">RESOURCES</Link>
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
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">Insurance Risk <span className="italic">Management</span></h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">At Inspire, we provide comprehensive Insurance Risk Management Services in the USA, designed to protect residential, commercial, and enterprise properties from potential hazards, structural risks, and insurance liabilities through proactive risk mitigation and compliance audits.</p>
        </div>
      </section>

      {/* Service Sections */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#DC2626] uppercase tracking-widest mb-4">Risk Mitigation</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black">Our Insurance Risk Services</h2>
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
