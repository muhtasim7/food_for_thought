'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import ChefCard from '@/components/ChefCard'
import FormInput from '@/components/FormInput'
import Select from '@/components/Select'
import { chefAPI } from '@/lib/api'
import { Chef, CuisineTag, DietaryTag } from '@/types'

export default function BrowseChefs() {
  const searchParams = useSearchParams()
  const [chefs, setChefs] = useState<Chef[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cuisines, setCuisines] = useState<CuisineTag[]>([])
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([])

  // Filter state
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [selectedCuisines, setSelectedCuisines] = useState<number[]>([])
  const [selectedDietary, setSelectedDietary] = useState<number[]>([])

  useEffect(() => {
    loadFilters()
    performSearch()
  }, [])

  const loadFilters = async () => {
    try {
      const [cuisineRes, dietaryRes] = await Promise.all([
        chefAPI.getCuisines(),
        chefAPI.getDietaryTags(),
      ])
      setCuisines(cuisineRes.data || [])
      setDietaryTags(dietaryRes.data || [])
    } catch (error) {
      console.error('Error loading filters:', error)
    }
  }

  const performSearch = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await chefAPI.searchChefs(
        city || undefined,
        selectedCuisines.length > 0 ? selectedCuisines : undefined,
        selectedDietary.length > 0 ? selectedDietary : undefined
      )
      setChefs(response.data || [])
    } catch (error) {
      console.error('Error searching:', error)
      setChefs([])
      setError('Could not load chefs right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCuisineChange = (cuisineId: number) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisineId)
        ? prev.filter((id) => id !== cuisineId)
        : [...prev, cuisineId]
    )
  }

  const handleDietaryChange = (dietaryId: number) => {
    setSelectedDietary((prev) =>
      prev.includes(dietaryId)
        ? prev.filter((id) => id !== dietaryId)
        : [...prev, dietaryId]
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse Local Chefs</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-6 text-gray-800">Filters</h2>

                <form onSubmit={handleSearch} className="space-y-6">
                  {/* City Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <FormInput
                      type="text"
                      placeholder="e.g., Toronto"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  {/* Cuisine Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Cuisine
                    </label>
                    <div className="space-y-2">
                      {cuisines.map((cuisine) => (
                        <label key={cuisine.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCuisines.includes(cuisine.id)}
                            onChange={() => handleCuisineChange(cuisine.id)}
                            className="rounded border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">
                            {cuisine.icon} {cuisine.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Dietary
                    </label>
                    <div className="space-y-2">
                      {dietaryTags.map((dietary) => (
                        <label key={dietary.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedDietary.includes(dietary.id)}
                            onChange={() => handleDietaryChange(dietary.id)}
                            className="rounded border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">{dietary.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
                  >
                    Apply Filters
                  </button>
                </form>
              </div>
            </div>

            {/* Chef Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-gray-500">Loading chefs...</div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-red-600 text-lg mb-4">{error}</p>
                  <button
                    type="button"
                    onClick={performSearch}
                    className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition font-semibold"
                  >
                    Retry
                  </button>
                </div>
              ) : chefs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500 text-lg">
                    No chefs found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">Found {chefs.length} chef{chefs.length !== 1 ? 's' : ''}</p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chefs.map((chef) => (
                      <ChefCard key={chef.id} chef={chef} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
