import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Create HTTP server for Socket.io
const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  },
})

// Store active rooms and their data
interface RoomData {
  listingId: string
  highestBid: number
  highestBidder: string
  bids: Array<{
    bidId: string
    brandId: string
    pricePerKg: number
    totalCost: number
    timestamp: string
  }>
}

const activeRooms = new Map<string, RoomData>()

io.on('connection', (socket: Socket) => {
  console.log(`[Socket] User connected: ${socket.id}`)

  // User subscribes to a listing's real-time updates
  socket.on('subscribe', ({ listingId }) => {
    console.log(`[Socket] User ${socket.id} subscribed to listing ${listingId}`)
    socket.join(`listing-${listingId}`)

    // Send current highest bid if exists
    const room = activeRooms.get(listingId)
    if (room) {
      socket.emit('current-bid', {
        highestBid: room.highestBid,
        highestBidder: room.highestBidder,
      })
    }
  })

  // User unsubscribes from a listing
  socket.on('unsubscribe', ({ listingId }) => {
    console.log(`[Socket] User ${socket.id} unsubscribed from listing ${listingId}`)
    socket.leave(`listing-${listingId}`)
  })

  // User places a bid
  socket.on('PLACE_BID', async (data) => {
    const { listingId, pricePerKg, totalCost, timestamp } = data
    console.log(`[Socket] New bid on listing ${listingId}: $${pricePerKg}/kg`)

    try {
      // Get the current user (would need to be authenticated)
      // For now, we'll use the socket ID
      const bidId = `bid-${Date.now()}`
      const brandId = socket.id

      // Update or create room data
      if (!activeRooms.has(listingId)) {
        activeRooms.set(listingId, {
          listingId,
          highestBid: pricePerKg,
          highestBidder: brandId,
          bids: [],
        })
      }

      const room = activeRooms.get(listingId)!
      room.bids.push({
        bidId,
        brandId,
        pricePerKg,
        totalCost,
        timestamp,
      })

      if (pricePerKg > room.highestBid) {
        room.highestBid = pricePerKg
        room.highestBidder = brandId
      }

      // Broadcast new bid to all users in the listing room
      io.to(`listing-${listingId}`).emit('NEW_BID', {
        bidId,
        listingId,
        pricePerKg,
        totalCost,
        timestamp,
        highestBid: room.highestBid,
      })

      // Save bid to database
      const { error } = await supabase.from('bids').insert({
        id: bidId,
        listing_id: listingId,
        brand_id: brandId,
        price_per_kg: pricePerKg,
        total_cost: totalCost,
        status: 'PENDING',
      })

      if (error) {
        console.error('[Socket] Error saving bid:', error)
      }
    } catch (error) {
      console.error('[Socket] Error placing bid:', error)
      socket.emit('bid-error', { message: 'Failed to place bid' })
    }
  })

  // Collector accepts a bid
  socket.on('ACCEPT_BID', async (data) => {
    const { bidId, listingId } = data
    console.log(`[Socket] Bid accepted: ${bidId}`)

    try {
      // Update bid status
      const { error } = await supabase
        .from('bids')
        .update({ status: 'ACCEPTED' })
        .eq('id', bidId)

      if (error) throw error

      // Update listing status to SOLD
      await supabase
        .from('listings')
        .update({ status: 'SOLD' })
        .eq('id', listingId)

      // Notify all users
      io.to(`listing-${listingId}`).emit('BID_ACCEPTED', {
        bidId,
        listingId,
        timestamp: new Date().toISOString(),
      })

      // Clear room data
      activeRooms.delete(listingId)
    } catch (error) {
      console.error('[Socket] Error accepting bid:', error)
      socket.emit('bid-error', { message: 'Failed to accept bid' })
    }
  })

  // Update logistics status
  socket.on('UPDATE_LOGISTICS', async (data) => {
    const { transactionId, status, currentLocation } = data
    console.log(`[Socket] Logistics updated: ${transactionId} - ${status}`)

    try {
      // Update logistics in database
      const { error } = await supabase
        .from('logistics')
        .update({ status, current_location: currentLocation })
        .eq('transaction_id', transactionId)

      if (error) throw error

      // Get transaction to find related users
      const { data: transaction } = await supabase
        .from('transactions')
        .select('collector_id, brand_id')
        .eq('id', transactionId)
        .single()

      if (transaction) {
        // Notify relevant users
        io.to(`user-${transaction.collector_id}`).emit('LOGISTICS_UPDATED', {
          transactionId,
          status,
          currentLocation,
          timestamp: new Date().toISOString(),
        })

        io.to(`user-${transaction.brand_id}`).emit('LOGISTICS_UPDATED', {
          transactionId,
          status,
          currentLocation,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('[Socket] Error updating logistics:', error)
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`)
  })
})

// Start the server
const PORT = process.env.SOCKET_PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`[Socket] Server running on port ${PORT}`)
})

export default io
