'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Package, Zap, User, ArrowLeft, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import {
  dbGetListingById,
  dbGetBidsByListing,
  formatINR,
  formatPricePerKg,
} from '@/lib/mock-db'

export default function ListingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userRole } = useAuth()
  const id = params.id as string

  const listing = dbGetListingById(id)
  const bids = listing ? dbGetBidsByListing(listing.id) : []

  if (!listing) {
    return (
      <div className="text-center py-20">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Listing Not Found</h2>
        <p className="text-slate-500 mb-6">This listing may have been removed or does not exist.</p>
        <Link href="/marketplace">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Back to Marketplace
          </Button>
        </Link>
      </div>
    )
  }

  const gradeColors = {
    A: 'bg-green-100 text-green-700 border-green-300',
    B: 'bg-amber-100 text-amber-700 border-amber-300',
    C: 'bg-red-100 text-red-700 border-red-300',
  }

  return (
    <div className="space-y-6">
      {/* Back Button + Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            {listing.materialType} - {listing.weightKg} kg
          </h1>
          <p className="text-slate-600 mt-1">
            Listed by {listing.collectorName} &middot; {listing.location}
          </p>
        </div>
        <Badge className={`text-sm font-bold px-3 py-1.5 border ${gradeColors[listing.grade]}`}>
          Grade {listing.grade}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card className="overflow-hidden border border-slate-200">
            <div className="relative h-72 bg-gradient-to-br from-green-50 to-slate-100 flex items-center justify-center">
              <Package className="w-16 h-16 text-slate-300" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 shadow-sm">
                {listing.materialType}
              </div>
            </div>
          </Card>

          {/* Details Grid */}
          <Card className="p-6 border border-slate-200 bg-white">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">Material Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Weight</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{listing.weightKg} kg</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Purity</p>
                <p className="text-xl font-bold text-green-600 mt-1">{listing.purityPercent}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Contamination</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{listing.contaminationPercent}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Grade</p>
                <span className={`inline-block mt-1 text-sm font-bold px-2.5 py-1 rounded border ${gradeColors[listing.grade]}`}>
                  Grade {listing.grade}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Location</p>
                <p className="text-base font-semibold text-slate-900 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {listing.location}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Asking Price</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {formatPricePerKg(listing.pricePerKg)}/kg
                </p>
              </div>
            </div>
          </Card>

          {/* Description */}
          {listing.description && (
            <Card className="p-6 border border-slate-200 bg-white">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-700 leading-relaxed">{listing.description}</p>
            </Card>
          )}

          {/* Seller Info */}
          <Card className="p-6 border border-slate-200 bg-white">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Seller Information</h2>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{listing.collectorName}</p>
                <p className="text-sm text-slate-500">Verified Collector</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="p-6 border border-slate-200 bg-white">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
              {listing.highestBidAmount ? 'Current Highest Bid' : 'Asking Price'}
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {formatPricePerKg(listing.highestBidAmount || listing.pricePerKg)}/kg
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Total value: {formatINR((listing.highestBidAmount || listing.pricePerKg) * listing.weightKg)}
            </p>

            {userRole === 'BRAND' && listing.status === 'ACTIVE' && (
              <Button className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white h-11 font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                Place Bid
              </Button>
            )}

            {listing.status !== 'ACTIVE' && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-center">
                <p className="text-sm font-medium text-slate-600">This listing is {listing.status.toLowerCase()}</p>
              </div>
            )}
          </Card>

          {/* Purity Indicator */}
          <Card className="p-6 border border-slate-200 bg-white">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Quality Indicator</h2>
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-green-600">{listing.purityPercent}% Pure</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all"
                style={{ width: `${listing.purityPercent}%` }}
              />
            </div>
          </Card>

          {/* Bid History */}
          {bids.length > 0 && (
            <Card className="border border-slate-200 bg-white overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-slate-900">
                  Bids ({bids.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {bids.map((bid) => (
                  <div key={bid.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{bid.brandName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(bid.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{formatPricePerKg(bid.pricePerKg)}/kg</p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          bid.status === 'ACCEPTED'
                            ? 'bg-green-50 text-green-700'
                            : bid.status === 'REJECTED'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Listing Date */}
          <Card className="p-5 border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Listed {new Date(listing.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
