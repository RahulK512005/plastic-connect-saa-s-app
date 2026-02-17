'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, DollarSign, ListPlus, Upload, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import {
  dbGetListingsByCollector,
  dbGetTransactionsByUser,
  dbGetGradingResultsByUser,
  formatINR,
  formatPricePerKg,
} from '@/lib/mock-db'

interface CollectorDashboardProps {
  userId: string
  userName: string
}

export default function CollectorDashboard({ userId, userName }: CollectorDashboardProps) {
  const listings = dbGetListingsByCollector(userId)
  const transactions = dbGetTransactionsByUser(userId)
  const gradingResults = dbGetGradingResultsByUser(userId)

  const activeListings = listings.filter((l) => l.status === 'ACTIVE').length
  const totalSoldKg = transactions
    .filter((t) => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.weightKg, 0)
  const totalRevenue = transactions
    .filter((t) => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.totalAmount, 0)

  const stats = [
    {
      label: 'Active Listings',
      value: activeListings.toString(),
      icon: ListPlus,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Material Sold',
      value: `${totalSoldKg} kg`,
      icon: Package,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total Revenue',
      value: formatINR(totalRevenue),
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'AI Gradings',
      value: gradingResults.length.toString(),
      icon: TrendingUp,
      color: 'bg-teal-50 text-teal-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {userName}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/upload">
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              <Upload className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </Link>
          <Link href="/listings/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <ListPlus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-5 border border-slate-200 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/upload" className="block">
          <Card className="p-5 border border-slate-200 bg-white hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-green-50">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Upload & Grade</p>
                  <p className="text-sm text-slate-500">AI-powered quality grading</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors" />
            </div>
          </Card>
        </Link>
        <Link href="/marketplace" className="block">
          <Card className="p-5 border border-slate-200 bg-white hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Marketplace</p>
                  <p className="text-sm text-slate-500">Browse all listings</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </Card>
        </Link>
        <Link href="/transactions" className="block">
          <Card className="p-5 border border-slate-200 bg-white hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Transactions</p>
                  <p className="text-sm text-slate-500">View all transactions</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Listings */}
      <Card className="border border-slate-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Your Listings</h2>
          <Link href="/listings">
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {listings.length > 0 ? (
            listings.slice(0, 5).map((listing) => (
              <div
                key={listing.id}
                className="px-5 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{listing.materialType}</p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {listing.weightKg} kg &middot; {formatPricePerKg(listing.pricePerKg)}/kg
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      listing.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-700'
                        : listing.status === 'SOLD'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {listing.status}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    listing.grade === 'A' ? 'bg-green-100 text-green-700' :
                    listing.grade === 'B' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Grade {listing.grade}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-slate-500">No listings yet. Create your first listing!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
