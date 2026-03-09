"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ProfileSelection() {
  const router = useRouter()

  const handleRoleSelection = (role: string) => {
    if (role === 'management') {
      router.push('/management/login')
    } else if (role === 'other') {
      router.push('/other/login')
    } else {
      router.push(`/login?role=${role}`)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Header Section */}
      <div className="w-full bg-[#E8F4F8] px-4 sm:px-6 text-center flex flex-col items-center justify-center rounded-b-[40px] sm:rounded-b-[70px]" style={{ minHeight: '220px' }}>
        <div className="flex justify-center mb-4 sm:mb-8">
          <Image
            src="/logo.png"
            alt="INSPIRE Logo"
            width={480}
            height={560}
            className="w-auto h-20 sm:h-24 md:h-32 cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Welcome to INSPIRE
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-4">
          Choose how you want to continue.
        </p>
      </div>

      {/* Cards Section - Mobile First */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-4xl">
          {/* Stack vertically on mobile, horizontally on tablet+ */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch justify-center">

            {/* Inspector Card */}
            <Card className="flex-1 min-w-0 rounded-2xl border border-gray-200 p-5 sm:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-12 sm:h-12">
                  <rect x="16" y="8" width="32" height="48" rx="2" stroke="#FF4757" strokeWidth="2" fill="none" />
                  <line x1="22" y1="16" x2="42" y2="16" stroke="#FF4757" strokeWidth="2" strokeLinecap="round" />
                  <line x1="22" y1="24" x2="42" y2="24" stroke="#FF4757" strokeWidth="2" strokeLinecap="round" />
                  <line x1="22" y1="32" x2="36" y2="32" stroke="#FF4757" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="24" cy="42" r="2" fill="#FF4757" />
                  <line x1="30" y1="42" x2="42" y2="42" stroke="#FF4757" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Inspector</h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 sm:mb-6">
                For field inspectors conducting property compliance checks.
              </p>
              <Button
                className="w-full bg-[#0D6A8D] hover:bg-[#0D6A8D]/90 text-white rounded-lg py-2.5 font-medium text-sm mt-auto"
                onClick={() => handleRoleSelection('inspector')}
              >
                Continue
              </Button>
            </Card>

            {/* Management Card */}
            <Card className="flex-1 min-w-0 rounded-2xl border border-gray-200 p-5 sm:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-12 sm:h-12">
                  <rect x="12" y="12" width="16" height="16" rx="1" stroke="#FF4757" strokeWidth="2" fill="none" />
                  <rect x="36" y="12" width="16" height="16" rx="1" stroke="#FF4757" strokeWidth="2" fill="none" />
                  <rect x="12" y="36" width="16" height="16" rx="1" stroke="#FF4757" strokeWidth="2" fill="none" />
                  <rect x="36" y="36" width="16" height="16" rx="1" stroke="#FF4757" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Management</h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 sm:mb-6">
                For property managers and supervisors.
              </p>
              <Button
                className="w-full bg-[#0D6A8D] hover:bg-[#0D6A8D]/90 text-white rounded-lg py-2.5 font-medium text-sm mt-auto"
                onClick={() => handleRoleSelection('management')}
              >
                Continue
              </Button>
            </Card>

            {/* Other Card */}
            <Card className="flex-1 min-w-0 rounded-2xl border border-gray-200 p-5 sm:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-12 sm:h-12">
                  <rect x="12" y="12" width="40" height="40" rx="2" stroke="#FF4757" strokeWidth="2" fill="none" />
                  <line x1="12" y1="24" x2="52" y2="24" stroke="#FF4757" strokeWidth="2" />
                  <line x1="20" y1="32" x2="44" y2="32" stroke="#FF4757" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="40" x2="36" y2="40" stroke="#FF4757" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Other</h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4 sm:mb-6">
                For other users and stakeholders.
              </p>
              <Button
                className="w-full bg-[#0D6A8D] hover:bg-[#0D6A8D]/90 text-white rounded-lg py-2.5 font-medium text-sm mt-auto"
                onClick={() => handleRoleSelection('other')}
              >
                Continue
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
