"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogIndex() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const blogs = [
    {
      title: "Sewer Scope Inspection",
      subtitle: "What It Is and Why It Matters for Homeowners Across the U.S.",
      slug: "sewer-scope-inspection",
      excerpt: "Buying or owning a home comes with responsibilities that go far beyond what you can see during a casual walkthrough.",
      image: "/blog-sewer-scope.png",
      date: "March 13, 2026",
      category: "Inspection Services"
    },
    {
      title: "Professional Roof Inspections",
      subtitle: "Across the U.S. to Prevent Leaks, Moisture Damage, and Costly Repairs",
      slug: "professional-roof-inspections",
      excerpt: "One of the most critical yet overlooked aspects of property maintenance is the roof. Even small leaks can lead to significant damage.",
      image: "/blog-roof.png",
      date: "March 13, 2026",
      category: "Inspection Services"
    },
    {
      title: "Sewer Scope Inspection Guide",
      subtitle: "Everything You Need to Know About Underground Pipe Health",
      slug: "what-is-sewer-scope-inspection",
      excerpt: "Many homeowners don’t realize that one of the most important systems in their home is hidden underground: the sewer line.",
      image: "/blog-sewer-scope.png",
      date: "March 13, 2026",
      category: "Inspection Services"
    },
    {
      title: "Professional Home Inspection",
      subtitle: "What to Expect and Why They Matter",
      slug: "professional-home-inspection-services",
      excerpt: "A home inspection provides a detailed understanding of a property’s condition before the deal is finalized. It helps buyers make informed decisions.",
      image: "/blog-home-pros.png",
      date: "March 13, 2026",
      category: "Inspection Services"
    },
    {
      title: "Real Estate Professional Services",
      subtitle: "Building Trust and Smoother Transactions",
      slug: "home-inspection-services-for-real-estate-professionals",
      excerpt: "Partnering with a reliable inspection service can significantly improve the transaction experience. Deliver peace of mind and transparency.",
      image: "/blog-re-pros.png",
      date: "March 13, 2026",
      category: "For Professionals"
    },
    {
      title: "10 Common Problems",
      subtitle: "Issues Found During Home Inspections",
      slug: "10-common-problems-found",
      excerpt: "Even homes that appear well-maintained can have hidden problems. Understanding these common issues helps buyers make informed decisions.",
      image: "/blog-problems.png",
      date: "March 13, 2026",
      category: "Expert Advice"
    },
    {
      title: "Home Inspection Checklist",
      subtitle: "What to Look for Before Buying a Home",
      slug: "home-inspection-checklist-for-buyers",
      excerpt: "A home inspection checklist gives buyers a clear idea of the important areas that should be evaluated before making a final decision.",
      image: "/blog-checklist.png",
      date: "March 13, 2026",
      category: "Buyer Guide"
    }
  ];

  return (
    <main className="w-full min-h-screen bg-[#E8F4F8] overflow-x-hidden">
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
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-800 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}

          {/* Mobile Menu */}
          <div
            className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#E8F4F8] z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex flex-col gap-6 p-8 pt-36">
              <Link href="/#home" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
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
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">FAQ</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Answers to Questions</span>
              </Link>
              <Link href="/blog" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-[#0D6A8D] font-bold leading-tight">BLOG</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Articles & Insights</span>
              </Link>
            </div>
          </div>

          {/* Desktop Menu - Left aligned */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/#home" className="flex flex-col group items-center">
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
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#0D6A8D] transition-colors leading-tight">FAQ</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Answers to Questions</span>
            </Link>
            <Link href="/blog" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-[#0D6A8D] leading-tight">BLOG</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Articles & Insights</span>
            </Link>
          </div>

          {/* Login/Register Button */}
          <Button
            onClick={() => router.push("/profile-selection")}
            className="bg-[#1E88A8] hover:bg-[#176B87] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden sm:inline">Login/Register</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">Blog</h1>
          <div className="w-20 h-1 bg-[#FF4757] rounded-full"></div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-16 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 space-y-24">
          {blogs.map((blog) => (
            <article key={blog.slug} className="group">
              <Link href={`/blog/${blog.slug}`} className="block overflow-hidden rounded-[32px] mb-8 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Link>
              
              <div className="max-w-[900px]">
                <Link href={`/blog/${blog.slug}`}>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2 leading-tight group-hover:text-[#0D6A8D] transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-xl text-[#0D6A8D] font-medium mb-4">
                    {blog.subtitle}
                  </p>
                </Link>
                
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                  <span>by Inspire Experts</span>
                  <span>|</span>
                  <span>{blog.date}</span>
                  <span>|</span>
                  <span className="text-[#0D6A8D]">{blog.category}</span>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {blog.excerpt}...
                </p>
                
                <Link 
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-2 text-[#0D6A8D] font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Read More
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
          
          {/* Pagination Placeholder */}
          <div className="pt-12 border-t border-gray-100 flex items-center gap-6">
            <span className="text-gray-400 cursor-not-allowed uppercase text-sm tracking-widest font-bold">« Newer Entries</span>
            <Link href="#" className="text-[#333333] hover:text-[#0D6A8D] uppercase text-sm tracking-widest font-bold">Older Entries »</Link>
          </div>
        </div>

        {/* Sidebar Placeholder */}
        <aside className="lg:w-[350px] space-y-12">
          <div className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-50">
            <h3 className="text-xl font-bold text-black mb-6">Search Blogs</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#0D6A8D] transition-all"
              />
              <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-[#0D6A8D] p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Free NSPIRE Checklist</h3>
              <p className="opacity-80 mb-8 text-sm leading-relaxed">Download our comprehensive home inspection checklist for free.</p>
              <Button className="w-full bg-[#FF4757] hover:bg-[#EE3646] text-white rounded-full py-6 font-bold transition-all shadow-lg">Download Now</Button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 text-center md:text-left">
            <div>
              <Image src="/logo.png" alt="INSPIRE" width={150} height={50} className="mb-6 mx-auto md:mx-0" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering homeowners and real estate professionals with expert inspection insights.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-[#FF4757]">Quick Links</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/#services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-[#FF4757]">Contact</h4>
              <p className="text-gray-400 text-sm mb-2 text-center md:text-left">Email: info@inspireexperts.com</p>
              <p className="text-gray-400 text-sm">Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs text-center">© 2026 Nspire Home Inspections. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
