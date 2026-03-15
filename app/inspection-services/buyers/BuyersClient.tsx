"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    "title": "Multi-Unit Buyer Inspection Services to Safeguard Your Property Investment",
    "content": "Buying multi-unit residential or commercial properties can be complex. Our Multi-Unit Buyer Inspection services provide an in-depth evaluation of apartment buildings, commercial multi-unit structures, and multi-family homes. We assess the overall property condition, check electrical and mechanical systems, and evaluate potential hazards for tenants and future occupants. Inspire ensures that investors receive a clear picture of maintenance requirements and long-term costs. Our inspections guide decision-making, support price negotiations, and reduce the risk of unexpected repairs. Choosing Inspire’s multi-unit inspection services ensures your real estate investment is secure, compliant, and profitable."
  },
  {
    "title": "Apartment and Multi-Family Property Pre-Purchase Inspections",
    "content": "Our Apartment Building Inspection and Multi-Family Buyer Inspection services target buyers seeking accurate, actionable insights. From pre-buy inspection cost estimates to complete property assessments, we evaluate plumbing, electrical systems, roofing, and structural integrity. We identify hidden issues such as mold, pest damage, or water leaks that could impact long-term investment value. Each inspection includes detailed documentation, photographs, and a buyer decision support report. With Inspire, buyers can make informed decisions about multi-unit property acquisitions, negotiate effectively, and plan for repair or maintenance costs while ensuring compliance with local safety regulations."
  },
  {
    "title": "Single-Family Home Buyer Inspection Services for Smart Home Purchases",
    "content": "Purchasing a single-family home requires a detailed assessment to prevent future financial and safety risks. Our Single-Family Home Buyer Inspection service covers all critical aspects, including structural review, mechanical and electrical systems, HVAC, plumbing, and roofing conditions. Inspire inspectors provide a thorough home buyer inspection and pre-purchase analysis tailored to your investment goals. Our residential inspection reports include repair cost estimates, hazard identification, and actionable recommendations to support your purchase negotiation. By conducting a professional home inspection, we empower buyers to make confident, informed decisions while safeguarding their financial interests in the USA housing market."
  },
  {
    "title": "Pre-Purchase Condominium and Townhome Inspections",
    "content": "Condominiums and townhomes require specialized inspections to evaluate shared and individual property elements. Our Condominium Buyer Inspection service provides comprehensive checks for structural integrity, mechanical systems, and common area maintenance. We offer pre-purchase condo inspections that uncover potential issues, from plumbing leaks to electrical hazards, and provide repair or maintenance cost estimations. Inspire’s buyer condo inspection services deliver detailed reports for informed decision-making and negotiation. Our inspectors also ensure compliance with local building regulations and condominium association requirements. Trust Inspire to simplify your condo purchase with thorough inspections, hazard identification, and decision support for every buyer."
  },
  {
    "title": "Commercial Property Pre-Purchase Evaluation for Informed Investments",
    "content": "Investing in commercial multi-unit properties requires a clear understanding of structural and operational conditions. Inspire’s Commercial Multi-Unit Inspection services provide detailed evaluations of office buildings, retail spaces, and multi-unit commercial properties. We identify electrical, plumbing, and HVAC issues, assess structural integrity, and highlight potential hazards that may affect tenants or business operations. Our inspections provide actionable insights for repair, maintenance, and purchase negotiation. By choosing Inspire, commercial property buyers gain accurate pre-buy inspection cost estimates, ensure compliance with safety regulations, and receive comprehensive documentation for a confident investment decision in the USA market."
  },
  {
    "title": "Public Housing and Multi-Family Buyer Assessments",
    "content": "Inspire conducts detailed inspections for Public Housing and Multi-Family Buyer Assessments to help buyers and investors evaluate high-density residential properties. We analyze structural, mechanical, and electrical systems, assess safety hazards, and provide buyer decision support reports with estimated repair costs. Our pre-purchase inspection services cover apartment complexes, community housing, and multi-unit properties, ensuring transparency and reducing investment risk. By identifying hidden defects or potential compliance issues, Inspire empowers buyers to make well-informed decisions. Each inspection report is designed to guide purchase negotiations and long-term maintenance planning, making your multi-family property investment secure and profitable."
  },
  {
    "title": "Property Condition Assessment for Buyers with Structural, Mechanical & Electrical Review",
    "content": "Inspire’s Property Condition Assessment for Buyers provides a complete review of all critical property components. We inspect structural elements, electrical systems, plumbing, HVAC, and mechanical equipment to detect potential problems before purchase. Our home inspection services include documentation of findings, hazard identification, and maintenance cost estimation. Buyers receive actionable insights for negotiating property prices and planning repairs. With Inspire’s inspection expertise, every property is evaluated with precision and transparency. Our detailed reports help buyers make informed decisions, prevent unexpected expenses, and ensure compliance with safety standards across the USA residential and commercial property markets."
  },
  {
    "title": "Inspire Buyer Safety Compliance and Hazard Identification",
    "content": "Safety and compliance are core components of Inspire’s inspections. Our Inspire Buyer Safety Compliance service evaluates fire hazards, electrical risks, structural vulnerabilities, and environmental concerns such as mold or asbestos. Each inspection includes a hazard and risk identification report, highlighting areas that may impact occupant safety or legal compliance. Inspire also provides recommendations for mitigation and repair, enabling buyers to address issues proactively. By integrating safety compliance into every inspection, we ensure your investment is secure, risk-free, and fully documented. Our services support informed decision-making, reduce liability, and provide peace of mind for all property buyers."
  },
  {
    "title": "Buyer Decision Support Reports with Repair and Maintenance Cost Estimations",
    "content": "Inspire delivers Buyer Decision Support Reports that provide actionable insights for every property purchase. These reports include detailed documentation of structural, mechanical, and electrical assessments, estimated repair and maintenance costs, and potential safety hazards. Our pre-purchase inspection services guide negotiation strategies, ensure transparency, and prevent unexpected financial burdens. Whether for single-family homes, condos, or multi-unit commercial properties, Inspire’s inspection reports are designed to empower buyers with accurate information. With expert analysis and clear recommendations, we simplify the decision-making process, protect your investment, and ensure you make informed property purchases in the competitive USA real estate market."
  },
  {
    "title": "Documentation and Pre-Purchase Inspection Support for Negotiation and Investment Confidence",
    "content": "Inspire provides complete documentation for all inspections, including photographs, technical evaluations, and cost estimates. Our pre-buy inspection support ensures buyers have all necessary information for effective negotiation. By offering comprehensive home buying inspections and multi-unit property assessments, we help clients minimize risk and secure optimal purchase terms. Our inspections support informed decision-making, highlighting hazards, maintenance needs, and compliance issues. Inspire’s professional evaluation services empower buyers to confidently invest in residential or commercial properties, reduce post-purchase surprises, and achieve long-term satisfaction. Trust our expertise to streamline property inspections and safeguard your real estate investments across the USA."
  }
];

export default function BuyersClient() {
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

      {/* Hero with Image */}
      <section className="relative bg-[#0D6A8D] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Image src="/why.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D6A8D] via-[#0D6A8D]/70 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-[#7FFF00] font-bold uppercase tracking-[0.2em] mb-6">Expert Inspection Services</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Buyers Inspection <span className="italic">Services</span>
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
            At Inspire, we provide Buyers Inspection Services across the USA, designed to ensure homebuyers and investors make informed decisions before purchasing any property. Our expert inspectors conduct thorough evaluations for single-family homes, multi-unit residential buildings, condominiums, and commercial properties. Using advanced techniques, we identify structural, mechanical, and electrical issues, estimate repair costs, and highlight potential hazards. From pre-buy inspections to full property condition assessments, our services provide peace of mind and support informed negotiation. Trust Inspire to protect your investment and simplify your home buying experience with professional, reliable, and comprehensive inspection solutions.
          </p>
        </div>
      </section>

      {/* Service Sections */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#0D6A8D] uppercase tracking-widest mb-4">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black">Comprehensive Services</h2>
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
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
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
