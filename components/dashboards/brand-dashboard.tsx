'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import {
  dbGetBidsByBrand,
  dbGetTransactionsByUser,
  dbGetActiveListings,
  formatINR,
} from '@/lib/mock-db'

interface BrandDashboardProps {
  userId: string
  userName: string
}

export default function BrandDashboard({ userId, userName }: BrandDashboardProps) {
  const bids = dbGetBidsByBrand(userId)
  const transactions = dbGetTransactionsByUser(userId)
  const activeListings = dbGetActiveListings()

  const activeBids = bids.filter((b) => b.status === 'PENDING').length
  const acceptedBids = bids.filter((b) => b.status === 'ACCEPTED').length
  const purchasedKg = transactions
    .filter((t) => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.weightKg, 0)
  const totalSpend = transactions
    .filter((t) => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.totalAmount, 0)

  const stats = [
    {
      label: 'Active Bids',
      value: activeBids.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Accepted Bids',
      value: acceptedBids.toString(),
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Purchased Material',
      value: `${purchasedKg} kg`,
      icon: Package,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Total Spend',
      value: formatINR(totalSpend),
      icon: DollarSign,
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
        <Link href="/marketplace">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Browse Marketplace
          </Button>
        </Link>
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
      <Card className="border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/marketplace">
            <Button variant="outline" className="w-full h-11 justify-start gap-2">
              <ShoppingCart className="w-4 h-4" />
              Browse Marketplace
            </Button>
          </Link>
          <Link href="/bids">
            <Button variant="outline" className="w-full h-11 justify-start gap-2">
              <TrendingUp className="w-4 h-4" />
              View My Bids
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="outline" className="w-full h-11 justify-start gap-2">
              <Package className="w-4 h-4" />
              View Transactions
            </Button>
          </Link>
        </div>
      </Card>

      {/* Available Listings Preview */}
      <Card className="border border-slate-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Latest Marketplace Listings</h2>
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {activeListings.slice(0, 5).map((listing) => (
            <div
              key={listing.id}
              className="px-5 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{listing.materialType}</p>
                <p className="text-sm text-slate-600 mt-0.5">
                  {listing.weightKg} kg &middot; {listing.location}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-green-600">
                  {formatINR(listing.pricePerKg)}/kg
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
          ))}
        </div>
      </Card>
    </div>
  )
}
