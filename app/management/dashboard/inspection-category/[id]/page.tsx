"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import ManagementDashboardLayout from "@/components/ManagementDashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { propertiesAPI, authAPI, inspectionsAPI } from "@/lib/api"
import { outsideDeficiencyMapping, insideDeficiencyMapping, DeficiencyDetail } from "@/lib/deficiencyMapping"
import { unitDeficiencyMapping } from "@/lib/unitDeficiencyMapping"
import { calculateUnitInspectionScore, calculateUnitScore, ScoringResult, POSSIBLE_SCORE, SEVERITY_LEVELS } from "@/lib/scoringCalculations"
import { lookupCodeReference } from "@/lib/appDeficiencyLookup"
import {
    calculateOutsideScore,
    extractCategoryNumber,
    OutsideScoringResult,
    OUTSIDE_LOCATION_OPTIONS,
    OUTSIDE_POSSIBLE_SCORE
} from "@/lib/outsideScoringCalculations"
import {
    calculateInsideScore,
    extractInsideCategoryNumber,
    InsideScoringResult,
    INSIDE_POSSIBLE_SCORE
} from "@/lib/insideScoringCalculations"
import { getSamplingRequirements } from "@/lib/unitSamplingService"
import { toast } from "react-toastify"
import { Search, ChevronDown, ChevronUp, ChevronRight, Plus, Filter, ArrowUpDown, MoreHorizontal, Camera, X, ChevronLeft, CheckCircle2, FileText, User, Grid, Clock, Video, Monitor, Image as ImageIcon, Laptop, Tablet, Pencil, Check } from "lucide-react";

import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS, getInspectionStandardAndProtocol } from "@/lib/inspectionData";

const outsideItemsList = OUTSIDE_ITEMS.map(item => `${item.id}. ${item.name}`);
const insideItemsList = INSIDE_ITEMS.map(item => `${item.id}. ${item.name}`);
const unitItemsList = UNIT_ITEMS.map(item => `${item.id}. ${item.name}`);

// Map frontend categories to valid backend enum values
const mapToBackendCategory = (category: string): string => {
    const lowerCategory = category.toLowerCase();

    // Site-related items (outside)
    if (lowerCategory.includes('address') || lowerCategory.includes('signage') ||
        lowerCategory.includes('parking') || lowerCategory.includes('sidewalk') ||
        lowerCategory.includes('fencing') || lowerCategory.includes('gate') ||
        lowerCategory.includes('retaining wall') || lowerCategory.includes('driveway')) {
        return 'site';
    }

    // Building exterior items
    if (lowerCategory.includes('roof') || lowerCategory.includes('chimney') ||
        lowerCategory.includes('foundation') || lowerCategory.includes('structural') ||
        lowerCategory.includes('door') || lowerCategory.includes('window') ||
        lowerCategory.includes('paint') || lowerCategory.includes('railings')) {
        return 'building-exterior';
    }

    // Building systems
    if (lowerCategory.includes('electrical') || lowerCategory.includes('hvac') ||
        lowerCategory.includes('heating') || lowerCategory.includes('ventilation') ||
        lowerCategory.includes('water heater') || lowerCategory.includes('elevator') ||
        lowerCategory.includes('fire safety') || lowerCategory.includes('carbon monoxide') ||
        lowerCategory.includes('leak') || lowerCategory.includes('drain')) {
        return 'building-systems';
    }

    // Common areas
    if (lowerCategory.includes('lighting') || lowerCategory.includes('egress') ||
        lowerCategory.includes('step') || lowerCategory.includes('stair') ||
        lowerCategory.includes('trash chute')) {
        return 'common-areas';
    }

    // Unit-specific items
    if (lowerCategory.includes('cabinet') || lowerCategory.includes('kitchen') ||
        lowerCategory.includes('bathroom') || lowerCategory.includes('restroom') || lowerCategory.includes('sink') ||
        lowerCategory.includes('ceiling') || lowerCategory.includes('floor') ||
        lowerCategory.includes('wall') || lowerCategory.includes('mold') ||
        lowerCategory.includes('grab bar') || lowerCategory.includes('call-for-aid')) {
        return 'unit';
    }

    // Default to General
    return 'General';
};

type ItemStatus = 'No OD' | 'OD' | 'N/A' | null;

export default function InspectionCategoryPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = params.id as string
    const [property, setProperty] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [units, setUnits] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedSection, setExpandedSection] = useState<string | null>(null)
    const [outsideStatuses, setOutsideStatuses] = useState<Record<string, ItemStatus>>({})
    const [insideStatuses, setInsideStatuses] = useState<Record<string, ItemStatus>>({})
    const [unitStatuses, setUnitStatuses] = useState<Record<string, ItemStatus>>({})
    const [propertyFindings, setPropertyFindings] = useState<any[]>([])
    const [currentSection, setCurrentSection] = useState<'outside' | 'inside' | 'unit'>('outside')
    const [completedUnits, setCompletedUnits] = useState<string[]>([])

    // Read building & unit from URL query params (set by property-details page)
    const urlBuilding = searchParams.get('building') || 'B1'
    const urlUnit = searchParams.get('unit') || ''
    const urlTotalUnits = parseInt(searchParams.get('totalUnits') || '0')
    const currentUnitName = decodeURIComponent(urlUnit)

    // Unit selection popup (shown when user clicks Units section and no unit is pre-selected)
    const [unitSelectionPopupOpen, setUnitSelectionPopupOpen] = useState(false)
    const [activeInspectionUnit, setActiveInspectionUnit] = useState(currentUnitName)

    const refreshCompletedUnits = async () => {
        if (!id || !urlBuilding) return;
        try {
            const res = await inspectionsAPI.getUnitStatus(id, urlBuilding);
            if (res.success) {
                setCompletedUnits(res.statuses.filter((s: any) => s.isInspected).map((s: any) => s.unitLabel));
            }
        } catch (error) {
            console.error("Error fetching completed units:", error);
        }
    };

    useEffect(() => {
        refreshCompletedUnits();
    }, [id, urlBuilding]);

    // Set initial section based on URL param
    useEffect(() => {
        if (currentUnitName === 'Outside') {
            setCurrentSection('outside');
        } else if (currentUnitName === 'Inside') {
            setCurrentSection('inside');
        } else if (currentUnitName) {
            setCurrentSection('unit');
        }
    }, [currentUnitName]);

    // Custom column header name (set from property-details building table)
    const [columnHeaderName, setColumnHeaderName] = useState('Building Unique ID')

    // Load column header from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`buildingColHeader_${id}`)
        if (saved) setColumnHeaderName(saved)
    }, [id])

    // Generate building unit names from totalUnits URL param (or fallback to API units)
    const buildingUnitNames = useMemo(() => {
        const count = urlTotalUnits
        if (count > 0) {
            return Array.from({ length: count }, (_, i) => `Unit ${String(i + 1).padStart(3, '0')}`)
        }
        return []
    }, [urlTotalUnits])

    // Building & Unit name editing
    const [buildingName, setBuildingName] = useState(urlBuilding);
    const [editBuildingModalOpen, setEditBuildingModalOpen] = useState(false);
    const [tempBuildingName, setTempBuildingName] = useState(urlBuilding);
    const [unitNames, setUnitNames] = useState<Record<string, string>>({});
    const [editUnitsModalOpen, setEditUnitsModalOpen] = useState(false);
    const [tempUnitNames, setTempUnitNames] = useState<Record<string, string>>({});

    // Inline unit name editing inside the unit selection popup
    const [popupUnitCustomNames, setPopupUnitCustomNames] = useState<Record<string, string>>({});
    const [editingUnitIdx, setEditingUnitIdx] = useState<number | null>(null);
    const [editingUnitValue, setEditingUnitValue] = useState('');

    // Load custom building name from localStorage
    useEffect(() => {
        if (id && urlBuilding) {
            const savedName = localStorage.getItem(`buildingDisplayName_${id}_${urlBuilding}`)
            if (savedName) {
                setBuildingName(savedName)
                setTempBuildingName(savedName)
            }
        }
    }, [id, urlBuilding])

    // Modal State
    const [isODModalOpen, setIsODModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Track items that have actual saved OD findings (to protect from accidental Select All overwrite)
    const [savedODItems, setSavedODItems] = useState<Set<string>>(new Set());

    // Store previously saved OD form data per item key (section:itemName) for pre-filling when re-opened
    const [savedODFormData, setSavedODFormData] = useState<Record<string, {
        odForm: { category: string; note: string; location: string; healthAndSafety: string; repairBy: string; codeAndCompliance: string; deficiencySelected?: string; deficiencyDetail?: string };
        selectedDeficiency?: DeficiencyDetail | null;
        selectedDeficiencies?: DeficiencyDetail[];
        photos: string[];
        modalStep: number;
    }>>({});

    // General Comment modal state
    const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);
    const [generalNote, setGeneralNote] = useState('');
    const [generalImage, setGeneralImage] = useState<string | null>(null);
    const [currentGeneralSection, setCurrentGeneralSection] = useState<'outside' | 'inside' | 'unit' | null>(null);
    const [currentGeneralItem, setCurrentGeneralItem] = useState<string | null>(null);
    const [isUploadingGeneralImage, setIsUploadingGeneralImage] = useState(false);
    const generalFileInputRef = useRef<HTMLInputElement>(null);
    const generalGalleryInputRef = useRef<HTMLInputElement>(null);
    const [modalStep, setModalStep] = useState(1); // 1: Add New, 2: Form, 3: Selection (Selected/Detail/Criteria)
    const [isHowToInspectOpen, setIsHowToInspectOpen] = useState(false);
    const [inspectModalType, setInspectModalType] = useState<'standard' | 'protocol' | null>(null); // Track which modal is open
    const [currentModalItem, setCurrentModalItem] = useState<string | null>(null);
    const [selectionType, setSelectionType] = useState<'selected' | 'detail' | 'criteria'>('selected');
    const [detailFilterName, setDetailFilterName] = useState<string | null>(null);
    const [selectedDeficiency, setSelectedDeficiency] = useState<DeficiencyDetail | null>(null);
    const [guideDeficiency, setGuideDeficiency] = useState<DeficiencyDetail | null>(null);
    const [lastSavedFindingId, setLastSavedFindingId] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showStandardModal, setShowStandardModal] = useState(false);
    const [showProtocolModal, setShowProtocolModal] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [odForm, setOdForm] = useState({
        category: "",
        note: "",
        location: "Building Site S",
        healthAndSafety: "",
        repairBy: "",
        codeAndCompliance: "",
        deficiencySelected: "",
        deficiencyDetail: ""
    });

    // Auto-scoring state - calculated based on deficiency selection
    const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
    const [outsideScoringResult, setOutsideScoringResult] = useState<OutsideScoringResult | null>(null);
    const [insideScoringResult, setInsideScoringResult] = useState<InsideScoringResult | null>(null);

    // Get total samples based on NSPIRE Sampling Table (same as app)
    const totalSamples = useMemo(() => {
        // Use the total units from URL or property to find required sample size 'n'
        const count = searchParams.has('totalUnits') ? urlTotalUnits : (urlTotalUnits || property?.units || units?.length || 0);
        const sampling = getSamplingRequirements(count);
        return count === 0 ? 0 : (sampling.requiredSize || 20);
    }, [searchParams, urlTotalUnits, property?.units, units?.length]);

    const getCurrentItemUnit = useCallback(() =>
        currentSection === 'unit' ? (activeInspectionUnit || '-') : '-',
    [currentSection, activeInspectionUnit]);

    const getCurrentItemFindings = useCallback(() => {
        if (!currentModalItem || !currentSection) return [];
        const unitVal = getCurrentItemUnit();
        return propertyFindings.filter((f: any) =>
            f.item === currentModalItem &&
            f.area === currentSection &&
            f.unit === unitVal &&
            (f.building === urlBuilding || f.building === buildingName)
        );
    }, [propertyFindings, currentModalItem, currentSection, getCurrentItemUnit, urlBuilding, buildingName]);

    const savedItemFindings = getCurrentItemFindings();
    const deficiencyCount = savedItemFindings.length + (selectedDeficiency ? 1 : 0);

    // Update scoring dynamically when deficiency is selected/changed
    useEffect(() => {
        // Check if we're in the Outside inspection section
        const isOutsideSection = currentSection === 'outside';

        if (isOutsideSection && currentModalItem) {
            // Use Outside-specific scoring with category-based and deficiency-based rules
            const categoryNumber = extractCategoryNumber(undefined, currentModalItem);
            // Include category name, selected deficiency name, detail, AND criteria fields for pattern matching
            const deficiencyDescription = [
                currentModalItem,
                selectedDeficiency?.selected,
                selectedDeficiency?.criteria,
                odForm.note,
            ].filter(Boolean).join(' ');

            const outsideResult = calculateOutsideScore({
                categoryNumber,
                totalSamples,
                deficiencyDescription: deficiencyDescription || undefined,
                deficiencyCount,
            });

            setOutsideScoringResult(outsideResult);

            // Update the health & safety based on outside scoring (always, to show category-based severity)
            setOdForm(prev => ({
                ...prev,
                healthAndSafety: outsideResult.severity,
            }));

            // Set a compatible result for the UI
            setScoringResult({
                allSample: outsideResult.allSample,
                deficiencies: outsideResult.deficiencyCount,
                violations: outsideResult.deficiencyCount,
                ptsLostRaw: outsideResult.ptsLostRaw,
                ptsLost: outsideResult.ptsLost,
                possibleScore: outsideResult.possibleScore,
                maxPtsLost: outsideResult.maxPtsLost,
                score: outsideResult.score,
                severity: outsideResult.severity,
            });
        } else if (currentSection === 'unit') {
            // Use Unit-specific scoring logic
            const unitResult = calculateUnitInspectionScore({
                totalSamples,
                deficiencyCount,
                severity: selectedDeficiency?.healthAndSafety || odForm.healthAndSafety || 'Moderate',
                deficiencyPointsFormula: selectedDeficiency?.pointsFormula,
            });

            setScoringResult({
                allSample: unitResult.allSample,
                deficiencies: unitResult.deficiencyCount,
                violations: unitResult.deficiencyCount,
                ptsLostRaw: unitResult.pointsLostRaw,
                ptsLost: unitResult.pointsLost,
                possibleScore: unitResult.possibleScore,
                maxPtsLost: unitResult.maxPtsLost,
                score: unitResult.score,
                severity: unitResult.severity,
            });

            // Update the health & safety based on unit scoring
            setOdForm(prev => ({
                ...prev,
                healthAndSafety: unitResult.severity,
            }));
            setOutsideScoringResult(null);
            setInsideScoringResult(null);
        } else {
            // Use Inside-specific scoring with category-based and deficiency-based rules
            const categoryNumber = extractInsideCategoryNumber(undefined, currentModalItem || '');
            // Include category name, selected deficiency name, detail, AND criteria fields for pattern matching
            // The category name (e.g., "Chimney") is crucial for categories with fixed severity
            const deficiencyDescription = [
                currentModalItem,
                selectedDeficiency?.selected,
                selectedDeficiency?.criteria,
                odForm.note,
            ].filter(Boolean).join(' ');

            const insideResult = calculateInsideScore({
                categoryNumber,
                totalSamples,
                deficiencyDescription: deficiencyDescription || undefined,
                deficiencyCount,
            });

            setInsideScoringResult(insideResult);

            // Update the health & safety based on inside scoring (always, to show category-based severity)
            setOdForm(prev => ({
                ...prev,
                healthAndSafety: insideResult.severity,
            }));

            // Set a compatible result for the UI
            setScoringResult({
                allSample: insideResult.allSample,
                deficiencies: insideResult.deficiencyCount,
                violations: insideResult.deficiencyCount,
                ptsLostRaw: insideResult.ptsLostRaw,
                ptsLost: insideResult.ptsLost,
                possibleScore: insideResult.possibleScore,
                maxPtsLost: insideResult.maxPtsLost,
                score: insideResult.score,
                severity: insideResult.severity,
            });
            setOutsideScoringResult(null);
        }
    }, [selectedDeficiency, deficiencyCount, totalSamples, odForm.healthAndSafety, odForm.note, currentSection, currentModalItem, savedItemFindings.length]);

    useEffect(() => {
        if (id) {
            // CRITICAL: Reset building/unit specific states when location changes
            // This prevents findings from B1 leaking into B2 if the page isn't refreshed
            setOutsideStatuses({});
            setInsideStatuses({});
            setUnitStatuses({});
            setSavedODItems(new Set());
            setSavedODFormData({});

            fetchData();
            loadSavedProgress();
        }
    }, [id, urlBuilding, activeInspectionUnit]);

    const loadSavedProgress = async () => {
        try {
            // Fetch ALL progress for this property to populate all progress bars
            const res = await inspectionsAPI.getProgress({
                property_id: id,
                building_id: urlBuilding
            });

            if ((res as any).success && (res as any).progress) {
                // Find Inside and Outside progress for this building
                const outsideRec = (res as any).progress.find((p: any) => {
                    const typeMatch = p.inspectionType === 'Outside';
                    const bId = String(urlBuilding || '').toUpperCase();
                    const pUnitId = String(p.unitId || '').toUpperCase();
                    const pBldgId = String(p.buildingId || '').toUpperCase();
                    const isB1Match = (bId === 'B1' || bId === 'BUILDING 1') && (pUnitId === 'B1' || pUnitId === 'BUILDING 1' || pBldgId === 'B1' || pBldgId === 'BUILDING 1');
                    return typeMatch && (pUnitId === bId || pBldgId === bId || isB1Match);
                });

                const insideRec = (res as any).progress.find((p: any) => {
                    const typeMatch = p.inspectionType === 'Inside';
                    const bId = String(urlBuilding || '').toUpperCase();
                    const pUnitId = String(p.unitId || '').toUpperCase();
                    const pBldgId = String(p.buildingId || '').toUpperCase();
                    const isB1Match = (bId === 'B1' || bId === 'BUILDING 1') && (pUnitId === 'B1' || pUnitId === 'BUILDING 1' || pBldgId === 'B1' || pBldgId === 'BUILDING 1');
                    return typeMatch && (pUnitId === bId || pBldgId === bId || isB1Match);
                });

                if (outsideRec && outsideRec.responses) setOutsideStatuses(outsideRec.responses);
                if (insideRec && insideRec.responses) setInsideStatuses(insideRec.responses);

                // If a unit is active, find its progress too
                if (activeInspectionUnit) {
                    const unitRec = (res as any).progress.find((p: any) => {
                        const pType = String(p.inspectionType || '').toLowerCase();
                        const typeMatch = pType === 'unit'
                            || pType === `unit_${activeInspectionUnit}`.toLowerCase()
                            || pType === `unit_${urlBuilding}_${activeInspectionUnit}`.toLowerCase();
                        const uId = String(activeInspectionUnit).toUpperCase();
                        const pUnitId = String(p.unitId).toUpperCase();
                        const bId = String(urlBuilding || '').toUpperCase();
                        const pBldgId = String(p.buildingId || '').toUpperCase();

                        // Cross-building fix: ensure buildingId matches
                        return typeMatch && pUnitId === uId && (pBldgId === bId || !pBldgId);
                    });
                    if (unitRec && unitRec.responses) setUnitStatuses(unitRec.responses);
                }

                // Restore findings for summary page if they exist in any record
                const allFindings: any[] = [];
                (res as any).progress.forEach((p: any) => {
                    if (p.inspectionData && Array.isArray(p.inspectionData.findings)) {
                        allFindings.push(...p.inspectionData.findings);
                    }
                });

                if (allFindings.length > 0) {
                    // Dedupe findings
                    const seen = new Set();
                    const uniqueFindings = allFindings.filter((f: any) => {
                        // Aggressive deduplication: Building + Area + Unit + Item
                        // If building is unknown, we treat it as potentially belonging to the current building to avoid duplicates
                        const bldg = (f.building && !['unknown', 'UNKNOWN-BUILDING'].includes(f.building)) ? f.building : (urlBuilding || 'unknown');
                        const area = f.area || f.category || 'unknown';
                        const unit = f.unit || '-';
                        const item = f.item || f.deficiencyName || f.title || 'unknown';

                        const defKey = f.nspireCode || f.title || f.deficiencyName || '';
                        const key = `${bldg}|${area}|${unit}|${item}|${defKey}`.toLowerCase().trim();
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });

                    // CRITICAL: Always use server findings as the source of truth
                    setPropertyFindings(uniqueFindings);
                }
                // Restore OD form snapshots so re-opening a saved OD pre-fills the form
                const restoredSnapshots: Record<string, any> = {};
                const restoredSavedODKeys = new Set<string>();
                (res as any).progress.forEach((p: any) => {
                    if (p.inspectionData && p.inspectionData.odFormSnapshots) {
                        Object.entries(p.inspectionData.odFormSnapshots).forEach(([key, val]) => {
                            restoredSnapshots[key] = val;
                            restoredSavedODKeys.add(key);
                        });
                    }
                });
                if (Object.keys(restoredSnapshots).length > 0) {
                    setSavedODFormData(restoredSnapshots);
                    setSavedODItems(restoredSavedODKeys);
                }
            }
        } catch (error) {
            console.error("Error loading progress:", error);
        }
    };

    // Save progress whenever statuses change
    useEffect(() => {
        const timer = setTimeout(() => {
            saveCurrentProgress();
        }, 2000); // Debounce save

        return () => clearTimeout(timer);
    }, [outsideStatuses, insideStatuses, unitStatuses, urlBuilding, activeInspectionUnit]);

    const saveCurrentProgress = async () => {
        if (!id || !user) return;

        try {
            const promises = [];

            if (Object.keys(outsideStatuses).length > 0) {
                const isComplete = outsideItemsList.every(item => outsideStatuses[item] !== null && outsideStatuses[item] !== undefined);
                promises.push(inspectionsAPI.saveProgress({
                    property_id: id,
                    unit_id: urlBuilding,
                    inspection_type: 'Outside',
                    responses: outsideStatuses,
                    building_id: urlBuilding,
                    inspectionData: { isComplete }
                }));
            }

            if (Object.keys(insideStatuses).length > 0) {
                const isComplete = insideItemsList.every(item => insideStatuses[item] !== null && insideStatuses[item] !== undefined);
                promises.push(inspectionsAPI.saveProgress({
                    property_id: id,
                    unit_id: urlBuilding,
                    inspection_type: 'Inside',
                    responses: insideStatuses,
                    building_id: urlBuilding,
                    inspectionData: { isComplete }
                }));
            }

            if (Object.keys(unitStatuses).length > 0 && activeInspectionUnit) {
                // Check if all items are filled to mark as fully complete
                const isComplete = unitItemsList.every(item => {
                    const status = unitStatuses[item];
                    return status !== null && status !== undefined;
                });

                promises.push(inspectionsAPI.saveProgress({
                    property_id: id,
                    unit_id: activeInspectionUnit,
                    inspection_type: `unit_${urlBuilding}_${activeInspectionUnit}`,
                    responses: unitStatuses,
                    building_id: urlBuilding,
                    inspectionData: { isComplete }
                }));
            }

            await Promise.all(promises);
            await refreshCompletedUnits();
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    };

    useEffect(() => {
        if (activeInspectionUnit) {
            loadSavedProgress();
        }
    }, [activeInspectionUnit]);

    const fetchData = async () => {
        try {
            setLoading(true)
            const [propRes, userRes] = await Promise.all([
                propertiesAPI.getById(id),
                authAPI.getMe()
            ])

            if (propRes.success) {
                setProperty(propRes.property)
                try {
                    const unitsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/inspections/sample-units`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ propertyId: id })
                    });
                    const unitsData = await unitsRes.json();
                    if (unitsData.success) {
                        setUnits([...(unitsData.data.primaryUnits || []), ...(unitsData.data.alternateUnits || [])]);
                    }
                } catch (e) {
                    console.error("Error fetching units:", e);
                }
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

    const handleStatusChange = (section: 'outside' | 'inside' | 'unit', itemName: string, status: ItemStatus) => {
        // Intercept General Comment items → open simple note+image modal
        if (itemName.toLowerCase().includes('general comment')) {
            setCurrentGeneralSection(section);
            setCurrentGeneralItem(itemName);
            setGeneralNote('');
            setGeneralImage(null);
            setIsGeneralModalOpen(true);
            return;
        }

        if (status === 'OD') {
            const cleanCategory = itemName.split('. ')[1] || itemName;
            setCurrentSection(section);
            setCurrentModalItem(itemName);

            // If this item was previously saved, pre-fill the form with saved data
            const savedKey = `${urlBuilding}:${section}:${itemName}`;
            const unitVal = section === 'unit' ? (activeInspectionUnit || '-') : '-';
            const existingFindings = propertyFindings.filter((f: any) =>
                f.item === itemName &&
                f.area === section &&
                f.unit === unitVal &&
                (f.building === urlBuilding || f.building === buildingName)
            );

            setOdForm({
                category: cleanCategory,
                note: "",
                location: "Building Site S",
                healthAndSafety: "",
                repairBy: "",
                codeAndCompliance: "",
                deficiencySelected: "",
                deficiencyDetail: ""
            });
            setSelectedDeficiency(null);
            setPhotos([]);
            setLastSavedFindingId(null);
            setModalStep(existingFindings.length > 0 ? 4 : 1);
            setIsODModalOpen(true);
            return;
        }

        // If status is being changed away from OD, clean up the saved finding
        if ((status as string) !== 'OD') {
            const savedKey = `${urlBuilding}:${section}:${itemName}`;
            setSavedODItems(prev => {
                const next = new Set(prev);
                next.delete(savedKey);
                return next;
            });
            // Also remove from state to keep summary in sync
            setPropertyFindings(prev => {
                const unitVal = section === 'unit' ? (activeInspectionUnit || '-') : '-';
                return prev.filter((f: any) =>
                    !(f.item === itemName && f.area === section && f.unit === unitVal && (f.building === urlBuilding || f.building === buildingName))
                );
            });
        }

        if (section === 'outside') {
            setOutsideStatuses(prev => ({
                ...prev,
                [itemName]: prev[itemName] === status ? null : status
            }));
        } else if (section === 'inside') {
            setInsideStatuses(prev => ({
                ...prev,
                [itemName]: prev[itemName] === status ? null : status
            }));
        } else {
            setUnitStatuses(prev => ({
                ...prev,
                [itemName]: prev[itemName] === status ? null : status
            }));
        }
    };

    const selectAll = (section: 'outside' | 'inside' | 'unit', status: ItemStatus) => {
        const list = section === 'outside' ? outsideItemsList : section === 'inside' ? insideItemsList : unitItemsList;
        const currentStatuses = section === 'outside' ? outsideStatuses : section === 'inside' ? insideStatuses : unitStatuses;

        // Items with saved OD findings are always locked to 'OD'
        const itemsWithFindings = new Set(
            Array.from(savedODItems)
                .filter(key => key.startsWith(`${section}:`))
                .map(key => key.slice(section.length + 1))
        );

        // IMPORTANT: Only touch items that are either:
        // 1. Currently unset (null) — so we never overwrite user's existing selections
        // 2. Already set to THIS same status — so the toggle (undo) still works
        // This prevents "Select All OD" from wiping existing No OD / N/A selections
        const itemsToToggle = list.filter(item =>
            !itemsWithFindings.has(item) &&
            (currentStatuses[item] === null || currentStatuses[item] === undefined || currentStatuses[item] === status)
        );

        const allSelected = itemsToToggle.length > 0 && itemsToToggle.every(item => currentStatuses[item] === status);

        const newStatuses: Record<string, ItemStatus> = { ...currentStatuses };

        itemsToToggle.forEach(item => {
            newStatuses[item] = allSelected ? null : status;
        });

        // Always keep saved OD items as 'OD'
        itemsWithFindings.forEach(item => {
            newStatuses[item] = 'OD';
        });

        if (section === 'outside') setOutsideStatuses(newStatuses);
        else if (section === 'inside') setInsideStatuses(newStatuses);
        else setUnitStatuses(newStatuses);
    };

    const handleODModalClose = () => {
        setIsODModalOpen(false);
        setSelectedDeficiency(null);
        setDetailFilterName(null);
        setGuideDeficiency(null);
        setLastSavedFindingId(null);
        setPhotos([]);
        setOdForm({ category: "", note: "", location: "Building Site S", healthAndSafety: "", repairBy: "", codeAndCompliance: "", deficiencySelected: "", deficiencyDetail: "" });
    };

    const handleClearAndGoBack = () => {
        // Reset all OD modal fields
        setIsODModalOpen(false);
        setSelectedDeficiency(null);
        setDetailFilterName(null);
        setGuideDeficiency(null);
        setLastSavedFindingId(null);
        setPhotos([]);
        setOdForm({ category: "", note: "", location: "Building Site S", healthAndSafety: "", repairBy: "", codeAndCompliance: "", deficiencySelected: "", deficiencyDetail: "" });
        // Navigate back to the unit/inside/outside screen
        router.back();
    };

    const resetFormForNewDeficiency = () => {
        setSelectedDeficiency(null);
        setDetailFilterName(null);
        setPhotos([]);
        setLastSavedFindingId(null);
        setOdForm(prev => ({
            ...prev,
            deficiencySelected: "",
            deficiencyDetail: "",
            note: "",
        }));
        setModalStep(2);
    };

    const persistItemFindings = async (mergedFindings: any[], updatedStatuses: Record<string, ItemStatus>) => {
        const type = currentSection === 'unit' ? `unit_${urlBuilding}_${activeInspectionUnit}` : (currentSection!.charAt(0).toUpperCase() + currentSection!.slice(1));
        const isComplete = currentSection === 'outside'
            ? outsideItemsList.every(item => updatedStatuses[item] !== null && updatedStatuses[item] !== undefined)
            : currentSection === 'inside'
                ? insideItemsList.every(item => updatedStatuses[item] !== null && updatedStatuses[item] !== undefined)
                : currentSection === 'unit'
                    ? unitItemsList.every(item => updatedStatuses[item] !== null && updatedStatuses[item] !== undefined)
                    : false;

        setPropertyFindings(mergedFindings);

        await inspectionsAPI.saveProgress({
            property_id: property?._id || params.id,
            unit_id: currentSection === 'unit' ? activeInspectionUnit : urlBuilding,
            building_id: urlBuilding,
            inspection_type: type,
            responses: updatedStatuses,
            inspectionData: {
                findings: mergedFindings,
                isComplete,
                odFormSnapshots: savedODFormData,
            }
        });
    };

    const handleRemoveSavedFinding = async (findingId: string) => {
        if (!confirm('Remove this saved deficiency from the report?')) return;

        const updatedFindings = propertyFindings.filter((f: any) => f.id !== findingId);
        const currentStatuses = currentSection === 'outside' ? outsideStatuses
            : currentSection === 'inside' ? insideStatuses
                : unitStatuses;

        const itemFindingsLeft = updatedFindings.filter((f: any) =>
            f.item === currentModalItem &&
            f.area === currentSection &&
            f.unit === getCurrentItemUnit() &&
            (f.building === urlBuilding || f.building === buildingName)
        );

        let updatedStatuses = { ...currentStatuses } as Record<string, ItemStatus>;
        if (itemFindingsLeft.length === 0 && currentModalItem) {
            updatedStatuses[currentModalItem] = null;
            const savedKey = `${urlBuilding}:${currentSection}:${currentModalItem}`;
            setSavedODItems(prev => {
                const next = new Set(prev);
                next.delete(savedKey);
                return next;
            });
        }

        if (currentSection === 'outside') setOutsideStatuses(updatedStatuses);
        else if (currentSection === 'inside') setInsideStatuses(updatedStatuses);
        else setUnitStatuses(updatedStatuses);

        try {
            await persistItemFindings(updatedFindings, updatedStatuses);
            toast.success('Deficiency removed', { position: 'top-right' });
            if (itemFindingsLeft.length === 0) {
                setModalStep(1);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to remove deficiency');
        }
    };

    const handleGeneralModalClose = () => {
        setIsGeneralModalOpen(false);
        setGeneralNote('');
        setGeneralImage(null);
        setCurrentGeneralSection(null);
        setCurrentGeneralItem(null);
    };

    const handleSaveGeneralComment = () => {
        if (currentGeneralSection && currentGeneralItem) {
            if (currentGeneralSection === 'outside') {
                setOutsideStatuses(prev => ({ ...prev, [currentGeneralItem!]: 'OD' }));
            } else if (currentGeneralSection === 'inside') {
                setInsideStatuses(prev => ({ ...prev, [currentGeneralItem!]: 'OD' }));
            } else {
                setUnitStatuses(prev => ({ ...prev, [currentGeneralItem!]: 'OD' }));
            }
        }
        toast.success('General comment saved!', { position: 'top-right' });
        handleGeneralModalClose();
    };

    const handleGeneralImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingGeneralImage(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', 'nspire-inspections/general-comments');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/ai/upload-image`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setGeneralImage(data.data.url);
                toast.success('Image uploaded!', { position: 'top-right' });
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch {
            toast.error('Image upload failed. Please try again.', { position: 'top-right' });
        } finally {
            setIsUploadingGeneralImage(false);
            if (generalFileInputRef.current) generalFileInputRef.current.value = '';
        }
    };

    const handleOpenSelection = (type: 'selected' | 'detail' | 'criteria') => {
        setSelectionType(type);
        setModalStep(3);
    };

    const handleDeficiencySelect = (def: DeficiencyDetail) => {
        const allDefs = getFilteredDeficiencies();
        const normalizedSelected = def.selected.trim().toLowerCase();
        const matchingDetails = allDefs.filter(d => d.selected.trim().toLowerCase() === normalizedSelected);

        if (selectionType === 'selected' && matchingDetails.length > 1) {
            setDetailFilterName(def.selected.trim());
            setSelectionType('detail');
            return;
        }

        setSelectedDeficiency(def);
        setOdForm(prev => ({
            ...prev,
            deficiencySelected: def.selected.trim(),
            deficiencyDetail: def.detail,
            healthAndSafety: def.healthAndSafety,
            repairBy: def.repairBy,
            codeAndCompliance: def.codeAndCompliance,
            location: def.location || prev.location
        }));
        setModalStep(2);
    };

    const [reportUrl, setReportUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleProceed = async () => {
        if (!selectedDeficiency) {
            toast.error("Please select a deficiency");
            return;
        }
        if (photos.length === 0) {
            toast.error("Please upload a photo first");
            return;
        }

        setIsAnalyzing(true);
        const toastId = toast.loading("AI is analyzing the photo...", { autoClose: false });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/ai/inspect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl: photos[0],
                    propertyId: property?._id || params.id, // Use property._id or params.id as propertyId
                    inspectorId: user?.id || user?._id,
                    inspectionId: null, // Let backend create new inspection
                    deficiencyData: {
                        category: mapToBackendCategory(odForm.category),
                        subCategory: odForm.category, // Keep original as subCategory
                        note: odForm.note,
                        location: odForm.location,
                        healthAndSafety: odForm.healthAndSafety,
                        repairBy: odForm.repairBy,
                        codeAndCompliance: odForm.codeAndCompliance,
                        selectedDeficiency: selectedDeficiency
                    }
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.update(toastId, { render: "Analysis Complete! Item marked as inspected.", type: "success", isLoading: false, autoClose: 2000 });

                // Result is nested in data.data or data.analysis depending on controller path
                const resultData = data.data || data;
                const analysisResult = resultData.deficiency || data.analysis;

                const unitVal = getCurrentItemUnit();
                const def = selectedDeficiency;
                const newFindingId = `DEF-${Date.now()}`;
                
                // Get Standard and Inspection Protocol from JSON data
                const standardProtocolData = getInspectionStandardAndProtocol(
                    currentSection as 'outside' | 'inside' | 'unit',
                    odForm.category,
                    def.selected
                );
                
                const newFinding = {
                    id: newFindingId,
                    imageUri: photos[0],
                    title: def.selected || analysisResult?.defect || odForm.category,
                    description: def.detail || analysisResult?.description || analysisResult?.comment || 'Deficiency detected by AI inspection',
                    category: odForm.category,
                    building: buildingName,
                    unit: unitVal,
                    location: def.location || odForm.location,
                    severity: def.healthAndSafety || analysisResult?.severity || odForm.healthAndSafety || 'Moderate',
                    healthAndSafety: def.healthAndSafety || odForm.healthAndSafety || analysisResult?.severity || 'Moderate',
                    repairBy: def.repairBy || odForm.repairBy || '30 Days',
                    codeAndCompliance: def.codeAndCompliance || odForm.codeAndCompliance,
                    notes: odForm.note,
                    standard: standardProtocolData?.standard || '',
                    inspectionProtocol: standardProtocolData?.inspectionProtocol || '',
                    nspireCode: def.id || analysisResult?.nspireCode || 'HS-12',
                    status: 'Open',
                    timestamp: new Date().toISOString(),
                    area: currentSection,
                    item: currentModalItem
                };

                const currentStatuses = currentSection === 'outside' ? outsideStatuses
                    : currentSection === 'inside' ? insideStatuses
                        : unitStatuses;

                const updatedStatuses = {
                    ...currentStatuses,
                    [currentModalItem as string]: 'OD'
                };

                if (currentSection === 'outside') setOutsideStatuses(updatedStatuses as Record<string, ItemStatus>);
                else if (currentSection === 'inside') setInsideStatuses(updatedStatuses as Record<string, ItemStatus>);
                else setUnitStatuses(updatedStatuses as Record<string, ItemStatus>);

                const mergedFindings = [...propertyFindings, newFinding];
                await persistItemFindings(mergedFindings, updatedStatuses as Record<string, ItemStatus>);

                toast.success('Deficiency saved. Add another or continue inspection.', { position: 'top-right' });

                setAnalysisResult(analysisResult);
                setLastSavedFindingId(newFindingId);
                if (resultData.reportUrl) {
                    setReportUrl(resultData.reportUrl);
                }
                if (currentSection && currentModalItem) {
                    const savedKey = `${urlBuilding}:${currentSection}:${currentModalItem}`;
                    setSavedODItems(prev => new Set(prev).add(savedKey));
                }
                setSelectedDeficiency(null);
                setPhotos([]);
                setModalStep(4);

            } else {
                throw new Error(data.message || "Analysis failed");
            }
        } catch (error: any) {
            console.error("AI Analysis error:", error);
            toast.update(toastId, { render: `Analysis failed: ${error.message}`, type: "error", isLoading: false, autoClose: 4000 });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading("Uploading image...", { autoClose: false });

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', 'nspire-inspections/deficiencies');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'}/api/ai/upload-image`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setPhotos([data.data.url]);
                toast.update(toastId, { render: "Image uploaded! Damage detected.", type: "success", isLoading: false, autoClose: 3000 });
                // Simulate analysis effect
                setIsAnalyzing(true);
                setTimeout(() => setIsAnalyzing(false), 2000);
            } else {
                throw new Error(data.message || "Upload failed");
            }
        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Upload failed. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const getFilteredDeficiencies = () => {
        if (!currentModalItem) return [];
        // Remove "1. " prefix and any trailing extra text
        const baseName = currentModalItem.replace(/^\d+\.\s+/, '').trim();

        // Mapping assignment:
        // outside -> outsideDeficiencyMapping
        // inside  -> unitDeficiencyMapping
        // unit    -> insideDeficiencyMapping
        const mapping = currentSection === 'outside'
            ? outsideDeficiencyMapping
            : currentSection === 'inside'
                ? unitDeficiencyMapping
                : insideDeficiencyMapping;

        // Try exact match first (case-insensitive)
        const exactKey = Object.keys(mapping).find(k => k.toLowerCase() === baseName.toLowerCase());
        if (exactKey) return mapping[exactKey];

        // Fallback to fuzzy match
        const matchedKey = Object.keys(mapping).find(k => {
            const nk = k.toLowerCase();
            const nb = baseName.toLowerCase();
            if (nb.includes(nk) || nk.includes(nb)) return true;

            // Special case for Paint to be more resilient
            if (nb.includes('paint') && nk.includes('paint')) return true;

            // Other keywords could be added here if needed
            return false;
        });

        return matchedKey ? mapping[matchedKey] : [];
    };

    const getDisplayDeficiencies = () => {
        const allDefs = getFilteredDeficiencies();
        if (selectionType === 'selected') {
            const seen = new Set();
            return allDefs.filter(def => {
                const normalized = def.selected.trim().toLowerCase();
                if (seen.has(normalized)) return false;
                seen.add(normalized);
                return true;
            });
        }
        if (selectionType === 'detail' && detailFilterName) {
            const currentSelected = detailFilterName.trim().toLowerCase();
            return allDefs.filter(def => def.selected.trim().toLowerCase() === currentSelected);
        }
        return allDefs;
    };

    const renderTable = (section: 'outside' | 'inside' | 'unit', items: string[], statuses: Record<string, ItemStatus>) => (
        <div className="bg-white p-3 sm:p-6 animate-in slide-in-from-top duration-300">
            {/* Mobile View - Card Layout - Bulk Actions */}
            <div className="block md:hidden mb-4 p-2 bg-gray-50 rounded-xl border border-gray-100">
                <div className="space-y-2">
                    <Button
                        onClick={() => selectAll(section, 'No OD')}
                        className={`w-full text-[10px] h-10 font-bold flex items-center justify-center gap-2 uppercase rounded-lg shadow-sm transition-all ${(() => {
                            const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                            return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'No OD');
                        })() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#006795] hover:bg-[#0a5670] text-white'
                            }`}
                    >
                        <div className="w-4 h-4 bg-white/20 border border-white/40 flex items-center justify-center rounded">
                            {(() => {
                                const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'No OD') ? <Check className="w-3 h-3 text-white" strokeWidth={4} /> : null;
                            })()}
                        </div>
                        Select All No OD
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => selectAll(section, 'OD')}
                            className={`w-full text-[10px] h-10 font-bold flex items-center justify-center gap-2 uppercase rounded-lg shadow-sm border transition-all ${(() => {
                                const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'OD');
                            })() ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'bg-white hover:bg-red-50 text-[#DC2626] border-[#DC2626]'
                                }`}
                        >
                            <div className={`w-4 h-4 border flex items-center justify-center rounded ${(() => {
                                const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'OD');
                            })() ? 'bg-white/20 border-white/40' : 'bg-white border-[#DC2626]'
                                }`}>
                                {(() => {
                                    const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                    return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'OD') ? <Check className="w-3 h-3 text-white" strokeWidth={4} /> : null;
                                })()}
                            </div>
                            Observe Deficiency
                        </Button>
                        <Button
                            onClick={() => selectAll(section, 'N/A')}
                            className={`w-full text-[10px] h-10 font-bold flex items-center justify-center gap-2 uppercase rounded-lg shadow-sm transition-all ${(() => {
                                const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'N/A');
                            })() ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-[#006795] hover:bg-[#0a5670] text-white'
                                }`}
                        >
                            <div className="w-4 h-4 bg-white/20 border border-white/40 flex items-center justify-center rounded">
                                {(() => {
                                    const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                    return toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'N/A') ? <Check className="w-3 h-3 text-white" strokeWidth={4} /> : null;
                                })()}
                            </div>
                            Select All N/A
                        </Button>
                    </div>
                </div>
            </div>

            <div className="block md:hidden space-y-3">
                {items.map((item, index) => {
                    const isGeneral = item.toLowerCase().includes('general comment');
                    return (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="font-bold text-xs text-gray-800 mb-3 text-left">{item}</div>
                            {isGeneral ? (
                                <button
                                    onClick={() => handleStatusChange(section, item, 'OD')}
                                    className="w-full py-3 rounded text-[11px] font-bold bg-[#006795] hover:bg-[#0a5670] text-white shadow-sm transition-all uppercase tracking-wider"
                                >
                                    General Comment
                                </button>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => handleStatusChange(section, item, 'No OD')}
                                        className={`py-2 px-2 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'No OD'
                                            ? 'bg-green-50 border-green-500 text-green-700'
                                            : 'bg-white border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        No OD
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(section, item, 'OD')}
                                        className={`py-2 px-2 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'OD'
                                            ? 'bg-red-50 border-red-500 text-red-700'
                                            : 'bg-white border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        OD
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(section, item, 'N/A')}
                                        className={`py-2 px-2 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'N/A'
                                            ? 'bg-gray-50 border-gray-400 text-gray-700'
                                            : 'bg-white border-gray-200 text-gray-400'
                                            }`}
                                    >
                                        N/A
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto font-sans">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-100">
                            <th className="text-center py-4 px-4 text-xs font-black text-gray-900 uppercase">Outline Items</th>
                            <th className="py-2 px-2">
                                <Button onClick={() => selectAll(section, 'No OD')} className="w-full bg-[#006795] hover:bg-[#0a5670] text-white text-[10px] h-8 font-bold flex items-center gap-1.5 px-3 uppercase">
                                    <div className="w-3 h-3 bg-white border border-cyan-800 flex items-center justify-center">
                                        {(() => {
                                            const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                            const isChecked = toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'No OD');
                                            return isChecked ? <Check className="w-2.5 h-2.5 text-cyan-800" strokeWidth={4} /> : null;
                                        })()}
                                    </div>
                                    Select All No OD
                                </Button>
                            </th>
                            <th className="py-2 px-2">
                                <Button onClick={() => selectAll(section, 'OD')} className="w-full bg-white hover:bg-red-50 text-[#DC2626] border border-[#DC2626] text-[10px] h-8 font-bold flex items-center gap-1.5 px-3 uppercase">
                                    <div className="w-3 h-3 bg-white border border-[#DC2626] flex items-center justify-center">
                                        {(() => {
                                            const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                            const isChecked = toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'OD');
                                            return isChecked ? <Check className="w-2.5 h-2.5 text-[#DC2626]" strokeWidth={4} /> : null;
                                        })()}
                                    </div>
                                    Observe Deficiency
                                </Button>
                            </th>
                            <th className="py-2 px-2">
                                <Button onClick={() => selectAll(section, 'N/A')} className="w-full bg-[#006795] hover:bg-[#0a5670] text-white text-[10px] h-8 font-bold flex items-center gap-1.5 px-3 uppercase">
                                    <div className="w-3 h-3 bg-white border border-cyan-800 flex items-center justify-center">
                                        {(() => {
                                            const toggleableItems = items.filter(i => !savedODItems.has(`${section}:${i}`));
                                            const isChecked = toggleableItems.length > 0 && toggleableItems.every(item => statuses[item] === 'N/A');
                                            return isChecked ? <Check className="w-2.5 h-2.5 text-cyan-800" strokeWidth={4} /> : null;
                                        })()}
                                    </div>
                                    Select All N/A
                                </Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.map((item, index) => {
                            const isGeneral = item.toLowerCase().includes('general comment');
                            return (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4 text-xs font-bold text-gray-800 text-left">{item}</td>
                                    {isGeneral ? (
                                        <td colSpan={3} className="py-2 px-2 text-center">
                                            <button
                                                onClick={() => handleStatusChange(section, item, 'OD')}
                                                className="w-full py-2.5 rounded text-[11px] font-bold bg-[#006795] hover:bg-[#0a5670] text-white shadow-sm transition-all uppercase tracking-wider"
                                            >
                                                General Comment
                                            </button>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="py-1 px-2 text-center">
                                                <button onClick={() => handleStatusChange(section, item, 'No OD')} className={`w-full py-1.5 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'No OD' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                                                    No OD
                                                </button>
                                            </td>
                                            <td className="py-1 px-2 text-center">
                                                <button onClick={() => handleStatusChange(section, item, 'OD')} className={`w-full py-1.5 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'OD' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                                                    OD
                                                </button>
                                            </td>
                                            <td className="py-1 px-2 text-center">
                                                <button onClick={() => handleStatusChange(section, item, 'N/A')} className={`w-full py-1.5 rounded text-[10px] font-bold border transition-all ${statuses[item] === 'N/A' ? 'bg-gray-50 border-gray-400 text-gray-700' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
                                                    N/A
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const outsideProgress = useMemo(() => {
        const completed = Object.values(outsideStatuses).filter(s => s !== null).length;
        return { completed, percentage: Math.round((completed / (outsideItemsList.length || 1)) * 100) };
    }, [outsideStatuses]);

    const insideProgress = useMemo(() => {
        const completed = Object.values(insideStatuses).filter(s => s !== null).length;
        return { completed, percentage: Math.round((completed / (insideItemsList.length || 1)) * 100) };
    }, [insideStatuses]);



    // Build the raw unit identifiers list
    const rawUnitIds = useMemo(() => {
        if (searchParams.has('totalUnits')) {
            const count = parseInt(searchParams.get('totalUnits') || '0', 10);
            if (count > 0) {
                return Array.from({ length: count }, (_, i) => `Unit ${String(i + 1).padStart(3, '0')}`);
            }
            return [];
        }
        if (urlTotalUnits > 0) {
            return Array.from({ length: urlTotalUnits }, (_, i) => `Unit ${String(i + 1).padStart(3, '0')}`);
        }
        if (units && units.length > 0) {
            return units.map(u => u.unitNumber || u.unitId || String(u));
        }
        if (property && property.units > 0) {
            return Array.from({ length: property.units }, (_, i) => `${i + 1}`);
        }
        return [];
    }, [searchParams, urlTotalUnits, units, property]);

    const unitProgress = useMemo(() => {
        const unitsOnly = completedUnits.filter(u => u !== 'Outside' && u !== 'Inside');
        const completed = unitsOnly.length;
        const total = rawUnitIds.length > 0 ? rawUnitIds.length : 1;
        return { completed, percentage: Math.round((completed / total) * 100), total };
    }, [completedUnits, rawUnitIds]);

    // Display unit names (edited names take priority)
    const unitsString = useMemo(() => {
        if (rawUnitIds.length === 0) return "No units found";
        return rawUnitIds.map(uid => unitNames[uid] || uid).join(", ");
    }, [rawUnitIds, unitNames]);

    // Open unit edit modal
    const openUnitEditModal = () => {
        const temp: Record<string, string> = {};
        rawUnitIds.forEach(uid => { temp[uid] = unitNames[uid] || uid; });
        setTempUnitNames(temp);
        setEditUnitsModalOpen(true);
    };

    // Save unit names
    const handleSaveUnitNames = () => {
        setUnitNames({ ...tempUnitNames });
        setEditUnitsModalOpen(false);
        toast.success('Unit names updated successfully!', { position: 'top-right' });
    };

    // Open building edit modal
    const openBuildingEditModal = () => {
        setTempBuildingName(buildingName);
        setEditBuildingModalOpen(true);
    };

    // Save building name
    const handleSaveBuildingName = () => {
        setBuildingName(tempBuildingName.trim() || 'B1');
        setEditBuildingModalOpen(false);
        toast.success('Building name updated successfully!', { position: 'top-right' });
    };

    if (loading) {
        return (
            <ManagementDashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
                </div>
            
            
            {/* Standard Modal */}
            {showStandardModal && selectedDeficiency && (() => {
                const dataResult = getInspectionStandardAndProtocol(
                    currentSection as 'outside' | 'inside' | 'unit',
                    odForm.category,
                    selectedDeficiency.selected
                );
                
                console.log('[Standard Modal Debug]', {
                    category: odForm.category,
                    deficiency: selectedDeficiency.selected,
                    section: currentSection,
                    hasData: !!dataResult,
                    standardValue: dataResult?.standard
                });
                
                return (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4" onClick={() => setShowStandardModal(false)}>
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-blue-600 p-5 flex items-center justify-between">
                                <h3 className="text-lg font-black text-white">STANDARD - {selectedDeficiency.selected}</h3>
                                <button onClick={() => setShowStandardModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                                {dataResult?.standard ? (
                                    <div className="prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
{dataResult.standard}</pre>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 italic mb-2">No standard information available for this deficiency.</p>
                                        <p className="text-xs text-gray-400">Category: {odForm.category}</p>
                                        <p className="text-xs text-gray-400">Deficiency: {selectedDeficiency.selected}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Inspection Protocol Modal */}
            {showProtocolModal && selectedDeficiency && (() => {
                const dataResult = getInspectionStandardAndProtocol(
                    currentSection as 'outside' | 'inside' | 'unit',
                    odForm.category,
                    selectedDeficiency.selected
                );
                
                console.log('[Protocol Modal Debug]', {
                    category: odForm.category,
                    deficiency: selectedDeficiency.selected,
                    section: currentSection,
                    hasData: !!dataResult,
                    protocolValue: dataResult?.inspectionProtocol
                });
                
                return (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4" onClick={() => setShowProtocolModal(false)}>
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-green-600 p-5 flex items-center justify-between">
                                <h3 className="text-lg font-black text-white">INSPECTION PROTOCOL (INTERNATIONAL) - {selectedDeficiency.selected}</h3>
                                <button onClick={() => setShowProtocolModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                                {dataResult?.inspectionProtocol ? (
                                    <div className="prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
{dataResult.inspectionProtocol}</pre>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 italic mb-2">No inspection protocol information available for this deficiency.</p>
                                        <p className="text-xs text-gray-400">Category: {odForm.category}</p>
                                        <p className="text-xs text-gray-400">Deficiency: {selectedDeficiency.selected}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
            </ManagementDashboardLayout>
        )
    }

    return (
        <ManagementDashboardLayout>
            <div className="p-2 sm:p-3 lg:p-4 max-w-7xl mx-auto font-sans">
                {/* Header with Logo and User */}
                <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-[#006795] to-[#0891B2] px-4 py-3 rounded-xl shadow-sm">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    
                    {/* Logo in center */}
                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-lg px-3 py-1.5 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#006795]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4 0-7-3-7-7V8.3l7-3.11 7 3.11V13c0 4-3 7-7 7z"/>
                                <path d="M10.5 13l-2-2-1.41 1.41L10.5 15.83l6-6L15.09 8.41z"/>
                            </svg>
                            <span className="text-xs font-black text-[#006795] tracking-tight">NSPIRE INSPECTION</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{user?.fullName || "Guest"}</span>
                        <div className="w-2 h-1 border-2 border-white rotate-45 border-t-0 border-l-0" />
                    </div>
                </div>
                
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{columnHeaderName}: {buildingName}</p>
                        <button
                            onClick={openBuildingEditModal}
                            className="p-1.5 rounded-full hover:bg-[#006795]/10 text-[#006795] transition-colors"
                            title="Edit building name"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>

                    <Button
                        onClick={() => router.push(`/management/management/dashboard/inspection/summary?propertyId=${id}`)}
                        className="bg-[#006795] hover:bg-[#0a5670] text-white font-black px-6 rounded-xl shadow-md uppercase tracking-widest text-[10px] flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        View deficiency
                    </Button>
                </div>



                {/* Edit Building Name Modal */}
                {editBuildingModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b">
                                <h3 className="text-lg font-bold text-gray-900">Edit Building Name</h3>
                                <button onClick={() => setEditBuildingModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Building Name</label>
                                <input
                                    type="text"
                                    value={tempBuildingName}
                                    onChange={(e) => setTempBuildingName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006795] focus:border-transparent text-sm"
                                    placeholder="Enter building name"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3 p-5 border-t bg-gray-50">
                                <button
                                    onClick={() => setEditBuildingModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveBuildingName}
                                    className="flex-1 px-4 py-3 bg-[#006795] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Unit Names Modal */}
                {editUnitsModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b">
                                <h3 className="text-lg font-bold text-gray-900">Edit Unit Names</h3>
                                <button onClick={() => setEditUnitsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
                                {rawUnitIds.map((uid) => (
                                    <div key={uid} className="flex items-center gap-3">
                                        <label className="text-sm font-semibold text-gray-500 w-20 shrink-0">Unit {uid}</label>
                                        <input
                                            type="text"
                                            value={tempUnitNames[uid] || ''}
                                            onChange={(e) => setTempUnitNames(prev => ({ ...prev, [uid]: e.target.value }))}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006795] focus:border-transparent text-sm"
                                            placeholder={`Unit ${uid}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 p-5 border-t bg-gray-50">
                                <button
                                    onClick={() => setEditUnitsModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveUnitNames}
                                    className="flex-1 px-4 py-3 bg-[#006795] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Save All
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sections */}
                {['outside', 'inside', 'unit'].map((sec) => (
                    <div key={sec} className="mb-6 border border-blue-100/50 rounded-lg overflow-hidden shadow-sm">
                        <div className="w-full bg-[#EBF5FF] p-4 flex items-center justify-between transition-colors text-left font-black">
                            <div className="flex-1">
                                <p className="text-sm text-[#006795] mb-1 uppercase tracking-tight">
                                    {sec === 'outside' ? 'Outside (Areas affected by Rain, Snow, Wind)' : sec === 'inside' ? 'Inside (Interior Common area, Utility closet, Mechanical rooms)' : 'Units (Individual unit inspections)'}
                                </p>
                                <div className="flex items-center gap-4 mb-2 text-[#006795]">
                                    <p className="text-[11px]">({sec === 'outside' ? outsideProgress.completed : sec === 'inside' ? insideProgress.completed : unitProgress.completed}/{sec === 'outside' ? outsideItemsList.length : sec === 'inside' ? insideItemsList.length : unitProgress.total})</p>
                                    <p className="text-[11px]">{sec === 'outside' ? outsideProgress.percentage : sec === 'inside' ? insideProgress.percentage : unitProgress.percentage}% Completed</p>
                                </div>
                                <div className="w-full h-2 bg-white rounded-full overflow-hidden max-w-4xl shadow-inner">
                                    <div className="h-full bg-[#006795] transition-all duration-500" style={{ width: `${sec === 'outside' ? outsideProgress.percentage : sec === 'inside' ? insideProgress.percentage : unitProgress.percentage}%` }}></div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (sec === 'unit' && !activeInspectionUnit) {
                                        // If no unit selected yet, open the unit selection popup
                                        setUnitSelectionPopupOpen(true)
                                    } else {
                                        setExpandedSection(expandedSection === sec ? null : sec)
                                    }
                                }}
                                className="p-2 rounded-full hover:bg-blue-100/50"
                            >
                                {expandedSection === sec ? <ChevronUp className="w-6 h-6 text-[#006795]" /> : <ChevronDown className="w-6 h-6 text-[#006795]" />}
                            </button>
                        </div>
                        {expandedSection === sec && (
                            <div className="bg-white">
                                {sec === 'unit' && (
                                    <div className="p-4 sm:p-6 pb-0 space-y-4 border-b border-blue-50">
                                        {activeInspectionUnit && (
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006795]/10 text-[#006795] text-sm font-bold">
                                                    <User className="w-3.5 h-3.5" /> Inspecting: {activeInspectionUnit}
                                                </span>
                                                <button
                                                    onClick={() => setUnitSelectionPopupOpen(true)}
                                                    className="text-xs font-bold text-[#D92D20] hover:underline flex items-center gap-1 bg-[#D92D20]/10 hover:bg-[#D92D20]/20 px-2 py-1 rounded-md transition-colors"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Submit
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-bold text-gray-600 leading-relaxed">
                                                Units Under {buildingName} : <span className="text-gray-900 font-extrabold">{activeInspectionUnit || unitsString}</span>
                                            </p>
                                            <button
                                                onClick={openUnitEditModal}
                                                className="p-1.5 rounded-full hover:bg-[#006795]/10 text-[#006795] transition-colors"
                                                title="Edit unit names"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {renderTable(sec as any, sec === 'outside' ? outsideItemsList : sec === 'inside' ? insideItemsList : unitItemsList, sec === 'outside' ? outsideStatuses : sec === 'inside' ? insideStatuses : unitStatuses)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Unit Selection Popup - shown when user clicks Units section without a unit selected */}
            {unitSelectionPopupOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
                    onClick={() => setUnitSelectionPopupOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] p-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-white tracking-tight">
                                    {buildingName} — Select Unit
                                </h3>
                                <p className="text-xs text-white/80 mt-0.5 font-medium">
                                    {rawUnitIds.length > 0
                                        ? `${rawUnitIds.length} units available`
                                        : 'No units allocated to this building'}
                                </p>
                            </div>
                            <button
                                onClick={() => setUnitSelectionPopupOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Progress bar placeholder */}
                        <div className="px-5 pt-4 pb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] h-2 rounded-full transition-all duration-500" style={{ width: '0%' }} />
                            </div>
                        </div>

                        {/* Unit List */}
                        <div className="p-5 overflow-y-auto max-h-[55vh] space-y-2">
                            {rawUnitIds.length > 0 ? (
                                rawUnitIds.map((unitName, idx) => {
                                    const displayName = popupUnitCustomNames[unitName] || unitName;
                                    const isEditing = editingUnitIdx === idx;
                                    return (
                                        <div
                                            key={unitName}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${activeInspectionUnit === displayName
                                                ? 'border-[#006795] bg-[#F1F7FE]'
                                                : 'border-gray-100 bg-white hover:border-[#006795]/30 hover:bg-[#F1F7FE]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${activeInspectionUnit === displayName ? 'bg-[#006795] text-white' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={editingUnitValue}
                                                                onChange={(e) => setEditingUnitValue(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        setPopupUnitCustomNames(prev => ({ ...prev, [unitName]: editingUnitValue.trim() || unitName }));
                                                                        setEditingUnitIdx(null);
                                                                    }
                                                                    if (e.key === 'Escape') setEditingUnitIdx(null);
                                                                }}
                                                                className="flex-1 px-2 py-1 border border-[#006795] rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#006795]/30"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    setPopupUnitCustomNames(prev => ({ ...prev, [unitName]: editingUnitValue.trim() || unitName }));
                                                                    setEditingUnitIdx(null);
                                                                }}
                                                                className="p-1 rounded-full bg-[#006795] text-white hover:bg-[#0a5670]"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setEditingUnitIdx(idx); setEditingUnitValue(displayName); }}
                                                                className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-[#006795] transition-colors shrink-0"
                                                                title="Rename unit"
                                                            >
                                                                <Pencil className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <p className={`text-[11px] font-medium ${completedUnits.includes(displayName) ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {completedUnits.includes(displayName) ? 'Completed' : 'Pending inspection'}
                                                    </p>
                                                </div>
                                            </div>
                                            {!isEditing && (
                                                <button
                                                    onClick={() => {
                                                        setActiveInspectionUnit(displayName)
                                                        setUnitSelectionPopupOpen(false)
                                                        setExpandedSection('unit')
                                                    }}
                                                    className="bg-[#006795] hover:bg-[#00567a] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1 ml-3 shrink-0"
                                                >
                                                    Start <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 px-4 text-gray-500">
                                    <p className="font-bold text-sm">No units allocated to this building.</p>
                                    <p className="text-xs text-gray-400 mt-1">This building has 0 allocated inspection units.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setUnitSelectionPopupOpen(false)}
                                className="w-full py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* General Comment Modal */}
            {isGeneralModalOpen && currentGeneralItem && (
                <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 -z-10" onClick={handleGeneralModalClose} />
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-top-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b">
                            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">{currentGeneralItem}</h3>
                            <button onClick={handleGeneralModalClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                            {/* Note text area */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Note</label>
                                <textarea
                                    value={generalNote}
                                    onChange={(e) => setGeneralNote(e.target.value)}
                                    placeholder="Enter your general comment here..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006795]/40 focus:border-[#006795] resize-none transition-all"
                                />
                            </div>

                            {/* Image upload */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Photo</label>
                                {generalImage ? (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                                        <img src={generalImage} alt="General comment" className="w-full h-40 object-cover" />
                                        <button
                                            onClick={() => setGeneralImage(null)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Take Photo */}
                                        <button
                                            onClick={() => generalFileInputRef.current?.click()}
                                            disabled={isUploadingGeneralImage}
                                            className="flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-[#006795]/40 rounded-xl text-[#006795] bg-[#F1F7FE] hover:bg-[#e1eef8] hover:border-[#006795] transition-all cursor-pointer"
                                        >
                                            {isUploadingGeneralImage ? (
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#006795]" />
                                            ) : (
                                                <Camera className="w-6 h-6" />
                                            )}
                                            <span className="text-[11px] font-bold">Take Photo</span>
                                        </button>
                                        {/* Upload from Gallery */}
                                        <button
                                            onClick={() => generalGalleryInputRef.current?.click()}
                                            disabled={isUploadingGeneralImage}
                                            className="flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer"
                                        >
                                            <ImageIcon className="w-6 h-6" />
                                            <span className="text-[11px] font-bold">Upload Photo</span>
                                        </button>
                                    </div>
                                )}
                                {/* Camera capture input */}
                                <input
                                    ref={generalFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={handleGeneralImageUpload}
                                />
                                {/* Gallery / file picker input */}
                                <input
                                    ref={generalGalleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleGeneralImageUpload}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-5 border-t bg-gray-50">
                            <button
                                onClick={handleGeneralModalClose}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveGeneralComment}
                                className="flex-1 px-4 py-3 bg-[#006795] hover:bg-[#0a5670] text-white rounded-xl text-sm font-bold transition-colors"
                            >
                                Save Comment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OD Modal - BULLETPROOF SCROLLING AND POSITIONING */}
            {isODModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-[1000] flex items-start justify-center p-4 sm:p-6 md:p-10 overflow-hidden isolate">
                    <div className="absolute inset-0 -z-10" onClick={handleODModalClose} />

                    <Card className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] animate-in slide-in-from-top-4 duration-300 flex flex-col h-auto max-h-[70vh] self-center">
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5 pointer-events-none rounded-3xl"
                            style={{ backgroundImage: "url(\'/shield-check.png\')" }}
                        ></div>
                        {/* Content Wrapper */}
                        <div className="relative z-10 h-full flex flex-col">
                        {/* Professional Header with Logo and Gradient */}
                        <div className="bg-gradient-to-r from-[#006795] to-[#0891B2] px-4 py-2.5 shrink-0 flex items-center justify-between sticky top-0 z-20 shadow-lg">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                {/* Website Logo */}
                                <div className="bg-white rounded-lg p-1.5 shrink-0">
                                    <img 
                                        src="/logo.png" 
                                        alt="Logo" 
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                                {/* Title */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">{currentModalItem}</h3>
                                    <p className="text-[10px] text-white/80 font-medium">NSPIRE Deficiency Inspection</p>
                                </div>
                            </div>
                            {/* Close Button */}
                            <button onClick={handleODModalClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white shrink-0 ml-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className={`flex-1 overflow-y-auto p-4 md:p-5 space-y-4 custom-scrollbar overscroll-contain ${modalStep === 4 ? 'hidden' : ''}`}>
                            {modalStep === 1 && (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    {/* Big Logo in Center */}
                                    <div className="mb-6">
                                        <img 
                                            src="/logo.png" 
                                            alt="Logo" 
                                            className="w-32 h-32 object-contain mx-auto"
                                        />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 mb-6 max-w-xs">{`No existing deficiency record for this item.`}</p>
                                    <Button onClick={() => setModalStep(2)} className="bg-[#006795] hover:bg-blue-700 text-white font-black px-10 h-12 rounded-2xl shadow-lg uppercase tracking-widest text-xs">Add New</Button>
                                </div>
                            )}

                            {modalStep === 2 && (
                                <div className="space-y-4 animate-in fade-in duration-300 pb-4">
                                    {savedItemFindings.length > 0 && (
                                        <div>
                                            {/* Big Logo Above Saved Items */}
                                            <div className="flex justify-center mb-6">
                                                <img 
                                                    src="/logo.png" 
                                                    alt="Logo" 
                                                    className="w-24 h-24 object-contain"
                                                />
                                            </div>
                                            
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                                                Already Saved ({savedItemFindings.length})
                                            </label>
                                            <div className="space-y-2">
                                                {savedItemFindings.map((finding: any) => (
                                                    <div key={finding.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-2xl">
                                                        {finding.imageUri && (
                                                            <img src={finding.imageUri} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white shadow-sm" />
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-bold text-gray-900 truncate">{finding.title}</p>
                                                            <p className="text-[10px] text-gray-500 truncate">{finding.description}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSavedFinding(finding.id)}
                                                            className="px-2 py-1 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg shrink-0"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 1. DEFICIENCY SELECTED */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Deficiency Selected</label>
                                        <div onClick={() => handleOpenSelection('selected')} className={`w-full bg-gray-50 border rounded-2xl p-4 text-xs font-bold cursor-pointer hover:bg-white hover:border-blue-400 transition-all flex justify-between items-center group ${selectedDeficiency ? 'border-[#0E7490] border-2 bg-white' : 'border-gray-100'}`}>
                                            <span className={(odForm.deficiencySelected || selectedDeficiency) ? "text-gray-900" : "text-red-500"}>
                                                {odForm.deficiencySelected || (selectedDeficiency ? selectedDeficiency.selected : "--Select--")}
                                            </span>
                                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#0E7490]" />
                                        </div>
                                        <button onClick={handleClearAndGoBack} className="flex items-center gap-1 mt-2 text-xs font-medium text-red-500 hover:text-red-600">
                                            <ChevronLeft className="w-3 h-3" /> Back
                                        </button>
                                    </div>

                                    {/* 2. DEFICIENCY DETAIL */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Deficiency Detail</label>
                                        <div onClick={() => selectedDeficiency && handleOpenSelection('detail')} className={`w-full bg-gray-50 border rounded-2xl p-4 text-xs font-bold ${selectedDeficiency ? 'cursor-pointer hover:bg-white hover:border-blue-400' : 'cursor-not-allowed opacity-70'} transition-all flex justify-between items-center group ${selectedDeficiency ? 'border-[#0E7490] border-2 bg-white' : 'border-gray-100'}`}>
                                            <span className={(odForm.deficiencyDetail || selectedDeficiency) ? "text-gray-900" : "text-red-500"}>
                                                {odForm.deficiencyDetail || (selectedDeficiency ? selectedDeficiency.detail : "-- Select deficiency first --")}
                                            </span>
                                            {selectedDeficiency && <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#0E7490]" />}
                                        </div>
                                    </div>



                                    {/* 4. PIC - one photo per deficiency */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Pic (one photo for this deficiency)</label>

                                        {/* Image Grid */}
                                        {photos.length > 0 && (
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                {photos.map((p, i) => (
                                                    <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md group border-2 border-white">
                                                        <img src={p} className="w-full h-full object-cover" alt={`Photo ${i + 1}`} />
                                                        <button
                                                            onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                                                            className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="text-white w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Two buttons side by side - Take Photo and Choose from Gallery */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#0E7490] hover:bg-cyan-50/30 transition-all cursor-pointer group"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mb-3 group-hover:bg-[#0E7490] transition-colors">
                                                    <Camera className="w-7 h-7 text-[#0E7490] group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#0E7490]">Take Photo</span>
                                            </div>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#0E7490] hover:bg-cyan-50/30 transition-all cursor-pointer group"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mb-3 group-hover:bg-[#0E7490] transition-colors">
                                                    <ImageIcon className="w-7 h-7 text-[#0E7490] group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-[#0E7490]">Choose from Gallery</span>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                    </div>

                                    {/* 4. NOTE - Text area */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Note</label>
                                        <textarea
                                            className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0E7490] outline-none transition-all h-24 resize-none"
                                            value={odForm.note}
                                            onChange={(e) => setOdForm({ ...odForm, note: e.target.value })}
                                            placeholder="Write your observation..."
                                        />
                                    </div>

                                    {/* 5. LOCATION + HEALTH & SAFETY - Side by side */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Location</label>
                                            <select
                                                className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 text-xs font-black text-gray-800 outline-none focus:bg-white focus:border-[#0E7490] transition-all cursor-pointer"
                                                value={odForm.location}
                                                onChange={(e) => setOdForm({ ...odForm, location: e.target.value })}
                                            >
                                                {[
                                                    'Building Site S', 'Building Site N', 'Building Site E', 'Building Site W',
                                                    'Parking Lot', 'Driveway', 'Sidewalk', 'Roof', 'Common Area', 'Main Lobby',
                                                    'Basement', 'Attic/Loft', 'Bathroom 1', 'Bathroom 2', 'Bathroom 3',
                                                    'Bedroom 1', 'Bedroom 2', 'Bedroom 3', 'Bedroom 4', 'Bedroom 5',
                                                    'Closet', 'Dining Area', 'Entryway', 'Garage', 'Hallway/Stairs',
                                                    'Home Office/Study', 'Kitchen', 'Laundry Room', 'Living Room',
                                                    'Mechanical Room', 'Office', 'Patio/Porch/Balcony', 'Storage Room', 'Other'
                                                ].map((loc: string) => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Health & Safety</label>
                                            <div className={`w-full rounded-2xl p-4 text-xs font-black flex items-center min-h-[50px] ${odForm.healthAndSafety === 'Life-Threatening' ? 'bg-red-500 text-white border-red-500' :
                                                odForm.healthAndSafety === 'Severe' ? 'bg-orange-500 text-white border-orange-500' :
                                                    odForm.healthAndSafety === 'Moderate' ? 'bg-yellow-500 text-white border-yellow-500' :
                                                        odForm.healthAndSafety === 'Low' ? 'bg-green-500 text-white border-green-500' :
                                                            'bg-gray-50 text-gray-900 border-gray-100'
                                                } border`}>
                                                {odForm.healthAndSafety || "Low"}
                                            </div>
                                        </div>
                                    </div>

                                {/* Standard and Protocol Viewing Buttons */}



                                    {/* 6. INSPECTION SCORING - Auto-calculated card */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Inspection Scoring</label>
                                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                            {/* Row 1: All Sample and Pts Lost (Raw) */}
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">All Sample</p>
                                                    <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold text-gray-800">
                                                        {scoringResult?.allSample || totalSamples}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Pts Lost (Raw)</p>
                                                    <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold text-gray-800">
                                                        {scoringResult?.ptsLostRaw?.toFixed(2) || '0.00'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 2: Pts Lost and Possible Score */}
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Pts Lost</p>
                                                    <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold text-gray-800">
                                                        {scoringResult?.ptsLost?.toFixed(2) || '0.00'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Possible Score</p>
                                                    <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold text-gray-800">
                                                        {currentSection === 'outside' ? OUTSIDE_POSSIBLE_SCORE : currentSection === 'unit' ? POSSIBLE_SCORE : INSIDE_POSSIBLE_SCORE}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 3: Max Pts Lost and Score */}
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Max Pts Lost</p>
                                                    <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold text-gray-800">
                                                        {scoringResult?.maxPtsLost?.toFixed(2) || (currentSection === 'outside' ? '0.01' : '5.50')}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Score</p>
                                                    <div className="bg-cyan-50 border border-cyan-200 rounded-xl px-3 py-2 text-sm font-black text-[#0E7490]">
                                                        {scoringResult?.score?.toFixed(2) || (currentSection === 'outside' ? OUTSIDE_POSSIBLE_SCORE.toFixed(2) : currentSection === 'unit' ? POSSIBLE_SCORE.toFixed(2) : INSIDE_POSSIBLE_SCORE.toFixed(2))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 4: # of Deficiencies */}
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1"># of Deficiencies</p>
                                                <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold text-gray-800">
                                                    {scoringResult?.deficiencies || deficiencyCount}
                                                </div>
                                            </div>

                                            {/* Show override indicator for Outside inspections */}
                                            {currentSection === 'outside' && outsideScoringResult?.isDeficiencyOverride && (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <p className="text-[10px] font-bold text-[#0E7490] uppercase tracking-wide">
                                                        * Severity determined by deficiency description override
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Standard and Protocol Viewing Buttons */}
                                    <div className="space-y-4 mt-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">STANDARD ✅</label>
                                            {(() => {
                                                if (!selectedDeficiency) {
                                                    return (
                                                        <button
                                                            type="button"
                                                            disabled
                                                            className="w-full rounded-2xl p-4 text-xs font-bold leading-relaxed bg-[#006795] text-white opacity-60 text-center cursor-not-allowed"
                                                        >
                                                            Select deficiency first to open Inspect
                                                        </button>
                                                    )
                                                }
                                                return (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setInspectModalType('standard'); setGuideDeficiency(selectedDeficiency); setIsHowToInspectOpen(true); }}
                                                        className="w-full rounded-2xl p-4 text-xs font-bold leading-relaxed bg-[#006795] text-white hover:bg-blue-800 transition-colors text-center shadow-md"
                                                    >
                                                        STANDARD ✅
                                                    </button>
                                                )
                                            })()}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">INSPECTION PROTOCOL (INTERNATIONAL) ✅</label>
                                            {(() => {
                                                if (!selectedDeficiency) {
                                                    return <div className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-2xl border border-gray-200">Select deficiency first</div>
                                                }
                                                return (
                                                    <button
                                                        onClick={() => {
                                                            setInspectModalType('protocol');
                                                            setIsHowToInspectOpen(true);
                                                        }}
                                                        className="w-full rounded-2xl p-4 text-xs font-bold leading-relaxed bg-[#10b981] text-white hover:bg-emerald-700 transition-colors text-center shadow-md"
                                                    >
                                                        INSPECTION PROTOCOL (INTERNATIONAL) ✅
                                                    </button>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalStep === 3 && (
                                <div className="space-y-4 animate-in slide-in-from-right duration-300 pb-10">
                                    <div className="flex items-center gap-4 mb-8 sticky top-0 bg-white/95 backdrop-blur-sm p-1 z-10"><button
                                            onClick={() => {
                                                if (selectionType === 'detail') {
                                                    setSelectionType('selected');
                                                    setDetailFilterName(null);
                                                } else {
                                                    setModalStep(2);
                                                }
                                            }}
                                            className="w-10 h-10 border border-gray-100 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all text-blue-600 shadow-sm"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Step 3 of 3</label>
                                            <h4 className="text-sm font-black text-gray-900 truncate">Select {selectionType === 'selected' ? 'Deficiency' : selectionType}</h4>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {getDisplayDeficiencies().length > 0 ? getDisplayDeficiencies().map((def: DeficiencyDetail) => (
                                            <button
                                                key={def.id}
                                                onClick={() => handleDeficiencySelect(def)}
                                                className={`w-full p-5 text-left border rounded-2xl transition-all text-[11px] font-bold leading-relaxed flex items-center justify-between group shadow-sm ${selectedDeficiency?.id === def.id ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-gray-50 hover:border-blue-200 hover:bg-gray-50 text-gray-700'}`}
                                            >
                                                <span className="flex-1 pr-4">{selectionType === 'selected' ? def.selected : selectionType === 'detail' ? def.detail : def.criteria}</span>
                                                <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 -rotate-90 transition-all text-blue-500" />
                                            </button>
                                        )) : (
                                            <div className="py-20 text-center">
                                                <p className="text-sm font-bold text-gray-300 italic">No options found.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>

                        {modalStep === 4 && (
                            <div className="flex-1 overflow-y-auto flex flex-col p-6 md:p-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-0 relative isolate">
                                <div 
                                    className="absolute inset-0 bg-no-repeat bg-center pointer-events-none -z-10"
                                    style={{ backgroundImage: "url('/nationalstandard.png')", backgroundSize: '60%', opacity: 0.2 }}
                                ></div>
                                <div className="text-center">
                                    {/* Big Logo in Center */}
                                    <div className="flex justify-center mb-4">
                                        <img 
                                            src="/logo.png" 
                                            alt="Logo" 
                                            className="w-28 h-28 object-contain"
                                        />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">Saved for Summary Report</h3>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {savedItemFindings.length} {savedItemFindings.length === 1 ? 'deficiency' : 'deficiencies'} on this item
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {savedItemFindings.map((finding: any) => (
                                        <div key={finding.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${finding.id === lastSavedFindingId ? 'bg-green-50 border-green-300' : 'bg-white border-gray-100'}`}>
                                            {finding.imageUri ? (
                                                <img src={finding.imageUri} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 border shadow-sm" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1 text-left">
                                                <p className="text-xs font-bold text-gray-900">{finding.title}</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{finding.description}</p>
                                                <p className="text-[10px] font-bold text-[#0E7490] mt-1">{finding.severity}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSavedFinding(finding.id)}
                                                className="px-2.5 py-1.5 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg shrink-0"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    <Button
                                        onClick={resetFormForNewDeficiency}
                                        className="w-full bg-[#006795] hover:bg-[#0a5670] text-white font-black h-12 rounded-xl uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Deficiency
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleODModalClose}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-12 rounded-xl border-2 border-red-600 uppercase text-[10px] tracking-widest"
                                    >
                                        Continue Inspection
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Only show modalStep 2 footer if not in step 4 */}
                        {modalStep === 2 && (
                            <div className="p-5 border-t bg-gray-50 shrink-0 flex gap-4 sticky bottom-0 z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
                                <Button variant="outline" onClick={handleODModalClose} className="flex-1 font-black h-14 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">Cancel</Button>
                                <Button
                                    onClick={handleProceed}
                                    disabled={isAnalyzing || photos.length === 0 || !selectedDeficiency}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black h-14 rounded-xl shadow-lg shadow-red-100 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Proceed'}
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* How to Inspect Popup */}
            {isHowToInspectOpen && (
                <div className="fixed inset-0 bg-black/70 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0" onClick={() => setIsHowToInspectOpen(false)} />
                    <Card className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] flex flex-col max-h-[75vh]">
                        <div className="p-5 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">{inspectModalType === 'standard' ? 'STANDARD ✅' : 'INSPECTION PROTOCOL ✅'}</h3>
                            <button onClick={() => setIsHowToInspectOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 md:p-8 overflow-y-auto space-y-4 custom-scrollbar">
                            {(() => {
                                // Get Standard and Inspection Protocol from JSON data
                                const standardData = currentModalItem && currentSection
                                    ? getInspectionStandardAndProtocol(currentSection, currentModalItem, selectedDeficiency?.selected || undefined)
                                    : null;

                                // Determine what to show based on which button was clicked
                                const showStandard = inspectModalType === 'standard';
                                const showProtocol = inspectModalType === 'protocol';

                                if (!standardData || (!standardData.standard && !standardData.inspectionProtocol)) {
                                    return (
                                        <p className="text-gray-500 text-sm italic">
                                            No standard or inspection protocol available for this item.
                                        </p>
                                    );
                                }

                                return (
                                    <>
                                        {/* Standard Section - Only show when Standard button clicked */}
                                {showStandard && standardData.standard && (
                                            <div className="space-y-2">
                                                <h4 className="font-black text-[#0E7490] text-base uppercase tracking-wide">
                                                    📋 Standard
                                                </h4>
                                                <div className="bg-blue-50 border-l-4 border-[#0E7490] p-4 rounded-r-lg">
                                                    {standardData.standard.split('\n').map((line, i) => {
                                                        const trimmed = line.trim();
                                                        if (!trimmed) return <div key={i} className="h-2" />;
                                                        return (
                                                            <p key={i} className="text-gray-700 text-sm leading-relaxed mb-2 last:mb-0">
                                                                {trimmed}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Inspection Protocol Section - Only show when Protocol button clicked */}
                                {showProtocol && standardData.inspectionProtocol && (
                                            <div className="space-y-2">
                                                <h4 className="font-black text-[#F84B5F] text-base uppercase tracking-wide">
                                                    ✅ Inspection Protocol
                                                </h4>
                                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                                    {standardData.inspectionProtocol.split('\n').map((line, i) => {
                                                        const trimmed = line.trim();
                                                        if (!trimmed) return <div key={i} className="h-1" />;

                                                        // Header detection (lines with emoji or numbered sections)
                                                        const isHeader = /^[\d]+\./.test(trimmed) || /^[•\-]/.test(trimmed) || /^[A-Z][a-z]+:/.test(trimmed);
                                                        
                                                        if (isHeader) {
                                                            return (
                                                                <p key={i} className="font-bold text-gray-900 mt-3 first:mt-0 text-sm">
                                                                    {trimmed}
                                                                </p>
                                                            );
                                                        }

                                                        // Bullet points
                                                        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                                                            return (
                                                                <p key={i} className="text-gray-700 ml-4 text-sm leading-relaxed">
                                                                    {trimmed}
                                                                </p>
                                                            );
                                                        }

                                                        // Regular text
                                                        return (
                                                            <p key={i} className="text-gray-600 text-sm leading-relaxed">
                                                                {trimmed}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <Button
                                variant="outline"
                                onClick={() => setIsHowToInspectOpen(false)}
                                className="w-full font-black h-12 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-600 uppercase text-[10px] tracking-widest"
                            >
                                Close
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                body.modal-open {
                    overflow: hidden !important;
                }
            `}</style>
            
            
            {/* Standard Modal */}
            {showStandardModal && selectedDeficiency && (() => {
                const dataResult = getInspectionStandardAndProtocol(
                    currentSection as 'outside' | 'inside' | 'unit',
                    odForm.category,
                    selectedDeficiency.selected
                );
                
                console.log('[Standard Modal Debug]', {
                    category: odForm.category,
                    deficiency: selectedDeficiency.selected,
                    section: currentSection,
                    hasData: !!dataResult,
                    standardValue: dataResult?.standard
                });
                
                return (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4" onClick={() => setShowStandardModal(false)}>
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-blue-600 p-5 flex items-center justify-between">
                                <h3 className="text-lg font-black text-white">STANDARD - {selectedDeficiency.selected}</h3>
                                <button onClick={() => setShowStandardModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                                {dataResult?.standard ? (
                                    <div className="prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
{dataResult.standard}</pre>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 italic mb-2">No standard information available for this deficiency.</p>
                                        <p className="text-xs text-gray-400">Category: {odForm.category}</p>
                                        <p className="text-xs text-gray-400">Deficiency: {selectedDeficiency.selected}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Inspection Protocol Modal */}
            {showProtocolModal && selectedDeficiency && (() => {
                const dataResult = getInspectionStandardAndProtocol(
                    currentSection as 'outside' | 'inside' | 'unit',
                    odForm.category,
                    selectedDeficiency.selected
                );
                
                console.log('[Protocol Modal Debug]', {
                    category: odForm.category,
                    deficiency: selectedDeficiency.selected,
                    section: currentSection,
                    hasData: !!dataResult,
                    protocolValue: dataResult?.inspectionProtocol
                });
                
                return (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4" onClick={() => setShowProtocolModal(false)}>
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-green-600 p-5 flex items-center justify-between">
                                <h3 className="text-lg font-black text-white">INSPECTION PROTOCOL (INTERNATIONAL) - {selectedDeficiency.selected}</h3>
                                <button onClick={() => setShowProtocolModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                                {dataResult?.inspectionProtocol ? (
                                    <div className="prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
{dataResult.inspectionProtocol}</pre>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 italic mb-2">No inspection protocol information available for this deficiency.</p>
                                        <p className="text-xs text-gray-400">Category: {odForm.category}</p>
                                        <p className="text-xs text-gray-400">Deficiency: {selectedDeficiency.selected}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
            </ManagementDashboardLayout>
    )
}
