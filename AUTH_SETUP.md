# PlasticConnect Authentication Setup

## Overview

PlasticConnect uses Supabase for authentication with email/password login. Users can sign up and log in directly without email confirmation.

## Recent Changes (Immediate Login After Signup)

We've updated the authentication flow to provide a seamless experience:

### What Changed:
1. **No Email Confirmation Required** - Users can login immediately after signup
2. **Auto-Login After Signup** - After creating an account, users are automatically authenticated
3. **Direct Dashboard Access** - Users go directly to their dashboard instead of seeing a success page
4. **Profile Auto-Creation** - User profiles are automatically created when auth triggers fire

### How It Works:

#### Sign Up Flow:
```
User fills signup form → Account created → User auto-logged in → Redirected to dashboard
```

#### Sign In Flow:
```
User fills login form → Account authenticated → Redirected to dashboard
```

## Configuration

### Supabase Settings Required

To disable email confirmation in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication → Providers → Email**
3. Find the option "Confirm email" - it should be **disabled** for no-confirmation flow
4. Ensure "Double confirm change" is also unchecked if using OTP

### Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## File Changes

### Modified Files:

1. **app/actions/auth.ts**
   - Updated `signUp()` to auto-login user after account creation
   - Removed email confirmation requirement

2. **app/auth/signup/page.tsx**
   - Changed redirect from signup-success to /dashboard
   - Users go directly to dashboard after signup

3. **app/auth/signup-success/page.tsx**
   - Updated to show "Welcome" message instead of email confirmation message
   - Auto-redirects to dashboard after 2 seconds

4. **app/(protected)/dashboard/page.tsx**
   - Added error handling for profile creation
   - Auto-creates profile if it doesn't exist
   - Improved fallback to user metadata for role

## Testing

### Test Signup Flow:
1. Go to `/auth/signup`
2. Enter email, password, name, and select role (Collector or Brand)
3. Click "Create Account"
4. You should be automatically logged in and redirected to dashboard
5. No email confirmation needed

### Test Login Flow:
1. Go to `/auth/login`
2. Enter the email and password you just created
3. You should be logged in and redirected to dashboard

### Test Role-Based Access:
- Collector should see: Total Listings, Active Bids, Sold Material, Revenue
- Brand should see: Active Bids, Purchased Material, Certificates, Spend

## Troubleshooting

### Issue: Blank Dashboard
- Check that your Supabase credentials are correct
- Ensure database tables exist (run migrations if needed)
- Check browser console for errors

### Issue: Not Auto-Logged In After Signup
- Verify email confirmation is disabled in Supabase
- Check that `signUp()` function was properly updated
- Ensure user metadata includes role

### Issue: Profile Not Found
- The dashboard should auto-create profile on first load
- Check Supabase RLS policies allow profile creation
- Verify the trigger `on_auth_user_created` exists in database

## Security Notes

- Email confirmation being disabled means accounts are active immediately
- Consider implementing other security measures:
  - Email verification badges in profile
  - Optional 2FA setup
  - Rate limiting on signup
  - CAPTCHA for bot prevention

## Future Enhancements

- Add optional email verification (separate from login requirement)
- Implement 2-factor authentication
- Add social login (Google, Microsoft)
- Add magic link authentication

