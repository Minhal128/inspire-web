"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    title: "Multi-Unit Buyer Inspection Services",
    content: "Buying multi-unit residential or commercial properties can be complex. Our Multi-Unit Buyer Inspection services provide an in-depth evaluation of apartment buildings, commercial multi-unit structures, and multi-family homes. We assess the overall property condition, check electrical and mechanical systems, and evaluate potential hazards for tenants and future occupants. Inspire ensures that investors receive a clear picture of maintenance requirements and long-term costs.",
  },
  {
    title: "Apartment & Multi-Family Pre-Purchase Inspections",
    content: "From pre-buy inspection cost estimates to complete property assessments, we evaluate plumbing, electrical systems, roofing, and structural integrity. We identify hidden issues such as mold, pest damage, or water leaks that could impact long-term investment value. Each inspection includes detailed documentation, photographs, and a buyer decision support report.",
  },
  {
    title: "Single-Family Home Buyer Inspections",
    content: "Purchasing a single-family home requires a detailed assessment to prevent future financial and safety risks. Our inspection covers all critical aspects including structural review, mechanical and electrical systems, HVAC, plumbing, and roofing conditions. Our residential inspection reports include repair cost estimates, hazard identification, and actionable recommendations to support your purchase negotiation.",
  },
  {
    title: "Condominium & Townhome Inspections",
    content: "Condominiums and townhomes require specialized inspections to evaluate shared and individual property elements. We provide comprehensive checks for structural integrity, mechanical systems, and common area maintenance. Our inspections uncover issues from plumbing leaks to electrical hazards with repair and maintenance cost estimations.",
  },
  {
    title: "Commercial Property Pre-Purchase Evaluation",
    content: "Investing in commercial properties requires a clear understanding of structural and operational conditions. We identify electrical, plumbing, and HVAC issues, assess structural integrity, and highlight potential hazards affecting tenants or business operations. Commercial property buyers gain accurate pre-buy inspection cost estimates and compliance verification.",
  },
  {
    title: "Public Housing & Multi-Family Buyer Assessments",
    content: "We analyze structural, mechanical, and electrical systems, assess safety hazards, and provide buyer decision support reports with estimated repair costs. Our pre-purchase inspection services cover apartment complexes, community housing, and multi-unit properties, ensuring transparency and reducing investment risk.",
  },
  {
    title: "Property Condition Assessment (PCA)",
    content: "Inspire's Property Condition Assessment provides a complete review of all critical property components. We inspect structural elements, electrical systems, plumbing, HVAC, and mechanical equipment to detect potential problems before purchase. Buyers receive actionable insights for negotiating property prices and planning repairs.",
  },
  {
    title: "Safety Compliance & Hazard Identification",
    content: "Our Buyer Safety Compliance service evaluates fire hazards, electrical risks, structural vulnerabilities, and environmental concerns such as mold or asbestos. Each inspection includes a hazard and risk identification report, highlighting areas that may impact occupant safety or legal compliance, with recommendations for mitigation and repair.",
  },
  {
    title: "Buyer Decision Support Reports",
    content: "Inspire delivers Buyer Decision Support Reports with detailed documentation of structural, mechanical, and electrical assessments, estimated repair and maintenance costs, and potential safety hazards. These reports guide negotiation strategies, ensure transparency, and prevent unexpected financial burdens for all property types.",
  },
  {
    title: "Pre-Purchase Documentation & Negotiation Support",
    content: "We provide complete documentation for all inspections, including photographs, technical evaluations, and cost estimates. Our pre-buy inspection support ensures buyers have all necessary information for effective negotiation, helping clients minimize risk and secure optimal purchase terms.",
  },
];

export default function BuyersClient() {
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
              <Link href="/about" className="text-lg font-medium text-gray-800" onClick={() => setMobileMenuOpen(false)}>ABOUT</Link>
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

      {/* Hero with Image */}
      <section className="relative bg-[#0D6A8D] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Image src="/why.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D6A8D] via-[#0D6A8D]/70 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-[#7FFF00] font-bold uppercase tracking-[0.2em] mb-6">Pre-Purchase Protection</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Buyers Inspection <span className="italic">Services</span>
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
            Inspire's Buyer Inspection Services support confident purchasing decisions for residential, multi-family, commercial, and public housing properties across the USA. Our inspections include multi-unit buyer inspection, single-family home buyer inspection, condominium and townhome buyer inspection, and commercial property pre-purchase evaluation.
          </p>
        </div>
      </section>

      {/* Risk Analysis Section */}
      <section className="bg-[#F8F9FA] py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <p className="text-xs font-bold text-[#0D6A8D] uppercase tracking-widest mb-4">Risk Analysis & Compliance</p>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Buyer Risk Analysis, Compliance, and Negotiation Support</h2>
              <p className="text-gray-600 leading-relaxed">
                Our buyer-focused inspections emphasize hazard and risk identification, safety compliance, and financial clarity. Inspire delivers buyer decision support reports that highlight structural deficiencies, system failures, and safety concerns affecting value and insurability. Each inspection includes documentation for purchase negotiation, repair prioritization, and cost forecasting. By combining compliance review with practical insights, Inspire enables buyers to reduce uncertainty, prevent unexpected expenses, and move forward with confidence.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-[400px] h-[280px] rounded-[32px] overflow-hidden relative">
              <Image src="/why2.jpg" alt="Buyer inspection" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Sections */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#0D6A8D] uppercase tracking-widest mb-4">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black">Comprehensive Buyer Inspections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-12 rounded-2xl bg-[#E8F4F8] flex items-center justify-center text-[#0D6A8D] font-bold text-lg">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-bold text-black group-hover:text-[#0D6A8D] transition-colors">{s.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Make an Informed Purchase?</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Protect your investment with a comprehensive pre-purchase inspection from Nspire.</p>
        <Button onClick={() => router.push("/contact")} className="bg-[#0D6A8D] hover:bg-[#0A5670] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Book Your Buyer Inspection</Button>
      </section>

      <footer className="bg-black text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Image src="/logo.png" alt="INSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" />
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/inspection-services" className="hover:text-white">Services</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
          </div>
          <p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
