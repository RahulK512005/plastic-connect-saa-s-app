'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, MapPin, Package, Zap } from 'lucide-react'
import Image from 'next/image'

interface ListingCardProps {
  listing: {
    id: string
    material_type: string
    weight_kg: number
    purity_score?: number
    grade: string
    asking_price: number
    highest_bid_amount?: number
    location: string
    image_url?: string
    profiles: {
      name: string
      company_name?: string
    }
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  const currentPrice = listing.highest_bid_amount || listing.asking_price

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-green-50 to-slate-100 overflow-hidden">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.material_type}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-300" />
            </div>
          )}
          {/* Grade Badge */}
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            <span
              className={`${
                listing.grade === 'A'
                  ? 'text-green-600'
                  : listing.grade === 'B'
                    ? 'text-blue-600'
                    : 'text-orange-600'
              }`}
            >
              Grade {listing.grade}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Material & Weight */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {listing.material_type}
            </h3>
            <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
              <Package className="w-4 h-4" />
              {listing.weight_kg.toFixed(2)} kg
            </p>
          </div>

          {/* Purity Score */}
          {listing.purity_score && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {listing.purity_score.toFixed(1)}% Purity
              </span>
            </div>
          )}

          {/* Location */}
          <p className="text-sm text-slate-600 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {listing.location}
          </p>

          {/* Seller Info */}
          <div className="text-xs text-slate-500 border-t border-slate-200 pt-3">
            by {listing.profiles.company_name || listing.profiles.name}
          </div>

          {/* Price */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            {listing.highest_bid_amount ? (
              <div>
                <p className="text-xs text-slate-600">Current Bid</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-slate-600">/kg</span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-600">Asking Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-slate-600">/kg</span>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg h-10 group-hover:bg-green-700 transition-all">
            <TrendingUp className="w-4 h-4 mr-2" />
            View & Bid
          </Button>
        </div>
      </Card>
    </Link>
  )
}
