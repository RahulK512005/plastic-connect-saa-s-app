'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRealtimeBids } from '@/hooks/use-realtime-bids'
import { useSocket } from '@/lib/socket/socket-context'
import { TrendingUp, Clock, Users } from 'lucide-react'

interface LiveBidPanelProps {
  listing: {
    id: string
    weight_kg: number
    asking_price: number
    material_type: string
  }
  onlineBidders?: number
}

export default function LiveBidPanel({ listing, onlineBidders = 0 }: LiveBidPanelProps) {
  const { bids, highestBid, lastBidTime, bidCount } = useRealtimeBids(listing.id)
  const { isConnected, emitBid } = useSocket()
  const [bidAmount, setBidAmount] = useState(listing.asking_price.toString())
  const [placingBid, setPlacingBid] = useState(false)
  const [bidError, setBidError] = useState<string | null>(null)

  const minimumBid = Math.max(listing.asking_price, highestBid ? highestBid + 0.1 : 0)
  const totalCost = Number(bidAmount) * listing.weight_kg
  const isValidBid = Number(bidAmount) >= minimumBid

  const handlePlaceBid = async () => {
    if (!isValidBid) {
      setBidError(`Minimum bid must be $${minimumBid.toFixed(2)}/kg`)
      return
    }

    setPlacingBid(true)
    setBidError(null)

    try {
      emitBid(listing, Number(bidAmount))
      // Reset form after successful bid
      setTimeout(() => {
        setBidAmount(minimumBid.toString())
        setPlacingBid(false)
      }, 500)
    } catch (error) {
      setBidError('Failed to place bid. Please try again.')
      setPlacingBid(false)
    }
  }

  const handleInputChange = (value: string) => {
    // Allow only valid decimal numbers
    if (/^\d*\.?\d*$/.test(value)) {
      setBidAmount(value)
      setBidError(null)
    }
  }

  return (
    <Card className="p-6 border border-slate-200 sticky top-24 shadow-lg">
      <div className="space-y-6">
        {/* Status Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
              )}
              <span className="text-sm font-medium text-green-900">
                {isConnected ? 'Live Updates Active' : 'Offline Mode'}
              </span>
            </div>
          </div>

          {/* Online Bidders */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4" />
            <span>{onlineBidders} bidders online</span>
          </div>
        </div>

        {/* Current Highest Bid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Current Highest Bid</span>
            {lastBidTime && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lastBidTime.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${highestBid > 0 ? highestBid.toFixed(2) : listing.asking_price.toFixed(2)}/kg
          </div>
          <div className="text-sm text-slate-600">
            {bidCount} {bidCount === 1 ? 'bid' : 'bids'} placed
          </div>
        </div>

        {/* Bid Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Your Bid (per kg)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-medium">
                $
              </span>
              <Input
                type="text"
                value={bidAmount}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={minimumBid.toFixed(2)}
                disabled={placingBid}
                className="pl-8 text-lg font-semibold h-12"
              />
            </div>
            <p className="text-xs text-slate-600">
              Minimum: ${minimumBid.toFixed(2)}/kg
            </p>
          </div>

          {/* Total Cost */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-600">Weight</span>
              <span className="text-sm font-medium">{listing.weight_kg} kg</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between">
              <span className="font-medium text-slate-900">Total Cost</span>
              <span className="text-lg font-bold text-green-600">
                ${isNaN(totalCost) ? '0.00' : totalCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {bidError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{bidError}</p>
            </div>
          )}

          {/* Place Bid Button */}
          <Button
            onClick={handlePlaceBid}
            disabled={placingBid || !isValidBid || !isConnected}
            className={`w-full h-12 font-semibold rounded-lg transition-all ${
              isValidBid && isConnected
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {placingBid ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Placing Bid...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Place Bid
              </div>
            )}
          </Button>

          {!isConnected && (
            <p className="text-xs text-orange-600 text-center">
              Using offline mode. Bids will sync when connection restores.
            </p>
          )}
        </div>

        {/* Bid History */}
        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent Bids</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {bids.length > 0 ? (
              bids.slice(-5).reverse().map((bid) => (
                <div key={bid.bidId} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">${bid.pricePerKg.toFixed(2)}/kg</span>
                  <span className="text-slate-400 text-xs">
                    {new Date(bid.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No bids yet</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
