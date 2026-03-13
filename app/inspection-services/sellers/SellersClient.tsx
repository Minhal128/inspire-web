"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sections = [
  {
    title: "Pre-Listing Inspection Services",
    content: "A pre-listing inspection is crucial for property owners preparing to sell. At Inspire, we provide thorough pre-listing home inspections that identify both major and minor defects, evaluate structural integrity, and recommend necessary repairs. These inspections enable sellers to present their homes confidently, reducing surprises during buyer evaluations. Early detection of issues saves time, cost, and negotiation challenges for property owners.",
  },
  {
    title: "Multi-Unit Seller Inspection and Reporting",
    content: "For landlords and property managers, multi-unit seller inspections are essential to maintain transparency and market readiness. Inspire provides multi-unit real estate inspection and multi-family seller inspection services, covering all units in one comprehensive report. Our seller reporting system details property conditions, highlights repair needs, and ensures compliance with HUD/REAC standards.",
  },
  {
    title: "Property Readiness Evaluation",
    content: "A detailed property readiness evaluation helps sellers prepare their homes to attract serious buyers. Inspire's inspections assess structural integrity, mechanical systems, safety compliance, and overall market appeal. Sellers gain insight into pre-listing property inspection results, enabling them to make informed decisions about improvements and pricing.",
  },
  {
    title: "HUD/REAC Pre-Sale Support",
    content: "Navigating HUD/REAC compliance inspections can be challenging for sellers. Inspire offers HUD/REAC pre-sale inspection support services and REAC pre-sale inspection assistance for all property types, ensuring compliance with federal guidelines. We generate detailed reports that clearly outline repairs, upgrades, and compliance actions.",
  },
  {
    title: "Major & Minor Defect Detection",
    content: "Identifying both major and minor defects before listing a property is vital to avoid future disputes. Inspire's inspections cover structural, electrical, plumbing, HVAC, and exterior systems, providing a detailed seller compliance report. Our home inspection for sellers includes actionable recommendations for repair or upgrades to improve safety, functionality, and aesthetics.",
  },
  {
    title: "Repair & Upgrade Recommendations",
    content: "Inspire's repair and upgrade recommendations are tailored to maximize property value and reduce sale delays. Through our pre-sale property inspection and property readiness evaluation, we identify cost-effective upgrades that enhance property appeal. Multi-unit property owners benefit from recommendations addressing compliance, safety, and functionality for all units.",
  },
  {
    title: "Pricing Advantage Inspection Report",
    content: "A pricing advantage inspection report gives sellers a competitive edge by aligning property condition with market expectations. Inspire's inspection report services include detailed analysis of repairs, upgrades, and compliance status, helping sellers justify asking prices. Seller transparency reports reduce buyer skepticism, mitigate negotiation losses, and improve transaction speed.",
  },
  {
    title: "Marketability Enhancement Review",
    content: "Inspire's marketability enhancement review evaluates properties beyond basic inspections, focusing on buyer appeal, safety, and compliance. Sellers benefit from pre-sale home inspection insights, repair recommendations, and HUD/REAC compliance inspection support, enhancing overall market value. By following our guidance, sellers improve property visibility, reduce negotiation delays, and position their homes for quick, profitable sales.",
  },
  {
    title: "Compliance & Safety Verification",
    content: "Ensuring compliance and safety verification is critical for all sellers. Inspire's HUD/REAC pre-sale support and seller compliance report services cover structural integrity, safety systems, and federal regulations. Our multi-unit building inspection and pre-listing inspection identify potential safety risks and compliance gaps, enabling proactive repairs and upgrades.",
  },
  {
    title: "Seller Transparency Report",
    content: "A seller transparency report minimizes negotiation risks and strengthens buyer confidence. Inspire generates online seller transparency and marketplace seller reports detailing property conditions, repair history, and compliance certifications. By offering vendor transparency reports, clients demonstrate honesty and professionalism, increasing the likelihood of smooth, high-value transactions.",
  },
];

export default function SellersClient() {
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
      <section className="relative bg-gradient-to-br from-[#F97316] to-[#EA580C] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image src="/hero.png" alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F97316] via-[#F97316]/70 to-transparent"></div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 text-center">
          <p className="text-white/90 font-bold uppercase tracking-[0.2em] mb-6">Maximize Marketability</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.05]">
            Sellers Inspection <span className="italic">Services</span>
          </h1>
          <p className="text-white/80 text-xl max-w-4xl mx-auto leading-relaxed">
            At Inspire, we provide comprehensive Sellers Inspection Services across the USA, ensuring property owners gain accurate insights before listing. Our services include pre-sale home inspections, HUD/REAC inspection preparation, property readiness evaluations, and seller transparency reports.
          </p>
        </div>
      </section>

      {/* Intro Content */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed">
            By leveraging our experience and compliance expertise, sellers can confidently present their homes to buyers with detailed reports, actionable recommendations, and pricing advantage strategies. Whether it's a single-family home or a multi-unit property, Inspire delivers thorough inspections tailored to each seller's needs, helping clients reduce negotiation risks and enhance property marketability.
          </p>
        </div>
      </section>

      {/* Service Sections */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-12 rounded-2xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316] font-bold text-lg">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-bold text-black group-hover:text-[#F97316] transition-colors">{s.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-[#F8F9FA] py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-[#F97316] uppercase tracking-widest mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-black">Our Inspection Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: "01", title: "Schedule", desc: "Book online or by phone, choose date and property type." },
              { step: "02", title: "On-Site Evaluation", desc: "Certified inspectors assess structural, mechanical, and safety systems." },
              { step: "03", title: "Compliance Review", desc: "Results reviewed against NSPIRE, HUD, REAC, and local codes." },
              { step: "04", title: "Digital Report", desc: "Receive photos, risk assessments, repair estimates, and insights." },
              { step: "05", title: "Post-Inspection", desc: "Follow-up guidance, clarification, and negotiation strategies." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#F97316] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
                <h4 className="font-bold text-black mb-2">{s.title}</h4>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to List With Confidence?</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Get a pre-listing inspection and maximize your property's market value today.</p>
        <Button onClick={() => router.push("/contact")} className="bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-12 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-all">Schedule Your Inspection</Button>
      </section>

      {/* Footer */}
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
