"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { propertiesAPI, authAPI, inspectionsAPI } from "@/lib/api"
import { toast } from "react-toastify"
import { ChevronLeft, CheckCircle2, Clock, X, ChevronRight, Pencil, Check, RefreshCw } from "lucide-react"
import { generateRandomUnitSample, getUnitsToInspect, getSamplingExplanation } from "@/lib/unitSamplingService"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'

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
    const [isExporting, setIsExporting] = useState(false)

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
    const refreshCompletedUnits = useCallback(async () => {
        if (!property || buildings.length === 0) return
        const propId = property._id || id
        const map: Record<string, string[]> = {}
        
        try {
            // Fetch status for each building from backend
            for (const b of buildings) {
                const res = await inspectionsAPI.getUnitStatus(propId, b.buildingId);
                if (res.success) {
                    // Map backend statuses to unit names
                    map[b.buildingId] = res.statuses
                        .filter(s => s.isInspected)
                        .map(s => s.unitLabel);
                } else {
                    // Fallback to local storage if API fails
                    const unitNames = generateUnitNames(b.buildingId, b.unitsForInspection)
                    initBuildingState(propId, b.buildingId, unitNames)
                    map[b.buildingId] = getCompletedUnits(propId, b.buildingId)
                }
            }
        } catch (error) {
            console.error("Error fetching unit status:", error);
            // Fallback to local storage on error
            buildings.forEach(b => {
                const unitNames = generateUnitNames(b.buildingId, b.unitsForInspection)
                initBuildingState(propId, b.buildingId, unitNames)
                map[b.buildingId] = getCompletedUnits(propId, b.buildingId)
            })
        }
        
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

    const normalizeToken = (value: unknown): string => String(value ?? '').trim().toLowerCase()

    const looksLikeBuildingLabel = (value: unknown): boolean => {
        const label = String(value ?? '').trim()
        if (!label) return false
        return /^b\d+$/i.test(label) || /^building[\s_-]?[a-z0-9]+$/i.test(label)
    }

    const mapDraftDeficienciesToFindings = (items: any[] = [], fallbackBuilding = ''): any[] => {
        return items.map((f: any, idx: number) => {
            const areaToken = String(f?._area || f?.area || f?.category || f?.inspectionType || '').trim().toLowerCase()
            const resolvedArea = areaToken.includes('outside')
                ? 'Outside'
                : areaToken.includes('inside')
                    ? 'Inside'
                    : areaToken.includes('unit')
                        ? 'Unit'
                        : 'General'

            const resolvedBuilding = String(
                f?.buildingInspectionId ||
                f?.building_id ||
                f?.building ||
                f?.buildingName ||
                f?.buildingId ||
                (looksLikeBuildingLabel(f?.unit) ? f?.unit : '') ||
                (looksLikeBuildingLabel(f?._unit) ? f?._unit : '') ||
                fallbackBuilding ||
                'Building'
            ).trim() || 'Building'

            const unitCandidate = String(f?.unit || f?._unit || f?.unitId || '').trim()

            return {
                id: String(f?.id || f?._id || `draft-${idx + 1}`),
                title: f?.title || f?.deficiency?.name || f?.deficiencyName || 'Deficiency',
                deficiencyName: f?.deficiencyName || f?.deficiency?.name || f?.title || f?.name || 'Deficiency',
                deficiencyDetails:
                    f?.deficiencyDetails ||
                    f?.description ||
                    f?.detail ||
                    f?.deficiency?.detail ||
                    f?.title ||
                    f?.deficiency?.title ||
                    f?.name ||
                    f?.deficiency?.name ||
                    'Issue recorded',
                severity: f?.severity || f?.deficiency?.severity || f?.deficiency?.aiSeverity || 'Moderate',
                area: resolvedArea,
                category: resolvedArea,
                location: f?.location || f?.room || f?.itemName || f?.module || 'General',
                building: resolvedBuilding,
                unit: unitCandidate && !/^b\d+$/i.test(unitCandidate) ? unitCandidate : '-',
                imageUri:
                    f?.imageUri ||
                    f?.imageUrl ||
                    f?.deficiency?.imageUri ||
                    f?.deficiency?.imageUrl ||
                    f?.photos?.[0]?.url ||
                    '',
                nspireCode: f?.nspireCode || f?.deficiency?.code || '-',
                codeReference: f?.codeReference || f?.deficiency?.codeReference || '',
                comments: f?.comments || f?.note || f?.deficiency?.aiAnalysis || '',
                status: f?.status || 'Open',
                timestamp: f?.timestamp || new Date().toISOString(),
            }
        })
    }

    const dedupeFindings = (findings: any[]): any[] => {
        const deduped = new Map<string, any>()

        findings.forEach((finding) => {
            if (!finding) return

            const key = [
                normalizeToken(finding?.building),
                normalizeToken(finding?.area),
                normalizeToken(finding?.unit),
                normalizeToken(finding?.deficiencyName),
                normalizeToken(finding?.deficiencyDetails),
                normalizeToken(finding?.nspireCode),
                normalizeToken(finding?.imageUri),
            ].join('|')

            if (!deduped.has(key)) {
                deduped.set(key, finding)
            }
        })

        return Array.from(deduped.values())
    }

    const handleExportInProgress = async () => {
        if (!property) return

        setIsExporting(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                toast.error('Please login to export in-progress report.', { position: 'top-right' })
                router.push('/login')
                return
            }

            const propertyId = String(property?._id || id)
            const propertyTokenSet = new Set<string>([
                normalizeToken(property?._id),
                normalizeToken(property?.id),
                normalizeToken(property?.propertyId),
                normalizeToken(property?.name),
            ].filter(Boolean))

            let inspectorName = user?.fullName || 'Inspector'
            try {
                const me = await authAPI.getMe()
                if (me?.success && me?.user?.fullName) {
                    inspectorName = me.user.fullName
                }
            } catch {
                // Fallback to already loaded user name
            }

            const fetchProgress = async (queryParams: Record<string, string>) => {
                const query = new URLSearchParams(queryParams).toString()
                const response = await fetch(`${API_URL}/api/inspections/progress?${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Progress fetch failed (${response.status})`)
                }

                const data = await response.json()
                return Array.isArray(data?.progress) ? data.progress : []
            }

            let progressRecords: any[] = []
            let findings: any[] = []
            let notes = ''

            // 1) Mobile parity source: backend draft records first
            try {
                const draftProgress = await fetchProgress({
                    property_id: propertyId,
                    draft_only: 'true',
                    include_property: 'true',
                })

                progressRecords = draftProgress

                const latestDraft = draftProgress
                    .filter((record: any) => {
                        const inspectionType = String(record?.inspectionType || '')
                        if (!inspectionType.startsWith('REPORT_DRAFT_')) return false

                        const draftFindings = record?.inspectionData?.deficiencies || record?.inspectionData?.findings || []
                        if (!Array.isArray(draftFindings) || draftFindings.length === 0) return false

                        const recordTokens = [
                            normalizeToken(record?.propertyId?._id),
                            normalizeToken(record?.propertyId?.id),
                            normalizeToken(record?.propertyId?.propertyId),
                            normalizeToken(record?.propertyId),
                            normalizeToken(record?.inspectionData?.property?._id),
                            normalizeToken(record?.inspectionData?.property?.id),
                            normalizeToken(record?.inspectionData?.property?.propertyId),
                            normalizeToken(record?.inspectionData?.property?.name),
                            normalizeToken(record?.propertyId?.name),
                        ].filter(Boolean)

                        return recordTokens.some((tokenValue) => propertyTokenSet.has(tokenValue))
                    })
                    .sort((a: any, b: any) => {
                        const tA = Date.parse(String(a?.updatedAt || a?.createdAt || a?.inspectionData?.savedAt || 0))
                        const tB = Date.parse(String(b?.updatedAt || b?.createdAt || b?.inspectionData?.savedAt || 0))
                        return (Number.isFinite(tB) ? tB : 0) - (Number.isFinite(tA) ? tA : 0)
                    })[0]

                if (latestDraft) {
                    const rawDraftFindings = latestDraft?.inspectionData?.deficiencies || latestDraft?.inspectionData?.findings || []
                    findings = mapDraftDeficienciesToFindings(
                        rawDraftFindings,
                        String(latestDraft?.buildingId || latestDraft?.inspectionData?.buildingId || latestDraft?.unitId || '')
                    )
                    notes = String(latestDraft?.inspectionData?.notes || '')
                }
            } catch (error) {
                console.warn('Draft progress fetch failed:', error)
            }

            // 2) Fallback to latest in-browser inspection payload
            if (findings.length === 0) {
                try {
                    const storedData = localStorage.getItem('currentInspectionData')
                    const parsed = storedData ? JSON.parse(storedData) : null

                    if (parsed) {
                        const parsedPropertyTokens = [
                            normalizeToken(parsed?.propertyId),
                            normalizeToken(parsed?.property?._id),
                            normalizeToken(parsed?.property?.id),
                            normalizeToken(parsed?.property?.propertyId),
                            normalizeToken(parsed?.propertyName),
                            normalizeToken(parsed?.property?.name),
                        ].filter(Boolean)

                        const belongsToCurrentProperty = parsedPropertyTokens.some((tokenValue: string) => propertyTokenSet.has(tokenValue))
                        if (belongsToCurrentProperty) {
                            const localRawFindings = parsed?.findings || parsed?.deficiencies || []
                            if (Array.isArray(localRawFindings) && localRawFindings.length > 0) {
                                findings = mapDraftDeficienciesToFindings(localRawFindings, String(parsed?.building || ''))
                                notes = String(parsed?.notes || notes)
                            }
                        }
                    }
                } catch (error) {
                    console.warn('Local inspection payload parse failed:', error)
                }
            }

            // 3) Final fallback: non-draft progress records with answered responses
            if (findings.length === 0) {
                try {
                    const allProgress = progressRecords.length > 0
                        ? progressRecords
                        : await fetchProgress({ property_id: propertyId })

                    progressRecords = allProgress

                    const collected = allProgress.flatMap((record: any) => {
                        const inspectionType = String(record?.inspectionType || '').toLowerCase()
                        const responses = (record?.responses && typeof record.responses === 'object') ? record.responses : {}
                        const answeredCount = Object.values(responses).filter((value) => value !== null && value !== undefined && String(value).trim() !== '').length

                        const shouldInclude = inspectionType.startsWith('report_draft_') || answeredCount > 0
                        if (!shouldInclude) return []

                        const rawRecordFindings = record?.inspectionData?.deficiencies || record?.inspectionData?.findings || []
                        if (!Array.isArray(rawRecordFindings) || rawRecordFindings.length === 0) return []

                        return mapDraftDeficienciesToFindings(
                            rawRecordFindings,
                            String(record?.buildingId || record?.inspectionData?.buildingId || record?.unitId || '')
                        )
                    })

                    findings = collected
                } catch (error) {
                    console.warn('Full progress fallback failed:', error)
                }
            }

            const dedupedFindings = dedupeFindings(findings)

            const buildingProgressMap = buildings.reduce((acc: Record<string, any>, building) => {
                const completedUnits = completedUnitsMap[building.buildingId] || []
                acc[building.buildingId] = {
                    out: 0,
                    in: 0,
                    un: completedUnits.length,
                    totalUnits: building.totalUnits,
                    unitsForInspection: building.unitsForInspection,
                    inspectedUnits: [...completedUnits],
                }
                return acc
            }, {})

            progressRecords.forEach((record: any) => {
                const inspectionType = String(record?.inspectionType || '').toLowerCase()
                const responses = (record?.responses && typeof record.responses === 'object') ? record.responses : {}
                const answeredCount = Object.values(responses).filter((value) => value !== null && value !== undefined && String(value).trim() !== '').length
                if (answeredCount === 0 && !inspectionType.startsWith('report_draft_')) return

                const buildingCandidate = String(
                    record?.buildingId ||
                    record?.inspectionData?.buildingId ||
                    record?.inspectionData?.buildingInspectionId ||
                    (looksLikeBuildingLabel(record?.unitId) ? record?.unitId : '') ||
                    'B1'
                ).trim() || 'B1'

                if (!buildingProgressMap[buildingCandidate]) {
                    buildingProgressMap[buildingCandidate] = {
                        out: 0,
                        in: 0,
                        un: 0,
                        totalUnits: 0,
                        unitsForInspection: 0,
                        inspectedUnits: [],
                    }
                }

                if (inspectionType.startsWith('outside')) {
                    buildingProgressMap[buildingCandidate].out = Math.max(buildingProgressMap[buildingCandidate].out, answeredCount)
                } else if (inspectionType.startsWith('inside')) {
                    buildingProgressMap[buildingCandidate].in = Math.max(buildingProgressMap[buildingCandidate].in, answeredCount)
                } else if (inspectionType.startsWith('unit_')) {
                    const unitLabel = inspectionType.split('_').slice(1).join('_').trim()
                    if (unitLabel && !buildingProgressMap[buildingCandidate].inspectedUnits.includes(unitLabel)) {
                        buildingProgressMap[buildingCandidate].inspectedUnits.push(unitLabel)
                    }
                    buildingProgressMap[buildingCandidate].un = buildingProgressMap[buildingCandidate].inspectedUnits.length
                }
            })

            const progressRows = Object.values(buildingProgressMap)
            const progressData = {
                outsideProgress: progressRows.reduce((sum: number, row: any) => sum + Number(row.out || 0), 0),
                insideProgress: progressRows.reduce((sum: number, row: any) => sum + Number(row.in || 0), 0),
                unitProgress: progressRows.reduce((sum: number, row: any) => sum + Number(row.un || 0), 0),
                outsideTotal: 29,
                insideTotal: 36,
                unitTotal: 35,
                buildingRows: buildings.map((building) => ({
                    buildingId: building.buildingId,
                    totalUnits: building.totalUnits,
                    unitsForInspection: building.unitsForInspection,
                })),
                buildingProgressMap,
            }

            const inspectionDataForSummary = {
                inspectionId: `INPROG-${Date.now()}`,
                inspectionNo: `INSP-${Date.now().toString(36).toUpperCase()}`,
                propertyId,
                propertyName: property?.name || '-',
                propertyAddress: property?.address || '-',
                inspectorId: user?.id || user?._id || 'INS-001',
                inspectorName,
                inspectionType: 'In-Progress Inspection',
                status: 'in-progress',
                building: buildings.map((building) => getBuildingDisplayName(building.buildingId)).join(', '),
                buildingColumnHeader: columnHeaderName,
                findings: dedupedFindings,
                deficiencies: dedupedFindings,
                notes: notes || `In-progress export generated on ${new Date().toLocaleString()}`,
                selectedUnits: Object.values(completedUnitsMap).flat(),
                complianceScore: Math.max(0, 100 - Math.min(dedupedFindings.length * 3, 100)),
                startDate: new Date().toLocaleDateString(),
                startTime: new Date().toLocaleTimeString(),
                progressData,
            }

            localStorage.setItem('currentInspectionData', JSON.stringify(inspectionDataForSummary))
            localStorage.setItem('currentInspectionProperty', JSON.stringify(property))

            toast.success('In-progress report prepared. Opening summary...', {
                position: 'top-right',
                autoClose: 1800,
            })

            router.push('/dashboard/inspection/summary')
        } catch (error: any) {
            console.error('Export in-progress failed:', error)
            toast.error(`Failed to export in-progress report: ${error?.message || 'Unknown error'}`, {
                position: 'top-right',
            })
        } finally {
            setIsExporting(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
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
                            <span className="text-sm text-[#006795] font-black">{property.propertyId || property._id?.slice(-8)?.toUpperCase()}</span>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006795] focus:border-transparent text-sm"
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
                                    className="flex-1 px-4 py-3 bg-[#006795] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
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
                                            className="p-1 rounded hover:bg-blue-50 text-[#006795] transition-colors"
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
                                                        className="w-20 text-sm font-black text-gray-900 border-2 border-[#006795] rounded-lg py-1 px-2 focus:outline-none"
                                                    />
                                                    <button onClick={() => handleSaveBuildingName(building.buildingId)} className="p-1 rounded-lg bg-[#006795] text-white hover:bg-[#00567a]">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => setEditingBuildingId(null)} className="p-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 group">
                                                    <span className="text-sm text-gray-900 font-black">{getBuildingDisplayName(building.buildingId)}</span>
                                                    <button onClick={() => handleStartBuildingEdit(building.buildingId)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-blue-50 text-[#006795] transition-opacity">
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
                                                className="w-20 text-center text-sm font-black text-gray-900 border-2 border-gray-200 rounded-lg py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-[#006795] focus:border-transparent transition-all hover:border-[#006795]/50"
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
                                                        : 'bg-[#006795] hover:bg-[#00567a] text-white'
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
                                            <button onClick={() => { setTempColumnHeaderName(columnHeaderName); setEditColumnHeaderOpen(true) }} className="p-0.5 rounded hover:bg-blue-50 text-[#006795]" title="Edit column name">
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
                                                        className="w-20 text-sm font-black text-gray-900 border-2 border-[#006795] rounded-lg py-1 px-2 focus:outline-none"
                                                    />
                                                    <button onClick={() => handleSaveBuildingName(building.buildingId)} className="p-1 rounded-lg bg-[#006795] text-white hover:bg-[#00567a]">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => setEditingBuildingId(null)} className="p-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 group">
                                                    <span className="text-sm text-gray-900 font-black">{getBuildingDisplayName(building.buildingId)}</span>
                                                    <button onClick={() => handleStartBuildingEdit(building.buildingId)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-blue-50 text-[#006795] transition-opacity">
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
                                            className="w-16 text-center text-sm font-black text-gray-900 border-2 border-gray-200 rounded-lg py-1 px-1 focus:outline-none focus:ring-2 focus:ring-[#006795] focus:border-transparent"
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
                                                : 'bg-[#006795] hover:bg-[#00567a] text-white'
                                        }`}
                                    >
                                        {allDone ? 'Completed ✓' : completed > 0 ? 'Continue Inspection' : 'Start Inspection'}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleExportInProgress}
                        disabled={isExporting}
                        className="w-full md:w-auto min-w-[220px] bg-[#10B981] hover:bg-[#0ea56f] text-white font-black py-3 px-8 rounded-xl shadow-md"
                    >
                        {isExporting ? 'Preparing Report...' : 'Export In Progress'}
                    </Button>
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
                        <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] p-5 flex items-center justify-between">
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

                        {/* Sampling Information & Random Selection */}
                        <div className="px-5 pt-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                                <p className="text-xs text-blue-800 font-bold leading-relaxed">
                                    {getSamplingExplanation(selectedBuilding.totalUnits)}
                                </p>
                                <button
                                    onClick={() => {
                                        const sample = generateRandomUnitSample(selectedBuilding.totalUnits, property._id || id);
                                        // Mark all selected units as completed/available? 
                                        // Actually the app just highlights them.
                                        // For the web, we'll toast the selection.
                                        toast.info(`Randomly selected: ${sample.selectedUnits.join(', ')}`, { position: 'top-right' });
                                    }}
                                    className="mt-3 flex items-center gap-2 text-xs font-black text-[#006795] hover:text-[#0a5670] transition-colors"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Generate Random Sample
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-5 pt-4 pb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-[#006795] to-[#0891B2] h-2 rounded-full transition-all duration-500"
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
                                                : 'border-gray-100 bg-white hover:border-[#006795]/30 hover:bg-[#F1F7FE]'
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
                                                    : 'bg-[#006795] hover:bg-[#00567a] text-white shadow-md'
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
