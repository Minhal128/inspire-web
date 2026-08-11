"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { propertiesAPI, inspectionsAPI, paymentsAPI } from "@/lib/api"
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
import { getEnhancedReportHTML } from "@/lib/enhancedNspirePDFService"


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

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const Mail = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

// Loading fallback component
function LoadingFallback() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
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
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [sharingPayment, setSharingPayment] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  // Custom column header from the building table (editable in property-details)
  const [buildingColumnHeader, setBuildingColumnHeader] = useState('Building')
  // Deficiency preview modal
  const [selectedDeficiency, setSelectedDeficiency] = useState<DeficiencyEntry | null>(null)

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
    } catch { }
  }, [])

  const inspectionIdentifier = useMemo(() => {
    const id = searchParams.get('id') || searchParams.get('inspectionId') || searchParams.get('propertyId')
    return id || null
  }, [searchParams])

  const visibleDeficiencies = useMemo(() => {
    if (!report) return []
    // If we're just previewing progress (not finalizing), show everything so they can review
    const isFinalizing = searchParams.get('finalize') === 'true';
    if (isReportUnlocked || !isFinalizing) return report.deficiencies
    return report.deficiencies.slice(0, 2)
  }, [report, isReportUnlocked, searchParams])

  // Handle "Back to Inspection" - return to the active inspection screen
  const handleBackToInspection = () => {
    const propertyId = searchParams.get('propertyId') || searchParams.get('id');
    if (propertyId) {
      router.push(`/dashboard/inspection-category/${propertyId}`);
      return;
    }

    // Priority 1: Current unit context from localStorage
    if (inspectionContext) {
      router.push(`/dashboard/inspection-category/${inspectionContext.propertyId}`);
      return;
    }

    // Priority 2: Fallback to currentInspectionData
    try {
      const storedDataRaw = localStorage.getItem('currentInspectionData');
      if (storedDataRaw) {
        const parsed = JSON.parse(storedDataRaw);
        const propertyId = parsed.propertyId || parsed.inspectionId;
        const building = parsed.building || parsed.buildingId || '';
        const unit = parsed.currentUnit || parsed.unitId || '';

        if (propertyId) {
          let url = `/dashboard/inspection-category/${propertyId}`;
          const params = new URLSearchParams();
          if (building) params.append('building', building);
          if (unit) params.append('unit', unit);
          params.append('units', '1');

          url += `?${params.toString()}`;
          router.push(url);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse inspection data for return URL', e);
    }

    // Priority 3: Try to find any progress record to go back to
    const storedPropertyRaw = localStorage.getItem('currentInspectionProperty');
    if (storedPropertyRaw) {
      try {
        const prop = JSON.parse(storedPropertyRaw);
        const pid = prop._id || prop.id;
        if (pid) {
          router.push(`/dashboard/inspection-category/${pid}?building=B1&unit=Outside&units=1`);
          return;
        }
      } catch { }
    }

    // Priority 4: Dashboard
    router.push('/dashboard');
  }

  // Load inspection data from URL params or localStorage
  useEffect(() => {
    const loadInspectionData = async () => {
      try {
        setLoading(true);
        // IGNORE localStorage
        let inspectionData = null;
        let propertyData = null;

        let urlPropertyId = searchParams.get('propertyId');
        let paramId = searchParams.get('id') || searchParams.get('inspectionId');
        
        if (!urlPropertyId && paramId) {
            try {
                const inspRes = await inspectionsAPI.getById(paramId);
                if (inspRes.success && inspRes.inspection) {
                    urlPropertyId = inspRes.inspection.property?._id || inspRes.inspection.property || paramId;
                }
            } catch (e) {
                console.error("Failed to fetch inspection details", e);
            }
        }

        const propertyId = urlPropertyId || paramId;
        const token = localStorage.getItem('token');

        if (propertyId && token) {
          try {
            // Fetch property details
            const propRes = await propertiesAPI.getById(propertyId);
            if (propRes.success) {
              propertyData = propRes.property;
            }

            // Fetch current progress (drafts)
            const progData = await inspectionsAPI.getProgress({
              property_id: propertyId,
              draft_only: 'false'
            });

            // Fetch finalized inspections (completed)
            const inspectionsRes = await inspectionsAPI.getAll({
              property: propertyId,
              status: 'completed'
            });

            let allFindings: any[] = [];
            let serverUnlocked = false;

            // To prevent duplicates, we only want ONE record per building+unit+type combo.
            // Finalized inspections take priority. For drafts, we take the latest one.
            const uniqueRecords = new Map<string, any>();

            // 1. Collect findings from finalized (completed) inspections
            if (inspectionsRes.success && inspectionsRes.inspections) {
              inspectionsRes.inspections.forEach((insp: any) => {
                const bldg = String(insp.building?.name || insp.buildingId || insp.building || '').toUpperCase().trim();
                const unit = String(insp.unit?.name || insp.unitId || insp.unit || '').toUpperCase().trim();
                const type = String(insp.inspectionType || '').toUpperCase().trim();
                const key = `${bldg}|${unit}|${type}`;
                
                if (insp.isReportUnlocked) serverUnlocked = true;
                
                uniqueRecords.set(key, {
                    findings: insp.findings || insp.deficiencies || [],
                    building: bldg,
                    unit: unit,
                    area: insp.inspectionType || 'Final',
                    isFinalized: true,
                    updatedAt: new Date(insp.updatedAt || insp.createdAt || 0).getTime()
                });
              });
            }

            // 2. Collect findings from progress (draft) records
            if (progData.success && progData.progress) {
              const allProgress = progData.progress || [];
              allProgress.forEach((record: any) => {
                const bldg = String(record.buildingId || record.inspectionData?.buildingId || '').toUpperCase().trim();
                const unit = String(record.unitId || record.inspectionData?.currentUnit || '').toUpperCase().trim();
                const rawArea = record.inspectionType || (unit === 'OUTSIDE' ? 'Outside' : unit === 'INSIDE' ? 'Inside' : 'Unit');
                const type = String(record.inspectionType || rawArea).toUpperCase().trim();
                const area = rawArea.charAt(0).toUpperCase() + rawArea.slice(1).toLowerCase();
                const key = `${bldg}|${unit}|${type}`;
                const recordTime = new Date(record.updatedAt || record.createdAt || 0).getTime();
                
                // Only add if not already finalized, or if this draft is somehow newer (though finalized should usually win)
                // Let's just say finalized always wins, but for drafts we take the newest one
                const existing = uniqueRecords.get(key);
                if (!existing || (!existing.isFinalized && recordTime > existing.updatedAt)) {
                    uniqueRecords.set(key, {
                        findings: record.inspectionData?.findings || record.inspectionData?.deficiencies || [],
                        building: bldg,
                        unit: unit,
                        area: area,
                        isFinalized: false,
                        updatedAt: recordTime
                    });
                }
              });
            }

            // 3. Flatten exactly the findings from our unique records, without touching the deficiencies themselves
            uniqueRecords.forEach(record => {
                if (Array.isArray(record.findings)) {
                    record.findings.forEach((f: any) => {
                        allFindings.push({
                            ...f,
                            building: f.building || record.building,
                            unit: f.unit || record.unit,
                            area: f.area || record.area,
                            isFinalized: record.isFinalized
                        });
                    });
                }
            });

            // Deduplicate findings to prevent duplicate ODs
            const finalFindings: any[] = [];
            const seenKeys = new Set<string>();
            
            allFindings.forEach((f: any) => {
                const bldgStr = String(f.building || '').toLowerCase();
                const unitStr = String(f.unit || '').toLowerCase();
                const areaStr = String(f.area || f.subCategory || f.category || '').toLowerCase();
                const titleStr = String(f.title || f.deficiencyName || f.name || '').toLowerCase();
                const descStr = String(f.description || f.details || f.deficiencyDetails || '').toLowerCase();
                
                // Filter out empty "ghost" records that have no title and no description
                if (!titleStr && !descStr) {
                    return;
                }

                // Content-based deduplication: the database stores many duplicate records
                // from drafts/progress saves, each with a different _id. We must deduplicate
                // purely by content to get the real count.
                const dedupKey = `${areaStr}|${bldgStr}|${unitStr}|${titleStr}|${descStr}`;
                
                if (!seenKeys.has(dedupKey)) {
                    seenKeys.add(dedupKey);
                    finalFindings.push(f);
                }
            });

            console.log(`Summary Aggregation: Final unique deficiencies=${finalFindings.length} (from ${allFindings.length} total)`);

            // Update local unlock state if server reports any inspection is unlocked
            if (serverUnlocked) setIsReportUnlocked(true);

            // 4. Update inspectionData with combined findings
            inspectionData = {
              ...(inspectionData || {}),
              propertyId,
              propertyName: propertyData?.name || 'Property',
              propertyAddress: propertyData?.address || '-',
              findings: finalFindings,
              deficiencies: finalFindings
            };
          } catch (fetchError) {
            console.error('Error fetching property-wide progress:', fetchError);
          }
        }

        if (inspectionData) {
          // Load custom column header if present
          if (inspectionData.buildingColumnHeader) {
            setBuildingColumnHeader(inspectionData.buildingColumnHeader)
          }
          // Convert to NSPIRE report format
          const nspireReport = convertToNSPIREReport(inspectionData, propertyData)
          setReport(nspireReport)
        } else {
          // No data found — show empty state, never show hardcoded demo data
          if (propertyId) {
            toast.error("Property data not found on server.", { position: "top-right" });
          }
          setReport(null);
        }
      } catch (error: any) {
        console.error('Error loading inspection data:', error)
        toast.error(`Failed to load inspection: ${error.message}`, { position: "top-right" });
        setReport(null);
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
        const data = await paymentsAPI.checkReportUnlock(inspectionIdentifier);
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
          const data = await paymentsAPI.getStripeSessionStatus(sessionId);

          if (!data?.success) {
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
        deductionPts: finding.deductionPts !== undefined ? finding.deductionPts : calculateDeductionPoints(finding.severity || 'moderate'),
        repeatIndicator: finding.repeat || false,
        severity,
        healthAndSafety: finding.healthAndSafety || severity,
        standard: finding.standard || '',
        inspectionProtocol: finding.inspectionProtocol || finding.protocol || '',
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
      inside: {
        lifeThreatening: deficiencies.filter(d => d.severity === 'Life-Threatening' && d.area?.toLowerCase() === 'inside').length,
        severe: deficiencies.filter(d => d.severity === 'Severe' && d.area?.toLowerCase() === 'inside').length,
        moderate: deficiencies.filter(d => d.severity === 'Moderate' && d.area?.toLowerCase() === 'inside').length,
        low: deficiencies.filter(d => d.severity === 'Low' && d.area?.toLowerCase() === 'inside').length,
      },
      outside: {
        lifeThreatening: deficiencies.filter(d => d.severity === 'Life-Threatening' && d.area?.toLowerCase() === 'outside').length,
        severe: deficiencies.filter(d => d.severity === 'Severe' && d.area?.toLowerCase() === 'outside').length,
        moderate: deficiencies.filter(d => d.severity === 'Moderate' && d.area?.toLowerCase() === 'outside').length,
        low: deficiencies.filter(d => d.severity === 'Low' && d.area?.toLowerCase() === 'outside').length,
      },
      units: {
        lifeThreatening: deficiencies.filter(d => d.severity === 'Life-Threatening' && (d.area?.toLowerCase() === 'unit' || d.area?.toLowerCase() === 'units')).length,
        severe: deficiencies.filter(d => d.severity === 'Severe' && (d.area?.toLowerCase() === 'unit' || d.area?.toLowerCase() === 'units')).length,
        moderate: deficiencies.filter(d => d.severity === 'Moderate' && (d.area?.toLowerCase() === 'unit' || d.area?.toLowerCase() === 'units')).length,
        low: deficiencies.filter(d => d.severity === 'Low' && (d.area?.toLowerCase() === 'unit' || d.area?.toLowerCase() === 'units')).length,
      },
      byBuilding: {},
      byCategory: {},
      repeatDeficiencies: deficiencies.filter(d => d.repeatIndicator).length,
      newDeficiencies: deficiencies.filter(d => !d.repeatIndicator).length,
    }

    // Populate category breakdown
    deficiencies.forEach(d => {
      const cat = d.area || 'General';
      summary.byCategory[cat] = (summary.byCategory[cat] || 0) + 1;
    });

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

      setPurchasingUnlock(true)
      const data = await paymentsAPI.createStripeCheckoutSession(inspectionIdentifier);

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

  const handleSharePaymentLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shareEmail.trim()) {
      toast.error("Please enter a valid email address.", { position: "top-right" })
      return
    }

    try {
      setSharingPayment(true)
      const data = await paymentsAPI.shareStripeCheckoutLink(inspectionIdentifier || '', shareEmail)
      
      if (data?.success) {
        toast.success("Payment link sent to email successfully!", { position: "top-right" })
        setShowShareModal(false)
        setShareEmail("")
      } else {
        toast.error(data?.message || "Failed to send payment link.", { position: "top-right" })
      }
    } catch (error: any) {
      console.error("Error sharing payment link:", error)
      toast.error(error.message || "An error occurred while sharing the payment link.", { position: "top-right" })
    } finally {
      setSharingPayment(false)
    }
  }

  const handleExportPDF = async () => {
    if (!report) return

    // Block export if report is not unlocked
    if (!isReportUnlocked) {
      toast.error('Please unlock the report to export PDF', { position: 'top-right' })
      return
    }

    const isPreview = !isReportUnlocked;

    if (isPreview) {
      toast.info('Exporting 2-item preview PDF...', { position: 'top-right' })
    }

    setExporting(true)
    try {
      toast.info("Generating PDF through Puppeteer service...", { position: "top-right" })

      const token = localStorage.getItem('token')

      // 1. Mark as completed in background (we don't need its return value for the PDF)
      await markInspectionAsCompleted({
        silentToast: true,
        returnInspection: false,
      });

      // 2. Build PDF payload EXACTLY from our deduplicated `report` state
      const exportDeficiencies = isPreview ? report.deficiencies.slice(0, 2) : report.deficiencies;
      
      const extractImageUrl = (d: any): string => {
        if (typeof d.imageUri === 'string' && d.imageUri.startsWith('http')) return d.imageUri;
        if (typeof d.imageUrl === 'string' && d.imageUrl.startsWith('http')) return d.imageUrl;
        if (typeof d.photo === 'string' && d.photo.startsWith('http')) return d.photo;
        if (typeof d.image === 'string' && d.image.startsWith('http')) return d.image;
        if (Array.isArray(d.photos) && d.photos.length > 0) {
          const first = d.photos[0];
          if (typeof first === 'string' && first.startsWith('http')) return first;
          if (first?.url && typeof first.url === 'string' && first.url.startsWith('http')) return first.url;
        }
        for (const key of Object.keys(d)) {
          const val = d[key];
          if (typeof val === 'string' && val.startsWith('http') && (val.includes('cloudinary') || val.includes('.jpg') || val.includes('.png') || val.includes('.jpeg') || val.includes('.webp'))) {
            return val;
          }
        }
        return '';
      };

      const formattedDeficiencies = exportDeficiencies.map((d: any) => {
        const img = extractImageUrl(d);
        return {
          ...d,
          title: d.deficiencyName || d.title,
          description: d.deficiencyDetails || d.description,
          notes: d.comments || d.notes,
          category: d.area || d.category,
          imageUri: img,
          imageUrl: img,
          photos: img ? [img] : []
        };
      });

      const payloadData = {
        ...report.metadata, // Spread metadata
        inspectionNo: report.metadata.inspectionNo,
        propertyName: report.metadata.propertyName,
        propertyAddress: report.metadata.propertyAddress,
        findings: formattedDeficiencies,
        deficiencies: formattedDeficiencies
      };

      const imageCount = payloadData.deficiencies.filter((d: any) => d.imageUri || (d.photos && d.photos.length > 0)).length;
      console.log(`FINAL PDF PAYLOAD: ${payloadData.deficiencies.length} items, ${imageCount} have images.`);
      console.log("PAYLOAD SAMPLE:", JSON.stringify(payloadData.deficiencies[0] || {}).substring(0, 500));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inspections/generate-pdf?includeImages=true`, {
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
            htmlLink.download = (data.filename || `NSPIREinspection.AI_Report_${report.metadata.inspectionNo}.html`).replace(/\.pdf$/i, '.html');
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
      link.download = `NSPIREinspection.AI_Report_${report.metadata.inspectionNo}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("PDF downloaded successfully", { position: "top-right" })



    } catch (error: any) {
      console.error('PDF export error:', error)
      toast.error(`Failed to export PDF: ${error.message}`, { position: "top-right" })
    } finally {
      setExporting(false)
    }
  }

  const handleExportExcel = async () => {
    if (!report) return

    // Block export if report is not unlocked
    if (!isReportUnlocked) {
      toast.error('Please unlock the report to export Excel', { position: 'top-right' })
      return
    }

    if (!isReportUnlocked) {
      toast.info('This report is locked. Redirecting to unlock checkout...', { position: 'top-right' })
      await handleUnlockWithStripe()
      return
    }

    setExportingExcel(true)
    try {
      const blob = await inspectionsAPI.generateExcel(report);

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `NSPIRE_Report_${report.metadata.inspectionNo || 'Export'}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Professional Excel report downloaded!', { position: 'top-right' })
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
      const propertyId = searchParams.get('propertyId') || searchParams.get('id');

      if (!propertyId || !report) {
        console.log('No property data or report to save');
        return null;
      }

      // Update or create inspection record as completed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/inspections/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: propertyId,
          inspectionData: {
            ...report,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
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
                <h1 className="text-2xl font-bold text-[#006795]">
                  {searchParams.get('finalize') === 'true' ? 'HUD INSPIRE INSPECTION REPORT' : 'HUD INSPIRE INSPECTION PROGRESS'}
                </h1>
              </div>
              <p className="text-gray-600 font-medium">{report.metadata.propertyName}</p>
              <p className="text-sm text-gray-500">{report.metadata.propertyAddress}</p>
              <p className="text-sm text-gray-500 mt-1">
                Inspection #{report.metadata.inspectionNo} | {report.metadata.startDate}
              </p>
              {inspectionContext?.unitName && (
                <p className="text-sm font-bold text-[#006795] mt-1">
                  {buildingColumnHeader}: {inspectionContext.buildingId} &rarr; {inspectionContext.unitName}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleExportPDF}
                disabled={exporting || checkingUnlock || purchasingUnlock}
                className="gap-2 bg-[#006795] hover:bg-[#0a5670] text-white"
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
                onClick={handleBackToInspection}
                className="gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold"
              >
                <ChevronLeft className="w-5 h-5" />
                {searchParams.get('finalize') === 'true' ? 'Back to Inspection' : 'CONTINUE INSPECTION'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* 1. Unlock Card */}
            {checkingUnlock ? (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center gap-3">
                <svg className="h-4 w-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-sm text-gray-600 font-semibold">Checking report access...</span>
              </div>
            ) : isReportUnlocked ? (
              <div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-200 flex items-center gap-3">
                <Unlock className="w-5 h-5 text-green-700" />
                <span className="text-sm font-semibold text-green-700">Report Unlocked — Full export access enabled</span>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-900 uppercase tracking-wide">Report Locked</p>
                    <p className="text-xs text-amber-700">Pay once to unlock full export access</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    onClick={() => setShowSummaryModal(true)}
                    className="h-10 gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm rounded-lg"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Unlock Report · $49
                  </Button>
                  <Button
                    onClick={() => setShowPdfPreview(true)}
                    variant="outline"
                    className="h-10 gap-2 border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-bold rounded-lg"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    View Deficiency
                  </Button>
                </div>
              </div>
            )}



            {/* 2. Inspection Data Table */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-[#006795] mb-4 pb-2 border-b-2 border-[#006795]">
                INSPECTION DATA
              </h2>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#006795] text-white">
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
                    <div className="font-bold text-[#006795] mb-2">{row.type}</div>
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

            {/* 3. Score Cards */}
            <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] rounded-lg p-4 text-white">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="sm:border-r border-white/30 pb-4 sm:pb-0">
                  <p className="text-xs opacity-80 uppercase tracking-wide">Preliminary Score</p>
                  <p className="text-3xl font-bold">{report.metadata.preliminaryScore}</p>
                </div>
                <div className="sm:border-r border-white/30 pb-4 sm:pb-0">
                  <p className="text-xs opacity-80 uppercase tracking-wide">Points Lost</p>
                  <p className="text-3xl font-bold text-red-200">-{report.deficiencies.reduce((sum, d) => sum + d.deductionPts, 0)}</p>
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

            {/* 4. Deficiency Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-[#006795] mb-4 pb-2 border-b-2 border-[#006795]">
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
            <div className="mb-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#006795] mb-4 pb-2 border-b-2 border-[#006795]">
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
            </div>

          </div>
        )}

        {/* Deficiencies Tab */}
        {activeTab === 'deficiencies' && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-[#006795] mb-4 pb-2 border-b-2 border-[#006795]">
              DEFICIENCY DETAILS
            </h2>

            {!checkingUnlock && !isReportUnlocked && report.deficiencies.length > visibleDeficiencies.length && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <span className="font-semibold text-base block mb-1">Unlock to Export PDF</span>
                <span className="font-semibold italic">Locked preview:</span> showing {visibleDeficiencies.length} of {report.deficiencies.length} deficiencies. Unlock for $99.00 to view all items and export full PDF.
              </div>
            )}

            {/* Unit header banner */}
            {inspectionContext?.unitName && (
              <div className="bg-gradient-to-r from-[#006795]/10 to-[#0891B2]/10 rounded-lg p-4 mb-4 border border-[#006795]/20">
                <h3 className="text-base font-black text-[#006795] tracking-tight">
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
              <div className="space-y-8">
                {/* Group by Area (Outside, Inside, Unit) */}
                {['Outside', 'Inside', 'Unit', 'General'].map(area => {
                  const areaDeficiencies = visibleDeficiencies.filter(d => d.area === area);
                  if (areaDeficiencies.length === 0) return null;

                  return (
                    <div key={area} className="space-y-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg w-fit border border-gray-200">
                        <span className="text-sm font-black text-[#006795] uppercase tracking-wider">{area} Summary</span>
                        <span className="bg-[#006795] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {areaDeficiencies.length}
                        </span>
                      </div>

                      {/* Desktop Table View for this Area */}
                      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-[#006795] text-white">
                              <th className="p-3 text-left w-12">#</th>
                              <th className="p-3 text-center w-24">Proof</th>
                              <th className="p-3 text-left">Location</th>
                              <th className="p-3 text-left">Deficiency</th>
                              <th className="p-3 text-left">Description</th>
                              <th className="p-3 text-center">Severity</th>
                              <th className="p-3 text-center">H&S</th>
                              <th className="p-3 text-center">Points Lost</th>
                              <th className="p-3 text-center">Repair By</th>
                              <th className="p-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {areaDeficiencies.map((def, idx) => (
                              <tr 
                                key={def.id} 
                                onClick={() => setSelectedDeficiency(def)}
                                className={`${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition-colors`}
                              >
                                <td className="p-3 font-bold text-center text-gray-400">{idx + 1}</td>
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
                                    {area === 'Unit' && (
                                      <>
                                        <div><span className="text-gray-500">{buildingColumnHeader}:</span> <span className="font-semibold">{def.building}</span></div>
                                        <div><span className="text-gray-500">Unit:</span> <span className="font-semibold">{def.unit}</span></div>
                                      </>
                                    )}
                                    {area !== 'Unit' && (
                                      <div><span className="text-gray-500">Location:</span> <span className="font-semibold">{def.building}</span></div>
                                    )}
                                    <div><span className="text-gray-500">Room/Area:</span> <span className="font-semibold">{def.room}</span></div>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="font-bold text-gray-800 mb-1">{def.deficiencyName}</div>
                                  <span className="inline-block bg-cyan-100 text-cyan-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                    {def.nspireCode}
                                  </span>
                                </td>
                                <td className="p-3 max-w-[250px]">
                                  <div className="text-gray-700 text-xs mb-2 leading-relaxed">{def.deficiencyDetails}</div>
                                  {def.comments && (
                                    <div className="text-[10px] text-gray-500 italic bg-gray-100 p-1.5 rounded-lg">
                                      <span className="font-bold uppercase text-[9px] block mb-0.5">Inspector Notes:</span>
                                      {def.comments}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`inline-block px-3 py-1 rounded text-[10px] font-black uppercase ${getSeverityBadgeClass(def.severity)}`}>
                                    {def.severity}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="text-[10px] font-black text-red-600 uppercase">{def.healthAndSafety}</span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="text-sm font-bold text-gray-800">{def.deductionPts}</span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-1 rounded">
                                    {def.repairTimeline}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase ${getStatusBadgeClass(def.status)}`}>
                                    {def.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile View for this Area */}
                      <div className="lg:hidden space-y-4">
                        {areaDeficiencies.map((def, idx) => (
                          <div 
                            key={def.id} 
                            onClick={() => setSelectedDeficiency(def)}
                            className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-[#006795] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                {idx + 1}
                              </div>
                              {def.imageUri ? (
                                <img
                                  src={def.imageUri}
                                  alt="Deficiency Proof"
                                  className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-sm"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                                  <ImageIcon className="w-8 h-8" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-black text-gray-900 text-sm mb-1 break-words">{def.deficiencyName}</h3>
                                <div className="flex flex-wrap gap-1">
                                  <span className="inline-block bg-cyan-100 text-cyan-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                    {def.nspireCode}
                                  </span>
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${getSeverityBadgeClass(def.severity)}`}>
                                    {def.severity}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-gray-200 text-xs space-y-2">
                              <p className="text-gray-700 leading-relaxed">{def.deficiencyDetails}</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-gray-500">
                                <div><span className="font-bold">Location:</span> {def.building} {def.unit !== '-' ? `| Unit ${def.unit}` : ''}</div>
                                <div><span className="font-bold">Room:</span> {def.room}</div>
                                <div><span className="font-bold">Repair By:</span> {def.repairTimeline}</div>
                                <div><span className="font-bold">Status:</span> {def.status}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* General Comments */}
        {report.generalComments && (
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#006795] mt-6">
            <h3 className="font-bold text-[#006795] mb-2">General Comments</h3>
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
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 mb-12">
          <Button
            onClick={handleBackToInspection}
            className="px-10 h-14 w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            BACK TO INSPECTION
          </Button>
          <Button
            onClick={() => router.push('/dashboard/my-inspection')}
            variant="outline"
            className="px-10 h-14 w-full sm:w-auto font-black rounded-xl border-2 hover:bg-gray-50 text-gray-600"
          >
            MY INSPECTIONS
          </Button>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-lg font-bold text-[#006795] mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Summary
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Enter the client's email address below. We'll send them a secure Stripe payment link to pay and unlock the full report.
            </p>

            <form onSubmit={handleSharePaymentLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Recipient Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-black focus:outline-none focus:border-[#006795] focus:bg-white transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  variant="outline"
                  className="px-4 py-2 text-sm font-semibold rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sharingPayment}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#006795] hover:bg-[#0a5670] rounded-lg shadow-sm"
                >
                  {sharingPayment ? "Sending..." : "Send Payment Link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deficiency Preview Modal */}
      {selectedDeficiency && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedDeficiency(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] px-6 py-5 sticky top-0 z-10">
              <button
                onClick={() => setSelectedDeficiency(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-white pr-8">Deficiency Details</h2>
              <p className="text-white/80 text-sm mt-1">Code: {selectedDeficiency.nspireCode}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Image */}
              {selectedDeficiency.imageUri && (
                <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                  <img
                    src={selectedDeficiency.imageUri}
                    alt="Deficiency Proof"
                    className="w-full h-auto max-h-96 object-contain bg-gray-100"
                  />
                </div>
              )}

              {/* Title and Severity */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{selectedDeficiency.deficiencyName}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-black uppercase ${getSeverityBadgeClass(selectedDeficiency.severity)}`}>
                    {selectedDeficiency.severity}
                  </span>
                  <span className="inline-block bg-cyan-100 text-cyan-700 text-sm font-black px-4 py-2 rounded-lg uppercase">
                    {selectedDeficiency.nspireCode}
                  </span>
                  <span className="inline-block bg-red-100 text-red-700 text-sm font-black px-4 py-2 rounded-lg uppercase">
                    H&S: {selectedDeficiency.healthAndSafety}
                  </span>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-black uppercase ${getStatusBadgeClass(selectedDeficiency.status)}`}>
                    {selectedDeficiency.status}
                  </span>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-gray-700 text-sm uppercase mb-3">Location Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Area:</span>
                    <span className="font-bold text-gray-900">{selectedDeficiency.area}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">{buildingColumnHeader}:</span>
                    <span className="font-bold text-gray-900">{selectedDeficiency.building}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Unit:</span>
                    <span className="font-bold text-gray-900">{selectedDeficiency.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Room:</span>
                    <span className="font-bold text-gray-900">{selectedDeficiency.room}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-gray-700 text-sm uppercase mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedDeficiency.deficiencyDetails}</p>
              </div>

              {/* Inspector Comments */}
              {selectedDeficiency.comments && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-blue-900 text-sm uppercase mb-2">Inspector Notes</h4>
                  <p className="text-blue-800 leading-relaxed">{selectedDeficiency.comments}</p>
                </div>
              )}

              {/* Repair Timeline */}
              <div className="flex items-center justify-between bg-amber-50 rounded-xl p-4">
                <div>
                  <h4 className="font-bold text-amber-900 text-sm uppercase mb-1">Repair Timeline</h4>
                  <p className="text-amber-800 font-bold text-lg">{selectedDeficiency.repairTimeline}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-amber-900 text-sm uppercase mb-1">Points Lost</h4>
                  <p className="text-amber-800 font-bold text-2xl">-{selectedDeficiency.deductionPts}</p>
                </div>
              </div>

              {/* Inspection Details */}
              <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-1 text-gray-600">
                <div><span className="font-bold">Inspected Date:</span> {selectedDeficiency.inspectedDate}</div>
                <div><span className="font-bold">Inspected Time:</span> {selectedDeficiency.inspectedTime}</div>
                <div><span className="font-bold">Inspector ID:</span> {selectedDeficiency.inspectorId}</div>
                {selectedDeficiency.repeatIndicator && (
                  <div className="text-red-600 font-bold mt-2">⚠️ REPEAT DEFICIENCY</div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setSelectedDeficiency(null)}
                  className="px-8 py-3 bg-[#006795] hover:bg-[#0a5670] text-white font-bold rounded-xl"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal with Email Input */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold text-[#006795]">Deficiency Summary</h2>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Property Info */}
              <div className="bg-gradient-to-r from-[#006795]/10 to-[#0891B2]/10 rounded-lg p-4 border border-[#006795]/20">
                <h3 className="text-lg font-bold text-[#006795] mb-2">{report?.metadata.propertyName}</h3>
                <p className="text-sm text-gray-600">{report?.metadata.propertyAddress}</p>
                <p className="text-sm text-gray-500 mt-1">Inspection #{report?.metadata.inspectionNo}</p>
              </div>

              {/* Deficiency Summary Stats */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-bold text-[#006795] mb-4">Deficiency Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-lg text-center">
                    <p className="text-2xl font-bold text-red-600">{report?.summary.lifeThreatening}</p>
                    <p className="text-xs font-semibold text-red-600 uppercase">Life-Threat</p>
                  </div>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg text-center">
                    <p className="text-2xl font-bold text-orange-500">{report?.summary.severe}</p>
                    <p className="text-xs font-semibold text-orange-500 uppercase">Severe</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg text-center">
                    <p className="text-2xl font-bold text-blue-500">{report?.summary.moderate}</p>
                    <p className="text-xs font-semibold text-blue-500 uppercase">Moderate</p>
                  </div>
                  <div className="bg-gray-50 border-l-4 border-gray-500 p-3 rounded-r-lg text-center">
                    <p className="text-2xl font-bold text-gray-500">{report?.summary.low}</p>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Low</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg text-center col-span-2 sm:col-span-1">
                    <p className="text-2xl font-bold text-green-600">{report?.summary.total}</p>
                    <p className="text-xs font-semibold text-green-600 uppercase">Total</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-amber-50 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-amber-700">{report?.summary.repeatDeficiencies}</p>
                    <p className="text-xs font-semibold text-amber-700">Repeat</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-blue-700">{report?.summary.newDeficiencies}</p>
                    <p className="text-xs font-semibold text-blue-700">New</p>
                  </div>
                </div>
              </div>

              {/* Score Summary */}
              <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] rounded-lg p-4 text-white">
                <h3 className="text-lg font-bold mb-3">Inspection Score</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs opacity-80 uppercase tracking-wide">Preliminary</p>
                    <p className="text-2xl font-bold">{report?.metadata.preliminaryScore}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80 uppercase tracking-wide">Calculated</p>
                    <p className="text-2xl font-bold">{report?.metadata.calculatedScore}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80 uppercase tracking-wide">Final Score</p>
                    <p className="text-2xl font-bold">{report?.metadata.finalScore}</p>
                  </div>
                </div>
              </div>

              {/* Deficiency Preview */}
              {report?.deficiencies && report.deficiencies.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-[#006795] mb-3">Deficiency Preview (1 of {report.deficiencies.length})</h3>
                  <div className="flex gap-3 items-start border border-gray-100 rounded-lg p-3 bg-gray-50">
                    {report.deficiencies[0].imageUri ? (
                        <div className="w-20 h-20 shrink-0">
                          <img
                            src={report.deficiencies[0].imageUri}
                            alt="Deficiency"
                            className="w-full h-full object-cover rounded-md border border-gray-200"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 shrink-0 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {report.deficiencies[0].deficiencyName}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${SEVERITY_COLORS[report.deficiencies[0].severity]}`}>
                            {report.deficiencies[0].severity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {report.deficiencies[0].deficiencyDetails}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {report.deficiencies[0].area} • {report.deficiencies[0].building} {report.deficiencies[0].unit && `• ${report.deficiencies[0].unit}`}
                        </p>
                      </div>
                  </div>
                </div>
              )}

              {/* Email Input Section */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h3 className="text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Get Full Report via Email
                </h3>
                <p className="text-sm text-amber-800 mb-4">
                  Enter your email to receive the complete inspection report with all deficiency details, photos, and recommendations.
                </p>
                <form onSubmit={handleSharePaymentLink} className="space-y-3">
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-gray-900"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={sharingPayment || !shareEmail.trim()}
                      className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg"
                    >
                      {sharingPayment ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Full Report Link'
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowSummaryModal(false)}
                      variant="outline"
                      className="px-6 border-amber-300 text-amber-800 hover:bg-amber-100"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">💡 Note:</span> The full report includes detailed photos, inspector comments, repair timelines, and compliance codes for each deficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col relative">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#006795]">Report PDF Preview</h2>
              <button
                onClick={() => setShowPdfPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-2 bg-gray-100 overflow-hidden font-sans">
              <iframe
                srcDoc={getEnhancedReportHTML(report)}
                className="w-full h-full border-0 rounded-lg bg-white"
                title="PDF Report Preview"
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

