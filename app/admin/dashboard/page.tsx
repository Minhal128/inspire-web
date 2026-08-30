"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Legacy route: /admin/dashboard
 *
 * The admin portal's dashboard now lives at /admin (see app/admin/page.tsx),
 * which is what AdminDashboardLayout's "Dashboard" nav item points at.
 * Several login/signup pages still push to /admin/dashboard, so this route is
 * kept as a client-side redirect to the canonical location instead of deleted.
 */
export default function AdminDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F4F8]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D7FA8] mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
