# Remaining Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Judge.me reviews, rate limiting, auth middleware, UES shipping calculator, and audit mobile/desktop styles.

**Architecture:** 5 independent tasks that can be executed in any order. Rate limiter is a shared utility used by auth actions. Shipping rates are a constants file consumed by CartProvider and ShippingCalculator. Judge.me uses embedded widgets via next/script. Auth middleware is a lightweight cookie check at the edge.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Judge.me widget, Shopify Storefront API

**Spec:** `docs/superpowers/specs/2026-03-20-remaining-improvements-design.md`

---

## File Map

### Files to Create
| File | Responsibility |
|------|---------------|
| `src/lib/rate-limit.ts` | In-memory sliding window rate limiter |
| `src/lib/constants/shippingRates.ts` | UES rate table by department zone |
| `src/middleware.ts` | Auth guard for /cuenta/* routes |
| `src/app/api/location/route.ts` | GET endpoint to read department from httpOnly cookie |

### Files to Modify
| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add Judge.me scripts via next/script |
| `src/components/shop/ProductView.tsx` | Add Judge.me review widget container |
| `src/components/shop/ProductGrid.tsx` | Add Judge.me star badge |
| `src/components/shop/ProductCarousel.tsx` | Add Judge.me star badge |
| `src/app/login/actions.ts` | Add rate limiting + redirect param support |
| `src/app/login/login-form.tsx` | Read redirect param, pass to loginCustomer |
| `src/app/registro/actions.ts` | Add rate limiting |
| `src/app/olvide-password/actions.ts` | Add rate limiting |
| `src/app/login/recuperar/actions.ts` | Add rate limiting |
| `src/components/shop/ShippingCalculator.tsx` | Replace with department-based UES rates |
| `src/components/cart/CartProvider.tsx` | Calculate estimatedShipping from department |

---

## Task 1: Rate Limiting Utility + Auth Endpoints

**Files:**
- Create: `src/lib/rate-limit.ts`
- Modify: `src/app/login/actions.ts`
- Modify: `src/app/registro/actions.ts`
- Modify: `src/app/olvide-password/actions.ts`
- Modify: `src/app/login/recuperar/actions.ts`

- [ ] **Step 1: Create rate-limit.ts**

Create `src/lib/rate-limit.ts`:

```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}, 60000);

export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}
```

- [ ] **Step 2: Add rate limiting to loginCustomer**

In `src/app/login/actions.ts`, add at the top of `loginCustomer()`:

```typescript
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

// Inside loginCustomer, before any Shopify call:
const headerStore = await headers();
const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
const { success: allowed } = rateLimit(`login:${ip}`, 5, 60000);
if (!allowed) {
  return { error: "Demasiados intentos. Esperá un minuto antes de volver a intentar." };
}
```

- [ ] **Step 3: Add rate limiting to registerCustomer**

In `src/app/registro/actions.ts`, same pattern with key `register:${ip}`, limit 5.

- [ ] **Step 4: Add rate limiting to forgotPasswordAction**

In `src/app/olvide-password/actions.ts`, same pattern with key `forgot:${ip}`, limit 3. Note: this function uses `(prevState, formData)` signature — add rate limit check inside before the Shopify call, return `{ error: "Demasiados intentos..." }`.

- [ ] **Step 5: Add rate limiting to customerRecoverAction**

In `src/app/login/recuperar/actions.ts`, same pattern with key `recover:${ip}`, limit 3. Uses `(prevState: RecoverActionState, formData)` signature — return `{ success: false, error: "Demasiados intentos..." }`.

- [ ] **Step 6: Verify build**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && npx tsc --noEmit 2>&1 | head -20`

---

## Task 2: Auth Middleware + Login Redirect

**Files:**
- Create: `src/middleware.ts`
- Modify: `src/app/login/actions.ts`
- Modify: `src/app/login/login-form.tsx`

- [ ] **Step 1: Create middleware.ts**

Create `src/middleware.ts` in the PROJECT ROOT (not src/app):

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("customerAccessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cuenta/:path*"],
};
```

- [ ] **Step 2: Update loginCustomer to accept redirect param**

In `src/app/login/actions.ts`, modify `loginCustomer` to accept an optional redirect destination. After setting the cookie, instead of always redirecting:

```typescript
export async function loginCustomer(formData: FormData) {
  // ... existing rate limit + auth logic ...

  // After successful cookie set:
  const redirectTo = formData.get("redirect") as string | null;
  // Validate: must start with / and not contain // (open redirect protection)
  const safeRedirect = redirectTo && redirectTo.startsWith("/") && !redirectTo.includes("//")
    ? redirectTo
    : "/cuenta/perfil";
  redirect(safeRedirect);
}
```

- [ ] **Step 3: Update LoginForm to read redirect param**

In `src/app/login/login-form.tsx`:

```typescript
import { useSearchParams } from "next/navigation";

// Inside component:
const searchParams = useSearchParams();
const redirectParam = searchParams.get("redirect") || "";

// In the form, add hidden input:
<input type="hidden" name="redirect" value={redirectParam} />
```

- [ ] **Step 4: Verify — navigate to /cuenta without cookie, should redirect to /login?redirect=/cuenta/perfil**

---

## Task 3: Judge.me Embedded Widget

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/shop/ProductView.tsx`
- Modify: `src/components/shop/ProductGrid.tsx`
- Modify: `src/components/shop/ProductCarousel.tsx`

- [ ] **Step 1: Add Judge.me scripts to layout.tsx**

In `src/app/layout.tsx`, add inside `<head>` after the GTM script:

```typescript
import Script from "next/script";

// Inside <head>, after GTM:
<Script
  src="https://cdn.judge.me/widget_preloader.js"
  strategy="lazyOnload"
  data-shop-domain="comprahogaruy.myshopify.com"
/>
<Script
  src="https://cdn.judge.me/assets/installed.js"
  strategy="lazyOnload"
/>
```

- [ ] **Step 2: Add review widget to ProductView.tsx**

Read `src/components/shop/ProductView.tsx` first. Find the product ID from the product object (format `gid://shopify/Product/123456`). Extract numeric ID:

```typescript
const productExternalId = product.id.split("/").pop();
```

Add below the product description/specs section:

```tsx
{/* Judge.me Reviews */}
<div className="mt-12 pt-8 border-t border-slate-200">
  <h2 className="text-xl font-bold text-slate-900 mb-6">Opiniones de clientes</h2>
  <div
    className="jdgm-widget jdgm-review-widget"
    data-id={productExternalId}
    data-handle={product.handle}
  />
</div>
```

- [ ] **Step 3: Add star badges to ProductGrid.tsx**

Read `src/components/shop/ProductGrid.tsx` first. Inside each product card, below the price and above/below the title, add:

```tsx
<div
  className="jdgm-widget jdgm-preview-badge"
  data-id={product.id.split("/").pop()}
  data-handle={product.handle}
/>
```

Keep it small — the widget renders inline stars.

- [ ] **Step 4: Add star badges to ProductCarousel.tsx**

Same as Step 3 but in `src/components/shop/ProductCarousel.tsx`.

- [ ] **Step 5: Verify — visit a product page, check that Judge.me widget containers render (they'll show "No reviews yet" or load reviews if any exist)**

---

## Task 4: UES Shipping Calculator

**Files:**
- Create: `src/lib/constants/shippingRates.ts`
- Create: `src/app/api/location/route.ts`
- Modify: `src/components/shop/ShippingCalculator.tsx`
- Modify: `src/components/cart/CartProvider.tsx`

- [ ] **Step 1: Create shipping rates constants**

Create `src/lib/constants/shippingRates.ts`:

```typescript
export const FREE_SHIPPING_THRESHOLD = 300000;

export const SHIPPING_ZONES: Record<string, { rate: number; estimate: string }> = {
  "Montevideo": { rate: 250, estimate: "1-2 días hábiles" },
  "Canelones": { rate: 350, estimate: "2-3 días hábiles" },
  "Maldonado": { rate: 450, estimate: "3-5 días hábiles" },
  "Colonia": { rate: 450, estimate: "3-5 días hábiles" },
  "San José": { rate: 450, estimate: "3-5 días hábiles" },
  "Florida": { rate: 450, estimate: "3-5 días hábiles" },
  "Artigas": { rate: 550, estimate: "4-7 días hábiles" },
  "Cerro Largo": { rate: 550, estimate: "4-7 días hábiles" },
  "Durazno": { rate: 550, estimate: "4-7 días hábiles" },
  "Flores": { rate: 550, estimate: "4-7 días hábiles" },
  "Lavalleja": { rate: 550, estimate: "4-7 días hábiles" },
  "Paysandú": { rate: 550, estimate: "4-7 días hábiles" },
  "Río Negro": { rate: 550, estimate: "4-7 días hábiles" },
  "Rivera": { rate: 550, estimate: "4-7 días hábiles" },
  "Rocha": { rate: 550, estimate: "4-7 días hábiles" },
  "Salto": { rate: 550, estimate: "4-7 días hábiles" },
  "Soriano": { rate: 550, estimate: "4-7 días hábiles" },
  "Tacuarembó": { rate: 550, estimate: "4-7 días hábiles" },
  "Treinta y Tres": { rate: 550, estimate: "4-7 días hábiles" },
};

export function getShippingRate(department: string | null, cartTotal: number): { rate: number; estimate: string } | null {
  if (!department) return null;
  if (cartTotal >= FREE_SHIPPING_THRESHOLD) return { rate: 0, estimate: "Envío gratis" };
  return SHIPPING_ZONES[department] || { rate: 550, estimate: "4-7 días hábiles" };
}
```

- [ ] **Step 2: Create location API route**

Create `src/app/api/location/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getLocation } from "@/app/actions/location";

export async function GET() {
  try {
    const location = await getLocation();
    return NextResponse.json({ department: location?.department || null });
  } catch {
    return NextResponse.json({ department: null });
  }
}
```

- [ ] **Step 3: Replace ShippingCalculator.tsx**

Read the existing `src/components/shop/ShippingCalculator.tsx` first. Replace it with a department-based calculator that:
- Reads department from the location API on mount
- Shows current department + shipping rate + delivery estimate
- If no department, shows "Seleccioná tu ubicación" with a prompt
- Shows "Envío gratis" when cart total exceeds threshold
- Uses `getShippingRate()` from the constants file
- Has a "Cambiar ubicación" button (triggers LocationSelector if available, or shows inline department select)

- [ ] **Step 4: Update CartProvider to calculate shipping**

Read `src/components/cart/CartProvider.tsx` first. Add shipping calculation:
- On mount, fetch department from `/api/location`
- Import `getShippingRate` from `@/lib/constants/shippingRates`
- Calculate `estimatedShipping` using `getShippingRate(department, subtotal)`
- Update when subtotal changes (might cross free shipping threshold)
- Store department in state, refetch when LocationSelector updates (listen for `router.refresh()` or use a polling approach)

- [ ] **Step 5: Verify — select a department in LocationSelector, check that shipping rate appears in cart drawer**

---

## Task 5: Mobile/Desktop Style Audit

**Files:**
- Audit: `src/components/layout/Header.tsx`
- Audit: `src/components/shop/ProductGrid.tsx`
- Audit: `src/components/shop/ProductCarousel.tsx`
- Audit: `src/components/layout/Footer.tsx`
- Audit: `src/components/shop/ProductView.tsx`
- Audit: `src/components/shop/SidebarFilter.tsx`
- Audit: `src/app/cuenta/account-sidebar.tsx`

- [ ] **Step 1: Audit all listed components**

For each component, check:
- Every layout style uses Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) appropriately
- No `max-width` or `overflow-hidden` on mobile that restricts desktop
- Font sizes, padding, gaps scale properly between breakpoints
- Touch targets >= 44px on mobile
- No horizontal scroll on any viewport

- [ ] **Step 2: Fix any issues found**

Apply minimal fixes — only change what's broken, don't refactor.

- [ ] **Step 3: Verify build**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm build 2>&1 | tail -20`

---

## Task 6: Final Build & Commit

- [ ] **Step 1: Run full build**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm build`

Fix any errors.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add reviews, rate limiting, auth middleware, shipping calculator

- Judge.me embedded widget on product pages and cards
- Rate limiting on login, register, password recovery (5/min)
- Auth middleware for /cuenta/* with redirect support
- UES shipping rates by department zone
- Mobile/desktop responsive style audit fixes"
```
