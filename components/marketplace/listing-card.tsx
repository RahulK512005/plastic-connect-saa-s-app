'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Package, Zap, TrendingUp } from 'lucide-react'
import { formatPricePerKg, formatINR, type Listing } from '@/lib/mock-db'
import Link from 'next/link'

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const gradeColors = {
    A: 'bg-green-100 text-green-700 border-green-200',
    B: 'bg-amber-100 text-amber-700 border-amber-200',
    C: 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group bg-white border border-slate-200">
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-green-50 to-slate-100 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <Package className="w-10 h-10 text-slate-300" />
        </div>
        {/* Grade Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${gradeColors[listing.grade]}`}>
          Grade {listing.grade}
        </div>
        {/* Material Type Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
          {listing.materialType}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Title & Weight */}
        <div>
          <h3 className="text-base font-semibold text-slate-900">{listing.materialType} - {listing.weightKg} kg</h3>
          <p className="text-xs text-slate-500 mt-0.5">by {listing.collectorName}</p>
        </div>

        {/* Purity */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-green-50 rounded-lg">
          <Zap className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-700">
            {listing.purityPercent}% Purity
          </span>
        </div>

        {/* Location */}
        <p className="text-xs text-slate-600 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {listing.location}
        </p>

        {/* Price */}
        <div className="pt-3 border-t border-slate-100">
          {listing.highestBidAmount ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Current Bid</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-green-600">{formatPricePerKg(listing.highestBidAmount)}</span>
                <span className="text-xs text-slate-500">/kg</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Asking Price</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900">{formatPricePerKg(listing.pricePerKg)}</span>
                <span className="text-xs text-slate-500">/kg</span>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Total: {formatINR(listing.pricePerKg * listing.weightKg)}
          </p>
        </div>

        {/* CTA */}
        <Link href={`/listings/${listing.id}`}>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg h-9 text-sm group-hover:bg-green-700 transition-all">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  )
}
