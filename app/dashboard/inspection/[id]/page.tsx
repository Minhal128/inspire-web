"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"

type ItemStatus = "Pass" | "Fail" | "N/A"

interface InspectionItem {
  id: string
  name: string
  status: ItemStatus | null
  remarks: string
  photos: number
}

export default function InspectionPage() {
  const router = useRouter()
  const params = useParams()
  const unitId = params.id as string

  const [currentSection, setCurrentSection] = useState(0)
  const [sections, setSections] = useState([
    {
      name: "Electrical",
      items: [
        { id: "e1", name: "All outlets are functioning properly", status: "Pass" as ItemStatus, remarks: "", photos: 0 },
        { id: "e2", name: "No exposed wiring or hazards", status: "Fail" as ItemStatus, remarks: "Exposed wiring near kitchen outlet", photos: 1 },
        { id: "e3", name: "Circuit breaker panel is accessible", status: "Pass" as ItemStatus, remarks: "", photos: 0 },
      ]
    },
    {
      name: "Plumbing",
      items: [
        { id: "p1", name: "No visible leaks under sinks", status: null, remarks: "", photos: 0 },
        { id: "p2", name: "Water pressure is adequate", status: null, remarks: "", photos: 0 },
        { id: "p3", name: "Drainage is functioning properly", status: null, remarks: "", photos: 0 },
      ]
    },
    {
      name: "Fire Safety",
      items: [
        { id: "f1", name: "Smoke detectors are installed and functional", status: null, remarks: "", photos: 0 },
        { id: "f2", name: "Fire extinguisher is accessible", status: null, remarks: "", photos: 0 },
        { id: "f3", name: "Emergency exits are marked and accessible", status: null, remarks: "", photos: 0 },
      ]
    },
  ])

  const currentSectionData = sections[currentSection]
  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0)
  const completedItems = sections.reduce((sum, section) => 
    sum + section.items.filter(item => item.status !== null).length, 0
  )
  const progressPercentage = Math.round((completedItems / totalItems) * 100)

  const updateItemStatus = (sectionIndex: number, itemId: string, status: ItemStatus) => {
    setSections(prev => {
      const updated = [...prev]
      const item = updated[sectionIndex].items.find(i => i.id === itemId)
      if (item) item.status = status
      return updated
    })
  }

  const updateItemRemarks = (sectionIndex: number, itemId: string, remarks: string) => {
    setSections(prev => {
      const updated = [...prev]
      const item = updated[sectionIndex].items.find(i => i.id === itemId)
      if (item) item.remarks = remarks
      return updated
    })
  }

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!", { position: "top-right" })
  }

  const handleSubmit = () => {
    if (completedItems < totalItems) {
      toast.warning(`Please complete all items (${completedItems}/${totalItems} completed)`, { position: "top-right" })
      return
    }
    toast.success("Inspection submitted successfully!", { position: "top-right" })
    setTimeout(() => router.push('/dashboard/inspection/summary'), 1500)
  }

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Property Header */}
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">Unit {unitId} Inspection</h1>
                <p className="text-sm sm:text-base text-gray-600">Sunset Apartments, New York</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button onClick={handleSaveDraft} variant="outline" className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base">
                  Save Draft
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#B8FF00] hover:bg-[#A5E600] text-black font-semibold text-sm sm:text-base"
                >
                  Submit Inspection
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Progress: {completedItems} of {totalItems} items checked
              </p>
              <span className="text-base sm:text-lg font-bold text-[#0D6A8D]">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div 
                className="bg-[#0D6A8D] h-2 sm:h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors text-sm sm:text-base ${
                    currentSection === index 
                      ? 'bg-[#0D6A8D] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          {/* Inspection Items */}
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">{currentSectionData.name}</h2>
            
            <div className="space-y-4 sm:space-y-6">
              {currentSectionData.items.map((item) => (
                <div key={item.id} className="border-b pb-4 sm:pb-6 last:border-b-0">
                  <div className="flex flex-col gap-3 mb-4">
                    <p className="font-medium text-sm sm:text-base text-gray-800">{item.name}</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateItemStatus(currentSection, item.id, "Pass")}
                        className={`flex-1 min-w-[80px] px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                          item.status === "Pass"
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        Pass
                      </button>
                      <button
                        onClick={() => updateItemStatus(currentSection, item.id, "Fail")}
                        className={`flex-1 min-w-[80px] px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                          item.status === "Fail"
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                        }`}
                      >
                        Fail
                      </button>
                      <button
                        onClick={() => updateItemStatus(currentSection, item.id, "N/A")}
                        className={`flex-1 min-w-[80px] px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                          item.status === "N/A"
                            ? 'bg-gray-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        N/A
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Add Remarks
                      </label>
                      <textarea
                        value={item.remarks}
                        onChange={(e) => updateItemRemarks(currentSection, item.id, e.target.value)}
                        placeholder="Enter any additional notes or observations..."
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6A8D] resize-none text-sm sm:text-base"
                        rows={2}
                      />
                    </div>
                    <button className="self-start sm:mt-7 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>

                  {item.photos > 0 && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">{item.photos} photo(s) attached</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button
              onClick={goToPrevSection}
              disabled={currentSection === 0}
              variant="outline"
              className="w-full sm:w-auto px-6 sm:px-8 py-2 text-sm sm:text-base"
            >
              ← Previous Section
            </Button>
            <Button
              onClick={goToNextSection}
              disabled={currentSection === sections.length - 1}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 bg-[#0D6A8D] hover:bg-[#0a5670] text-white text-sm sm:text-base"
            >
              Next Section →
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
