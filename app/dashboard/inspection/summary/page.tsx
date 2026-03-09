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

  // Handle "Continue Inspection" - mark unit as completed and go back to property details
  const handleContinueInspection = () => {
    if (inspectionContext) {
      // Set flag for property-details page to pick up and mark unit completed
      localStorage.setItem('inspectionReturnToProperty', JSON.stringify({
        propertyId: inspectionContext.propertyId,
        buildingId: inspectionContext.buildingId,
        unitName: inspectionContext.unitName
      }))
      // Navigate back to property details
      if (inspectionContext.propertyDetailsUrl) {
        router.push(inspectionContext.propertyDetailsUrl)
      } else {
        router.push(`/dashboard/property-details/${inspectionContext.propertyId}`)
      }
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
    const finalScore = Math.max(0, 100 - totalDeductions)

    return {
      reportId: `RPT-${Date.now()}`,
      version: '1.0',
      generatedAt: now.toISOString(),
      metadata: {
        inspectionNo: data.inspectionNo || data.inspectionId || `INSP-${Date.now().toString(36).toUpperCase()}`,
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
        preliminaryScore: data.preliminaryScore || finalScore,
        finalScore: data.finalScore || data.complianceScore || finalScore,
        calculatedScore: data.calculatedScore || finalScore,
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
  const handleExportPDF = async () => {
    if (!report) return
    setExporting(true)
    try {
      toast.info("Generating PDF through Puppeteer service...", { position: "top-right" })

      const token = localStorage.getItem('token')

      // Prepare the payload matching backend expectations
      let payloadData;

      const storedData = localStorage.getItem('currentInspectionData');
      const storedProperty = localStorage.getItem('currentInspectionProperty');

      if (storedData) {
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
            throw new Error("Popup blocked. Please allow popups to print the report.");
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
      
      // Mark inspection as completed after successful PDF export
      await markInspectionAsCompleted();
      
    } catch (error: any) {
      console.error('PDF export error:', error)
      toast.error(`Failed to export PDF: ${error.message}`, { position: "top-right" })
    } finally {
      setExporting(false)
    }
  }

  // Mark inspection as completed in the backend
  const markInspectionAsCompleted = async () => {
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
        return;
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
        toast.success("Inspection saved and marked as completed!", { position: "top-right" });
      } else {
        console.error('Failed to mark inspection as completed');
      }
    } catch (error) {
      console.error('Error marking inspection as completed:', error);
      // Don't show error to user as PDF was still downloaded successfully
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
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleExportPDF}
                disabled={exporting}
                className="gap-2 bg-[#0D6A8D] hover:bg-[#0a5670] text-white"
              >
                <Download /> {exporting ? 'Generating...' : 'Export PDF'}
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
                      {report.deficiencies.map((def, index) => (
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
                  {report.deficiencies.map((def, index) => (
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
