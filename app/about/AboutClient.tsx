"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AboutClient() {
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
            <div className="flex flex-col gap-6 p-8 pt-20">
              <Link href="/" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">HOME</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Welcome</span>
              </Link>
              <Link href="/#services" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">SERVICES</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Professional Solutions</span>
              </Link>
              <Link href="/#education" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">EDUCATION AND TRAINING</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Learning & Training</span>
              </Link>
              <Link href="/#purpose" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">PURPOSE OF INSPECTION</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Why We Inspect</span>
              </Link>
              <Link href="/contact" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">CONTACT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Get in Touch</span>
              </Link>
              <Link href="/faq" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">FAQ</span>
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
            <Link href="/#education" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight text-center">EDUCATION AND TRAINING</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">Learning & Training</span>
            </Link>
            <Link href="/#purpose" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight text-center">PURPOSE OF INSPECTION</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">Why We Inspect</span>
            </Link>
            <Link href="/contact" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">CONTACT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span>
            </Link>
            <Link href="/faq" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">FAQ</span>
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

      {/* Hero Section */}
      <section className="relative bg-[#0D6A8D] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF4757] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10 text-center">
          <p className="text-[#7FFF00] font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in">Empowering Property Decisions</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 leading-[1.1]">
            About <span className="text-[#FF4757] italic">Inspire</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-white/80 leading-relaxed font-light">
            Founded on the principles of transparency and expertise, Nspire Home Inspections is dedicated to providing homeowners and investors with the clarity they need.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <Image
                src="/blog-home-pros.png"
                alt="Our Mission"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="absolute -bottom-8 -right-8 bg-[#FF4757] text-white p-12 rounded-[32px] shadow-2xl hidden md:block">
              <p className="text-4xl font-bold">10+</p>
              <p className="text-sm uppercase tracking-widest font-medium opacity-80">Years of Excellence</p>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <p className="text-sm font-bold text-[#0D6A8D] uppercase tracking-widest mb-4">Our Core Values</p>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight">A Commitment to <span className="text-[#0D6A8D]">Quality</span></h2>
              <div className="w-20 h-1.5 bg-[#FF4757] rounded-full mb-12"></div>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#E8F4F8] rounded-2xl flex items-center justify-center text-[#0D6A8D]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Integrity First</h3>
                    <p className="text-gray-600 leading-relaxed">We provide unbiased, data-driven reports that reflect the true condition of every property we inspect.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#FEF2F2] rounded-2xl flex items-center justify-center text-[#FF4757]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Continuous Innovation</h3>
                    <p className="text-gray-600 leading-relaxed">From drones to thermal imaging, we utilize the latest technology to ensure no detail is missed.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#22C55E]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Client-Centric Approach</h3>
                    <p className="text-gray-600 leading-relaxed">Our relationship doesn't end with a report. We are here to answer questions and provide ongoing support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0D6A8D] rounded-full blur-[160px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to <span className="text-[#FF4757]">Inspire</span> Confidence?</h2>
          <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed">
            Join thousands of satisfied clients who have trusted Nspire with their property inspections.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
                onClick={() => router.push("/contact")}
                className="bg-[#FF4757] hover:bg-[#EE3646] text-white rounded-full px-12 py-8 text-lg font-bold shadow-2xl transition-all hover:scale-105"
            >
              Contact Us Now
            </Button>
            <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-12 py-8 text-lg font-bold"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Image src="/logo.png" alt="INSPIRE" width={150} height={50} className="mb-8" />
              <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
                Leading the industry in professional residential and commercial property inspections.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#0D6A8D] cursor-pointer hover:bg-[#0D6A8D] hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                {/* Add more social icons as needed */}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-black mb-6">Explore</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link href="/" className="hover:text-[#0D6A8D]">Home</Link></li>
                <li><Link href="/about" className="hover:text-[#0D6A8D] text-[#0D6A8D] font-bold">About Us</Link></li>
                <li><Link href="/#services" className="hover:text-[#0D6A8D]">Services</Link></li>
                <li><Link href="/blog" className="hover:text-[#0D6A8D]">Insight Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-6">Support</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><Link href="/faq" className="hover:text-[#0D6A8D]">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-[#0D6A8D]">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-[#0D6A8D]">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[#0D6A8D]">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-xs">© 2026 Nspire Home Inspections. All rights reserved.</p>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Atlanta • Alpharetta • Marietta</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
