"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyFilter, setPropertyFilter] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [inspectionCount, setInspectionCount] = useState(0)
  const INSPECTION_LIMIT = 15

  const reports = [
    {
      id: "RPT-001",
      property: "Sunset Apartments",
      unit: "101",
      inspector: "Emma Johnson",
      date: "2024-01-15",
      compliance: 88,
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "RPT-002",
      property: "River Heights",
      unit: "205",
      inspector: "Michael Chen",
      date: "2024-01-14",
      compliance: 92,
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "RPT-003",
      property: "Courthouse Apartments",
      unit: "312",
      inspector: "Sarah Williams",
      date: "2024-01-13",
      compliance: 75,
      status: "Under Review",
      payment: "Pending",
    },
    {
      id: "RPT-004",
      property: "Calhoun Homes",
      unit: "A-45",
      inspector: "Emma Johnson",
      date: "2024-01-12",
      compliance: 85,
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "RPT-005",
      property: "STEPHEN'S PARK APA",
      unit: "B-12",
      inspector: "David Martinez",
      date: "2024-01-11",
      compliance: 95,
      status: "Completed",
      payment: "Paid",
    },
    {
      id: "RPT-006",
      property: "Demure St-Hilaire",
      unit: "308",
      inspector: "Emma Johnson",
      date: "2024-01-10",
      compliance: 68,
      status: "Follow-up Required",
      payment: "Pending",
    },
  ]

  const handleApplyFilters = () => {
    toast.info("Applying filters...", { position: "top-right" })
  }

  const handleDownload = (reportId: string) => {
    if (inspectionCount >= INSPECTION_LIMIT) {
      toast.error(`Inspection limit reached (${INSPECTION_LIMIT}/${INSPECTION_LIMIT})`, { position: "top-right" })
      return
    }
    setInspectionCount(inspectionCount + 1)
    toast.success(`Downloading report ${reportId}...`, { position: "top-right" })
  }

  const handleShare = (reportId: string) => {
    if (inspectionCount >= INSPECTION_LIMIT) {
      toast.error(`Inspection limit reached (${INSPECTION_LIMIT}/${INSPECTION_LIMIT})`, { position: "top-right" })
      return
    }
    setInspectionCount(inspectionCount + 1)
    toast.info(`Share report ${reportId} functionality`, { position: "top-right" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700"
      case "Under Review":
        return "bg-blue-100 text-blue-700"
      case "Follow-up Required":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPaymentColor = (payment: string) => {
    return payment === "Paid" ? "text-green-600" : "text-yellow-600"
  }

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return "text-green-600"
    if (compliance >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Inspection Limit Banner */}
          {inspectionCount >= INSPECTION_LIMIT && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800">Inspection limit reached (15/15)</p>
                  <p className="text-xs text-red-700 mt-1">You have reached the maximum number of inspections allowed. No further inspection actions can be performed.</p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">Inspection Reports</h1>
                <p className="text-sm sm:text-base text-gray-600">View and manage all inspection reports</p>
              </div>
              <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-200">
                <p className="text-xs font-medium text-blue-700">Inspections Used</p>
                <p className="text-lg font-bold text-blue-900">{inspectionCount}/{INSPECTION_LIMIT}</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Search Reports
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by property, unit, or inspector..."
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Property Name
                </label>
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm sm:text-base"
                >
                  <option value="">All Properties</option>
                  <option value="sunset">Sunset Apartments</option>
                  <option value="river">River Heights</option>
                  <option value="courthouse">Courthouse Apartments</option>
                  <option value="calhoun">Calhoun Homes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm sm:text-base"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 3 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm sm:text-base"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="review">Under Review</option>
                  <option value="followup">Follow-up Required</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-3 sm:mt-4">
              <Button
                onClick={handleApplyFilters}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 bg-[#0D6A8D] hover:bg-[#0a5670] text-white text-sm sm:text-base"
              >
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {reports.map((report) => (
                <div key={report.id} className="border-b last:border-b-0 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-sm font-bold text-gray-900">{report.id}</span>
                      <h3 className="text-base font-semibold text-gray-800 mt-1">{report.property}</h3>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Unit:</span>
                      <span className="ml-1 font-medium text-gray-900">{report.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-1 font-medium text-gray-900">{report.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Inspector:</span>
                      <span className="ml-1 font-medium text-gray-900">{report.inspector}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment:</span>
                      <span className={`ml-1 font-semibold ${getPaymentColor(report.payment)}`}>{report.payment}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500">Compliance:</span>
                      <span className={`ml-1 text-sm font-bold ${getComplianceColor(report.compliance)}`}>
                        {report.compliance}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(report.id)}
                        disabled={inspectionCount >= INSPECTION_LIMIT}
                        className={`p-2 rounded-lg transition-colors ${
                          inspectionCount >= INSPECTION_LIMIT
                            ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-600 hover:text-[#0D6A8D] hover:bg-gray-100'
                        }`}
                        title={inspectionCount >= INSPECTION_LIMIT ? 'Inspection limit reached' : 'Download'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleShare(report.id)}
                        disabled={inspectionCount >= INSPECTION_LIMIT}
                        className={`p-2 rounded-lg transition-colors ${
                          inspectionCount >= INSPECTION_LIMIT
                            ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                            : 'text-gray-600 hover:text-[#0D6A8D] hover:bg-gray-100'
                        }`}
                        title={inspectionCount >= INSPECTION_LIMIT ? 'Inspection limit reached' : 'Share'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Report ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Inspector
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Compliance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{report.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{report.property}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{report.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{report.inspector}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{report.date}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${getComplianceColor(report.compliance)}`}>
                          {report.compliance}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPaymentColor(report.payment)}`}>
                          {report.payment}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(report.id)}
                            disabled={inspectionCount >= INSPECTION_LIMIT}
                            className={`p-2 rounded-lg transition-colors ${
                              inspectionCount >= INSPECTION_LIMIT
                                ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                : 'text-gray-600 hover:text-[#0D6A8D] hover:bg-gray-100'
                            }`}
                            title={inspectionCount >= INSPECTION_LIMIT ? 'Inspection limit reached' : 'Download'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleShare(report.id)}
                            disabled={inspectionCount >= INSPECTION_LIMIT}
                            className={`p-2 rounded-lg transition-colors ${
                              inspectionCount >= INSPECTION_LIMIT
                                ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                : 'text-gray-600 hover:text-[#0D6A8D] hover:bg-gray-100'
                            }`}
                            title={inspectionCount >= INSPECTION_LIMIT ? 'Inspection limit reached' : 'Share'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
                  <span className="font-medium">6</span> results
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" disabled className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm">
                    Previous
                  </Button>
                  <Button variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0D6A8D] text-white hover:bg-[#0a5670] text-sm">
                    1
                  </Button>
                  <Button variant="outline" disabled className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
