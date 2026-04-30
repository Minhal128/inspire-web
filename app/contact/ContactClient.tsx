"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MainLayout from "@/components/MainLayout";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Add real form submission logic here if needed
  };

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-[#E8F4F8] pt-12 md:pt-20 pb-32">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 text-center">
            <p className="text-xs font-bold text-[#006795] uppercase tracking-widest mb-4">Connect With Us</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight">
              How Can We <span className="text-[#F84B5F] italic font-medium">Help?</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Have questions about our inspection services or need technical support? We're here to provide the clarity and assistance you need.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative -mt-20 pb-20 px-4 md:px-6">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#006795]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Email Us</h3>
                <p className="text-gray-500 text-sm mb-4">Our friendly team is here to help.</p>
                <a href="mailto:support@inspire.com" className="text-[#006795] font-bold hover:underline text-lg">support@inspire.com</a>
              </div>

              <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FFEAEA] rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#F84B5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 1.01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Call Us</h3>
                <p className="text-gray-500 text-sm mb-4">Mon-Fri from 8am to 6pm.</p>
                <a href="tel:9202202220" className="text-[#F84B5F] font-bold hover:underline text-lg">920-220-2220</a>
              </div>

              <div className="bg-black p-8 rounded-[40px] shadow-xl text-white flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Office</h3>
                <p className="text-gray-400 text-sm">Come say hello at our HQ.</p>
                <p className="mt-4 font-medium">100 Wall Street<br />New York, NY 10005</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-8">Send us a <span className="text-[#F84B5F]">Message</span></h2>
              
              {submitted ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-[#006795]/20 text-[#006795] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                  <Button onClick={() => setSubmitted(false)} variant="default" className="mt-8">Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Full Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#006795] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Email Address</label>
                      <input required type="email" placeholder="john@example.com" className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#006795] transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Subject</label>
                    <select className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#006795] transition-all">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Sales & Partnerships</option>
                      <option>Feedback</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Your Message</label>
                    <textarea required rows={5} placeholder="How can we help you?" className="w-full bg-[#F8F9FA] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#006795] transition-all resize-none"></textarea>
                  </div>
                  <Button type="submit" variant="secondary" size="lg" className="w-full py-8 hover:scale-[1.01] transition-all">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Map Section Mockup */}
        <section className="pb-20 px-4 md:px-6">
           <div className="max-w-[1200px] mx-auto overflow-hidden rounded-[50px] bg-gray-100 h-[400px] relative">
              <div className="absolute inset-0 bg-[#006795]/5 flex items-center justify-center">
                   <div className="text-center">
                      <div className="w-12 h-12 bg-[#F84B5F] rounded-full mx-auto mb-4 animate-bounce flex items-center justify-center">
                           <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Interactive Map Data</p>
                   </div>
              </div>
           </div>
        </section>
      </div>
    </MainLayout>
  );
}
