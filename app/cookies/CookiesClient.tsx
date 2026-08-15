"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { consentCookies } from "@/lib/cookies";

export default function CookiesClient() {
  const [consent, setConsent] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existingConsent = consentCookies.getConsent();
    if (existingConsent) {
      setConsent(existingConsent);
    }
  }, []);

  const handleSavePreferences = () => {
    consentCookies.setConsent(consent);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setConsent(allConsent);
    consentCookies.setConsent(allConsent);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setConsent(minimalConsent);
    consentCookies.setConsent(minimalConsent);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-[#E8F4F8] py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-700">
              Learn how NspireInspection.Ai uses cookies to enhance your experience
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-20 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <p className="text-gray-600 mb-8">
              <strong>Last Updated:</strong> January 2025
            </p>

            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#006795] mb-4">
                What Are Cookies?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                keeping you logged in, and analyzing how you use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                At NspireInspection.Ai, we use cookies and similar technologies to improve our 
                Multi-Unit Property Inspection App and website functionality.
              </p>
            </div>

            {/* Types of Cookies */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#006795] mb-6">
                Types of Cookies We Use
              </h2>

              {/* Necessary Cookies */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#006795] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Necessary Cookies (Required)
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      These cookies are essential for the website to function properly. They enable 
                      core functionality such as security, authentication, and network management.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Authentication tokens (auth_token)</li>
                      <li>User session data (user_data)</li>
                      <li>Security and CSRF protection</li>
                      <li>Selected inspection units (selectedUnits)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F84B5F] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Functional Cookies
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      These cookies enable enhanced functionality and personalization. They remember 
                      your preferences and choices to provide a more personalized experience.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Language preferences</li>
                      <li>Theme and display settings</li>
                      <li>Dashboard layout preferences</li>
                      <li>Inspection filters and sorting options</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Analytics Cookies
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      These cookies help us understand how visitors interact with our website by 
                      collecting and reporting information anonymously. This helps us improve our service.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Page views and navigation patterns</li>
                      <li>Feature usage statistics</li>
                      <li>Performance metrics</li>
                      <li>Error tracking and diagnostics</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Marketing Cookies
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      These cookies track your activity across websites to deliver more relevant 
                      advertising and marketing messages. They may also be used to limit the number 
                      of times you see an advertisement.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Advertising personalization</li>
                      <li>Campaign effectiveness tracking</li>
                      <li>Social media integration</li>
                      <li>Retargeting capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookie Preferences */}
            <div className="mb-12 bg-white border-2 border-gray-200 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-[#006795] mb-6">
                Manage Your Cookie Preferences
              </h2>
              <p className="text-gray-700 mb-6">
                You can control which cookies you allow. Note that disabling certain cookies may 
                affect the functionality of our website.
              </p>

              <div className="space-y-4 mb-6">
                {/* Necessary */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900">Necessary Cookies</h4>
                    <p className="text-sm text-gray-600">Always enabled - Required for site functionality</p>
                  </div>
                  <div className="w-12 h-6 bg-[#006795] rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Functional */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900">Functional Cookies</h4>
                    <p className="text-sm text-gray-600">Enhanced features and personalization</p>
                  </div>
                  <button
                    onClick={() => setConsent({ ...consent, functional: !consent.functional })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      consent.functional ? "bg-[#006795]" : "bg-gray-300"
                    } flex items-center ${consent.functional ? "justify-end" : "justify-start"} px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">Help us improve our services</p>
                  </div>
                  <button
                    onClick={() => setConsent({ ...consent, analytics: !consent.analytics })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      consent.analytics ? "bg-[#006795]" : "bg-gray-300"
                    } flex items-center ${consent.analytics ? "justify-end" : "justify-start"} px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-bold text-gray-900">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">Personalized advertising and content</p>
                  </div>
                  <button
                    onClick={() => setConsent({ ...consent, marketing: !consent.marketing })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      consent.marketing ? "bg-[#006795]" : "bg-gray-300"
                    } flex items-center ${consent.marketing ? "justify-end" : "justify-start"} px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#006795] hover:bg-[#005070] text-white py-6 rounded-full text-lg font-bold"
                >
                  {saved ? "✓ Preferences Saved" : "Save My Preferences"}
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white py-6 rounded-full text-lg font-bold"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-100 py-6 rounded-full text-lg font-bold"
                >
                  Reject All
                </Button>
              </div>

              {saved && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center">
                  Your cookie preferences have been saved successfully!
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#006795] mb-4">
                How to Control Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. However, 
                limiting cookies may impact your experience on our website. You can:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Delete all cookies from your browser</li>
                <li>Block all cookies by default</li>
                <li>Allow cookies only from trusted sites</li>
                <li>Get notifications when cookies are set</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-[#E8F4F8] rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-[#006795] mb-4">
                Questions About Our Cookie Policy?
              </h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about how we use cookies or this Cookie Policy, 
                please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:Support@StateLicensees.Com"
                  className="flex items-center gap-3 text-[#006795] hover:text-[#F84B5F] font-semibold"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Support@StateLicensees.Com
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
