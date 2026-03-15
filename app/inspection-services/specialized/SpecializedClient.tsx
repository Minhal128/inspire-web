"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    "title": "Advanced Sewer Scope Video Inspections to Detect Hidden Plumbing Issues Before They Become Costly Problems",
    "content": "Our Video Sewer Inspection Services utilize high-definition cameras to examine sewer lines, identify clogs, leaks, or root intrusions, and provide precise evaluations. This service allows homeowners, commercial property managers, and real estate professionals to proactively address plumbing issues, saving both time and money. We offer Sewer Camera Inspection and Sewer Line Inspection solutions tailored to residential, multi-unit, and commercial properties. Our inspections help avoid unexpected sewer failures and provide a detailed, video-backed report for insurance claims, renovations, or pre-listing requirements. Choosing Inspire ensures a reliable, thorough, and technologically advanced approach to maintaining your property’s plumbing systems."
  },
  {
    "title": "Comprehensive Pool & Spa Inspections to Ensure Safety and Compliance for Residential and Commercial Properties",
    "content": "Inspire’s Pool Inspection Services and Pool and Spa Safety Inspections are performed by certified inspectors to ensure safety, compliance, and optimal performance. We serve both residential and commercial clients, including luxury homes, multi-unit complexes, and resort facilities. Our services include thorough evaluations of pool equipment, water quality, structural integrity, and compliance with local regulations. Clients searching for “Pool Inspection Company USA” or “Pool Inspection Services Near Me” can rely on Inspire for accurate, detailed, and actionable reports. By addressing issues proactively, our inspections reduce liability risks, enhance property value, and provide a safe environment for all users."
  },
  {
    "title": "Expert Mold Sampling and Environmental Air Quality Testing for Healthy and Safe Living Spaces",
    "content": "Our Mold Sampling Inspection Services and Environmental & Air Quality Sampling are essential for detecting airborne contaminants, allergens, and harmful particles in residential and commercial properties. Using advanced laboratory techniques, Inspire identifies mold species, evaluates potential health risks, and provides actionable remediation guidance. These inspections are crucial for luxury homes, historic properties, multi-unit residential complexes, and commercial spaces. Clients searching for Residential Special Inspection Services or Commercial Special Inspection Services can rely on our certified inspectors for thorough assessments, ensuring a safe indoor environment. Early detection prevents structural damage, costly repairs, and health-related complications."
  },
  {
    "title": "Precision Roof Inspection Services to Protect Your Home or Commercial Building from Weather Damage",
    "content": "Inspire provides detailed Roof Inspection Services for residential, commercial, and historic properties. Our certified inspectors assess roofing materials, structural integrity, drainage systems, and potential leak points. Whether you need inspections for Malibu & Beach Home Inspections or general residential properties, our services identify risks before they cause damage. Accurate roofing assessments are critical for pre-listing, insurance claims, or scheduled maintenance. Clients searching for Roof Inspection Services or Certified Special Inspection Services can trust Inspire to deliver actionable reports, comprehensive evaluations, and reliable recommendations to prolong the lifespan of roofs and maintain the value and safety of your property."
  },
  {
    "title": "Foundation & Crawlspace Inspections for Ensuring Structural Integrity of Homes and Commercial Buildings",
    "content": "Our Foundation & Crawlspace Inspection Services provide essential evaluations for residential, multi-unit, and commercial properties. These inspections identify cracks, moisture intrusion, settling issues, and potential structural weaknesses that can compromise property safety and value. Inspire’s certified inspectors offer detailed reports and remediation guidance for Historic Homes Inspections, luxury residences, and standard properties. Early detection of foundation problems ensures cost-effective repairs and prevents long-term damage. Clients searching for Structural Special Inspection Services or Multi-Unit Specialized Evaluations receive reliable, thorough assessments to protect investments, maintain compliance, and ensure occupant safety."
  },
  {
    "title": "Specialized Luxury Home Inspections for High-Value Properties Across the USA",
    "content": "Inspire offers Luxury Home Inspections and Malibu & Beach Home Inspections, providing comprehensive evaluations for high-value properties. Our inspections cover structural integrity, pool and spa safety, roofing, plumbing, mold, and environmental risks. These services are critical for pre-listing or property acquisition, ensuring every detail meets safety standards and property regulations. Clients seeking Certified Special Inspection Services or Special Inspection Company USA can rely on Inspire for precise, actionable, and detailed reporting. Our expert inspectors use advanced tools and methodologies to provide property owners, buyers, and real estate professionals with confidence, security, and assurance in every luxury property transaction."
  },
  {
    "title": "Historic Homes Inspections to Preserve Heritage While Ensuring Safety and Structural Soundness",
    "content": "Our Historic Homes Inspections are tailored to the unique challenges of aging properties, balancing preservation with modern safety standards. Inspire evaluates foundations, roofing, structural elements, plumbing, and environmental hazards such as mold or asbestos. These inspections are ideal for homeowners, real estate agents, and buyers interested in Pre-Listing Inspection Services or comprehensive property evaluations. By addressing risks early, our inspections prevent costly repairs and ensure compliance with preservation standards. Clients seeking Special Inspection Services Near Me or Certified Special Inspection Services receive detailed documentation, actionable recommendations, and guidance to protect both historical value and modern usability."
  },
  {
    "title": "General Home Inspections for Residential Safety, Maintenance, and Pre-Sale Evaluations",
    "content": "Inspire’s General Home Inspections provide a complete overview of residential properties, covering structural, mechanical, electrical, plumbing, and environmental aspects. Our inspections support pre-purchase, pre-listing, or routine maintenance needs. Clients looking for Residential Special Inspection Services or Pre-Listing Inspection Services benefit from detailed reporting, photographs, and professional recommendations. These inspections help homeowners and buyers prevent hidden issues, reduce long-term costs, and maintain property value. Inspire’s approach combines technology, certified expertise, and personalized guidance, ensuring every home inspection meets the highest standards of safety, compliance, and thoroughness."
  },
  {
    "title": "Commercial Add-On Inspections for Multi-Unit, Retail, and Industrial Properties Across the USA",
    "content": "Our Commercial Add-On Inspections complement standard evaluations by offering specialized assessments for multi-unit buildings, retail spaces, and industrial properties. These include HVAC, plumbing, pool safety, environmental testing, and structural evaluations. Clients searching for Commercial Pool Inspection Services or Commercial Special Inspection Services benefit from detailed reports and actionable guidance tailored to commercial compliance standards. Inspire’s certified inspectors ensure property safety, regulatory adherence, and operational efficiency. By providing comprehensive inspections, our services help commercial property managers, investors, and owners identify risks early, reduce liabilities, and maintain high-quality standards for tenants and customers alike."
  },
  {
    "title": "Multi-Unit Specialized Evaluations to Ensure Safety and Regulatory Compliance Across Residential and Commercial Properties",
    "content": "Inspire’s Multi-Unit Specialized Evaluations are designed for apartment complexes, condominiums, and multi-tenant commercial properties. Our inspections assess structural integrity, plumbing, electrical systems, mold risk, and environmental safety. These services are crucial for pre-listing, maintenance, and compliance requirements. Clients searching for Special Inspection Services or Certified Special Inspection Services can rely on Inspire to provide actionable, detailed reports. Early identification of issues ensures cost-effective repairs, minimizes liability risks, and enhances tenant satisfaction. Our certified inspectors use advanced technology, experience, and a meticulous approach to deliver inspections that are reliable, thorough, and highly valued by property owners and stakeholders."
  },
  {
    "title": "Environmental & Air Quality Sampling Services to Protect Health and Ensure Safe Indoor Environments",
    "content": "Inspire’s Environmental & Air Quality Sampling evaluates airborne contaminants, allergens, and pollutants in homes, pools, and commercial buildings. These services complement Mold Sampling Inspection Services, providing comprehensive analysis for residential, multi-unit, and commercial properties. Clients searching for Environmental & Air Quality Sampling or Certified Special Inspection Services receive detailed results, recommendations, and actionable guidance for remediation. Our inspections help prevent long-term health hazards, maintain compliance with environmental standards, and support pre-listing or acquisition evaluations. By leveraging technology and certified expertise, Inspire ensures safe, clean, and well-maintained indoor environments for all property types, enhancing safety, comfort, and overall property value."
  }
];

export default function SpecializedClient() {
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

      <section className="relative bg-gradient-to-br from-[#22C55E] to-[#15803D] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-15"><Image src="/why2.jpg" alt="" fill className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#15803D] via-[#15803D]/60 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Advanced Assessments</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Special Inspection <span className="italic">Services</span>
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
            At Inspire, we provide comprehensive Special Inspection Services across the USA, designed to address every residential, commercial, and specialized property need. Our expert team uses advanced technology such as sewer video inspections, mold sampling, pool and spa safety evaluations, roof inspections, and foundation assessments to detect potential issues before they escalate. Whether it’s a luxury home, multi-unit building, historic property, or commercial establishment, our services ensure safety, regulatory compliance, and peace of mind. With our certified inspectors, you receive detailed reports, actionable recommendations, and trustworthy guidance to maintain your property’s integrity and value.
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="text-center mb-16"><p className="text-xs font-bold text-[#22C55E] uppercase tracking-widest mb-4">Specialized Assessments</p><h2 className="text-4xl md:text-5xl font-bold text-black">Comprehensive Services</h2></div>
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

