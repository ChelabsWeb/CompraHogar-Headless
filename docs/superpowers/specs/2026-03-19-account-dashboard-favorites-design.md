# CompraHogar — Account Dashboard, Favorites & Order History

**Date:** 2026-03-19
**Status:** Approved
**Scope:** Account dashboard with sidebar, favorites system with header icon + drawer + sync, dedicated order history with detail view

---

## 1. Overview

Implement a complete account dashboard at `/cuenta` with sidebar navigation, a favorites/wishlist system with heart icon in the header (drawer + full page), and a dedicated order history section with individual order detail pages.

### Goals
- Complete account management (profile, addresses, password)
- Dedicated order history with detailed order view (timeline, tracking, payment info)
- Favorites accessible from header with Shopify metafield sync for logged-in users
- Responsive: sidebar on desktop, horizontal tabs on mobile

### Out of Scope
- Repeat order functionality
- Return/refund requests
- Invoice download
- Social auth
- Rate limiting / brute force protection

---

## 2. Route Architecture

```
/cuenta                        → redirect to /cuenta/perfil
/cuenta/perfil                 → Edit profile (name, email, phone)
/cuenta/direcciones            → Address management (CRUD with labels)
/cuenta/mis-compras            → Order history list
/cuenta/mis-compras/[id]       → Individual order detail
/cuenta/favoritos              → Full favorites page
/cuenta/cambiar-password       → Change password form
```

All `/cuenta/*` routes are protected — redirect to `/login` if no valid `customerAccessToken` cookie.

Header link "Mis Compras" navigates directly to `/cuenta/mis-compras`. Note: currently links to `/cuenta` — this is an intentional change. The `/cuenta` route becomes a redirect to `/cuenta/perfil`, so existing bookmarks land on the profile page, not orders.

---

## 3. Dashboard Layout

### Desktop (lg+)
- Sidebar fixed left (240px width), content area fills remaining space
- Sidebar contains navigation links with icons + "Cerrar Sesión" at bottom separated by divider
- Active link highlighted with primary color background

### Mobile (< lg)
- Sidebar replaced by horizontal scrollable tabs at top of content area
- Same navigation items as sidebar, condensed to icon + short label
- "Cerrar Sesión" moved to bottom of the active page content

### Sidebar Items
1. Mi Perfil — `User` icon
2. Mis Direcciones — `MapPin` icon
3. Mis Compras — `Package` icon
4. Favoritos — `Heart` icon
5. Cambiar Contraseña — `Lock` icon
6. (divider)
7. Cerrar Sesión — `LogOut` icon

### Implementation
- `src/app/cuenta/layout.tsx` — shared layout with sidebar + auth guard
- Each sub-route is a `page.tsx` inside its folder
- Current `src/app/cuenta/page.tsx` becomes a redirect to `/cuenta/perfil`

---

## 4. Mi Perfil (`/cuenta/perfil`)

### Display
- Card showing current: firstName, lastName, email, phone, marketing consent
- "Editar" button toggles to edit mode (inline form)

### Edit Form
- Fields: firstName, lastName, email, phone (all optional except firstName)
- Checkbox: "Acepto recibir ofertas y novedades por email"
- Save button calls `customerUpdateMutation` via server action
- Success toast / error display

### Server Action
- Uses existing `updateCustomerProfile()` from `src/app/cuenta/actions.ts` (already defined, needs UI)

---

## 5. Mis Direcciones (`/cuenta/direcciones`)

### Display
- Grid of address cards (1 col mobile, 2 cols desktop)
- Each card shows: label ("Casa", "Oficina", "Otra"), full address, phone
- Default address has "Predeterminada" badge
- Edit and Delete buttons per card
- "Agregar dirección" button at top

### Add/Edit Modal
- Fields: label (select: Casa/Oficina/Otra), firstName, lastName, address1, address2, city, province (department dropdown — 19 Uruguayan departments), zip, country (default Uruguay), phone
- "Marcar como predeterminada" checkbox
- Save calls `customerAddressCreateMutation` or `customerAddressUpdateMutation`
- Delete calls `customerAddressDeleteMutation` with confirmation dialog
- "Set as default" calls `customerDefaultAddressUpdate` mutation (needs to be added to `lib/customer.ts`)

### Data Source
- Extend `getCustomerQuery` to fetch all addresses (currently only fetches default)
- Add `addresses(first: 10)` to customer query (hard cap — sufficient for e-commerce; most users have 1-3 addresses)
- Add `customerDefaultAddressUpdate` mutation to `lib/customer.ts`

### Validation Rules
- Required fields: firstName, lastName, address1, city, province, zip, country
- Phone: optional, validated for format
- Zip: 5 digits (Uruguay)
- Label: required (select from Casa/Oficina/Otra)

---

## 6. Mis Compras (`/cuenta/mis-compras`)

### Order List
- Cards sorted by date (newest first)
- Each card shows: order number, date, status badge (color-coded), total, item count
- Click expands or navigates to `/cuenta/mis-compras/[orderNumber]`
- Empty state if no orders

### Status Badges
- `Pendiente` — yellow
- `En proceso` — blue
- `Completado` — green
- `Cancelado` — red
- `Reembolsado` — gray

### Pagination
- Shopify returns orders with cursor-based pagination
- "Cargar más" button or infinite scroll

---

## 7. Detalle de Pedido (`/cuenta/mis-compras/[id]`)

### Sections

**Header:**
- "← Volver a Mis Compras" link
- Order number + status badge
- Order date

**Timeline:**
- Vertical timeline showing order progression:
  - Pedido recibido (order created date)
  - Pago confirmado (financial status = PAID)
  - En preparación (fulfillment status = IN_PROGRESS)
  - Enviado (fulfillment status = SHIPPED, with tracking link)
  - Entregado (fulfillment status = DELIVERED)
- Completed steps: filled circle + date
- Pending steps: empty circle
- Current step: pulsing/highlighted

**Products:**
- List of line items with: thumbnail, product title, variant, quantity, line total
- Link to product page

**Shipping:**
- Delivery address (from order)
- Tracking number + "Rastrear envío" link (if available)

**Payment:**
- Payment method info (from Shopify order data — what's available via Storefront API)
- Subtotal, shipping cost, discounts, total

### Data Source
- **Shopify Storefront API limitation:** there is no single-order query. Orders are only available as a list via `customer.orders(first: N)`.
- **Approach:** Fetch all customer orders on the `/cuenta/mis-compras` list page and cache them client-side (SWR). The detail page `/cuenta/mis-compras/[id]` receives the order number as param, fetches the full order list, and filters to find the matching order.
- Alternative: if performance becomes an issue with many orders, add a proxy API route `/api/orders/[id]` using the Admin API for direct order lookup.

### Timeline Status Mapping
The Storefront API `fulfillmentStatus` returns: `UNFULFILLED`, `PARTIALLY_FULFILLED`, `FULFILLED`, `RESTOCKED`. Map to timeline as:
- **Pedido recibido** — always shown (order exists)
- **Pago confirmado** — `financialStatus === 'PAID'`
- **En preparación** — `fulfillmentStatus === 'UNFULFILLED'` and `financialStatus === 'PAID'`
- **Enviado** — `fulfillmentStatus === 'PARTIALLY_FULFILLED'` or tracking info exists
- **Entregado** — `fulfillmentStatus === 'FULFILLED'`

Note: granular shipping events (picked up, in transit, out for delivery) are not available via Storefront API. The timeline shows the best approximation from available data. Tracking URL is available and links to the carrier's detail page.

---

## 8. Favorites — Header Icon

### Placement
- Desktop: between "Mi cuenta" link and cart icon in the teal bottom bar
- Mobile: inside the mobile menu drawer as a "Favoritos" link with heart icon + count badge (mobile top bar is too tight for a third icon)

### Visual
- `Heart` icon from lucide-react
- Badge showing count (same style as cart badge: white bg, teal text, rounded-full)
- Badge hidden when count = 0

### Behavior
- Click opens favorites drawer (right side, same pattern as CartSheet)

---

## 9. Favorites — Drawer

### Content
- Header: "Favoritos (N)" + close button
- List of favorited products, each showing:
  - Product thumbnail (linked to product page)
  - Product title (linked to product page)
  - Price
  - Availability: "En stock" (green) or "Agotado" (red)
  - "Agregar al carrito" button (disabled if out of stock)
  - Remove button (trash icon)
- Empty state: heart icon + "No tenés favoritos aún" + "Explorar productos" button
- Footer: "Ver todos →" link to `/cuenta/favoritos`

### Loading State
- While product data is being fetched: show skeleton cards (image placeholder + text lines) matching the product card layout
- Error state: "No se pudieron cargar los productos" with retry button

### Data Fetching
- Wishlist stores product IDs
- Drawer needs to fetch product data (title, price, image, availability) for each ID
- Use Shopify `nodes` query to batch-fetch products by ID
- Cache results in SWR or local state

---

## 10. Favorites — Full Page (`/cuenta/favoritos`)

### Display
- Uses `ProductGrid` component (existing) filtered to favorited products
- Each card has the existing `FavoriteButton` (already toggling correctly)
- "Agregar al carrito" action available on each card
- Empty state if no favorites

---

## 11. Favorites — Shopify Sync

### Strategy
- **Not logged in:** localStorage only (current behavior preserved)
- **Logged in:** sync with Shopify customer metafield `custom.wishlist`
  - Metafield type: `json` (array of product GIDs)
  - On login: merge localStorage wishlist + Shopify metafield → deduplicate → persist to both
  - On toggle: update both localStorage and Shopify metafield
  - On logout: keep localStorage as-is (user keeps local favorites)

### Implementation
- **Reading wishlist:** Add `metafield(namespace: "custom", key: "wishlist")` to `getCustomerQuery` — this works via Storefront API.
- **Writing wishlist:** The `customerMetafieldsSet` mutation is **Admin API only**, not available on Storefront API. Use a proxy API route:
  - New route: `POST /api/wishlist/sync` — accepts `{ productIds: string[] }`, reads `customerAccessToken` from cookie, uses Admin API to write the `custom.wishlist` metafield on the customer.
  - Server-side only, Admin token never exposed to client.
- Modify `WishlistProvider` to:
  - **Not** accept token as prop (security: token stays server-side)
  - On mount: call server action `getWishlist()` that reads cookie + fetches customer metafield via Storefront API
  - On toggle: optimistic UI update (instant localStorage + UI), then debounced server action `syncWishlist()` that calls `/api/wishlist/sync` (500ms debounce)
  - On login merge: server action fetches Shopify wishlist, merges with localStorage, persists merged result to both

### Server Actions (new in `src/app/cuenta/actions.ts`)
- `syncWishlist(productIds: string[])` — saves array to customer metafield
- `getWishlist()` — reads customer wishlist metafield

---

## 12. Cambiar Contraseña (`/cuenta/cambiar-password`)

### Form
- New password input (min 5 chars)
- Confirm password input
- Submit button

### Notes
- Shopify Storefront API `customerUpdate` mutation accepts `password` field directly
- No "current password" verification available via Storefront API
- The user is already authenticated (has valid token), so this is acceptable

### Server Action
- Uses `customerUpdateMutation` with `{ password: newPassword }`

---

## 13. Existing Code to Modify

| File | Change |
|------|--------|
| `src/app/cuenta/page.tsx` | Replace with redirect to `/cuenta/perfil` |
| `src/app/cuenta/actions.ts` | Add wishlist sync actions, keep existing actions |
| `src/components/layout/Header.tsx` | Add Heart icon with badge + drawer trigger |
| `src/components/shop/WishlistProvider.tsx` | Add Shopify sync, accept token prop |
| `src/lib/customer.ts` | Extend `getCustomerQuery` for addresses + wishlist metafield, add metafield mutation |
| `src/app/layout.tsx` | Pass `isLoggedIn` boolean (not token) to WishlistProvider |

### New Files

| File | Purpose |
|------|---------|
| `src/app/cuenta/layout.tsx` | Dashboard layout with sidebar + auth guard |
| `src/app/cuenta/perfil/page.tsx` | Edit profile page |
| `src/app/cuenta/direcciones/page.tsx` | Address management page |
| `src/app/cuenta/mis-compras/page.tsx` | Order history list |
| `src/app/cuenta/mis-compras/[id]/page.tsx` | Order detail page |
| `src/app/cuenta/favoritos/page.tsx` | Full favorites page |
| `src/app/cuenta/cambiar-password/page.tsx` | Change password page |
| `src/components/shop/FavoritesSheet.tsx` | Favorites drawer (like CartSheet) |
| `src/components/shop/AddressCard.tsx` | Address card component |
| `src/components/shop/AddressForm.tsx` | Address add/edit modal form |
| `src/components/shop/OrderDetail.tsx` | Order detail with timeline |
| `src/components/shop/OrderTimeline.tsx` | Visual order status timeline |
| `src/app/api/wishlist/sync/route.ts` | Admin API proxy for wishlist metafield writes |

---

## 14. Auth Guard & Token Expiry

All `/cuenta/*` routes share a single auth guard in `src/app/cuenta/layout.tsx`:
1. Read `customerAccessToken` cookie
2. If absent → redirect to `/login`
3. If present → validate by querying Shopify customer (lightweight query)
4. If Shopify returns null/error (expired token) → delete cookie, redirect to `/login`

This centralizes auth logic instead of repeating in every page.

---

## 15. Design Tokens

- Primary color: `#21645d` (teal — existing)
- Secondary color: `#ef7c1c` (orange — existing)
- Favorites red: `#ef4444` (existing from FavoriteButton)
- Status colors: yellow (`#f59e0b`), blue (`#3b82f6`), green (`#22c55e`), red (`#ef4444`), gray (`#6b7280`)
- Sidebar width: 240px desktop
- Card border radius: existing design system (rounded-lg / rounded-xl)
- All using existing Tailwind utilities + Radix primitives
