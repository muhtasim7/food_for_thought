'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Button from '@/components/Button'

export default function BookingConfirmationClient() {
  const searchParams = useSearchParams()
  const chefId = searchParams.get('chefId')

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Request Sent!</h1>

          <p className="text-gray-600 text-lg mb-6">
            Your booking request has been sent to the chef. They will review your details and contact you within 24 hours to confirm.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>✓ Chef reviews your event details</li>
              <li>✓ Chef confirms availability and pricing</li>
              <li>✓ Discussion of menu customization</li>
              <li>✓ Finalize booking details</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/browse" className="block">
              <Button size="lg" className="w-full">
                Browse More Chefs
              </Button>
            </Link>
            {chefId && (
              <Link href={`/chef/${chefId}`} className="block">
                <Button size="lg" variant="outline" className="w-full">
                  Back to Chef Profile
                </Button>
              </Link>
            )}
            <Link href="/" className="block">
              <Button size="lg" variant="secondary" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            Questions? Email us at hello@foodforthought.com
          </p>
        </div>
      </div>
    </Layout>
  )
}
