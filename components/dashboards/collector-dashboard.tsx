'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Package, DollarSign, ListPlus } from 'lucide-react'
import Link from 'next/link'

interface CollectorDashboardProps {
  data: {
    totalListings: number
    soldMaterial: number
    revenue: number
    listings: Array<{
      id: string
      material_type: string
      weight_kg: number
      asking_price: number
      status: string
    }>
  }
}

export default function CollectorDashboard({ data }: CollectorDashboardProps) {
  const stats = [
    {
      label: 'Total Listings',
      value: data.totalListings,
      icon: ListPlus,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Material Sold (kg)',
      value: data.soldMaterial.toFixed(0),
      icon: Package,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total Revenue',
      value: `$${data.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, Collector</p>
        </div>
        <Link href="/listings/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            + Create Listing
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Listings */}
      <Card className="border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Listings</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {data.listings.length > 0 ? (
            data.listings.map((listing) => (
              <div
                key={listing.id}
                className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{listing.material_type}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {listing.weight_kg} kg • ${listing.asking_price}/kg
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      listing.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-700'
                        : listing.status === 'SOLD'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    {listing.status}
                  </span>
                  <Link href={`/listings/${listing.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-slate-600">No listings yet</p>
              <Link href="/listings/create">
                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                  Create Your First Listing
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
