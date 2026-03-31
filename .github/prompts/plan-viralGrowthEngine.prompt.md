# Plan: The First Spark — Viral Growth Engine

## TL;DR
Turn 60+ existing consciousness tools into a viral growth machine by adding share mechanics to flagship experiences, building a referral engine, weaponizing the founder story as the homepage hero, and creating social proof loops — all achievable with code changes to the existing static site.

---

## Phase 1: Share Everything (Viral Mechanics on Flagship Tools)
*Goal: Every tool interaction becomes a shareable moment*

1. **Archetype Discovery → Shareable Card** — Add "Share Your Card" button to archetype-card.html that generates a screenshot-ready image (html2canvas) + copy-link + share to Twitter/Facebook/WhatsApp. Include site URL watermark on card. This is the #1 viral asset — Myers-Briggs energy.
   - Files: `archetype-card.html`, `archetype-discovery.html`

2. **Soul Map → "My Inner Landscape" Share** — After completing soul map, add export-as-image button with branded template. "This is my soul map. Discover yours at thefirstspark.com"
   - Files: `soul-map.html`

3. **Battle Arena → Challenge a Friend** — Generate unique challenge links. "I scored X. Can you beat me?" Share via link/SMS/social. This is the Wordle mechanic.
   - Files: `spark-battle-arena.html`

4. **Daily Reset → Streak Badge** — After completing daily reset, show streak count badge. "Day 7 streak" shareable graphic.
   - Files: `daily-reset.html`

5. **Karma Calculator → Karma Score Card** — Shareable karma score with visual design.
   - Files: `karma-calculator.html`

## Phase 2: The Hook (Homepage & Landing Redesign)
*Goal: First 5 seconds tell the story that makes people stay and share*

6. **Homepage Hero Overhaul** — Replace investor-focused index.html with a split-audience landing: Lead with founder story (cold case → consciousness framework), immediate CTA to try the Archetype Quiz (zero friction), social proof counter ("X archetypes discovered"), and secondary paths for investors/members.
   - Files: `index.html`

7. **Viral Landing Page** — Create a dedicated quiz landing page optimized for social traffic. URL: `/discover` or repurpose `tfs-viral.html`. Single purpose: take the Archetype Discovery quiz → get card → share card → friends take quiz. No other navigation distractions.
   - Files: `tfs-viral.html` (repurpose)

8. **Open Graph / Social Cards** — Every shareable page needs custom og:image, og:title, og:description optimized for social previews. The archetype card itself should be the og:image when sharing a result.
   - Files: All tool HTML files

## Phase 3: The Loop (Referral & Growth Engine)
*Goal: Every user brings 1+ new users*

9. **Referral System** — Build a simple referral tracker using URL params (?ref=CODE). Track referrals in localStorage + optional backend. Reward: unlock exclusive archetype cards, bonus tools, or "Spark Recruiter" badge. No payment needed — gamified rewards.
   - Files: New `referral.js`, modifications to `script.js`

10. **Email Capture Lead Magnet** — Create "Consciousness Starter Kit" — a free mini-experience (3 tools: Energy Check-In → Archetype Quiz → Daily Reset) that requires email to save results. Use a simple form posting to a service (Formspree, EmailJS, or the existing Google Apps Script).
    - Files: New landing flow, `invest/google-apps-script.js` (extend)

11. **"Invite to Battle" Flow** — After any Battle Arena match, prominent "Challenge a friend" that generates a pre-filled SMS/WhatsApp/email with battle link.
    - Files: `spark-battle-arena.html`

## Phase 4: Social Proof & Trust
*Goal: Show momentum, build credibility*

12. **Live Counter** — Add a lightweight counter to the homepage showing total archetype quizzes taken, battles fought, daily resets completed. Can be localStorage-aggregated or use a simple counter API.
    - Files: `index.html`, tool pages

13. **Testimonial Carousel** — Create 5-10 testimonial cards (from real users or founder journey moments). Rotating display on homepage and tools page.
    - Files: `index.html`, `tools.html`

14. **"As Seen In" / Press Kit** — Even without press coverage, create a press-ready section. Founder story is press-worthy (cold case + consciousness tech). Prepare a press kit page.
    - Files: New `press.html` or section in `index.html`

## Phase 5: Content & Distribution
*Goal: Meet people where they are*

15. **TikTok/Reels Content Templates** — Create 3-5 shareable video concepts that members can replicate:
    - "What's your archetype?" quiz reveal
    - "Day X of my consciousness reset" streak
    - "I challenged my friend to a Spark Battle" reaction
    - Founder story cold open
    - Document these as a "Creator Kit" page

16. **SEO & Discoverability** — Add proper meta descriptions, structured data, and a blog/content section for organic search. Target: "consciousness tools," "archetype quiz," "spiritual personality test"
    - Files: All HTML files, `sitemap.xml`, `robots.txt`

17. **Book Zero Excerpt** — Publish Chapter 1 of the founder memoir as free content. End with CTA to join Sparkverse. The story IS the marketing.
    - Files: `mythos/` directory (extend)

---

## Relevant Files
- `archetype-card.html` / `archetype-discovery.html` — #1 viral asset, add share mechanics
- `spark-battle-arena.html` — #2 viral asset, add challenge links
- `soul-map.html` — #3 viral asset, add export/share
- `daily-reset.html` — Streak badge sharing
- `karma-calculator.html` — Score card sharing
- `index.html` — Homepage overhaul (founder story hero + quiz CTA)
- `tfs-viral.html` — Repurpose as viral quiz landing page
- `script.js` — Core JS, add referral tracking + share utilities
- `tools.html` — Add social proof + share buttons
- `invest/google-apps-script.js` — Extend for email capture
- `style.css` / `main.css` — Shared styles for new components
- `sitemap.xml` — Update with new pages

## Verification
1. Share flow test: Complete archetype quiz → share to Twitter → verify og:image renders correctly in Twitter Card Validator
2. Challenge link test: Generate battle challenge → open in incognito → verify opponent can play
3. Referral tracking test: Visit with ?ref=TEST → complete quiz → verify referral logged
4. Mobile responsiveness: All share buttons and new components work on mobile
5. Page speed: Verify html2canvas and share mechanics don't degrade load time (Lighthouse audit)
6. Social preview: Test all og:meta tags with Facebook Sharing Debugger + Twitter Card Validator
7. Email capture: Submit form → verify email arrives in destination
8. Cross-browser: Test share mechanics in Chrome, Safari, Firefox, mobile browsers

## Decisions
- **Archetype Quiz is the viral spearhead** — it has the highest viral coefficient (quiz → card → share → friends take quiz)
- **No backend required for Phase 1-2** — all client-side with localStorage + URL params
- **Referral rewards are gamified, not monetary** — exclusive cards/badges, not discounts (fits brand)
- **Homepage shifts from investor-first to user-first** — investors get a clear secondary path
- **Scope boundary**: This plan covers code changes to the static site only. Paid ads, influencer partnerships, and third-party platform strategy (TikTok account management) are excluded.

## Further Considerations
1. **Counter persistence** — For live counters, a simple free service like CountAPI or a Cloudflare Worker would give real numbers across users. Alternatively, localStorage gives per-device counts (less impressive but zero infrastructure). Recommend: start with localStorage, upgrade to CountAPI.
2. **User accounts** — Phase 1-4 works without accounts. For Phase 5+ (streaks across devices, collections, leaderboards), you'd need authentication. Could use Whop's existing auth or add a lightweight solution like Supabase.
3. **A/B testing the homepage** — The current investor landing vs. the proposed quiz-first landing should be testable. Could use URL paths (/invest vs /) or a simple cookie-based split.
