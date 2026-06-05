"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const userRole = user.role;

        if (userRole === 'admin') {
          router.push('/admin/dashboard');
        } else if (userRole === 'management' || userRole === 'property-manager' || userRole === 'supervisor') {
          router.push('/management/dashboard');
        } else if (userRole === 'inspector') {
          router.push('/dashboard');
        } else {
          router.push('/other/dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <MainLayout>
      <div className="w-full overflow-x-hidden bg-[#E8F4F8]">
        {/* Hero Section */}
        <section className="bg-[#E8F4F8] relative pb-0">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-10 md:pt-16 lg:pt-20 pb-20 md:pb-28 lg:pb-32">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
              <div className="flex-1 w-full lg:max-w-[600px] pt-4 md:pt-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-black mb-4 md:mb-6 leading-[1.1]">
                  Trusted and Certified
                  <br />
                  Multi-Unit Inspections
                  <br />
                  <span className="text-[#F84B5F] italic font-bold">Across the NATION</span>
                </h1>

                <p className="text-gray-700 mb-8 md:mb-12 leading-relaxed text-sm md:text-[15px] max-w-xl">
                  NSPIREinspection.AI stands at the forefront of the multi-unit inspection industry, offering multi-unit property inspections and advanced risk-mitigation solutions. Whether you are a first-time investor or a seasoned property manager, NSPIREinspection.AI provides professional and comprehensive PDF reports and Excel worksheets.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleGetStarted}
                    variant="default"
                    size="lg"
                    className="hover:scale-105 transition-all w-full sm:w-auto cursor-pointer px-8 rounded-full"
                  >
                    Get Started
                  </Button>
                  <Button
                    onClick={() => router.push("/find-inspectors")}
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-all w-full sm:w-auto cursor-pointer px-8 rounded-full border-[#006795] text-[#006795] bg-transparent hover:bg-[#E8F4F8]"
                  >
                    View Inspectors
                  </Button>
                </div>
              </div>

              <div className="flex-1 w-full flex justify-center lg:justify-end">
                <Image
                  src="/hero.png"
                  alt="NSPIREinspection.AI App Mockup"
                  width={700}
                  height={820}
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* THE PROCESS */}
        <section className="px-4 md:px-6 py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-[#006795] uppercase tracking-wider">THE PROCESS</p>
              <h2 className="text-4xl md:text-5xl font-bold text-black mt-3">What to Expect</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { num: "1", title: "Schedule", desc: "Start inspection" },
                { num: "2", title: "Evaluate", desc: "System by System check of the entire property." },
                { num: "3", title: "Report", desc: "Receive digital report (PDF) and clear repair recommendation (Excel format)" }
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="w-20 h-20 mx-auto bg-[#006795] text-white rounded-2xl flex items-center justify-center text-4xl font-bold mb-6">{step.num}</div>
                  <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Public Housing Section */}
        <section className="bg-[#0F172A] text-white py-20">
          <div className="max-w-[1400px] mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Government Housing Compliance</h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              {`NSPIREinspection.AI provides professional Public and affordable Housing Inspection nationwide, helping housing authorities, property managers, and multifamily communities maintain federal compliance and safe living conditions. Our team specializes in Real Estate Assessment inspection, ensuring every property meets federal housing standards, requirements, and energy and safety regulations. From apartment communities to large public or affordable housing developments, NSPIREinspection.AI ensures compliance inspections are thorough, timely, and precise. We focus on identifying deficiencies, supporting risk management, and improving HUD REAC scores, providing a comprehensive solution for all public housing inspection needs while streamlining documentation and reporting for PHAs.`}
            </p>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
