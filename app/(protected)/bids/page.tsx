'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import {
  dbGetBidsByBrand,
  dbGetBidsForCollectorListings,
  dbGetListingById,
  formatPricePerKg,
  formatINR,
} from '@/lib/mock-db'

export default function BidsPage() {
  const { user, userRole } = useAuth()
  if (!user) return null

  const isBrand = userRole === 'BRAND'
  const bids = isBrand
    ? dbGetBidsByBrand(user.id)
    : dbGetBidsForCollectorListings(user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {isBrand ? 'My Bids' : 'Bids Received'}
        </h1>
        <p className="text-slate-600 mt-2">
          {isBrand
            ? 'Track your bids across the marketplace'
            : 'Manage bids on your listings'}
        </p>
      </div>

      {/* Bids Table */}
      <Card className="border border-slate-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {bids.length} {bids.length === 1 ? 'Bid' : 'Bids'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {isBrand ? 'Listing' : 'Brand'}
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Price/kg
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bids.length > 0 ? (
                bids.map((bid) => {
                  const listing = dbGetListingById(bid.listingId)
                  return (
                    <tr key={bid.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {isBrand
                            ? listing
                              ? `${listing.materialType} - ${listing.weightKg} kg`
                              : 'Unknown Listing'
                            : bid.brandName}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-green-600">
                        {formatPricePerKg(bid.pricePerKg)}/kg
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {formatINR(bid.totalCost)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            bid.status === 'PENDING'
                              ? 'bg-yellow-50 text-yellow-700'
                              : bid.status === 'ACCEPTED'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {bid.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {new Date(bid.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/listings/${bid.listingId}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <p className="text-slate-500">No bids yet</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {isBrand
                        ? 'Browse the marketplace to place your first bid'
                        : 'Bids will appear here when brands bid on your listings'}
                    </p>
                    {isBrand && (
                      <Link href="/marketplace">
                        <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                          Browse Marketplace
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
