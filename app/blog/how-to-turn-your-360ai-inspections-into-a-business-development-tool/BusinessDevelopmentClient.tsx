"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

export default function BusinessDevelopmentClient() {
  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#E8F4F8] overflow-x-hidden">
        {/* Article Header */}
        <section className="bg-white py-12 md:py-20 border-b border-gray-100">
          <div className="max-w-[1000px] mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-bold text-[#006795] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                Product Update
              </span>
              <span className="text-sm text-gray-500">March 11, 2026</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333] mb-6 leading-tight">
              How to Turn Your 360AI Inspections Into a Business Development Tool
            </h1>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                 <Image
                    src="/logo.png"
                    alt="Lance Villaram"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                 />
              </div>
              <div>
                <p className="font-bold text-gray-900">Lance Villaram</p>
                <p className="text-sm text-gray-500">4 min read</p>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1000px] mx-auto px-4 md:px-6">
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-16 shadow-2xl">
              <Image
                src="/blog-360ai-business.png"
                alt="360AI Inspections Into a Business Development Tool"
                fill
                className="object-cover"
                priority
              />
            </div>

            <article className="prose prose-lg md:prose-xl max-w-none prose-headings:text-[#333333] prose-a:text-[#006795] prose-img:rounded-2xl">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                If you're evaluating inspection software — or already using Inspection Express — it's time to rethink how you're using it. Many agencies are focused on compliance, but the real opportunity lies in turning 360AI Inspections Into a Business Development Tool that actively helps you win new managements, attract better tenants, and strengthen landlord trust.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                For prospects considering Inspection Express, this is where the real competitive advantage lies. For existing clients, this is your reminder to fully leverage what you already have access to.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                Let's break down how to turn 360AI inspections into growth.
              </p>

              <h2 className="text-3xl font-bold text-[#006795] mt-16 mb-6">Why 360AI Is More Than Just an Inspection Tool</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Traditional inspections serve one purpose: documentation. 360AI inspections serve two:
              </p>
              
              <ul className="list-disc pl-8 mb-8 text-lg text-gray-700 space-y-2">
                <li>Risk protection</li>
                <li>Revenue generation</li>
              </ul>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                With the ability to create marketing virtual tours and send branded appraisal kits, you're not just protecting landlords — you're actively helping win and retain them.
              </p>

              <h2 className="text-3xl font-bold text-[#006795] mt-16 mb-6">1. Turn 360 Inspections into Marketing Assets</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                One of the most underutilised features inside Inspection Express is the 360 Virtual Walkthrough.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                These tours can be created:
              </p>
              <ul className="list-disc pl-8 mb-8 text-lg text-gray-700 space-y-2">
                <li>From a finalised or archived 360 inspection</li>
                <li>Directly from a property in your portfolio</li>
              </ul>
              <p className="text-lg text-gray-700 leading-relaxed mb-12 font-medium">
                That means you can instantly repurpose inspection content into a tenant-facing marketing asset.
              </p>

              <h3 className="text-2xl font-bold text-[#333333] mt-12 mb-6">Elevate Your Listings with 360 Virtual Walkthrough</h3>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Marketing virtual tours allow you to:
              </p>
              <ul className="list-none pl-4 mb-8 text-lg text-gray-700 space-y-3">
                <li className="flex items-start gap-3"><span className="text-[#006795] font-bold">✓</span> Publish a shareable 360 link in minutes</li>
                <li className="flex items-start gap-3"><span className="text-[#006795] font-bold">✓</span> Set expiry dates (default 3 months)</li>
                <li className="flex items-start gap-3"><span className="text-[#006795] font-bold">✓</span> Manage tours from the desktop Admin Portal</li>
                <li className="flex items-start gap-3"><span className="text-[#006795] font-bold">✓</span> Access viewing analytics</li>
                <li className="flex items-start gap-3"><span className="text-[#006795] font-bold">✓</span> Maintain full control over presentation</li>
              </ul>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                Instead of conducting a separate marketing shoot, you can simply transform inspection content so it becomes a compelling digital walkthrough.
              </p>

              <h3 className="text-2xl font-bold text-[#333333] mt-12 mb-6">Refine the Presentation for Maximum Impact</h3>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Marketing is about perception — and 360AI gives you control over that perception. You can:
              </p>

              <div className="space-y-8 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="text-xl font-bold text-[#006795] flex items-center gap-2 mb-3">
                    <span className="text-2xl">🖼️</span> Set a Landing Image
                  </h4>
                  <p className="text-lg text-gray-700 m-0">Choose which room viewers see first. Lead with your strongest feature — an entertainer's kitchen, open-plan living area, or landscaped outdoor space.</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="text-xl font-bold text-[#006795] flex items-center gap-2 mb-3">
                    <span className="text-2xl">📐</span> Adjust Default Viewing Angles
                  </h4>
                  <p className="text-lg text-gray-700 m-0">Inspection photos are captured efficiently. Marketing tours should be positioned intentionally. With a simple adjustment, you can ensure the first view highlights the property's best angle.</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="text-xl font-bold text-[#006795] flex items-center gap-2 mb-3">
                    <span className="text-2xl">🖊️</span> Rename Rooms for Professional Appeal
                  </h4>
                  <p className="text-lg text-gray-700 mb-3">Replace technical inspection labels with presentation-ready names like:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Walk-in Wardrobe</li>
                    <li>Butler's Pantry</li>
                    <li>Powder Room</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="text-xl font-bold text-[#006795] flex items-center gap-2 mb-3">
                    <span className="text-2xl">🚫</span> Exclude Non-Marketing Images
                  </h4>
                  <p className="text-lg text-gray-700 mb-3">Although compliance shots and open cupboard photos can remain in your inspection file, they can still be excluded from the marketing tour.</p>
                  <p className="text-lg text-gray-700 m-0">This way, you maintain detailed documentation internally, while presenting a clean, professional experience externally.</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#333333] mt-12 mb-6">Use Analytics to Strengthen Campaign Performance</h3>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Marketing virtual tours also provide valuable data via the Admin Portal, including:
              </p>
              <ul className="list-disc pl-8 mb-8 text-lg text-gray-700 space-y-2">
                <li>Total visits</li>
                <li>Unique visitors</li>
                <li>Average time spent</li>
                <li>Traffic sources</li>
                <li>Country of origin</li>
                <li>Most viewed 360 image</li>
              </ul>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                This allows you to identify what attracts the most attention and adjust your advertising strategy accordingly.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                If the outdoor area receives more views than the kitchen — that insight can guide your listing imagery and campaign messaging. Over time, this becomes a smarter, more data-driven marketing approach.
              </p>

              <h2 className="text-3xl font-bold text-[#006795] mt-16 mb-6">2. Support Business Development Conversations with the Advantage Kit</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                When landlords compare agencies, clarity and transparency matter. The <strong>Advantage Kit</strong> allows you to send a branded page showcasing:
              </p>
              
              <ul className="list-disc pl-8 mb-8 text-lg text-gray-700 space-y-2">
                <li>A sample 360 entry inspection</li>
                <li>A routine inspection example</li>
                <li>An exit inspection example</li>
                <li>A marketing virtual tour</li>
              </ul>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Rather than explaining how detailed your reports are, you can demonstrate it. Prospective landlords can see:
              </p>
              
              <ul className="list-disc pl-8 mb-8 text-lg text-gray-700 space-y-2">
                <li>Structured layouts</li>
                <li>Clear 360 imagery</li>
                <li>Timestamped documentation</li>
                <li>Professional presentation</li>
                <li>Modern marketing capabilities</li>
              </ul>
              
              <p className="text-lg font-bold text-[#333333] leading-relaxed mb-12">
                It turns your inspection process into tangible proof of service quality.
              </p>

              <h2 className="text-3xl font-bold text-[#006795] mt-16 mb-6">Strengthen Your Agency's Positioning</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Inspections protect you when kept internal, but they differentiate you once made visible.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                360AI helps agencies:
              </p>
              <ul className="list-none pl-4 mb-8 text-lg text-gray-700 space-y-3">
                <li className="flex items-center gap-3"><span className="text-2xl">🔍</span> Demonstrate transparency</li>
                <li className="flex items-center gap-3"><span className="text-2xl">🎩</span> Showcase professionalism</li>
                <li className="flex items-center gap-3"><span className="text-2xl">🏡</span> Improve tenant attraction</li>
                <li className="flex items-center gap-3"><span className="text-2xl">💪</span> Strengthen landlord confidence</li>
                <li className="flex items-center gap-3"><span className="text-2xl">✨</span> Elevate listing presentation</li>
                <li className="flex items-center gap-3"><span className="text-2xl">📊</span> Support growth conversations with real examples</li>
              </ul>
              
              <p className="text-xl font-bold text-[#333333] leading-relaxed mb-12">
                It's no longer just about conducting inspections efficiently. It's about leveraging them strategically.
              </p>

              <h2 className="text-3xl font-bold text-[#006795] mt-16 mb-6">The Bigger Opportunity</h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Whether you're refining your internal processes or exploring ways to stand out in a competitive market, it's clear that the opportunity lies in turning your 360AI Inspections Into a Business Development Tool, thereby making them work harder for your agency.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-16">
                With <span className="font-bold text-[#006795]">Inspection Express 360AI</span>, inspections don't just document properties — they reinforce your value proposition.
              </p>

              {/* CTA Section */}
              <div className="bg-[#006795] text-white p-10 rounded-3xl text-center shadow-xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to See How It Works?</h3>
                <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                  If you'd like to explore how 360AI Marketing Virtual Tours and the Advantage Kit can strengthen your agency's positioning, we'd love to show you.
                </p>
                <Link href="/contact" className="inline-block">
                  <Button className="bg-[#F84B5F] hover:bg-[#d93f50] text-white px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    Book a Personalised Demo
                  </Button>
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
