"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Country, State, City } from 'country-state-city'

interface LocationStats {
  totalCountries: number
  totalStates: number
  totalCities: number
  countriesWithStates: { [key: string]: number }
  statesWithCities: { [key: string]: number }
}

export default function LocationStats() {
  const [stats, setStats] = useState<LocationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCountryDetails, setShowCountryDetails] = useState(false)
  const [showStateDetails, setShowStateDetails] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)

      // Get stats only for allowed countries
      const allowedCountries = ['US', 'CA', 'GB', 'AU']
      const allCountries = Country.getAllCountries()
        .filter(country => allowedCountries.includes(country.isoCode))

      let totalStates = 0
      let totalCities = 0
      const countriesWithStates: { [key: string]: number } = {}
      const statesWithCities: { [key: string]: number } = {}

      allCountries.forEach(country => {
        const states = State.getStatesOfCountry(country.isoCode)
        const cities = City.getCitiesOfCountry(country.isoCode)

        totalStates += states.length
        totalCities += (cities || []).length
        countriesWithStates[country.name] = states.length

        // Get cities per state for this country
        states.forEach(state => {
          const stateCities = City.getCitiesOfState(country.isoCode, state.isoCode)
          const stateKey = `${state.name}, ${country.name}`
          statesWithCities[stateKey] = stateCities.length
        })
      })

      const locationStats: LocationStats = {
        totalCountries: allCountries.length,
        totalStates,
        totalCities,
        countriesWithStates,
        statesWithCities,
      }

      setStats(locationStats)
    } catch (error) {
      console.error('Error loading location stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const getTopCountriesWithStates = () => {
    if (!stats) return []
    return Object.entries(stats.countriesWithStates)
      .sort(([, a], [, b]) => b - a)
  }

  const getTopStatesWithCities = () => {
    if (!stats) return []
    return Object.entries(stats.statesWithCities)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D7FA8] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading location data...</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Location Statistics
            </h1>
            <p className="text-gray-600">
              Inspector Portal location data coverage and statistics
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Countries</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(stats?.totalCountries || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">States/Provinces</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(stats?.totalStates || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cities</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(stats?.totalCities || 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Countries Breakdown */}
          <Card className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <button
                onClick={() => setShowCountryDetails(!showCountryDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Countries by States/Provinces</h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${showCountryDetails ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showCountryDetails && (
                <div className="mt-4 space-y-3">
                  {getTopCountriesWithStates().map(([country, count], index) => (
                    <div key={country} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
                        <span className="text-sm text-gray-900">{country}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#0D7FA8]">{formatNumber(count)} states</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* States Breakdown */}
          <Card className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <button
                onClick={() => setShowStateDetails(!showStateDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Top States/Provinces by Cities (Sample)</h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${showStateDetails ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showStateDetails && (
                <div className="mt-4 space-y-3">
                  {getTopStatesWithCities().map(([state, count], index) => (
                    <div key={state} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
                        <span className="text-sm text-gray-900">{state}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#0D7FA8]">{formatNumber(count)} cities</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Info Section */}
          <Card className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspector Portal Coverage</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  This inspector portal supports property management in four key countries:
                  United States, Canada, United Kingdom, and Australia.
                </p>
                <p>
                  Complete coverage includes all states, provinces, territories, and cities
                  within these countries for accurate property location selection.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Coverage Details:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>United States:</strong> 66 states/territories with 19,821 cities</li>
                    <li>• <strong>Canada:</strong> 13 provinces/territories with 1,079 cities</li>
                    <li>• <strong>United Kingdom:</strong> 247 regions with 3,871 cities</li>
                    <li>• <strong>Australia:</strong> 8 states/territories with 4,152 cities</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}