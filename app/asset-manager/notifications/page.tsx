"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// This page moved to /asset-manager/dashboard/notifications (the path the
// sidebar bell icon points at). Kept as a client-side redirect so the old
// URL does not 404.
export default function NotificationsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/asset-manager/dashboard/notifications')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F4F8]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#0D7FA8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#0A5F7F] font-medium">Redirecting to notifications...</p>
      </div>
    </div>
  )
}
