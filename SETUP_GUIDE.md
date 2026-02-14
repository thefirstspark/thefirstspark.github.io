# The First Spark Membership Hub - Setup Guide

## What You Have

A complete, production-ready membership platform with:
- ✨ Beautiful mystical aesthetic matching The First Spark brand
- 🔐 Supabase authentication (email/password)
- 💳 Stripe integration for 4 membership tiers
- 📊 Member dashboard with content gating
- 🌙 Soul map functionality
- ⚡ Built on Astro + React for fast performance
- 📱 Fully responsive design

## Quick Setup (15 minutes)

### 1. Supabase Setup

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Settings > API > Copy:
   - `Project URL` → `PUBLIC_SUPABASE_URL`
   - `anon` key → `PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to SQL Editor and run the code from `SUPABASE_SETUP.sql`

### 2. Stripe Setup

1. Go to https://stripe.com and create account
2. Go to Developers > API Keys > Copy `Publishable key` → `PUBLIC_STRIPE_PUBLIC_KEY`
3. Copy `Secret key` → `STRIPE_SECRET_KEY`
4. Create Price objects for each tier:
   - Seeker (Free): No price needed
   - Ignite: $33/month - copy the `price_xxx` ID
   - Soul Map: $111/month - copy the `price_xxx` ID
   - The First Spark: $1000 one-time - copy the `price_xxx` ID
5. Update these IDs in `src/lib/tiers.js` (stripe_price_id fields)

### 3. Deploy to Vercel

1. Push this code to GitHub
2. Go to https://vercel.com and import your repo
3. Add these environment variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `PUBLIC_STRIPE_PUBLIC_KEY`
   - `STRIPE_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy! Your site will be live in seconds

### 4. Stripe Webhook (for payment success tracking)

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://your-vercel-url.com/api/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`
4. Copy the signing secret and add to Vercel env: `STRIPE_WEBHOOK_SECRET`

## File Structure

```
first-spark-hub/
├── src/
│   ├── components/
│   │   ├── AuthForm.jsx          # Login/signup
│   │   ├── PricingTiers.jsx       # Pricing cards
│   │   └── MemberDashboard.jsx    # Member area
│   ├── lib/
│   │   ├── supabase.js            # Supabase client
│   │   └── tiers.js               # Tier configuration
│   ├── layouts/
│   │   └── Layout.astro           # Main layout
│   └── pages/
│       ├── index.astro            # Home
│       ├── pricing.astro          # Pricing
│       ├── auth.astro             # Login
│       ├── dashboard.astro        # Member area
│       └── api/
│           └── checkout.ts        # Stripe checkout
├── astro.config.mjs
├── package.json
└── SUPABASE_SETUP.sql
```

## Development

```bash
# Install dependencies
npm install

# Create .env.local with your keys
# Copy values from the setup above

# Run dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npm run deploy
```

## Customization

### Colors & Branding
Edit the `<style>` blocks in components - main colors are:
- Gold: `#ffc857` (accent)
- Dark: `#1a1a2e` (primary background)
- Light text: `rgba(255, 255, 255, 0.8)`

### Add Content
1. Go to Supabase Dashboard > Tables > content
2. Add rows with:
   - `title`: Content name
   - `description`: Summary
   - `content_html`: The actual content
   - `required_tier`: Which tier can access ('free', 'premium', 'soul_map', 'lifetime')
   - `category`: Organization tag

### Soul Map Features
The soul map stores:
- Astrological signs (sun, moon, rising)
- Birth data
- Human Design type
- Numerology life path
- Compatibility notes

Extend by adding more fields to the `soul_maps` table in Supabase.

## Next Steps

1. **Member Onboarding**: Add a welcome email flow
2. **Content Creator**: Build a CMS for managing content
3. **Analytics**: Integrate with Plausible or Mixpanel
4. **Email Sequences**: Use SendGrid or Resend for automation
5. **Community**: Add forums or Discord integration
6. **Soulmate Matching**: Build the compatibility engine

## Support

- Astro docs: https://docs.astro.build
- Supabase docs: https://supabase.com/docs
- Stripe docs: https://stripe.com/docs

Good luck igniting The First Spark! ✨
