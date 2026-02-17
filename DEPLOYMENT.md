# PlasticConnect Deployment Guide

## Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account and project
- Stripe account (test or production)
- Docker (optional, for containerized deployment)

## Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Configure the following environment variables:

### Supabase Setup
- Get your Supabase URL and Anon Key from your project settings
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Stripe Setup
- Get your Stripe keys from the Stripe Dashboard
- Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`

### Socket.io Setup
- Set `NEXT_PUBLIC_SOCKET_URL` to your Socket.io server URL
- Set `SOCKET_PORT` to the port your Socket.io server will run on

### App URL
- Set `NEXT_PUBLIC_APP_URL` to your application's domain

## Database Setup

The database tables are automatically created via Supabase migrations. If you're deploying to a fresh Supabase instance, run the migrations in this order:

1. `create_users_table` - User profiles
2. `create_listings_table` - Listing listings
3. `create_bids_table` - Bids
4. `create_transactions_table` - Transactions
5. `create_payments_table` - Payments
6. `create_logistics_table` - Shipping tracking
7. `create_price_history_table` - AI pricing data
8. `create_profile_trigger` - Auto-create profiles on signup

## Local Development

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start the Next.js Development Server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### 3. Start the Socket.io Server (in a separate terminal)
```bash
node server/socket-server.ts
```

Or with ts-node:
```bash
npx ts-node server/socket-server.ts
```

## Production Deployment

### Option 1: Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel Dashboard
3. Add environment variables in Vercel project settings
4. Deploy

```bash
vercel
```

### Option 2: Deploy with Docker

1. Build the Docker image:
```bash
docker build -t plasticconnect:latest .
```

2. Run the container:
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY \
  -e STRIPE_SECRET_KEY=$STRIPE_KEY \
  plasticconnect:latest
```

### Option 3: Deploy to Render/Railway

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy

## Socket.io Server Deployment

For production, deploy the Socket.io server separately:

### Option 1: Use Railway/Render
- Create a new service pointing to `server/socket-server.ts`
- Set environment variables
- Deploy

### Option 2: Use a hosting service like Fly.io
```bash
fly auth login
fly launch
fly deploy
```

## Post-Deployment

### 1. Test the Application
- Create a test account
- Create a test listing
- Place a test bid
- Process a test payment using Stripe test cards

### 2. Monitor Logs
- Check Vercel logs for Next.js errors
- Check Socket.io server logs for connection issues
- Check Supabase logs for database errors

### 3. Set Up Monitoring
- Configure Sentry for error tracking
- Set up log aggregation with Datadog or CloudWatch
- Monitor Stripe webhooks

## Troubleshooting

### Payment Processing Issues
- Ensure `STRIPE_SECRET_KEY` is set correctly
- Check Stripe webhook logs
- Verify database transactions are being created

### Real-time Features Not Working
- Ensure Socket.io server is running
- Check `NEXT_PUBLIC_SOCKET_URL` is correct
- Verify WebSocket connections in browser DevTools

### Database Connection Issues
- Check Supabase status page
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure RLS policies are properly configured

## Production Checklist

- [ ] All environment variables are set
- [ ] Stripe is in production mode
- [ ] Supabase RLS policies are enabled
- [ ] Socket.io is deployed and accessible
- [ ] SSL certificate is valid
- [ ] Database backups are configured
- [ ] Error monitoring is enabled
- [ ] Email notifications are configured (optional)
- [ ] Rate limiting is configured
- [ ] CORS is properly configured

## Support

For issues or questions, please refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Socket.io Documentation](https://socket.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
