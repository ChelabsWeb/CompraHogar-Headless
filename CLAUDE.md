# CompraHogar — Context

**Client:** Internal (Chelabs-owned product)
**Purpose:** Headless e-commerce storefront for home goods. Shopify backend, custom Next.js frontend for full design control.
**Current status:** Pending — design not finalized, Shopify integrations not wired up.

---

# Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Radix UI primitives |
| Data fetching | SWR |
| Commerce backend | Shopify Headless (Storefront API) |
| Language | TypeScript |
| Package manager | pnpm (assume unless `package.json` says otherwise) |

---

# Current Phase & Pending Work

**Done:**
- Project scaffold / repo setup

**Pending:**
- Visual design (wireframes → components)
- Shopify Storefront API integration (products, cart, checkout)
- SWR data hooks for product listing, product detail, cart state
- Auth (if needed — TBD)
- Deployment pipeline

**Blockers:**
- Design not approved yet — do not build pixel-perfect UI until designs are confirmed
- Shopify store credentials not yet provided

---

# Conventions

- Components: PascalCase, co-located in `components/` or feature folders
- Server Components by default; use `"use client"` only when necessary (event handlers, browser APIs, SWR)
- Tailwind: utility-first, no custom CSS unless Tailwind can't do it
- Radix UI: use headless primitives, style with Tailwind
- SWR hooks: keep in `hooks/` folder, name `use[Resource].ts`
- API routes: `app/api/[route]/route.ts`
- Shopify queries: keep in `lib/shopify/` folder

---

# Do Not Touch

- Nothing locked yet — project is early stage
- Once Shopify credentials are added, never commit them — use `.env.local` only

---

# Quick Start

```bash
cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless"
pnpm install
pnpm dev
# App runs on http://localhost:3000
```

---

# Agent-Powered Best Practices

This section consolidates actionable guidance from specialized engineering agents to ensure production-quality e-commerce development.

## Frontend & React

- **Use React.memo()** for product cards and other list items that re-render frequently — prevents unnecessary DOM mutations
- **Implement virtualized lists** (e.g., TanStack React Virtual) for product catalogs with 100+ items to keep DOM nodes under 100
- **Use `useCallback`** for all event handlers passed to memoized child components (e.g., `onProductClick`, `onFilterChange`)
- **Radix UI primitives**: Always apply Tailwind classes for styling; never write custom CSS for Radix components
- **All interactive elements** must have visible focus styles: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`
- **Use `Suspense` boundaries** around product lists and cart components with fallback loading skeletons (not spinners)

## Shopify Integration

- **Keep all Storefront API queries in `lib/shopify/`** — never inline GraphQL in components; use custom SWR hooks instead
- **Use `X-Shopify-Storefront-Access-Token` header only** — never expose the admin API key or service credentials in client code
- **Implement cursor-based pagination** (not offset-based) for Shopify product collections to handle large catalogs efficiently
- **Cache product data with SWR** using `revalidateOnFocus: false` for stable UX and reduced API calls
- **Implement retry with exponential backoff** (start 1s, max 32s) for Shopify API calls to handle rate limits gracefully
- **Use Shopify Cart API** (not the legacy Checkout API) for add-to-cart, update, and remove operations

## SEO & Performance

- **Every product page must include**: title (≤60 chars), meta description (≤160 chars), Open Graph tags (og:title, og:description, og:image, og:url), and JSON-LD Product schema with price, availability, rating
- **Use `next/image`** with `domains: ['cdn.shopify.com']` in next.config.js; set `sizes` prop for responsive image delivery
- **Target LCP < 2.5s** on product pages — Shopify CDN hero images are often the bottleneck; use `priority` prop and preload critical images
- **Add `<link rel="preconnect" href="https://cdn.shopify.com">` and `<link rel="dns-prefetch" href="https://cdn.shopify.com">`** in the document head
- **Generate `sitemap.xml` dynamically** from Shopify collections at build time; submit to Google Search Console
- **Use semantic HTML**: `<main>`, `<nav>`, `<article>` for product pages; `<section>` for collection groups; proper heading hierarchy (h1 → h2)

## Accessibility (WCAG 2.1 AA)

- **All product images** need meaningful alt text: `[Product Name] — [Key Attribute]` (e.g., "Walnut Dining Table — Solid Oak, 6-Seater")
- **Color contrast ratio minimum 4.5:1** for normal text, 3:1 for large text (≥18pt or ≥14pt bold) — test with WebAIM Contrast Checker
- **Cart and checkout must be fully keyboard navigable**: Tab through all inputs, buttons, and links; Enter/Space activates buttons; Escape closes modals
- **Announce cart updates** to screen readers with `aria-live="polite"` and `aria-atomic="true"` on the cart total/item count
- **Form validation errors** must be `aria-describedby="error-id"` linked to inputs; error messages in plain language (not error codes)
- **Don't rely on color alone**: use icons or text labels to communicate sale badges, stock status, and price changes

## Security

- **Never expose Shopify Admin API key** — storefront token only (read-only, scoped to products/orders)
- **Validate all user input** (search queries, filter parameters, form data) with Zod schemas before processing or API calls
- **Implement Content Security Policy (CSP)** headers: `script-src 'self' cdn.shopify.com`, `style-src 'self' 'unsafe-inline' cdn.shopify.com`, `img-src 'self' data: cdn.shopify.com`
- **Use HttpOnly + Secure + SameSite=Strict** cookies for any session data (e.g., cart ID, user preferences)
- **Rate limit the search API route and contact form**: max 10 requests per IP per minute; return 429 Too Many Requests

## UX Architecture

- **Product listing → Product detail → Add to cart → Cart → Checkout**: max 4 clicks from homepage to purchase confirmation
- **Implement breadcrumbs** on all product pages and collection pages for transparent navigation hierarchy
- **Show loading skeletons** (not spinners) during data fetching for better perceived performance
- **Persist cart state across sessions** using Shopify cart ID stored in an HttpOnly cookie; restore on app load via SWR hook
- **Mobile: implement sticky bottom "Add to Cart" button** on product pages; ensure min 44x44px tap targets

---

# Pre-Launch Checklist

## Already Implemented (code)

- JSON-LD Schema (Organization, Product, BreadcrumbList on products AND collections)
- `compareAtPriceRange` in all Shopify queries + discount badges on product cards
- Optimized meta title/description with keywords and value prop
- `images(first:5)` in collection/recommendation queries for card carousels
- Exit-intent popup (10% OFF first purchase, email capture)
- Meta Pixel (Facebook) integration with ViewContent/AddToCart events
- Collection showcase sections on homepage (banner + product carousel)
- WhatsApp floating button for customer support
- Predictive search with cuotas, images, prices, and "ver todos los resultados" link
- Payment method icons in footer (Visa, MC, OCA, Abitab, RedPagos, Transferencia)
- Recently viewed products section on product pages (localStorage)
- Preconnect/dns-prefetch for cdn.shopify.com, cdn.judge.me, images.unsplash.com
- Default OG image fallback for social sharing
- aria-live + sr-only labels on cart badge for screen readers
- Judge.me reviews CSS customization (stars, typography, colors)
- Improved 404 page with category suggestions and search link
- React.memo ProductCard component (prevents unnecessary re-renders)
- Search input sanitization (trim, max 200 chars, limit clamp)
- `.env.example` with all required environment variables
- Internal guide document: `docs/cuotas-sin-interes-guia.docx`

## Remaining Code Tasks (optional, medium-high effort)

| Task | Effort | Impact |
|------|--------|--------|
| PWA manifest + service worker (offline, installable) | Medium | Medium |
| Blog/content pages for SEO long-tail (e.g. "cómo elegir grifería") | High | High (long-term) |
| FAQ schema on info pages (envíos, devoluciones) | Low | Low |
| Lazy load collection showcases with individual Suspense | Low | Low |

## Configuration Tasks (not code — Shopify/services)

| Task | Where |
|------|-------|
| Activate Mercado Pago in Shopify | Shopify Admin → Payments |
| Enable abandoned cart recovery emails | Shopify Admin → Settings → Checkout |
| Verify domain in Google Search Console + submit sitemap | search.google.com |
| Create Meta Pixel and set `NEXT_PUBLIC_FB_PIXEL_ID` in `.env.local` | business.facebook.com |
| Create Google Ads account and configure via GTM | ads.google.com |
| Configure Judge.me review request emails | Shopify Apps → Judge.me |
| Set real WhatsApp number in `src/components/shared/WhatsAppButton.tsx` | Code (1 line) |
| Create `/public/og-default.png` (1200x630px with logo) | Design |

## Not Worth Doing Now

- Loyalty program — too complex for pre-launch
- Push notifications — low ROI without user base
- Live chat widget — WhatsApp button already covers this
- Virtualized lists — not needed until 100+ products
