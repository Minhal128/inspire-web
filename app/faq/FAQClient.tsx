"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FAQClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Logo Section */}
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center">
        <Image
          src="/logo.png"
          alt="INSPIRE"
          width={500}
          height={600}
          priority
          className="h-14 md:h-32 lg:h-40 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="bg-[#E8F4F8] px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>

          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileMenuOpen(false)}></div>
          )}

          <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex flex-col gap-6 p-8 pt-36">
              <Link href="/" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">HOME</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Welcome</span>
              </Link>
              <Link href="/#services" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">SERVICES</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Professional Solutions</span>
              </Link>
              <Link href="/about" className="flex flex-col group">
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">ABOUT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Discover Inspire</span>
              </Link>
              <Link href="/contact" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">CONTACT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Get in Touch</span>
              </Link>
              <Link href="/faq" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-[#0D6A8D] font-bold leading-tight">FAQ</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Answers to Questions</span>
              </Link>
              <Link href="/blog" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">BLOG</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Articles & Insights</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">HOME</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Welcome</span>
            </Link>
            <Link href="/#services" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">SERVICES</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Professional Solutions</span>
            </Link>
            <Link href="/about" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight text-center">ABOUT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">Discover Inspire</span>
            </Link>
            <Link href="/contact" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">CONTACT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span>
            </Link>
            <Link href="/faq" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-[#0D6A8D] leading-tight">FAQ</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Answers to Questions</span>
            </Link>
            <Link href="/blog" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">BLOG</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Articles & Insights</span>
            </Link>
          </div>

          <Button
            onClick={() => router.push("/profile-selection")}
            className="bg-[#1E88A8] hover:bg-[#176B87] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Login/Register</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      {/* FAQ Content Section */}
      <section className="bg-white px-4 md:px-6 py-20 md:py-28 lg:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <p className="text-xs font-bold text-[#0D6A8D] uppercase tracking-widest mb-4">Questions & Answers</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">Frequently Asked <span className="text-[#FF4757] italic">Questions</span></h2>
            <div className="w-24 h-1.5 bg-[#FF4757] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Buyer & Seller FAQs */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-[#0D6A8D] flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#0D6A8D] text-white flex items-center justify-center text-sm">01</span>
                  For Home Buyers
                </h3>
                <div className="space-y-6">
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">What is included in a pre buy inspection by Nspire?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">A pre buy inspection from Nspire includes a full evaluation of structural components, electrical systems, plumbing, HVAC, roofing, interior and exterior features, and safety hazards. Buyers can also add services like radon testing, mold testing, sewer scope inspection, termite inspection, deck inspection, septic inspection, and more.</p>
                  </div>
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">Who pays for the inspection when buying a house in the USA?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">In most cases, the buyer pays for the home inspection when buying a house. This includes the full home inspection, pre buy inspection, environmental tests, and any specialty add ons.</p>
                  </div>
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">How much does a pre buy inspection cost?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">The pre buy inspection cost depends on the size of the home, location, and selected add on services. Nspire provides transparent pricing so buyers can customize their inspection based on property type and risk level.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-[#0D6A8D] flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#0D6A8D] text-white flex items-center justify-center text-sm">02</span>
                  For Home Sellers
                </h3>
                <div className="space-y-6">
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">What is a home inspection for home sellers and why is it important?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">A home inspection for home sellers is a professional assessment conducted before listing to identify issues that may affect the sale. It helps avoid surprises during buyer inspections and increases buyer confidence.</p>
                  </div>
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">How much does a pre listing inspection cost?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Pre listing inspection cost varies based on property size, systems, features, and add on services such as Mold Air Testing or Sewer Scope Inspection.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Homeowner & Commercial FAQs */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-[#FF4757] flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#FF4757] text-white flex items-center justify-center text-sm">03</span>
                  For Homeowners
                </h3>
                <div className="space-y-6">
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">Why do homeowners need a home inspection?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Homeowners need a home inspection to understand the true condition of their property, identify early maintenance issues, and prevent costly repairs.</p>
                  </div>
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">How often should homeowners inspect their home?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Most experts recommend an annual home inspection to maintain safety, efficiency, and value. Catching problems early ensures preventive maintenance is completed before major repairs are needed.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-[#FF4757] flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#FF4757] text-white flex items-center justify-center text-sm">04</span>
                  Commercial Properties
                </h3>
                <div className="space-y-6">
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">What is included in a commercial inspection by Nspire?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">A commercial inspection covers core building systems, structural components, roofing, HVAC units, electrical panels, fire and life safety systems, and more. Retail, office, and industrial sites are all covered.</p>
                  </div>
                  <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100">
                    <h4 className="font-bold text-black mb-3">How long does a commercial inspection take?</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Most commercial inspections take between a few hours and a full business day, depending on square footage and system complexity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:support@inspire.com" className="hover:text-white">support@inspire.com</a>
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1.01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:9202202220" className="hover:text-white">9202202220</a>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest updates and inspection tips.</p>
              <div className="flex">
                <input type="email" placeholder="Email address" className="bg-white/10 border border-white/20 rounded-l px-4 py-2 w-full outline-none focus:border-[#0D6A8D] transition-colors" />
                <button className="bg-[#0D6A8D] hover:bg-[#0A5670] px-4 py-2 rounded-r transition-colors">Join</button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <Image src="/logo.png" alt="INSPIRE" width={120} height={40} className="h-8 w-auto" />
            <p className="text-gray-400 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-white text-xs">Terms</Link>
              <Link href="#" className="text-gray-400 hover:text-white text-xs">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
