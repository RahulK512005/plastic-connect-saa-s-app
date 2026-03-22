'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface Bid {
  id: string
  price_per_kg: number
  total_cost: number
  status: string
  created_at: string
}

interface BidHistoryProps {
  bids: Bid[]
}

export default function BidHistory({ bids }: BidHistoryProps) {
  return (
    <Card className="p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-slate-900">Bid History</h2>
      </div>

      {bids.length > 0 ? (
        <div className="space-y-3">
          {bids.map((bid, index) => (
            <div key={bid.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-slate-900">
                  Bid #{bids.length - index}
                </div>
                <p className="text-sm text-slate-600">
                  {new Date(bid.created_at).toLocaleDateString()} at{' '}
                  {new Date(bid.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">${bid.price_per_kg.toFixed(2)}/kg</p>
                <p className="text-sm text-slate-600">${bid.total_cost.toFixed(2)} total</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-600">No bids yet. Be the first to bid!</p>
        </div>
      )}
    </Card>
  )
}
