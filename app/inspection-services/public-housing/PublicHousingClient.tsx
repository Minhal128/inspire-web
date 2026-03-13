"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  { title: "Comprehensive Housing Inspections USA", content: "Our housing inspection services cover all aspects of public and multifamily housing compliance. Inspire conducts detailed inspections to ensure your property aligns with HUD, Section 8, and local housing authority regulations. We focus on habitability, safety, and code compliance, providing actionable recommendations to address deficiencies." },
  { title: "HUD Property Inspection Prep & Compliance", content: "Inspire offers specialized HUD property inspection prep to streamline federal audits and REAC inspections. Our inspectors conduct pre-assessment evaluations, identifying gaps in compliance and correcting deficiencies before official HUD visits. With our guidance, properties achieve higher REAC scores and improved HUD compliance ratings." },
  { title: "Multifamily Property Compliance", content: "Our multifamily property compliance inspections cover every element of apartment communities and residential complexes. We ensure your property meets HUD and Inspire public housing inspection standards, addressing habitability, energy efficiency, and code adherence. From common areas to individual units, we provide thorough assessments." },
  { title: "Public Housing Compliance Services", content: "We provide property compliance inspection services for public housing authorities and private operators. Our team identifies deficiencies in building structure, fire safety, environmental hazards, and occupancy health. By offering detailed reporting, remediation guidance, and scoring improvement strategies, we ensure properties meet or exceed federal standards." },
  { title: "Federal Property & HUD Inspections", content: "Inspire delivers federal property inspection services for HUD, Section 8, and other government-managed housing. Our inspections assess habitability, energy standards, and environmental safety, helping property managers prepare for federal evaluations. We also conduct REAC inspections and provide score improvement support." },
  { title: "HUD REAC Inspection Preparation", content: "Our HUD REAC inspection services help property managers navigate the complex federal inspection process. We offer comprehensive REAC inspection prep services, including pre-assessment evaluations, risk identification, and compliance gap analysis. We provide detailed documentation, training for staff, and practical guidance." },
  { title: "Apartment Community Safety Inspections", content: "Inspire conducts apartment community compliance inspections to maintain tenant safety, habitability, and federal code adherence. Our inspections cover fire safety, structural integrity, environmental hazards, and operational efficiency. We assess energy and health standards while documenting deficiencies for PHAs." },
  { title: "Inspire Standards & Public Housing", content: "Our Inspire public housing inspection services are tailored for compliance with HUD regulations and federal housing standards. We assess habitability, safety, and code adherence. By evaluating energy efficiency, occupancy health, and documentation accuracy, we provide actionable insights to enhance federal inspection readiness." },
  { title: "Documentation & Risk Management for PHAs", content: "Inspire offers documentation for public housing authorities to streamline inspection reporting, compliance tracking, and deficiency remediation. Our services include HUD inspection preparation, compliance verification, and REAC scoring improvement strategies. We provide comprehensive reports detailing risk areas, safety hazards, and occupancy issues." },
  { title: "REAC Score Improvement & Compliance", content: "Our HUD REAC score improvement services focus on elevating property compliance ratings through pre-inspection assessments and targeted remediation. We analyze deficiencies in habitability, safety, and energy compliance, providing actionable solutions to enhance federal inspection results." },
];

export default function PublicHousingClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center"><Image src="/logo.png" alt="INSPIRE" width={500} height={600} priority className="h-14 md:h-32 lg:h-40 w-auto" /></div>
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4"><div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden z-50 flex flex-col gap-1.5 p-2" aria-label="Toggle menu"><span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span><span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></span><span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span></button>
        {mobileMenuOpen && (<div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)}></div>)}
        <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex flex-col gap-6 p-8 pt-36"><Link href="/" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>HOME</Link><Link href="/inspection-services" className="text-lg font-bold text-[#0D6A8D]" onClick={() => setMobileMenuOpen(false)}>SERVICES</Link><Link href="/contact" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link><Link href="/blog" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>BLOG</Link></div></div>
        <div className="hidden md:flex items-center gap-6 lg:gap-8"><Link href="/" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">HOME</Link><Link href="/about" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">ABOUT</Link><Link href="/inspection-services" className="text-sm font-bold text-[#0D6A8D]">SERVICES</Link><Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">CONTACT</Link><Link href="/resources" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">RESOURCES</Link></div>
        <Button onClick={() => router.push("/profile-selection")} className="bg-[#1E88A8] hover:bg-[#176B87] text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-md cursor-pointer">Login/Register</Button>
      </div></nav>

      <section className="relative bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-15"><Image src="/why.jpg" alt="" fill className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#6D28D9] via-[#6D28D9]/60 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">HUD/REAC Compliance</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">Public Housing <span className="italic">Inspections</span></h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">Inspire provides professional Public Housing Inspection Services across the USA, helping housing authorities, property managers, and multifamily communities maintain federal compliance and safe living conditions.</p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16"><p className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest mb-4">Federal Compliance</p><h2 className="text-4xl md:text-5xl font-bold text-black">Public Housing Services</h2></div>
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
