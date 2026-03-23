# CompraHogar — AI Assistant Context

**Client:** Internal (Chelabs-owned product)
**Purpose:** Headless e-commerce storefront for a Uruguayan home goods retailer. Shopify backend, custom Next.js frontend for full design control.
**Locale:** Spanish (es_UY) — all user-facing text is in Spanish.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React, Tailwind CSS v4, Radix UI, shadcn/ui | React 19.2.3 |
| Animations | Framer Motion | 12.x |
| Icons | Lucide React | 0.575.x |
| Data fetching | SWR (client), Server Components + Server Actions (server) | SWR 2.4.x |
| Commerce backend | Shopify Storefront GraphQL API | 2024-04 |
| Language | TypeScript (strict mode) | 5.x |
| Package manager | pnpm | — |
| Component scaffolding | shadcn CLI (New York style) | — |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages & API routes
│   ├── layout.tsx              # Root layout (Header, Footer, CartProvider, WishlistProvider)
│   ├── page.tsx                # Homepage (hero, categories, featured products)
│   ├── globals.css             # Tailwind v4 theme, custom properties, animations
│   ├── actions/                # Server Actions (collection, location, search)
│   ├── api/                    # Route handlers
│   │   ├── back-in-stock/      # Back-in-stock notifications
│   │   ├── newsletter/         # Newsletter signup
│   │   └── webhooks/           # Shopify webhooks (HMAC-verified)
│   ├── collections/            # Collection listing & [handle] detail
│   ├── products/               # All products & [handle] detail
│   ├── pages/[handle]/         # Dynamic CMS pages from Shopify
│   ├── search/                 # Search results page
│   ├── login/                  # Login + password recovery (recuperar/)
│   ├── registro/               # User registration
│   ├── cuenta/                 # User account dashboard
│   ├── recuperar-password/     # Password reset with token
│   ├── olvide-password/        # Forgot password flow
│   ├── sobre-nosotros/         # About us (static)
│   ├── envios-y-entregas/      # Shipping policy (static)
│   ├── devoluciones-y-garantias/ # Returns policy (static)
│   ├── terminos-y-condiciones/ # Terms & conditions (static)
│   ├── politica-privacidad/    # Privacy policy (static)
│   └── ui-test/                # UI component showcase (dev only)
│
├── components/
│   ├── layout/                 # Header, Footer, MegaMenu, MobileMenu, LocaleSwitcher
│   ├── cart/                   # CartProvider (Context + SWR), CartSheet (drawer)
│   ├── shop/                   # Product grid/carousel/view, filters, sorting, shipping calc, wishlist
│   ├── shared/                 # PredictiveSearch, InfoDrawer, ErrorFallback
│   ├── analytics/              # ProductPageTracker (GA4/GTM events)
│   └── ui/                     # shadcn/Radix primitives (button, input, modal, drawer, etc.)
│
├── hooks/
│   └── useStoreFilters.ts      # Filter state management hook
│
└── lib/
    ├── shopify.ts              # shopifyFetch<T>() — Storefront API GraphQL wrapper
    ├── queries.ts              # All GraphQL queries & mutations (products, cart, collections)
    ├── types.ts                # TypeScript interfaces for Shopify data models
    ├── customer.ts             # Customer auth mutations (create, login, password reset)
    ├── analytics.ts            # GA4 event types & pushDatalayerEvent()
    ├── reviews.ts              # Product reviews
    ├── utils.ts                # cn() helper (clsx + tailwind-merge)
    └── constants/
        └── collectionHierarchy.ts  # Category tree (7 top-level categories + subcategories)
```

---

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Production build
pnpm lint         # ESLint
```

---

## Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=<store>.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXXX          # Optional — Google Tag Manager
```

**Never commit `.env*` files.** The `.gitignore` already excludes them.

---

## Conventions

### Components
- **PascalCase** filenames: `ProductGrid.tsx`, `CartSheet.tsx`
- **Server Components by default** — only add `"use client"` when needed (event handlers, browser APIs, SWR, Context)
- **Never use raw HTML elements** — always use the `ui/` component equivalents (Button, Input, Modal, etc.)
- Shadcn style: New York variant, Lucide icons, CSS variables for theming

### Styling
- **Tailwind utility-first** — no custom CSS unless Tailwind can't handle it
- Theme colors defined in `globals.css` as CSS custom properties:
  - Primary: `brand-teal` (#21645d)
  - Secondary: `brand-orange` (#f3843e)
- Border radius: `rounded-lg` to `rounded-xl` for consistency
- Animations: `transition-all duration-300 ease-in-out`

### Data & State
- **Shopify queries** go in `lib/queries.ts` (GraphQL strings)
- **shopifyFetch()** in `lib/shopify.ts` handles all API calls with auth headers and error handling
- **SWR hooks** in `hooks/` folder, named `use[Resource].ts`
- **Server Actions** in co-located `actions.ts` files or `app/actions/`
- **Cart state** managed via React Context in `CartProvider.tsx`
- **Wishlist state** managed via `WishlistProvider.tsx`

### API Routes
- Pattern: `app/api/[route]/route.ts`
- Shopify webhooks verify HMAC-SHA256 signatures before processing
- Webhook handler triggers `revalidateTag()` for ISR cache invalidation

### TypeScript
- **Strict mode enabled** — honor it
- Path alias: `@/*` → `./src/*`
- Shopify types defined in `lib/types.ts`

### Auth
- Shopify Customer Account API
- Access tokens stored in cookies (`customerAccessToken`)
- Auth flows: login, register, password reset — all via Server Actions

### Analytics
- GA4/GTM integration via `ProductPageTracker` component and `pushDatalayerEvent()`
- GTM script injected in root layout when `NEXT_PUBLIC_GTM_ID` is set

---

## Key Architecture Decisions

- **No database** — Shopify is the single source of truth for products, collections, orders, and customers
- **No test framework yet** — tests not configured (Jest/Vitest recommended when added)
- **No CI/CD yet** — no GitHub Actions or deployment pipeline configured
- **No Prettier** — only ESLint (flat config, ESLint 9) with relaxed TypeScript rules
- **Image optimization** via Next.js `<Image>` — allowed domains: `cdn.shopify.com`, `images.unsplash.com`
- **Security headers** configured in `next.config.ts` (CSP, HSTS, X-Frame-Options, etc.)

---

## Do Not

- **Never commit credentials** — Shopify tokens, API keys go in `.env.local` only
- **Never use raw `<button>`, `<input>`, etc.** — use the `ui/` components
- **Don't add unnecessary abstractions** — keep it simple, this is a storefront
- **Don't change the Shopify API version** (2024-04) without verifying query compatibility
- **Don't remove security headers** from `next.config.ts`

---

## Current Status

**Implemented:**
- Full product catalog (listing, detail, search, filtering, sorting)
- Collection pages with faceted navigation
- Cart system (add, update, remove, discount codes, gift cards)
- User authentication (login, register, password reset)
- User account dashboard with order history
- Wishlist / favorites
- Mega menu navigation (desktop + mobile)
- Predictive search
- Shipping calculator & materials estimator
- GA4/GTM analytics tracking
- Shopify webhook handler with cache revalidation
- 30+ UI components (shadcn/Radix primitives)
- Static policy pages (shipping, returns, terms, privacy, about)
- SEO (metadata, sitemap, robots.txt, OG tags)
- Security headers (CSP, HSTS, etc.)

**Pending:**
- Checkout flow completion
- Deployment pipeline (CI/CD)
- Test suite setup
- Performance optimization / Lighthouse audit
- Design refinement (pending final designs)
