"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import AdminDashboardLayout from "@/components/AdminDashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { adminAPI } from "@/lib/api"
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react"

// Shape returned by GET /api/admin/properties (adminController.getAllProperties).
// NOTE: the list endpoint returns `zip`, while create/update SEND `zipCode`.
type AdminProperty = {
  id?: string
  _id?: string
  name?: string
  buildings?: number
  units?: number
  address?: string
  city?: string
  state?: string
  zip?: string
  status?: string
  owner?: { _id?: string; fullName?: string; email?: string } | null
}

type PaginationState = {
  page: number
  limit: number
  total: number
  pages: number
}

type PropertyForm = {
  propertyId: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  buildings: string
  units: string
  status: string
}

// Property.status enum from models/Property.js
const STATUS_OPTIONS = ["active", "inactive", "pending", "ready-for-inspection", "hold"]

const PAGE_SIZE = 10

const EMPTY_FORM: PropertyForm = {
  propertyId: "",
  name: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  buildings: "",
  units: "",
  status: "active",
}

const statusBadgeClass = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "active":
      return "bg-green-50 text-green-700 border-green-100"
    case "inactive":
      return "bg-gray-100 text-gray-600 border-gray-200"
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-100"
    case "ready-for-inspection":
      return "bg-cyan-50 text-[#006795] border-cyan-100"
    case "hold":
      return "bg-red-50 text-[#F84B5F] border-red-100"
    default:
      return "bg-gray-100 text-gray-600 border-gray-200"
  }
}

const ownerLabel = (property: AdminProperty) => {
  const owner = property.owner
  if (!owner || typeof owner !== "object") return "Unassigned"
  return owner.fullName || owner.email || "Unassigned"
}

export default function AdminAllProperties() {
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters -> server query params. Nothing here filters client-side.
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)

  // Modal state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null)
  const [editing, setEditing] = useState<AdminProperty | null>(null)
  const [form, setForm] = useState<PropertyForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Guards against an older in-flight response landing after a newer one.
  const requestRef = useRef(0)

  // Applying a filter always resets to page 1, batched with the filter change so
  // only one request goes out.
  const applySearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  // Debounced search (Enter also submits immediately, see the form below).
  useEffect(() => {
    const timer = setTimeout(() => applySearch(searchInput.trim()), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchProperties = useCallback(async () => {
    const requestId = ++requestRef.current
    try {
      setLoading(true)
      setError(null)
      const response = await adminAPI.getProperties({
        search: search || undefined,
        status: status || undefined,
        page,
        limit: PAGE_SIZE,
      })

      if (requestRef.current !== requestId) return

      if (!response?.success) {
        throw new Error("Failed to load properties")
      }

      setProperties(Array.isArray(response.properties) ? response.properties : [])
      const p = response.pagination || {}
      setPagination({
        page: Number(p.page) || page,
        limit: Number(p.limit) || PAGE_SIZE,
        total: Number(p.total) || 0,
        pages: Number(p.pages) || 0,
      })
    } catch (err: any) {
      if (requestRef.current !== requestId) return
      const message = err?.message || "Failed to load properties"
      setProperties([])
      setPagination({ page: 1, limit: PAGE_SIZE, total: 0, pages: 0 })
      setError(message)
      toast.error(message, { position: "top-right" })
    } finally {
      if (requestRef.current === requestId) setLoading(false)
    }
  }, [search, status, page])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const openCreateModal = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalMode("create")
  }

  const openEditModal = (property: AdminProperty) => {
    setEditing(property)
    setForm({
      propertyId: property.id ? String(property.id) : "",
      name: property.name || "",
      address: property.address || "",
      city: property.city || "",
      state: property.state || "",
      // The list returns `zip`; the update endpoint expects `zipCode`.
      zipCode: property.zip || "",
      buildings: property.buildings === undefined || property.buildings === null ? "" : String(property.buildings),
      units: property.units === undefined || property.units === null ? "" : String(property.units),
      status: property.status || "active",
    })
    setModalMode("edit")
  }

  const closeModal = useCallback(() => {
    setModalMode(null)
    setEditing(null)
    setForm(EMPTY_FORM)
  }, [])

  // Escape closes the modal (but never mid-save).
  useEffect(() => {
    if (!modalMode) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) closeModal()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [modalMode, saving, closeModal])

  const setField = (field: keyof PropertyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toCount = (value: string) => {
    const n = Number(value)
    if (!Number.isFinite(n) || n < 0) return 0
    return Math.floor(n)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Required by models/Property.js: name, address, city, state, zipCode.
    const required: [keyof PropertyForm, string][] = [
      ["name", "Property name"],
      ["address", "Address"],
      ["city", "City"],
      ["state", "State"],
      ["zipCode", "Zip code"],
    ]
    const missing = required.find(([field]) => !String(form[field] || "").trim())
    if (missing) {
      toast.error(`${missing[1]} is required`, { position: "top-right" })
      return
    }

    try {
      setSaving(true)

      if (modalMode === "create") {
        // createProperty SENDS zipCode (the list endpoint returns it as `zip`).
        await adminAPI.createProperty({
          ...(form.propertyId.trim() ? { propertyId: form.propertyId.trim() } : {}),
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zipCode: form.zipCode.trim(),
          ...(form.buildings.trim() ? { buildings: toCount(form.buildings) } : {}),
          ...(form.units.trim() ? { units: toCount(form.units) } : {}),
        })
        toast.success("Property created successfully", { position: "top-right" })
      } else {
        // updateProperty writes by Mongo _id (findByIdAndUpdate), not the display id.
        const targetId = editing?._id
        if (!targetId) {
          throw new Error("This property has no database id and cannot be updated")
        }
        await adminAPI.updateProperty(String(targetId), {
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zipCode: form.zipCode.trim(),
          buildings: toCount(form.buildings),
          units: toCount(form.units),
          status: form.status,
        })
        toast.success("Property updated successfully", { position: "top-right" })
      }

      closeModal()
      await fetchProperties()
    } catch (err: any) {
      toast.error(err?.message || "Failed to save property", { position: "top-right" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (property: AdminProperty) => {
    const targetId = property._id
    if (!targetId) {
      toast.error("This property has no database id and cannot be deleted", { position: "top-right" })
      return
    }

    const name = property.name || "this property"
    const displayId = property.id ? ` (${property.id})` : ""
    const confirmed = window.confirm(
      `Permanently delete "${name}"${displayId}?\n\n` +
        `Owner: ${ownerLabel(property)}\n` +
        `Location: ${[property.address, property.city, property.state, property.zip].filter(Boolean).join(", ") || "n/a"}\n\n` +
        `This is a system-wide admin delete. It removes the property from its owner's account and also deletes every inspection recorded against it. This cannot be undone.`
    )
    if (!confirmed) return

    try {
      setDeletingId(String(targetId))
      await adminAPI.deleteProperty(String(targetId))
      toast.success(`"${name}" deleted`, { position: "top-right" })

      // If that was the last row on a non-first page, step back a page
      // (the page change refetches on its own).
      if (properties.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        await fetchProperties()
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete property", { position: "top-right" })
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = pagination.pages || 0
  const canGoPrev = pagination.page > 1 && !loading
  const canGoNext = totalPages > 0 && pagination.page < totalPages && !loading
  // Clamp to the pages that actually exist. Without this, landing on a page past the end of a
  // shrunken result set renders an inverted range like "Showing 21-15 of 15".
  const safePage = totalPages > 0 ? Math.min(pagination.page, totalPages) : 1
  const rangeStart = pagination.total === 0 ? 0 : (safePage - 1) * pagination.limit + 1
  const rangeEnd = Math.min(safePage * pagination.limit, pagination.total)

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6 text-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#006795]" />
                All Properties
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Every property in the system, across all owners.
              </p>
            </div>
            <Button
              onClick={openCreateModal}
              className="w-full sm:w-auto bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </div>

          {/* Filters */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 gap-0 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <form
                className="relative flex-1"
                onSubmit={(e) => {
                  e.preventDefault()
                  applySearch(searchInput.trim())
                }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name, property ID or address..."
                  className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                />
              </form>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20 md:w-56"
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <Button
                type="button"
                onClick={() => fetchProperties()}
                disabled={loading}
                className="bg-white hover:bg-gray-50 text-[#006795] border border-gray-200 font-semibold px-4 py-2.5 rounded-lg text-sm shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </Card>

          {/* Results */}
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-0 gap-0 py-0">
            <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 bg-[#F8FAFC]">
              <h2 className="text-lg font-bold text-gray-900">System Properties</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {pagination.total} total
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading properties...</div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-[#F84B5F] font-semibold mb-1">{error}</p>
                  <p className="text-gray-500 text-sm">No properties found.</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No properties found.</div>
              ) : (
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-[#F8FAFC] border-b border-gray-100">
                    <tr>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property ID</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</th>
                      <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">City</th>
                      <th className="text-center py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">State</th>
                      <th className="text-center py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Zip</th>
                      <th className="text-center py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Buildings</th>
                      <th className="text-center py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Units</th>
                      <th className="text-center py-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {properties.map((property) => (
                      <tr key={property._id || property.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="bg-cyan-50 text-[#006795] font-black px-3 py-1.5 rounded-lg text-xs border border-cyan-100/50 inline-block max-w-[160px] truncate align-middle">
                            {property.id || "—"}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-sm text-gray-900">{property.name || "—"}</td>
                        <td className="py-4 px-6 text-xs font-semibold text-gray-500">{ownerLabel(property)}</td>
                        <td className="py-4 px-6 text-xs font-semibold text-gray-500 max-w-[200px] truncate">
                          {property.address || "—"}
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-gray-900">{property.city || "—"}</td>
                        <td className="py-4 px-4 text-center text-xs font-semibold text-gray-900">{property.state || "—"}</td>
                        <td className="py-4 px-4 text-center text-xs font-semibold text-gray-500">{property.zip || "—"}</td>
                        <td className="py-4 px-4 text-center font-black text-gray-900 text-sm">{property.buildings ?? 0}</td>
                        <td className="py-4 px-4 text-center font-black text-gray-900 text-sm">{property.units ?? 0}</td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight border ${statusBadgeClass(property.status)}`}
                          >
                            {property.status || "unknown"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(property)}
                              className="p-2 rounded-lg text-[#006795] hover:bg-cyan-50 transition-colors"
                              title={`Edit ${property.name || "property"}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(property)}
                              disabled={deletingId === String(property._id)}
                              className="p-2 rounded-lg text-[#F84B5F] hover:bg-red-50 transition-colors disabled:opacity-40"
                              title={`Delete ${property.name || "property"}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile / tablet cards */}
            <div className="md:hidden p-4 space-y-4">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading properties...</div>
              ) : error ? (
                <div className="p-6 text-center">
                  <p className="text-[#F84B5F] font-semibold mb-1">{error}</p>
                  <p className="text-gray-500 text-sm">No properties found.</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No properties found.</div>
              ) : (
                properties.map((property) => (
                  <Card
                    key={property._id || property.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm gap-0 py-4"
                  >
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="bg-cyan-50 text-[#006795] font-black px-2 py-1 rounded text-[11px] border border-cyan-100/50 truncate max-w-[160px]">
                            {property.id || "—"}
                          </span>
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight border ${statusBadgeClass(property.status)}`}
                          >
                            {property.status || "unknown"}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base truncate">{property.name || "—"}</h3>
                        <p className="text-gray-600 text-sm truncate">{property.address || "—"}</p>
                        <p className="text-gray-400 text-xs mt-1">Owner: {ownerLabel(property)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditModal(property)}
                          className="p-2 rounded-lg text-[#006795] hover:bg-cyan-50 transition-colors"
                          aria-label={`Edit ${property.name || "property"}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(property)}
                          disabled={deletingId === String(property._id)}
                          className="p-2 rounded-lg text-[#F84B5F] hover:bg-red-50 transition-colors disabled:opacity-40"
                          aria-label={`Delete ${property.name || "property"}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-1">City</span>
                        <p className="font-semibold text-gray-900 text-sm">{property.city || "—"}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-1">State</span>
                        <p className="font-semibold text-gray-900 text-sm">{property.state || "—"}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-1">Zip</span>
                        <p className="font-semibold text-gray-900 text-sm">{property.zip || "—"}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-1">Buildings / Units</span>
                        <p className="font-semibold text-gray-900 text-sm">
                          {property.buildings ?? 0} / {property.units ?? 0}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination (server-driven) */}
            <div className="p-4 border-t border-gray-100 bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs font-semibold text-gray-500">
                {pagination.total === 0
                  ? "Showing 0 properties"
                  : `Showing ${rangeStart}-${rangeEnd} of ${pagination.total}`}
                {totalPages > 0 ? ` · Page ${pagination.page} of ${totalPages}` : ""}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={!canGoPrev}
                  className="bg-white hover:bg-gray-50 text-[#006795] border border-gray-200 font-semibold px-3 py-2 rounded-lg text-xs shadow-none flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!canGoNext}
                  className="bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-3 py-2 rounded-lg text-xs shadow-sm flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Create / Edit modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-0 gap-0 py-0">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#F8FAFC] sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === "create" ? "Add New Property" : "Edit Property"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-40"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                    placeholder="Riverside Apartments"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                    placeholder="120 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setField("state", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => setField("zipCode", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    Property ID
                  </label>
                  <input
                    type="text"
                    value={form.propertyId}
                    onChange={(e) => setField("propertyId", e.target.value)}
                    disabled={modalMode === "edit"}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="PROP-001"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    {modalMode === "edit"
                      ? "The property ID cannot be changed after creation."
                      : "Optional, but a unique value is recommended — duplicates are rejected."}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    Buildings
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.buildings}
                    onChange={(e) => setField("buildings", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    Units
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.units}
                    onChange={(e) => setField("units", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                    placeholder="0"
                  />
                </div>

                {modalMode === "edit" && (
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 focus:border-[#006795] focus:outline-none focus:ring-2 focus:ring-[#006795]/20"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {modalMode === "create" && (
                <p className="text-[11px] text-gray-400 mt-4">
                  New properties are created with status <span className="font-bold">active</span> and are owned by the
                  signed-in admin account.
                </p>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-semibold px-5 py-2.5 rounded-lg text-sm shadow-none disabled:opacity-40"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-sm disabled:opacity-40"
                >
                  {saving ? "Saving..." : modalMode === "create" ? "Create Property" : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AdminDashboardLayout>
  )
}
