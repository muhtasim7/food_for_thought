'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import TextArea from '@/components/TextArea'
import { chefAPI, bookingAPI } from '@/lib/api'
import type { ChefDetail as ChefDetailType, BookingFormData } from '@/types'

export default function ChefDetailPage() {
  const params = useParams()
  const router = useRouter()
  const chefId = parseInt(params.id as string)

  const [chef, setChef] = useState<ChefDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    guestCount: 10,
    message: '',
  })

  useEffect(() => {
    loadChef()
  }, [chefId])

  const loadChef = async () => {
    try {
      const response = await chefAPI.getChefDetail(chefId)
      setChef(response.data)
    } catch (error) {
      console.error('Error loading chef:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSubmitting(true)
    try {
      const bookingData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        event_date: new Date(formData.eventDate).toISOString(),
        guest_count: formData.guestCount,
        message: formData.message,
      }

      await bookingAPI.createBookingRequest(chefId, bookingData)
      router.push(`/booking-confirmation?chefId=${chefId}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">Loading chef details...</p>
        </div>
      </Layout>
    )
  }

  if (!chef) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">Chef not found</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              <div className="relative w-40 h-40 flex-shrink-0">
                <Image
                  src={chef.profile_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'}
                  alt={chef.business_name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{chef.business_name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xl">⭐</span>
                    <span className="text-lg font-bold text-gray-800">{chef.average_rating.toFixed(1)}</span>
                    <span className="text-gray-600">({chef.total_reviews} reviews)</span>
                  </div>
                  {chef.is_available && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{chef.bio}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="font-semibold text-gray-800">{chef.city}</p>
                  </div>
                  {chef.experience_years && (
                    <div>
                      <p className="text-gray-600 text-sm">Experience</p>
                      <p className="font-semibold text-gray-800">{chef.experience_years} years</p>
                    </div>
                  )}
                  {chef.service_area && (
                    <div className="col-span-2">
                      <p className="text-gray-600 text-sm">Service Area</p>
                      <p className="font-semibold text-gray-800">{chef.service_area}</p>
                    </div>
                  )}
                </div>

                {/* Cuisine tags */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-2">Cuisines</p>
                  <div className="flex flex-wrap gap-2">
                    {chef.cuisine_tags.map((cuisine) => (
                      <span key={cuisine.id} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {cuisine.icon} {cuisine.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dietary tags */}
                {chef.dietary_tags.length > 0 && (
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Dietary Options</p>
                    <div className="flex flex-wrap gap-2">
                      {chef.dietary_tags.map((dietary) => (
                        <span key={dietary.id} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {dietary.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button size="lg" onClick={() => setShowBookingForm(true)}>
                  Request Booking
                </Button>
                <Button size="lg" variant="outline">
                  Message Chef
                </Button>
              </div>
            </div>
          </div>

          {/* Menus */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Menus & Pricing</h2>
            {chef.menus && chef.menus.length > 0 ? (
              <div className="space-y-6">
                {chef.menus.map((menu) => (
                  <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{menu.name}</h3>
                    {menu.description && (
                      <p className="text-gray-600 mb-4">{menu.description}</p>
                    )}
                    <div className="space-y-3">
                      {menu.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start border-b pb-3 last:border-b-0">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            {item.description && (
                              <p className="text-gray-600 text-sm">{item.description}</p>
                            )}
                            <p className="text-gray-600 text-xs mt-1">
                              Min. {item.minimum_order_portions} portions
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-500">
                              ${item.price_per_portion.toFixed(2)}/portion
                            </p>
                            {!item.is_available && (
                              <p className="text-red-500 text-xs mt-1">Currently unavailable</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No menus available yet</p>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
            {chef.reviews && chef.reviews.length > 0 ? (
              <div className="space-y-4">
                {chef.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{review.reviewer_name}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-bold text-gray-800">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600">{review.comment}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Request Booking</h2>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <FormInput
                label="Your Name *"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />

              <FormInput
                label="Email *"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
              />

              <FormInput
                label="Phone *"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                required
              />

              <FormInput
                label="Event Date *"
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                required
              />

              <FormInput
                label="Guest Count *"
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                required
              />

              <TextArea
                label="Message"
                placeholder="Tell the chef about your event and menu needs"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
