import { Suspense } from 'react'
import Layout from '@/components/Layout'
import BookingConfirmationClient from './BookingConfirmationClient'

interface BookingConfirmationPageProps {
  searchParams?: {
    chefId?: string
  }
}

export default function BookingConfirmationPage({ searchParams }: BookingConfirmationPageProps) {
  const chefId = searchParams?.chefId

  return (
    <Suspense fallback={<Layout><div className="min-h-screen bg-gray-50" /></Layout>}>
      <BookingConfirmationClient chefId={chefId} />
    </Suspense>
  )
}
