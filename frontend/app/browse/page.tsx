import { Suspense } from 'react'
import Layout from '@/components/Layout'
import BrowsePageClient from './BrowsePageClient'

export default function BrowseChefsPage() {
  return (
    <Suspense fallback={<Layout><div className="min-h-screen bg-gray-50" /></Layout>}>
      <BrowsePageClient />
    </Suspense>
  )
}
