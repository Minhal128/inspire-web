"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { propertiesAPI, authAPI } from "@/lib/api"
import { toast } from "react-toastify"
import { ChevronLeft, CheckCircle2, Clock, X, ChevronRight, Pencil, Check } from "lucide-react"

// ---- Unit inspection state persistence (localStorage) ----
interface UnitStatus {
    unitName: string
    completed: boolean
    completedAt?: string
}

interface BuildingInspectionState {
    propertyId: string
    buildingId: string
    units: UnitStatus[]
    lastUpdated: string
}

const STORAGE_PREFIX = 'web_unit_inspection_'

function getStorageKey(propertyId: string, buildingId: string) {
    return `${STORAGE_PREFIX}${propertyId}_${buildingId}`
}

function loadBuildingState(propertyId: string, buildingId: string): BuildingInspectionState | null {
    try {
        const raw = localStorage.getItem(getStorageKey(propertyId, buildingId))
        return raw ? JSON.parse(raw) : null
    } catch { return null }
}

function saveBuildingState(state: BuildingInspectionState) {
    localStorage.setItem(getStorageKey(state.propertyId, state.buildingId), JSON.stringify(state))
}

function initBuildingState(propertyId: string, buildingId: string, unitNames: string[]): BuildingInspectionState {
    const existing = loadBuildingState(propertyId, buildingId)
    const units: UnitStatus[] = unitNames.map(name => {
        const prev = existing?.units.find(u => u.unitName === name)
        return prev || { unitName: name, completed: false }
    })
    const state: BuildingInspectionState = { propertyId, buildingId, units, lastUpdated: new Date().toISOString() }
    saveBuildingState(state)
    return state
}

function markUnitCompleted(propertyId: string, buildingId: string, unitName: string) {
    const state = loadBuildingState(propertyId, buildingId)
    if (!state) return
    const unit = state.units.find(u => u.unitName === unitName)
    if (unit) {
        unit.completed = true
        unit.completedAt = new Date().toISOString()
    }
    state.lastUpdated = new Date().toISOString()
    saveBuildingState(state)
}

function getCompletedUnits(propertyId: string, buildingId: string): string[] {
    const state = loadBuildingState(propertyId, buildingId)
    return state?.units.filter(u => u.completed).map(u => u.unitName) || []
}

// Generate unit names for a building
function generateUnitNames(buildingId: string, count: number): string[] {
    const names: string[] = []
    for (let i = 1; i <= count; i++) {
        names.push(`Unit ${String(i).padStart(3, '0')}`)
    }
    return names
}

export default function PropertyDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = params.id as string
    const [property, setProperty] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Unit selection popup state
    const [unitPopupOpen, setUnitPopupOpen] = useState(false)
    const [selectedBuilding, setSelectedBuilding] = useState<{ buildingId: string; totalUnits: number; unitsForInspection: number } | null>(null)
    const [completedUnitsMap, setCompletedUnitsMap] = useState<Record<string, string[]>>({})

    // Editable inspection units per building
    const [editableInspectionUnits, setEditableInspectionUnits] = useState<Record<string, number>>({})

    // Editable column header name
    const [columnHeaderName, setColumnHeaderName] = useState('Building Unique ID')
    const [editColumnHeaderOpen, setEditColumnHeaderOpen] = useState(false)
    const [tempColumnHeaderName, setTempColumnHeaderName] = useState('Building Unique ID')
    const columnHeaderInputRef = useRef<HTMLInputElement>(null)

    // Editable building names (B1 → custom label)
    const [editableBuildingNames, setEditableBuildingNames] = useState<Record<string, string>>({})
    const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null)
    const [tempBuildingName, setTempBuildingName] = useState('')
    const buildingNameInputRef = useRef<HTMLInputElement>(null)

    // Coverage params from query string
    const coverage = searchParams.get('coverage') || '100'
    const calculatedUnitsParam = parseInt(searchParams.get('calculatedUnits') || '0')

    // Load column header name from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(`buildingColHeader_${id}`)
        if (saved) setColumnHeaderName(saved)
        const savedNames = localStorage.getItem(`buildingNames_${id}`)
        if (savedNames) { try { setEditableBuildingNames(JSON.parse(savedNames)) } catch {} }
    }, [id])

    // Focus input when edit modal opens
    useEffect(() => {
        if (editColumnHeaderOpen) {
            setTimeout(() => columnHeaderInputRef.current?.focus(), 50)
        }
    }, [editColumnHeaderOpen])

    const handleSaveColumnHeader = () => {
        const name = tempColumnHeaderName.trim() || 'Building Unique ID'
        setColumnHeaderName(name)
        localStorage.setItem(`buildingColHeader_${id}`, name)
        setEditColumnHeaderOpen(false)
        toast.success('Column name updated!', { position: 'top-right', autoClose: 1500 })
    }

    const handleStartBuildingEdit = (buildingId: string) => {
        setTempBuildingName(editableBuildingNames[buildingId] || buildingId)
        setEditingBuildingId(buildingId)
        setTimeout(() => buildingNameInputRef.current?.focus(), 30)
    }

    const handleSaveBuildingName = (buildingId: string) => {
        const newName = tempBuildingName.trim() || buildingId
        const updated = { ...editableBuildingNames, [buildingId]: newName }
        setEditableBuildingNames(updated)
        localStorage.setItem(`buildingNames_${id}`, JSON.stringify(updated))
        setEditingBuildingId(null)
    }

    const getBuildingDisplayName = (buildingId: string) =>
        editableBuildingNames[buildingId] || buildingId

    useEffect(() => {
        if (id) {
            fetchData()
        }
    }, [id])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [propRes, userRes] = await Promise.all([
                propertiesAPI.getById(id),
                authAPI.getMe()
            ])

            if (propRes.success) {
                setProperty(propRes.property)
            }
            if (userRes.success) {
                setUser(userRes.user)
            }
        } catch (error: any) {
            console.error('Error fetching data:', error)
            toast.error("Failed to load details")
        } finally {
            setLoading(false)
        }
    }

    // Total inspection units (fixed, must not change)
    const totalInspectionUnits = useMemo(() => {
        if (!property) return 0
        return calculatedUnitsParam || property.units || 1
    }, [property, calculatedUnitsParam])

    // Calculate initial buildings with unit distribution
    const initialBuildings = useMemo(() => {
        if (!property) return []

        const totalBuildings = property.buildings || 1
        const totalUnits = property.units || 1
        const unitsToInspect = calculatedUnitsParam || totalUnits

        // Distribute total units across buildings
        const baseTotalPerBuilding = Math.floor(totalUnits / totalBuildings)
        const remainderTotal = totalUnits % totalBuildings

        // Distribute inspection units across buildings
        const baseInspectionPerBuilding = Math.floor(unitsToInspect / totalBuildings)
        const remainderInspection = unitsToInspect % totalBuildings

        const rows = []
        for (let i = 0; i < totalBuildings; i++) {
            rows.push({
                buildingId: `B${i + 1}`,
                totalUnits: baseTotalPerBuilding + (i < remainderTotal ? 1 : 0),
                unitsForInspection: baseInspectionPerBuilding + (i < remainderInspection ? 1 : 0),
            })
        }
        return rows
    }, [property, calculatedUnitsParam])

    // Initialize editable inspection units from computed defaults
    useEffect(() => {
        if (initialBuildings.length > 0 && Object.keys(editableInspectionUnits).length === 0) {
            const map: Record<string, number> = {}
            initialBuildings.forEach(b => {
                map[b.buildingId] = b.unitsForInspection
            })
            setEditableInspectionUnits(map)
        }
    }, [initialBuildings])

    // Final buildings array that uses editable inspection units
    const buildings = useMemo(() => {
        return initialBuildings.map(b => ({
            ...b,
            unitsForInspection: editableInspectionUnits[b.buildingId] ?? b.unitsForInspection,
        }))
    }, [initialBuildings, editableInspectionUnits])

    // Handler: when user edits a building's unit-for-inspection value
    const handleInspectionUnitChange = (buildingId: string, newValue: number) => {
        const totalBuildings = initialBuildings.length
        if (totalBuildings === 0) return

        const building = initialBuildings.find(b => b.buildingId === buildingId)
        if (!building) return

        // Clamp: min 0, max = total inspection units (user can assign all to one building)
        const clampedValue = Math.max(0, Math.min(newValue, totalInspectionUnits))

        // Current editable map
        const currentMap = { ...editableInspectionUnits }
        const oldValue = currentMap[buildingId] ?? building.unitsForInspection
        const delta = clampedValue - oldValue

        if (delta === 0) return

        // Set new value for this building
        currentMap[buildingId] = clampedValue

        // Redistribute the delta across other buildings to maintain the total
        let remaining = -delta // amount we need to distribute to others
        const otherBuildingIds = initialBuildings
            .filter(b => b.buildingId !== buildingId)
            .map(b => b.buildingId)

        // Sort buildings: when reducing others (delta > 0), take from those with the most first
        // When adding to others (delta < 0), give to those with the least first
        if (remaining > 0) {
            // Need to add units to other buildings (current building was reduced)
            otherBuildingIds.sort((a, b) => (currentMap[a] ?? 0) - (currentMap[b] ?? 0))
        } else {
            // Need to remove units from other buildings (current building was increased)
            otherBuildingIds.sort((a, b) => (currentMap[b] ?? 0) - (currentMap[a] ?? 0))
        }

        for (const otherId of otherBuildingIds) {
            if (remaining === 0) break
            const otherBuilding = initialBuildings.find(b => b.buildingId === otherId)!
            const otherCurrent = currentMap[otherId] ?? otherBuilding.unitsForInspection

            if (remaining > 0) {
                // Add units: no upper cap (inspection units can exceed building's default total)
                const toAdd = remaining
                currentMap[otherId] = otherCurrent + toAdd
                remaining -= toAdd
            } else {
                // Remove units: cap at 0 (can't go negative)
                const maxCanRemove = otherCurrent
                const toRemove = Math.min(-remaining, maxCanRemove)
                currentMap[otherId] = otherCurrent - toRemove
                remaining += toRemove
            }
        }

        // If we couldn't fully redistribute (edge case), revert the change
        if (remaining !== 0) {
            toast.error("Cannot redistribute units: some buildings would exceed their limits", { position: "top-right" })
            return
        }

        setEditableInspectionUnits(currentMap)
    }

    // Load completed units for all buildings
    const refreshCompletedUnits = useCallback(() => {
        if (!property || buildings.length === 0) return
        const propId = property._id || id
        const map: Record<string, string[]> = {}
        buildings.forEach(b => {
            const unitNames = generateUnitNames(b.buildingId, b.unitsForInspection)
            initBuildingState(propId, b.buildingId, unitNames)
            map[b.buildingId] = getCompletedUnits(propId, b.buildingId)
        })
        setCompletedUnitsMap(map)
    }, [property, buildings, id])

    useEffect(() => {
        refreshCompletedUnits()
    }, [refreshCompletedUnits])

    // Also refresh when window regains focus (coming back from inspection)
    useEffect(() => {
        const handleFocus = () => refreshCompletedUnits()
        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [refreshCompletedUnits])

    // Check for returning from inspection (localStorage flag)
    useEffect(() => {
        const returnFlag = localStorage.getItem('inspectionReturnToProperty')
        if (returnFlag) {
            const data = JSON.parse(returnFlag)
            localStorage.removeItem('inspectionReturnToProperty')
            // Mark the unit as completed
            if (data.propertyId && data.buildingId && data.unitName) {
                markUnitCompleted(data.propertyId, data.buildingId, data.unitName)
                refreshCompletedUnits()
                toast.success(`${data.unitName} inspection completed!`, { position: "top-right" })
            }
        }
    }, [refreshCompletedUnits])

    const getCoverageLabel = () => {
        if (coverage === '100') return '100% - All Units'
        if (coverage === '50') return '50% - Half Units'
        if (coverage === 'random') return 'Random Sample'
        return '-'
    }

    const handleBuildingClick = (building: typeof buildings[0]) => {
        const propId = property._id || id
        // Store column header name so inspection-category can read it
        localStorage.setItem(`buildingColHeader_${propId}`, columnHeaderName)
        // Store custom building display name
        const displayName = getBuildingDisplayName(building.buildingId)
        localStorage.setItem(`buildingDisplayName_${propId}_${building.buildingId}`, displayName)
        router.push(
            `/dashboard/inspection-category/${propId}?building=${building.buildingId}&totalUnits=${building.unitsForInspection}&coverage=${coverage}`
        )
    }

    const handleStartUnitInspection = (buildingId: string, unitName: string) => {
        const propId = property._id || id
        const completed = completedUnitsMap[buildingId] || []

        if (completed.includes(unitName)) {
            // Unit already inspected - ask if they want to re-inspect
            if (!confirm(`${unitName} has already been inspected. Do you want to re-inspect it?`)) {
                return
            }
        }

        // Store context for the inspection flow
        localStorage.setItem('currentInspectionUnit', JSON.stringify({
            propertyId: propId,
            buildingId,
            unitName,
            propertyDetailsUrl: window.location.href
        }))

        toast.success(`Starting inspection for ${buildingId} → ${unitName}`, { position: "top-right" })
        router.push(`/dashboard/inspection-category/${property._id}?building=${buildingId}&unit=${encodeURIComponent(unitName)}&units=1`)
    }

    const getCompletedCount = (buildingId: string) => {
        return (completedUnitsMap[buildingId] || []).length
    }

    const isAllCompleted = (building: typeof buildings[0]) => {
        return getCompletedCount(building.buildingId) >= building.unitsForInspection
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8]"></div>
                </div>
            </DashboardLayout>
        )
    }

    if (!property) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-gray-500 font-bold">Property not found.</div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 pr-4">
                        <span className="text-sm font-bold text-gray-900">{user?.fullName || "Guest User"}</span>
                        <div className="w-2.5 h-2.5 border-2 border-gray-400 rotate-45 border-t-0 border-l-0 -mt-1 ml-1" />
                    </div>
                </div>

                <h1 className="text-xl font-black text-gray-900 mb-6 px-1 tracking-tight">Property Details</h1>

                <Card className="bg-[#F1F7FE] border-none shadow-none p-8 mb-12 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-12">
                        <div className="space-y-1">
                            <span className="text-sm font-black text-gray-900">Property ID: </span>
                            <span className="text-sm text-[#1A73E8] font-black">{property.propertyId || property._id?.slice(-8).toUpperCase()}</span>
                            <div className="mt-1">
                                <span className="text-sm font-black text-gray-900">State: </span>
                                <span className="text-sm text-gray-600 font-bold">{property.state}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm font-black text-gray-900">Zip: </span>
                            <span className="text-sm text-gray-600 font-bold pl-4">{property.zipCode}</span>
                            <div className="mt-1">
                                <span className="text-sm font-black text-gray-900">Address: </span>
                                <span className="text-sm text-gray-600 font-bold">{property.address}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm font-black text-gray-900 block">No. of Building: </span>
                            <span className="text-sm text-gray-900 font-black">{property.buildings || 1}</span>
                            <div className="mt-1">
                                <span className="text-sm font-black text-gray-900">Selection: </span>
                                <span className="text-sm text-gray-600 font-bold">{getCoverageLabel()}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm font-black text-gray-900">Property Name: </span>
                            <span className="text-sm text-gray-600 font-bold">{property.name}</span>
                            <div className="mt-1">
                                <span className="text-sm font-black text-gray-900">City: </span>
                                <span className="text-sm text-gray-600 font-bold pl-4">{property.city}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <h2 className="text-xl font-black text-gray-900 mb-6 px-1 tracking-tight">Building</h2>

                {/* Edit Column Header Modal */}
                {editColumnHeaderOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b">
                                <h3 className="text-base font-bold text-gray-900">Edit Column Name</h3>
                                <button onClick={() => setEditColumnHeaderOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Column Name</label>
                                <input
                                    ref={columnHeaderInputRef}
                                    type="text"
                                    value={tempColumnHeaderName}
                                    onChange={(e) => setTempColumnHeaderName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveColumnHeader()}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent text-sm"
                                    placeholder="Building Unique ID"
                                />
                            </div>
                            <div className="flex gap-3 p-5 border-t bg-gray-50">
                                <button
                                    onClick={() => setEditColumnHeaderOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveColumnHeader}
                                    className="flex-1 px-4 py-3 bg-[#1A73E8] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-8 text-xs font-black text-gray-900 uppercase tracking-widest">
                                    <span className="inline-flex items-center gap-2">
                                        {columnHeaderName}
                                        <button
                                            onClick={() => { setTempColumnHeaderName(columnHeaderName); setEditColumnHeaderOpen(true) }}
                                            className="p-1 rounded hover:bg-blue-50 text-[#1A73E8] transition-colors"
                                            title="Edit column name"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                </th>
                                <th className="text-center py-4 px-8 text-xs font-black text-gray-900 uppercase tracking-widest">Total Units</th>
                                <th className="text-center py-4 px-8 text-xs font-black text-gray-900 uppercase tracking-widest">Unit for Inspection</th>
                                <th className="text-center py-4 px-8 text-xs font-black text-gray-900 uppercase tracking-widest">Progress</th>
                                <th className="py-4 px-8 w-64"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {buildings.map((building) => {
                                const completed = getCompletedCount(building.buildingId)
                                const allDone = isAllCompleted(building)
                                return (
                                    <tr key={building.buildingId} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-6 px-8">
                                            {editingBuildingId === building.buildingId ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        ref={buildingNameInputRef}
                                                        value={tempBuildingName}
                                                        onChange={e => setTempBuildingName(e.target.value)}
                                                        onKeyDown={e => { if (e.key === 'Enter') handleSaveBuildingName(building.buildingId); if (e.key === 'Escape') setEditingBuildingId(null) }}
                                                        className="w-20 text-sm font-black text-gray-900 border-2 border-[#3B82F6] rounded-lg py-1 px-2 focus:outline-none"
                                                    />
                                                    <button onClick={() => handleSaveBuildingName(building.buildingId)} className="p-1 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB]">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => setEditingBuildingId(null)} className="p-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 group">
                                                    <span className="text-sm text-gray-900 font-black">{getBuildingDisplayName(building.buildingId)}</span>
                                                    <button onClick={() => handleStartBuildingEdit(building.buildingId)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-blue-50 text-[#1A73E8] transition-opacity">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-6 px-8 text-sm text-gray-900 text-center font-black">{building.totalUnits}</td>
                                        <td className="py-6 px-8 text-center">
                                            <input
                                                type="number"
                                                min={0}
                                                max={totalInspectionUnits}
                                                value={building.unitsForInspection}
                                                onChange={(e) => handleInspectionUnitChange(building.buildingId, parseInt(e.target.value) || 0)}
                                                className="w-20 text-center text-sm font-black text-gray-900 border-2 border-gray-200 rounded-lg py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all hover:border-[#3B82F6]/50"
                                            />
                                        </td>
                                        <td className="py-6 px-8 text-center">
                                            {completed > 0 ? (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${allDone ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {allDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                    {completed}/{building.unitsForInspection}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-bold">Not started</span>
                                            )}
                                        </td>
                                        <td className="py-6 px-8">
                                            <Button
                                                onClick={() => handleBuildingClick(building)}
                                                className={`w-full font-black py-3 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] ${
                                                    allDone
                                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                                        : completed > 0
                                                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                                        : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                                }`}
                                            >
                                                {allDone ? 'Completed ✓' : completed > 0 ? 'Continue Inspection' : 'Start Inspection'}
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot className="bg-[#F1F7FE] border-t-2 border-gray-200">
                            <tr>
                                <td className="py-4 px-8 text-sm font-black text-gray-900">Total</td>
                                <td className="py-4 px-8 text-sm font-black text-gray-900 text-center">
                                    {buildings.reduce((sum, b) => sum + b.totalUnits, 0)}
                                </td>
                                <td className="py-4 px-8 text-sm font-black text-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${
                                        buildings.reduce((sum, b) => sum + b.unitsForInspection, 0) === totalInspectionUnits
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {buildings.reduce((sum, b) => sum + b.unitsForInspection, 0)} / {totalInspectionUnits}
                                    </span>
                                </td>
                                <td className="py-4 px-8"></td>
                                <td className="py-4 px-8"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {buildings.map((building) => {
                        const completed = getCompletedCount(building.buildingId)
                        const allDone = isAllCompleted(building)
                        return (
                            <div key={building.buildingId} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest inline-flex items-center gap-1">
                                            {columnHeaderName}
                                            <button onClick={() => { setTempColumnHeaderName(columnHeaderName); setEditColumnHeaderOpen(true) }} className="p-0.5 rounded hover:bg-blue-50 text-[#1A73E8]" title="Edit column name">
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                        </span>
                                        {editingBuildingId === building.buildingId ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        ref={buildingNameInputRef}
                                                        value={tempBuildingName}
                                                        onChange={e => setTempBuildingName(e.target.value)}
                                                        onKeyDown={e => { if (e.key === 'Enter') handleSaveBuildingName(building.buildingId); if (e.key === 'Escape') setEditingBuildingId(null) }}
                                                        className="w-20 text-sm font-black text-gray-900 border-2 border-[#3B82F6] rounded-lg py-1 px-2 focus:outline-none"
                                                    />
                                                    <button onClick={() => handleSaveBuildingName(building.buildingId)} className="p-1 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563EB]">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => setEditingBuildingId(null)} className="p-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 group">
                                                    <span className="text-sm text-gray-900 font-black">{getBuildingDisplayName(building.buildingId)}</span>
                                                    <button onClick={() => handleStartBuildingEdit(building.buildingId)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-blue-50 text-[#1A73E8] transition-opacity">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Units</span>
                                        <span className="text-sm text-gray-900 font-black">{building.totalUnits}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Unit for Inspection</span>
                                        <input
                                            type="number"
                                            min={0}
                                            max={totalInspectionUnits}
                                            value={building.unitsForInspection}
                                            onChange={(e) => handleInspectionUnitChange(building.buildingId, parseInt(e.target.value) || 0)}
                                            className="w-16 text-center text-sm font-black text-gray-900 border-2 border-gray-200 rounded-lg py-1 px-1 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Progress</span>
                                        {completed > 0 ? (
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${allDone ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {allDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {completed}/{building.unitsForInspection}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-bold">Not started</span>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleBuildingClick(building)}
                                        className={`w-full font-black py-3 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] ${
                                            allDone
                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                : completed > 0
                                                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                                : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                        }`}
                                    >
                                        {allDone ? 'Completed ✓' : completed > 0 ? 'Continue Inspection' : 'Start Inspection'}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ====== Unit Selection Popup ====== */}
            {unitPopupOpen && selectedBuilding && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setUnitPopupOpen(false)}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Popup Header */}
                        <div className="bg-gradient-to-r from-[#0D6A8D] to-[#0891B2] p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-white tracking-tight">
                                    {selectedBuilding.buildingId} — Select Unit
                                </h3>
                                <p className="text-xs text-white/80 mt-0.5 font-medium">
                                    {getCompletedCount(selectedBuilding.buildingId)} of {selectedBuilding.unitsForInspection} units completed
                                </p>
                            </div>
                            <button
                                onClick={() => setUnitPopupOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-5 pt-4 pb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-[#0D6A8D] to-[#0891B2] h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(getCompletedCount(selectedBuilding.buildingId) / selectedBuilding.unitsForInspection) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Unit List */}
                        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-2">
                            {generateUnitNames(selectedBuilding.buildingId, selectedBuilding.unitsForInspection).map((unitName, idx) => {
                                const completed = (completedUnitsMap[selectedBuilding.buildingId] || []).includes(unitName)
                                return (
                                    <div
                                        key={unitName}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                            completed
                                                ? 'border-green-200 bg-green-50'
                                                : 'border-gray-100 bg-white hover:border-[#0D6A8D]/30 hover:bg-[#F1F7FE]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${
                                                completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${completed ? 'text-green-700' : 'text-gray-900'}`}>
                                                    {unitName}
                                                </p>
                                                <p className="text-[11px] text-gray-400 font-medium">
                                                    {completed ? 'Inspection completed' : 'Pending inspection'}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleStartUnitInspection(selectedBuilding.buildingId, unitName)}
                                            size="sm"
                                            className={`font-bold text-xs px-4 py-2 rounded-lg transition-all ${
                                                completed
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                                    : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-md'
                                            }`}
                                        >
                                            {completed ? (
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    Start <ChevronRight className="w-3.5 h-3.5" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Popup Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setUnitPopupOpen(false)}
                                className="flex-1 font-bold rounded-xl py-3 text-sm"
                            >
                                Close
                            </Button>
                            {isAllCompleted(selectedBuilding) && (
                                <Button
                                    onClick={() => {
                                        setUnitPopupOpen(false)
                                        toast.success(`All units in ${selectedBuilding.buildingId} are completed!`, { position: "top-right" })
                                    }}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl py-3 text-sm"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> All Done
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
