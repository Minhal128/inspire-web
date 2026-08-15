"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { consentCookies } from "@/lib/cookies";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = consentCookies.hasConsent();
    if (!hasConsent) {
      // Show banner after a short delay
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    consentCookies.setConsent(allConsent);
    setShowBanner(false);
    
    // Initialize analytics/marketing scripts here if needed
    initializeScripts(allConsent);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    consentCookies.setConsent(minimalConsent);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    consentCookies.setConsent(preferences);
    setShowBanner(false);
    
    // Initialize scripts based on preferences
    initializeScripts(preferences);
  };

  const initializeScripts = (consent: typeof preferences) => {
    // Initialize analytics if allowed
    if (consent.analytics) {
      console.log("Analytics enabled");
      // Add Google Analytics or other analytics scripts here
      // Example: window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }

    // Initialize marketing if allowed
    if (consent.marketing) {
      console.log("Marketing enabled");
      // Add marketing/advertising scripts here
    }

    // Initialize functional if allowed
    if (consent.functional) {
      console.log("Functional cookies enabled");
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" />

      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          {!showDetails ? (
            // Simple Banner
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-[#006795] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or learn more in our{" "}
                    <Link href="/cookies" className="text-[#006795] hover:text-[#F84B5F] underline font-semibold">
                      Cookie Policy
                    </Link>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-[#006795] hover:bg-[#005070] text-white py-3 rounded-full font-bold"
                >
                  Accept All Cookies
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-100 py-3 rounded-full font-bold"
                >
                  Reject All
                </Button>
                <Button
                  onClick={() => setShowDetails(true)}
                  variant="outline"
                  className="flex-1 border-2 border-[#006795] text-[#006795] hover:bg-[#006795] hover:text-white py-3 rounded-full font-bold"
                >
                  Customize
                </Button>
              </div>
            </div>
          ) : (
            // Detailed Preferences
            <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cookie Preferences
              </h3>
              <p className="text-gray-600 mb-6">
                Choose which cookies you want to allow. You can change these settings at any time.
              </p>

              <div className="space-y-4 mb-6">
                {/* Necessary */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h4 className="font-bold text-gray-900 mb-1">Necessary Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Essential for the website to function. Cannot be disabled.
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-[#006795] rounded-full flex items-center justify-end px-1 flex-shrink-0">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Functional */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h4 className="font-bold text-gray-900 mb-1">Functional Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Enable enhanced functionality and personalization.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, functional: !preferences.functional })}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                      preferences.functional ? "bg-[#006795]" : "bg-gray-300"
                    } flex items-center ${preferences.functional ? "justify-end" : "justify-start"} px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>

                {/* Analytics */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h4 className="font-bold text-gray-900 mb-1">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                      preferences.analytics ? "bg-[#006795]" : "bg-gray-300"
                    } flex items-center ${preferences.analytics ? "justify-end" : "justify-start"} px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h4 className="font-bold text-gray-900 mb-1">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Used to deliver personalized advertising and content.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                      preferences.marketing ? "bg-[#006795]" : "bg-gray-300"
                    } flex items-center ${preferences.marketing ? "justify-end" : "justify-start"} px-1`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#006795] hover:bg-[#005070] text-white py-3 rounded-full font-bold"
                >
                  Save My Preferences
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 hover:bg-gray-100 py-3 rounded-full font-bold"
                >
                  Back
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                <Link href="/cookies" className="text-[#006795] hover:underline">
                  Learn more about our cookie policy
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
