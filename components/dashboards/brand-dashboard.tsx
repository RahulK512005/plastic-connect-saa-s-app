'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface BrandDashboardProps {
  data: {
    activeBids: number
    acceptedBids: number
    purchasedMaterial: number
    totalSpend: number
  }
}

export default function BrandDashboard({ data }: BrandDashboardProps) {
  const stats = [
    {
      label: 'Active Bids',
      value: data.activeBids,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Accepted Bids',
      value: data.acceptedBids,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Material Purchased (kg)',
      value: data.purchasedMaterial.toFixed(0),
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Total Spend',
      value: `$${data.totalSpend.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, Brand</p>
        </div>
        <Link href="/marketplace">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Browse Marketplace
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Quick Actions */}
      <Card className="border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/marketplace">
            <Button variant="outline" className="w-full h-12">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
          </Link>
          <Link href="/bids">
            <Button variant="outline" className="w-full h-12">
              <TrendingUp className="w-4 h-4 mr-2" />
              View My Bids
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="outline" className="w-full h-12">
              <Package className="w-4 h-4 mr-2" />
              View Transactions
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
