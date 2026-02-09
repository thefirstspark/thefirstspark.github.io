# CLAUDE.md - AI Assistant Guide for The First Spark

## Project Overview

**The First Spark** is a consciousness technology platform hosted as a static GitHub Pages site at `thefirstspark.shop`. It consists of 79+ standalone interactive HTML tools and two main landing pages targeting investors and members. There is no build step, no backend, and zero npm/pip/gem dependencies.

**Founder:** Katelin Jill Puzakulics
**Business Model:** Free tier / $33 per month / $519 lifetime access via Whop storefronts
**Domain:** `thefirstspark.shop` (configured via CNAME file)

---

## Architecture

### Zero-Build Static Site

This is a pure HTML/CSS/JS project deployed directly to GitHub Pages. There is:
- No package.json, Gemfile, or build configuration
- No bundler, transpiler, or preprocessor
- No CI/CD pipeline or automated tests
- No templating engine

**Deployment:** Push to `main` branch triggers automatic GitHub Pages deployment.

### Two-Page Core Architecture

| Page | Audience | Purpose |
|------|----------|---------|
| `index.html` | Investors | Pitch deck, traction metrics, $200K fundraise |
| `sparkverse.html` | Members | Tool hub, membership tiers, constellation UI |

### Supporting Pages

- `invest.html` and `invest/index.html` - Dedicated investment pages
- `presentation.html` - Pitch deck
- `playerslounge/index.html` - Players Lounge membership
- `privacy-policy.html`, `terms-of-service.html` - Legal pages
- 79+ standalone tool pages (e.g., `daily-reset.html`, `oracle.html`, `soul-map.html`)

---

## File Structure

```
thefirstspark.github.io/
├── index.html                 # Investor-focused homepage
├── sparkverse.html            # Member hub with constellation UI
├── main.css                   # Primary shared stylesheet (28KB)
├── style.css                  # Sparkverse-specific styles (20KB)
├── script.js                  # Shared JS: nav, modals, analytics (9KB)
├── invest.html                # Investment page
├── invest/
│   ├── index.html             # Alternative investment page
│   └── google-apps-script.js  # Investment form handler
├── playerslounge/
│   └── index.html             # Players Lounge membership
├── presentation.html          # Pitch deck
├── privacy-policy.html        # Privacy policy
├── terms-of-service.html      # Terms of service
├── assets/
│   └── images/
│       └── logo.png           # Brand logo
├── [79+ tool HTML files]      # Self-contained interactive tools
├── CNAME                      # Custom domain: thefirstspark.shop
├── robots.txt                 # SEO bot rules
├── sitemap.xml                # 100+ URLs for search engines
├── site.webmanifest           # PWA configuration
├── favicon.ico / .svg / .png  # Multi-format favicons
├── README.md                  # Project documentation
├── DEPLOYMENT-CHECKLIST.md    # Deployment guide
├── ASSET-PRIORITY-LIST.md     # Asset requirements
└── EMAIL-SETUP-GUIDE.md       # Formspree email integration
```

---

## Design System: Cosmic Brutalism

### Color Palette (CSS custom properties in `main.css`)

```
--electric-blue:   #00d4ff   (primary accent)
--neon-cyan:       #00ffff   (secondary accent)
--neon-magenta:    #ff00ff   (secondary accent)
--neon-gold:       #ffd700   (highlight)
--black:           #000000   (primary background)
--deep-space:      #0a0a1a   (secondary background)
--dark-navy:       #1a1a2e   (card backgrounds)
```

### Typography

- **Display/Headers:** Monospace (Courier New, JetBrains Mono)
- **Body:** System font stack (Segoe UI, Tahoma, Roboto)
- **Google Fonts used in tools:** Cormorant Garamond, DM Sans, Space Grotesk, Rajdhani, Cinzel

### Visual Conventions

- Dark backgrounds with neon accents throughout
- Glow effects via CSS `box-shadow` and `text-shadow`
- Sacred geometry symbols: `✦ ◇ ◆ ⚡`
- Geometric borders and dividers
- Minimal, purposeful CSS animations (pulse, fade, glow)
- `prefers-reduced-motion` respected

### Responsive Breakpoints

- Desktop: >1024px (multi-column grids)
- Tablet: 768px-1024px (adjusted grids)
- Mobile: <768px (single-column stacks)
- Small mobile: <480px (smallest screens)

---

## Coding Conventions

### HTML

- Semantic HTML5 with proper landmark elements
- Each tool page is a **self-contained single-page app** with inline `<style>` and `<script>` tags
- SEO meta tags on main pages: Open Graph, Twitter Card, Schema.org
- Google Analytics integrated (GA ID: `G-P8B1ERP8ML`)

### CSS

- CSS custom properties for theming (defined in `main.css` `:root`)
- Class names: **kebab-case** (e.g., `.hero-badge`, `.constellation-node`)
- IDs: **camelCase** (e.g., `#membershipModal`, `#starCanvas`)
- Mobile-first responsive approach
- No CSS frameworks or preprocessors

### JavaScript

- **Vanilla JS only** - no frameworks, no jQuery, no libraries
- Variable names: **camelCase**
- Event-driven patterns for navigation, modals, and tooltips
- Keyboard support (Escape to close modals)
- Canvas API for particle/constellation effects
- No module system - scripts are inline or loaded via `<script>` tags

### File Naming

- HTML pages: **kebab-case** (e.g., `daily-reset.html`, `soul-map.html`)
- All tool pages live at the **repository root** (no subdirectories)
- Subdirectories only for special sections: `invest/`, `playerslounge/`, `assets/`

---

## Development Workflow

### Making Changes

1. Edit HTML/CSS/JS files directly
2. Open in browser to test (no build step needed)
3. Commit and push to `main` for deployment

### Adding a New Tool Page

1. Create a new `.html` file at the repository root
2. Include inline `<style>` and `<script>` tags (self-contained pattern)
3. Follow the Cosmic Brutalism design system (dark background, neon accents)
4. Add a back-navigation link to `sparkverse.html`
5. Add the URL to `sitemap.xml`
6. Link the tool from `sparkverse.html` in the appropriate tier category

### Modifying Styles

- **Global styles:** Edit `main.css` (shared across main pages)
- **Sparkverse-specific:** Edit `style.css`
- **Tool-specific:** Edit the inline `<style>` within the tool's HTML file

### External Integrations

| Service | Purpose | Configuration |
|---------|---------|---------------|
| Google Analytics | User tracking | GA ID `G-P8B1ERP8ML` in page headers |
| Formspree | Email capture | Form action URLs in HTML |
| Whop | Payment/membership | Links to Whop storefronts |

### Whop Storefront URLs (preserve these)

- Free Lobby: `https://whop.com/sparkverse-511c/the-sparkverse-lobby/`
- Players Lounge: `https://whop.com/sparkverse-511c/the-players-lounge/`
- OG Spark: `https://whop.com/sparkverse-511c/og-spark-lifetime-access/`

---

## Important Constraints

### Do Not

- Introduce a build system, bundler, or package manager unless explicitly requested
- Add npm dependencies or external JS libraries without explicit approval
- Break the self-contained nature of tool pages (each tool is its own app)
- Change the CNAME file (domain configuration)
- Remove or alter Google Analytics tracking without permission
- Modify Whop storefront URLs without confirmation
- Change the Cosmic Brutalism design system (dark theme, neon accents) without direction

### Be Careful With

- **Large images:** The repo already has ~54MB of assets; optimize images before adding
- **SEO metadata:** Main pages have carefully crafted Open Graph/Twitter Card tags
- **Accessibility:** Maintain WCAG AA contrast, ARIA attributes, keyboard navigation
- **Tool interdependence:** Tools are designed to be standalone; avoid creating dependencies between them

---

## Testing

There are no automated tests. Manual testing approach:

1. Open changed pages directly in a browser
2. Test responsive layouts at 480px, 768px, and 1024px breakpoints
3. Verify links (especially Whop storefront and navigation links)
4. Check browser console for JavaScript errors
5. Validate HTML if making structural changes

---

## Key Files to Know

| File | Purpose | When to Edit |
|------|---------|-------------|
| `index.html` | Investor landing page | Updating metrics, pitch, CTAs |
| `sparkverse.html` | Member hub | Adding tools, changing tiers, constellation UI |
| `main.css` | Shared design tokens and styles | Changing colors, spacing, global layout |
| `style.css` | Sparkverse universe visualization | Constellation/galaxy UI changes |
| `script.js` | Navigation, modals, analytics | Shared interactivity changes |
| `sitemap.xml` | Search engine indexing | After adding/removing pages |
| `robots.txt` | Crawler configuration | Changing crawl rules |
| `CNAME` | Custom domain | Never (unless domain changes) |

---

## Contact

- **Founder:** Katelin Jill Puzakulics
- **Email:** kate@thefirstspark.shop
- **GitHub:** https://github.com/thefirstspark
- **Website:** https://thefirstspark.shop
