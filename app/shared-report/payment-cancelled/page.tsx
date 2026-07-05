"use client"

export default function PaymentCancelledPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ maxWidth: "540px", width: "100%", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ backgroundColor: "#475569", padding: "32px 24px", textAlign: "center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h1 style={{ color: "#ffffff", margin: 0, fontSize: "24px", fontWeight: "700", letterSpacing: "-0.5px" }}>
            Payment Cancelled
          </h1>
        </div>

        {/* Body */}
        <div style={{ padding: "40px 32px", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", backgroundColor: "#fef9c3", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>No charge was made</h2>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px" }}>
            You cancelled the payment process and your card was not charged. The inspection report remains locked.
          </p>
          <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", margin: "0 0 32px" }}>
            If you wish to unlock the report, simply use the payment link sent to your email address and try again. If you have any questions, please contact the property inspector.
          </p>
          <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
            <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>
              You may safely close this window.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "20px 32px", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
            &copy; {new Date().getFullYear()} NSPIRE Inspection AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
