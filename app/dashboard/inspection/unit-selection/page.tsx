"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UnitSelection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('property')
  const [searchName, setSearchName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const units = [
    { id: "101", status: "needs-attention", label: "Needs Attention", color: "text-gray-900", bgColor: "bg-white" },
    { id: "102", status: "completed", label: "Completed", color: "text-gray-900", bgColor: "bg-white" },
    { id: "103", status: "unpaid", label: "Unpaid", color: "text-gray-900", bgColor: "bg-white" },
  ]

  const properties = [
    { id: "001", name: "COHEN'S PARK APA...", units: 12 }
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
            Search By Name, City Or State
          </h1>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <Button
              className="w-full bg-[#FF4757] hover:bg-[#E63946] text-white font-semibold py-3 sm:py-4 md:py-5 rounded-lg text-sm sm:text-base md:text-lg shadow-md transition-all"
            >
              Add Property
            </Button>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-6">
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Property Name
                </label>
                <Input
                  type="text"
                  placeholder="Property Name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D6A8D] focus:border-transparent"
                />
              </div>

              {/* State Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Input
                  type="text"
                  placeholder="Enter State"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D6A8D] focus:border-transparent"
                />
              </div>

              {/* City Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  placeholder="Enter City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D6A8D] focus:border-transparent"
                />
              </div>

              {/* Search Button */}
              <Button
                className="w-full bg-[#0D6A8D] hover:bg-[#0A5670] text-white font-semibold py-3 sm:py-4 rounded-lg text-sm sm:text-base shadow-md transition-all"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Property Results */}
          <div className="space-y-3 sm:space-y-4 mb-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-md p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-500">
                        #{property.id}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {property.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Units: {property.units}
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push(`/dashboard/inspection/unit-selection?property=${property.id}`)}
                    className="w-full sm:w-auto bg-[#B8FF00] hover:bg-[#A5E600] text-gray-900 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base shadow-md transition-all"
                  >
                    Initiate
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Unit Selection Section - Only show if property is selected */}
          {propertyId && (
            <>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 mt-8">
                Select Units for Property {propertyId}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {units.map((unit) => (
                  <Card
                    key={unit.id}
                    className={`${unit.bgColor} border-2 border-gray-300 rounded-xl p-4 sm:p-5 md:p-6 cursor-pointer hover:shadow-lg hover:border-[#0D6A8D] transition-all`}
                    onClick={() => router.push(`/dashboard/inspection/${unit.id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></span>
                          <span className={`text-xs sm:text-sm font-medium ${unit.color}`}>
                            {unit.label}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                          Unit {unit.id}
                        </h3>
                      </div>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">Click to inspect</p>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={() => router.push('/dashboard/inspection/summary')}
                  className="w-full sm:flex-1 bg-[#0D6A8D] hover:bg-[#0A5670] text-white font-semibold py-3 sm:py-4 rounded-lg text-sm sm:text-base shadow-md transition-all"
                >
                  View Summary
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 sm:py-4 rounded-lg text-sm sm:text-base shadow-md transition-all"
                >
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
