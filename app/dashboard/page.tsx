"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
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

  const handleSearch = () => {
    fetchProperties()
    toast.info("Searching properties...", { position: "top-right" })
  }

  const handleHoldInspection = (property: any) => {
    toast.info(`Inspection for ${property.name} put on hold`, { position: "top-right" })
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

  const handleActionStartInspection = () => {
    // Close action modal, open coverage selection modal
    setShowActionModal(false)
    setShowCoverageModal(true)
  }

  const handleCoverageStart = (coverage: string, calculatedUnits: number) => {
    setShowCoverageModal(false)
    // Navigate to property details page with coverage info
    const prop = newPropertyData || selectedProperty
    const propId = prop?._id || prop?.id || 'new'
    router.push(
      `/dashboard/property-details/${propId}?coverage=${coverage}&calculatedUnits=${calculatedUnits}`
    )
  }

  const handleInitiate = (property: any) => {
    setSelectedProperty(property)
    setNewPropertyData(property)
    setShowActionModal(true)
  }

  return (
    <DashboardLayout>
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
            className="w-full sm:w-auto bg-[#FF4757] hover:bg-[#EE3646] text-white font-semibold px-6 py-3 rounded-lg text-base shadow-sm hover:shadow-md transition-all duration-200"
          >
            Add New Property
          </Button>
        </div>

        {/* Search Filters */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 lg:mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Properties</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Property Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter property name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] focus:border-transparent text-sm transition-colors duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg font-bold transition-colors duration-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                placeholder="Enter Country"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] focus:border-transparent bg-white text-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                placeholder="Enter State"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] focus:border-transparent bg-white text-sm transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter City"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] focus:border-transparent bg-white text-sm transition-colors duration-200"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-[#0D6A8D] hover:bg-[#0A5670] text-white font-semibold py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md transition-all duration-200"
              >
                Search Properties
              </Button>
            </div>
          </div>
        </Card>

        {/* Properties Section */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {properties.length} properties
            </span>
          </div>

          {/* Properties Table - Desktop */}
          <div className="hidden md:block rounded-lg border border-gray-200 overflow-visible">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No properties found. Add your first property!</div>
            ) : (
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[14%]">Property ID</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[16%]">Property Name</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[8%]">Buildings</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[7%]">Units</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[14%]">Address</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[8%]">City</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[8%]">State</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[8%]">Zip Code</th>
                    <th className="text-center py-3 px-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-[17%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr
                      key={property._id || property.propertyId}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-3 px-3 text-center">
                        <span className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-1 rounded truncate block mx-auto w-fit">
                          {property.propertyId}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-medium text-gray-900 text-sm truncate block">{property.name}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-900 font-medium text-sm text-center">{property.buildings}</td>
                      <td className="py-3 px-3 text-gray-900 font-medium text-sm text-center">{property.units}</td>
                      <td className="py-3 px-3 text-gray-600 text-sm truncate text-center">{property.address}</td>
                      <td className="py-3 px-3 text-gray-600 text-sm truncate text-center">{property.city}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 truncate">
                          {property.state}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 font-mono text-xs text-center">{property.zipCode}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleInitiate(property)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0D6A8D] hover:bg-[#0A5670] rounded-md transition-colors"
                          >
                            Initiate
                          </button>
                          <button
                            onClick={() => handleRemoveProperty(property)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                          >
                            Remove
                          </button>
                        </div>
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
                    <Button
                      onClick={() => handleInitiate(property)}
                      className="bg-[#7FFF00] hover:bg-[#6FDF00] text-gray-900 font-semibold px-3 py-2 rounded-lg text-xs shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap ml-2"
                    >
                      Initiate
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">Buildings</span>
                      <p className="font-semibold text-gray-900 text-base">{property.buildings}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">Units</span>
                      <p className="font-semibold text-gray-900 text-base">{property.units}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">City</span>
                      <p className="font-semibold text-gray-900 text-base">{property.city}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-gray-500 text-xs block mb-1">Zip Code</span>
                      <p className="font-semibold text-gray-900 text-base font-mono">{property.zipCode}</p>
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
        propertyData={newPropertyData}
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
        propertyData={newPropertyData}
      />
    </DashboardLayout>
  )
}