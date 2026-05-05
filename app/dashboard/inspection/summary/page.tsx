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
      } catch {}
    }

    // Priority 4: Dashboard
    router.push('/dashboard');
  }

  // Load inspection data from URL params or localStorage
  useEffect(() => {
    const loadInspectionData = async () => {
      try {
        setLoading(true);
        // IGNORE localStorage - fetch everything from server to ensure fresh data
        let inspectionData = null;
        let propertyData = null;

        const propertyId = searchParams.get('propertyId') || searchParams.get('id');
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

            // 1. Collect findings from all progress (draft) records
            if (progData.success && progData.progress) {
              const allProgress = progData.progress || [];
              allProgress.forEach((record: any) => {
                const recordFindings = record.inspectionData?.findings || record.inspectionData?.deficiencies || [];
                if (Array.isArray(recordFindings)) {
                  const building = record.buildingId || record.inspectionData?.buildingId || '';
                  const unit = record.unitId || record.inspectionData?.currentUnit || '-';
                  const rawArea = record.inspectionType || (unit === 'Outside' ? 'Outside' : unit === 'Inside' ? 'Inside' : 'Unit');
                  const area = rawArea.charAt(0).toUpperCase() + rawArea.slice(1).toLowerCase();
                  
                  recordFindings.forEach((f: any) => {
                    allFindings.push({
                      ...f,
                      building: f.building || building,
                      unit: f.unit || unit,
                      area: f.area || area
                    });
                  });
                }
              });
            }

            // 2. Collect findings from finalized (completed) inspections
            if (inspectionsRes.success && inspectionsRes.inspections) {
              inspectionsRes.inspections.forEach((insp: any) => {
                const inspFindings = insp.findings || insp.deficiencies || [];
                if (insp.isReportUnlocked) serverUnlocked = true;
                
                if (Array.isArray(inspFindings)) {
                  inspFindings.forEach((f: any) => {
                    allFindings.push({
                      ...f,
                      building: f.building || insp.building?.name || '',
                      unit: f.unit || insp.unit?.name || insp.unit || '-',
                      area: f.area || insp.inspectionType || 'Final',
                      isFinalized: true
                    });
                  });
                }
              });
            }

            // 3. Smart aggregation: deduplicate findings by a unique key
            const deduped = new Map<string, any>();
            allFindings.forEach(f => {
              // Normalize common identifiers to ensure matches
              const normBuilding = String(f.building || '').replace(/^Building\s+/i, 'B').toUpperCase().trim();
              const normUnit = String(f.unit || '').replace(/^Unit\s+/i, '').replace(/^-$/, '').toUpperCase().trim();
              const normName = String(f.deficiencyName || f.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');

              // Create a key that identifies the SAME physical deficiency across different states
              const key = [normName, normBuilding, normUnit].filter(Boolean).join('|');
              
              // If we have duplicates, prefer the one that came from a finalized inspection or has an image
              const existing = deduped.get(key);
              const isNewerOrBetter = !existing || 
                                     (f.isFinalized && !existing.isFinalized) || 
                                     (!existing.imageUri && f.imageUri);
                                     
              if (isNewerOrBetter) {
                deduped.set(key, f);
              }
            });

            const finalFindings = Array.from(deduped.values());
            console.log(`Summary Aggregation: Raw=${allFindings.length}, Deduped=${finalFindings.length}`);

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
        } else if (propertyId) {
          // If we have an ID but no data, don't show demo data - show error
          toast.error("Property data not found on server.", { position: "top-right" });
          setReport(null);
        } else {
          // Only show demo data if explicitly requested or no ID provided at all
          setReport(getDemoReport())
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

  const handleExportPDF = async () => {
    if (!report) return

    // If not unlocked, we allow a "Preview" export with only 2 items
    const isPreview = !isReportUnlocked;
    
    if (isPreview) {
      toast.info('Exporting 2-item preview PDF...', { position: 'top-right' })
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
        
        // PHOTO FIX: Prefer `findings` (raw data with imageUri strings) over
        // `deficiencies` (transformed objects where imageUri is nested inside photos[].url)
        const rawItems = isPreview
          ? (mergedInspectionPayload.findings || mergedInspectionPayload.deficiencies || []).slice(0, 2)
          : (mergedInspectionPayload.findings || mergedInspectionPayload.deficiencies || []);

        // Deep-scan helper: extract the first valid image URL from any field
        const extractImageUrl = (d: any): string => {
          // 1. Direct string fields
          if (typeof d.imageUri === 'string' && d.imageUri.startsWith('http')) return d.imageUri;
          if (typeof d.imageUrl === 'string' && d.imageUrl.startsWith('http')) return d.imageUrl;
          if (typeof d.photo === 'string' && d.photo.startsWith('http')) return d.photo;
          if (typeof d.image === 'string' && d.image.startsWith('http')) return d.image;
          // 2. photos array (could be strings or {url} objects)
          if (Array.isArray(d.photos) && d.photos.length > 0) {
            const first = d.photos[0];
            if (typeof first === 'string' && first.startsWith('http')) return first;
            if (first?.url && typeof first.url === 'string' && first.url.startsWith('http')) return first.url;
          }
          // 3. Fallback: scan all keys for any http URL
          for (const key of Object.keys(d)) {
            const val = d[key];
            if (typeof val === 'string' && val.startsWith('http') && (val.includes('cloudinary') || val.includes('.jpg') || val.includes('.png') || val.includes('.jpeg') || val.includes('.webp'))) {
              return val;
            }
          }
          return '';
        };

        // MAPPING FIX: Ensure photos are correctly formatted for the generator
        const exportDeficiencies = rawItems.map((d: any) => {
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

        payloadData = {
          ...mergedInspectionPayload,
          property: propertyData || mergedInspectionPayload.property,
          findings: exportDeficiencies,
          deficiencies: exportDeficiencies,
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
        
        // Limit deficiencies for preview export if locked
        if (isPreview && Array.isArray(rawData.findings)) {
          rawData.findings = rawData.findings.slice(0, 2);
        }
        if (isPreview && Array.isArray(rawData.deficiencies)) {
          rawData.deficiencies = rawData.deficiencies.slice(0, 2);
        }
        
        payloadData = rawData;
      } else if (!payloadData) {
        // Fallback: Reconstruct compatible object from current report state
        // The backend expects flat properties for metadata (e.g. propertyName)
        // or a nested property object.
        // Limit deficiencies for preview export if locked
        const exportDeficiencies = isPreview ? report.deficiencies.slice(0, 2) : report.deficiencies;

        payloadData = {
          ...report.metadata, // Spread metadata (inspectionNo, propertyName, etc.) to root
          deficiencies: exportDeficiencies.map(d => {
            const img = d.imageUri || d.imageUrl || (Array.isArray(d.photos) && d.photos.length > 0 ? (typeof d.photos[0] === 'string' ? d.photos[0] : d.photos[0].url) : '') || '';
            return {
              ...d,
              title: d.deficiencyName,
              description: d.deficiencyDetails,
              notes: d.comments,
              category: d.area,
              imageUri: img,
              imageUrl: img,
              photos: [img]
            };
          }),
          findings: exportDeficiencies.map(d => {
            const img = d.imageUri || d.imageUrl || (Array.isArray(d.photos) && d.photos.length > 0 ? (typeof d.photos[0] === 'string' ? d.photos[0] : d.photos[0].url) : '') || '';
            return {
              ...d,
              imageUri: img,
              imageUrl: img,
              photos: [img]
            };
          })
        };

        const imageCount = payloadData.deficiencies.filter((d: any) => d.imageUri || (d.photos && d.photos.length > 0)).length;
        console.log(`FINAL PDF PAYLOAD: ${payloadData.deficiencies.length} items, ${imageCount} have images.`);
        console.log("PAYLOAD SAMPLE:", JSON.stringify(payloadData.deficiencies[0]).substring(0, 500));
      }

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
      const storedData = localStorage.getItem('currentInspectionData');
      const storedProperty = localStorage.getItem('currentInspectionProperty');

      if (!storedData || !storedProperty) {
        console.log('No inspection data to save');
        return null;
      }

      const inspectionData = JSON.parse(storedData);
      const propertyData = JSON.parse(storedProperty);

      // Update or create inspection record as completed
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/inspections/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: propertyData._id,
          inspectionData: {
            ...inspectionData,
            status: 'in-progress',
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
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <h3 className="text-sm font-black text-amber-900 uppercase tracking-tight">Unlock to Export PDF</h3>
                    <Button
                      onClick={handleUnlockWithStripe}
                      disabled={purchasingUnlock}
                      className="h-9 gap-1.5 bg-amber-500 px-4 text-xs font-bold text-white hover:bg-amber-600 shadow-sm"
                    >
                      <Lock className="w-4 h-4" />
                      {purchasingUnlock ? 'Redirecting...' : 'Unlock Full Report - $99.00'}
                    </Button>
                  </div>
                )}
              </div>
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

        {/* Score Cards */}
        <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] rounded-lg p-4 mb-6 text-white">
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
                ? 'bg-white text-[#006795] shadow-sm'
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
            <div className="grid md:grid-cols-2 gap-6">
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

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-[#006795] mb-4 pb-2 border-b-2 border-[#006795]">
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
                              <th className="p-3 text-center">Repair By</th>
                              <th className="p-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {areaDeficiencies.map((def, idx) => (
                              <tr key={def.id} className={`${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} border-b border-gray-50`}>
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
                                  <div className="text-[10px] text-gray-400 mt-1 font-bold">-{def.deductionPts} PTS</div>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="text-[10px] font-black text-red-600 uppercase">{def.healthAndSafety}</span>
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
                          <div key={def.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm">
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
    </DashboardLayout>
  )
}

