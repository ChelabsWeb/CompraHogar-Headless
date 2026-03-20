# CompraHogar — Remaining Improvements

**Date:** 2026-03-20
**Status:** Approved
**Scope:** Judge.me reviews widget, rate limiting, auth middleware, shipping calculator with UES rates, mobile/desktop style audit

---

## 1. Overview

Implement remaining improvements identified during project audit: product reviews via Judge.me embedded widget, rate limiting on auth endpoints, global auth middleware, shipping cost calculator with UES rates by department, and a responsive style audit.

### Out of Scope
- Back-in-stock notifications (handled by Shopify app)
- Order transactional emails (handled natively by Shopify)
- Custom checkout (uses Shopify hosted checkout)
- i18n/multi-language

---

## 2. Judge.me Embedded Widget

### Approach
Use Judge.me's embedded widget (no API key needed). Load their script and place widget containers in product pages and star badges in product cards.

### Implementation

**Script loading:**
- Add Judge.me script tag in `src/app/layout.tsx` `<head>`:
  ```html
  <script src="https://cdn.judge.me/widget_preloader.js" async></script>
  <script src="https://cdn.judge.me/assets/installed.js" async></script>
  ```
- Configure with store domain: `comprahogaruy.myshopify.com`

**Product detail page (`src/components/shop/ProductView.tsx`):**
- Add review widget below product description:
  ```html
  <div class="jdgm-widget jdgm-review-widget" data-id="{productExternalId}" data-handle="{productHandle}"></div>
  ```
- The widget auto-renders: review form, stars, existing reviews

**Product cards (`src/components/shop/ProductGrid.tsx`, `ProductCarousel.tsx`):**
- Add star badge preview below price:
  ```html
  <div class="jdgm-widget jdgm-preview-badge" data-id="{productExternalId}" data-handle="{productHandle}"></div>
  ```
- Small inline stars with review count

**Note:** `productExternalId` is the numeric Shopify product ID extracted from the GID (e.g., from `gid://shopify/Product/123456` extract `123456`).

### Files to Modify
| File | Change |
|------|--------|
| `src/app/layout.tsx` | Add Judge.me scripts via `next/script` with `strategy="lazyOnload"` and `data-shop-domain="comprahogaruy.myshopify.com"` |
| `src/components/shop/ProductView.tsx` | Add review widget container |
| `src/components/shop/ProductGrid.tsx` | Add star badge to product cards |
| `src/components/shop/ProductCarousel.tsx` | Add star badge to product cards |

---

## 3. Rate Limiting on Auth Endpoints

### Approach
In-memory sliding window rate limiter using a Map. Simple, no external dependencies.

**Serverless limitation:** On Vercel, each invocation may run in a different isolate, so the Map is per-isolate, not global. This means the rate limiter is **best-effort only** — it catches rapid-fire requests hitting the same isolate but won't stop a distributed attack. This is acceptable as a first layer; for production-grade protection, upgrade to Upstash Redis (free tier) in the future.

### Implementation

**Create `src/lib/rate-limit.ts`:**

```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number = 5, windowMs: number = 60000): { success: boolean; remaining: number } {
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

**Apply to auth server actions:**
- `src/app/login/actions.ts` — `loginCustomer()`: 5 attempts per IP per minute
- `src/app/registro/actions.ts` — `registerCustomer()`: 5 attempts per IP per minute
- `src/app/olvide-password/actions.ts` — `forgotPasswordAction()`: 3 attempts per IP per minute
- `src/app/login/recuperar/actions.ts` — `customerRecoverAction()`: 3 attempts per IP per minute

**Rate limit key format:** `${action}:${ip}` (e.g., `login:192.168.1.1`) so hitting the login limit does not block password recovery.

**IP extraction:** Use `headers().get("x-forwarded-for")` or `headers().get("x-real-ip")` for the client IP.

**Error response:** Return `{ error: "Demasiados intentos. Esperá un minuto antes de volver a intentar." }` — do not throw, return gracefully so the UI can display the message. Note: `forgotPasswordAction` uses `(prevState, formData)` signature (useActionState pattern) — rate limit check must happen inside before the Shopify call.

### Files to Create
| File | Purpose |
|------|---------|
| `src/lib/rate-limit.ts` | Reusable rate limiting utility |

### Files to Modify
| File | Change |
|------|--------|
| `src/app/login/actions.ts` | Add rate limit check before auth |
| `src/app/registro/actions.ts` | Add rate limit check before registration |
| `src/app/olvide-password/actions.ts` | Add rate limit check before recovery |

---

## 4. Auth Middleware

### Approach
Next.js middleware that checks for the `customerAccessToken` cookie on protected routes. Lightweight — only checks cookie existence, not validity (the layout already validates against Shopify).

### Implementation

**Create `src/middleware.ts`:**

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

**Bonus:** Add `redirect` query param so after login the user returns to where they were trying to go. Update login form to read this param and redirect after successful login.

**Open redirect protection:** The login action MUST validate the redirect param: must start with `/` and must NOT contain `//` (prevents `//evil.com` attacks). If invalid, redirect to `/cuenta/perfil` as default.

### Files to Create
| File | Purpose |
|------|---------|
| `src/middleware.ts` | Global auth guard for /cuenta/* routes |

### Files to Modify
| File | Change |
|------|--------|
| `src/app/login/actions.ts` | Accept optional redirect param, redirect there after login |
| `src/app/login/login-form.tsx` | Read redirect param from URL, pass to action |

---

## 5. Shipping Calculator with UES Rates

### Approach
Hardcoded UES rates by department zone. Stored in a constants file for easy updates when the UES agreement is finalized. Integrated with the existing LocationSelector and CartProvider.

### Rate Table

| Zone | Departments | Rate (UYU) |
|------|------------|------------|
| Montevideo | Montevideo | $250 |
| Cercano | Canelones | $350 |
| Interior cercano | Maldonado, Colonia, San José, Florida | $450 |
| Interior lejano | Artigas, Cerro Largo, Durazno, Flores, Lavalleja, Paysandú, Río Negro, Rivera, Rocha, Salto, Soriano, Tacuarembó, Treinta y Tres | $550 |
| Free shipping | Any (when cart > $300,000) | $0 |

### Implementation

**Create `src/lib/constants/shippingRates.ts`:**
- Export `SHIPPING_RATES` map: department → rate
- Export `FREE_SHIPPING_THRESHOLD = 300000`
- Export `getShippingRate(department: string, cartTotal: number): number` utility

**Modify `src/components/shop/ShippingCalculator.tsx`:**
- Replace the current postal-code-based calculator with department-based calculation
- Use department from LocationSelector (already saved in cookie)
- Show: zone name, rate, delivery estimate ("3-5 días hábiles")
- Show "Envío gratis" when above threshold
- Remove "store pickup" option for now (can add later)

**Modify `src/components/cart/CartProvider.tsx`:**
- The `user_location` cookie is httpOnly (set in `src/app/actions/location.ts`), so client components can't read it directly
- **Solution:** Add a `getDepartment()` server action in `src/app/actions/location.ts` that reads the cookie and returns the department. CartProvider calls this on mount via a fetch to a new lightweight API route `/api/location` (GET, returns `{ department: string | null }`)
- Use `getShippingRate()` to calculate `estimatedShipping`
- Re-fetch when LocationSelector updates (listen for cookie change via a custom event or re-mount)

**Modify `src/components/cart/CartSheet.tsx`:**
- Show calculated shipping rate or "Seleccioná tu ubicación" if no department
- Already has free shipping progress bar — no change needed there

**Note:** These are frontend estimates only. Shopify checkout may apply its own shipping rules. The Shopify shipping configuration should be updated to match these rates for consistency.

### Additional Files
| File | Purpose |
|------|---------|
| `src/app/api/location/route.ts` | GET endpoint to read department from httpOnly cookie |

### Files to Create
| File | Purpose |
|------|---------|
| `src/lib/constants/shippingRates.ts` | UES rate table and calculation utility |

### Files to Modify
| File | Change |
|------|--------|
| `src/components/shop/ShippingCalculator.tsx` | Use real rates by department |
| `src/components/cart/CartProvider.tsx` | Calculate estimatedShipping from department cookie |
| `src/components/cart/CartSheet.tsx` | Show shipping rate or prompt to select location |

---

## 6. Mobile/Desktop Style Audit

### Approach
Review all major components for responsive style issues: missing breakpoints, mobile-first styles bleeding into desktop, overflow issues, spacing inconsistencies.

### Components to Audit
1. `src/components/layout/Header.tsx` — scroll behavior, icon spacing, teal bar
2. `src/components/shop/ProductGrid.tsx` — grid columns, card sizing
3. `src/components/shop/ProductCarousel.tsx` — scroll snap, card widths
4. `src/components/layout/Footer.tsx` — grid columns, newsletter section
5. `src/components/layout/MegaMenu.tsx` — dropdown positioning
6. `src/components/shop/SidebarFilter.tsx` — filter panel responsive behavior
7. `src/components/shop/ProductView.tsx` — image gallery, product info layout
8. `src/app/cuenta/account-sidebar.tsx` — sidebar/tabs transition

### Criteria
- Every layout style should use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) appropriately
- No `max-width` or `overflow-hidden` on mobile that restricts desktop
- Font sizes, padding, and gaps scale properly between breakpoints
- Touch targets >= 44px on mobile
- No horizontal scroll on any viewport width

### Output
List of issues found with file:line references and fixes applied.

---

## 7. Summary of Changes

### New Files (3)
| File | Purpose |
|------|---------|
| `src/lib/rate-limit.ts` | Rate limiting utility |
| `src/lib/constants/shippingRates.ts` | UES shipping rates |
| `src/middleware.ts` | Auth guard middleware |

### Modified Files (up to 12)
| File | Change |
|------|--------|
| `src/app/layout.tsx` | Judge.me scripts |
| `src/components/shop/ProductView.tsx` | Review widget |
| `src/components/shop/ProductGrid.tsx` | Star badges + style fixes |
| `src/components/shop/ProductCarousel.tsx` | Star badges + style fixes |
| `src/app/login/actions.ts` | Rate limiting + redirect param (validate: must start with `/`, no `//`) |
| `src/app/login/login-form.tsx` | Read redirect param from URL, pass to action |
| `src/app/registro/actions.ts` | Rate limiting |
| `src/app/olvide-password/actions.ts` | Rate limiting |
| `src/app/login/recuperar/actions.ts` | Rate limiting |
| `src/components/shop/ShippingCalculator.tsx` | Real rate calculation |
| `src/components/cart/CartProvider.tsx` | Shipping rate from department |
| `src/components/cart/CartSheet.tsx` | Show rate or location prompt |
| Various components | Style audit fixes |
