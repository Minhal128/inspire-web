"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="bg-white/95 border-b border-slate-200 px-4 md:px-6 py-2 md:py-3 sticky top-0 z-[100] backdrop-blur-xl shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between gap-3 md:gap-6">
          {/* Logo - Left Aligned */}
          <div className="flex-shrink-0 ml-2 md:ml-6">
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="INSPIRE"
                width={280}
                height={77}
                priority
                className="!h-[56px] !w-auto max-w-none"
              />
            </Link>
          </div>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 z-[110]"
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

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-6">
            <Link href="/" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                HOME
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Welcome
              </span>
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                href="/service"
                className="flex flex-col group items-center cursor-pointer"
              >
                <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight flex items-center gap-1">
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
                </span>
                <span className="text-[10px] text-gray-500 italic tracking-wider">
                  Professional Solutions
                </span>
              </Link>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[220px]">
                    <Link
                      href="/service"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Public and Affordable Housing Inspection
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/owners"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F84B5F]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Owners Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/sellers"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Sellers Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/rental"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Rental Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/specialized"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Specialized Services
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/commercial"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Commercial Inspections
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/public-housing"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Public Housing
                      </span>
                    </Link>
                    <Link
                      href="/inspection-services/insurance-risk"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#E8F4F8] transition-colors"
                      onClick={() => setServicesDropdownOpen(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
                      <span className="text-sm text-gray-700 hover:text-primary">
                        Buyer Inspections
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/about" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight text-center">
                ABOUT
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">
                Our Story
              </span>
            </Link>
            <Link href="/contact" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                CONTACT
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Get in Touch
              </span>
            </Link>
            <Link href="/faq" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight">
                FAQ
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                Common Questions
              </span>
            </Link>
            <Link href="/blog" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors leading-tight text-center">
                INSPECTION GUIDE
              </span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">
                AI-Driven Property Inspection
              </span>
            </Link>
          </div>

          {/* Login/Register Button - Right Aligned (Desktop) */}
          <div className="hidden md:flex flex-shrink-0">
            <Button
              onClick={() => router.push("/profile-selection")}
              className="bg-primary hover:bg-[#0A5670] text-primary-foreground rounded-full px-4 md:px-5 py-2 text-xs md:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
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
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[110]"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[120] transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo in Drawer */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <Image
            src="/logo.png"
            alt="INSPIRE"
            width={220}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col overflow-y-auto h-[calc(100%-100px)] bg-white">
          <div className="flex flex-col gap-1 p-4">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">HOME</span>
                <span className="text-[10px] text-gray-500 italic">Welcome</span>
              </div>
            </Link>

            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group w-full"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col flex-1 text-left">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors flex items-center justify-between">
                    SERVICES
                    <svg className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <span className="text-[10px] text-gray-500 italic">Professional Solutions</span>
                </div>
              </button>
              {mobileServicesOpen && (
                <div className="pl-11 mt-1 space-y-1">
                  {[
                    { href: "/service", label: "Public and Affordable Housing Inspection" },
                    { href: "/inspection-services/owners", label: "Owners" },
                    { href: "/inspection-services/sellers", label: "Sellers" },
                    { href: "/inspection-services/rental", label: "Rental" },
                    { href: "/inspection-services/specialized", label: "Specialized" },
                    { href: "/inspection-services/commercial", label: "Commercial" },
                    { href: "/inspection-services/public-housing", label: "Public Housing" },
                    { href: "/inspection-services/insurance-risk", label: "Buyer Inspections" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-sm text-gray-600 hover:text-primary p-2 rounded hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { href: "/about", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "ABOUT", subtitle: "Our Story" },
              { href: "/contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "CONTACT", subtitle: "Get in Touch" },
              { href: "/faq", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "FAQ", subtitle: "Common Questions" },
              { href: "/blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", label: "INSPECTION GUIDE", subtitle: "NSPIRE Standards" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{item.label}</span>
                  <span className="text-[10px] text-gray-500 italic">{item.subtitle}</span>
                </div>
              </Link>
            ))}

            {/* Login/Register Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/profile-selection");
                }}
                className="w-full bg-primary hover:bg-[#0A5670] text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Login / Register</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
