# CLAUDE.md — The First Spark Repo Operating Manual

**Read this before every action. Source of truth for Claude pushing to this repo.**

---

## 🚨 CRITICAL — Branch Rules

This repo has **TWO branches with different content**:

- **`main`** ← **THE SERVED BRANCH** — push ALL site changes here
- **`master`** ← stale / legacy, do NOT push site updates here

GitHub Pages serves from **`main`**. Pushing to `master` will commit successfully but the live site will NOT update. This bit us on 5/15/2026 — don't repeat it.

**Default branch for any file in this repo: `main`.**

Other repos use different defaults:
- `thefirstspark/soul-maps` → `master` (soul map HTML files)
- `thefirstspark/family` → `main`

---

## 🌐 Domain & Hosting

- **Live site:** https://thefirstspark.shop
- **Hosting:** GitHub Pages → Fastly CDN
- **Propagation:** ~30–90 seconds after push (Pages build + CDN cache)
- **Verify deploy worked:** open `https://thefirstspark.shop/{filename}.html` in a private/incognito window or hard-refresh (Cmd+Shift+R)
- If still 404 after 2 minutes → check that the file is on `main`, not `master`

---

## 💼 Current Investor Terms (as of May 2026)

These figures must be CONSISTENT across `invest.html`, `theraise.html`, `investor-deck-v2.html`, `selector-model-ip.html`, and any future investor materials:

| Term | Value |
|------|-------|
| Raise Amount | $200K |
| Equity Offered | 20% |
| Pre-Money Valuation | $1M (implied) |
| Instrument | SAFE Note (YC standard) |
| Verified Asset Range | $107K – $197K (May 2026 audit) |
| Burn Rate | $0 |
| Tools Shipped | 57+ |
| Status | OPEN |

**Earlier figures to disregard:** $40K raise (very old), $62K–$108K asset range (Feb 2026, superseded by May audit which added Selector Model IP + Sora + Zora + Soul Map Engine).

---

## 📁 Key Investor Pages

| File | Purpose |
|------|---------|
| `index.html` | Homepage / Universe |
| `invest.html` | Short investor pitch (entry point) |
| `theraise.html` | Full deal terms + asset inventory |
| `investor-deck-v2.html` | Full slide deck |
| `selector-model-ip.html` | Proprietary framework / moat page (May 2026) |
| `trinity.html` | Founding mythology |
| `selector-hub.html` | Selector Command Center |

When updating one investor page, ensure figures still match across all of them.

---

## 🎨 Brand & Design System

**Voice:**
- Direct, declarative, no fluff
- Italic emphasis on power words (em tags styled gold/ember)
- Numbered section markers (001 — Section Name)
- JetBrains Mono for micro-labels and metadata
- Cormorant Garamond for body and headlines
- "Not a pitch deck fairytale" energy — own the realness

**Color palette (CSS vars):**
```css
--void: #05060a;        /* primary bg */
--void-2: #0a0c14;      /* secondary bg */
--bone: #f4ede0;        /* primary text */
--ember: #ff5a1f;       /* accent — primary */
--gold: #ffc857;        /* accent — italic emphasis */
--plasma: #7df9ff;      /* accent — info/data */
--violet: #b794ff;      /* accent — secondary */
--ash: #6b6a6e;         /* muted text */
--line: rgba(244, 237, 224, 0.12);  /* borders */
```

**Typography:**
- Headlines: Cormorant Garamond, weight 300, italic for emphasis
- Body: Cormorant Garamond, weight 300–400
- Micro/labels: JetBrains Mono, 10–11px, uppercase, letter-spacing 0.3em–0.4em

**Layout patterns:**
- Numbered section labels (e.g., "003 — The Architecture")
- Grid-based with hairline borders (var(--line))
- Sticky nav with backdrop-filter blur
- Status badges with pulsing ember dots
- SVG diagrams over images when possible

---

## 🔁 Push Workflow (Claude via Zapier)

1. Determine the right repo and branch (`main` for site, `master` for soul maps).
2. Read CLAUDE.md first (this file). Do not skip.
3. Build the file content.
4. Push via `github_create_or_update_file` tool.
5. **Verify** by checking the branch listing — confirm latest commit landed where intended.
6. Wait ~60s for Pages + CDN. Test live URL.
7. If 404 after 2 min → check branch (most common cause).

**Never paste GitHub PATs in chat.** Zapier MCP connector handles auth.

---

## 🖨 Printable Documents

- **Solid WHITE background only.** Kate prints these — ink conservation matters.
- No dark backgrounds, gradients, or heavy graphics on printables.

---

## 🧭 The Selector Model (Brand IP)

Reference framework in product copy, investor materials, and tool design:

- **Philosophy:** "Reality is programmable. Consciousness is the code."
- **Four Layers:** Physics (L01) · Metaphysical (L02) · Relational (L03) · Temporal (L04)
- **Three Verbs:** SELECT · RELEASE · WITNESS
- **Zero Point:** AZURA (the selector / center)

---

## 📞 Founder Contact

- Email: kate@thefirstspark.shop
- Phone: (330) 807-5509
- Socials: X @OGplayerone · IG/YouTube @therealfirstspark · TikTok/FB @sparkedone
- Zora: zora.co/@sprkvrs (live creator coin)
- Press: Voyage Ohio "Hidden Gems" (March 2026)

---

**Last updated:** May 15, 2026
**Maintained by:** Claude (Anthropic) + KJP
