"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    "title": "Annual Owner Property Inspection Services for Long-Term Property Health",
    "content": "Regular property evaluations are crucial for protecting your real estate investments. Our annual property inspections and owner-initiated property inspections provide a detailed overview of structural health, maintenance needs, and potential hazards. By performing residential property inspections annually, we help owners anticipate costly repairs, enhance tenant safety, and maintain compliance with local building regulations. This proactive approach ensures that both single-family homes and rental properties remain in top condition year after year. Inspire’s thorough inspections include property maintenance checks, condition assessments, and pre-renovation inspections to guide owners in making informed decisions regarding renovations or improvements."
  },
  {
    "title": "Comprehensive Property Inspections for Landlords and Multi-Unit Owners",
    "content": "Landlords and multi-unit property owners require specialized inspections to protect their assets and ensure tenant safety. Inspire provides property inspections for landlords, multi-unit owner inspections, and apartment building inspections designed to assess structural integrity, operational efficiency, and overall property health. Each inspection identifies areas of concern such as plumbing, electrical systems, and exterior maintenance. By combining traditional property assessments with AI-assisted analytics, we deliver actionable reports that highlight repair priorities and preventive measures. Our multi-unit inspections help landlords optimize tenant satisfaction while minimizing costly repairs, enhancing the long-term value of their residential or commercial properties."
  },
  {
    "title": "Building Health & Maintenance Evaluation for Optimal Asset Management",
    "content": "A robust building condition assessment is key to sustaining property value and operational efficiency. Inspire’s building health evaluation, building maintenance evaluation, and structural health assessment services identify structural weaknesses, material wear, and maintenance gaps. Regular assessments prevent minor issues from escalating into major repairs, reduce long-term costs, and support compliance with building codes. Our experts document every aspect of property health, producing detailed reports that include preventive maintenance recommendations, repair prioritization, and long-term asset health evaluation. Property owners benefit from actionable insights that maintain building integrity, optimize performance, and secure their real estate investments for years to come."
  },
  {
    "title": "Property Condition Assessment (PCA) and Real Estate Evaluation Services",
    "content": "Our Property Condition Assessment (PCA) services provide owners with a comprehensive evaluation of their property’s structural, mechanical, and operational condition. Inspire conducts thorough property inspections, real estate assessments, and building condition assessments to highlight risks and recommend corrective measures. These evaluations help owners plan renovations, upgrades, and preventive maintenance effectively. By integrating AI-assisted analytics with expert inspections, we deliver precise property condition reports that enhance decision-making. From single-family homes to commercial multi-unit buildings, our PCA inspections provide an in-depth overview of your property’s current and future maintenance needs, ensuring long-term stability and value preservation."
  },
  {
    "title": "Insurance Risk Checks for Property Owners and Businesses",
    "content": "Property ownership comes with the responsibility of mitigating risks. Inspire’s insurance risk assessment for property owners, property insurance risk analysis, and business insurance risk checks identify vulnerabilities that could impact coverage, safety, and liability. Our team evaluates structural integrity, fire and environmental hazards, and tenant safety to ensure compliance and minimize potential claims. Through a combination of owner insurance risk evaluations and AI-enhanced predictive analytics, we provide actionable guidance to reduce exposure and optimize insurance coverage. By conducting regular insurance risk checks, property owners and business managers can protect their investments while maintaining peace of mind."
  },
  {
    "title": "Tenant Safety and Habitability Review for Residential Properties",
    "content": "Tenant safety and habitability are central to effective property management. Inspire’s inspections include tenant safety reviews, habitability evaluations, and compliance checks to ensure all residential units meet safety standards. We identify hazards related to fire safety, electrical systems, plumbing, and structural integrity. Our comprehensive Inspire Owner Compliance Review documents risks, enabling owners to address violations proactively. Regular inspections promote tenant satisfaction, reduce legal liabilities, and enhance long-term property value. By combining thorough on-site assessments with advanced reporting, Inspire ensures that rental properties are safe, habitable, and well-maintained, safeguarding both tenants and owners’ investments."
  },
  {
    "title": "Pre-Renovation and Renovation Inspection Services for Property Owners",
    "content": "Before beginning renovation projects, accurate assessments are essential. Inspire’s pre-renovation inspections, property renovation inspection services, and home renovation inspections identify potential structural, electrical, and safety challenges. By performing detailed pre-construction inspections, we help owners plan upgrades effectively, minimize risks, and avoid costly surprises during construction. Our reports include actionable repair recommendations, compliance checks, and renovation feasibility insights. Whether you are upgrading a single-family home, a multi-unit apartment, or a condominium, Inspire ensures renovation projects are executed efficiently while maintaining building integrity and safeguarding tenant safety, delivering value and confidence for property owners."
  },
  {
    "title": "Code Violation Detection and Preventive Maintenance Reporting",
    "content": "Maintaining compliance with building codes and safety regulations is critical for property owners. Inspire conducts code violation detection and preventive maintenance reporting as part of our comprehensive inspections. Our inspections uncover hidden issues such as structural damage, outdated systems, and potential safety hazards. By producing detailed reports, we guide owners in implementing timely repairs, minimizing risks, and ensuring adherence to legal and insurance requirements. These preventive maintenance strategies not only protect tenants but also extend the life of buildings, improve property value, and reduce long-term costs. Inspire empowers owners with actionable insights for sustainable property management."
  },
  {
    "title": "Long-Term Asset Health Evaluation for Smart Investment Decisions",
    "content": "Preserving property value requires continuous evaluation of asset health. Inspire provides long-term asset health evaluation services that combine expert inspections, AI-driven insights, and owner repair priority reports. Our evaluations cover multi-family homes, condominiums, and commercial properties, identifying emerging risks and maintenance opportunities. By monitoring structural integrity, operational efficiency, and tenant satisfaction, we help owners make informed investment decisions. Regular assessments prevent unexpected repair costs, enhance insurance compliance, and optimize property lifespan. Inspire’s systematic approach ensures property owners can protect, manage, and enhance their real estate investments, making every decision data-driven and risk-conscious."
  }
];

export default function OwnersClient() {
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
      <section className="relative bg-[#FF4757] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/why3.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF4757] via-[#FF4757]/70 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Maintain & Protect Your Investment</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Owners Inspection <span className="italic">Services</span>
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
            Inspire offers comprehensive Owners Inspection Services across the USA, designed to provide property owners, landlords, and multi-unit managers with precise evaluations of their real estate assets. Our services cover annual home inspections for owners, multi-family property assessments, renovation checks, and insurance risk evaluations to ensure your properties maintain peak condition. By leveraging advanced inspection technologies, our expert team identifies structural, maintenance, and safety concerns before they become costly problems. Whether you own a single-family home, an apartment building, or a condominium, Inspire delivers actionable insights that protect your investment, optimize property health, and ensure long-term tenant satisfaction.
          </p>
        </div>
      </section>

      {/* Preventive Maintenance Section */}
      <section className="bg-[#F8F9FA] py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
            <div className="flex-1">
              <p className="text-xs font-bold text-[#FF4757] uppercase tracking-widest mb-4">Preventive Maintenance</p>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Preventive Maintenance and Owner Compliance Reporting</h2>
              <p className="text-gray-600 leading-relaxed">
                Our owner inspections focus on actionable intelligence, including pre-renovation inspections and owner repair priority reports. Inspire evaluates structural integrity, MEP systems, and safety features to identify early-stage deterioration. Preventive maintenance reports reduce emergency repairs and extend asset lifespan. Compliance reviews address local codes, insurance requirements, and Inspire standards. By integrating risk assessment with maintenance planning, Inspire supports sustainable ownership strategies for residential, multi-family, and commercial properties throughout the USA.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-[400px] h-[280px] rounded-[32px] overflow-hidden relative">
              <Image src="/why.jpg" alt="Owner inspection" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Sections */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#FF4757] uppercase tracking-widest mb-4">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-black">Comprehensive Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-11 h-11 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#FF4757] font-bold text-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-bold text-black group-hover:text-[#FF4757] transition-colors leading-tight">{s.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Protect Your Property Investment</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Schedule a comprehensive owner inspection and preserve your property's long-term value.</p>
        <Button onClick={() => router.push("/contact")} className="bg-[#FF4757] hover:bg-[#EE3646] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Schedule an Inspection</Button>
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



