"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { paymentsAPI } from "@/lib/api"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [propertyName, setPropertyName] = useState("")

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed")
      return
    }
    const verify = async () => {
      try {
        const data = await paymentsAPI.getPublicSessionStatus(sessionId)
        if (data?.isReportUnlocked) {
          setPropertyName(data.inspection?.propertyName || "")
          setStatus("success")
        } else {
          setStatus("failed")
        }
      } catch (e) {
        console.error("Error verifying session:", e)
        setStatus("failed")
      }
    }
    verify()
  }, [sessionId])

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ maxWidth: "540px", width: "100%", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ backgroundColor: "#006795", padding: "32px 24px", textAlign: "center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h1 style={{ color: "#ffffff", margin: 0, fontSize: "24px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            {status === "loading" ? "Verifying Payment..." : status === "success" ? "Payment Successful!" : "Verification Failed"}
          </h1>
        </div>

        {/* Body */}
        <div style={{ padding: "40px 32px", textAlign: "center" }}>
          {status === "loading" && (
            <>
              <div style={{ width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#006795", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }}></div>
              <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>Please wait while we confirm your payment with Stripe...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div style={{ width: "72px", height: "72px", backgroundColor: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>Report Unlocked!</h2>
              {propertyName && (
                <p style={{ color: "#475569", fontSize: "15px", margin: "0 0 16px" }}>
                  The full inspection report for <strong>{propertyName}</strong> is now unlocked.
                </p>
              )}
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", margin: "0 0 32px" }}>
                Your payment has been confirmed and the report is now available in the NSPIRE Inspection portal. The inspector has been notified and can now access and export the full report at any time.
              </p>
              <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
                <p style={{ color: "#166534", fontSize: "14px", margin: 0, fontWeight: "600" }}>✓ Payment received and verified by Stripe</p>
                <p style={{ color: "#166534", fontSize: "14px", margin: "4px 0 0", fontWeight: "600" }}>✓ Report successfully unlocked in the system</p>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                You may safely close this window. A receipt has been sent to your email address.
              </p>
            </>
          )}

          {status === "failed" && (
            <>
              <div style={{ width: "72px", height: "72px", backgroundColor: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>Verification Failed</h2>
              <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px" }}>
                We were unable to verify your payment at this time. If you believe this is an error, please contact support or forward your Stripe receipt to the property inspector directly.
              </p>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                Your Stripe session ID: <code style={{ fontSize: "12px", color: "#475569" }}>{sessionId || "N/A"}</code>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "20px 32px", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
            &copy; {new Date().getFullYear()} NSPIRE Inspection AI. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        div[style*="spin"] { display: inline-block; }
      `}</style>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f4f7f6" }}>
        <div style={{ width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#006795", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
