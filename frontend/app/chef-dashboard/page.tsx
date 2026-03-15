'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import TextArea from '@/components/TextArea'
import { authAPI, chefAPI, bookingAPI } from '@/lib/api'
import { User, Chef, BookingRequest, CuisineTag, DietaryTag } from '@/types'

export default function ChefDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [chef, setChef] = useState<Chef | null>(null)
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [cuisines, setCuisines] = useState<CuisineTag[]>([])
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'bookings'>('overview')
  const [editingProfile, setEditingProfile] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Get current user
      const userRes = await authAPI.getMe()
      setUser(userRes.data)

      // Get chef profile
      if (userRes.data.is_chef) {
        const chefRes = await chefAPI.getChefDetail(userRes.data.id)
        setChef(chefRes.data)

        // Get bookings
        const bookingsRes = await bookingAPI.getChefBookings(chefRes.data.id)
        setBookings(bookingsRes.data || [])
      }

      // Load cuisine and dietary options
      const [cuisinesRes, dietaryRes] = await Promise.all([
        chefAPI.getCuisines(),
        chefAPI.getDietaryTags(),
      ])
      setCuisines(cuisinesRes.data || [])
      setDietaryTags(dietaryRes.data || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (updatedChef: any) => {
    try {
      await chefAPI.updateChef(chef!.id, updatedChef)
      setEditingProfile(false)
      loadDashboard()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
  }

  const handleBookingStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus)
      loadDashboard()
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking status')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </Layout>
    )
  }

  if (!user || !user.is_chef) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">You need to be a chef to access this page</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Chef Dashboard</h1>
              <p className="text-gray-600 mt-2">{chef?.business_name}</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'profile', label: 'Profile' },
              { id: 'bookings', label: 'Bookings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-semibold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overview' && chef && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">Rating</h3>
                <p className="text-3xl font-bold text-orange-500">{chef.average_rating.toFixed(1)}</p>
                <p className="text-gray-600 text-sm">out of 5 ({chef.total_reviews} reviews)</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">Bookings</h3>
                <p className="text-3xl font-bold text-orange-500">{bookings.length}</p>
                <p className="text-gray-600 text-sm">Total booking requests</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">Status</h3>
                <p className={`text-lg font-bold ${chef.is_available ? 'text-green-500' : 'text-red-500'}`}>
                  {chef.is_available ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && chef && (
            <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                {!editingProfile && (
                  <Button onClick={() => setEditingProfile(true)}>Edit Profile</Button>
                )}
              </div>

              {editingProfile ? (
                <ProfileEditForm
                  chef={chef}
                  cuisines={cuisines}
                  dietaryTags={dietaryTags}
                  onSubmit={handleProfileUpdate}
                  onCancel={() => setEditingProfile(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm">Business Name</p>
                    <p className="text-lg font-semibold text-gray-800">{chef.business_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Bio</p>
                    <p className="text-gray-700">{chef.bio || 'No bio added'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">City</p>
                    <p className="text-gray-700">{chef.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Service Area</p>
                    <p className="text-gray-700">{chef.service_area || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Years of Experience</p>
                    <p className="text-gray-700">{chef.experience_years || 'Not specified'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Requests</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-500">No booking requests yet</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-800">{booking.customer_name}</h3>
                          <p className="text-gray-600 text-sm">{new Date(booking.event_date).toLocaleDateString()} • {booking.guest_count} guests</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{booking.message || 'No message provided'}</p>

                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleBookingStatusChange(booking.id, 'accepted')}>
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleBookingStatusChange(booking.id, 'rejected')}>
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function ProfileEditForm({
  chef,
  cuisines,
  dietaryTags,
  onSubmit,
  onCancel,
}: {
  chef: Chef
  cuisines: CuisineTag[]
  dietaryTags: DietaryTag[]
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    businessName: chef.business_name,
    bio: chef.bio || '',
    city: chef.city,
    serviceArea: chef.service_area || '',
    experienceYears: chef.experience_years || 0,
    cuisineIds: chef.cuisine_tags.map((c) => c.id),
    dietaryIds: chef.dietary_tags.map((d) => d.id),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Business Name"
        value={formData.businessName}
        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
      />

      <TextArea
        label="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />

      <FormInput
        label="City"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      />

      <FormInput
        label="Service Area"
        value={formData.serviceArea}
        onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
      />

      <FormInput
        label="Years of Experience"
        type="number"
        value={formData.experienceYears}
        onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Cuisines</label>
        <div className="space-y-2">
          {cuisines.map((cuisine) => (
            <label key={cuisine.id} className="flex items-center">
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
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-gray-700">{cuisine.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Dietary Options</label>
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

      <div className="flex gap-3 pt-4">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
