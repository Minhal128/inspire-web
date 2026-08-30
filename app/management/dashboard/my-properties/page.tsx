"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Legacy path — the sidebar and all in-app links now point to /management/dashboard/my-inspection
export default function MyPropertiesRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/management/dashboard/my-inspection')
  }, [router])

  return null
}
