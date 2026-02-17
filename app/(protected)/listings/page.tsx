'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye, ListPlus } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { dbGetListingsByCollector, formatPricePerKg, formatINR } from '@/lib/mock-db'

export default function MyListingsPage() {
  const { user } = useAuth()
  if (!user) return null

  const listings = dbGetListingsByCollector(user.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-50 text-green-700'
      case 'SOLD': return 'bg-blue-50 text-blue-700'
      case 'CANCELLED': return 'bg-red-50 text-red-700'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
          <p className="text-slate-600 mt-2">Manage your plastic waste listings</p>
        </div>
        <Link href="/listings/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <ListPlus className="w-4 h-4 mr-2" />
            New Listing
          </Button>
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <Card key={listing.id} className="p-5 border border-slate-200 bg-white hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{listing.materialType}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{listing.weightKg} kg</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Grade</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      listing.grade === 'A' ? 'bg-green-100 text-green-700' :
                      listing.grade === 'B' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Grade {listing.grade}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Price</p>
                    <p className="font-semibold text-green-600">{formatPricePerKg(listing.pricePerKg)}/kg</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-slate-500 text-xs">Total Value</p>
                  <p className="font-bold text-slate-900">{formatINR(listing.pricePerKg * listing.weightKg)}</p>
                </div>

                {listing.highestBidAmount && (
                  <div className="p-2.5 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">Highest Bid</p>
                    <p className="text-base font-bold text-blue-700">{formatPricePerKg(listing.highestBidAmount)}/kg</p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <Link href={`/listings/${listing.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-14 text-center border border-slate-200 bg-white">
          <p className="text-slate-600 mb-2">No listings yet</p>
          <p className="text-slate-500 text-sm mb-6">Start selling your plastic waste on the marketplace</p>
          <Link href="/listings/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Create First Listing
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
