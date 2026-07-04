"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AITimeSavingsClient() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* Logo Section */}
      <div className="bg-[#E8F4F8] pt-[-25] pb-4 flex justify-center">
        <Image
          src="/logo.png"
          alt="NSPIREinspection.AI"
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
              <Link href="/#home" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">HOME</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Welcome</span>
              </Link>
              <Link href="/#services" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">SERVICES</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Professional Solutions</span>
              </Link>
              <Link href="/about" className="flex flex-col group">
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">ABOUT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Discover NSPIREinspection.AI</span>
              </Link>
              <Link href="/contact" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">CONTACT</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Get in Touch</span>
              </Link>
              <Link href="/faq" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">FAQ</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Answers to Questions</span>
              </Link>
              <Link href="/blog" className="flex flex-col group" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-medium text-[#006795] font-bold leading-tight">BLOG</span>
                <span className="text-[11px] text-gray-500 italic tracking-wider">Articles & Insights</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/#home" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">HOME</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Welcome</span>
            </Link>
            <Link href="/#services" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">SERVICES</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Professional Solutions</span>
            </Link>
            <Link href="/about" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight text-center">ABOUT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider text-center">Discover NSPIREinspection.AI</span>
            </Link>
            <Link href="/contact" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">CONTACT</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Get in Touch</span>
            </Link>
            <Link href="/faq" className="flex flex-col group items-center">
              <span className="text-sm font-medium text-gray-800 group-hover:text-[#006795] transition-colors leading-tight">FAQ</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Answers to Questions</span>
            </Link>
            <Link href="/blog" className="flex flex-col group items-center">
              <span className="text-sm font-bold text-[#006795] leading-tight">BLOG</span>
              <span className="text-[10px] text-gray-500 italic tracking-wider">Articles & Insights</span>
            </Link>
          </div>

          <Button onClick={() => router.push("/profile-selection")} className="bg-[#006795] hover:bg-[#00567a] text-white rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium flex items-center gap-2 shadow-md transition-all cursor-pointer">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Login/Register</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </div>
      </nav>

      <article className="max-w-[1000px] mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#E8F4F8] text-[#006795] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Inspection Services</span>
            <span className="text-gray-400 text-sm">April 13, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-4 leading-tight">
            Where AI Is Saving Property Managers the Most Time
          </h1>
          <p className="text-xl md:text-2xl text-[#006795] font-medium mb-8">
            Biggest impact—from inspections to maintenance and leasing workflows.
          </p>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl mb-12">
            <Image
              src="/blog-ai-manager.png"
              alt="Where AI Is Saving Property Managers the Most Time"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-8">
          <p>
            AI time savings for property managers is no longer just a trend—it’s a practical solution to one of the industry’s biggest challenges: time. Property managers juggle inspections, maintenance requests, tenant communication, and leasing tasks daily. As a result, many spend hours on repetitive, non-income-generating work.
          </p>
          <p>
            However, AI is changing that. Instead of replacing property managers, it enhances productivity by handling time-consuming tasks. In turn, this allows professionals to focus on what matters most—building relationships, protecting investments, and growing their portfolios.
          </p>
          <p>
            So, where exactly is AI saving the most time—and how does Inspection Express 360AI fit in?
          </p>

          <h2 className="text-3xl font-bold text-[#333333] mt-12 mb-6">Inspections: From Hours to Minutes with 360AI</h2>
          
          <div className="relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden shadow-lg my-8">
            <Image
              src="/blog-ai-kitchen.png"
              alt="Modern Kitchen Inspection with AI"
              fill
              className="object-cover"
            />
          </div>

          <p>
            One of the biggest areas of AI time savings for property managers is inspections. Traditionally, completing a detailed inspection report could take two to four hours. This includes writing notes, organizing photos, and ensuring accuracy.
          </p>
          <p>
            With <strong>Inspection Express 360AI</strong>, this process is dramatically faster.
          </p>
          <p>Instead of manually documenting every detail, property managers can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Capture a 360° image of each room</li>
            <li>Let AI analyze the space instantly</li>
            <li>Automatically generate a structured inspection report</li>
          </ul>
          <p>
            As a result, inspections that once took hours can now be completed in as little as 30–45 minutes.
          </p>
          <p>Moreover, Inspection Express 360AI ensures:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Consistent and standardized reports</li>
            <li>Reduced human error</li>
            <li>Faster turnaround times</li>
          </ul>
          <p>
            Property managers still review and finalize reports, but the most time-consuming part is handled. Therefore, they can complete more inspections without increasing workload.
          </p>

          <h2 className="text-3xl font-bold text-[#333333] mt-12 mb-6">Maintenance: The Biggest Time Drain Solved</h2>
          
          <div className="relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden shadow-lg my-8">
            <Image
              src="/blog-ai-dashboard.png"
              alt="Property Management AI Dashboard Analytics"
              fill
              className="object-cover"
            />
          </div>

          <p>
            Maintenance is often the largest time consumer in property management, taking up to 50–60% of a manager’s day. This is where AI time savings becomes even more impactful.
          </p>
          <p>AI can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Triage tenant requests automatically</li>
            <li>Ask follow-up questions to gather details</li>
            <li>Collect photos and videos</li>
            <li>Recommend the right tradesperson</li>
          </ul>
          <p>
            Instead of going back and forth with tenants, AI gathers all the necessary information upfront. Consequently, property managers can act faster and reduce delays.
          </p>
          <p>
            Additionally, predictive maintenance tools help identify issues early. This prevents costly emergencies and improves tenant satisfaction.
          </p>

          <h2 className="text-3xl font-bold text-[#333333] mt-12 mb-6">Leasing: Faster Responses, Better Efficiency</h2>
          <p>
            Leasing is another area where AI time savings for property managers plays a crucial role. Handling inquiries, renewals, and tenant communication can be overwhelming without support.
          </p>
          <p>AI helps by:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Automating initial responses to inquiries</li>
            <li>Sending lease renewal reminders</li>
            <li>Categorizing tenant requests</li>
            <li>Providing instant answers to common questions</li>
          </ul>
          <p>
            Because of this, property managers can respond quickly without sacrificing quality. At the same time, they can focus on high-value conversations that require a human touch.
          </p>

          <h2 className="text-3xl font-bold text-[#333333] mt-12 mb-6">Document Analysis and Admin Tasks in AI Time Savings</h2>
          <p>
            Administrative work often slows down productivity. Reviewing documents, summarizing reports, and drafting content can take hours. Fortunately, AI simplifies these tasks by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Summarizing long documents in seconds</li>
            <li>Extracting key insights</li>
            <li>Assisting with professional writing</li>
            <li>Organizing information efficiently</li>
          </ul>
          <p>
            As a result, AI time savings for property managers extends beyond operations and into daily admin work. Managers can make faster decisions without getting overwhelmed by paperwork.
          </p>

          <h2 className="text-3xl font-bold text-[#333333] mt-12 mb-6">Smarter Workflows Across the Business</h2>
          <p>
            To maximize AI time savings for property managers, it’s important to look at the business as a whole. Start by identifying key operational areas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Inspections (enhanced by Inspection Express 360AI)</li>
            <li>Maintenance</li>
            <li>Leasing</li>
            <li>Client communication</li>
          </ul>
          <p>
            Then, apply AI where it delivers the most impact. Even small improvements in each area can lead to significant time savings overall. Over time, this creates a more efficient and scalable business.
          </p>

          <h3 className="text-2xl font-bold text-[#333333] mt-10 mb-4">What AI Should NOT Replace</h3>
          <p>
            While AI is powerful, it cannot replace human empathy. Property management is built on relationships, trust, and communication.
          </p>
          <p>For example:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sensitive tenant issues require a human response</li>
            <li>Final decisions should always be reviewed</li>
            <li>AI-generated outputs must be verified</li>
          </ul>
          <p>
            In short, AI should support—not replace—the human side of property management.
          </p>

          <h3 className="text-2xl font-bold text-[#333333] mt-10 mb-4">The Real ROI of AI</h3>
          <p>
            Some property managers hesitate due to cost. However, when you calculate the time saved, the return on investment becomes clear.
          </p>
          <p>Consider this:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Saving 2–3 hours per inspection with Inspection Express 360AI</li>
            <li>Reducing maintenance coordination time</li>
            <li>Automating repetitive admin tasks</li>
          </ul>
          <p>
            These efficiencies quickly translate into real cost savings. Ultimately, it allows businesses to grow without increasing headcount.
          </p>
          <p>
            AI is no longer optional—it’s becoming essential. From inspections powered by Inspection Express 360AI to smarter maintenance and leasing workflows, the benefits are clear.
          </p>
          <p>
            By adopting AI strategically, property managers can save time, reduce stress, and focus on what truly matters. Most importantly, they can deliver better service while scaling their business efficiently.
          </p>

          <div className="bg-[#E8F4F8] p-8 rounded-3xl mt-12 border border-[#006795]/20">
            <h3 className="text-2xl font-bold text-[#006795] mb-4">🚀 Ready to Save Time with AI?</h3>
            <p className="font-bold text-[#333333] mb-4">Transform your inspections and workflows with smarter AI tools.</p>
            <p>
              Discover how Inspection Express 360AI can help you complete inspections faster, reduce admin time, and boost productivity.
            </p>
            <Button className="mt-6 bg-[#F84B5F] hover:bg-[#EE3646] text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all">
              Get Started Today
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-20 pt-10 flex justify-between items-center mb-20 px-4 md:px-6 max-w-[1000px] mx-auto">
          <Link href="/blog" className="flex items-center gap-2 text-[#006795] font-bold hover:underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Blog
          </Link>
        </div>
      </article>

      <footer className="bg-black text-white py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Image src="/logo.png" alt="NSPIREinspection.AI" width={120} height={40} className="mx-auto mb-6 h-8 w-auto" />
          <p className="text-gray-400 text-xs text-center">© 2026 NSPIREinspection.AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
