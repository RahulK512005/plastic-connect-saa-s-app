import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import LiveBidPanel from '@/components/bidding/live-bid-panel'
import BidCountdown from '@/components/bidding/bid-countdown'
import BidHistory from '@/components/bidding/bid-history'
import { Card } from '@/components/ui/card'
import { MapPin, Package, Zap, User } from 'lucide-react'
import Image from 'next/image'

async function getListing(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select(
      `
      *,
      profiles(name, company_name, email, phone)
    `
    )
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

async function getBids(listingId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('bids')
    .select('*')
    .eq('listing_id', listingId)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })

  return data || []
}

export default async function ListingDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const listing = await getListing(params.id)

  if (!listing) {
    notFound()
  }

  const bids = await getBids(listing.id)

  // Calculate auction end time (48 hours from creation)
  const createdAt = new Date(listing.created_at)
  const endTime = new Date(createdAt.getTime() + 48 * 60 * 60 * 1000)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{listing.material_type}</h1>
        <p className="text-slate-600 mt-1">Grade {listing.grade} • Listed 2 hours ago</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card className="overflow-hidden border border-slate-200">
            <div className="relative h-96 bg-gradient-to-br from-green-50 to-slate-100">
              {listing.image_url ? (
                <Image
                  src={listing.image_url}
                  alt={listing.material_type}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-slate-300" />
                </div>
              )}
            </div>
          </Card>

          {/* Details Grid */}
          <Card className="p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-600">Weight</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{listing.weight_kg} kg</p>
              </div>
              {listing.purity_score && (
                <div>
                  <p className="text-sm text-slate-600">Purity</p>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {listing.purity_score.toFixed(1)}%
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-600">Grade</p>
                <p className="text-xl font-bold text-slate-900 mt-1">Grade {listing.grade}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Location</p>
                <p className="text-lg font-semibold text-slate-900 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {listing.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Starting Price</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  ${listing.asking_price.toFixed(2)}/kg
                </p>
              </div>
            </div>
          </Card>

          {/* Description */}
          {listing.description && (
            <Card className="p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Description</h2>
              <p className="text-slate-700 leading-relaxed">{listing.description}</p>
            </Card>
          )}

          {/* Seller Info */}
          <Card className="p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Seller Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Company</p>
                  <p className="font-medium text-slate-900">
                    {listing.profiles.company_name || listing.profiles.name}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">Contact</p>
                <p className="font-medium text-slate-900">{listing.profiles.email}</p>
                {listing.profiles.phone && (
                  <p className="font-medium text-slate-900">{listing.profiles.phone}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Bid History */}
          <BidHistory bids={bids} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Countdown */}
          <BidCountdown endTime={endTime} />

          {/* Live Bid Panel */}
          <LiveBidPanel
            listing={{
              id: listing.id,
              weight_kg: listing.weight_kg,
              asking_price: listing.asking_price,
              material_type: listing.material_type,
            }}
            onlineBidders={Math.floor(Math.random() * 8) + 1}
          />
        </div>
      </div>
    </div>
  )
}
