"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { inspectionsAPI } from "@/lib/api"
import { Country, State, City } from 'country-state-city'
import * as XLSX from 'xlsx'

interface RequestInspectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestInspectionModal({ isOpen, onClose }: RequestInspectionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    purpose: "",
    email: "",
    hudFre: "",
    management: "",
    insurance: "",
    banker: "",
    buildings: "",
    units: "",
    state: "",
    zipCode: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await inspectionsAPI.createRequest({
        purpose: formData.purpose,
        hudPreNegative: formData.hudFre === 'yes',
        managementCompany: formData.management,
        insuranceCompany: formData.insurance,
        banker: formData.banker,
        buildings: parseInt(formData.buildings) || 0,
        units: parseInt(formData.units) || 0,
        state: formData.state,
        zipCode: formData.zipCode,
      })

      if (response.success) {
        toast.success("Inspection request submitted successfully!", { position: "top-right" })
        onClose()
        setFormData({
          purpose: "",
          email: "",
          hudFre: "",
          management: "",
          insurance: "",
          banker: "",
          buildings: "",
          units: "",
          state: "",
          zipCode: ""
        })
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request", { position: "top-right" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative modal-content">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pr-8">Request Inspection by a certified Inspector.</h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Purpose of Inspection</label>
            <input
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Enter purpose of inspection"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">HUD Pre-Negative Inspection</label>
            <input
              type="text"
              value={formData.hudFre}
              onChange={(e) => setFormData({ ...formData, hudFre: e.target.value })}
              placeholder="Select option"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Management Co./Assessment</label>
            <input
              type="text"
              value={formData.management}
              onChange={(e) => setFormData({ ...formData, management: e.target.value })}
              placeholder="Enter management company or assessment"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Insurance Co / Risk Management</label>
              <input
                type="text"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                placeholder="Insurance company"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Banker / Sale</label>
              <input
                type="text"
                value={formData.banker}
                onChange={(e) => setFormData({ ...formData, banker: e.target.value })}
                placeholder="Banker or sale"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Number of buildings</label>
              <input
                type="text"
                value={formData.buildings}
                onChange={(e) => setFormData({ ...formData, buildings: e.target.value })}
                placeholder="e.g. 4"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Number of units</label>
              <input
                type="text"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                placeholder="e.g. 43"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">State / City</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter state / city"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Zip / Postal Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="Enter zip / postal code"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
          </div>

          <div className="flex justify-center pt-2 sm:pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 sm:px-12 py-3 bg-[#0D6A8D] hover:bg-[#0a5670] text-white font-semibold rounded-lg text-sm disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: (data: any) => void
}

interface PropertyFormData {
  propertyId?: string
  address: string
  propertyName: string
  country: string
  countryCode: string
  state: string
  stateCode: string
  buildings: string
  city: string
  units: string
  zipCode: string
}

const emptyPropertyForm: PropertyFormData = {
  propertyId: "",
  address: "",
  propertyName: "",
  country: "",
  countryCode: "",
  state: "",
  stateCode: "",
  buildings: "",
  city: "",
  units: "",
  zipCode: ""
}

export function AddPropertyModal({ isOpen, onClose, onNext }: AddPropertyModalProps) {
  const [properties, setProperties] = useState<PropertyFormData[]>([{ ...emptyPropertyForm }])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Location data from country-state-city package
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    // Load only specific countries
    const allCountries = Country.getAllCountries()
    const allowedCountries = ['United States', 'Canada', 'United Kingdom', 'Australia']
    const filteredCountries = allCountries.filter(country =>
      allowedCountries.includes(country.name)
    )
    setCountries(filteredCountries)
  }, [])

  const updateProperty = (index: number, field: keyof PropertyFormData, value: string) => {
    const updated = [...properties]
    updated[index] = { ...updated[index], [field]: value }

    // Reset dependent fields when country changes
    if (field === 'country') {
      const selectedCountry = countries.find(c => c.name === value)
      updated[index].countryCode = selectedCountry?.isoCode || ''
      updated[index].state = ''
      updated[index].stateCode = ''
      updated[index].city = ''

      // Load states for selected country
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode)
        setStates(countryStates)
      } else {
        setStates([])
      }
      setCities([])
    }

    // Reset city when state changes
    if (field === 'state') {
      const selectedState = states.find(s => s.name === value)
      updated[index].stateCode = selectedState?.isoCode || ''
      updated[index].city = ''

      // Load cities for selected state
      if (selectedState && updated[index].countryCode) {
        const stateCities = City.getCitiesOfState(updated[index].countryCode, selectedState.isoCode)
        setCities(stateCities)
      } else {
        setCities([])
      }
    }

    setProperties(updated)
  }

  const addNewProperty = () => {
    setProperties([...properties, { ...emptyPropertyForm }])
  }

  const removeProperty = (index: number) => {
    if (properties.length > 1) {
      setProperties(properties.filter((_, i) => i !== index))
    }
  }

  // File upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = async (file: File) => {
    const validTypes = [
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
      'text/csv'
    ]
    const validExtensions = ['.txt', '.xls', '.xlsx', '.pdf', '.csv']

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast.error("Please upload a .txt, .xls, .xlsx, .csv, or .pdf file", { position: "top-right" })
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)

    try {
      // For demo purposes, parse based on file type
      if (fileExtension === '.txt' || fileExtension === '.csv') {
        const text = await file.text()
        const parsedProperties = parseTextOrCSV(text)
        if (parsedProperties.length > 0) {
          setProperties(parsedProperties)
          toast.success(`Successfully imported ${parsedProperties.length} properties from file!`, { position: "top-right" })
        } else {
          toast.info("No property data found in file. Please check the format.", { position: "top-right" })
        }
      } else if (fileExtension === '.xls' || fileExtension === '.xlsx') {
        // Parse Excel file using xlsx library
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet)

        if (jsonData.length === 0) {
          toast.info("No data rows found in the Excel file.", { position: "top-right" })
        } else {
          const parsedProperties = parseExcelRows(jsonData)
          if (parsedProperties.length > 0) {
            setProperties(parsedProperties)
            toast.success(`Successfully imported ${parsedProperties.length} properties from Excel!`, { position: "top-right" })
          } else {
            toast.info("Could not match column headers. Expected: Property ID, Address, Property Name, Country, State, City, Postal Code, Buildings, Units", { position: "top-right" })
          }
        }
      } else if (fileExtension === '.pdf') {
        toast.info("PDF files require server-side processing. Please use .xlsx or .csv format.", { position: "top-right" })
      }
    } catch (error) {
      toast.error("Error processing file. Please try again.", { position: "top-right" })
    } finally {
      setIsProcessing(false)
    }
  }

  const parseTextOrCSV = (text: string): PropertyFormData[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    const properties: PropertyFormData[] = []
    const headers = lines[0].toLowerCase().split(/[,\t]/).map(h => h.trim())

    // Map common header names to our fields
    const fieldMapping: Record<string, keyof PropertyFormData> = {
      'property id': 'propertyId',
      'property id (optional)': 'propertyId',
      'propertyid': 'propertyId',
      'id': 'propertyId',
      'address': 'address',
      'property name': 'propertyName',
      'property nam': 'propertyName',
      'propertyname': 'propertyName',
      'name': 'propertyName',
      'country': 'country',
      'state': 'state',
      'province': 'state',
      'city': 'city',
      'area': 'city',
      'buildings': 'buildings',
      'building': 'buildings',
      'number of building': 'buildings',
      'number of buildings': 'buildings',
      'numberofbuilding': 'buildings',
      'numberofbuildings': 'buildings',
      'no of buildings': 'buildings',
      'units': 'units',
      'unit': 'units',
      'number of unit': 'units',
      'number of units': 'units',
      'numberofunit': 'units',
      'numberofunits': 'units',
      'no of units': 'units',
      'zip': 'zipCode',
      'zipcode': 'zipCode',
      'zip code': 'zipCode',
      'postal': 'zipCode',
      'postal code': 'zipCode',
      'postalcode': 'zipCode'
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/[,\t]/).map(v => v.trim())
      if (values.length === 0 || (values.length === 1 && !values[0])) continue

      const property: PropertyFormData = { ...emptyPropertyForm }

      headers.forEach((header, index) => {
        const field = fieldMapping[header]
        if (field && values[index]) {
          property[field] = values[index]
        }
      })

      // Only add if at least property ID or name exists
      if (property.propertyId || property.propertyName) {
        properties.push(property)
      }
    }

    return properties
  }

  const clearUploadedFile = () => {
    setUploadedFile(null)
  }

  // Excel field mapping: maps lowercase/trimmed header names to PropertyFormData keys
  const excelFieldMapping: Record<string, keyof PropertyFormData> = {
    'property id': 'propertyId',
    'property id (optional)': 'propertyId',
    'propertyid': 'propertyId',
    'id': 'propertyId',
    'address': 'address',
    'property name': 'propertyName',
    'property nam': 'propertyName',
    'propertyname': 'propertyName',
    'name': 'propertyName',
    'country': 'country',
    'state': 'state',
    'province': 'state',
    'city': 'city',
    'area': 'city',
    'buildings': 'buildings',
    'building': 'buildings',
    'number of building': 'buildings',
    'number of buildings': 'buildings',
    'numberofbuilding': 'buildings',
    'numberofbuildings': 'buildings',
    'no of buildings': 'buildings',
    'units': 'units',
    'unit': 'units',
    'number of unit': 'units',
    'number of units': 'units',
    'numberofunit': 'units',
    'numberofunits': 'units',
    'no of units': 'units',
    'zip': 'zipCode',
    'zipcode': 'zipCode',
    'zip code': 'zipCode',
    'postal': 'zipCode',
    'postal code': 'zipCode',
    'postalcode': 'zipCode'
  }

  const parseExcelRows = (rows: Record<string, any>[]): PropertyFormData[] => {
    const results: PropertyFormData[] = []

    for (const row of rows) {
      const property: PropertyFormData = { ...emptyPropertyForm }
      let hasData = false

      for (const [rawKey, rawValue] of Object.entries(row)) {
        const key = rawKey.toLowerCase().trim()
        const value = String(rawValue ?? '').trim()
        if (!value) continue

        // Try exact match first
        let field = excelFieldMapping[key]

        // If no exact match, try partial/fuzzy matching
        if (!field) {
          for (const [mappingKey, mappingField] of Object.entries(excelFieldMapping)) {
            if (key.includes(mappingKey) || mappingKey.includes(key)) {
              field = mappingField
              break
            }
          }
        }

        if (field) {
          property[field] = value
          hasData = true
        }
      }

      if (hasData && (property.propertyName || property.propertyId || property.address)) {
        results.push(property)
      }
    }

    return results
  }

  const getStatesForCountry = (countryName: string): any[] => {
    const country = countries.find(c => c.name === countryName)
    if (country) {
      return State.getStatesOfCountry(country.isoCode)
    }
    return []
  }

  const getCitiesForState = (countryName: string, stateName: string): any[] => {
    const country = countries.find(c => c.name === countryName)
    const state = states.find(s => s.name === stateName)
    if (country && state) {
      return City.getCitiesOfState(country.isoCode, state.isoCode)
    }
    return []
  }

  const handleNext = () => {
    // Validate all properties
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i]
      if (!prop.address || !prop.propertyName || !prop.country || !prop.state || !prop.city || !prop.zipCode) {
        toast.error(`Please fill in all required fields for Property ${i + 1}`, { position: "top-right" })
        return
      }
    }
    onNext(properties.length === 1 ? properties[0] : properties)
  }

  const handleClose = () => {
    setProperties([{ ...emptyPropertyForm }])
    setUploadedFile(null)
    setIsProcessing(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative modal-content">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-between mb-4 sm:mb-6 pr-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FF4757]">Add New Property</h2>
          <span className="bg-[#0D6A8D] text-white text-sm font-medium px-3 py-1 rounded-full">
            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
          </span>
        </div>

        <div className="space-y-6">
          {properties.map((formData, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-5 relative">
              {properties.length > 1 && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#0D6A8D]">Property {index + 1}</span>
                  <button
                    onClick={() => removeProperty(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Property ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.propertyId}
                    onChange={(e) => updateProperty(index, 'propertyId', e.target.value)}
                    placeholder="Property ID"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateProperty(index, 'address', e.target.value)}
                    placeholder="Enter your Address"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Property Name *</label>
                  <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(e) => updateProperty(index, 'propertyName', e.target.value)}
                    placeholder="Enter your Property Name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateProperty(index, 'city', e.target.value)}
                    placeholder="Enter City"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Number Of Buildings *</label>
                  <input
                    type="text"
                    value={formData.buildings}
                    onChange={(e) => updateProperty(index, 'buildings', e.target.value)}
                    placeholder="Number of Buildings"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateProperty(index, 'state', e.target.value)}
                    placeholder="Enter State"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Number Of Units *</label>
                  <input
                    type="text"
                    value={formData.units}
                    onChange={(e) => updateProperty(index, 'units', e.target.value)}
                    placeholder="Number of Units"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Zip *</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateProperty(index, 'zipCode', e.target.value)}
                    placeholder="Postal Code"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2 flex justify-center">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2 text-center">Country *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => updateProperty(index, 'country', e.target.value)}
                      placeholder="Enter Country"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#E8F4F8] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm text-center placeholder:text-center"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Button */}
          <div className="flex justify-center">
            <button
              onClick={addNewProperty}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FF4757] hover:bg-[#EE3646] text-white font-semibold rounded-lg text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Property
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Drag and Drop File Upload Section */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h3 className="text-sm font-semibold text-[#DC2626] mb-3 text-center">Import Properties From File</h3>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all cursor-pointer ${isDragging
                ? 'border-[#0D6A8D] bg-[#E8F4F8]'
                : 'border-gray-300 hover:border-[#0D6A8D] hover:bg-[#E8F4F8]/50'
                }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-[#0D6A8D] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Processing file...</p>
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      clearUploadedFile()
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto mb-3 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#0D6A8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold text-[#0D6A8D]">Drag & drop</span> your file here
                  </p>
                  <p className="text-xs text-gray-500 mb-3">or click to browse</p>
                  <input
                    type="file"
                    accept=".txt,.csv,.xls,.xlsx,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="property-file-upload"
                  />
                  <label
                    htmlFor="property-file-upload"
                    className="inline-block px-4 py-2 bg-[#0D6A8D] hover:bg-[#0a5670] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-400 mt-3">
                    Supported formats: TXT, CSV, XLS, XLSX, PDF
                  </p>
                </>
              )}
            </div>

            {/* File Format Guide */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Expected Column Headers:</p>
              <div className="flex flex-wrap gap-1.5">
                {['Property ID', 'Address', 'Property Name', 'Country', 'State', 'City', 'Postal Code', 'Buildings', 'Units'].map((col) => (
                  <span key={col} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4 sm:pt-6">
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 sm:px-16 py-3 bg-[#0D6A8D] hover:bg-[#0a5670] text-white font-semibold rounded-lg text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Building Division Modal (Property Details)
// ============================================
interface BuildingData {
  name: string
  units: number
}

interface BuildingDivisionModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (data: any, buildings: BuildingData[]) => void
  propertyData: any
}

export function BuildingDivisionModal({ isOpen, onClose, onUpdate, propertyData }: BuildingDivisionModalProps) {
  const [buildings, setBuildings] = useState<BuildingData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (propertyData && isOpen) {
      const numBuildings = parseInt(propertyData.buildings) || 1
      const totalUnits = parseInt(propertyData.units) || 0

      // Evenly divide units across buildings
      const unitsPerBuilding = Math.floor(totalUnits / numBuildings)
      const remainder = totalUnits % numBuildings

      setBuildings(prev => {
        // If we already have the correct number of buildings, just update units
        if (prev.length === numBuildings) {
          return prev.map((b, i) => ({
            ...b,
            units: unitsPerBuilding + (i < remainder ? 1 : 0)
          }))
        }

        // Otherwise, initialize new list
        const buildingList: BuildingData[] = []
        for (let i = 0; i < numBuildings; i++) {
          buildingList.push({
            name: `B${i + 1}`,
            units: unitsPerBuilding + (i < remainder ? 1 : 0),
          })
        }
        return buildingList
      })
    }
  }, [propertyData, isOpen])

  const updateBuildingName = (index: number, name: string) => {
    const updated = [...buildings]
    updated[index] = { ...updated[index], name }
    setBuildings(updated)
  }

  const updateBuildingUnits = (index: number, units: number) => {
    const updated = [...buildings]
    updated[index] = { ...updated[index], units }
    setBuildings(updated)
  }

  const handleUpdate = () => {
    // Validate building names
    for (let i = 0; i < buildings.length; i++) {
      if (!buildings[i].name.trim()) {
        toast.error(`Please enter a name for Building ${i + 1}`, { position: "top-right" })
        return
      }
    }
    setIsLoading(true)
    onUpdate(propertyData, buildings)
  }

  if (!isOpen || !propertyData) return null

  const propertyId = propertyData.propertyId || 'N/A'
  const propertyName = propertyData.propertyName || propertyData.name || 'N/A'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative modal-content">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Property Details</h2>

        {/* Property Info Header */}
        <div className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-6 border border-gray-200">
          <p className="text-sm sm:text-base font-semibold text-gray-900">
            Property ID: <span className="font-bold">{propertyId}</span>
            <span className="ml-4">Property Name: <span className="font-bold">{propertyName}</span></span>
          </p>
        </div>

        {/* Buildings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {buildings.map((building, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Building Name</label>
                  <input
                    type="text"
                    value={building.name}
                    onChange={(e) => updateBuildingName(index, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">No. of Unit</label>
                  <input
                    type="number"
                    value={building.units}
                    onChange={(e) => updateBuildingUnits(index, parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
                  />
                </div>
                <button
                  onClick={() => {
                    toast.success(`Building ${building.name} updated`, { position: "top-right" })
                  }}
                  className="px-3 py-2 bg-[#0D6A8D] hover:bg-[#0a5670] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Update<br />Unit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Update Button */}
        <Button
          onClick={handleUpdate}
          disabled={isLoading}
          className="w-full py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-lg text-sm sm:text-base transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            'Update'
          )}
        </Button>
      </div>
    </div>
  )
}

interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onStartInspection?: () => void
  onHoldInspection?: () => void
  onRemoveProperty?: () => void
  propertyData: any
}

export function ActionModal({ isOpen, onClose, onEdit, onStartInspection, onHoldInspection, onRemoveProperty, propertyData }: ActionModalProps) {
  const handleStartInspection = () => {
    if (onStartInspection) {
      onStartInspection()
    }
    onClose()
  }

  const handleRemove = () => {
    if (onRemoveProperty) {
      onRemoveProperty()
    } else {
      toast.error("Property removed", { position: "top-right" })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 sm:p-8 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full relative shadow-2xl border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Action</h2>

        <div className="space-y-4">
          <button
            onClick={onEdit}
            className="w-full px-6 py-4 bg-white border-2 border-black text-black font-bold rounded-xl text-base transition-all hover:bg-gray-50 active:scale-95"
          >
            Edit Property
          </button>
          
          <button
            onClick={handleStartInspection}
            className="w-full px-6 py-4 bg-[#00718F] text-white font-bold rounded-xl text-base transition-all hover:bg-[#005a72] shadow-lg active:scale-95"
          >
            Ready For Inspection
          </button>

          <button
            onClick={handleRemove}
            className="w-full px-6 py-4 bg-[#FF0000] text-white font-bold rounded-xl text-base transition-all hover:bg-[#cc0000] shadow-lg active:scale-95"
          >
            Remove Property
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Coverage Selection Modal (Random / 100% / 50%)
// ============================================

// NSPIRE Sampling Ranges (same as mobile app)
const NSPIRE_SAMPLING_RANGES: [number, number, number][] = [
  [1, 1, 1], [2, 2, 1], [3, 3, 2], [4, 4, 3], [5, 5, 4],
  [6, 6, 5], [7, 7, 6], [8, 8, 7], [9, 9, 8], [10, 10, 9],
  [11, 12, 9], [13, 14, 10], [15, 16, 11], [17, 18, 12],
  [19, 21, 13], [22, 24, 14], [25, 27, 15], [28, 30, 16],
  [31, 35, 17], [36, 39, 18], [40, 45, 19], [46, 51, 20],
  [52, 59, 21], [60, 67, 22], [68, 78, 23], [79, 92, 24],
  [93, 110, 25], [111, 120, 26], [121, 166, 27], [167, 214, 28],
  [215, 295, 29], [296, 455, 30], [456, 920, 31], [921, Infinity, 32],
]

function getNspireScoringFactor(totalUnits: number): number {
  for (const [min, max, factor] of NSPIRE_SAMPLING_RANGES) {
    if (totalUnits >= min && totalUnits <= max) return factor
  }
  return 32
}

const COVERAGE_OPTIONS = [
  { label: 'Random Sample', value: 'random', description: 'Automatically select a random sample based on NSPIRE guidelines' },
  { label: '50% - Half Units', value: '50', description: 'Inspect half of all units (randomly selected)' },
  { label: '100% - All Units', value: '100', description: 'Inspect every unit in the property' },
]

interface CoverageSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onStartInspection: (coverage: string, calculatedUnits: number) => void
  propertyData: any
}

export function CoverageSelectionModal({ isOpen, onClose, onStartInspection, propertyData }: CoverageSelectionModalProps) {
  const [selectedCoverage, setSelectedCoverage] = useState('100')
  const [calculatedUnits, setCalculatedUnits] = useState(0)

  const totalUnits = parseInt(propertyData?.units) || 1

  useEffect(() => {
    if (isOpen && propertyData) {
      setSelectedCoverage('random')
      setCalculatedUnits(getNspireScoringFactor(totalUnits))
    }
  }, [isOpen, propertyData])

  const handleCoverageChange = (coverage: string) => {
    setSelectedCoverage(coverage)
    let units = 0
    if (coverage === '100') {
      units = totalUnits
    } else if (coverage === '50') {
      units = Math.ceil(totalUnits / 2)
    } else if (coverage === 'random') {
      units = getNspireScoringFactor(totalUnits)
    }
    setCalculatedUnits(units)
  }

  const handleStart = () => {
    onStartInspection(selectedCoverage, calculatedUnits)
  }

  if (!isOpen || !propertyData) return null

  const propertyName = propertyData.propertyName || propertyData.name || 'N/A'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-black text-gray-900">Ready for Inspection</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-base font-bold text-gray-900 mb-1">{propertyName}</p>
        <p className="text-sm text-gray-600 mb-6">
          Total Units: <span className="font-bold text-gray-900">{totalUnits}</span>
        </p>

        <p className="text-sm font-bold text-gray-700 mb-3">Select Inspection Coverage</p>

        <div className="space-y-3 mb-6">
          {COVERAGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleCoverageChange(option.value)}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${selectedCoverage === option.value
                ? 'border-[#0D6A8D] bg-[#E8F4F8]'
                : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${selectedCoverage === option.value ? 'border-[#0D6A8D]' : 'border-gray-300'
                }`}>
                {selectedCoverage === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0D6A8D]" />
                )}
              </div>
              <div>
                <p className={`text-sm font-bold ${selectedCoverage === option.value ? 'text-[#0D6A8D]' : 'text-gray-900'
                  }`}>
                  {option.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-[#F1F7FE] rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">Units to Inspect:</span>
          <span className="text-lg font-black text-[#0D6A8D]">{calculatedUnits}</span>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl text-sm sm:text-base transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Start Inspection
        </button>
      </div>
    </div>
  )
}

interface EditPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  propertyData: any
}

export function EditPropertyModal({ isOpen, onClose, propertyData }: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    propertyId: propertyData?.propertyId || "80000017",
    address: propertyData?.address || "3200 LATOUCHE ST",
    propertyName: propertyData?.propertyName || "STEPHEN'S PARK APARTMENTS",
    country: propertyData?.country || "United States",
    countryCode: propertyData?.countryCode || "US",
    state: propertyData?.state || "Alaska",
    stateCode: propertyData?.stateCode || "AK",
    buildings: propertyData?.buildings || "12",
    city: propertyData?.city || "Anchorage",
    units: propertyData?.units || "160",
    zipCode: propertyData?.zipCode || "99508"
  })

  // Location data from country-state-city package
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    // Load only specific countries
    const allCountries = Country.getAllCountries()
    const allowedCountries = ['United States', 'Canada', 'United Kingdom', 'Australia']
    const filteredCountries = allCountries.filter(country =>
      allowedCountries.includes(country.name)
    )
    setCountries(filteredCountries)

    // Load states for current country if exists
    if (formData.country) {
      const selectedCountry = filteredCountries.find(c => c.name === formData.country)
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode)
        setStates(countryStates)

        // Load cities for current state if exists
        if (formData.state) {
          const selectedState = countryStates.find(s => s.name === formData.state)
          if (selectedState) {
            const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
            setCities(stateCities)
          }
        }
      }
    }
  }, [formData.country, formData.state])

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName)
    setFormData({
      ...formData,
      country: countryName,
      countryCode: selectedCountry?.isoCode || '',
      state: '',
      stateCode: '',
      city: ''
    })

    // Load states for selected country
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode)
      setStates(countryStates)
    } else {
      setStates([])
    }
    setCities([])
  }

  const handleStateChange = (stateName: string) => {
    const selectedState = states.find(s => s.name === stateName)
    setFormData({
      ...formData,
      state: stateName,
      stateCode: selectedState?.isoCode || '',
      city: ''
    })

    // Load cities for selected state
    if (selectedState && formData.countryCode) {
      const stateCities = City.getCitiesOfState(formData.countryCode, selectedState.isoCode)
      setCities(stateCities)
    } else {
      setCities([])
    }
  }

  const handleUpdate = () => {
    toast.success("Property updated successfully!", { position: "top-right" })
    onClose()
  }

  const handleDelete = () => {
    toast.error("Property deleted", { position: "top-right" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center pr-8">Edit or Delete Property</h2>

        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Property ID</label>
              <input
                type="text"
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Property Name</label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Enter Country"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">State (Province)</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter State"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">City (Area)</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter City"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Number Of Building</label>
              <input
                type="text"
                value={formData.buildings}
                onChange={(e) => setFormData({ ...formData, buildings: e.target.value })}
                placeholder="Number of Buildings"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0D6A8D] mb-2">Number Of Unit</label>
              <input
                type="text"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
            <Button
              onClick={handleUpdate}
              className="w-full sm:w-auto px-8 sm:px-12 py-3 bg-[#0D6A8D] hover:bg-[#0a5670] text-white font-semibold rounded-lg text-sm"
            >
              Update
            </Button>
            <Button
              onClick={handleDelete}
              className="w-full sm:w-auto px-8 sm:px-12 py-3 bg-[#FF4757] hover:bg-[#EE3646] text-white font-semibold rounded-lg text-sm"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
