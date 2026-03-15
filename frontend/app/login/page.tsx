import { Suspense } from 'react'
import Layout from '@/components/Layout'
import LoginPageClient from './LoginPageClient'

interface LoginPageProps {
  searchParams?: {
    redirect?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirect = searchParams?.redirect ?? '/'

  return (
    <Suspense fallback={<Layout><div className="min-h-screen bg-gray-50" /></Layout>}>
      <LoginPageClient redirect={redirect} />
    </Suspense>
  )
}
