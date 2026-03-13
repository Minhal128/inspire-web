"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const serviceCategories = [
  {
    title: "Buyers Inspection Services",
    subtitle: "Pre-Purchase Protection",
    description: "Comprehensive inspections for single-family homes, multi-unit properties, condominiums, and commercial pre-purchase evaluations.",
    href: "/inspection-services/buyers",
    items: ["Single-Family Inspections", "Multi-Unit Inspections", "Condominium/Townhouse", "Commercial Pre-Purchase", "Structural & Mechanical Reviews", "NSPIRE/REAC Compliance"],
    color: "#0D6A8D",
    accent: "#E8F4F8"
  },
  {
    title: "Owners Inspection Services",
    subtitle: "Maintain & Protect Your Investment",
    description: "Annual property inspections, pre-listing evaluations, property condition assessments, and maintenance surveys for current owners.",
    href: "/inspection-services/owners",
    items: ["Annual Owner Property Inspection", "Pre-Listing Home Inspection", "Property Condition Evaluation", "Homeowner Maintenance Survey", "Tenant Safety Review"],
    color: "#FF4757",
    accent: "#FEF2F2"
  },
  {
    title: "Sellers Inspection Services",
    subtitle: "Maximize Marketability",
    description: "Pre-listing inspections, HUD/REAC pre-sale support, property readiness evaluations, seller transparency reports, and pricing advantage strategies.",
    href: "/inspection-services/sellers",
    items: ["Pre-Listing Inspection", "HUD/REAC Pre-Sale Support", "Defect Detection", "Pricing Advantage Report", "Marketability Enhancement", "Seller Transparency Report"],
    color: "#F97316",
    accent: "#FFF7ED"
  },
  {
    title: "Specialized & Add-On Services",
    subtitle: "Deep-Dive Assessments",
    description: "Targeted inspections including sewer scope, thermal imaging, mold and air quality testing, radon, pool, lead paint, and asbestos surveys.",
    href: "/inspection-services/specialized",
    items: ["Sewer Scope Inspection", "Thermal Imaging/Infrared", "Mold & Air Quality Testing", "Radon Testing", "Pool & Spa Evaluation", "Lead-Based Paint Assessment", "Asbestos Survey"],
    color: "#22C55E",
    accent: "#F0FDF4"
  },
  {
    title: "Commercial Inspection Services",
    subtitle: "For Business Properties",
    description: "Professional evaluations for multifamily buildings, warehouses, industrial, retail, office, healthcare, and hospitality properties.",
    href: "/inspection-services/commercial",
    items: ["Multifamily/Apartment Buildings", "Warehouse & Industrial", "Retail & Office Spaces", "Healthcare Facilities", "Hospitality Properties"],
    color: "#F59E0B",
    accent: "#FFFBEB"
  },
  {
    title: "Public Housing & Multi-Family",
    subtitle: "Compliance & Standards",
    description: "REAC/NSPIRE standard compliance inspections, physical needs assessments, ADA accessibility, and quality assurance program reviews.",
    href: "/inspection-services/public-housing",
    items: ["REAC/NSPIRE Compliance", "Physical Needs Assessment (PNA)", "UFAS/ADA Accessibility", "Quality Assurance Reviews"],
    color: "#8B5CF6",
    accent: "#F5F3FF"
  },
  {
    title: "Rental Property Inspections",
    subtitle: "Landlord & Tenant Solutions",
    description: "Move-in, move-out, and annual safety inspections for rental properties. Tenant damage assessment, habitability reviews, and compliance documentation packages.",
    href: "/inspection-services/rental",
    items: ["Move-In Inspection", "Move-Out Inspection", "Annual Safety Inspection", "Tenant Damage Assessment", "Habitability Review", "Compliance Documentation"],
    color: "#10B981",
    accent: "#ECFDF5"
  },
  {
    title: "Insurance Risk Management",
    subtitle: "Protect Your Assets",
    description: "Property risk assessment, hazard and liability review, fire and safety risk reporting, environmental risk analysis, and insurance claim prevention.",
    href: "/inspection-services/insurance-risk",
    items: ["Property Risk Assessment", "Hazard & Liability Review", "Fire & Safety Reporting", "Environmental Risk Analysis", "Claim Prevention", "Annual Compliance Checks"],
    color: "#DC2626",
    accent: "#FEF2F2"
  }
];

export default function InspectionServicesClient() {
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
            <div className="flex flex-col gap-6 p-8 pt-36">
              <Link href="/" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800">HOME</span></Link>
              <Link href="/about" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800">ABOUT</span></Link>
              <Link href="/inspection-services" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-[#0D6A8D] font-bold">SERVICES</span></Link>
              <Link href="/contact" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800">CONTACT</span></Link>
              <Link href="/resources" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}><span className="text-lg font-medium text-gray-800">RESOURCES</span></Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors">HOME</span><span className="text-[10px] text-gray-500 italic tracking-wider">Welcome</span></Link>
            <Link href="/about" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors">ABOUT</span><span className="text-[10px] text-gray-500 italic tracking-wider">Our Story</span></Link>
            <Link href="/inspection-services" className="flex flex-col group items-center"><span className="text-sm font-bold text-[#0D6A8D]">SERVICES</span><span className="text-[10px] text-gray-500 italic tracking-wider">Inspections</span></Link>
            <Link href="/contact" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors">CONTACT</span><span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span></Link>
            <Link href="/resources" className="flex flex-col group items-center"><span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors">RESOURCES</span><span className="text-[10px] text-gray-500 italic tracking-wider">Learn More</span></Link>
          </div>
          <Button onClick={() => router.push("/profile-selection")} className="bg-[#1E88A8] hover:bg-[#176B87] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="hidden sm:inline">Login/Register</span><span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-black py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#0D6A8D] rounded-full blur-[200px] opacity-30 -translate-y-1/2"></div>
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6">
          <p className="text-[#FF4757] font-bold uppercase tracking-[0.2em] mb-6">Professional Inspections</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Inspection <span className="text-[#0D6A8D]">Services</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            From first-time homebuyers to large commercial portfolios, our certified inspectors deliver comprehensive, technology-driven assessments you can trust.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-32 space-y-16">
        {serviceCategories.map((cat, idx) => (
          <Link key={cat.title} href={cat.href} className="group block">
            <div className={`flex flex-col ${idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}>
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cat.color }}>{cat.subtitle}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-black group-hover:text-[#0D6A8D] transition-colors">{cat.title}</h2>
                <p className="text-gray-500 text-lg leading-relaxed">{cat.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span key={item} className="text-xs font-medium px-4 py-2 rounded-full border" style={{ borderColor: cat.color + "40", color: cat.color, backgroundColor: cat.accent }}>
                      {item}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 text-[#0D6A8D] font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all pt-4">
                  Learn More
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>

              {/* Visual */}
              <div className="flex-shrink-0 w-full lg:w-[300px] h-[200px] lg:h-[300px] rounded-[32px] flex items-center justify-center" style={{ backgroundColor: cat.accent }}>
                <div className="text-6xl font-extrabold opacity-20" style={{ color: cat.color }}>0{idx + 1}</div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-[#0D6A8D] py-20 md:py-28 px-4 md:px-6 text-center relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Not Sure Which Service You Need?</h2>
          <p className="text-white/70 text-lg mb-10">Contact our team for a free consultation and we'll recommend the right inspection package for your property.</p>
          <Button onClick={() => router.push("/contact")} className="bg-[#FF4757] hover:bg-[#EE3646] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">
            Get a Free Consultation
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Image src="/logo.png" alt="INSPIRE" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" />
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-white">Terms</Link>
          </div>
          <p className="text-gray-500 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
