'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import FormInput from '@/components/FormInput'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'
import { chefAPI } from '@/lib/api'

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    cuisine: '',
    sampleMenu: '',
    foodPhotos: '',
    instagram: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const foodPhotos = formData.foodPhotos
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean)

      const response = await chefAPI.publicSignup({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        cuisine: formData.cuisine,
        sample_menu: formData.sampleMenu,
        food_photos: foodPhotos,
        instagram: formData.instagram || undefined,
      })

      router.push(`/chef/${response.data.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Chef signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Chef Sign Up</h1>
          <p className="text-gray-600 text-center mb-6">Create your chef profile to start receiving orders</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Name"
              placeholder="Chef name or brand"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <FormInput
              label="Phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <FormInput
              label="City"
              placeholder="Toronto"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />

            <FormInput
              label="Cuisine"
              placeholder="Pakistani, Bengali, BBQ, etc."
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              required
            />

            <TextArea
              label="Sample Menu"
              placeholder="List example dishes and packages"
              value={formData.sampleMenu}
              onChange={(e) => setFormData({ ...formData, sampleMenu: e.target.value })}
              rows={4}
              required
            />

            <TextArea
              label="Photos of Food"
              placeholder="Paste one image URL per line"
              value={formData.foodPhotos}
              onChange={(e) => setFormData({ ...formData, foodPhotos: e.target.value })}
              rows={4}
            />

            <FormInput
              label="Instagram (optional)"
              placeholder="@yourhandle"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating chef profile...' : 'Create Chef Profile'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
