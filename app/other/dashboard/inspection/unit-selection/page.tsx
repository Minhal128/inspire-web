"use client"

/**
 * Unit selection, matching the app's UnitInspectionScreen.
 *
 * What stood here was a mockup: three hardcoded units (101, 102, 103) and one
 * hardcoded property named "COHEN'S PARK APA...". Nothing was loaded and
 * nothing was sampled.
 *
 * The app picks units by the NSPIRE table and a seed derived from the property
 * id, so the same property always sends every inspector to the same doors.
 * lib/unitSampling.ts is that logic, ported unchanged.
 */

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import OtherDashboardLayout from "@/components/OtherDashboardLayout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "react-toastify"
import { propertiesAPI } from "@/lib/api"
import {
  generateRandomUnitSample,
  getSamplingExplanation,
  isRandomSelectionAvailable,
  type UnitSample,
} from "@/lib/unitSampling"

export default function UnitSelection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get("property") || searchParams.get("id") || ""

  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sample, setSample] = useState<UnitSample | null>(null)

  const loadProperty = useCallback(async () => {
    if (!propertyId) {
      setLoading(false)
      return
    }
    try {
      const data = await propertiesAPI.getById(propertyId)
      setProperty(data?.property || data)
    } catch (error: any) {
      console.error("Could not load the property:", error)
      toast.error(error?.message || "Could not load this property", { position: "top-right" })
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => {
    loadProperty()
  }, [loadProperty])

  const totalUnits = Number(property?.totalUnits ?? property?.units ?? 0)

  // Unit 001 .. Unit NNN, the names the sampler works in.
  const allUnits = useMemo(
    () =>
      Array.from({ length: totalUnits }, (_, i) => `Unit ${(i + 1).toString().padStart(3, "0")}`),
    [totalUnits]
  )

  const inspectUnit = (unitName: string) => {
    router.push(
      `/other/dashboard/inspection-category/${propertyId}?unit=${encodeURIComponent(unitName)}&units=1`
    )
  }

  const handleRandomUnitSelection = () => {
    try {
      if (!isRandomSelectionAvailable(totalUnits)) {
        toast.error(`Random selection needs at least 1 unit; this property has ${totalUnits}.`, {
          position: "top-right",
        })
        return
      }
      setSample(generateRandomUnitSample(totalUnits, propertyId))
    } catch (error: any) {
      toast.error(error?.message || "Could not generate a unit sample", { position: "top-right" })
    }
  }

  if (loading) {
    return (
      <OtherDashboardLayout>
        <div className="min-h-screen bg-[#E8F4F8] p-6 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-600">Loading property...</span>
        </div>
      </OtherDashboardLayout>
    )
  }

  if (!property) {
    return (
      <OtherDashboardLayout>
        <div className="min-h-screen bg-[#E8F4F8] p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">No property selected</h1>
            <p className="text-sm text-gray-600 mb-4">
              Open this page from a property so its units can be loaded.
            </p>
            <Button onClick={() => router.push("/other/dashboard")} className="bg-[#006795] text-white">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </OtherDashboardLayout>
    )
  }

  return (
    <OtherDashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Select Unit For Inspection
          </h1>

          {/* Property card */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#006795]">{property.name}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {[property.address, property.city, property.state].filter(Boolean).join(", ")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={() =>
                  router.push(`/other/dashboard/inspection-category/${propertyId}?units=${totalUnits}`)
                }
                className="h-11 gap-2 bg-[#006795] hover:bg-[#0A5670] text-white font-semibold rounded-lg"
              >
                Start AI Inspection
              </Button>

              {isRandomSelectionAvailable(totalUnits) && (
                <Button
                  onClick={handleRandomUnitSelection}
                  className="h-11 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Random Unit Selection
                </Button>
              )}
            </div>

            {isRandomSelectionAvailable(totalUnits) && (
              <p className="text-xs text-gray-500 mt-3">{getSamplingExplanation(totalUnits)}</p>
            )}
          </div>

          {/* The sample, once asked for */}
          {sample && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                  Sampling Summary
                </h3>
                <span className="text-xs font-semibold text-emerald-700">
                  {sample.unitsToInspect} of {sample.totalUnits} units
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {sample.selectedUnits.map((unitName) => (
                  <button
                    key={unitName}
                    onClick={() => inspectUnit(unitName)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                  >
                    {unitName}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => inspectUnit(sample.selectedUnits[0])}
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
              >
                Start Inspection
              </Button>
            </div>
          )}

          {/* Every unit, for picking one by hand */}
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
            All Units ({totalUnits})
          </h2>

          {totalUnits === 0 ? (
            <p className="text-sm text-gray-600">This property has no units recorded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allUnits.map((unitName) => {
                const inSample = sample?.selectedUnits.includes(unitName)
                return (
                  <Card
                    key={unitName}
                    onClick={() => inspectUnit(unitName)}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-lg ${
                      inSample
                        ? "border-emerald-400 bg-emerald-50 hover:border-emerald-500"
                        : "border-gray-300 bg-white hover:border-[#006795]"
                    }`}
                  >
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{unitName}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {inSample ? "In NSPIRE sample" : "Click to inspect"}
                    </p>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </OtherDashboardLayout>
  )
}
