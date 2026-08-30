"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import AdminDashboardLayout from "@/components/AdminDashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { adminAPI } from "@/lib/api"
import {
  Search,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Building2,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react"

/**
 * Shape below mirrors `transformedInspections` in
 * inspire-backend/controllers/adminController.js -> getAllInspections.
 * Every field rendered on this page is produced there; nothing is invented.
 */
interface AdminInspection {
  _id: string
  id: string
  propertyName: string
  property: { _id?: string; name: string }
  unit: { _id?: string; unitNumber: string }
  inspector: { _id?: string; name: string }
  propertyId: string
  inspectorName: string
  inspectionDate: string
  scheduledDate: string
  score: number
  complianceScore: number
  status: string // "Passed" | "Failed" | "Pending Review" (derived from `result`)
  result?: string
  notes: string
  criticalIssues: number
  nonCriticalIssues: number
  originalStatus: string // raw DB status: scheduled | in-progress | completed | cancelled | pending-review
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

// Raw Inspection.status enum from inspire-backend/models/Inspection.js.
// The `status` query param filters this raw field (NOT the display status below).
const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "pending-review", label: "Pending Review" },
  { value: "cancelled", label: "Cancelled" },
]

const PAGE_LIMIT = 20

/** Colour for the display status the controller returns. */
function statusBadgeClass(status: string) {
  const s = (status || "").toLowerCase()
  if (s === "passed") return "bg-green-50 text-green-700 border-green-200"
  if (s === "failed") return "bg-[#FDECEE] text-[#F84B5F] border-[#F84B5F]/30"
  return "bg-amber-50 text-amber-700 border-amber-200"
}

/** Colour for the raw workflow status (`originalStatus`). */
function workflowBadgeClass(status: string) {
  const s = (status || "").toLowerCase()
  if (s === "completed") return "bg-cyan-50 text-[#006795] border-cyan-100"
  if (s === "in-progress") return "bg-blue-50 text-blue-700 border-blue-100"
  if (s === "cancelled") return "bg-gray-100 text-gray-500 border-gray-200"
  return "bg-gray-50 text-gray-600 border-gray-200"
}

function formatWorkflow(status: string) {
  if (!status) return "—"
  return status
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ")
}

function formatDate(value: string) {
  if (!value) return "—"
  // The backend sends inspectionDate as a date-only string (YYYY-MM-DD). Passing that to
  // new Date() parses it as UTC midnight, which then renders as the previous day for anyone
  // west of UTC. Build the date in local time from the parts instead.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const d = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function AllInspectionsPage() {
  const [inspections, setInspections] = useState<AdminInspection[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)

  // Debounce the search box so typing drives the backend `search` param.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    fetchInspections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page])

  const fetchInspections = async () => {
    try {
      setLoading(true)
      setError(false)

      const response = await adminAPI.getInspections({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: PAGE_LIMIT,
      })

      if (response.success) {
        setInspections(response.inspections || [])
        setPagination(
          response.pagination || { page, limit: PAGE_LIMIT, total: 0, pages: 0 }
        )
      } else {
        setInspections([])
        setError(true)
        toast.error("Failed to load inspections", { position: "top-right" })
      }
    } catch (err: any) {
      console.error("Error fetching inspections:", err)
      setInspections([])
      setError(true)
      toast.error(err?.message || "Failed to load inspections", {
        position: "top-right",
      })
    } finally {
      setLoading(false)
    }
  }

  // Tiles. `total` is system-wide (pagination.total). Completed / pending /
  // critical are counted from the rows actually loaded on this page, because the
  // endpoint returns no system-wide status breakdown. Labelled as such in the UI.
  const pageStats = useMemo(() => {
    const completed = inspections.filter(
      (i) => (i.originalStatus || "").toLowerCase() === "completed"
    ).length
    const pending = inspections.filter((i) => {
      const s = (i.originalStatus || "").toLowerCase()
      return s === "scheduled" || s === "in-progress" || s === "pending-review"
    }).length
    const critical = inspections.reduce((sum, i) => sum + (i.criticalIssues || 0), 0)
    return { completed, pending, critical }
  }, [inspections])

  const showingFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const showingTo = (pagination.page - 1) * pagination.limit + inspections.length
  const isEmpty = !loading && inspections.length === 0

  const tiles = [
    {
      label: "Total Inspections",
      value: pagination.total,
      caption: "System-wide",
      icon: ClipboardList,
      iconClass: "bg-cyan-50 text-[#006795]",
    },
    {
      label: "Completed",
      value: pageStats.completed,
      caption: "On this page",
      icon: CheckCircle2,
      iconClass: "bg-green-50 text-green-700",
    },
    {
      label: "Pending",
      value: pageStats.pending,
      caption: "On this page",
      icon: Clock,
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      label: "Critical Deficiencies",
      value: pageStats.critical,
      caption: "On this page",
      icon: AlertTriangle,
      iconClass: "bg-[#FDECEE] text-[#F84B5F]",
    },
  ]

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6 text-black">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">All Inspections</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                System-wide inspections across every inspector.
              </p>
            </div>
            <Button
              onClick={fetchInspections}
              className="bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Summary tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {tiles.map((tile) => {
              const Icon = tile.icon
              return (
                <Card key={tile.label} className="bg-white rounded-lg shadow-sm p-4 md:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                        {tile.label}
                      </p>
                      <p className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                        {loading ? "—" : tile.value}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">{tile.caption}</p>
                    </div>
                    <div className={`p-2 rounded-lg shrink-0 ${tile.iconClass}`}>
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Filters */}
          <Card className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by inspection ID, property, property ID or inspector..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006795]/30 focus:border-[#006795]"
                />
              </div>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
                className="w-full md:w-56 px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006795]/30 focus:border-[#006795]"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {search && (
              <p className="text-[11px] text-gray-400 font-semibold mt-3">
                Note: the server applies search within the current page of results, so the total
                count above is unfiltered.
              </p>
            )}
          </Card>

          {/* Table + cards */}
          <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2 bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-gray-900">Inspections</h3>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {loading ? "Loading" : `${inspections.length} shown`}
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading inspections...</div>
              ) : error ? (
                <div className="p-8 text-center text-gray-500">
                  Could not load inspections. Please try again.
                </div>
              ) : isEmpty ? (
                <div className="p-8 text-center text-gray-500">No inspections found.</div>
              ) : (
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-[#F8FAFC] border-b">
                    <tr>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Inspection ID
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Property
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Unit
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Inspector
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Critical
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Non-Critical
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Score
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {inspections.map((inspection) => (
                      <tr key={inspection._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-6 text-center">
                          <span className="bg-cyan-50 text-[#006795] font-black px-3 py-1.5 rounded-lg text-xs shadow-sm border border-cyan-100/50 inline-block">
                            {inspection.id}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <p className="font-bold text-sm text-gray-900">{inspection.propertyName}</p>
                          <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                            {inspection.propertyId}
                          </p>
                        </td>
                        <td className="py-5 px-6 text-center font-bold text-xs text-gray-500">
                          {inspection.unit?.unitNumber}
                        </td>
                        <td className="py-5 px-6 text-center font-bold text-sm text-gray-900">
                          {inspection.inspector?.name || inspection.inspectorName}
                        </td>
                        <td className="py-5 px-6 text-center font-bold text-xs text-gray-500">
                          {formatDate(inspection.inspectionDate)}
                        </td>
                        <td className="py-5 px-6 text-center">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border inline-block whitespace-nowrap ${statusBadgeClass(
                              inspection.status
                            )}`}
                          >
                            {inspection.status}
                          </span>
                          <span
                            className={`mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight border inline-block whitespace-nowrap ${workflowBadgeClass(
                              inspection.originalStatus
                            )}`}
                          >
                            {formatWorkflow(inspection.originalStatus)}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-center">
                          {inspection.criticalIssues > 0 ? (
                            <span className="bg-[#FDECEE] text-[#F84B5F] border border-[#F84B5F]/30 px-3 py-1.5 rounded-lg text-xs font-black inline-flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {inspection.criticalIssues}
                            </span>
                          ) : (
                            <span className="text-gray-300 font-black text-sm">0</span>
                          )}
                        </td>
                        <td className="py-5 px-6 text-center">
                          {inspection.nonCriticalIssues > 0 ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-black inline-block">
                              {inspection.nonCriticalIssues}
                            </span>
                          ) : (
                            <span className="text-gray-300 font-black text-sm">0</span>
                          )}
                        </td>
                        <td className="py-5 px-6 text-center font-black text-gray-900 text-sm">
                          {inspection.score ?? 0}
                        </td>
                        <td className="py-5 px-6 text-center">
                          <Link
                            href={`/admin/inspection/summary?propertyId=${inspection.property?._id || inspection._id}`}
                            className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1 whitespace-nowrap text-white bg-[#006795] hover:bg-[#0A5670]"
                          >
                            View
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile & tablet cards */}
            <div className="md:hidden p-3 space-y-3">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading inspections...</div>
              ) : error ? (
                <div className="p-8 text-center text-gray-500">
                  Could not load inspections. Please try again.
                </div>
              ) : isEmpty ? (
                <div className="p-8 text-center text-gray-500">No inspections found.</div>
              ) : (
                inspections.map((inspection) => (
                  <div
                    key={inspection._id}
                    className="border border-gray-100 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="bg-cyan-50 text-[#006795] font-black px-2.5 py-1 rounded-lg text-[11px] border border-cyan-100/50">
                        {inspection.id}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border whitespace-nowrap ${statusBadgeClass(
                          inspection.status
                        )}`}
                      >
                        {inspection.status}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <p className="flex items-center gap-2 font-bold text-sm text-gray-900">
                        <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{inspection.propertyName}</span>
                      </p>
                      <p className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <User className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {inspection.inspector?.name || inspection.inspectorName}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        {formatDate(inspection.inspectionDate)}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400">
                        {inspection.propertyId} · Unit {inspection.unit?.unitNumber} ·{" "}
                        {formatWorkflow(inspection.originalStatus)}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {inspection.criticalIssues > 0 ? (
                        <span className="bg-[#FDECEE] text-[#F84B5F] border border-[#F84B5F]/30 px-2.5 py-1 rounded-lg text-[11px] font-black inline-flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {inspection.criticalIssues} Critical
                        </span>
                      ) : (
                        <span className="bg-gray-50 text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg text-[11px] font-black">
                          0 Critical
                        </span>
                      )}
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-[11px] font-black">
                        {inspection.nonCriticalIssues || 0} Non-Critical
                      </span>
                      <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-lg text-[11px] font-black">
                        Score {inspection.score ?? 0}
                      </span>
                    </div>

                    <Link
                      href={`/admin/inspection/summary?propertyId=${inspection.property?._id || inspection._id}`}
                      className="mt-3 w-full px-3 py-2 text-xs font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-1 text-white bg-[#006795] hover:bg-[#0A5670]"
                    >
                      View Inspection
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!loading && !error && inspections.length > 0 && (
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F8FAFC]">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Showing {showingFrom}-{showingTo} of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold px-3 py-2 rounded-lg text-xs flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  <span className="text-xs font-bold text-gray-600 px-2">
                    Page {pagination.page} of {pagination.pages || 1}
                  </span>
                  <Button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={pagination.pages ? pagination.page >= pagination.pages : true}
                    className="bg-[#006795] hover:bg-[#0A5670] text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold px-3 py-2 rounded-lg text-xs flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}
