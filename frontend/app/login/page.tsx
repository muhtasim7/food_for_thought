import { Suspense } from 'react'
import Layout from '@/components/Layout'
import LoginPageClient from './LoginPageClient'

export default function LoginPage() {
  return (
    <Suspense fallback={<Layout><div className="min-h-screen bg-gray-50" /></Layout>}>
      <LoginPageClient />
    </Suspense>
  )
}
