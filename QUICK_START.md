# First Spark Membership Hub - Quick Start Checklist

## ✅ Before You Launch

### External Services Setup (Do these first!)

- [ ] **Supabase Account**
  - [ ] Create project at supabase.com
  - [ ] Copy Project URL → `PUBLIC_SUPABASE_URL`
  - [ ] Copy anon key → `PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Copy service_role key → `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] Run SQL from SUPABASE_SETUP.sql in SQL Editor

- [ ] **Stripe Account**
  - [ ] Create account at stripe.com
  - [ ] Copy publishable key → `PUBLIC_STRIPE_PUBLIC_KEY`
  - [ ] Copy secret key → `STRIPE_SECRET_KEY`
  - [ ] Create 3 Price objects (Ignite, Soul Map, Lifetime)
  - [ ] Update price IDs in `src/lib/tiers.js`

- [ ] **GitHub (for Vercel deployment)**
  - [ ] Push this code to your repo

- [ ] **Vercel**
  - [ ] Go to vercel.com
  - [ ] Import your GitHub repo
  - [ ] Add all env variables from Supabase & Stripe
  - [ ] Deploy!

### Local Development

```bash
# In the first-spark-hub directory:

npm install
# Create .env.local with all your keys from above
npm run dev
# Visit http://localhost:3000
```

### Verify It Works

- [ ] Home page loads
- [ ] Can sign up at /auth
- [ ] Can see pricing at /pricing
- [ ] Stripe checkout button works (click through, don't pay)
- [ ] Member dashboard loads after login
- [ ] Can see navigation bar

## 🎨 Customization Checklist

- [ ] Update hero text and branding colors
- [ ] Add your logo to navbar
- [ ] Update tier descriptions and features
- [ ] Add content to the database
- [ ] Create sample soul maps
- [ ] Customize email templates (when ready)
- [ ] Set up community features

## 🚀 Production Checklist

- [ ] Domain name configured in Vercel
- [ ] SSL certificate active
- [ ] Stripe set to live keys (not test)
- [ ] Webhook endpoint configured in Stripe
- [ ] Email verification working
- [ ] Payment success email configured
- [ ] Analytics installed (optional)
- [ ] Privacy policy created
- [ ] Terms of service created

## 📊 What You Can Do Now

1. **Manage Members**: Go to Supabase > profiles table
2. **Add Content**: Go to Supabase > content table
3. **Track Payments**: Go to Stripe Dashboard
4. **View Site**: Your Vercel URL
5. **Edit Code**: Deploy automatically on GitHub push

## 💡 Next Phase Ideas

- Soul map builder with step-by-step guidance
- Email sequences for onboarding
- Content library with filters
- Member-exclusive Discord/community
- Monthly group sessions booking
- Soulmate compatibility matching
- Ritual recommendation engine
- Personal astrology reports

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Supabase undefined" | Check .env vars in Vercel & local |
| "Stripe error" | Verify price IDs exist in Stripe Dashboard |
| "Auth not working" | Check email confirmation in Supabase |
| "Payment fails" | Use Stripe test cards: 4242 4242 4242 4242 |

## 📞 Support Resources

- Astro: https://docs.astro.build
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- Me: Just ask! 

---

**You're ready to launch. The First Spark awaits. ✨**
