"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import ManagementDashboardLayout from "@/components/ManagementDashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { propertiesAPI, authAPI, paymentsAPI } from "@/lib/api"
import { Download, FileText, Calendar, MapPin, User, CheckCircle2, Loader2, Trash2, AlertCircle, Building2, RefreshCw, Lock, FileSpreadsheet, Clock } from "lucide-react"
import { toast } from "react-toastify"

interface Property {
  _id: string
  name: string
  address: string
  city?: string
  state?: string
  buildings?: number
  units?: number
  createdAt: string
  buildingDetails?: any[]
  status?: string // Add status field for hold/active state
}

interface Inspection {
  _id: string
  property: {
    _id: string
    name: string
    address: string
    city?: string
    state?: string
  }
  inspector: {
    _id: string
    fullName: string
  }
  status: string
  inspectionDate: string
  createdAt: string
  findings?: any[]
  deficiencies?: any[]
}

interface PropertyWithInspection extends Property {
  inspection?: Inspection
  hasInspection: boolean
  isUnlocked?: boolean
}

// Deduplicate findings by content to get the real count
function getUniqueDeficiencyCount(findings: any[] | undefined): number {
  if (!findings || findings.length === 0) return 0;
  const seen = new Set<string>();
  let count = 0;
  findings.forEach((f: any) => {
    const areaStr = String(f.area || f.subCategory || f.category || '').toLowerCase();
    const titleStr = String(f.title || f.deficiencyName || f.name || '').toLowerCase();
    const descStr = String(f.description || f.details || f.deficiencyDetails || '').toLowerCase();
    const bldgStr = String(f.building || f.buildingName || '').toLowerCase();
    const unitStr = String(f.unit || f.unitNumber || '').toLowerCase();
    if (!titleStr && !descStr) return;
    const key = `${areaStr}|${bldgStr}|${unitStr}|${titleStr}|${descStr}`;
    if (!seen.has(key)) {
      seen.add(key);
      count++;
    }
  });
  return count;
}

export default function InspectionStatusPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<PropertyWithInspection[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [propertyProgress, setPropertyProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      const token = localStorage.getItem('token')
      
      const [userRes, propertiesRes, inspectionsRes] = await Promise.all([
        authAPI.getMe(),
        propertiesAPI.getAll(),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/inspections`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ])

      if (userRes.success) {
        setUser(userRes.user)
      }

      let allProperties: Property[] = []
      if (propertiesRes.success) {
        allProperties = propertiesRes.properties
      }

      let completedInspections: Inspection[] = []
      if (inspectionsRes.ok) {
        const data = await inspectionsRes.json()
        if (data.success) {
          completedInspections = data.inspections;
        }
      }

      // Fetch progress records to calculate accurate progress
      const progressMap = await fetchProgress(allProperties)
      setPropertyProgress(progressMap)

      // Map properties with their inspection status (preserve status field from API)
      const mappedProperties: PropertyWithInspection[] = allProperties.map(property => {
        const inspection = completedInspections.find(
          insp => {
            // Safety check: ensure insp.property exists
            if (!insp || !insp.property || !insp.property._id) return false
            return insp.property._id === property._id || insp.property._id.toString() === property._id.toString()
          }
        )
        
        // Mark as complete ONLY if progress has reached EXACTLY 100%
        // If progress data exists, use it as the source of truth
        // Only fall back to DB inspection status if no progress data is available
        const progressValue = progressMap[property._id]
        const progressComplete = progressValue === 100
        const hasCompletedInspection = inspection && inspection.status === 'completed'
        const isComplete = progressValue !== undefined ? progressComplete : !!hasCompletedInspection

        console.log(`Property ${property.name}:`, {
          hasInspection: inspection ? 'YES' : 'NO',
          inspectionStatus: inspection?.status,
          progress: progressMap[property._id],
          isComplete
        })

        return {
          ...property, // This includes the status field if it exists
          inspection,
          hasInspection: isComplete,
          isUnlocked: false
        }
      })

      // Fetch payment/unlock status for properties that have a completed inspection
      const propertiesWithStatus = await Promise.all(
        mappedProperties.map(async (property) => {
          if (property.hasInspection && property.inspection?._id) {
            try {
              const unlockData = await paymentsAPI.checkReportUnlock(property.inspection._id)
              return {
                ...property,
                isUnlocked: !!unlockData?.isReportUnlocked
              }
            } catch (err) {
              console.error(`Error checking unlock status for ${property._id}:`, err)
            }
          }
          return property
        })
      )

      // Sort: properties without inspections first (red/amber), then with inspections (green)
      propertiesWithStatus.sort((a, b) => {
        if (a.hasInspection === b.hasInspection) return 0
        return a.hasInspection ? 1 : -1
      })

      setProperties(propertiesWithStatus)
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error("Failed to load properties")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchProgress = async (propertyList: Property[]) => {
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'
      const response = await fetch(`${API_URL}/api/inspections/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success && Array.isArray(data.progress)) {
        const progressMap: Record<string, number> = {}
        
        propertyList.forEach(prop => {
            const propId = prop._id
            const propProgress = data.progress.filter((p: any) => 
                p.propertyId === propId || p.propertyId?._id === propId
            )
            
            const uniqueTasks = new Set()
            propProgress.forEach((p: any) => {
                const type = String(p.inspectionType || '').toLowerCase()
                const buildingId = p.buildingId || 'B1'
                if (type.startsWith('unit_')) {
                    uniqueTasks.add(`${buildingId}_unit_${p.unitId}`)
                } else if (type === 'inside' || type === 'outside') {
                    uniqueTasks.add(`${buildingId}_${type}`)
                }
            })
            
            const propAny = prop as any
            const actualUnitsForInspection = prop.buildingDetails && prop.buildingDetails.length > 0
                ? prop.buildingDetails.reduce((sum: number, b: any) => sum + (b.unitsForInspection || 0), 0)
                : propAny.calculatedUnits !== undefined ? propAny.calculatedUnits : (prop.units ?? 0)
            
            const totalTasks = ((prop.buildings || 0) * 2) + actualUnitsForInspection
            
            if (totalTasks > 0) {
                progressMap[propId] = Math.min(100, Math.round((uniqueTasks.size / totalTasks) * 100))
            } else {
                progressMap[propId] = 0
            }
        })
        return progressMap
      }
    } catch (e) {
      console.error('Error fetching progress:', e)
    }
    return {}
  }

  const handleRefresh = () => {
    toast.info("Refreshing inspection status...", { position: "top-right" })
    fetchData(true)
  }

  const handleDownloadPDF = async (property: PropertyWithInspection) => {
    if (!property.inspection) {
      toast.error("No inspection completed for this property")
      return
    }

    setDownloadingId(property._id)
    try {
      toast.info("Generating PDF report...", { position: "top-right" })

      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/inspections/${property.inspection._id}/nspire-pdf?includeImages=true`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const contentType = response.headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to generate PDF')
        }

        if (data.html) {
          console.log('Received HTML fallback from backend')
          toast.info("Opening report for printing...", { position: "top-right" })

          const printWindow = window.open('', '_blank')
          if (printWindow) {
            printWindow.document.write(data.html)
            printWindow.document.close()
            printWindow.onload = () => {
              printWindow.focus()
              printWindow.print()
            }
          } else {
            const htmlBlob = new Blob([data.html], { type: 'text/html' });
            const htmlUrl = window.URL.createObjectURL(htmlBlob);
            const htmlLink = document.createElement('a');
            htmlLink.href = htmlUrl;
            htmlLink.download = (data.filename || `NSPIRE_Report_${property.name.replace(/[^a-zA-Z0-9]/g, '_')}.html`).replace(/\.pdf$/i, '.html');
            document.body.appendChild(htmlLink);
            htmlLink.click();
            document.body.removeChild(htmlLink);
            window.URL.revokeObjectURL(htmlUrl);
            toast.warning('Popup blocked. Downloaded HTML backup instead—open it and print to PDF.', { position: 'top-right' });
          }
          return
        }
      }

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `NSPIRE_Report_${property.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("PDF downloaded successfully", { position: "top-right" })
    } catch (error: any) {
      console.error('PDF download error:', error)
      toast.error(`Failed to download PDF: ${error.message}`, { position: "top-right" })
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDownloadExcel = async (property: PropertyWithInspection) => {
    if (!property.inspection) {
      toast.error("No inspection completed for this property")
      return
    }

    setDownloadingId(property._id + '_excel')
    try {
      toast.info("Generating Excel report...", { position: "top-right" })

      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/inspections/${property.inspection._id}/nspire-excel`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate Excel')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `NSPIRE_Report_${property.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Excel downloaded successfully", { position: "top-right" })
    } catch (error: any) {
      console.error('Excel download error:', error)
      toast.error(`Failed to download Excel: ${error.message}`, { position: "top-right" })
    } finally {
      setDownloadingId(null)
    }
  }

  const handleStartInspection = (property: PropertyWithInspection) => {
    try {
      // Navigate to property-details page to select building/unit properly
      // This ensures all required URL params are set correctly
      console.log('Navigating to property details:', property._id)
      router.push(`/management/dashboard/property-details/${property._id}`)
    } catch (error) {
      console.error('Navigation error:', error)
      toast.error('Failed to navigate to property details', { position: 'top-right' })
    }
  }

  const completedCount = properties.filter(p => p.hasInspection).length
  const pendingCount = properties.filter(p => !p.hasInspection).length
  const thisMonthCount = properties.filter(p => {
    if (!p.inspection) return false
    const inspDate = new Date(p.inspection.inspectionDate)
    const now = new Date()
    return inspDate.getMonth() === now.getMonth() && inspDate.getFullYear() === now.getFullYear()
  }).length

  if (loading) {
    return (
      <ManagementDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
        </div>
      </ManagementDashboardLayout>
    )
  }

  return (
    <ManagementDashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 truncate">Inspection Status</h1>
            <p className="text-sm sm:text-base text-gray-600">View all properties and their inspection status</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wide">Total Properties</p>
                <p className="text-2xl sm:text-3xl font-black text-blue-900 mt-1 sm:mt-2">{properties.length}</p>
              </div>
              <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-green-600 uppercase tracking-wide">Completed</p>
                <p className="text-2xl sm:text-3xl font-black text-green-900 mt-1 sm:mt-2">{completedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wide">Pending</p>
                <p className="text-2xl sm:text-3xl font-black text-red-900 mt-1 sm:mt-2">{pendingCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-purple-600 uppercase tracking-wide">This Month</p>
                <p className="text-2xl sm:text-3xl font-black text-purple-900 mt-1 sm:mt-2">{thisMonthCount}</p>
              </div>
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Add a property to start inspections.</p>
            <Button
              onClick={() => router.push('/management/dashboard')}
              className="bg-[#006795] hover:bg-blue-700 text-white text-sm sm:text-base"
            >
              Add Property
            </Button>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {properties.map((property) => (
              <Card 
                key={property._id} 
                className={`p-4 sm:p-6 hover:shadow-lg transition-all overflow-hidden ${
                  property.hasInspection 
                    ? 'border-2 border-green-500 bg-green-50/30' 
                    : propertyProgress[property._id] > 0
                      ? 'border-2 border-amber-500 bg-amber-50/30'
                      : 'border-2 border-red-500 bg-red-50/30'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        property.hasInspection ? 'bg-green-100' : propertyProgress[property._id] > 0 ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        {property.hasInspection ? (
                          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        ) : propertyProgress[property._id] > 0 ? (
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate min-w-0">
                            {property.name}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold w-fit flex-shrink-0 whitespace-nowrap ${
                            property.hasInspection 
                              ? 'bg-green-100 text-green-800' 
                              : propertyProgress[property._id] > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {property.hasInspection 
                              ? 'Completed' 
                              : propertyProgress[property._id] > 0 
                                ? `In Progress (${propertyProgress[property._id]}%)` 
                                : 'Pending'}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1 min-w-0">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-none">{property.address}</span>
                            {property.city && <span className="hidden sm:inline whitespace-nowrap">, {property.city}</span>}
                            {property.state && <span className="hidden sm:inline whitespace-nowrap">, {property.state}</span>}
                          </div>
                          {property.inspection && (
                            <>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="whitespace-nowrap">{new Date(property.inspection.inspectionDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1 min-w-0">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate max-w-[150px] sm:max-w-none">{property.inspection.inspector.fullName}</span>
                              </div>
                            </>
                          )}
                        </div>
                        {property.inspection && getUniqueDeficiencyCount(property.inspection.findings || property.inspection.deficiencies) > 0 ? (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 whitespace-nowrap">
                              {getUniqueDeficiencyCount(property.inspection.findings || property.inspection.deficiencies)} Deficiencies
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
 
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 flex-shrink-0">
                    {property.hasInspection ? (
                      property.isUnlocked ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => handleDownloadPDF(property)}
                            disabled={downloadingId === property._id || downloadingId === property._id + '_excel'}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap"
                          >
                            {downloadingId === property._id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                                <span className="hidden sm:inline">Generating...</span>
                                <span className="sm:hidden">Loading...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 flex-shrink-0" />
                                <span className="hidden sm:inline">Download PDF</span>
                                <span className="sm:hidden">PDF</span>
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleDownloadExcel(property)}
                            disabled={downloadingId === property._id || downloadingId === property._id + '_excel'}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap"
                          >
                            {downloadingId === property._id + '_excel' ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                                <span className="hidden sm:inline">Generating...</span>
                                <span className="sm:hidden">Loading...</span>
                              </>
                            ) : (
                              <>
                                <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
                                <span className="hidden sm:inline">Download Excel</span>
                                <span className="sm:hidden">Excel</span>
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={async () => {
                            if (property.inspection?._id) {
                              try {
                                toast.info('Initiating payment...', { position: 'top-right' })
                                const data = await paymentsAPI.createStripeCheckoutSession(property.inspection._id);
                                if (data?.isReportUnlocked || data?.alreadyUnlocked) {
                                  toast.success('Report is already unlocked.', { position: 'top-right' })
                                  fetchData(true)
                                  return
                                }
                                if (!data?.checkoutUrl) throw new Error('Stripe checkout URL is missing.')
                                window.location.href = data.checkoutUrl
                              } catch (error: any) {
                                console.error('Stripe checkout start error:', error)
                                toast.error(`Unable to start payment: ${error.message}`, { position: 'top-right' })
                              }
                            } else {
                              toast.error("Inspection details not found")
                            }
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap"
                        >
                          <Lock className="w-4 h-4 flex-shrink-0" />
                          <span>Pay to Unlock Report</span>
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleStartInspection(property)}
                        className="flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto whitespace-nowrap bg-[#006795] hover:bg-blue-700 text-white"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span>{(propertyProgress[property._id] || 0) > 0 ? 'Continue Inspection' : 'Start Inspection'}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ManagementDashboardLayout>
  )
}

