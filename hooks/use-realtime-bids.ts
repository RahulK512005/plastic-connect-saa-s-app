import { useEffect, useState, useCallback } from 'react'
import { useSocket } from '@/lib/socket/socket-context'

interface BidData {
  bidId: string
  pricePerKg: number
  totalCost: number
  timestamp: string
  highestBid: number
}

export function useRealtimeBids(listingId: string) {
  const { subscribeTo, unsubscribeFrom, onNewBid, isSubscribedTo } = useSocket()
  const [bids, setBids] = useState<BidData[]>([])
  const [highestBid, setHighestBid] = useState<number>(0)
  const [lastBidTime, setLastBidTime] = useState<Date | null>(null)

  // Subscribe to listing
  useEffect(() => {
    if (!isSubscribedTo(listingId)) {
      subscribeTo(listingId)
    }

    return () => {
      unsubscribeFrom(listingId)
    }
  }, [listingId, subscribeTo, unsubscribeFrom, isSubscribedTo])

  // Listen for new bids
  useEffect(() => {
    const handleNewBid = (data: BidData) => {
      setBids((prev) => [...prev, data])
      setHighestBid(data.highestBid)
      setLastBidTime(new Date(data.timestamp))
    }

    onNewBid(handleNewBid)
  }, [onNewBid])

  const clearBids = useCallback(() => {
    setBids([])
    setHighestBid(0)
    setLastBidTime(null)
  }, [])

  return {
    bids,
    highestBid,
    lastBidTime,
    bidCount: bids.length,
    clearBids,
  }
}
