"use client";

import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";

export default function FAQClient() {
  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* FAQ Content Section */}
        <section className="bg-white px-4 md:px-6 py-20 md:py-28 lg:py-32">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16 md:mb-24">
              <p className="text-xs font-bold text-[#006795] uppercase tracking-widest mb-4">Questions & Answers</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">Frequently Asked <span className="text-[#F84B5F] italic font-medium">Questions</span></h2>
              <div className="w-24 h-1.5 bg-[#F84B5F] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Buyer & Seller FAQs */}
              <div className="space-y-12">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-[#006795] flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#006795] text-white flex items-center justify-center text-sm">01</span>
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
                  <h3 className="text-2xl font-bold text-[#006795] flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#006795] text-white flex items-center justify-center text-sm">02</span>
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
                  <h3 className="text-2xl font-bold text-[#F84B5F] flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#F84B5F] text-white flex items-center justify-center text-sm">03</span>
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
                  <h3 className="text-2xl font-bold text-[#F84B5F] flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#F84B5F] text-white flex items-center justify-center text-sm">04</span>
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
      </div>
    </MainLayout>
  );
}
