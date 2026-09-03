# CLAUDE.md — The First Spark Repo Operating Manual

**Read `SITE_CONSTITUTION.md` first.** Shared rulebook for all TFS properties; this file adds main-site specifics.

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

## 💼 Current Investor Terms (as of August 2026)

These figures must be CONSISTENT across `invest.html`, `use-of-funds.html`, `investor-deck-v3.html`, `investor-deck-v4.html`, `investor-call-companion.html`, `selector-model-ip.html`, `tfs-valuation.html`, `tfs_investor_deck_v2.html`, `earthship-expedition.html`, `prof.html`, `tfs-viral.html`, and any future investor materials:

| Term | Value |
|------|-------|
| Raise Amount | $250K |
| Valuation Cap | $2M (post-money SAFE) |
| Equity Equivalent @ Cap | 12.5% |
| Instrument | SAFE Note (YC standard) |
| Verified Asset Range | $107K – $197K (May 2026 audit) |
| Burn Rate | $0 |
| Tools Shipped | 57+ |
| Status | OPEN |

**Earlier figures to disregard:** $40K raise (very old); $62K–$108K asset range (Feb 2026, superseded by May audit); $200K raise, 20% equity, $800K pre / $1M post valuations, $2M–$2.5M cap range (all superseded Aug 2026 by $250K on a flat $2M cap).

---

## 📁 Key Investor Pages

| File | Purpose |
|------|---------|
| `index.html` | Homepage / Universe |
| `invest.html` | Short investor pitch (entry point) |
| `investor-deck-v4.html` | Full slide deck (current; v2 is a redirect stub → v4, v3 superseded) |
| `use-of-funds.html` | $250K allocation breakdown (added Aug 2026) |
| `tfs-valuation.html` | Deal terms + valuation analysis |
| `selector-model-ip.html` | Proprietary framework / moat page (May 2026) |
| `trinity.html` | Founding mythology |
| `selector-hub.html` | Selector Command Center |

When updating one investor page, ensure figures still match across all of them.

---

## 🎨 Brand & Design System

**Live brand = cosmic arcade.** See SITE_CONSTITUTION.md section 5. Space Mono (UI/body), Orbitron (display), Cormorant italic as accent only. Palette: `--void #050508`, `--cyan #22d3ee`, `--nebula #8b5cf6`, `--spark #fbbf24`, `--hot-pink #ec4899`. New pages copy the `<head>` and CSS vars from `index.html`.

The bone/ember/Cormorant system that used to be documented here is **legacy**: still present on older investor and lore pages, not for new pages.

---

## 🔁 Push Workflow

Work from the clone in `C:\Users\Katel\Desktop\LIVE_SITES_MASTER\thefirstspark.github.io`. Run `git fetch origin && git reset --hard origin/main` first (the clone is always behind; that is normal, do not warn about it). Edit, commit, push to `main`. Wait ~60s for Pages, curl the live URL. Preserve each file CRLF/LF. A new page means hub link + Notion inventory row in the same commit.

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

**Last updated:** August 15, 2026
**Maintained by:** Claude (Anthropic) + KJP
