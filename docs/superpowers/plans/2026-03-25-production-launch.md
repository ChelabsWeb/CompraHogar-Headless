# CompraHogar — Production Launch Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take CompraHogar from ~65% to 100% production-ready, fixing all blockers, completing all integrations promised in the investor document, setting up the alquiler category in Shopify, and deploying to production.

**Architecture:** Shopify Headless (Storefront API + Admin API) with custom Next.js 16 frontend on Vercel. All commerce (products, payments, orders) handled by Shopify. Frontend consumes GraphQL API. Reviews via Judge.me widget scripts. Analytics via GTM + GA4.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Shopify Storefront/Admin API, Vercel, GTM/GA4, Judge.me

---

## File Map

### Files to Modify
- `src/app/api/webhooks/route.ts` — Fix TS errors, implement order webhook handler
- `src/lib/reviews.ts` — Connect to Judge.me API or remove server-side abstraction
- `src/app/layout.tsx` — Verify Judge.me scripts and CSP for Judge.me CDN
- `src/app/page.tsx` — Dynamic Deal of the Day, fix hardcoded categories
- `src/components/shop/ProductView.tsx` — Verify Judge.me widget renders correctly
- `next.config.ts` — Add Judge.me CDN to CSP
- `src/lib/constants/collectionHierarchy.ts` — Expand alquiler subcategories
- `.env.local` — Add GTM_ID, SITE_URL
- `package.json` — Add Vitest for testing

### Files to Create
- `vitest.config.ts` — Vitest configuration
- `src/__tests__/lib/analytics.test.ts` — Analytics helper tests
- `src/__tests__/lib/shipping.test.ts` — Shipping rates tests
- `src/app/sitemap.ts` — Dynamic sitemap for SEO
- `src/app/robots.ts` — Robots.txt for SEO

---

## Phase 1: Fix Build & TypeScript Blockers

### Task 1: Fix Next.js build crash (exit code 143)

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json`

The build worker crashes with exit code 143 (killed/OOM). This is likely due to Next.js 16 SSG trying to generate too many pages or a memory-heavy page.

- [ ] **Step 1: Attempt build with increased memory**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && NODE_OPTIONS="--max-old-space-size=4096" pnpm build 2>&1 | tail -40`
Expected: Either succeeds or gives a more specific error

- [ ] **Step 2: If OOM persists, identify problematic pages**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && NODE_OPTIONS="--max-old-space-size=4096" pnpm build 2>&1 | grep -E "error|Error|FAIL|crash|exit"`

Look for pages that fail during generation. Common culprits:
- Dynamic pages fetching too much data at build time
- Product pages trying to pre-render all products

- [ ] **Step 3: Add build memory to package.json scripts**

In `package.json`, update the build script:
```json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

- [ ] **Step 4: If specific pages cause OOM, add dynamic rendering**

For pages that fetch large datasets, add at the top of the page:
```typescript
export const dynamic = 'force-dynamic';
```

- [ ] **Step 5: Verify clean build**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm build`
Expected: Build completes successfully

- [ ] **Step 6: Commit**

```bash
git add package.json next.config.ts
git commit -m "fix: resolve build crash (exit code 143) by increasing Node memory"
```

---

### Task 2: Fix TypeScript errors in webhooks

**Files:**
- Modify: `src/app/api/webhooks/route.ts`

The explore agent reported 3 TS errors in the webhook route related to `revalidateTag`. The code already has a wrapper `revalidate()` function — need to verify all calls use it.

- [ ] **Step 1: Run TypeScript check**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && npx tsc --noEmit 2>&1 | head -30`
Expected: See the exact errors

- [ ] **Step 2: Fix any direct revalidateTag calls**

All calls should use the wrapper:
```typescript
// Line 6 - wrapper already exists:
const revalidate = (tag: string) => _revalidateTag(tag, { expire: 0 });

// Ensure ALL usages are: revalidate('products'), NOT: _revalidateTag('products')
```

- [ ] **Step 3: Verify TypeScript passes**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/api/webhooks/route.ts
git commit -m "fix: resolve TypeScript errors in webhook route"
```

---

## Phase 2: Integrations

### Task 3: Activate GTM/Analytics

**Files:**
- Modify: `.env.local`

GTM code is already implemented in `src/app/layout.tsx` (lines 57-73) and analytics events in `src/lib/analytics.ts`. The only missing piece is the environment variable.

- [ ] **Step 1: Ask user for their GTM Container ID**

The GTM ID must be provided by the user. Format: `GTM-XXXXXXX`.
Also need the production site URL for canonical URLs and sitemap.

- [ ] **Step 2: Add env vars to .env.local**

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_SITE_URL=https://comprahogar.com.uy
```

- [ ] **Step 3: Verify GTM loads in dev**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm dev`
Open browser, check Network tab for `gtm.js` request.
Expected: GTM script loads successfully

- [ ] **Step 4: Verify analytics events fire**

Navigate to a product page, open browser console, type `window.dataLayer`.
Expected: Array with `view_item` event containing product data

- [ ] **Step 5: Verify .env.local is in .gitignore**

Run: `grep "\.env\.local" .gitignore`
Expected: `.env.local` is listed. NEVER commit this file — it contains secrets.

Note: Environment variables for production should be set in Vercel dashboard, not committed to git.

---

### Task 4: Implement order webhook handler

**Files:**
- Modify: `src/app/api/webhooks/route.ts:46-48`

The current `handleOrderWebhook` is an empty stub. We need to implement basic order processing. Since Shopify handles all payment confirmations and order emails natively, what we need here is cache revalidation so the customer's order history updates immediately.

- [ ] **Step 1: Implement handleOrderWebhook**

In `src/app/api/webhooks/route.ts`, replace the empty function:

```typescript
async function handleOrderWebhook(topic: string, payload: ShopifyOrderPayload, shopDomain: string) {
  // Revalidate order-related caches so customer dashboards reflect new orders immediately
  revalidate('orders');
  revalidate('customers');

  console.log(`[Webhook] Order event: ${topic} for order ${payload.id || 'unknown'} from ${shopDomain}`);
}
```

- [ ] **Step 2: Verify the ShopifyOrderPayload type exists**

Check that the type is defined at the top of the file. If not, add:
```typescript
interface ShopifyOrderPayload {
  id: number;
  email: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string | null;
  [key: string]: unknown;
}
```

- [ ] **Step 3: Verify TypeScript passes**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/api/webhooks/route.ts
git commit -m "feat: implement order webhook handler with cache revalidation"
```

---

### Task 5: Complete Judge.me reviews integration

**Files:**
- Modify: `next.config.ts` — Add Judge.me CDN to CSP
- Modify: `src/app/layout.tsx` — Verify scripts
- Modify: `src/components/shop/ProductView.tsx` — Verify widget div

Judge.me works via client-side widgets: the `widget_preloader.js` and `installed.js` scripts are already loaded in layout.tsx (lines 74-82). The ProductView already has the widget div (lines 618-626). The main issue is likely CSP blocking Judge.me resources.

- [ ] **Step 1: Add Judge.me domains to CSP**

In `next.config.ts`, update the CSP header values:

```typescript
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://ajax.googleapis.com https://cdn.judge.me",
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.judge.me",
"img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://cdn.judge.me https://judgeme-public-images.imgix.net",
"connect-src 'self' https://*.shopify.com https://*.myshopify.com https://www.google-analytics.com https://*.googleapis.com https://judge.me https://cache.judge.me",
"frame-src 'self' https://www.googletagmanager.com https://judge.me",
```

- [ ] **Step 2: Verify Judge.me widget renders**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm dev`
Navigate to a product page. Check browser console for CSP errors.
Expected: Judge.me widget loads and shows review form

- [ ] **Step 3: Remove unused server-side reviews abstraction**

The `src/lib/reviews.ts` file and `src/components/shop/VendorReviews.tsx` are dead code since we're using Judge.me's client-side widget. Delete them:

```bash
rm src/lib/reviews.ts
rm src/components/shop/VendorReviews.tsx
```

Verify no imports reference them:
Run: `grep -r "reviews" src/ --include="*.ts" --include="*.tsx" -l`
Remove any dead imports.

- [ ] **Step 4: Verify Judge.me requires store setup**

Judge.me needs to be installed as a Shopify app. Verify:
1. Go to Shopify Admin → Apps → Judge.me Product Reviews
2. If not installed, install the free plan
3. The widget should auto-populate with the store's domain

- [ ] **Step 5: Commit**

```bash
git add next.config.ts src/
git commit -m "feat: complete Judge.me reviews integration with CSP fixes"
```

---

### Task 6: Dynamic Deal of the Day

**Files:**
- Modify: `src/app/page.tsx:150-183`

Replace the hardcoded deal with a dynamic product from Shopify. Strategy: fetch a product from a special collection called `oferta-del-dia` that the store owner manages from Shopify admin.

- [ ] **Step 1: Add GraphQL query for deal product**

In `src/lib/shopify.ts`, add a query to fetch the first product from the "oferta-del-dia" collection:

```typescript
export async function getDealOfTheDay() {
  const query = `
    query getDealOfTheDay {
      collectionByHandle(handle: "oferta-del-dia") {
        products(first: 1) {
          edges {
            node {
              id
              title
              handle
              featuredImage {
                url
                altText
              }
              compareAtPriceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query, tags: ['products'] });
  const product = response.body?.data?.collectionByHandle?.products?.edges?.[0]?.node;
  return product || null;
}
```

- [ ] **Step 2: Update homepage to use dynamic deal**

In `src/app/page.tsx`:

First, change the component to async: `export default async function Home()`.

Then, at the top of the function body (before the return), add:

```typescript
const deal = await getDealOfTheDay();
const dealPrice = deal ? parseFloat(deal.priceRange.minVariantPrice.amount) : 0;
const dealOriginalPrice = deal?.compareAtPriceRange?.maxVariantPrice
  ? parseFloat(deal.compareAtPriceRange.maxVariantPrice.amount)
  : null;
const dealDiscount = dealOriginalPrice ? Math.round((1 - dealPrice / dealOriginalPrice) * 100) : null;
```

Then, replace the hardcoded deal section (lines 150-183) with:

```typescript
{/* SECTION: Oferta del Día */}
{deal && (
  <div className="mt-8">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900">Oferta del día</h2>
      <Link href="/collections/oferta-del-dia" className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">Ver todas</Link>
    </div>
    <Link href={`/products/${deal.handle}`} className="block bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 transition-all cursor-pointer group">
      <div className="flex flex-row items-stretch min-h-[140px] lg:min-h-[220px]">
        <div className="w-[140px] sm:w-[180px] md:w-1/2 relative bg-slate-50 flex items-center justify-center shrink-0">
          {dealDiscount && (
            <Badge className="absolute top-2 left-2 z-10 bg-secondary text-white border-none font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
              -{dealDiscount}%
            </Badge>
          )}
          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
            <Image
              src={deal.featuredImage?.url || '/placeholder.png'}
              alt={deal.featuredImage?.altText || deal.title}
              fill
              className="object-contain p-3"
              sizes="(max-width: 768px) 140px, 50vw"
            />
          </div>
        </div>
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col justify-center">
          <h3 className="text-[13px] md:text-[15px] lg:text-lg text-slate-700 font-medium leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">{deal.title}</h3>
          {dealOriginalPrice && (
            <span className="text-[11px] text-slate-400 line-through font-medium">$ {dealOriginalPrice.toLocaleString()}</span>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[22px] sm:text-[26px] lg:text-[32px] font-normal text-slate-900 leading-none tracking-tight">$ {dealPrice.toLocaleString()}</span>
          </div>
          {dealPrice >= 4000 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-[11px] text-[#00a650] font-bold">
                <Truck className="w-3 h-3 mr-1" /> Envío gratis
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  </div>
)}
```

Note: The component MUST be `async function Home()` (not regular function) since it uses `await`. If the collection doesn't exist in Shopify, `deal` is null and the section hides gracefully.

- [ ] **Step 3: Create "oferta-del-dia" collection in Shopify**

In Shopify Admin:
1. Go to Products → Collections → Create collection
2. Handle: `oferta-del-dia`
3. Title: "Oferta del Día"
4. Add 1 product with a compare-at price (so discount shows)

- [ ] **Step 4: Verify on dev**

Run: `pnpm dev`, check homepage.
Expected: Deal section shows the product from the collection, or hides if collection is empty.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shopify.ts src/app/page.tsx
git commit -m "feat: dynamic Deal of the Day from Shopify collection"
```

---

## Phase 3: Alquileres in Shopify

### Task 7: Expand alquiler subcategories and create Shopify products

**Files:**
- Modify: `src/lib/constants/collectionHierarchy.ts:52-55`

- [ ] **Step 1: Expand alquiler subcategories**

Update `collectionHierarchy.ts`:

```typescript
"servicios-y-alquileres": [
  { name: "Alquiler de Maquinaria", handle: "alquiler-de-maquinaria" },
  { name: "Andamios y Estructuras", handle: "andamios-y-estructuras" },
  { name: "Herramientas Especializadas", handle: "herramientas-especializadas-alquiler" },
  { name: "Fletes y Transporte", handle: "fletes-y-transporte" },
  { name: "Servicios de Mano de Obra", handle: "servicios-mano-de-obra" },
  { name: "Contenedores y Limpieza", handle: "contenedores-y-limpieza" },
]
```

- [ ] **Step 2: Create collections in Shopify Admin**

In Shopify Admin → Products → Collections, create:
1. `servicios-y-alquileres` (parent manual collection)
2. `alquiler-de-maquinaria`
3. `andamios-y-estructuras`
4. `herramientas-especializadas-alquiler`
5. `fletes-y-transporte`
6. `servicios-mano-de-obra`
7. `contenedores-y-limpieza`

- [ ] **Step 3: Create sample alquiler products with period variants**

For each product, create variants: "Por Día", "Por Semana", "Por Mes" with different prices.

Example product:
- Title: "Hormigonera 150L"
- Collection: alquiler-de-maquinaria
- Variants:
  - "Por Día" — $800 UYU
  - "Por Semana" — $4.500 UYU
  - "Por Mes" — $15.000 UYU
- Description: Incluye entrega y retiro en Montevideo
- Images: Product photos

Create at least 3-4 products per subcategory (minimum 6 total to look populated).

- [ ] **Step 4: Verify alquiler products render on frontend**

Run: `pnpm dev`
1. Navigate to `/collections/servicios-y-alquileres`
2. Verify products show with variant selector
3. Verify variant selector shows "Por Día", "Por Semana", "Por Mes"
4. Verify prices update when switching variants
5. Verify adding to cart works

- [ ] **Step 5: Update homepage categories to include Alquileres icon**

In `src/app/page.tsx`, the categories array (line 41-49) already includes `"Servicios"` with `"ShieldCheck"` icon. Consider changing to a more descriptive icon like `"Wrench"` or `"Truck"`:

```typescript
{ label: "Alquileres", href: "/collections/servicios-y-alquileres", icon: "Wrench" },
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/constants/collectionHierarchy.ts src/app/page.tsx
git commit -m "feat: expand alquiler subcategories and update homepage icon"
```

---

## Phase 4: Polish & QA

### Task 8: Verify and fix static pages content

**Files:**
- Modify: `src/app/sobre-nosotros/page.tsx`
- Modify: `src/app/envios-y-entregas/page.tsx`
- Modify: `src/app/devoluciones-y-garantias/page.tsx`
- Modify: `src/app/politica-privacidad/page.tsx`
- Modify: `src/app/terminos-y-condiciones/page.tsx`

- [ ] **Step 1: Review each static page for placeholder content**

Read each file and verify content is real, not placeholder Lorem Ipsum.
Key checks:
- Company name is "CompraHogar" (not placeholder)
- Contact info is real (email, phone, address)
- Shipping policy matches the 19-department rates in `shippingRates.ts`
- Return policy has specific timeframes
- Privacy policy mentions Shopify data handling
- Terms reference Uruguayan law

- [ ] **Step 2: Fix any placeholder content**

Replace placeholder text with real content. Each page should be complete and legally adequate.

- [ ] **Step 3: Commit**

```bash
git add src/app/sobre-nosotros/ src/app/envios-y-entregas/ src/app/devoluciones-y-garantias/ src/app/politica-privacidad/ src/app/terminos-y-condiciones/
git commit -m "fix: update static pages with real content"
```

---

### Task 9: Remove /ui-test route and clean up dev artifacts

**Files:**
- Delete: `src/app/ui-test/` (entire directory)

- [ ] **Step 1: Remove ui-test page**

```bash
rm -rf src/app/ui-test/
```

- [ ] **Step 2: Check for other dev artifacts**

Search for TODO comments, console.log statements, hardcoded test data:
```bash
grep -r "console.log" src/ --include="*.ts" --include="*.tsx" -l
grep -r "TODO" src/ --include="*.ts" --include="*.tsx" -l
grep -r "1024 vendidos" src/ --include="*.tsx" -l
```

- [ ] **Step 3: Remove hardcoded "1024 vendidos"**

In ProductView.tsx, find and remove or replace the hardcoded "1024 vendidos" text.

- [ ] **Step 4: Clean up unnecessary console.logs**

Remove console.log statements that were for debugging. Keep webhook logging (those are useful in production).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove dev artifacts, ui-test page, and console.logs"
```

---

### Task 10: Create sitemap.ts and robots.ts for SEO

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `next.config.ts` — Add Judge.me image domain to remotePatterns

- [ ] **Step 1: Create dynamic sitemap**

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { shopifyFetch } from '@/lib/shopify';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comprahogar.com.uy';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '', '/collections', '/sobre-nosotros', '/envios-y-entregas',
    '/devoluciones-y-garantias', '/politica-privacidad', '/terminos-y-condiciones',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch all products
  const productsQuery = `{ products(first: 250) { edges { node { handle updatedAt } } } }`;
  const productsRes = await shopifyFetch({ query: productsQuery, cache: 'no-store' });
  const products = productsRes.body?.data?.products?.edges?.map((e: any) => ({
    url: `${SITE_URL}/products/${e.node.handle}`,
    lastModified: new Date(e.node.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  })) || [];

  // Fetch all collections
  const collectionsQuery = `{ collections(first: 100) { edges { node { handle updatedAt } } } }`;
  const collectionsRes = await shopifyFetch({ query: collectionsQuery, cache: 'no-store' });
  const collections = collectionsRes.body?.data?.collections?.edges?.map((e: any) => ({
    url: `${SITE_URL}/collections/${e.node.handle}`,
    lastModified: new Date(e.node.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  return [...staticPages, ...products, ...collections];
}
```

- [ ] **Step 2: Create robots.ts**

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://comprahogar.com.uy';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cuenta/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Add Judge.me image domain to next.config.ts remotePatterns**

```typescript
{
  protocol: "https",
  hostname: "judgeme-public-images.imgix.net",
  pathname: "/**",
},
```

- [ ] **Step 4: Verify sitemap and robots in dev**

Run: `pnpm dev`
Navigate to `http://localhost:3000/sitemap.xml` — should return XML with all products/collections.
Navigate to `http://localhost:3000/robots.txt` — should return text with allow/disallow rules.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts next.config.ts
git commit -m "feat: add dynamic sitemap and robots.txt for SEO"
```

---

### Task 11: End-to-end QA flow verification (manual)

No files to modify — this is a manual testing task.

- [ ] **Step 1: Verify complete shopping flow**

Run: `pnpm dev`

Test flow:
1. Homepage loads → hero, categories, deal of the day, featured products
2. Click a category → collection page loads with filters
3. Apply a filter → products update
4. Click a product → product detail page loads
5. Switch variant → price updates
6. Click "Agregar al carrito" → cart drawer opens
7. Update quantity in cart
8. See shipping cost for selected department
9. Click "Finalizar compra" → redirects to Shopify checkout

- [ ] **Step 2: Verify auth flow**

1. Go to `/registro` → create account
2. Go to `/login` → login
3. Go to `/cuenta` → see dashboard
4. Go to `/cuenta/mis-compras` → see order history
5. Go to `/cuenta/direcciones` → add an address
6. Go to `/cuenta/favoritos` → see favorites
7. Go to `/cuenta/cambiar-password` → change password form works
8. Logout → redirected to login

- [ ] **Step 3: Verify alquiler flow**

1. Navigate to `/collections/servicios-y-alquileres`
2. Products display with correct subcategories
3. Click an alquiler product
4. Variant selector shows "Por Día", "Por Semana", "Por Mes"
5. Prices change when switching
6. Add to cart → works
7. Checkout → works

- [ ] **Step 4: Verify search**

1. Click search icon in header
2. Type "cemento" → predictive results appear
3. Click a result → navigates to product
4. Search full page → `/search?q=cemento` shows results

- [ ] **Step 5: Verify mobile responsiveness**

Open Chrome DevTools → Toggle Device Toolbar
Test on iPhone 14 Pro (390px) and iPad (768px):
1. Hamburger menu opens/closes
2. Filters open as drawer
3. Product grid is 1-2 columns
4. Cart drawer works
5. All text is readable

- [ ] **Step 6: Document any issues found**

Create a list of bugs found during QA. Fix them in subsequent commits.

---

### Task 12: Add basic test suite

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` — add vitest deps and test script
- Create: `src/__tests__/lib/shipping.test.ts`
- Create: `src/__tests__/lib/analytics.test.ts`

- [ ] **Step 1: Install Vitest**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm add -D vitest @vitejs/plugin-react`

- [ ] **Step 2: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Add test script to package.json**

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write shipping rates test**

```typescript
// src/__tests__/lib/shipping.test.ts
import { describe, it, expect } from 'vitest';
import { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD, getShippingRate } from '@/lib/constants/shippingRates';

describe('Shipping rates', () => {
  it('covers all 19 departments of Uruguay', () => {
    const departments = Object.keys(SHIPPING_ZONES);
    expect(departments.length).toBe(19);
  });

  it('Montevideo has the lowest rate', () => {
    const mvd = SHIPPING_ZONES['Montevideo'];
    expect(mvd).toBeDefined();
    expect(mvd.rate).toBeLessThanOrEqual(300);
  });

  it('all zones have rate and estimate', () => {
    for (const [dept, zone] of Object.entries(SHIPPING_ZONES)) {
      expect(zone.rate).toBeGreaterThan(0);
      expect(zone.estimate).toBeDefined();
      expect(zone.estimate.length).toBeGreaterThan(0);
    }
  });

  it('free shipping threshold is 4000', () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(4000);
  });

  it('getShippingRate returns free shipping above threshold', () => {
    const result = getShippingRate('Montevideo', 5000);
    expect(result).toEqual({ rate: 0, estimate: 'Envío gratis' });
  });

  it('getShippingRate returns null for no department', () => {
    expect(getShippingRate(null, 1000)).toBeNull();
  });

  it('getShippingRate returns zone rate below threshold', () => {
    const result = getShippingRate('Montevideo', 1000);
    expect(result?.rate).toBe(250);
  });
});
```

- [ ] **Step 5: Write analytics test**

```typescript
// src/__tests__/lib/analytics.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pushDatalayerEvent, type ViewItemEvent } from '@/lib/analytics';

describe('pushDatalayerEvent', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { dataLayer: [] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('pushes event to dataLayer', () => {
    const event: ViewItemEvent = {
      event: 'view_item',
      ecommerce: {
        currency: 'UYU',
        value: 1000,
        items: [{ item_id: '1', item_name: 'Test', price: 1000, quantity: 1 }],
      },
    };

    pushDatalayerEvent(event);

    expect(window.dataLayer).toHaveLength(2); // null clear + event
    expect(window.dataLayer[0]).toEqual({ ecommerce: null });
    expect(window.dataLayer[1]).toEqual(event);
  });

  it('does not crash when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined);

    expect(() => {
      pushDatalayerEvent({
        event: 'view_item',
        ecommerce: { currency: 'UYU', value: 0, items: [] },
      });
    }).not.toThrow();
  });
});
```

- [ ] **Step 6: Run tests**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm test`
Expected: All tests pass

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts package.json pnpm-lock.yaml src/__tests__/
git commit -m "feat: add Vitest test suite with shipping and analytics tests"
```

---

## Phase 5: Deploy to Production

### Task 13: Configure production environment and deploy

**Files:**
- Modify: `.env.local` (already done in Task 3)

- [ ] **Step 1: Verify all env vars are set**

Required for production:
```
SHOPIFY_STORE_DOMAIN=comprahogaruy.myshopify.com
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=comprahogaruy.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
SHOPIFY_ADMIN_ACCESS_TOKEN=<token>
SHOPIFY_WEBHOOK_SECRET=<secret>
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_SITE_URL=https://comprahogar.com.uy
```

- [ ] **Step 2: Verify clean build passes**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm build`
Expected: Build completes with no errors

- [ ] **Step 3: Run all tests**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm test`
Expected: All tests pass

- [ ] **Step 4: Set environment variables in Vercel**

In Vercel dashboard → Project Settings → Environment Variables:
Add all the env vars from Step 1 for the Production environment.

Also in Project Settings → General → Build & Development Settings:
Set Build Command to: `NODE_OPTIONS='--max-old-space-size=4096' next build`
(This ensures Vercel's build environment has enough memory, matching the local fix from Task 1.)

- [ ] **Step 5: Configure custom domain in Vercel**

In Vercel dashboard → Project Settings → Domains:
1. Add `comprahogar.com.uy` (or the chosen domain)
2. Configure DNS records as indicated by Vercel
3. Wait for SSL certificate provisioning

- [ ] **Step 6: Push to main and deploy**

```bash
git checkout main
git merge pre-launch-hardening
git push origin main
```

Vercel auto-deploys on push to main.

- [ ] **Step 7: Post-deploy smoke test**

On the production URL:
1. Homepage loads with real products
2. Search works
3. Product page loads
4. Cart works
5. Checkout redirects to Shopify
6. Account login works
7. Mobile responsive
8. Check `/sitemap.xml` returns valid XML
9. Check `/robots.txt` returns expected content
10. Check page source for GTM script
11. Verify HTTPS and security headers with `curl -I https://comprahogar.com.uy`

- [ ] **Step 8: Configure Shopify webhooks for production URL**

In Shopify Admin → Settings → Notifications → Webhooks:
1. Update webhook URL to `https://comprahogar.com.uy/api/webhooks`
2. Topics: products/create, products/update, products/delete, collections/create, collections/update, collections/delete, orders/paid, inventory_levels/update
3. Format: JSON
4. API version: 2024-04

**CRITICAL:** Copy the "Webhook signing secret" shown in Shopify Admin into the `SHOPIFY_WEBHOOK_SECRET` env var in Vercel. These MUST match, otherwise all webhooks will be rejected with 401 (HMAC mismatch).

- [ ] **Step 9: Final commit**

```bash
git commit --allow-empty -m "chore: production deployment complete"
```

---

## Task Dependencies

```
Task 1 (build fix) ──→ Task 2 (TS errors) ──→ Task 3 (GTM)
                                              ──→ Task 4 (order webhooks)
                                              ──→ Task 5 (Judge.me)
                                              ──→ Task 6 (Deal of Day)
                                              ──→ Task 7 (Alquileres)
Tasks 3-7 ──→ Task 8 (static pages) ⚠️ needs founder input for legal text
           ──→ Task 9 (cleanup)
           ──→ Task 10 (sitemap/robots)
           ──→ Task 11 (QA)
           ──→ Task 12 (tests)
Tasks 8-12 ──→ Task 13 (deploy)
```

Tasks 3, 4, 5, 6, 7 can run in parallel after Tasks 1-2 are done.
Tasks 8, 9, 10, 11, 12 can run in parallel after Phase 2-3 are done.
Task 13 is the final sequential step.

**Note:** Task 8 (static pages) may require founder review for legal content (privacidad, terminos). Start gathering this content in parallel with Phase 2 work to avoid it becoming a bottleneck.
