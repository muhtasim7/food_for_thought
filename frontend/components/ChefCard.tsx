import Image from 'next/image'
import Link from 'next/link'
import { Chef } from '@/types'

interface ChefCardProps {
  chef: Chef
}

export default function ChefCard({ chef }: ChefCardProps) {
  return (
    <Link href={`/chef/${chef.id}`}>
      <div className="bg-zinc-900/90 rounded-xl border border-amber-300/25 shadow-md hover:shadow-amber-200/10 transition-shadow overflow-hidden cursor-pointer h-full">
        <div className="relative h-48 w-full bg-zinc-800">
          <Image
            src={chef.profile_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'}
            alt={chef.business_name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-display font-bold text-amber-200">{chef.business_name}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-300">⭐</span>
            <span className="font-semibold text-amber-100">{chef.average_rating.toFixed(1)}</span>
            <span className="text-amber-100/60">({chef.total_reviews} reviews)</span>
          </div>

          <p className="text-amber-100/70 text-sm mb-3 line-clamp-2">{chef.bio || 'Professional home chef'}</p>

          <div className="mb-3">
            <p className="text-amber-100 text-sm font-medium">{chef.city}</p>
            {chef.experience_years && (
              <p className="text-amber-100/60 text-xs">{chef.experience_years} years experience</p>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {chef.cuisine_tags.slice(0, 3).map((cuisine) => (
              <span key={cuisine.id} className="bg-amber-300/15 text-amber-200 text-xs px-2 py-1 rounded-full border border-amber-300/30">
                {cuisine.name}
              </span>
            ))}
            {chef.cuisine_tags.length > 3 && (
              <span className="bg-zinc-700 text-amber-100 text-xs px-2 py-1 rounded-full">
                +{chef.cuisine_tags.length - 3}
              </span>
            )}
          </div>

          {chef.dietary_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {chef.dietary_tags.map((dietary) => (
                <span key={dietary.id} className="bg-emerald-700/20 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-500/25">
                  {dietary.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-amber-300/20">
            <button className="w-full bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-700 text-black py-2 rounded-lg hover:brightness-105 transition font-semibold text-sm">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
