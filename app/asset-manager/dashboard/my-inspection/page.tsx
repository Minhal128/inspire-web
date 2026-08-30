"use client"

import { useRouter } from "next/navigation"
import AssetManagerDashboardLayout from "@/components/AssetManagerDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { useState, useEffect, useMemo } from "react"
import { propertiesAPI } from "@/lib/api"
import { UnitSelectionModal } from "@/components/UnitSelectionModal"
import { ActionModal, EditPropertyModal, AddPropertyModal, BuildingDivisionModal } from "@/components/PropertyModals"
import { Country, State, City } from 'country-state-city'

export default function MyInspection() {
  const router = useRouter()
  const [propertyName, setPropertyName] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unitSelectionOpen, setUnitSelectionOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [propertyProgress, setPropertyProgress] = useState<Record<string, number>>({})
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set())
  const [completedInspections, setCompletedInspections] = useState<any[]>([])

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [showBuildingDivisionModal, setShowBuildingDivisionModal] = useState(false)
  const [newPropertyData, setNewPropertyData] = useState<any>(null)

  // Location data
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  // Initialize countries on component mount (only 4 allowed countries)
  useEffect(() => {
    const allowedCountries = ['US', 'CA', 'GB', 'AU']
    const allCountries = Country.getAllCountries()
    const filteredCountries = allCountries
      .filter(country => allowedCountries.includes(country.isoCode))
      .sort((a, b) => a.name.localeCompare(b.name))
    setCountries(filteredCountries)
  }, [])

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setLoadingStates(true)
      setSelectedState('')
      setSelectedCity('')
      setCities([])

      const countryStates = State.getStatesOfCountry(selectedCountry)
      setStates(countryStates.sort((a, b) => a.name.localeCompare(b.name)))
      setLoadingStates(false)
    } else {
      setStates([])
      setCities([])
    }
  }, [selectedCountry])

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setLoadingCities(true)
      setSelectedCity('')

      const stateCities = City.getCitiesOfState(selectedCountry, selectedState)
      setCities(stateCities.sort((a, b) => a.name.localeCompare(b.name)))
      setLoadingCities(false)
    } else {
      setCities([])
    }
  }, [selectedCountry, selectedState])

  const handleUnitSelectionContinue = (selectedUnits: string[]) => {
    setUnitSelectionOpen(false)
    localStorage.setItem('selectedUnits', JSON.stringify(selectedUnits))
    toast.success(`${selectedUnits.length} units selected for inspection`, {
      position: "top-right",
      autoClose: 2000,
    })
    router.push('/asset-manager/dashboard/inspection/summary')
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getAll({
        search: propertyName || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined,
      })
      
      // Fetch completed inspections
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'
      const inspectionsRes = await fetch(`${API_URL}/api/inspections`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.success) {
        setProperties(response.properties)
        
        if (inspectionsRes.ok) {
          const inspData = await inspectionsRes.json()
          if (inspData.success) {
            setCompletedInspections(inspData.inspections || [])
          }
        }
        
        fetchProgress(response.properties)
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error)
      toast.error("Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async (propertyList: any[]) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'
      const response = await fetch(`${API_URL}/api/inspections/progress`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
            
            const actualUnitsForInspection = prop.buildingDetails && prop.buildingDetails.length > 0
                ? prop.buildingDetails.reduce((sum: number, b: any) => sum + (b.unitsForInspection || 0), 0)
                : prop.calculatedUnits !== undefined ? prop.calculatedUnits : (prop.units ?? 0)
            
            const totalTasks = (prop.buildings * 2) + actualUnitsForInspection
            
            if (totalTasks > 0) {
                progressMap[propId] = Math.min(100, Math.round((uniqueTasks.size / totalTasks) * 100))
            } else {
                progressMap[propId] = 0
            }
        })
        setPropertyProgress(progressMap)
      }
    } catch (e) {
      console.error('Error fetching progress:', e)
    }
  }

  const handleSearch = () => {
    fetchProperties()
  }

  const handleAddPropertyNext = (data: any) => {
    const propData = Array.isArray(data) ? data[0] : data
    setNewPropertyData(propData)
    setShowAddPropertyModal(false)
    setShowBuildingDivisionModal(true)
  }

  const handleBuildingUpdate = async (data: any, buildings: { name: string; units: number }[]) => {
    try {
      const response = await propertiesAPI.create({
        propertyId: data.propertyId,
        name: data.propertyName || data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        buildings: buildings.length,
        units: buildings.reduce((sum, b) => sum + b.units, 0),
      })
      if (response.success) {
        toast.success("Data saved successfully", { position: "top-right" })

        // Save custom building names to localStorage
        const propId = response.property?._id || data.propertyId
        if (propId) {
          const namesMap: Record<string, string> = {}
          buildings.forEach((b, i) => {
            namesMap[`B${i + 1}`] = b.name
          })
          localStorage.setItem(`buildingNames_${propId}`, JSON.stringify(namesMap))
        }

        fetchProperties()
        setNewPropertyData(response.property || data)
        setShowBuildingDivisionModal(false)
        setSelectedProperty(response.property || data)
        setActionModalOpen(true)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add property", { position: "top-right" })
    }
  }

  const handleActionClick = (property: any) => {
    setSelectedProperty(property)
    setActionModalOpen(true)
  }

  const handleEditProperty = () => {
    setActionModalOpen(false)
    setEditModalOpen(true)
  }

  const handleHoldInspection = async () => {
    if (!selectedProperty) return
    try {
      const response = await propertiesAPI.hold(selectedProperty._id)
      if (response.success) {
        toast.success(response.message, { position: "top-right" })
        fetchProperties()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to hold inspection")
    } finally {
      setActionModalOpen(false)
    }
  }

  const handleRemoveProperty = async () => {
    if (!selectedProperty) return
    if (confirm(`Are you sure you want to remove ${selectedProperty.name}?`)) {
      try {
        const response = await propertiesAPI.delete(selectedProperty._id)
        if (response.success) {
          toast.success("Property removed successfully", { position: "top-right" })
          fetchProperties()
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to remove property")
      } finally {
        setActionModalOpen(false)
      }
    }
  }

  const handleSelectAll = () => {
    if (selectedProperties.size === properties.length) {
      // Deselect all
      setSelectedProperties(new Set())
    } else {
      // Select all
      setSelectedProperties(new Set(properties.map(p => p._id)))
    }
  }

  const handleSelectProperty = (propertyId: string) => {
    const newSelected = new Set(selectedProperties)
    if (newSelected.has(propertyId)) {
      newSelected.delete(propertyId)
    } else {
      newSelected.add(propertyId)
    }
    setSelectedProperties(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedProperties.size === 0) {
      toast.warning("Please select properties to delete", { position: "top-right" })
      return
    }

    if (confirm(`Are you sure you want to remove ${selectedProperties.size} ${selectedProperties.size === 1 ? 'property' : 'properties'}?`)) {
      try {
        const response = await propertiesAPI.bulkDelete(Array.from(selectedProperties))
        if (response.success) {
          toast.success(response.message || `${selectedProperties.size} ${selectedProperties.size === 1 ? 'property' : 'properties'} removed successfully`, { position: "top-right" })
          setSelectedProperties(new Set())
          fetchProperties()
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to remove properties")
      }
    }
  }

  // The property currently being actively inspected (progress > 0 and < 100, not on hold)
  const activeInspectionPropertyId = useMemo(() => {
    return Object.keys(propertyProgress).find(
      id => {
        const prop = properties.find(p => p._id === id)
        if (prop?.status === 'hold') return false
        return propertyProgress[id] > 0 && propertyProgress[id] < 100
      }
    ) || null
  }, [propertyProgress, properties])

  const handleInitiate = (property: any) => {
    // Block only when another property is actively in progress (not on hold)
    if (activeInspectionPropertyId && activeInspectionPropertyId !== property._id) {
      const activeProp = properties.find(p => p._id === activeInspectionPropertyId)
      toast.error(
        `"${activeProp?.name || 'Another property'}" is currently being inspected. Please put it on hold before starting a new inspection.`,
        { position: 'top-right', autoClose: 6000 }
      )
      return
    }
    setSelectedProperty(property)
    setActionModalOpen(true)
  }

  return (
    <AssetManagerDashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6 text-black">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-900">Your Properties</h3>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{properties.length} properties</span>
              </div>
              <div className="flex items-center gap-3">
                {selectedProperties.size > 0 && (
                  <Button
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Selected ({selectedProperties.size})
                  </Button>
                )}
                <Button
                  onClick={() => setShowAddPropertyModal(true)}
                  className="bg-[#F84B5F] hover:bg-[#EE3646] text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all"
                >
                  Add New Property
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading properties...</div>
              ) : properties.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No properties found.</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b">
                    <tr>
                      <th className="text-center py-4 px-4 w-12">
                        <input
                          type="checkbox"
                          checked={properties.length > 0 && selectedProperties.size === properties.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property ID</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Name</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">State/Province</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">City/Area</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Postal Code</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Buildings</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Units</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {properties.map((property) => (
                      <tr key={property._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProperties.has(property._id)}
                            onChange={() => handleSelectProperty(property._id)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-5 px-6 text-center">
                          <span className="bg-cyan-50 text-[#006795] font-black px-3 py-1.5 rounded-lg text-xs shadow-sm border border-cyan-100/50 inline-block">
                            {property.propertyId}
                          </span>
                        </td>
                        <td className="py-5 px-6 font-bold text-sm text-gray-900 text-center">{property.name}</td>
                        <td className="py-5 px-6 font-bold text-xs text-gray-500 max-w-[150px] truncate text-center">{property.address}</td>
                        <td className="py-5 px-6 text-center">
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight">
                            {property.state}
                          </span>
                        </td>
                        <td className="py-5 px-6 font-bold text-xs text-gray-900 text-center">{property.city}</td>
                        <td className="py-5 px-6 font-bold text-xs text-gray-500 text-center">{property.zipCode}</td>
                        <td className="py-5 px-6 text-center font-black text-gray-900 text-sm">{property.buildings || 1}</td>
                        <td className="py-5 px-6 text-center font-black text-gray-900 text-sm">{property.units || 1}</td>
                        <td className="py-5 px-6 text-center">
                          {(() => {
                            const progress = propertyProgress[property._id] || 0
                            
                            // Check if there's a completed inspection in the database
                            const completedInspection = completedInspections.find(
                              insp => insp.property?._id === property._id && insp.status === 'completed'
                            )
                            
                            // Consider completed ONLY if progress is EXACTLY 100%
                            // If progress data exists, use it as source of truth
                            // Only fall back to DB status if no progress data available
                            const isCompleted = progress > 0 ? progress === 100 : !!completedInspection
                            const isLocked = !!(activeInspectionPropertyId && activeInspectionPropertyId !== property._id)
                            const isActive = activeInspectionPropertyId === property._id
                            
                            if (isCompleted) {
                              return (
                                <div className="flex items-center justify-center gap-2">
                                  <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200">
                                    Complete
                                  </span>
                                </div>
                              )
                            }
                            
                            return (
                              <button
                                onClick={() => handleInitiate(property)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 mx-auto whitespace-nowrap text-white bg-[#006795] hover:bg-[#0A5670]"
                              >
                                {(propertyProgress[property._id] || 0) > 0 ? 'In Progress' : 'Initiate'}
                              </button>
                            )
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </div>

      <ActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        onEdit={handleEditProperty}
        onStartInspection={() => {
          setActionModalOpen(false)
          router.push(`/asset-manager/dashboard/property-details/${selectedProperty?._id}`)
        }}
        onHoldInspection={handleHoldInspection}
        onRemoveProperty={handleRemoveProperty}
        propertyData={selectedProperty}
        inspectionStarted={(propertyProgress[selectedProperty?._id] || 0) > 0}
      />

      <UnitSelectionModal
        isOpen={unitSelectionOpen}
        onClose={() => setUnitSelectionOpen(false)}
        onContinue={handleUnitSelectionContinue}
        totalUnits={selectedProperty?.units || 20}
      />

      <EditPropertyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={fetchProperties}
        propertyData={selectedProperty}
      />

      <AddPropertyModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onNext={handleAddPropertyNext}
      />

      <BuildingDivisionModal
        isOpen={showBuildingDivisionModal}
        onClose={() => setShowBuildingDivisionModal(false)}
        propertyData={newPropertyData}
        onUpdate={handleBuildingUpdate}
      />
    </AssetManagerDashboardLayout>
  )
}
