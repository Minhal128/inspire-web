"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Legacy route. Settings now lives at /other/dashboard/settings
 * (the path the Other portal sidebar links to).
 */
export default function OtherSettingsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/other/dashboard/settings")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F4F8]">
      <p className="text-[#0A5F7F] font-medium">Redirecting to Settings...</p>
    </div>
  )
}
