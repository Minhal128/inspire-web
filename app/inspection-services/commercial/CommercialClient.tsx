"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  { title: "Construction Quality Assessment", content: "Ensuring that construction meets industry standards is vital for any commercial property. Inspire's construction quality assessment services cover detailed inspections of new and existing buildings, evaluating structural integrity, material quality, and workmanship. Our team identifies potential hazards, structural weaknesses, or non-compliance issues early, saving clients from expensive repairs and legal liabilities." },
  { title: "Industrial Properties Inspection", content: "Industrial sites require meticulous inspections to maintain safety and operational standards. Our services assess factories, warehouses, and production facilities for structural, mechanical, and environmental compliance. We check equipment safety, storage protocols, fire prevention systems, and employee safety measures. Our inspectors use thermal imaging, safety audits, and advanced testing tools." },
  { title: "Shopping Center Inspections", content: "Shopping centers and retail complexes require regular inspections to guarantee public safety and operational compliance. We cover everything from structural assessments to fire and life safety checks, roofing, HVAC systems, plumbing, electrical installations, and parking areas to ensure a safe environment for shoppers and staff." },
  { title: "Multi-Unit Facility & Retail Compliance", content: "Our Inspire Commercial Compliance services ensure multi-unit commercial properties meet local safety and regulatory standards. We provide multi-unit commercial facility inspections to assess fire safety, accessibility, structural integrity, and overall operational compliance. Retail property inspections focus on store layout safety and emergency preparedness." },
  { title: "Warehouse Inspections", content: "Warehouses are critical to business operations and require specialized inspection services. We include comprehensive structural assessments, HVAC and electrical evaluations, fire safety audits, and compliance checks. Our team identifies structural weaknesses, potential hazards, and regulatory non-compliance issues that can disrupt workflow or cause accidents." },
  { title: "Structural Integrity & Systems Analysis", content: "Maintaining structural integrity is essential for long-term safety and performance. Our assessments include detailed inspections of foundations, load-bearing elements, roofing systems, HVAC units, electrical networks, and plumbing infrastructure. We evaluate risks such as water damage, electrical faults, or mechanical wear with actionable recommendations." },
  { title: "Retail & Office Safety Compliance", content: "Retail spaces and office buildings require meticulous safety and code compliance inspections to protect staff, customers, and assets. We assess fire safety, accessibility, structural soundness, electrical systems, HVAC, and plumbing. Our detailed reports include code compliance analysis and practical recommendations to address deficiencies." },
  { title: "Fire & Life Safety Inspections", content: "We prioritize fire and life safety for all commercial properties. Our inspections cover multi-tenant buildings, shopping malls, warehouses, and office spaces, assessing fire suppression systems, alarms, emergency exits, signage, and accessibility for all occupants. We ensure operational practices comply with safety standards." },
  { title: "Multi-Tenant & Retail Building Inspections", content: "Multi-tenant and retail properties require specialized inspections for both safety and operational efficiency. We evaluate HVAC systems, electrical networks, plumbing, roofing, and overall building integrity. Our inspections identify safety risks, operational inefficiencies, and regulatory non-compliance." },
  { title: "Industrial & Factory Audits", content: "Industrial facilities, factories, and warehouses require rigorous evaluation for operational efficiency and safety compliance. We perform warehouse structural inspections, facility inspections, and safety inspections to ensure facilities meet federal and state regulations. Our assessments help businesses mitigate risks and maintain productivity." },
];

export default function CommercialClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center"><Image src="/logo.png" alt="INSPIRE" width={500} height={600} priority className="h-14 md:h-32 lg:h-40 w-auto" /></div>
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4"><div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden z-50 flex flex-col gap-1.5 p-2" aria-label="Toggle menu"><span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span><span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></span><span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span></button>
        {mobileMenuOpen && (<div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)}></div>)}
        <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}><div className="flex flex-col gap-6 p-8 pt-20"><Link href="/" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>HOME</Link><Link href="/inspection-services" className="text-lg font-bold text-[#0D6A8D]" onClick={() => setMobileMenuOpen(false)}>SERVICES</Link><Link href="/contact" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link><Link href="/blog" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>BLOG</Link></div></div>
        <div className="hidden md:flex items-center gap-6 lg:gap-8"><Link href="/" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">HOME</Link><Link href="/about" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">ABOUT</Link><Link href="/inspection-services" className="text-sm font-bold text-[#0D6A8D]">SERVICES</Link><Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">CONTACT</Link><Link href="/resources" className="text-sm font-medium text-gray-800 hover:text-[#0D6A8D]">RESOURCES</Link></div>
        <Button onClick={() => router.push("/profile-selection")} className="bg-[#1E88A8] hover:bg-[#176B87] text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-md cursor-pointer">Login/Register</Button>
      </div></nav>

      <section className="relative bg-gradient-to-br from-[#F59E0B] to-[#D97706] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-20"><Image src="/why3.jpg" alt="" fill className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#D97706] via-[#D97706]/60 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Business Properties Nationwide</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">Commercial <span className="italic">Inspections</span></h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">At Inspire, we provide top-tier Commercial Buildings Inspection Services across the USA, helping businesses, property managers, and industrial facility owners ensure the safety, functionality, and compliance of their properties.</p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16"><p className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest mb-4">Expert Evaluations</p><h2 className="text-4xl md:text-5xl font-bold text-black">Commercial Inspection Services</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-6"><span className="w-12 h-12 rounded-2xl bg-[#FFFBEB] flex items-center justify-center text-[#F59E0B] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span><h3 className="text-xl font-bold text-black group-hover:text-[#F59E0B] transition-colors">{s.title}</h3></div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-20 px-4 text-center"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Protect Your Commercial Investment</h2><p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a comprehensive commercial property inspection today.</p><Button onClick={() => router.push("/contact")} className="bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Schedule Inspection</Button></section>

      <footer className="bg-black text-white py-12 px-4"><div className="max-w-7xl mx-auto text-center"><Image src="/logo.png" alt="INSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" /><div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mb-6"><Link href="/" className="hover:text-white">Home</Link><Link href="/about" className="hover:text-white">About</Link><Link href="/inspection-services" className="hover:text-white">Services</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/blog" className="hover:text-white">Blog</Link></div><p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p></div></footer>
    </main>
  );
}
