# Authentication Features Setup Guide

## Environment Variables Required

To enable social login functionality, you need to set up OAuth credentials for Google, Facebook, and Apple. Add these to your `.env.local` file:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://sea-lion-app-2u676.ondigitalocean.app

# OAuth Redirect URL
NEXT_PUBLIC_GOOGLE_REDIRECT_URL=https://whale-app-wi6lz.ondigitalocean.app/oauth-callback

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here

# Apple OAuth  
NEXT_PUBLIC_APPLE_CLIENT_ID=your_apple_client_id_here
```

## OAuth Setup Instructions

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if haven't done so
6. Application type: **Web application**
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
8. Add authorized redirect URIs:
   - `http://localhost:3000/oauth-callback`
   - `https://yourdomain.com/oauth-callback`
9. Copy the **Client ID** and paste it in `.env.local`

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add "Facebook Login" product
4. Go to Settings → Basic
5. Add your app domains
6. Go to Facebook Login → Settings
7. Add OAuth redirect URIs:
   - `http://localhost:3000/oauth-callback`
   - `https://yourdomain.com/oauth-callback`
8. Copy the **App ID** and paste it in `.env.local`

### Apple OAuth Setup

1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with Apple Developer account
3. Go to Certificates, IDs & Profiles
4. Create a new Services ID
5. Enable "Sign in with Apple"
6. Configure domains and redirect URLs:
   - Domains: `yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/oauth-callback`
7. Copy the **Services ID** and paste it in `.env.local`

> **Note**: Apple Sign In requires HTTPS and doesn't work on localhost. You'll need to deploy to test Apple authentication.

## Testing Without OAuth (Optional)

If you want to test the UI without setting up OAuth credentials, you can:

1. The buttons will still appear on the login page
2. Clicking them will show an error message about missing configuration
3. You can still test email/password login and CAPTCHA signup

## Backend Configuration

Make sure your backend has these endpoints implemented:

- `POST /api/captcha/generate` - Generate CAPTCHA image
- `POST /api/auth/signup` - Signup with CAPTCHA validation
- `POST /api/auth/send-verification-email` - Send OTP email
- `POST /api/auth/verify-email` - Verify OTP
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/verify-otp` - Verify password reset OTP
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/social-login` - Handle social authentication

## Features Implemented

✅ **CAPTCHA on Signup**
- Displays CAPTCHA image from backend
- Refresh button to get new CAPTCHA
- 5-character code validation
- Integrated with signup flow

✅ **Email Verification (OTP)**
- Dedicated verification page at `/verify-email`
- 6-digit OTP input with auto-focus
- Resend OTP with 60-second countdown
- Skip verification option

✅ **Forgot Password**
- 3-step flow (email → OTP → new password)
- Already existed, no changes needed
- Fully functional

✅ **Social Login Buttons**
- Google, Facebook, Apple sign-in
- Popup-based OAuth flow
- Portal-aware authentication
- Email extraction and backend verification

## File Structure

```
frontend/
├── app/
│   ├── login/page.tsx           # Login page with social buttons
│   ├── signup/page.tsx          # Signup with CAPTCHA
│   ├── verify-email/page.tsx    # OTP verification (NEW)
│   ├── forgot-password/page.tsx # Password reset (existing)
│   └── oauth-callback/page.tsx  # OAuth redirect handler (NEW)
├── components/
│   ├── OTPInput.tsx             # Reusable OTP input (NEW)
│   └── SocialLoginButtons.tsx   # Social login UI (NEW)
└── lib/
    ├── api.ts                   # Extended with new auth methods
    └── social-auth.ts           # OAuth helper functions (NEW)
```

## Next Steps

1. Add environment variables to `.env.local`
2. Set up OAuth apps (Google, Facebook, Apple)
3. Test the complete authentication flows:
   - Signup → CAPTCHA → OTP verification → Login
   - Forgot password flow
   - Social login (Google, Facebook, Apple)
4. Deploy to production and update OAuth redirect URLs
