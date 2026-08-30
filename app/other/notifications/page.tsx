"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Legacy route. Notifications now lives at /other/dashboard/notifications
 * (the path the Other portal header bell links to).
 */
export default function OtherNotificationsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/other/dashboard/notifications")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F4F8]">
      <p className="text-[#0A5F7F] font-medium">Redirecting to Notifications...</p>
    </div>
  )
}
