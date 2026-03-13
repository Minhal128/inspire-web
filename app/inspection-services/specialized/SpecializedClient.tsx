"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  { title: "Sewer Scope Video Inspections", content: "Our Video Sewer Inspection Services utilize high-definition cameras to examine sewer lines, identify clogs, leaks, or root intrusions, and provide precise evaluations. This service allows homeowners, commercial property managers, and real estate professionals to proactively address plumbing issues, saving both time and money with detailed, video-backed reports." },
  { title: "Pool & Spa Inspections", content: "Inspire's Pool and Spa Safety Inspections are performed by certified inspectors to ensure safety, compliance, and optimal performance. We serve both residential and commercial clients, including luxury homes, multi-unit complexes, and resort facilities. Our services include thorough evaluations of pool equipment, water quality, structural integrity, and compliance with local regulations." },
  { title: "Mold Sampling & Air Quality Testing", content: "Our Mold Sampling Inspection Services and Environmental Air Quality Sampling detect airborne contaminants, allergens, and harmful particles. Using advanced laboratory techniques, we identify mold species, evaluate potential health risks, and provide actionable remediation guidance. These inspections are crucial for luxury homes, historic properties, and commercial spaces." },
  { title: "Roof Inspections", content: "Inspire provides detailed Roof Inspection Services for residential, commercial, and historic properties. Our certified inspectors assess roofing materials, structural integrity, drainage systems, and potential leak points. Accurate roofing assessments are critical for pre-listing, insurance claims, or scheduled maintenance." },
  { title: "Foundation & Crawlspace Inspections", content: "Our Foundation & Crawlspace Inspection Services provide essential evaluations for residential, multi-unit, and commercial properties. These inspections identify cracks, moisture intrusion, settling issues, and potential structural weaknesses that can compromise property safety and value." },
  { title: "Luxury Home Inspections", content: "Inspire offers Luxury Home Inspections providing comprehensive evaluations for high-value properties. Our inspections cover structural integrity, pool and spa safety, roofing, plumbing, mold, and environmental risks. These services are critical for pre-listing or property acquisition, ensuring every detail meets safety standards." },
  { title: "Historic Homes Inspections", content: "Our Historic Homes Inspections are tailored to the unique challenges of aging properties, balancing preservation with modern safety standards. We evaluate foundations, roofing, structural elements, plumbing, and environmental hazards such as mold or asbestos. By addressing risks early, we prevent costly repairs and ensure compliance with preservation standards." },
  { title: "General Home Inspections", content: "Inspire's General Home Inspections provide a complete overview of residential properties, covering structural, mechanical, electrical, plumbing, and environmental aspects. Our inspections support pre-purchase, pre-listing, or routine maintenance needs with detailed reporting and professional recommendations." },
  { title: "Commercial Add-On Inspections", content: "Our Commercial Add-On Inspections complement standard evaluations by offering specialized assessments for multi-unit buildings, retail spaces, and industrial properties. These include HVAC, plumbing, pool safety, environmental testing, and structural evaluations tailored to commercial compliance standards." },
  { title: "Multi-Unit Specialized Evaluations", content: "Inspire's Multi-Unit Specialized Evaluations are designed for apartment complexes, condominiums, and multi-tenant commercial properties. Our inspections assess structural integrity, plumbing, electrical systems, mold risk, and environmental safety. Early identification of issues ensures cost-effective repairs and minimizes liability risks." },
  { title: "Environmental & Air Quality Sampling", content: "Inspire's Environmental & Air Quality Sampling evaluates airborne contaminants, allergens, and pollutants in homes, pools, and commercial buildings. These services complement Mold Sampling Inspection Services, providing comprehensive analysis for residential, multi-unit, and commercial properties." },
];

export default function SpecializedClient() {
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

      <section className="relative bg-gradient-to-br from-[#22C55E] to-[#15803D] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-15"><Image src="/why2.jpg" alt="" fill className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#15803D] via-[#15803D]/60 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Advanced Assessments</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">Special Inspection <span className="italic">Services</span></h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">At Inspire, we provide comprehensive Special Inspection Services across the USA, designed to address every residential, commercial, and specialized property need using advanced technology and certified inspectors.</p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16"><p className="text-xs font-bold text-[#22C55E] uppercase tracking-widest mb-4">Specialized Assessments</p><h2 className="text-4xl md:text-5xl font-bold text-black">Our Specialized Services</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <div className="flex items-center gap-3 mb-5"><span className="w-11 h-11 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#22C55E] font-bold text-sm">{String(i + 1).padStart(2, '0')}</span><h3 className="text-lg font-bold text-black group-hover:text-[#22C55E] transition-colors leading-tight">{s.title}</h3></div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-20 px-4 text-center"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Need a Specialized Inspection?</h2><p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">From sewer scopes to mold testing, we have the expertise for every property need.</p><Button onClick={() => router.push("/contact")} className="bg-[#22C55E] hover:bg-[#15803D] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Book Specialized Inspection</Button></section>

      <footer className="bg-black text-white py-12 px-4"><div className="max-w-7xl mx-auto text-center"><Image src="/logo.png" alt="INSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" /><div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mb-6"><Link href="/" className="hover:text-white">Home</Link><Link href="/about" className="hover:text-white">About</Link><Link href="/inspection-services" className="hover:text-white">Services</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/faq" className="hover:text-white">FAQ</Link><Link href="/blog" className="hover:text-white">Blog</Link></div><p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p></div></footer>
    </main>
  );
}
