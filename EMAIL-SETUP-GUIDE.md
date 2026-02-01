# Email Capture Setup Guide

Your email capture form is ready to go, but needs a free email service to function. Here are your options:

## Option 1: Formspree (Recommended - Free & Easy)

**Why Formspree?**
- Free tier: 50 submissions/month
- No backend required
- Automatic email notifications
- Easy setup (5 minutes)

### Setup Steps:

1. **Create Free Account**
   - Go to https://formspree.io
   - Sign up with your email (kate@thefirstspark.shop)

2. **Create New Form**
   - Click "New Form"
   - Name it "Sparkverse Email Signup"
   - Get your unique Form ID (looks like: `xpzyabcd`)

3. **Update index.html**
   - Open `index.html`
   - Find this line (around line 555):
     ```html
     action="https://formspree.io/f/YOUR_FORM_ID"
     ```
   - Replace `YOUR_FORM_ID` with your actual ID:
     ```html
     action="https://formspree.io/f/xpzyabcd"
     ```

4. **Test It**
   - Save the file
   - Push to GitHub
   - Wait 2 minutes for deployment
   - Visit your site and test the form

5. **Configure Formspree Dashboard**
   - Set email notifications to send to: kate@thefirstspark.shop
   - Enable reCAPTCHA to prevent spam
   - Customize auto-reply email (optional)

### What Happens:
1. User enters email and clicks "Enter Free"
2. Email is sent to Formspree
3. You receive notification at kate@thefirstspark.shop
4. User sees success message
5. User is redirected to tools.html

---

## Option 2: Netlify Forms (If using Netlify)

If you're deploying with Netlify (not GitHub Pages):

1. Add `netlify` attribute to form:
   ```html
   <form ... netlify netlify-honeypot="bot-field">
   ```

2. Netlify automatically captures submissions

---

## Option 3: Google Forms (Alternative)

1. Create a Google Form
2. Get the form action URL
3. Replace Formspree URL in index.html

---

## Option 4: Custom Backend

If you want full control, you can build a custom backend:
- Node.js + Express + Nodemailer
- Python + Flask
- Serverless function (AWS Lambda, Vercel Functions)

---

## Current Status

⚠️ **Email form is NOT configured yet**

When users try to submit, they'll see:
> "⚠️ Email signup not yet configured. Please contact kate@thefirstspark.shop to join!"

This is intentional - it prevents errors and directs users to contact you directly until you configure a service.

---

## Testing Checklist

After setup:
- [ ] Submit test email
- [ ] Verify you receive notification
- [ ] Check success message displays
- [ ] Test on mobile device
- [ ] Verify user is redirected to tools.html
- [ ] Check spam folder for notifications

---

## Troubleshooting

**Form not submitting?**
- Check Form ID is correct
- Ensure no typos in action URL
- Check browser console for errors

**Not receiving emails?**
- Check Formspree dashboard
- Verify email in Formspree settings
- Check spam folder

**Getting spam?**
- Enable reCAPTCHA in Formspree
- Add honeypot field

---

## Need Help?

- Formspree docs: https://help.formspree.io
- Contact me: claude-code (I helped build this!)
- Email issues: Check Formspree status page

---

## Mobile-Friendly Confirmation

✅ Your site IS mobile-friendly:
- Viewport meta tag configured
- Responsive CSS media queries
- Touch-friendly button sizes
- Mobile scrolling fixed
- Form stacks vertically on mobile

Test on your phone to verify!
