"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import {
  NSPIREInspectionReport,
  DeficiencyEntry,
  DeficiencySummary,
  InspectionMetadata,
  DeficiencySeverity,
  SEVERITY_COLORS,
  REPAIR_TIMELINES,
  DEFAULT_PDF_OPTIONS,
  mapSeverityToNSPIRE,
  calculateDeductionPoints,
  mapCategoryToNSPIRECode,
} from "@/lib/nspireReport"

// Icons
// Icons

const Download = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const Excel = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3h7l5 5v12a1 1 0 01-1 1H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3v6h6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 16l4-4m0 4l-4-4" />
  </svg>
)

const Lock = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2 .896 2 2v1a2 2 0 01-4 0v-1c0-1.104.896-2 2-2zm6 8H6a2 2 0 01-2-2v-6a2 2 0 012-2h1V7a5 5 0 1110 0v2h1a2 2 0 012 2v6a2 2 0 01-2 2zM9 9h6V7a3 3 0 10-6 0v2z" />
  </svg>
)

const Unlock = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0m10 4H8a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" />
  </svg>
)


const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

// Loading fallback component
function LoadingFallback() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D6A8D]"></div>
      </div>
    </DashboardLayout>
  )
}

/**
 * NSPIRE-Compliant Inspection Summary Page
 * Follows HUD NSPIRE Inspection Summary structure exactly
 */
export default function NSPIREInspectionSummaryPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NSPIREInspectionSummaryContent />
    </Suspense>
  )
}

function NSPIREInspectionSummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [report, setReport] = useState<NSPIREInspectionReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportingExcel, setExportingExcel] = useState(false)
  const [checkingUnlock, setCheckingUnlock] = useState(true)
  const [isReportUnlocked, setIsReportUnlocked] = useState(false)
  const [purchasingUnlock, setPurchasingUnlock] = useState(false)
  const [activeTab, setActiveTab] = useState<'summary' | 'deficiencies' | 'preview'>('summary')
  // Custom column header from the building table (editable in property-details)
  const [buildingColumnHeader, setBuildingColumnHeader] = useState('Building')

  // Unit-based inspection context
  const [inspectionContext, setInspectionContext] = useState<{
    propertyId: string
    buildingId: string
    unitName: string
    propertyDetailsUrl: string
  } | null>(null)

  // Load unit inspection context
  useEffect(() => {
    try {
      const ctx = localStorage.getItem('currentInspectionUnit')
      if (ctx) setInspectionContext(JSON.parse(ctx))
    } catch {}
  }, [])

  const inspectionIdentifier = useMemo(() => {
    const fromQuery = searchParams.get('inspectionId') || searchParams.get('id')
    if (fromQuery) {
      return fromQuery
    }

    try {
      const storedData = localStorage.getItem('currentInspectionData')
      if (storedData) {
        const parsed = JSON.parse(storedData)
        const fallbackId =
          parsed?._id ||
          parsed?.id ||
          parsed?.inspectionId ||
          parsed?.inspectionNo

        if (fallbackId) {
          return String(fallbackId)
        }
      }
    } catch {
      // Ignore local parsing errors and continue with report fallback
    }

    return report?.metadata?.inspectionNo || null
  }, [searchParams, report?.metadata?.inspectionNo])

  const visibleDeficiencies = useMemo(() => {
    if (!report) return []
    if (isReportUnlocked) return report.deficiencies
    return report.deficiencies.slice(0, 2)
  }, [report, isReportUnlocked])

  // Handle "Continue Inspection" - mark unit as completed and go back to property details
  const handleContinueInspection = () => {
    if (inspectionContext) {
      const unitQuery = inspectionContext.unitName ? `&unit=${encodeURIComponent(inspectionContext.unitName)}&units=1` : ''
      router.push(`/dashboard/inspection-category/${inspectionContext.propertyId}?building=${encodeURIComponent(inspectionContext.buildingId)}${unitQuery}`)
    } else {
      router.push('/dashboard')
    }
  }

  // Load inspection data from URL params or localStorage
  useEffect(() => {
    const loadInspectionData = async () => {
      try {
        // Try to get data from localStorage (set by inspection flow)
        const storedData = localStorage.getItem('currentInspectionData')
        const storedProperty = localStorage.getItem('currentInspectionProperty')

        if (storedData) {
          const inspectionData = JSON.parse(storedData)
          const propertyData = storedProperty ? JSON.parse(storedProperty) : null
          // Load custom column header if present
          if (inspectionData.buildingColumnHeader) {
            setBuildingColumnHeader(inspectionData.buildingColumnHeader)
          }
          // Convert to NSPIRE report format
          const nspireReport = convertToNSPIREReport(inspectionData, propertyData)
          setReport(nspireReport)
        } else {
          // Use demo data for testing
          setReport(getDemoReport())
        }
      } catch (error) {
        console.error('Error loading inspection data:', error)
        // Fallback to demo data
        setReport(getDemoReport())
      } finally {
        setLoading(false)
      }
    }

    loadInspectionData()
  }, [searchParams])

  useEffect(() => {
    const checkUnlockStatus = async () => {
      if (!inspectionIdentifier) {
        setCheckingUnlock(false)
        setIsReportUnlocked(false)
        return
      }

      try {
        setCheckingUnlock(true)
        const token = localStorage.getItem('token')

        if (!token) {
          setIsReportUnlocked(false)
          return
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/payments/check-unlock/${encodeURIComponent(inspectionIdentifier)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Unable to check unlock status.')
        }

        const data = await response.json()
        setIsReportUnlocked(!!data?.isReportUnlocked)
      } catch (error) {
        console.error('Unlock status check error:', error)
        setIsReportUnlocked(false)
      } finally {
        setCheckingUnlock(false)
      }
    }

    checkUnlockStatus()
  }, [inspectionIdentifier])

  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const sessionId = searchParams.get('session_id')

    if (!paymentStatus) {
      return
    }

    const cleanUrl = () => {
      const cleanParams = new URLSearchParams(searchParams.toString())
      cleanParams.delete('payment')
      cleanParams.delete('session_id')
      const nextUrl = cleanParams.toString()
        ? `/dashboard/inspection/summary?${cleanParams.toString()}`
        : '/dashboard/inspection/summary'
      router.replace(nextUrl)
    }

    const verifyStripeSession = async () => {
      try {
        if (paymentStatus === 'cancelled') {
          toast.info('Payment was cancelled. Report remains locked.', { position: 'top-right' })
          cleanUrl()
          return
        }

        if (paymentStatus === 'success' && sessionId) {
          const token = localStorage.getItem('token')
          if (!token) {
            throw new Error('You must be logged in to verify payment status.')
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/payments/stripe-session-status/${encodeURIComponent(sessionId)}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          )

          const data = await response.json()

          if (!response.ok || !data?.success) {
            throw new Error(data?.message || 'Unable to verify Stripe payment status.')
          }

          if (data?.isReportUnlocked) {
            setIsReportUnlocked(true)
            toast.success('Payment confirmed. Report unlocked!', { position: 'top-right' })
          } else {
            toast.warning('Payment is not completed yet. Please try again in a moment.', { position: 'top-right' })
          }
        }
      } catch (error: any) {
        console.error('Stripe payment verification error:', error)
        toast.error(`Payment verification failed: ${error.message}`, { position: 'top-right' })
      } finally {
        cleanUrl()
      }
    }

    verifyStripeSession()
  }, [searchParams, router])

  // Convert inspection data to NSPIRE report format
  const convertToNSPIREReport = (data: any, property: any): NSPIREInspectionReport => {
    const now = new Date()

    // Convert findings to deficiency entries
    const deficiencies: DeficiencyEntry[] = (data.findings || data.deficiencies || []).map((finding: any, index: number) => {
      const severity = mapSeverityToNSPIRE(finding.severity || finding.healthAndSafety || 'Moderate')
      return {
        id: finding.id || `DEF-${index + 1}`,
        imageUri: finding.imageUri || finding.imageUrl || finding.photos?.[0]?.url || '',
        building: finding.building || property?.building || 'A',
        unit: finding.unit || property?.unit || '-',
        room: finding.location || finding.room || '-',
        area: finding.area || finding.category || '-',
        deficiencyName: finding.title || finding.selected || finding.deficiencyName || 'Unnamed Deficiency',
        nspireCode: finding.nspireCode || mapCategoryToNSPIRECode(finding.category || finding.area),
        deficiencyDetails: finding.description || finding.detail || finding.deficiencyDetails || '',
        comments: finding.notes || finding.comments || finding.recommendation || '',
        deductionPts: calculateDeductionPoints(finding.severity || 'moderate'),
        repeatIndicator: finding.repeat || false,
        severity,
        healthAndSafety: finding.healthAndSafety || severity,
        repairTimeline: finding.repairBy || finding.repairTimeline || REPAIR_TIMELINES[severity],
        codeAndCompliance: finding.codeAndCompliance || '',
        inspectedDate: now.toLocaleDateString(),
        inspectedTime: finding.timestamp ? new Date(finding.timestamp).toLocaleTimeString() : now.toLocaleTimeString(),
        inspectorId: data.inspectorId || 'INS-001',
        status: finding.status || 'Open',
      }
    })

    // Calculate summary
    const summary: DeficiencySummary = {
      lifeThreatening: deficiencies.filter(d => d.severity === 'Life-Threatening').length,
      severe: deficiencies.filter(d => d.severity === 'Severe').length,
      moderate: deficiencies.filter(d => d.severity === 'Moderate').length,
      low: deficiencies.filter(d => d.severity === 'Low').length,
      total: deficiencies.length,
      byBuilding: {},
      byCategory: {},
      repeatDeficiencies: deficiencies.filter(d => d.repeatIndicator).length,
      newDeficiencies: deficiencies.filter(d => !d.repeatIndicator).length,
    }

    // Calculate score
    const totalDeductions = deficiencies.reduce((sum, d) => sum + d.deductionPts, 0)
    const preliminaryScore = Math.max(0, 100 - totalDeductions)
    const finalScore = Math.max(0, preliminaryScore - 5)

    return {
      reportId: `RPT-${Date.now()}`,
      version: '1.0',
      generatedAt: now.toISOString(),
      metadata: {
        inspectionNo: data?.inspectionNo || data?.inspectionId || `INSP-${Date.now().toString(36).toUpperCase()}`,
        inspectionType: data.inspectionType || 'General NSPIRE',
        escortName: data.escortName || property?.contactName || '-',
        propertyAddress: property?.address || data.address || data.propertyAddress || '-',
        propertyName: property?.name || data.propertyName || '-',
        propertyId: property?._id || property?.propertyId || data.propertyId || '-',
        startDate: data.startDate || now.toLocaleDateString(),
        startTime: data.startTime || '09:00 AM',
        endDate: data.endDate || now.toLocaleDateString(),
        endTime: data.endTime || now.toLocaleTimeString(),
        reportCreatedDate: now.toLocaleDateString(),
        preliminaryScore: preliminaryScore,
        finalScore: finalScore,
        calculatedScore: finalScore,
        healthSafetyThreshold: 60,
        physicalConditionThreshold: 60,
        inspectorName: data.inspectorName || 'Inspector',
        inspectorId: data.inspectorId || 'INS-001',
      },
      inspectionData: [
        { type: 'Building', propertyTotal: property?.buildings || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Unit', propertyTotal: property?.units || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Site', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Common Area', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
      ],
      occupancyInfo: {
        totalUnits: property?.units || 1,
        occupiedUnits: property?.occupiedUnits || property?.units || 1,
        vacantUnits: property?.vacantUnits || 0,
        occupancyRate: property?.occupancyRate || 100,
      },
      summary,
      categoryBreakdown: [],
      deficiencies,
      generalComments: data.notes || data.generalComments || '',
      recommendations: data.recommendations || [],
      certification: {
        certifiedBy: data.inspectorName || 'Inspector',
        certificationDate: now.toLocaleDateString(),
        certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.',
      },
    }
  }

  // Demo report for testing
  const getDemoReport = (): NSPIREInspectionReport => {
    const now = new Date()
    return {
      reportId: 'RPT-DEMO-001',
      version: '1.0',
      generatedAt: now.toISOString(),
      metadata: {
        inspectionNo: 'INSP-2026-001',
        inspectionType: 'General NSPIRE',
        escortName: 'Property Manager',
        propertyAddress: '123 Main Street, New York, NY 10001',
        propertyName: 'Sunset Apartments',
        propertyId: 'PROP-001',
        startDate: now.toLocaleDateString(),
        startTime: '09:00 AM',
        endDate: now.toLocaleDateString(),
        endTime: '02:30 PM',
        reportCreatedDate: now.toLocaleDateString(),
        preliminaryScore: 82,
        finalScore: 82,
        calculatedScore: 82,
        healthSafetyThreshold: 60,
        physicalConditionThreshold: 60,
        inspectorName: 'John Smith',
        inspectorId: 'INS-001',
      },
      inspectionData: [
        { type: 'Building', propertyTotal: 2, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Unit', propertyTotal: 24, sampleSize: 5, totalUnitsInspected: 5 },
        { type: 'Site', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Common Area', propertyTotal: 4, sampleSize: 2, totalUnitsInspected: 2 },
      ],
      occupancyInfo: {
        totalUnits: 24,
        occupiedUnits: 22,
        vacantUnits: 2,
        occupancyRate: 91.7,
      },
      summary: {
        lifeThreatening: 1,
        severe: 0,
        moderate: 1,
        low: 1,
        total: 3,
        byBuilding: {},
        byCategory: {},
        repeatDeficiencies: 0,
        newDeficiencies: 3,
      },
      categoryBreakdown: [],
      deficiencies: [
        {
          id: 'DEF-001',
          imageUri: '',
          building: 'A',
          unit: '101',
          room: 'Kitchen',
          area: 'Fire Safety',
          deficiencyName: 'Smoke Detector - Non-Functional',
          nspireCode: 'HS-7',
          deficiencyDetails: 'Smoke detector is not responding to test button. Battery appears to be dead or detector is malfunctioning.',
          comments: 'Requires immediate replacement. Tenant reported issue last week.',
          deductionPts: 10,
          repeatIndicator: false,
          severity: 'Life-Threatening',
          healthAndSafety: 'Life-Threatening',
          repairTimeline: '24 Hours',
          codeAndCompliance: 'NFPA 72',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '10:15 AM',
          inspectorId: 'INS-001',
          status: 'Open',
        },
        {
          id: 'DEF-002',
          imageUri: '',
          building: 'A',
          unit: '101',
          room: 'Kitchen',
          area: 'Plumbing',
          deficiencyName: 'Kitchen Faucet - Minor Leak',
          nspireCode: 'BS-1',
          deficiencyDetails: 'Slow drip detected under the kitchen sink. Washer may need replacement.',
          comments: 'Schedule maintenance for repair within 30 days.',
          deductionPts: 3,
          repeatIndicator: false,
          severity: 'Moderate',
          healthAndSafety: 'Moderate',
          repairTimeline: '30 Days',
          codeAndCompliance: 'IPC Section 701',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '10:30 AM',
          inspectorId: 'INS-001',
          status: 'Open',
        },
        {
          id: 'DEF-003',
          imageUri: '',
          building: 'A',
          unit: '101',
          room: 'Hallway',
          area: 'Interior',
          deficiencyName: 'Wall Paint - Peeling',
          nspireCode: 'U-16',
          deficiencyDetails: 'Minor paint peeling observed on hallway wall near entrance. Cosmetic issue only.',
          comments: 'Low priority. Schedule during next unit turnover.',
          deductionPts: 1,
          repeatIndicator: false,
          severity: 'Low',
          healthAndSafety: 'Low',
          repairTimeline: '60 Days',
          codeAndCompliance: 'UPCS',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '10:45 AM',
          inspectorId: 'INS-001',
          status: 'Open',
        },
      ],
      generalComments: 'Overall unit condition is good. All electrical systems functioning properly. Minor plumbing issue requires attention within 30 days. Smoke detector must be replaced immediately for safety compliance.',
      recommendations: [
        'Replace smoke detector in Unit 101 immediately',
        'Schedule plumbing maintenance for kitchen faucet',
        'Include wall repainting in next maintenance cycle',
      ],
      certification: {
        certifiedBy: 'John Smith',
        certificationDate: now.toLocaleDateString(),
        certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.',
      },
    }
  }

  // Handlers
  const handleUnlockWithStripe = async () => {
    try {
      if (!inspectionIdentifier) {
        toast.error('Inspection ID is missing. Please refresh and try again.', { position: 'top-right' })
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('You must be logged in to unlock this report.', { position: 'top-right' })
        return
      }

      setPurchasingUnlock(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/payments/create-stripe-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ inspectionId: inspectionIdentifier }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Unable to start Stripe checkout.')
      }

      if (data?.isReportUnlocked || data?.alreadyUnlocked) {
        setIsReportUnlocked(true)
        toast.success('Report is already unlocked.', { position: 'top-right' })
        return
      }

      if (!data?.checkoutUrl) {
        throw new Error('Stripe checkout URL is missing.')
      }

      window.location.href = data.checkoutUrl
    } catch (error: any) {
      console.error('Stripe checkout start error:', error)
      toast.error(`Unable to start payment: ${error.message}`, { position: 'top-right' })
    } finally {
      setPurchasingUnlock(false)
    }
  }

  const handleExportPDF = async () => {
    if (!report) return

    if (!isReportUnlocked) {
      toast.info('This report is locked. Redirecting to unlock checkout...', { position: 'top-right' })
      await handleUnlockWithStripe()
      return
    }

    setExporting(true)
    try {
      toast.info("Generating PDF through Puppeteer service...", { position: "top-right" })

      const token = localStorage.getItem('token')

      // Prepare the payload matching backend expectations
      let payloadData;
      let mergedInspectionPayload: any = null;

      const storedData = localStorage.getItem('currentInspectionData');
      const storedProperty = localStorage.getItem('currentInspectionProperty');

      // First persist/update the inspection in backend to obtain merged property-level data
      // (prevents previous building details from being dropped when exporting after partial updates)
      if (storedData && storedProperty) {
        mergedInspectionPayload = await markInspectionAsCompleted({
          silentToast: true,
          returnInspection: true,
        });
      }

      if (mergedInspectionPayload) {
        const propertyData = storedProperty ? JSON.parse(storedProperty) : null;
        payloadData = {
          ...mergedInspectionPayload,
          property: propertyData || mergedInspectionPayload.property,
          findings: mergedInspectionPayload.findings || mergedInspectionPayload.deficiencies || [],
          deficiencies: mergedInspectionPayload.deficiencies || mergedInspectionPayload.findings || [],
          inspectionNo: mergedInspectionPayload.inspectionId || report.metadata.inspectionNo,
          propertyName: propertyData?.name || report.metadata.propertyName,
          propertyAddress: propertyData?.address || report.metadata.propertyAddress,
        };
      }

      if (!payloadData && storedData) {
        // Use raw data if available (best for metadata preservation)
        const rawData = JSON.parse(storedData);
        if (storedProperty) {
          rawData.property = JSON.parse(storedProperty);
        }
        payloadData = rawData;
      } else {
        // Fallback: Reconstruct compatible object from current report state
        // The backend expects flat properties for metadata (e.g. propertyName)
        // or a nested property object.
        payloadData = {
          ...report.metadata, // Spread metadata (inspectionNo, propertyName, etc.) to root
          deficiencies: report.deficiencies.map(d => ({
            ...d,
            // Ensure compatibility with backend mapping
            title: d.deficiencyName,
            description: d.deficiencyDetails,
            notes: d.comments,
            category: d.area // SubCategory/Area
          })),
          findings: report.deficiencies // Backend checks findings or deficiencies
        }
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/inspections/generate-pdf?includeImages=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          inspectionData: payloadData,
          reportType: 'nspire'
        })
      })

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response (possible fallback or error)
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to generate PDF');
        }

        if (data.html) {
          // Fallback: Backend returned HTML because PDF generation failed
          console.log('Received HTML fallback from backend');
          toast.info("Backend PDF generation unavailable. Printing report locally...", { position: "top-right" });

          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(data.html);
            printWindow.document.close();
            // Wait for images to load before printing
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
            };
          } else {
            const htmlBlob = new Blob([data.html], { type: 'text/html' });
            const htmlUrl = window.URL.createObjectURL(htmlBlob);
            const htmlLink = document.createElement('a');
            htmlLink.href = htmlUrl;
            htmlLink.download = (data.filename || `INSPIRE_Report_${report.metadata.inspectionNo}.html`).replace(/\.pdf$/i, '.html');
            document.body.appendChild(htmlLink);
            htmlLink.click();
            document.body.removeChild(htmlLink);
            window.URL.revokeObjectURL(htmlUrl);
            toast.warning('Popup blocked. Downloaded HTML backup instead—open it and print to PDF.', { position: 'top-right' });
          }
          
          // Still mark as completed even with HTML fallback
          await markInspectionAsCompleted();
          return; // Exit, handled
        }
      }

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Handle standard PDF Blob download
      const blob = await response.blob()

      if (blob.size < 100 || blob.type.includes('json')) {
        console.warn("Received suspicious blob", blob);
        // Attempt to read as text to see error
        const text = await blob.text();
        try {
          const errJson = JSON.parse(text);
          throw new Error(errJson.message || "Invalid PDF response");
        } catch (e) {
          // Not JSON, just small blob?
        }
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `INSPIRE_Report_${report.metadata.inspectionNo}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("PDF downloaded successfully", { position: "top-right" })

      // If pre-update did not run/succeed, attempt completion now
      if (!mergedInspectionPayload) {
        await markInspectionAsCompleted();
      }
      
    } catch (error: any) {
      console.error('PDF export error:', error)
      toast.error(`Failed to export PDF: ${error.message}`, { position: "top-right" })
    } finally {
      setExporting(false)
    }
  }

  const handleExportExcel = async () => {
    if (!report) return

    if (!isReportUnlocked) {
      toast.info('This report is locked. Redirecting to unlock checkout...', { position: 'top-right' })
      await handleUnlockWithStripe()
      return
    }

    setExportingExcel(true)
    try {
      const XLSX = await import('xlsx')

      const summaryRows = [
        { Field: 'Inspection Number', Value: report.metadata.inspectionNo },
        { Field: 'Property Name', Value: report.metadata.propertyName },
        { Field: 'Property Address', Value: report.metadata.propertyAddress },
        { Field: 'Inspector', Value: report.metadata.inspectorName },
        { Field: 'Inspection Type', Value: report.metadata.inspectionType },
        { Field: 'Start Date', Value: report.metadata.startDate },
        { Field: 'End Date', Value: report.metadata.endDate },
        { Field: 'Final Score', Value: report.metadata.finalScore },
        { Field: 'Total Deficiencies', Value: report.summary.total },
        { Field: 'Life-Threatening', Value: report.summary.lifeThreatening },
        { Field: 'Severe', Value: report.summary.severe },
        { Field: 'Moderate', Value: report.summary.moderate },
        { Field: 'Low', Value: report.summary.low },
      ]

      const deficiencyRows = report.deficiencies.map((def, index) => ({
        '#': index + 1,
        Building: def.building,
        Unit: def.unit,
        Room: def.room,
        Area: def.area,
        'Deficiency Name': def.deficiencyName,
        'NSPIRE Code': def.nspireCode,
        Details: def.deficiencyDetails,
        Comments: def.comments,
        Severity: def.severity,
        'Health & Safety': def.healthAndSafety,
        'Repair Timeline': def.repairTimeline,
        'Deduction Points': def.deductionPts,
        Status: def.status,
      }))

      const workbook = XLSX.utils.book_new()
      const summarySheet = XLSX.utils.json_to_sheet(summaryRows)
      const deficienciesSheet = XLSX.utils.json_to_sheet(deficiencyRows)

      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
      XLSX.utils.book_append_sheet(workbook, deficienciesSheet, 'Deficiencies')

      const fileName = `INSPIRE_Report_${report.metadata.inspectionNo}.xlsx`
      XLSX.writeFile(workbook, fileName)

      toast.success('Excel downloaded successfully', { position: 'top-right' })
      await markInspectionAsCompleted({ silentToast: true })
    } catch (error: any) {
      console.error('Excel export error:', error)
      toast.error(`Failed to export Excel: ${error.message}`, { position: 'top-right' })
    } finally {
      setExportingExcel(false)
    }
  }

  // Mark inspection as completed in the backend
  const markInspectionAsCompleted = async (options?: { silentToast?: boolean; returnInspection?: boolean }) => {
    const { silentToast = false, returnInspection = false } = options || {};

    try {
      // Also mark the unit as completed in localStorage for property-details tracking
      if (inspectionContext) {
        const storageKey = `web_unit_inspection_${inspectionContext.propertyId}_${inspectionContext.buildingId}`
        const raw = localStorage.getItem(storageKey)
        if (raw) {
          const state = JSON.parse(raw)
          const unit = state.units?.find((u: any) => u.unitName === inspectionContext.unitName)
          if (unit) {
            unit.completed = true
            unit.completedAt = new Date().toISOString()
            state.lastUpdated = new Date().toISOString()
            localStorage.setItem(storageKey, JSON.stringify(state))
          }
        }
      }

      const token = localStorage.getItem('token')
      const storedData = localStorage.getItem('currentInspectionData');
      const storedProperty = localStorage.getItem('currentInspectionProperty');

      if (!storedData || !storedProperty) {
        console.log('No inspection data to save');
        return null;
      }

      const inspectionData = JSON.parse(storedData);
      const propertyData = JSON.parse(storedProperty);

      // Update or create inspection record as completed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/inspections/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: propertyData._id,
          inspectionData: {
            ...inspectionData,
            status: 'completed',
            completedAt: new Date().toISOString(),
            pdfExported: true
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Inspection marked as completed:', data);
        if (!silentToast) {
          toast.success("Inspection saved and marked as completed!", { position: "top-right" });
        }
        return returnInspection ? (data?.inspection || null) : null;
      } else {
        console.error('Failed to mark inspection as completed');
        return null;
      }
    } catch (error) {
      console.error('Error marking inspection as completed:', error);
      // Don't show error to user as PDF was still downloaded successfully
      return null;
    }
  }

  // Get severity badge styling
  const getSeverityBadgeClass = (severity: DeficiencySeverity): string => {
    const classes: Record<DeficiencySeverity, string> = {
      'Life-Threatening': 'bg-red-600 text-white',
      'Severe': 'bg-orange-500 text-white',
      'Moderate': 'bg-blue-500 text-white',
      'Low': 'bg-gray-500 text-white',
    }
    return classes[severity] || 'bg-gray-500 text-white'
  }

  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      'Open': 'bg-red-100 text-red-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Resolved': 'bg-green-100 text-green-700',
      'Verified': 'bg-blue-100 text-blue-700',
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D6A8D]"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-gray-600 mb-4">No inspection data found</p>
          <Button onClick={() => router.push('/dashboard/my-inspection')}>
            Back to Inspections
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-[#0D6A8D]">HUD INSPIRE INSPECTION REPORT</h1>
              </div>
              <p className="text-gray-600 font-medium">{report.metadata.propertyName}</p>
              <p className="text-sm text-gray-500">{report.metadata.propertyAddress}</p>
              <p className="text-sm text-gray-500 mt-1">
                Inspection #{report.metadata.inspectionNo} | {report.metadata.startDate}
              </p>
              {inspectionContext?.unitName && (
                <p className="text-sm font-bold text-[#0D6A8D] mt-1">
                  {buildingColumnHeader}: {inspectionContext.buildingId} &rarr; {inspectionContext.unitName}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {checkingUnlock ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Checking report access...
                  </span>
                ) : isReportUnlocked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <Unlock className="w-3.5 h-3.5" />
                    Report unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    <Lock className="w-3.5 h-3.5" />
                    Report locked
                  </span>
                )}

                {!checkingUnlock && !isReportUnlocked && (
                  <Button
                    onClick={handleUnlockWithStripe}
                    disabled={purchasingUnlock}
                    className="h-8 gap-1 bg-amber-500 px-3 text-xs font-semibold text-white hover:bg-amber-600"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {purchasingUnlock ? 'Redirecting...' : 'Unlock Full Report - $99.00'}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleExportPDF}
                disabled={exporting || checkingUnlock || purchasingUnlock}
                className="gap-2 bg-[#0D6A8D] hover:bg-[#0a5670] text-white"
              >
                {isReportUnlocked ? <Download /> : <Lock className="w-5 h-5" />} {exporting ? 'Generating...' : isReportUnlocked ? 'Export PDF' : 'Unlock to Export'}
              </Button>
              <Button
                onClick={handleExportExcel}
                disabled={exportingExcel || checkingUnlock || purchasingUnlock}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isReportUnlocked ? <Excel /> : <Lock className="w-5 h-5" />} {exportingExcel ? 'Generating...' : isReportUnlocked ? 'Export Excel' : 'Unlock to Export Excel'}
              </Button>
              <Button
                onClick={handleContinueInspection}
                className="gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Continue Inspection
              </Button>
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="bg-gradient-to-r from-[#0D6A8D] to-[#0891B2] rounded-lg p-4 mb-6 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="sm:border-r border-white/30 pb-4 sm:pb-0">
              <p className="text-xs opacity-80 uppercase tracking-wide">Preliminary Score</p>
              <p className="text-3xl font-bold">{report.metadata.preliminaryScore}</p>
            </div>
            <div className="sm:border-r border-white/30 pb-4 sm:pb-0">
              <p className="text-xs opacity-80 uppercase tracking-wide">Calculated Score</p>
              <p className="text-3xl font-bold">{report.metadata.calculatedScore}</p>
            </div>
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Final Score</p>
              <p className="text-3xl font-bold">{report.metadata.finalScore}</p>
              <p className="text-xs opacity-80 mt-1">
                {report.metadata.finalScore >= 60 ? '✓ Passing' : '✗ Below Threshold'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {(['summary', 'deficiencies'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-all whitespace-nowrap ${activeTab === tab
                ? 'bg-white text-[#0D6A8D] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Deficiency Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-[#0D6A8D] mb-4 pb-2 border-b-2 border-[#0D6A8D]">
                DEFICIENCY SUMMARY
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg text-center">
                  <p className="text-3xl font-bold text-red-600">{report.summary.lifeThreatening}</p>
                  <p className="text-xs font-semibold text-red-600 uppercase">Life-Threat</p>
                </div>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg text-center">
                  <p className="text-3xl font-bold text-orange-500">{report.summary.severe}</p>
                  <p className="text-xs font-semibold text-orange-500 uppercase">Severe</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-center">
                  <p className="text-3xl font-bold text-blue-500">{report.summary.moderate}</p>
                  <p className="text-xs font-semibold text-blue-500 uppercase">Moderate</p>
                </div>
                <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded-r-lg text-center">
                  <p className="text-3xl font-bold text-gray-500">{report.summary.low}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Low</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg text-center">
                  <p className="text-3xl font-bold text-green-600">{report.summary.total}</p>
                  <p className="text-xs font-semibold text-green-600 uppercase">Total</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-amber-700">{report.summary.repeatDeficiencies}</p>
                  <p className="text-xs font-semibold text-amber-700">Repeat Deficiencies</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-700">{report.summary.newDeficiencies}</p>
                  <p className="text-xs font-semibold text-blue-700">New Deficiencies</p>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#0D6A8D] mb-4 pb-2 border-b-2 border-[#0D6A8D]">
                  PROPERTY INFORMATION
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Name</span>
                    <span className="font-semibold">{report.metadata.propertyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address</span>
                    <span className="font-semibold text-right max-w-[200px]">{report.metadata.propertyAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID</span>
                    <span className="font-semibold">{report.metadata.propertyId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inspector</span>
                    <span className="font-semibold">{report.metadata.inspectorName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#0D6A8D] mb-4 pb-2 border-b-2 border-[#0D6A8D]">
                  OCCUPANCY INFORMATION
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{report.occupancyInfo.totalUnits}</p>
                    <p className="text-xs text-gray-600">Total Units</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{report.occupancyInfo.occupiedUnits}</p>
                    <p className="text-xs text-green-600">Occupied</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">{report.occupancyInfo.vacantUnits}</p>
                    <p className="text-xs text-red-600">Vacant</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{report.occupancyInfo.occupancyRate.toFixed(0)}%</p>
                    <p className="text-xs text-blue-600">Occupancy Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inspection Data Table */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-[#0D6A8D] mb-4 pb-2 border-b-2 border-[#0D6A8D]">
                INSPECTION DATA
              </h2>
              
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0D6A8D] text-white">
                      <th className="text-left p-3 rounded-tl-lg">Type</th>
                      <th className="text-center p-3">Property Total</th>
                      <th className="text-center p-3">Sample Size</th>
                      <th className="text-center p-3 rounded-tr-lg">Units Inspected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.inspectionData.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-3 font-semibold">{row.type}</td>
                        <td className="p-3 text-center">{row.propertyTotal}</td>
                        <td className="p-3 text-center">{row.sampleSize}</td>
                        <td className="p-3 text-center">{row.totalUnitsInspected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {report.inspectionData.map((row, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="font-bold text-[#0D6A8D] mb-2">{row.type}</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-gray-500">Property Total</div>
                        <div className="font-semibold">{row.propertyTotal}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Sample Size</div>
                        <div className="font-semibold">{row.sampleSize}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Inspected</div>
                        <div className="font-semibold">{row.totalUnitsInspected}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deficiencies Tab */}
        {activeTab === 'deficiencies' && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-[#0D6A8D] mb-4 pb-2 border-b-2 border-[#0D6A8D]">
              DEFICIENCY DETAILS
            </h2>

            {!checkingUnlock && !isReportUnlocked && report.deficiencies.length > visibleDeficiencies.length && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <span className="font-semibold">Locked preview:</span> showing {visibleDeficiencies.length} of {report.deficiencies.length} deficiencies. Unlock for $0.99 to view all items and export PDF.
              </div>
            )}

            {/* Unit header banner */}
            {inspectionContext?.unitName && (
              <div className="bg-gradient-to-r from-[#0D6A8D]/10 to-[#0891B2]/10 rounded-lg p-4 mb-4 border border-[#0D6A8D]/20">
                <h3 className="text-base font-black text-[#0D6A8D] tracking-tight">
                  {inspectionContext.unitName} — Inspection Details
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{buildingColumnHeader}: {inspectionContext.buildingId}</p>
              </div>
            )}

            {report.deficiencies.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✓</div>
                <p className="text-xl font-bold text-green-600">No Deficiencies Found</p>
                <p className="text-gray-600 mt-2">This property passed inspection with no issues identified.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0D6A8D] text-white">
                        <th className="p-3 text-left rounded-tl-lg">#</th>
                        <th className="p-3 text-center">Proof</th>
                        <th className="p-3 text-left">Location</th>
                        <th className="p-3 text-left">Deficiency</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-center">Severity</th>
                        <th className="p-3 text-center">H&S</th>
                        <th className="p-3 text-center">Repair By</th>
                        <th className="p-3 text-center rounded-tr-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleDeficiencies.map((def, index) => (
                        <tr key={def.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b`}>
                          <td className="p-3 font-bold text-center">{index + 1}</td>
                          <td className="p-3 text-center">
                            {def.imageUri ? (
                              <div className="relative w-16 h-16 mx-auto group">
                                <img
                                  src={def.imageUri}
                                  alt="Deficiency Proof"
                                  className="w-full h-full object-cover rounded-md border border-gray-200 shadow-sm cursor-zoom-in group-hover:scale-150 transition-transform z-10 relative"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-md flex items-center justify-center text-gray-300">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </td>
                          <td className="p-3 min-w-[120px]">
                            <div className="text-xs">
                              <div><span className="text-gray-500">{buildingColumnHeader}:</span> <span className="font-semibold">{def.building}</span></div>
                              <div><span className="text-gray-500">Unit:</span> <span className="font-semibold">{def.unit}</span></div>
                              <div><span className="text-gray-500">Room:</span> <span className="font-semibold">{def.room}</span></div>
                              <div><span className="text-gray-500">Area:</span> <span className="font-semibold">{def.area}</span></div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-gray-800 mb-1">{def.deficiencyName}</div>
                            <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-semibold px-2 py-1 rounded">
                              {def.nspireCode}
                            </span>
                            {def.repeatIndicator && (
                              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded ml-1">
                                REPEAT
                              </span>
                            )}
                          </td>
                          <td className="p-3 max-w-[250px]">
                            <div className="text-gray-700 mb-2">{def.deficiencyDetails}</div>
                            {def.comments && (
                              <div className="text-xs text-gray-500 italic">
                                <span className="font-semibold">Notes:</span> {def.comments}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${getSeverityBadgeClass(def.severity)}`}>
                              {def.severity}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">-{def.deductionPts} pts</div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="text-xs font-medium text-red-600">{def.healthAndSafety}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                              {def.repairTimeline}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(def.status)}`}>
                              {def.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {visibleDeficiencies.map((def, index) => (
                    <div key={def.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#0D6A8D] text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        {def.imageUri ? (
                          <img
                            src={def.imageUri}
                            alt="Deficiency Proof"
                            className="w-20 h-20 object-cover rounded-md border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-300">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-sm mb-1 break-words">{def.deficiencyName}</h3>
                          <div className="flex flex-wrap gap-1">
                            <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-semibold px-2 py-1 rounded">
                              {def.nspireCode}
                            </span>
                            {def.repeatIndicator && (
                              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded">
                                REPEAT
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-500 text-xs">{buildingColumnHeader}:</span>
                            <span className="font-semibold ml-1">{def.building}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Unit:</span>
                            <span className="font-semibold ml-1">{def.unit}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Room:</span>
                            <span className="font-semibold ml-1">{def.room}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Area:</span>
                            <span className="font-semibold ml-1">{def.area}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-gray-700 text-xs mb-2">{def.deficiencyDetails}</p>
                          {def.comments && (
                            <p className="text-xs text-gray-500 italic">
                              <span className="font-semibold">Notes:</span> {def.comments}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getSeverityBadgeClass(def.severity)}`}>
                            {def.severity} (-{def.deductionPts} pts)
                          </span>
                          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                            {def.repairTimeline}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(def.status)}`}>
                            {def.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* General Comments */}
        {report.generalComments && (
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#0D6A8D] mt-6">
            <h3 className="font-bold text-[#0D6A8D] mb-2">General Comments</h3>
            <p className="text-gray-700">{report.generalComments}</p>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations && report.recommendations.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500 mt-6">
            <h3 className="font-bold text-green-700 mb-2">Recommendations</h3>
            <ul className="list-disc list-inside space-y-1">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button
            onClick={() => router.push('/dashboard/my-inspection')}
            variant="outline"
            className="px-8 w-full sm:w-auto"
          >
            Back to Inspections
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            className="px-8 w-full sm:w-auto bg-[#0D6A8D] hover:bg-[#0a5670] text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
