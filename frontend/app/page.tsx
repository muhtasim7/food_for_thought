'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import ChefCard from '@/components/ChefCard'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import { chefAPI } from '@/lib/api'
import { Chef } from '@/types'

export default function Home() {
  const [chefs, setChefs] = useState<Chef[]>([])
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState('')

  useEffect(() => {
    loadFeaturedChefs()
  }, [])

  const loadFeaturedChefs = async () => {
    try {
      const response = await chefAPI.getFeaturedChefs()
      setChefs(response.data || [])
    } catch (error) {
      console.error('Error loading chefs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchCity.trim()) {
      window.location.href = `/browse?city=${encodeURIComponent(searchCity)}`
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-zinc-950 to-zinc-900 text-amber-50 py-16 sm:py-24 border-b border-amber-300/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-amber-200">
                Party Food from Local Home Chefs
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-amber-100/80">
                Discover authentic home-cooked catering for your celebrations. From Bengali biryani to Pakistani kebabs, find the perfect chef for your event.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <FormInput
                  placeholder="Search by city (e.g., Toronto)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="border-amber-300/40 bg-black/40 text-amber-50 placeholder-amber-100/60"
                />
                <Button size="lg" variant="secondary">
                  Search
                </Button>
              </form>

              <div className="flex gap-4">
                <Link href="/browse">
                  <Button size="lg" variant="secondary">
                    Browse All Chefs
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-amber-300 text-amber-200">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 relative h-80 w-full">
              <Image
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop"
                alt="Food"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Chefs */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-amber-200 mb-4">Featured Chefs</h2>
            <p className="text-amber-100/70 text-lg">Top-rated home chefs ready to cater your event</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-amber-100/70">Loading chefs...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chefs.map((chef) => (
                <ChefCard key={chef.id} chef={chef} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/browse">
              <Button size="lg">
                See All Chefs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-zinc-900/80 border-y border-amber-300/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-amber-200 mb-4">How It Works</h2>
            <p className="text-amber-100/70 text-lg">Easy steps to book your party food</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Search', desc: 'Find chefs by cuisine, location & dietary needs' },
              { num: 2, title: 'Browse', desc: 'Check menus, reviews, and pricing' },
              { num: 3, title: 'Request', desc: 'Send a booking request with your details' },
              { num: 4, title: 'Celebrate', desc: 'Chef confirms & delivers amazing food' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="bg-gradient-to-br from-amber-300 to-amber-600 text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg text-amber-100 mb-2">{step.title}</h3>
                <p className="text-amber-100/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-zinc-950 via-black to-zinc-950 text-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-4 text-amber-200">Ready to Book Your Catering?</h2>
          <p className="text-lg mb-8 text-amber-100/80">Browse verified local chefs and get your event catered to perfection</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Join as a Chef
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  )
}
