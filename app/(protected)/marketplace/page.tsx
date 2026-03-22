import { createClient } from '@/lib/supabase/server'
import ListingCard from '@/components/marketplace/listing-card'
import MarketplaceFilters from '@/components/marketplace/marketplace-filters'
import { Suspense } from 'react'

async function getListings(filters?: any) {
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select(
      `
      id,
      material_type,
      weight_kg,
      purity_score,
      grade,
      asking_price,
      location,
      image_url,
      status,
      highest_bid_amount,
      created_at,
      profiles(name, company_name)
    `
    )
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  if (filters?.materialType) {
    query = query.eq('material_type', filters.materialType)
  }

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  if (filters?.minPrice) {
    query = query.gte('asking_price', filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte('asking_price', filters.maxPrice)
  }

  if (filters?.grade) {
    query = query.eq('grade', filters.grade)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }

  return data || []
}

export default async function MarketplacePage() {
  const listings = await getListings()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
        <p className="text-slate-600 mt-2">Browse and bid on plastic waste listings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div>
          <Suspense fallback={<div className="h-96 bg-slate-100 rounded-lg animate-pulse" />}>
            <MarketplaceFilters />
          </Suspense>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">No listings found</p>
              <p className="text-slate-500">Try adjusting your filters or check back later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
