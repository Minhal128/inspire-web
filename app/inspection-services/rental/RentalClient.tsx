"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  { title: "Move-In Inspection Services", content: "Our Move-In Inspection services provide landlords with a detailed assessment of the property before tenants occupy it. By documenting the property's condition, including walls, appliances, flooring, and fixtures, we prevent disputes regarding damages at the end of the lease. Our team uses standardized tenant property inspection forms, creates accurate tenant documentation, and records everything digitally in Inspire Rental Compliance systems." },
  { title: "Tenant Damage Assessment & Documentation", content: "Inspire specializes in Tenant Damage Assessment Inspections, ensuring landlords have a clear record of property condition and any damages caused by tenants. Our process includes visual inspections, photography documentation, and comprehensive reports for tenant damage reports. We provide a tenant record-keeping system to track damages, maintenance requests, and repairs." },
  { title: "Annual Rental Safety Inspections", content: "Annual inspections are critical for rental property safety, habitability, and regulatory compliance. Inspire conducts thorough Annual Rental Safety Inspections to identify fire hazards, plumbing issues, electrical problems, and other risks. Our inspection reports help landlords comply with local, state, and federal regulations, while improving tenant satisfaction and property longevity." },
  { title: "Pre-Rental Inspections for Multi-Unit Buildings", content: "Before renting out units, Inspire provides pre-rental property inspections for single-family and multi-unit buildings. Our team inspects structural elements, mechanical systems, and safety features to ensure units are ready for occupancy. Detailed property inspection reports are generated to support landlord–tenant documentation packages." },
  { title: "Move-Out Inspections", content: "Inspire's Move-Out Inspection services accurately assess property conditions after tenancy ends. Our team evaluates tenant-caused damage, documents wear and tear, and generates comprehensive tenant damage inspection reports. These records support security deposit deductions, repairs, and insurance claims." },
  { title: "Habitability Standards Review & Risk Assessment", content: "Ensuring rental properties meet habitability standards is critical for legal compliance and tenant safety. Inspire performs detailed Rental Risk Assessments covering fire safety, plumbing, structural integrity, HVAC systems, and environmental hazards. Our inspections include occupancy and health safety checks to identify hazards before they escalate." },
  { title: "Multi-Unit Rental Property Maintenance", content: "Managing multi-unit properties requires detailed inspections for safety and consistent maintenance. Inspire's Multi-Unit Property Maintenance Inspections cover electrical systems, plumbing, roofing, and common areas. We create detailed rental inspection service reports, including recommendations for repairs, preventative maintenance, and safety improvements." },
  { title: "Inspire Rental Compliance & Documentation", content: "Inspire provides a complete Rental Compliance system, offering landlords and property managers all necessary documentation tools. Our packages include tenant move-in and move-out forms, rental property condition reports, and annual safety inspection logs. This centralized system simplifies landlord–tenant documentation and ensures regulatory compliance." },
  { title: "Commercial & Residential Rental Inspections", content: "Our Commercial Rental Inspection Services cater to office buildings, retail spaces, and mixed-use properties. We assess structural integrity, safety systems, and occupancy compliance. Our residential services cover move-in inspections, apartment building inspection services, and rental home inspection services." },
  { title: "Rental Property Damage & Risk Management", content: "Inspire provides expert Rental Property Damage Inspections, helping landlords identify tenant-related damages, environmental hazards, and maintenance concerns. We create comprehensive tenant damage reports and integrate the data into Inspire Compliance Software for ongoing property management." },
];

export default function RentalClient() {
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
      <section className="relative bg-gradient-to-br from-[#10B981] to-[#059669] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-20"><Image src="/hero.png" alt="" fill className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#059669] via-[#059669]/60 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Safety, Compliance & Satisfaction</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">Rental Property <span className="italic">Inspections</span></h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">Inspire offers comprehensive Rental Property Inspection Services across the USA, designed to assist landlords, property managers, and tenants in maintaining safe, habitable, and compliant rental properties throughout every stage of the rental lifecycle.</p>
        </div>
      </section>

      {/* Service Sections */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-4">Complete Rental Solutions</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black">Our Rental Inspection Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-12 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981] font-bold text-lg">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-bold text-black group-hover:text-[#10B981] transition-colors">{s.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Protect Your Rental Investment</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a comprehensive rental property inspection and ensure compliance, safety, and tenant satisfaction.</p>
        <Button onClick={() => router.push("/contact")} className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Schedule Inspection</Button>
      </section>

      <footer className="bg-black text-white py-12 px-4"><div className="max-w-7xl mx-auto text-center"><Image src="/logo.png" alt="INSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" /><div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mb-6"><Link href="/" className="hover:text-white">Home</Link><Link href="/about" className="hover:text-white">About</Link><Link href="/inspection-services" className="hover:text-white">Services</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/blog" className="hover:text-white">Blog</Link></div><p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p></div></footer>
    </main>
  );
}
