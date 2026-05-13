# CompraHogar — Mobile Premium Pass: Sidebar (X-style) + Product Cards (McDonald's-style)

**Date:** 2026-05-13
**Status:** Draft — pending user review
**Scope:** Redesign of the mobile storefront menu (`MobileMenu`) with X/Twitter-inspired UX and the product card (`ProductCard`) with McDonald's-app-inspired minimalism. Mobile-first; desktop layouts stay untouched.

---

## 1. Overview

Two surfaces of the storefront feel "web-mobile" rather than "native premium": the hamburger drawer and the product cards. This pass redesigns both with two well-known references so the storefront feels closer to a high-quality consumer app.

### Goals
- **Sidebar:** match X/Twitter's information density, spacing, and gesture model. Edge-swipe to open. Grabber to indicate dismissibility. Personal feel via profile header + live stats.
- **Cards:** match McDonald's-app calm: 1:1 image hero, no chrome, no card noise. Keep only the signals that drive conversion (price, discount when present).
- Both changes are mobile-only — desktop behavior of `MegaMenu` and the desktop grid card layout do not change in this pass.

### Out of Scope
- Sidebar of `/cuenta` (recently redesigned, separate concern).
- Header restructuring (sticky offsets, hide-on-scroll bar) — handled in a future pass.
- PWA / manifest / service worker (`tasks/plan-pwa.md` covers this separately).
- Bottom-sheet conversion for other modals (login, address forms) — separate pass.
- Animations beyond the drawer and card transitions defined here.

---

## 2. Sidebar — `MobileMenu` redesign

### 2.1 Visual system

| Token | Value | Notes |
|-------|-------|-------|
| Width | `min(85vw, 320px)` | Slightly narrower than today (was 360px) to match X density |
| Background | `bg-white` | Pure white |
| Top safe-area | `env(safe-area-inset-top)` + `46px` | Header padding |
| Bottom safe-area | `env(safe-area-inset-bottom)` + `12px` | Footer padding |
| Grabber | 4×40px, `bg-slate-300`, top-right inside drawer | Right side because drawer slides from left → user pulls from the right edge inward |
| Item height | `min-h-[52px]` | Was 56px; X uses tighter rows |
| Item padding | `px-5 py-3` | 20px horizontal, 12px vertical |
| Item gap (icon→label) | `gap-4` | 16px |
| Icon size | `26px`, stroke-1.75 | Lucide icons. Active state stroke-2 |
| Label typography | `text-[17px] font-semibold tracking-tight` | X-style 17px Semibold |
| Active state | `bg-primary/[0.08]` + label/icon in `text-primary` | Full-width pill, no inner radius |
| Section labels | `text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400`, `px-5 pt-3 pb-1` | Used by drilled-down views |

### 2.2 Root view structure

```
┌─────────────────────────────────┐ ← env(safe-area-inset-top)
│   Profile header (white)        │
│   ┌──────┐                      │
│   │ Avatar │ Nombre              │  ← if logged in: real avatar + name
│   └──────┘ email · @handle       │
│           ┌── stats row ──┐      │
│           │ 3 carrito  12 favs │  ← live counts from useCart / useWishlist
│           └────────────────┘      │
├─────────────────────────────────┤
│   Categorías (dynamic)          │
│   🧱 Obra Gruesa             ›   │
│   🎨 Terminaciones           ›   │
│   🔧 Herramientas            ›   │
│   ⚡ Electricidad            ›   │
│   ─────────────────────────────  │
│   ♥ Favoritos              [12]  │ → /cuenta/favoritos
│   📦 Mis pedidos                 │ → /cuenta/mis-compras
│   👤 Mi cuenta                   │ → /cuenta
├─────────────────────────────────┤
│   Footer (bg-neutral-50)        │
│   Ayuda · Envíos  [WhatsApp]    │
└─────────────────────────────────┘ ← env(safe-area-inset-bottom)
```

### 2.3 Profile header — logged-in vs guest

**Logged in** (`useCustomer()` returns a customer):
- Avatar: 44px gradient circle with first initial, OR Shopify customer image if available.
- Name: `firstName + lastName` (or just `firstName` if no last).
- Sub-line: customer email in `text-[13px] text-slate-500`.
- Stats row: `<strong>{cartCount}</strong> carrito · <strong>{favoritesCount}</strong> favoritos`. Stats read from `useCart()` and `useWishlist()` hooks. Tap on either takes you to `/carrito` or `/cuenta/favoritos`.

**Guest** (no customer):
- Avatar: 44px `bg-slate-100` with a gray user-outline icon.
- Name: `"Invitado"`.
- Sub-line: `"Ingresá para ver tus pedidos"`.
- Stats row hidden. Replaced by single full-width CTA `<Button size="sm">Iniciar sesión</Button>` linking to `/login?next=...`.

### 2.4 Category icons

Categories come from Shopify dynamically via `MAIN_COLLECTION_HANDLES`. To attach an icon to each, add an explicit mapping in `src/lib/constants/collectionHierarchy.ts`:

```ts
export const COLLECTION_ICONS: Record<string, LucideIcon> = {
  'obra-gruesa': Hammer,
  'terminaciones': PaintBucket,
  'herramientas': Wrench,
  'electricidad': Zap,
  // ...one entry per MAIN_COLLECTION_HANDLES handle
};
```

Fallback icon when handle is not in map: `Package` (Lucide). Icon color is `text-slate-700` idle, `text-primary` active.

### 2.5 Drill-down navigation

Keep the existing carousel-of-views model (views array + activeIndex transform). It works and is performant. Modifications:

- **Header on drilled views** changes from the current "Volver / X" two-button bar to: `‹ Volver` on left (primary color, 15px semibold), close `✕` on right (32px circle, slate-100 bg).
- **Drilled view title** moves to a dedicated row below the header: `text-[22px] font-bold tracking-tight px-5 py-3`. This replaces the current gray-50 banner with title + "Ver todo" link.
- The "Ver todo" link becomes the first item in the list as a normal row labeled "Ver todo" with chevron, separated from the rest by a divider.

### 2.6 Gesture: edge-swipe-to-open

Use Vaul's native edge-swipe via the `Drawer.Root` `snapPoints` / `directionalAreaWidth` API (or equivalent). Implementation:

- Detection zone: **48px from the left edge** of the viewport.
- Velocity-based open: if swipe velocity > 0.4 OR swipe distance > 30% of drawer width, snap open. Otherwise snap back.
- Only active when no drawer is currently open and no other modal/sheet is visible (z-index check).
- Disabled on PDPs where the image gallery has horizontal swipe (gallery wins via `touch-action: pan-y` on its container, leaving 48px outside the gallery for drawer detection).
- Native browser back-swipe on iOS: the 20px iOS-reserved zone always wins. Our 48px starts from 20px in. So usable zone is effectively 20–48px (28px wide), which is enough.

### 2.7 Gesture: drag-to-close

Vaul handles this natively when `direction="left"`. Confirm the grabber on the right edge of the drawer provides visual affordance (4×40px slate-300 pill).

### 2.8 Animation

Keep current CSS-based drill-down transitions (`transition-transform duration-300 ease-in-out`). Do not introduce framer-motion. The drawer open/close itself is Vaul's spring physics.

---

## 3. Product Card — `ProductCard` redesign

### 3.1 Visual system

| Token | Value | Notes |
|-------|-------|-------|
| Card bg | `bg-white` | |
| Card border | none | Remove `border border-slate-100` |
| Card shadow idle | `shadow-[0_1px_2px_rgba(0,0,0,0.03)]` | Barely-there |
| Card shadow hover | `shadow-[0_6px_20px_-8px_rgba(0,0,0,0.12)]` (desktop only) | Mobile has no hover state — relies on `active:` instead |
| Card radius | `rounded-2xl` (18px) | Up from rounded-xl |
| Card padding | `p-0`, info section `px-3 pt-3 pb-3.5` | Tighter than today |
| Image aspect | `aspect-square` (1:1) | Was `aspect-[4/3]` |
| Image bg | `bg-gradient-to-b from-white to-slate-50` | Subtle product-on-paper feel |
| Image padding | `p-3 sm:p-4 lg:p-5` | object-contain leaves white space |
| Title typography | `text-[14px] font-medium text-slate-900 leading-snug line-clamp-2` | Regular weight (Cal Sans applies via h-tags only, so this stays in Inter) |
| Price | `text-[17px] font-bold text-slate-900 tracking-tight` | |
| Old price (strikethrough) | `text-[12px] font-medium text-slate-400 line-through` | Inline next to price |
| Discount badge | `bg-red-500 text-white text-[11px] font-bold tracking-tight px-2 py-0.5 rounded-full` | "−20%" minus sign, not hyphen |
| Heart favorite icon | 18px outline, `text-slate-400`, fill+`text-red-500` when active. Background `bg-white/80 backdrop-blur-sm rounded-full p-1.5` | Upper-right corner of image |
| Quick-add button | 32px circle, `bg-slate-900 text-white shadow-md`, `+` icon 20px | Bottom-right corner of image |

### 3.2 Card layout

```
┌──────────────────────────────┐
│ ┌──────┐         ┌─♥─┐       │ ← discount badge upper-left (when applicable)
│ │ -20% │                     │   heart upper-right (always)
│ └──────┘                     │
│                              │
│         [PRODUCT IMAGE]      │ ← 1:1, object-contain, white→slate-50 bg
│                              │
│                       ┌─┐    │
│                       │+│    │ ← quick-add bottom-right
│                       └─┘    │
├──────────────────────────────┤
│ Pintura Látex Interior        │ ← title, 2-line clamp, regular weight
│ Blanco 4L                     │
│                              │
│ $1.032   ̶$̶1̶.̶2̶9̶0̶                 │ ← price + struck old price (B variant)
└──────────────────────────────┘
```

### 3.3 Removed from card (vs current)

The following elements are stripped from the redesigned card. They live elsewhere:

| Element | Current location | New location |
|---------|------------------|--------------|
| Image carousel inside card | Inline `snap-x` scroller | **Single hero image** (use `featuredImage` or first image). Carousel only on PDP. |
| Pagination dots | Bottom of image | **Removed entirely** (no carousel) |
| Compare button (⋌) | Upper-right column | **PDP only** (compare action stays on detail page) |
| Rating widget (Judge.me) | Bottom of info block | **PDP only**. Eliminates 18px placeholder and CLS risk. |
| "12x ${installments} sin interés" | Info block | **PDP only**. Move to product detail for clarity. |
| "Envío gratis" pill | Info block | **PDP only** + collection-page banner ("Envío gratis en compras +$4.000") at the top of every collection. |
| ProductQuickView overlay | Mounted in image area | **Triggered from quick-add for multi-variant** (see 3.5) |

### 3.4 Grid layout

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| `<640px` (mobile) | **2-col** | `gap-3` (12px) |
| `sm` (640px) | 2-col | `gap-4` |
| `md` (768px) | 3-col | `gap-4` |
| `lg` (1024px+) | 4-col | `gap-5` |

Today mobile is 1-col → moving to 2-col is a defining piece of the McDonald's look.

### 3.5 Quick-add behavior (smart)

The `+` button calls a new helper `useQuickAdd(product)` that branches on variant count:

**Single-variant product** (`product.variants.edges.length === 1`):
1. Call `addToCart(variantId, 1)` directly.
2. Trigger toast: `<Toast>Agregado al carrito · {productTitle}</Toast>` (`role="status"`, 2.5s auto-dismiss, with a "Ver carrito" action).
3. Fire `navigator.vibrate(10)` if available (Android haptic).
4. Animate the cart icon in the header: scale 1 → 1.15 → 1 over 300ms (CSS transform).
5. Bump cart badge count optimistically; reconcile on server response.

**Multi-variant product** (`> 1`):
1. Open a **bottom-sheet variant picker** (new component `<VariantBottomSheet>`).
2. Pre-select first available variant.
3. User picks variant + quantity, taps "Agregar".
4. Same toast + haptic flow as single-variant after submit.

**Out-of-stock product**:
- Quick-add button is `disabled`, opacity 50%, shows lock icon instead of `+`. Tap shows toast "Sin stock".

### 3.6 Heart favorite behavior

- Tapping the heart toggles `useWishlist().toggleFavorite(productId)`.
- Optimistic: heart fills (`text-red-500`) immediately, fires `navigator.vibrate(10)`.
- No toast (the visual state change is enough feedback).
- Tap propagation: the heart button has `e.stopPropagation()` so it doesn't navigate to PDP.

### 3.7 Card tap target

- Entire card body (image + info, **excluding** heart and quick-add buttons) is a single `<Link>` to `/products/{handle}`.
- Heart and quick-add buttons are absolutely positioned siblings inside the link's container with `pointer-events-auto` and `z-10`.
- The link element has `tabIndex={0}` and `focus-visible:ring-2 focus-visible:ring-primary/40`.

---

## 4. Architecture & affected files

### 4.1 New components

| File | Purpose |
|------|---------|
| `src/components/layout/MobileMenu.tsx` | **Rewrite** with new visual system, profile header, gesture handling |
| `src/components/layout/MobileMenuProfileHeader.tsx` | New sub-component — handles logged-in/guest split |
| `src/components/shop/ProductCard.tsx` | **Rewrite** with new visual system, smart quick-add, heart icon |
| `src/components/shop/VariantBottomSheet.tsx` | New — bottom-sheet variant picker (Vaul `direction="bottom"`) |
| `src/components/shop/QuickAddButton.tsx` | New — encapsulates the smart quick-add logic + animations |
| `src/hooks/useQuickAdd.ts` | New hook — branches on variant count, handles toast + haptic + cart bump |

### 4.2 Modified files

| File | Change |
|------|--------|
| `src/lib/constants/collectionHierarchy.ts` | Add `COLLECTION_ICONS` map |
| `src/components/shared/Header.tsx` | Wire `MobileMenu` to react to global edge-swipe gesture (new `useEdgeSwipe` hook OR Vaul edge prop) |
| `src/components/shop/ProductGrid.tsx` | Update grid breakpoints (2-col mobile) and pass `priority` to first 4 cards |
| `src/components/shop/ProductCardSkeleton.tsx` | Update skeleton to match new 1:1 aspect + 2-col layout |
| `src/app/globals.css` | Add safe-area utilities (`.pt-safe`, `.pb-safe`, `.px-safe`) |

### 4.3 Components reused (no change)

- `useCustomer()` — already returns the data we need for the profile header.
- `useWishlist()` — already exposes `count` + `toggleFavorite`.
- `useCart()` — already exposes cart count and `addToCart`.
- Vaul `Drawer` — keep for both MobileMenu and VariantBottomSheet.
- `<Button>`, `<Toast>` from `src/components/ui/` — reuse as-is.

---

## 5. Implementation notes

### 5.1 Safe-area handling

Add to `globals.css`:

```css
@layer utilities {
  .pt-safe { padding-top: env(safe-area-inset-top); }
  .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
  .pl-safe { padding-left: env(safe-area-inset-left); }
  .pr-safe { padding-right: env(safe-area-inset-right); }
  .px-safe { padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }
  .top-safe { top: env(safe-area-inset-top); }
  .bottom-safe { bottom: env(safe-area-inset-bottom); }
}
```

Apply to: `MobileMenu` (top + bottom), `WhatsAppButton` (bottom-right needs `bottom-[calc(1.25rem+env(safe-area-inset-bottom))]`), `ProductView` bottom CTA (already does this; verify), and any future bottom sheets.

### 5.2 Edge-swipe-to-open

Vaul does not expose a built-in edge-swipe-to-open API — its drawer is opened by tapping the trigger or programmatically via `open` prop. We implement a global edge-swipe listener that flips the `isOpen` state of the drawer when a left-edge swipe is detected.

Implementation in a new `<EdgeSwipeOpener>` component mounted at root inside `src/app/layout.tsx`:

```ts
useEffect(() => {
  let startX = 0;
  let startY = 0;
  let started = false;
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t.clientX <= 48) {
      startX = t.clientX;
      startY = t.clientY;
      started = true;
    }
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!started) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = Math.abs(t.clientY - startY);
    if (dx > 80 && dy < 40) {
      started = false;
      setMenuOpen(true);
    }
  };
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  return () => { /* cleanup */ };
}, []);
```

Disable when any drawer/modal is already open. Detection: query the DOM at swipe start for elements with `data-vaul-drawer` or `[role="dialog"][data-state="open"]` — if any are present, ignore the swipe. This avoids needing a global state store for a one-off check.

### 5.3 Quick-add toast

The toast component should not block the rest of the UI. Mount at `<Toaster>` provider level (probably `src/app/layout.tsx`). Position: `bottom-[calc(70px+env(safe-area-inset-bottom))]` on mobile so it stacks above sticky CTAs. Single toast at a time — new toasts replace old.

### 5.4 Bottom-sheet variant picker

New component using Vaul `<Drawer.Root direction="bottom">`. Layout:

```
┌─────────────────────────────┐
│       ─────                  │ ← grabber 4×36px slate-300
│                              │
│ Pintura Látex Interior 4L    │ ← product title
│ ────────────────────────     │
│ Color                         │
│ [Blanco]  [Marfil] [Gris]    │ ← variant option pills
│ Tamaño                        │
│ [1L]  [4L]  [10L]             │
│                              │
│ Cantidad: − 1 +              │
│                              │
│ ┌────────────────────────┐  │
│ │ Agregar — $1.290        │  │ ← full-width primary button
│ └────────────────────────┘  │
│         (safe-area-bottom)    │
└─────────────────────────────┘
```

Auto-height capped at 70vh; scrolls internally if more variants. Swipe-down or backdrop tap closes.

### 5.5 Image priority

In `ProductGrid` (or wherever the card is rendered as a list):

```tsx
{products.map((p, i) => (
  <ProductCard key={p.id} product={p} priority={i < 4} />
))}
```

First 4 cards (above-fold on mobile 2-col) get `priority` → Next.js Image preloads them.

### 5.6 Reduced motion

Respect `prefers-reduced-motion`:
- Cart icon scale animation: disabled.
- Toast slide-in: instant fade instead.
- Drawer transitions: Vaul handles this automatically.

---

## 6. Testing checklist

### 6.1 Sidebar
- [ ] Edge-swipe from 48px zone opens drawer on iOS Safari, Android Chrome, Android Firefox.
- [ ] Edge-swipe ignored when another modal is open.
- [ ] Edge-swipe disabled inside PDP gallery zone (horizontal scroll not hijacked).
- [ ] Drag-to-close (slide drawer left) closes it.
- [ ] Drawer respects `env(safe-area-inset-top)` on iPhone with notch.
- [ ] Logged-in profile header shows correct name, email, and live stats.
- [ ] Guest profile header shows "Invitado" + "Iniciar sesión" CTA.
- [ ] Tapping favorites stat row goes to `/cuenta/favoritos`.
- [ ] Tapping cart stat row goes to `/carrito`.
- [ ] Drill-down navigation works and back button returns to root.
- [ ] Close button (`✕`) closes from any depth.
- [ ] No layout shift when categories load asynchronously.
- [ ] All items have `min-h-[52px]` (≥44px tap target).
- [ ] Screen reader reads "Menú principal" on open, items have proper labels.

### 6.2 Product card
- [ ] Quick-add `+` on single-variant adds to cart, shows toast, fires haptic.
- [ ] Quick-add `+` on multi-variant opens bottom-sheet picker.
- [ ] Out-of-stock products show disabled state.
- [ ] Heart toggle works optimistically; persists across page reload (localStorage).
- [ ] Heart tap doesn't navigate to PDP (event.stopPropagation).
- [ ] Mobile grid renders 2-col, items have ≥44px tap targets.
- [ ] First 4 cards have `priority` (no LCP regression).
- [ ] Discount badge "−20%" renders only when `compareAtPrice > price`.
- [ ] No CLS from Judge.me widget (removed from card).
- [ ] Cards render identically on home/collection/search/recently-viewed pages.
- [ ] Skeleton matches new aspect-square 2-col layout.

### 6.3 Performance
- [ ] LCP on `/collections/[handle]` ≤ 2.5s on simulated 4G.
- [ ] No DOM nodes > 1500 on a 24-product grid.
- [ ] Memory after 30s of cart open/close cycles is stable (no leaks).

### 6.4 Accessibility
- [ ] Focus-visible ring on every interactive element.
- [ ] Color contrast ≥ 4.5:1 on text, ≥ 3:1 on icons.
- [ ] Heart and quick-add buttons have descriptive `aria-label`s ("Agregar a favoritos" / "Quitar de favoritos" / "Agregar al carrito").
- [ ] Bottom-sheet variant picker is keyboard navigable (Tab, Enter, Esc).
- [ ] Reduced-motion mode skips scale animations and slide transitions.

---

## 7. Open questions

None — all clarifying decisions captured during brainstorming.

---

## 8. References

- Current `MobileMenu`: `src/components/layout/MobileMenu.tsx`
- Current `ProductCard`: `src/components/shop/ProductCard.tsx`
- Cuenta sidebar patterns: `CLAUDE.md` (project root) — section "Account Section Patterns"
- Vaul drawer docs: https://vaul.emilkowal.ski/
- Project tech stack reference: project root `CLAUDE.md`
