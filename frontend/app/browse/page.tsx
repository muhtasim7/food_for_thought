import { Suspense } from 'react'
import Layout from '@/components/Layout'
import BrowsePageClient from './BrowsePageClient'

interface BrowseChefsPageProps {
  searchParams?: {
    city?: string
  }
}

export default function BrowseChefsPage({ searchParams }: BrowseChefsPageProps) {
  const initialCity = searchParams?.city ?? ''

  return (
    <Suspense fallback={<Layout><div className="min-h-screen bg-gray-50" /></Layout>}>
      <BrowsePageClient initialCity={initialCity} />
    </Suspense>
  )
}
