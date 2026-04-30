"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
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

import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS } from "@/lib/inspectionData";

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
        lowerCategory.includes('restroom') || lowerCategory.includes('sink') ||
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
    const [currentSection, setCurrentSection] = useState<'outside' | 'inside' | 'unit'>('outside')

    // Read building & unit from URL query params (set by property-details page)
    const urlBuilding = searchParams.get('building') || 'B1'
    const urlUnit = searchParams.get('unit') || ''
    const urlTotalUnits = parseInt(searchParams.get('totalUnits') || '0')
    const currentUnitName = decodeURIComponent(urlUnit)

    // Unit selection popup (shown when user clicks Units section and no unit is pre-selected)
    const [unitSelectionPopupOpen, setUnitSelectionPopupOpen] = useState(false)
    const [activeInspectionUnit, setActiveInspectionUnit] = useState(currentUnitName)

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
    const [currentModalItem, setCurrentModalItem] = useState<string | null>(null);
    const [selectionType, setSelectionType] = useState<'selected' | 'detail' | 'criteria'>('selected');
    const [selectedDeficiency, setSelectedDeficiency] = useState<DeficiencyDetail | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [odForm, setOdForm] = useState({
        category: "",
        note: "",
        location: "Building Site S",
        healthAndSafety: "",
        repairBy: "",
        codeAndCompliance: ""
    });

    // Auto-scoring state - calculated based on deficiency selection
    const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
    const [outsideScoringResult, setOutsideScoringResult] = useState<OutsideScoringResult | null>(null);
    const [insideScoringResult, setInsideScoringResult] = useState<InsideScoringResult | null>(null);

    // Get total samples based on NSPIRE Sampling Table (same as app)
    const totalSamples = useMemo(() => {
        // Use the total units from URL or property to find required sample size 'n'
        const sampling = getSamplingRequirements(urlTotalUnits || property?.units || units?.length || 0);
        return sampling.requiredSize || 20;
    }, [urlTotalUnits, property?.units, units?.length]);

    // Auto-count deficiencies: 1 if a deficiency is selected, 0 otherwise
    const deficiencyCount = selectedDeficiency ? 1 : 0;

    // Update scoring dynamically when deficiency is selected/changed
    useEffect(() => {
        // Check if we're in the Outside inspection section
        const isOutsideSection = currentSection === 'outside';

        if (isOutsideSection && currentModalItem) {
            // Use Outside-specific scoring with category-based and deficiency-based rules
            const categoryNumber = extractCategoryNumber(undefined, currentModalItem);
            // Include category name, selected deficiency name, detail, AND criteria fields for pattern matching
            const deficiencyDescription = [
                currentModalItem,  // Include category name for fixed-severity categories
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
                currentModalItem,  // Include category name for fixed-severity categories like Chimney
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
    }, [selectedDeficiency, deficiencyCount, totalSamples, odForm.healthAndSafety, odForm.note, currentSection, currentModalItem]);

    useEffect(() => {
        if (id) {
            fetchData()
            loadSavedProgress()
        }
    }, [id])

    const loadSavedProgress = async () => {
        try {
            // Fetch ALL progress for this property to populate all progress bars
            const res = await inspectionsAPI.getProgress({
                property_id: id
            });

            if (res.success && res.progress) {
                // Find Inside and Outside progress for this building
                const outsideRec = res.progress.find((p: any) => 
                    p.inspectionType === 'Outside' && (p.unitId === urlBuilding || p.buildingId === urlBuilding)
                );
                const insideRec = res.progress.find((p: any) => 
                    p.inspectionType === 'Inside' && (p.unitId === urlBuilding || p.buildingId === urlBuilding)
                );
                
                if (outsideRec && outsideRec.responses) setOutsideStatuses(outsideRec.responses);
                if (insideRec && insideRec.responses) setInsideStatuses(insideRec.responses);

                // If a unit is active, find its progress too
                if (activeInspectionUnit) {
                    const unitRec = res.progress.find((p: any) => 
                        p.inspectionType === 'Unit' && p.unitId === activeInspectionUnit
                    );
                    if (unitRec && unitRec.responses) setUnitStatuses(unitRec.responses);
                }

                // Restore findings for summary page if they exist in any record
                const allFindings: any[] = [];
                res.progress.forEach((p: any) => {
                    if (p.inspectionData && Array.isArray(p.inspectionData.findings)) {
                        allFindings.push(...p.inspectionData.findings);
                    }
                });

                if (allFindings.length > 0) {
                    // Dedupe findings
                    const seen = new Set();
                    const uniqueFindings = allFindings.filter(f => {
                        const key = `${f.title}|${f.description}|${f.unit}`;
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });

                    const existingDataRaw = localStorage.getItem('currentInspectionData');
                    let finalData: any = { findings: uniqueFindings };
                    if (existingDataRaw) {
                        try {
                            const existingData = JSON.parse(existingDataRaw);
                            finalData = { ...existingData, findings: uniqueFindings };
                        } catch (e) {}
                    }
                    localStorage.setItem('currentInspectionData', JSON.stringify(finalData));
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
    }, [outsideStatuses, insideStatuses, unitStatuses]);

    const saveCurrentProgress = async () => {
        if (!id || !user) return;
        
        try {
            const promises = [];
            
            if (Object.keys(outsideStatuses).length > 0) {
                promises.push(inspectionsAPI.saveProgress({
                    property_id: id,
                    unit_id: urlBuilding,
                    inspection_type: 'Outside',
                    responses: outsideStatuses,
                    building_id: urlBuilding
                }));
            }
            
            if (Object.keys(insideStatuses).length > 0) {
                promises.push(inspectionsAPI.saveProgress({
                    property_id: id,
                    unit_id: urlBuilding,
                    inspection_type: 'Inside',
                    responses: insideStatuses,
                    building_id: urlBuilding
                }));
            }
            
            if (Object.keys(unitStatuses).length > 0 && activeInspectionUnit) {
                promises.push(inspectionsAPI.saveProgress({
                    property_id: id,
                    unit_id: activeInspectionUnit,
                    inspection_type: 'Unit',
                    responses: unitStatuses,
                    building_id: urlBuilding
                }));
            }
            
            await Promise.all(promises);
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
                    const unitsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/inspections/sample-units`, {
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
            setOdForm(prev => ({
                ...prev,
                category: cleanCategory,
                note: "",
                location: section === 'outside' ? OUTSIDE_LOCATION_OPTIONS[0] : "Main Lobby",
                healthAndSafety: "",
                repairBy: "",
                codeAndCompliance: ""
            }));
            setModalStep(1);
            setIsODModalOpen(true);
            return;
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
        const allSelected = list.every(item => currentStatuses[item] === status);
        const newStatuses: Record<string, ItemStatus> = {};
        list.forEach(item => {
            newStatuses[item] = allSelected ? null : status;
        });
        if (section === 'outside') setOutsideStatuses(newStatuses);
        else if (section === 'inside') setInsideStatuses(newStatuses);
        else setUnitStatuses(newStatuses);
    };

    const handleODModalClose = () => {
        setIsODModalOpen(false);
        setSelectedDeficiency(null);
        setPhotos([]);
        setOdForm({ category: "", note: "", location: "Building Site S", healthAndSafety: "", repairBy: "", codeAndCompliance: "" });
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/ai/upload-image`, {
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
        setSelectedDeficiency(def);
        setOdForm(prev => ({
            ...prev,
            healthAndSafety: def.healthAndSafety,
            repairBy: def.repairBy,
            codeAndCompliance: def.codeAndCompliance,
            location: def.location || prev.location // Auto-fill location if available
        }));
        setModalStep(2);
    };

    const [reportUrl, setReportUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleProceed = async () => {
        if (photos.length === 0) {
            toast.error("Please upload a photo first");
            return;
        }

        setIsAnalyzing(true);
        const toastId = toast.loading("AI is analyzing the photo...", { autoClose: false });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/ai/inspect`, {
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

                // Update the outline item status to 'No OD' (green) to show it's been inspected and completed
                // This marks the item as green to indicate inspection is done
                if (currentModalItem) {
                    if (currentSection === 'outside') {
                        setOutsideStatuses(prev => ({
                            ...prev,
                            [currentModalItem]: 'No OD'
                        }));
                    } else if (currentSection === 'inside') {
                        setInsideStatuses(prev => ({
                            ...prev,
                            [currentModalItem]: 'No OD'
                        }));
                    } else {
                        setUnitStatuses(prev => ({
                            ...prev,
                            [currentModalItem]: 'No OD'
                        }));
                    }
                }

                // Save inspection data for summary page
                const inspectionDataForSummary = {
                    inspectionId: params.id,
                    propertyId: property?._id,
                    propertyName: property?.name,
                    address: property?.address,
                    inspectorId: user?.id || user?._id,
                    inspectorName: user?.fullName,
                    building: buildingName,
                    buildingColumnHeader: columnHeaderName,
                    currentUnit: activeInspectionUnit,
                    unitNames: Object.keys(unitNames).length > 0 ? unitNames : undefined,
                    findings: [{
                        id: `DEF-${Date.now()}`,
                        imageUri: photos[0],
                        title: selectedDeficiency?.selected || analysisResult?.defect || odForm.category,
                        description: analysisResult?.description || selectedDeficiency?.detail || 'Deficiency detected by AI inspection',
                        category: odForm.category,
                        building: buildingName,
                        unit: activeInspectionUnit || unitsString,
                        location: odForm.location,
                        severity: analysisResult?.severity || odForm.healthAndSafety || 'Moderate',
                        healthAndSafety: odForm.healthAndSafety || analysisResult?.severity || 'Moderate',
                        repairBy: odForm.repairBy || '30 Days',
                        codeAndCompliance: odForm.codeAndCompliance,
                        notes: odForm.note,
                        nspireCode: analysisResult?.nspireCode || selectedDeficiency?.id || 'HS-12',
                        status: 'Open',
                        timestamp: new Date().toISOString()
                    }],
                    reportUrl: resultData.reportUrl,
                    complianceScore: analysisResult?.complianceScore || 85,
                    notes: odForm.note,
                    startDate: new Date().toLocaleDateString(),
                    startTime: new Date().toLocaleTimeString()
                };
                // Save finding to backend progress instead of just redirecting
                const type = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
                const currentStatuses = currentSection === 'outside' ? outsideStatuses 
                                     : currentSection === 'inside' ? insideStatuses 
                                     : unitStatuses;
                
                // Ensure the item is marked as OD
                const updatedStatuses = {
                    ...currentStatuses,
                    [currentModalItem]: 'OD'
                };

                if (currentSection === 'outside') setOutsideStatuses(updatedStatuses as Record<string, ItemStatus>);
                else if (currentSection === 'inside') setInsideStatuses(updatedStatuses as Record<string, ItemStatus>);
                else setUnitStatuses(updatedStatuses as Record<string, ItemStatus>);

                await inspectionsAPI.saveProgress({
                    property_id: property?._id || params.id,
                    unit_id: currentSection === 'unit' ? activeInspectionUnit : urlBuilding,
                    inspection_type: type,
                    responses: updatedStatuses,
                    inspectionData: {
                        findings: [inspectionDataForSummary.findings[0]] // Just send this one finding to merge
                    },
                    building_id: urlBuilding
                });

                // Update local storage for summary (merging instead of overwriting)
                const existingDataRaw = localStorage.getItem('currentInspectionData');
                let mergedFindings = inspectionDataForSummary.findings;
                if (existingDataRaw) {
                    try {
                        const existingData = JSON.parse(existingDataRaw);
                        if (Array.isArray(existingData.findings)) {
                            // Merge and dedupe findings
                            const allFindings = [...existingData.findings, ...inspectionDataForSummary.findings];
                            const seen = new Set();
                            mergedFindings = allFindings.filter(f => {
                                const key = `${f.title}|${f.description}|${f.unit}`;
                                if (seen.has(key)) return false;
                                seen.add(key);
                                return true;
                            });
                        }
                    } catch (e) {
                        console.error("Error merging findings:", e);
                    }
                }
                
                const finalData = {
                    ...inspectionDataForSummary,
                    findings: mergedFindings
                };

                localStorage.setItem('currentInspectionData', JSON.stringify(finalData));
                localStorage.setItem('currentInspectionProperty', JSON.stringify(property));

                toast.info("Item saved. You can continue with other items or view summary.", { position: "top-right" });
                
                // Close modal but STAY on the page
                setIsODModalOpen(false);
                setSelectedDeficiency(null);
                setPhotos([]);
                setOdForm({ category: "", note: "", location: "Building Site S", healthAndSafety: "", repairBy: "", codeAndCompliance: "" });

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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}/api/ai/upload-image`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setPhotos([...photos, data.data.url]);
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
        // outside → outsideDeficiencyMapping
        // inside  → insideDeficiencyMapping
        // unit    → unitDeficiencyMapping
        const mapping = currentSection === 'outside'
            ? outsideDeficiencyMapping
            : currentSection === 'inside'
                ? unitDeficiencyMapping
                : insideDeficiencyMapping;

        // Try exact match first
        if (mapping[baseName]) return mapping[baseName];

        // Fallback to fuzzy match
        const matchedKey = Object.keys(mapping).find(k =>
            baseName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(baseName.toLowerCase())
        );

        return matchedKey ? mapping[matchedKey] : [];
    };

    const getDisplayDeficiencies = () => {
        const allDefs = getFilteredDeficiencies();
        if (selectionType === 'selected') {
            const seen = new Set();
            return allDefs.filter(def => {
                if (seen.has(def.selected)) return false;
                seen.add(def.selected);
                return true;
            });
        }
        if (selectionType === 'detail' && selectedDeficiency) {
            return allDefs.filter(def => def.selected === selectedDeficiency.selected);
        }
        return allDefs;
    };

    const renderTable = (section: 'outside' | 'inside' | 'unit', items: string[], statuses: Record<string, ItemStatus>) => (
        <div className="bg-white p-3 sm:p-6 animate-in slide-in-from-top duration-300">
            {/* Mobile View - Card Layout */}
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
                                    General Button
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
                                        {items.length > 0 && items.every(item => statuses[item] === 'No OD') && <Check className="w-2.5 h-2.5 text-cyan-800" strokeWidth={4} />}
                                    </div>
                                    Select All No OD
                                </Button>
                            </th>
                            <th className="py-2 px-2">
                                <Button onClick={() => selectAll(section, 'OD')} className="w-full bg-white hover:bg-red-50 text-[#DC2626] border border-[#DC2626] text-[10px] h-8 font-bold flex items-center gap-1.5 px-3 uppercase">
                                    <div className="w-3 h-3 bg-white border border-[#DC2626] flex items-center justify-center">
                                        {items.length > 0 && items.every(item => statuses[item] === 'OD') && <Check className="w-2.5 h-2.5 text-[#DC2626]" strokeWidth={4} />}
                                    </div>
                                    Observe Deficiency
                                </Button>
                            </th>
                            <th className="py-2 px-2">
                                <Button onClick={() => selectAll(section, 'N/A')} className="w-full bg-[#006795] hover:bg-[#0a5670] text-white text-[10px] h-8 font-bold flex items-center gap-1.5 px-3 uppercase">
                                    <div className="w-3 h-3 bg-white border border-cyan-800 flex items-center justify-center">
                                        {items.length > 0 && items.every(item => statuses[item] === 'N/A') && <Check className="w-2.5 h-2.5 text-cyan-800" strokeWidth={4} />}
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
                                                General Button
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

    const unitProgress = useMemo(() => {
        const completed = Object.values(unitStatuses).filter(s => s !== null).length;
        return { completed, percentage: Math.round((completed / (unitItemsList.length || 1)) * 100) };
    }, [unitStatuses]);

    // Build the raw unit identifiers list
    const rawUnitIds = useMemo(() => {
        if (units && units.length > 0) {
            return units.map(u => u.unitNumber || u.unitId || String(u));
        }
        if (property && property.units > 0) {
            return Array.from({ length: property.units }, (_, i) => `${i + 1}`);
        }
        return [];
    }, [units, property]);

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
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006795]"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-sans">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{user?.fullName || "Guest User"}</span>
                        <div className="w-3 h-1.5 border-2 border-gray-400 rotate-45 border-t-0 border-l-0 ml-1" />
                    </div>
                </div>
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="text-base font-bold text-gray-900 uppercase tracking-tight">{columnHeaderName}: {buildingName}</p>
                        <button
                            onClick={openBuildingEditModal}
                            className="p-1.5 rounded-full hover:bg-[#006795]/10 text-[#006795] transition-colors"
                            title="Edit building name"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <Button 
                        onClick={() => router.push('/dashboard/inspection/summary')}
                        className="bg-[#006795] hover:bg-[#0a5670] text-white font-black px-6 rounded-xl shadow-md uppercase tracking-widest text-[10px] flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        View Summary
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
                                    <p className="text-[11px]">({sec === 'outside' ? outsideProgress.completed : sec === 'inside' ? insideProgress.completed : unitProgress.completed}/{sec === 'outside' ? outsideItemsList.length : sec === 'inside' ? insideItemsList.length : unitItemsList.length})</p>
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
                                    {buildingUnitNames.length > 0
                                        ? `${buildingUnitNames.length} units available`
                                        : 'Select a unit to inspect'}
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
                            {(buildingUnitNames.length > 0 ? buildingUnitNames : ['Unit 001', 'Unit 002', 'Unit 003']).map((unitName, idx) => {
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
                                                <p className="text-[11px] text-gray-400 font-medium">Pending inspection</p>
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
                            })}
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
                        <div className="p-5 border-b shrink-0 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
                            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight truncate pr-4">{currentModalItem}</h3>
                            <button onClick={handleODModalClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar overscroll-contain">
                            {modalStep === 1 && (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <Plus className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 mb-8 max-w-xs">{`No existing deficiency record for this item.`}</p>
                                    <Button onClick={() => setModalStep(2)} className="bg-[#006795] hover:bg-blue-700 text-white font-black px-12 h-14 rounded-2xl shadow-lg uppercase tracking-widest text-xs">Add New</Button>
                                </div>
                            )}

                            {modalStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300 pb-6">
                                    {/* 1. DEFICIENCY SELECTED - Full width dropdown */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Deficiency Selected</label>
                                        <div onClick={() => handleOpenSelection('selected')} className={`w-full bg-gray-50 border rounded-2xl p-4 text-xs font-bold cursor-pointer hover:bg-white hover:border-blue-400 transition-all flex justify-between items-center group ${selectedDeficiency ? 'border-[#0E7490] border-2 bg-white' : 'border-gray-100'}`}>
                                            <span className={selectedDeficiency ? "text-gray-900" : "text-gray-400"}>
                                                {selectedDeficiency ? selectedDeficiency.selected : "--Select--"}
                                            </span>
                                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#0E7490]" />
                                        </div>
                                        {selectedDeficiency && (
                                            <button onClick={() => setSelectedDeficiency(null)} className="flex items-center gap-1 mt-2 text-xs font-medium text-red-500 hover:text-red-600">
                                                <X className="w-3 h-3" /> Clear Selection
                                            </button>
                                        )}
                                    </div>

                                    {/* 2. DEFICIENCY DETAIL - Clickable Dropdown */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Deficiency Detail</label>
                                        <div onClick={() => selectedDeficiency && handleOpenSelection('detail')} className={`w-full bg-gray-50 border rounded-2xl p-4 text-xs font-bold ${selectedDeficiency ? 'cursor-pointer hover:bg-white hover:border-blue-400' : 'cursor-not-allowed opacity-70'} transition-all flex justify-between items-center group ${selectedDeficiency ? 'border-[#0E7490] border-2 bg-white' : 'border-gray-100'}`}>
                                            <span className={selectedDeficiency ? "text-gray-900" : "text-gray-400"}>
                                                {selectedDeficiency ? selectedDeficiency.detail : "-- Select deficiency first --"}
                                            </span>
                                            {selectedDeficiency && <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#0E7490]" />}
                                        </div>
                                    </div>

                                    {/* 3. HOW TO INSPECT */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">How to Inspect</label>
                                        {(() => {
                                            if (!selectedDeficiency) {
                                                return (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="w-full border-2 rounded-2xl p-4 text-xs font-bold leading-relaxed border-gray-100 bg-gray-50 text-gray-400 text-left cursor-not-allowed"
                                                    >
                                                        Select deficiency first to open How to Inspect
                                                    </button>
                                                )
                                            }
                                            return (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsHowToInspectOpen(true)}
                                                    className="w-full border-2 border-[#0E7490] rounded-2xl p-4 text-xs font-bold leading-relaxed bg-white text-[#0E7490] hover:bg-cyan-50 transition-colors text-left"
                                                >
                                                    Open How to Inspect Guide
                                                </button>
                                            )
                                        })()}
                                    </div>

                                    {/* 4. PIC - Photo section with Take Photo and Choose from Gallery */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Pic</label>

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

                                    {/* 5. NOTE - Text area */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Note</label>
                                        <textarea
                                            className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#0E7490] outline-none transition-all h-24 resize-none"
                                            value={odForm.note}
                                            onChange={(e) => setOdForm({ ...odForm, note: e.target.value })}
                                            placeholder="Write your observation..."
                                        />
                                    </div>

                                    {/* 6. LOCATION + HEALTH & SAFETY - Side by side */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Location</label>
                                            <select
                                                className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 text-xs font-black text-gray-800 outline-none focus:bg-white focus:border-[#0E7490] transition-all cursor-pointer"
                                                value={odForm.location}
                                                onChange={(e) => setOdForm({ ...odForm, location: e.target.value })}
                                            >
                                                {currentSection === 'outside' ? (
                                                    OUTSIDE_LOCATION_OPTIONS.map((loc: string) => (
                                                        <option key={loc} value={loc}>{loc}</option>
                                                    ))
                                                ) : (
                                                    <>
                                                        <option>Building Site S</option>
                                                        <option>Basement</option>
                                                        <option>Main Lobby</option>
                                                        <option>Roof</option>
                                                    </>
                                                )}
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

                                    {/* 7. INSPECTION SCORING - Auto-calculated card */}
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
                                                        {currentSection === 'outside' ? OUTSIDE_POSSIBLE_SCORE : INSIDE_POSSIBLE_SCORE}
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
                                                        {scoringResult?.score?.toFixed(2) || (currentSection === 'outside' ? OUTSIDE_POSSIBLE_SCORE.toFixed(2) : INSIDE_POSSIBLE_SCORE.toFixed(2))}
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
                                </div>
                            )}

                            {modalStep === 3 && (
                                <div className="space-y-4 animate-in slide-in-from-right duration-300 pb-10">
                                    <div className="flex items-center gap-4 mb-8 sticky top-0 bg-white/95 backdrop-blur-sm p-1 z-10">
                                        <button onClick={() => setModalStep(2)} className="w-10 h-10 border border-gray-100 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all text-blue-600 shadow-sm">
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

                        {modalStep === 4 && (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900">Analysis Complete</h3>
                                    <p className="text-gray-500 text-sm">AI has successfully inspected this item.</p>
                                </div>

                                <div className="w-full bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Detected Defect</p>
                                            <p className="font-bold text-gray-800">{analysisResult?.description || analysisResult?.defect || "Deficiency Detected"}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${(analysisResult?.severity || "").toLowerCase().includes('life') ? 'bg-red-100 text-red-600' :
                                            (analysisResult?.severity || "").toLowerCase().includes('severe') ? 'bg-orange-100 text-orange-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            {analysisResult?.severity || "Moderate"}
                                        </span>
                                    </div>
                                </div>

                                {/* View Summary Button - Primary Action */}
                                <Button
                                    onClick={() => {
                                        // Save inspection data for summary page
                                        const inspectionDataForSummary = {
                                            inspectionId: params.id,
                                            propertyId: property?._id,
                                            propertyName: property?.name,
                                            address: property?.address,
                                            inspectorId: user?.id || user?._id,
                                            inspectorName: user?.fullName,
                                            building: buildingName,
                                            buildingColumnHeader: columnHeaderName,
                                            currentUnit: activeInspectionUnit,
                                            unitNames: Object.keys(unitNames).length > 0 ? unitNames : undefined,
                                            findings: [{
                                                id: `DEF-${Date.now()}`,
                                                imageUri: photos[0],
                                                title: selectedDeficiency?.selected || analysisResult?.defect || odForm.category,
                                                description: analysisResult?.description || selectedDeficiency?.detail || 'Deficiency detected by AI inspection',
                                                category: odForm.category,
                                                building: buildingName,
                                                unit: activeInspectionUnit || unitsString,
                                                location: odForm.location,
                                                severity: analysisResult?.severity || odForm.healthAndSafety || 'Moderate',
                                                healthAndSafety: odForm.healthAndSafety || analysisResult?.severity || 'Moderate',
                                                repairBy: odForm.repairBy || '30 Days',
                                                codeAndCompliance: odForm.codeAndCompliance,
                                                notes: odForm.note,
                                                nspireCode: analysisResult?.nspireCode || selectedDeficiency?.id || 'HS-12',
                                                status: 'Open',
                                                timestamp: new Date().toISOString()
                                            }],
                                            reportUrl: reportUrl,
                                            complianceScore: analysisResult?.complianceScore || 85,
                                            notes: odForm.note,
                                            startDate: new Date().toLocaleDateString(),
                                            startTime: new Date().toLocaleTimeString()
                                        };

                                        localStorage.setItem('currentInspectionData', JSON.stringify(inspectionDataForSummary));
                                        localStorage.setItem('currentInspectionProperty', JSON.stringify(property));

                                        // Close modal and redirect to summary
                                        handleODModalClose();
                                        router.push('/dashboard/inspection/summary');
                                    }}
                                    className="w-full bg-[#006795] hover:bg-[#0a5670] text-white font-black h-14 rounded-xl shadow-lg uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
                                >
                                    <FileText className="w-4 h-4" />
                                    View NSPIRE Summary
                                </Button>

                                {reportUrl && (
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app'}${reportUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button className="w-full bg-gray-900 hover:bg-black text-white font-black h-14 rounded-xl shadow-lg shadow-gray-200 uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
                                            <FileText className="w-4 h-4" />
                                            Download Official Report
                                        </Button>
                                    </a>
                                )}

                                <Button variant="outline" onClick={handleODModalClose} className="w-full font-black h-14 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">
                                    Continue Inspection
                                </Button>
                            </div>
                        )}

                        {/* Only show modalStep 2 footer if not in step 4 */}
                        {modalStep === 2 && (
                            <div className="p-5 border-t bg-gray-50 shrink-0 flex gap-4 sticky bottom-0 z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
                                <Button variant="outline" onClick={handleODModalClose} className="flex-1 font-black h-14 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">Cancel</Button>
                                <Button
                                    onClick={handleProceed}
                                    disabled={isAnalyzing || photos.length === 0}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-xl shadow-lg shadow-blue-100 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed group"
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
                            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">How to Inspect</h3>
                            <button onClick={() => setIsHowToInspectOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 md:p-8 overflow-y-auto space-y-2 custom-scrollbar">
                            {(() => {
                                const guideText = selectedDeficiency
                                    ? lookupCodeReference(currentSection, currentModalItem || '', selectedDeficiency.selected)
                                    : ''
                                const fallbackText = selectedDeficiency?.codeAndCompliance || 'No inspection guide available.'
                                const content = guideText || fallbackText

                                return content.split('\n').map((line, i) => {
                                    const trimmed = line.trim()
                                    if (!trimmed) return <div key={i} className="h-1" />

                                    const isHeader = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}]/u.test(trimmed)
                                    if (isHeader) {
                                        return (
                                            <p key={i} className="font-black text-[#0E7490] mt-3 first:mt-0 text-sm">
                                                {trimmed}
                                            </p>
                                        )
                                    }

                                    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                                        return (
                                            <p key={i} className="text-gray-700 ml-3 font-medium text-sm">
                                                {trimmed}
                                            </p>
                                        )
                                    }

                                    return (
                                        <p key={i} className="text-gray-600 font-normal text-sm">
                                            {trimmed}
                                        </p>
                                    )
                                })
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
        </DashboardLayout >
    )
}
