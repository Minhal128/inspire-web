"use client";

import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";
import { useRouter } from "next/navigation";
import { CheckCircle2, Shield, Activity, Home } from "lucide-react";

export default function InspectionGuide() {
  const router = useRouter();

  const inspectionCategories = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Life Safety",
      color: "bg-red-500",
      items: ["Smoke alarms", "CO alarms", "Egress", "Electrical hazards", "Fire hazards"]
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Health & Sanitation",
      color: "bg-orange-500",
      items: ["Mold-like substances", "Pests", "Water leaks", "Plumbing failures", "Ventilation"]
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Function & Operability",
      color: "bg-blue-500",
      items: ["Doors", "Windows", "Appliances", "HVAC", "Lighting", "Structural components"]
    }
  ];

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#E8F4F8] overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#006795] to-[#004A6B] py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Inspection Guide</h1>
            <div className="w-24 h-1.5 bg-[#F84B5F] rounded-full mx-auto mb-8"></div>
            <p className="text-2xl md:text-3xl font-bold text-white/95 mb-6">
              NSPIRE-Aligned Property Inspection Guide
            </p>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              Apartment inspections ensure that a unit meets the National Standard for Inspection of Real Estate (NSPIRE) safety, health, and functional standards. Inspectors evaluate life-safety devices, electrical and plumbing systems, heating and cooling, structural integrity, moisture intrusion, and overall sanitation.
            </p>
          </div>
        </section>

        {/* Three Core Principles */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#006795] mb-4">
              Three Core NSPIRE Principles
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Every item is assessed against NSPIRE's three fundamental principles
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border-2 border-red-200">
                <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4">1</div>
                <h3 className="text-2xl font-bold text-red-700 mb-3">Health & Safety</h3>
                <p className="text-gray-700">Critical life-safety and health hazard prevention</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4">2</div>
                <h3 className="text-2xl font-bold text-blue-700 mb-3">Functionality</h3>
                <p className="text-gray-700">All systems and components must operate properly</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-200">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4">3</div>
                <h3 className="text-2xl font-bold text-green-700 mb-3">Resident Condition</h3>
                <p className="text-gray-700">Cleanliness and proper maintenance standards</p>
              </div>
            </div>
          </div>
        </section>

        {/* NSPIRE Framework */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#006795] mb-4">
              NSPIRE Inspection Framework
            </h2>
            <p className="text-center text-gray-600 mb-12">
              NSPIRE organizes deficiencies into three categories
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {inspectionCategories.map((category, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Inspection Areas */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#006795] mb-12">
              Key NSPIRE Inspection Categories
            </h2>
            <div className="space-y-8">
              {/* Life Safety */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl">
                <h3 className="text-2xl font-bold text-red-700 mb-4">1. Life Safety (NSPIRE Priority 1)</h3>
                <div className="grid md:grid-cols-3 gap-6 text-gray-700">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Smoke & CO Alarms</h4>
                    <p className="text-sm">Must be present, installed correctly, and functional. Missing or non-functional alarms = NSPIRE Life-Threatening.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Electrical Safety</h4>
                    <p className="text-sm">No exposed wiring, damaged outlets, or switches. GFCI required in wet areas. Burn marks or arcing = NSPIRE Hazard.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Egress</h4>
                    <p className="text-sm">Windows must open, doors must latch, no blocked exits.</p>
                  </div>
                </div>
              </div>

              {/* Health & Sanitation */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-2xl">
                <h3 className="text-2xl font-bold text-orange-700 mb-4">2. Health & Sanitation (NSPIRE Priority 2)</h3>
                <div className="grid md:grid-cols-3 gap-6 text-gray-700">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Moisture & Mold-Like Substances</h4>
                    <p className="text-sm">Stains, leaks, or mold-like growth must be corrected. Active leaks = NSPIRE Health Hazard.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Pests</h4>
                    <p className="text-sm">Evidence of infestation triggers required corrective action.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Ventilation</h4>
                    <p className="text-sm">Bathroom exhaust fan must operate, OR window must open.</p>
                  </div>
                </div>
              </div>

              {/* Structural Integrity */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">3. Structural Integrity (NSPIRE Priority 2)</h3>
                <div className="text-gray-700">
                  <p className="mb-3">Inspectors check:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" /><span>Walls, ceilings, floors for cracks, sagging, holes</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" /><span>Doors and windows for proper operation</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" /><span>Foundation or balcony issues = High-severity NSPIRE deficiency</span></li>
                  </ul>
                </div>
              </div>

              {/* Electrical Systems */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">4. Electrical Systems (NSPIRE Priority 1)</h3>
                <div className="text-gray-700">
                  <p className="mb-3">Inspectors verify:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" /><span>All outlets function</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" /><span>Light fixtures operate</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" /><span>No missing covers</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" /><span>No unsafe panels (Zinsco / Federal Pacific)</span></li>
                  </ul>
                </div>
              </div>

              {/* Plumbing Systems */}
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded-r-2xl">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">5. Plumbing Systems (NSPIRE Priority 2)</h3>
                <div className="text-gray-700">
                  <p className="mb-3">Inspectors check:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" /><span>Hot/cold water availability</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" /><span>Proper drainage</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" /><span>No leaks at faucets, traps, or supply lines</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" /><span>Toilets flush and refill properly</span></li>
                  </ul>
                </div>
              </div>

              {/* HVAC & Appliances */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-2xl">
                <h3 className="text-2xl font-bold text-purple-700 mb-4">6. HVAC & Appliances (NSPIRE Priority 2)</h3>
                <div className="text-gray-700">
                  <p className="mb-3">Inspectors confirm:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" /><span>Heating meets local code temperature requirements</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" /><span>Cooling operates where provided</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" /><span>Thermostat functions</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" /><span>Appliances included in the lease operate safely</span></li>
                  </ul>
                </div>
              </div>

              {/* Cleanliness */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                <h3 className="text-2xl font-bold text-green-700 mb-4">7. Cleanliness & Resident Condition (NSPIRE Priority 3)</h3>
                <div className="text-gray-700">
                  <p className="mb-3">Inspectors look for:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span>Excessive clutter blocking exits</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span>Sanitation issues</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span>Damage beyond normal wear and tear</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span>Flooring, walls, ceilings in acceptable condition</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preparation Tips */}
        <section className="bg-gradient-to-br from-[#006795] to-[#004A6B] py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Tips for Passing an NSPIRE Inspection
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Declutter and clean",
                "Replace smoke alarm batteries",
                "Fix minor issues (bulbs, loose knobs)",
                "Report leaks immediately",
                "Document unit condition with photos",
                "Know your lease responsibilities",
                "Cooperate with inspectors"
              ].map((tip, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-white text-lg">{tip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Checklist */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#006795] mb-12">
              Final NSPIRE Inspection Checklist
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-500" />
                  Life Safety
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> Smoke alarms working</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> CO alarms working</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> No exposed wiring</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> All exits accessible</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> GFCI outlets functional</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-orange-500" />
                  Health & Sanitation
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> No leaks</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> No mold-like substances</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> No pests</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> Bathroom ventilation works</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Home className="w-6 h-6 text-blue-500" />
                  Function & Operability
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> Doors/windows open and lock</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> Outlets and lights work</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> Plumbing fixtures operate</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> HVAC heats/cools properly</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> Appliances function</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  Resident Condition
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> Unit clean</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> No excessive clutter</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> No major damage</li>
                  <li className="flex items-center gap-2"><input type="checkbox" className="w-5 h-5 rounded" /> Floors/walls/ceilings intact</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="max-w-[900px] mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#006795] mb-12">
              FAQs (NSPIRE-Aligned)
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "What do NSPIRE inspections look for?",
                  a: "Safety, health, and functionality: alarms, electrical, plumbing, HVAC, leaks, mold-like substances, structural issues, and cleanliness."
                },
                {
                  q: "Why do apartments do inspections?",
                  a: "To catch hazards early, maintain compliance, and protect residents and property value."
                },
                {
                  q: "What do city inspectors look for?",
                  a: "Fire code, health code, structural integrity, safe exits, and habitability."
                },
                {
                  q: "How much notice is required?",
                  a: "Most states require 24–48 hours. NSPIRE follows local law."
                },
                {
                  q: "Can apartments do random inspections?",
                  a: "Yes, but they must follow notice and reasonableness standards."
                },
                {
                  q: "What happens if I fail an inspection?",
                  a: "Deficiencies must be corrected. Life-safety issues require immediate action."
                },
                {
                  q: "How often can a landlord inspect?",
                  a: "Typically once or twice per year unless repairs or emergencies require entry."
                },
                {
                  q: "What counts as damage vs wear & tear?",
                  a: "Wear & tear = minor scuffs, small nail holes. Damage = broken fixtures, large holes, misuse."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#006795] rounded-full blur-[160px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to <span className="text-[#F84B5F]">NSPIRE</span> Confidence?</h2>
            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed">
              Professional NSPIRE inspections for public, affordable housing, and buyer inspections nationwide
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={() => router.push("/signup")}
                className="bg-[#F84B5F] hover:bg-[#EE3646] text-white rounded-full px-12 py-8 text-lg font-bold shadow-2xl transition-all hover:scale-105"
              >
                Get Started Now
              </Button>
              <Button 
                onClick={() => router.push("/contact")}
                variant="outline" 
                className="bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-black rounded-full px-12 py-8 text-lg font-bold transition-all hover:scale-105"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
