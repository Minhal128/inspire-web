"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

export default function AboutClient() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Main Hero Section - Data Security */}
        <section className="bg-white py-20 md:py-32 px-4 md:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight">
                Data IN retention
              </h1>
              <div className="w-20 h-1.5 bg-[#F84B5F] rounded-full mx-auto mb-8"></div>
              <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                We use encrypted administrative, technical, and physical safeguards designed to protect all information. Despite our efforts, no method of transmitting or storing data is completely secure.
              </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-10 text-gray-700 leading-relaxed">
              <p className="text-lg md:text-xl">
                If you've ever conducted a property self-inspection, you know the pain: spending hours on-site with a clipboard, taking hundreds of photos, and then returning to the office to spend even more time typing up repetitive reports and matching images to rooms.
              </p>
              
              <p className="text-lg md:text-xl">
                In an industry where every hour counts, manual inspections have long been a major administrative bottleneck. Fortunately, that is changing. The rise of NSPIRE inspection AI-powered inspection software is completely reshaping how inspections and self-inspections are performed.
              </p>

              <p className="text-lg md:text-xl">
                Here is a look at how artificial intelligence streamlines property management, benefiting both property teams and tenants.
              </p>

              {/* AI Features - Zigzag Layout */}
              <div className="space-y-20 py-12">
                {/* Feature 1 - Image Right, Content Left */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-[#006795] rounded-2xl flex items-center justify-center text-white">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#006795]">1. Instant Photo Analysis & Anomaly Detection</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      One of the most powerful applications of AI is Vision AI. Instead of manually labeling images, property inspectors can simply take photos of a deficiency. The AI automatically analyzes images to focus on the defect and flag common issues such as water stains, cracks, mold, and structural wear and tear. It can even spot minor issues that the human eye might miss.
                    </p>
                  </div>
                  <div className="relative group order-first lg:order-last">
                    <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                      <Image
                        src="/1.jpg"
                        alt="AI Photo Analysis and Anomaly Detection in Property Inspection"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>

                {/* Feature 2 - Image Left, Content Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative group">
                    <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                      <Image
                        src="/2.jpg"
                        alt="AI-Powered Report Generation for Property Inspections"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-[#F84B5F] rounded-2xl flex items-center justify-center text-white">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#F84B5F]">2. Hours of Report Writing, Done in Minutes</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Tired of typing out near-identical descriptions for dozens of rooms? AI-driven tools can now prepopulate standard comments and instantly generate highly professional descriptions. Systems equipped with voice-to-text and Natural Language Processing (NLP) allow you to speak your findings, instantly converting them into neatly formatted, on-brand text.
                    </p>
                  </div>
                </div>

                {/* Feature 3 - Image Right, Content Left */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-[#22C55E] rounded-2xl flex items-center justify-center text-white">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#22C55E]">3. Predictive Maintenance</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Rather than reacting to emergency repairs after they happen, AI algorithms can analyze trends across your portfolio and recommend proactive fixes. By comparing current conditions with historical data, AI helps you catch small problems before they turn into costly breakdowns.
                    </p>
                  </div>
                  <div className="relative group order-first lg:order-last">
                    <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                      <Image
                        src="/3jpg.jpg"
                        alt="AI Predictive Maintenance for Property Management"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Human Touch Section */}
              <div className="bg-white p-12 rounded-[40px] border-2 border-gray-100 mt-12">
                <h3 className="text-3xl font-bold mb-6 text-[#006795]">The Human Touch Remains Crucial</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  While AI is handling the heavy lifting of data analysis and routine report generation, human judgment remains irreplaceable. AI is an incredibly powerful digital assistant that augments your expertise, allowing you to focus on strategic maintenance and tenant relations rather than tedious paperwork.
                </p>
              </div>

              {/* Ready to Upgrade Section */}
              <div className="text-center pt-8">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-6">
                  Ready to <span className="text-[#006795]">Upgrade</span> Your Walkthroughs?
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Are you ready to cut hours out of your routine and scale your operations? AI-powered inspections are no longer just an idea of the future; they are here to help you inspect smarter, not harder.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#006795] rounded-full blur-[160px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to <span className="text-[#F84B5F]">NSPIRE</span> Confidence?</h2>
            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed">
              Join thousands of satisfied clients who have trusted Nspire with their property inspections.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                  onClick={() => router.push("/contact")}
                  className="bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full px-12 py-8 text-lg font-bold shadow-2xl transition-all hover:scale-105"
              >
                Contact Us Now
              </Button>
              <Button 
                  variant="outline" 
                  className="bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black rounded-full px-12 py-8 text-lg font-bold transition-all hover:scale-105"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
