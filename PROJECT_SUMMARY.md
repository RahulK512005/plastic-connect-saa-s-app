# PlasticConnect - Project Summary

## Overview

PlasticConnect is a **production-ready B2B AI marketplace** connecting plastic waste collectors with recycling brands. The platform features real-time bidding, secure payments, compliance certificates, and logistics tracking with an AI-powered pricing engine.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19 + Tailwind CSS 4
- **Components**: shadcn/ui
- **Real-time**: Socket.io Client
- **State Management**: SWR (client-side caching)
- **Styling**: Tailwind CSS with custom design tokens

### Backend
- **Runtime**: Next.js Server Actions & API Routes
- **Database**: Supabase (PostgreSQL) with RLS
- **Authentication**: Supabase Auth (Email/Password)
- **Payments**: Stripe (test & production)
- **Real-time Server**: Socket.io
- **Cloud**: Vercel (app) + Custom VPS (Socket.io)

## Project Structure

```
├── app/
│   ├── (protected)/          # Protected routes with auth
│   │   ├── dashboard/        # Role-based dashboards
│   │   ├── marketplace/      # Browse listings
│   │   ├── listings/         # Create & manage listings
│   │   ├── bids/            # Manage bids
│   │   ├── transactions/    # Transaction history
│   │   ├── certificates/    # Compliance certificates
│   │   ├── logistics/       # Shipment tracking
│   │   └── settings/        # User settings
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── api/                 # API routes
│   │   ├── listings/        # Listing management
│   │   ├── payments/        # Payment processing
│   │   └── pricing/         # AI pricing engine
│   ├── layout.tsx           # Root layout with Socket provider
│   └── page.tsx             # Landing page
├── components/
│   ├── layout/              # Header & sidebar
│   ├── dashboards/          # Role-based dashboards
│   ├── marketplace/         # Marketplace components
│   ├── bidding/             # Real-time bidding UI
│   ├── payment/             # Payment forms
│   ├── pricing/             # Pricing recommendations
│   └── ui/                  # shadcn components
├── lib/
│   ├── supabase/           # Supabase client setup
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── proxy.ts        # Middleware session handler
│   ├── socket/             # Real-time bidding
│   │   └── socket-context.tsx
│   ├── ai-pricing/         # AI pricing service
│   │   └── pricing-service.ts
│   ├── stripe/             # Stripe integration
│   │   └── stripe-service.ts
│   └── utils.ts            # Utility functions
├── hooks/
│   ├── use-auth.ts         # Authentication hook
│   └── use-realtime-bids.ts # Real-time bidding hook
├── app/
│   └── actions/            # Server actions
│       └── auth.ts
├── middleware.ts           # Session refresh middleware
├── server/
│   └── socket-server.ts   # Socket.io real-time server
├── .env.example           # Environment variables template
├── DEPLOYMENT.md          # Deployment instructions
└── PROJECT_SUMMARY.md     # This file
```

## Key Features

### 1. Authentication & Authorization
- Email/password authentication with Supabase Auth
- Role-based access control (Collector vs Brand)
- JWT-based session management
- Secure HTTP-only cookies
- Auto-profile creation on signup

### 2. Marketplace
- Browse active listings with filters
- Filter by material type, grade, price, location
- Listing cards with real-time highest bid display
- Detailed listing pages with seller information
- Search and discovery

### 3. Real-time Bidding System (Socket.io)
- Live bid updates across connected users
- Real-time highest bid tracking
- Bid countdown timers
- Online bidder indicators
- Bid history timeline
- Automatic room subscriptions per listing
- Fallback to polling if socket disconnects

### 4. Bid Workflow
- Collectors create listings with asking price
- Brands place competitive bids
- Real-time bid notifications
- Collectors accept/reject bids
- Winning bid creates transaction

### 5. Payment Processing (Stripe)
- Escrow-style two-phase payments
- 50% advance payment upon bid acceptance
- Final payment upon delivery
- Payment status tracking
- Refund support
- Secure payment with Stripe integration
- Payment history per transaction

### 6. Compliance & Certificates
- Auto-generated certificates upon transaction completion
- PDF download support
- Material type, weight, buyer, seller details
- Compliance statement
- Digital archival

### 7. Logistics Tracking
- Multi-stage shipment tracking
- Statuses: Pickup → Transit → Processing → Delivered
- Real-time location updates via Socket.io
- Carrier and tracking number tracking
- Estimated delivery dates
- Real-time notifications to buyers and sellers

### 8. AI Pricing Engine
- Smart price recommendations based on:
  - Material type historical data
  - Grade/purity adjustments
  - Market trends (UP/DOWN/STABLE)
  - Location demand multipliers
  - Real-time transaction data
- Confidence scoring (50-100%)
- Price range recommendations
- Market trend indicators
- Automatic purity-based grading (A/B/C)

### 9. Dashboard Analytics
- **Collector Dashboard**: Total listings, sold material, revenue, recent listings
- **Brand Dashboard**: Active bids, accepted bids, purchased material, total spend
- Quick action buttons
- Real-time statistics

### 10. Security
- Row Level Security (RLS) on all tables
- Parameterized queries to prevent SQL injection
- Secure payment with PCI-compliant Stripe
- CORS configuration
- Environment variable protection
- Rate limiting (can be added)

## Database Schema

### Tables
1. **profiles** - User profiles (collectors & brands)
2. **listings** - Plastic waste listings
3. **bids** - Bids placed on listings
4. **transactions** - Completed transactions
5. **payments** - Payment records with Stripe integration
6. **logistics** - Shipment tracking
7. **price_history** - Historical pricing for AI engine

### Key Features
- UUID primary keys
- Timestamps on all records
- Foreign key relationships with cascading deletes
- Row Level Security (RLS) policies
- Indexed columns for performance
- Automatic triggers for profile creation

## Real-time Architecture

### Socket.io Events

**Client → Server:**
- `subscribe` - Join listing's real-time room
- `unsubscribe` - Leave listing's real-time room
- `PLACE_BID` - Place a bid on a listing
- `ACCEPT_BID` - Accept a bid (collectors only)
- `UPDATE_LOGISTICS` - Update shipment status

**Server → Client:**
- `NEW_BID` - New bid placed on listing
- `BID_ACCEPTED` - Winning bid accepted
- `LISTING_SOLD` - Listing sold status
- `LOGISTICS_UPDATED` - Shipment status changed
- `connect` - Connection established
- `disconnect` - Connection lost

### Fallback Strategy
- Detects socket disconnection
- Shows offline mode indicator
- Stores bids locally
- Syncs when connection restores
- Graceful degradation

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Listings
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create listing
- `GET /api/listings/:id` - Get listing details

### Payments
- `POST /api/payments/intent` - Create Stripe intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Refund payment

### Pricing
- `POST /api/pricing/recommend` - Get AI price recommendation

## Authentication Flow

1. User signs up with email, password, name, and role
2. Supabase Auth creates user and sends verification email
3. Trigger auto-creates profile record
4. User confirms email
5. User signs in with credentials
6. Session stored in HTTP-only cookie
7. Middleware refreshes token on each request
8. Protected routes redirect unauthenticated users to login

## Payment Flow

1. Collector accepts highest bid
2. Transaction created with status PAYMENT_PENDING
3. Brand initiates checkout
4. Frontend calls `/api/payments/intent`
5. Backend creates Stripe PaymentIntent
6. Frontend displays payment form
7. Brand enters card details
8. Frontend confirms payment via Stripe
9. Backend updates transaction and logistics
10. Certificate generated
11. Logistics shipment initiated

## AI Pricing Calculation

```
base_price = historical average for material type
adjusted_price = base_price * grade_multiplier * purity_adjustment * location_multiplier * trend_adjustment

Multipliers:
- Grade A: 1.3x
- Grade B: 1.0x  
- Grade C: 0.7x
- Purity: 0.5% per point above 85%
- Location: 0.7x - 1.15x depending on demand
- Trend: 1.05x (UP), 0.95x (DOWN), 1.0x (STABLE)

Confidence Score: 50-100% based on data availability
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anon key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Stripe public key
STRIPE_SECRET_KEY=                  # Stripe secret key
NEXT_PUBLIC_SOCKET_URL=            # Socket.io server URL
SOCKET_PORT=                        # Socket.io server port
NEXT_PUBLIC_APP_URL=               # Application URL
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd plasticconnect
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run development server**
   ```bash
   pnpm dev
   # App runs on http://localhost:3000
   ```

5. **Start Socket.io server** (in another terminal)
   ```bash
   npx ts-node server/socket-server.ts
   # Server runs on http://localhost:3001
   ```

## Test Credentials

**Collector Account:**
- Email: collector@demo.com
- Password: demo123456

**Brand Account:**
- Email: brand@demo.com
- Password: demo123456

**Stripe Test Card:**
- Number: 4242 4242 4242 4242
- Expiry: 12/25
- CVC: 123

## Deployment

See `DEPLOYMENT.md` for comprehensive deployment instructions including:
- Vercel deployment
- Docker containerization
- Render/Railway deployment
- Socket.io server deployment
- Post-deployment checklist

## Performance Optimizations

- Next.js image optimization
- Server-side rendering where possible
- Client-side caching with SWR
- Database indexing on frequently queried columns
- Socket.io connection pooling
- Stripe webhook caching

## Security Considerations

- Row Level Security on all database tables
- HTTPS enforcement in production
- CORS properly configured
- Environment variables protected
- Secure session cookies
- PCI compliance via Stripe
- Input validation on all forms
- SQL injection prevention with parameterized queries

## Future Enhancements

1. Advanced analytics dashboard
2. Rating and review system
3. Dispute resolution system
4. Automated invoice generation
5. Email notifications
6. SMS alerts for logistics
7. Mobile app (React Native)
8. Multi-currency support
9. Integration with logistics providers
10. ESG reporting and carbon tracking

## Support & Contributing

For issues or questions:
1. Check the DEPLOYMENT.md guide
2. Review Supabase, Stripe, and Socket.io documentation
3. Check application logs
4. Create an issue in the repository

## License

MIT License - See LICENSE file for details

## Team

Built with Next.js, React, Tailwind CSS, and modern web technologies.

---

**Last Updated**: February 2024
**Version**: 1.0.0
**Status**: Production Ready
