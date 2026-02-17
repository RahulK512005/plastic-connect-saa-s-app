'use client'

import { useState, useMemo } from 'react'
import ListingCard from '@/components/marketplace/listing-card'
import MarketplaceFilters from '@/components/marketplace/marketplace-filters'
import { dbGetActiveListings } from '@/lib/mock-db'

interface Filters {
  materialType: string
  grade: string
  minPrice: string
  maxPrice: string
  location: string
}

export default function MarketplacePage() {
  const allListings = dbGetActiveListings()

  const [filters, setFilters] = useState<Filters>({
    materialType: '',
    grade: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  })

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      if (filters.materialType && listing.materialType !== filters.materialType) return false
      if (filters.grade && listing.grade !== filters.grade) return false
      if (filters.minPrice && listing.pricePerKg < parseFloat(filters.minPrice)) return false
      if (filters.maxPrice && listing.pricePerKg > parseFloat(filters.maxPrice)) return false
      if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      return true
    })
  }, [allListings, filters])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
        <p className="text-slate-600 mt-2">
          Browse and bid on plastic waste listings &middot;{' '}
          <span className="font-medium text-slate-800">{filteredListings.length} listings</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <MarketplaceFilters filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-600 text-lg mb-2">No listings match your filters</p>
              <p className="text-slate-500 text-sm">Try adjusting your filters or check back later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
