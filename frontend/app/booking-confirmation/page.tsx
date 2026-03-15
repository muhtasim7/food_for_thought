import { Suspense } from 'react'
import Layout from '@/components/Layout'
import BookingConfirmationClient from './BookingConfirmationClient'

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<Layout><div className="min-h-screen bg-gray-50" /></Layout>}>
      <BookingConfirmationClient />
    </Suspense>
  )
}
