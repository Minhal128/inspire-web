"use client"

import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { propertiesAPI } from "@/lib/api"
import { UnitSelectionModal } from "@/components/UnitSelectionModal"
import { ActionModal } from "@/components/PropertyModals"
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
    router.push('/dashboard/inspection/summary')
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
      if (response.success) {
        setProperties(response.properties)
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error)
      toast.error("Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchProperties()
  }

  const handleActionClick = (property: any) => {
    setSelectedProperty(property)
    setActionModalOpen(true)
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6 text-black">
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3 border-l-4 border-[#0D7FA8]">
            <svg className="w-6 h-6 text-[#0D7FA8] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">You can manage properties, buildings, and units here. To perform inspections, please use the INSPIRE app in the tablet.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search by Name, City or State</h2>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    Inspector Portal supports: United States, Canada, United Kingdom & Australia
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <input
                type="text"
                placeholder="Property Name"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7FA8] text-sm text-black"
              />

              <input
                type="text"
                placeholder="Enter Country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7FA8] text-sm bg-white text-black"
              />

              <input
                type="text"
                placeholder="Enter State"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7FA8] text-sm bg-white text-black"
              />

              <input
                type="text"
                placeholder="Enter City"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7FA8] text-sm bg-white text-black"
              />

              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-[#0D7FA8] hover:bg-[#0A5F7F] text-white font-semibold rounded-lg transition-colors text-sm">
                Search
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setUnitSelectionOpen(true)}
                className="px-6 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Select Units for Inspection
              </button>
            </div>
          </div>

          <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-gray-900">Your Properties</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{properties.length} properties</span>
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
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property ID</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Name</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Buildings</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Units</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">City</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">State</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Zip Code</th>
                      <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {properties.map((property) => (
                      <tr key={property._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-6 text-center">
                          <span className="bg-cyan-50 text-[#006795] font-black px-3 py-1.5 rounded-lg text-xs shadow-sm border border-cyan-100/50 inline-block">
                            {property.propertyId}
                          </span>
                        </td>
                        <td className="py-5 px-6 font-bold text-sm text-gray-900 text-center">{property.name}</td>
                        <td className="py-5 px-6 text-center font-black text-gray-900 text-sm">{property.buildings || 1}</td>
                        <td className="py-5 px-6 text-center font-black text-gray-900 text-sm">{property.units || 1}</td>
                        <td className="py-5 px-6 font-bold text-xs text-gray-500 max-w-[150px] truncate text-center">{property.address}</td>
                        <td className="py-5 px-6 font-bold text-xs text-gray-900 text-center">{property.city}</td>
                        <td className="py-5 px-6 text-center">
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight">
                            {property.state}
                          </span>
                        </td>
                        <td className="py-5 px-6 font-bold text-xs text-gray-500 text-center">{property.zipCode}</td>
                        <td className="py-5 px-6 text-center">
                          <button
                            onClick={() => handleActionClick(property)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
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
        onEdit={() => setActionModalOpen(false)}
        onStartInspection={() => {
          setActionModalOpen(false)
          router.push(`/dashboard/property-details/${selectedProperty?._id}`)
        }}
        onHoldInspection={handleHoldInspection}
        onRemoveProperty={handleRemoveProperty}
        propertyData={selectedProperty}
      />

      <UnitSelectionModal
        isOpen={unitSelectionOpen}
        onClose={() => setUnitSelectionOpen(false)}
        onContinue={handleUnitSelectionContinue}
        totalUnits={selectedProperty?.units || 20}
      />
    </DashboardLayout>
  )
}
