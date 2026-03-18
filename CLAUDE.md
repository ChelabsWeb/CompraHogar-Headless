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
