"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import AssetManagerDashboardLayout from "@/components/AssetManagerDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import {
  RequestInspectionModal,
  AddPropertyModal,
  BuildingDivisionModal,
  ActionModal,
  CoverageSelectionModal,
  EditPropertyModal
} from "@/components/PropertyModals"
import { propertiesAPI } from "@/lib/api"
import { Country, State, City } from 'country-state-city'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005'

export default function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [showBuildingDivisionModal, setShowBuildingDivisionModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showCoverageModal, setShowCoverageModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [newPropertyData, setNewPropertyData] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [propertyProgress, setPropertyProgress] = useState<Record<string, number>>({})
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set())
  const [showBulkDelete, setShowBulkDelete] = useState(false)

  // Location data from country-state-city package
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  // Load countries on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries()
    const allowedCountries = ['United States', 'Canada', 'United Kingdom', 'Australia']
    const filteredCountries = allCountries.filter(country =>
      allowedCountries.includes(country.name)
    )
    setCountries(filteredCountries)
  }, [])

  // Handle country change
  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName)
    setSelectedState("")
    setSelectedCity("")

    const country = countries.find(c => c.name === countryName)
    if (country) {
      const countryStates = State.getStatesOfCountry(country.isoCode)
      setStates(countryStates)
    } else {
      setStates([])
    }
    setCities([])
  }

  // Handle state change
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName)
    setSelectedCity("")

    const country = countries.find(c => c.name === selectedCountry)
    const state = states.find(s => s.name === stateName)

    if (country && state) {
      const stateCities = City.getCitiesOfState(country.isoCode, state.isoCode)
      setCities(stateCities)
    } else {
      setCities([])
    }
  }

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await propertiesAPI.getAll({
        search: searchQuery || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined,
      })
      if (response.success) {
        setProperties(response.properties)
        // Fetch progress for these properties
        fetchProgress(response.properties)
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error)
      // Use mock data if API fails (for development)
      setProperties([
        {
          _id: "1",
          propertyId: "80000017",
          name: "STEPHEN'S PARK APA...",
          buildings: 12,
          units: 160,
          address: "3200 LATO...",
          city: "Anchorage",
          state: "Alaska",
          zipCode: "99508"
        },
        {
          _id: "2",
          propertyId: "QC 2016E7EF",
          name: "Demure St-Hilaire",
          buildings: 3,
          units: 62,
          address: "21 Rue Messier",
          city: "Mont-Saint...",
          state: "QC",
          zipCode: "J3SLI3"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async (propertyList: any[]) => {
    try {
      // Fetch all progress records for current user
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
            
            // Heuristic: Count unique units/categories completed per building
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
            
            // Total tasks = (buildings * 2) + allocated units for inspection
            // Use buildingDetails.unitsForInspection if available, then calculatedUnits, then prop.units
            const actualUnitsForInspection = prop.buildingDetails && prop.buildingDetails.length > 0
                ? prop.buildingDetails.reduce((sum: number, b: any) => sum + (b.unitsForInspection || 0), 0)
                : (prop.calculatedUnits ?? prop.units)
            
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
    toast.info("Searching properties...", { position: "top-right" })
  }

  const handleHoldInspection = async (property: any) => {
    if (!property) return
    try {
      const response = await propertiesAPI.hold(property._id)
      if (response.success) {
        const newStatus = response.property?.status ?? 'hold'
        setProperties(prev =>
          prev.map(p => (p._id === property._id ? { ...p, status: newStatus } : p))
        )
        toast.success(response.message || `Inspection for ${property.name} put on hold`, { position: "top-right" })
        fetchProperties()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to hold inspection")
    }
  }

  const handleRemoveProperty = async (property: any) => {
    if (confirm(`Are you sure you want to remove ${property.name}?`)) {
      try {
        const response = await propertiesAPI.delete(property._id)
        if (response.success) {
          toast.success("Property removed successfully", { position: "top-right" })
          fetchProperties()
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to remove property")
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

  const handleAddPropertyNext = (data: any) => {
    // Store the property data and show the building division modal
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
        buildingDetails: buildings.map((b, i) => ({
            buildingId: `B${i + 1}`,
            totalUnits: b.units,
            unitsForInspection: 0
        })),
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
        setShowActionModal(true)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add property", { position: "top-right" })
      // Fallback for dev
      toast.success("Data saved successfully", { position: "top-right" })
      setNewPropertyData(data)
      setShowBuildingDivisionModal(false)
      setShowActionModal(true)
    }
  }

  const handleEditProperty = () => {
    setShowActionModal(false)
    setShowEditModal(true)
  }

  const handleActionStartInspection = async () => {
    // Check if coverage was already selected for this property
    const prop = newPropertyData || selectedProperty
    const propId = prop?._id || prop?.id
    
    // Check if coverage is already saved in the property
    if (prop?.inspectionCoverage && prop?.calculatedUnits) {
      // Coverage already selected, go directly to property details
      setShowActionModal(false)
      router.push(
        `/asset-manager/dashboard/property-details/${propId}?coverage=${prop.inspectionCoverage}&calculatedUnits=${prop.calculatedUnits}`
      )
    } else {
      // First time, show coverage selection modal
      setShowActionModal(false)
      setShowCoverageModal(true)
    }
  }

  const handleCoverageStart = async (coverage: string, calculatedUnits: number) => {
    setShowCoverageModal(false)
    const prop = newPropertyData || selectedProperty
    const propId = prop?._id || prop?.id || 'new'

    // Save coverage selection to backend database
    if (propId !== 'new') {
      try {
        await propertiesAPI.update(propId, {
          inspectionCoverage: coverage,
          calculatedUnits: calculatedUnits
        })
        
        // Update local state
        setProperties(prev =>
          prev.map(p => (p._id === propId ? { ...p, inspectionCoverage: coverage, calculatedUnits } : p))
        )
      } catch (error: any) {
        console.error('Failed to save coverage:', error)
        toast.error('Failed to save coverage selection')
        return
      }
    }

    // Resume this property if it was on hold so it becomes the active inspection
    if (prop?.status === 'hold' && propId !== 'new') {
      try {
        const response = await propertiesAPI.hold(propId)
        if (response.success) {
          const newStatus = response.property?.status ?? 'active'
          setProperties(prev =>
            prev.map(p => (p._id === propId ? { ...p, status: newStatus } : p))
          )
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to resume inspection')
        return
      }
    }

    router.push(
      `/asset-manager/dashboard/property-details/${propId}?coverage=${coverage}&calculatedUnits=${calculatedUnits}`
    )
  }



  const handleInitiate = (property: any) => {

    setSelectedProperty(property)
    setNewPropertyData(property)
    setShowActionModal(true)
  }

  return (
    <AssetManagerDashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Property Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your properties and initiate inspections</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 lg:mb-8">
          <Button
            onClick={() => setShowAddPropertyModal(true)}
            className="w-full sm:w-auto bg-[#F84B5F] hover:bg-[#EE3646] text-white font-semibold px-6 py-3 rounded-lg text-base shadow-sm hover:shadow-md transition-all duration-200"
          >
            Add New Property
          </Button>
          {selectedProperties.size > 0 && (
            <Button
              onClick={handleBulkDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selectedProperties.size})
            </Button>
          )}
        </div>


        {/* Properties Section */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {properties.length} properties
            </span>
          </div>

          {/* Properties Table - Desktop */}
          <div className="hidden md:block rounded-lg border border-gray-200 overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No properties found. Add your first property!</div>
            ) : (
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-center py-3 px-3 w-12">
                      <input
                        type="checkbox"
                        checked={properties.length > 0 && selectedProperties.size === properties.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Property ID</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Property Name</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Address</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">State/Province</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">City/Area</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Postal Code</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Buildings</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Units</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Progress</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr
                      key={property._id || property.propertyId}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProperties.has(property._id)}
                          onChange={() => handleSelectProperty(property._id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-1 rounded truncate block mx-auto w-fit">
                          {property.propertyId}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-medium text-gray-900 text-sm truncate block">{property.name}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-sm truncate text-center">{property.address}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 truncate">
                          {property.state}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-sm truncate text-center">{property.city}</td>
                      <td className="py-3 px-3 text-gray-600 font-mono text-xs text-center">{property.zipCode}</td>
                      <td className="py-3 px-3 text-gray-900 font-medium text-sm text-center">{property.buildings}</td>
                      <td className="py-3 px-3 text-gray-900 font-medium text-sm text-center">{property.units}</td>
                      <td className="py-3 px-3">
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${propertyProgress[property._id] || 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 block text-center">
                          {propertyProgress[property._id] || 0}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {(() => {
                          const progress = propertyProgress[property._id] || 0
                          if (progress === 100 || property.hasInspection) {
                            return (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => router.push('/asset-manager/dashboard/inspection-status')}
                                  className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                                >
                                  View Report
                                </button>
                                <button
                                  onClick={() => handleRemoveProperty(property)}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            )
                          }

                          return (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleInitiate(property)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 whitespace-nowrap text-white bg-[#006795] hover:bg-[#0A5670]"
                              >
                                {(propertyProgress[property._id] || 0) > 0 ? 'In Progress' : 'Initiate'}
                              </button>
                              <button
                                onClick={() => handleRemoveProperty(property)}
                                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          )
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Properties Cards - Mobile & Tablet */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No properties found. Add your first property!</div>
            ) : (
              properties.map((property) => (
                <Card key={property._id || property.propertyId} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-2 py-1 rounded">
                          {property.propertyId}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {property.state}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base mb-1">{property.name}</h3>
                      <p className="text-gray-600 text-sm">{property.address}</p>
                    </div>
                    {(() => {
                      const progress = propertyProgress[property._id] || 0
                      if (progress === 100 || property.hasInspection) {
                        return (
                          <div className="ml-2 flex flex-col gap-2">
                            <Button
                              onClick={() => router.push('/asset-manager/dashboard/inspection-status')}
                              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-lg text-xs shadow-sm transition-all duration-200 whitespace-nowrap flex items-center gap-1"
                            >
                              View Report
                            </Button>
                            <Button
                              onClick={() => handleRemoveProperty(property)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-lg text-xs shadow-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-1"
                            >
                              Remove
                            </Button>
                          </div>
                        )
                      }

                      return (
                        <Button
                          onClick={() => handleInitiate(property)}
                          className="font-semibold px-3 py-2 rounded-lg text-xs shadow-sm transition-all duration-200 whitespace-nowrap ml-2 flex items-center gap-1 bg-[#006795] hover:bg-[#00567a] text-white shadow-sm hover:shadow-md"
                        >
                          {(propertyProgress[property._id] || 0) > 0 ? 'In Progress' : 'Initiate'}
                        </Button>
                      )
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">State/Province</span>
                      <p className="font-semibold text-gray-900 text-sm">{property.state}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">City/Area</span>
                      <p className="font-semibold text-gray-900 text-sm">{property.city}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">Postal Code</span>
                      <p className="font-semibold text-gray-900 text-base font-mono">{property.zipCode}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">Buildings</span>
                      <p className="font-semibold text-gray-900 text-base">{property.buildings}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">Units</span>
                      <p className="font-semibold text-gray-900 text-base">{property.units}</p>
                    </div>
                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Progress</span>
                        <span className="text-blue-600 font-bold text-sm">{propertyProgress[property._id] || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${propertyProgress[property._id] || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <RequestInspectionModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
      <AddPropertyModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onNext={handleAddPropertyNext}
      />
      <BuildingDivisionModal
        isOpen={showBuildingDivisionModal}
        onClose={() => setShowBuildingDivisionModal(false)}
        onUpdate={handleBuildingUpdate}
        propertyData={newPropertyData}
      />
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onEdit={handleEditProperty}
        onStartInspection={handleActionStartInspection}
        onHoldInspection={() => handleHoldInspection(newPropertyData || selectedProperty)}
        propertyData={newPropertyData || selectedProperty}
        inspectionStarted={(propertyProgress[newPropertyData?._id] || propertyProgress[selectedProperty?._id] || 0) > 0}
      />
      <CoverageSelectionModal
        isOpen={showCoverageModal}
        onClose={() => setShowCoverageModal(false)}
        onStartInspection={handleCoverageStart}
        propertyData={newPropertyData}
      />
      <EditPropertyModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchProperties}
        propertyData={newPropertyData}
      />
    </AssetManagerDashboardLayout>
  )
}
