# PlasticConnect - Quick Start Guide

## 5-Minute Setup

### 1. Prerequisites
- Node.js 18+
- Git
- Supabase account (free tier works)
- Stripe account (test mode)

### 2. Clone & Install
```bash
git clone <your-repo-url>
cd plasticconnect
pnpm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Your Supabase Keys
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy Project URL and anon key

### 5. Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers → API Keys
3. Copy Publishable and Secret keys (test mode)

### 6. Start the App
```bash
# Terminal 1 - Next.js app
pnpm dev

# Terminal 2 - Socket.io server
npx ts-node server/socket-server.ts
```

Visit `http://localhost:3000`

## Test the App

### Sign Up
1. Click "Get Started"
2. Choose role (Collector or Brand)
3. Fill in details and verify email

### As a Collector
1. Go to "Create Listing"
2. Fill in material details
3. See AI price recommendation
4. Create listing

### As a Brand
1. Go to "Marketplace"
2. Browse listings
3. Click "View & Bid"
4. Place a bid on the listing

### Real-time Features
- See bids update in real-time
- Get countdown timer
- Online bidders count
- Bid notifications

### Test Payment
1. Accept bid as collector
2. Brand initiates payment
3. Use test card: `4242 4242 4242 4242`
4. Expiry: `12/25`, CVC: `123`
5. Payment confirmed

## Project Structure Overview

```
├── app/(protected)/         # Protected pages (auth required)
├── app/auth/               # Login/signup pages
├── app/api/                # API routes
├── components/             # React components
├── lib/                    # Utilities & services
├── hooks/                  # Custom hooks
└── server/                 # Socket.io server
```

## Key Files to Understand

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/socket/socket-context.tsx` | Real-time bidding setup |
| `lib/ai-pricing/pricing-service.ts` | AI price recommendations |
| `lib/stripe/stripe-service.ts` | Payment processing |
| `app/layout.tsx` | Root layout with Socket provider |
| `middleware.ts` | Session refresh |
| `server/socket-server.ts` | Real-time server |

## Common Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production build
pnpm start

# Type checking
pnpm tsc --noEmit

# Linting
pnpm lint
```

## Troubleshooting

### "Can't connect to Socket.io"
- Ensure Socket.io server is running on terminal 2
- Check `NEXT_PUBLIC_SOCKET_URL` is correct

### "Supabase connection failed"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and key
- Check Supabase project is active

### "Stripe payment failing"
- Ensure you're using test keys (start with `pk_test_` and `sk_test_`)
- Use test card: 4242 4242 4242 4242

### "Database tables not found"
- Check Supabase migrations have run
- Tables should auto-create on first run

## Test Demo Flow

1. **Sign up as Collector**
   - Email: collector@demo.com
   - Password: demo123456

2. **Create a listing**
   - Material: HDPE
   - Weight: 1000 kg
   - Location: New York
   - Asking price: $0.50/kg
   - See AI recommendation

3. **Sign up as Brand**
   - Email: brand@demo.com
   - Password: demo123456

4. **Place a bid**
   - Go to Marketplace
   - Find the listing
   - Bid $0.55/kg
   - See real-time update

5. **Accept bid (back as Collector)**
   - Go to My Listings
   - Click the listing
   - See the bid
   - Accept it

6. **Process payment (as Brand)**
   - Go to Transactions
   - Pay advance (50%)
   - Use test card

7. **Track shipment**
   - Both see logistics
   - Real-time updates
   - Progress tracking

## Next Steps

1. Customize branding (colors, logo)
2. Add email notifications
3. Deploy to production
4. Set up error monitoring
5. Configure rate limiting
6. Add webhook handlers

## Resources

- [Project Summary](./PROJECT_SUMMARY.md) - Full documentation
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Socket.io Docs](https://socket.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

## Need Help?

1. Check `.env.local` - most issues are config
2. Clear browser cache and restart both servers
3. Check browser console for errors
4. Review DEPLOYMENT.md for production setup

---

You're ready to go! Have fun building with PlasticConnect.
