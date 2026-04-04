'use client'

import { useState, useMemo } from 'react'
import ListingCard from '@/components/marketplace/listing-card'
import MarketplaceFilters from '@/components/marketplace/marketplace-filters'
import { dbGetActiveListings } from '@/lib/mock-db'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

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

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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

  const activeFilterCount = Object.values(filters).filter((v) => v !== '').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
          <p className="text-slate-600 mt-2">
            Browse and bid on plastic waste listings &middot;{' '}
            <span className="font-medium text-slate-800">{filteredListings.length} listings</span>
          </p>
        </div>
        {/* Mobile filter toggle */}
        <Button
          variant="outline"
          className="lg:hidden flex items-center gap-2"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-200">
            <SheetTitle className="text-slate-900">Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-5">
            <MarketplaceFilters
              filters={filters}
              onFilterChange={(f) => { setFilters(f); }}
            />
          </div>
          <div className="p-4 border-t border-slate-200">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {filteredListings.length} listings
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop filters — hidden on mobile */}
        <div className="hidden lg:block">
          <MarketplaceFilters filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
