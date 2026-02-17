'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface BidUpdate {
  listingId: string
  bidId: string
  brandId: string
  pricePerKg: number
  totalCost: number
  timestamp: string
}

interface ListingStatusUpdate {
  listingId: string
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED'
  timestamp: string
}

interface LogisticsUpdate {
  transactionId: string
  status: string
  currentLocation: string
  timestamp: string
}

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  isSubscribedTo: (listingId: string) => boolean
  subscribeTo: (listingId: string) => void
  unsubscribeFrom: (listingId: string) => void
  onNewBid: (callback: (data: BidUpdate) => void) => void
  onBidAccepted: (callback: (data: any) => void) => void
  onListingSold: (callback: (data: ListingStatusUpdate) => void) => void
  onLogisticsUpdate: (callback: (data: LogisticsUpdate) => void) => void
  emitBid: (listing: any, pricePerKg: number) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [subscribedRooms, setSubscribedRooms] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Initialize Socket.io connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      console.log('[Socket] Connected:', newSocket.id)
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const subscribeTo = useCallback(
    (listingId: string) => {
      if (socket && !subscribedRooms.has(listingId)) {
        socket.emit('subscribe', { listingId })
        setSubscribedRooms((prev) => new Set([...prev, listingId]))
      }
    },
    [socket, subscribedRooms]
  )

  const unsubscribeFrom = useCallback(
    (listingId: string) => {
      if (socket && subscribedRooms.has(listingId)) {
        socket.emit('unsubscribe', { listingId })
        setSubscribedRooms((prev) => {
          const next = new Set(prev)
          next.delete(listingId)
          return next
        })
      }
    },
    [socket, subscribedRooms]
  )

  const isSubscribedTo = useCallback(
    (listingId: string) => subscribedRooms.has(listingId),
    [subscribedRooms]
  )

  const onNewBid = useCallback(
    (callback: (data: BidUpdate) => void) => {
      if (socket) {
        socket.on('NEW_BID', callback)
      }
    },
    [socket]
  )

  const onBidAccepted = useCallback(
    (callback: (data: any) => void) => {
      if (socket) {
        socket.on('BID_ACCEPTED', callback)
      }
    },
    [socket]
  )

  const onListingSold = useCallback(
    (callback: (data: ListingStatusUpdate) => void) => {
      if (socket) {
        socket.on('LISTING_SOLD', callback)
      }
    },
    [socket]
  )

  const onLogisticsUpdate = useCallback(
    (callback: (data: LogisticsUpdate) => void) => {
      if (socket) {
        socket.on('LOGISTICS_UPDATED', callback)
      }
    },
    [socket]
  )

  const emitBid = useCallback(
    (listing: any, pricePerKg: number) => {
      if (socket) {
        socket.emit('PLACE_BID', {
          listingId: listing.id,
          pricePerKg,
          totalCost: listing.weight_kg * pricePerKg,
          timestamp: new Date().toISOString(),
        })
      }
    },
    [socket]
  )

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        isSubscribedTo,
        subscribeTo,
        unsubscribeFrom,
        onNewBid,
        onBidAccepted,
        onListingSold,
        onLogisticsUpdate,
        emitBid,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
