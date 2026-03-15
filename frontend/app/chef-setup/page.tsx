'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import FormInput from '@/components/FormInput'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'
import { chefAPI, authAPI } from '@/lib/api'

export default function ChefSetup() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [cuisines, setCuisines] = useState<any[]>([])
  const [dietaryTags, setDietaryTags] = useState<any[]>([])

  const [formData, setFormData] = useState({
    businessName: '',
    bio: '',
    city: '',
    serviceArea: '',
    experienceYears: 0,
    cuisineIds: [] as number[],
    dietaryIds: [] as number[],
  })

  useEffect(() => {
    loadInitial()
  }, [])

  const loadInitial = async () => {
    try {
      const userRes = await authAPI.getMe()
      setUser(userRes.data)

      const [cuisinesRes, dietaryRes] = await Promise.all([
        chefAPI.getCuisines(),
        chefAPI.getDietaryTags(),
      ])
      setCuisines(cuisinesRes.data || [])
      setDietaryTags(dietaryRes.data || [])
    } catch (error) {
      router.push('/signup')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }

    setSubmitting(true)
    try {
      await chefAPI.createChef(user.id, formData)
      router.push('/chef-dashboard')
    } catch (error) {
      console.error('Error creating chef profile:', error)
      alert('Failed to create profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Chef Profile</h1>
          <p className="text-gray-600 mb-8">Step {step} of 2</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <FormInput
                  label="Business Name *"
                  placeholder="e.g., Ahmad's Pakistani Kitchen"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />

                <TextArea
                  label="Bio / Description"
                  placeholder="Tell customers about your cooking style, experience, and specialties"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />

                <FormInput
                  label="City *"
                  placeholder="e.g., Toronto"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />

                <FormInput
                  label="Service Area"
                  placeholder="e.g., Greater Toronto Area"
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                />

                <FormInput
                  label="Years of Experience"
                  type="number"
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })}
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What cuisines do you specialize in? *
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cuisines.map((cuisine) => (
                      <label key={cuisine.id} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={formData.cuisineIds.includes(cuisine.id)}
                          onChange={() => {
                            setFormData({
                              ...formData,
                              cuisineIds: formData.cuisineIds.includes(cuisine.id)
                                ? formData.cuisineIds.filter((id) => id !== cuisine.id)
                                : [...formData.cuisineIds, cuisine.id],
                            })
                          }}
                          className="rounded border-gray-300 mt-1"
                        />
                        <span className="ml-2 text-gray-700">
                          {cuisine.icon} {cuisine.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What dietary options do you offer?
                  </label>
                  <div className="space-y-2">
                    {dietaryTags.map((dietary) => (
                      <label key={dietary.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dietaryIds.includes(dietary.id)}
                          onChange={() => {
                            setFormData({
                              ...formData,
                              dietaryIds: formData.dietaryIds.includes(dietary.id)
                                ? formData.dietaryIds.filter((id) => id !== dietary.id)
                                : [...formData.dietaryIds, dietary.id],
                            })
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">{dietary.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-6">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={submitting}
                className={step === 1 ? 'w-full' : 'flex-1'}
              >
                {step === 1 ? 'Next' : submitting ? 'Creating...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
