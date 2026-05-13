# Mobile Sidebar (X-style) + Product Cards (McDonald's-style) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the storefront's mobile drawer (`MobileMenu`) and product cards (`ProductCard`) to a premium mobile look anchored on X/Twitter's sidebar UX and McDonald's-app card minimalism. Mobile-only — desktop unchanged.

**Architecture:** Foundational utilities first (safe-area CSS, Toast provider wiring, category icon map). Then sidebar rewrite (profile header + new visual system + drill-down preserved + global edge-swipe-to-open). Then product card foundation (smart quick-add hook + variant bottom-sheet + button) and finally the card visual rewrite, skeleton, and grid breakpoint changes.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · Vaul (drawer) · Lucide icons · existing `useCart` / `useWishlist` / `useCustomer` / `useToast` hooks · Vitest (only for the new `useQuickAdd` hook — components are verified manually with Chrome DevTools mobile emulation, in line with existing project pattern).

**Spec:** `docs/superpowers/specs/2026-05-13-mobile-sidebar-and-cards-design.md`

---

## File Structure

### New files

| Path | Responsibility |
|------|----------------|
| `src/components/layout/MobileMenuProfileHeader.tsx` | Profile header sub-component: avatar + name + stats OR guest CTA |
| `src/components/layout/EdgeSwipeOpener.tsx` | Global touch listener that opens the mobile drawer on left-edge swipe |
| `src/components/shop/VariantBottomSheet.tsx` | Bottom-sheet variant picker triggered for multi-variant quick-add |
| `src/components/shop/QuickAddButton.tsx` | The black "+" button rendered inside `ProductCard` |
| `src/hooks/useQuickAdd.ts` | Hook that branches add-to-cart behavior on variant count + fires toast + haptic |
| `src/__tests__/hooks/useQuickAdd.test.ts` | Vitest tests for the hook's branching logic |

### Modified files

| Path | Change |
|------|--------|
| `src/app/globals.css` | Add safe-area utility classes (`.pt-safe`, `.pb-safe`, etc.) |
| `src/app/layout.tsx` | Wrap children with `<ToastProvider>` + mount `<EdgeSwipeOpener>` |
| `src/components/shared/WhatsAppButton.tsx` | Use safe-area-aware bottom offset |
| `src/lib/constants/collectionHierarchy.ts` | Add `COLLECTION_ICONS` map (Lucide icon per main handle) |
| `src/components/layout/MobileMenu.tsx` | Full visual rewrite + integration with profile header |
| `src/components/shop/ProductCard.tsx` | Full visual rewrite: 1:1 image, heart, quick-add, strip noise |
| `src/components/shop/ProductCardSkeleton.tsx` | Update to match new 1:1 aspect + 2-col layout |
| `src/components/shop/ProductGrid.tsx` | Grid breakpoints (2-col on mobile) + pass `priority` to first 4 cards |

### Dependencies between files

```
globals.css (safe-area utils)        ─┐
ToastProvider mounted in layout.tsx  ─┼─► everything below depends on these
COLLECTION_ICONS map                 ─┘

MobileMenuProfileHeader.tsx  ─┐
                              ├─► MobileMenu.tsx ──► EdgeSwipeOpener.tsx
COLLECTION_ICONS              ┘

useQuickAdd.ts ──► QuickAddButton.tsx ─┐
VariantBottomSheet.tsx ────────────────┼─► ProductCard.tsx ──► ProductGrid.tsx
                                       │                    └► ProductCardSkeleton.tsx
```

---

## Phase 0 — Foundation

### Task 1: Safe-area utility classes in `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Inspect current `globals.css` end-of-file to choose insertion point**

Run:
```bash
tail -30 src/app/globals.css
```
Find the last `@layer utilities { ... }` block (or end of file if none).

- [ ] **Step 2: Append a new `@layer utilities` block with safe-area helpers**

Append at the end of `src/app/globals.css`:

```css
@layer utilities {
  .pt-safe { padding-top: env(safe-area-inset-top); }
  .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
  .pl-safe { padding-left: env(safe-area-inset-left); }
  .pr-safe { padding-right: env(safe-area-inset-right); }
  .px-safe {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
  .py-safe {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .top-safe { top: env(safe-area-inset-top); }
  .bottom-safe { bottom: env(safe-area-inset-bottom); }
  /* For elements that need extra spacing ABOVE the safe area (e.g. floating buttons). */
  .bottom-safe-offset-5 {
    bottom: calc(1.25rem + env(safe-area-inset-bottom));
  }
}
```

- [ ] **Step 3: Verify the build still compiles**

Run:
```bash
pnpm build 2>&1 | tail -20
```
Expected: no Tailwind/PostCSS errors. If `pnpm build` is slow, run `pnpm dev` and visit any page; the CSS will be regenerated.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(css): agregar utilidades safe-area para iOS notch/home indicator"
```

---

### Task 2: Mount `ToastProvider` in `src/app/layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Locate the provider stack in `src/app/layout.tsx`**

Run:
```bash
grep -n "CartProvider\|WishlistProvider" src/app/layout.tsx
```

Expected output around lines 247–261 (CartProvider → WishlistProvider).

- [ ] **Step 2: Add the import for `ToastProvider`**

Find the import block at the top of `src/app/layout.tsx` (the imports for `CartProvider` and `WishlistProvider` are on lines 8–9). Add right below them:

```tsx
import { ToastProvider } from "@/components/ui/toast";
```

- [ ] **Step 3: Wrap the existing children with `<ToastProvider>` inside `<WishlistProvider>`**

Locate the block:
```tsx
<CartProvider customerAccessToken={customerAccessToken}>
  <WishlistProvider isLoggedIn={isLoggedIn}>
    {/* existing children */}
  </WishlistProvider>
</CartProvider>
```

Modify to:
```tsx
<CartProvider customerAccessToken={customerAccessToken}>
  <WishlistProvider isLoggedIn={isLoggedIn}>
    <ToastProvider>
      {/* existing children unchanged */}
    </ToastProvider>
  </WishlistProvider>
</CartProvider>
```

Keep the existing children verbatim — do not touch their indentation or content.

- [ ] **Step 4: Smoke-test in dev server**

Run:
```bash
pnpm dev
```
Open `http://localhost:3000` and confirm the homepage loads with no errors in the browser console.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(layout): montar ToastProvider en el shell raiz"
```

---

### Task 3: Apply safe-area to `WhatsAppButton`

**Files:**
- Modify: `src/components/shared/WhatsAppButton.tsx`

- [ ] **Step 1: Locate the fixed positioning class**

Run:
```bash
grep -n "bottom-5 right-5" src/components/shared/WhatsAppButton.tsx
```
Expected: one match around line 15 — `<div className="fixed bottom-5 right-5 z-[100] flex items-end gap-2">`.

- [ ] **Step 2: Replace `bottom-5` with the safe-area-aware utility**

Change:
```tsx
<div className="fixed bottom-5 right-5 z-[100] flex items-end gap-2">
```
To:
```tsx
<div className="fixed bottom-safe-offset-5 right-5 z-[100] flex items-end gap-2">
```

Leave the rest of the file untouched.

- [ ] **Step 3: Manual verify in iOS simulator viewport**

Run `pnpm dev` and in Chrome DevTools enable device emulation (iPhone 14 Pro). With "Show device frame" on, scroll to the bottom of any page and confirm the WhatsApp bubble sits above the home-indicator area, not behind it.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/WhatsAppButton.tsx
git commit -m "fix(whatsapp): respetar safe-area-inset-bottom en iPhone con home indicator"
```

---

### Task 4: Add `COLLECTION_ICONS` map in `collectionHierarchy.ts`

**Files:**
- Modify: `src/lib/constants/collectionHierarchy.ts`

- [ ] **Step 1: Read current contents to see exported names**

Run:
```bash
cat src/lib/constants/collectionHierarchy.ts
```
Note the existing `MAIN_COLLECTION_HANDLES` array — those are the keys we need icons for.

- [ ] **Step 2: Append the icon map**

At the end of `src/lib/constants/collectionHierarchy.ts`, append:

```ts
import {
  Hammer,
  PaintBucket,
  Wrench,
  Zap,
  Droplets,
  Sofa,
  Lightbulb,
  Package,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon per main collection handle. Falls back to `Package` if a handle is not
 * present in this map. The icon renders on the LEFT of each item in
 * MobileMenu's root view at 26px.
 */
export const COLLECTION_ICONS: Record<string, LucideIcon> = {
  "obra-gruesa": Hammer,
  "terminaciones": PaintBucket,
  "herramientas": Wrench,
  "electricidad": Zap,
  "sanitarios": Droplets,
  "muebles": Sofa,
  "iluminacion": Lightbulb,
};

/**
 * Helper that returns the icon for a collection handle, or `Package` if no
 * mapping exists. Always returns a valid `LucideIcon` — never undefined.
 */
export function getCollectionIcon(handle: string): LucideIcon {
  return COLLECTION_ICONS[handle] ?? Package;
}
```

After saving, open `src/lib/constants/collectionHierarchy.ts` and confirm that:
1. The map covers every handle present in `MAIN_COLLECTION_HANDLES`. If `MAIN_COLLECTION_HANDLES` lists handles not present here, add them to the map.
2. The `lucide-react` import is the only new import added.

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```bash
pnpm tsc --noEmit 2>&1 | tail -20
```
Expected: no new errors related to `collectionHierarchy.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants/collectionHierarchy.ts
git commit -m "feat(collections): mapping de iconos Lucide por handle de coleccion principal"
```

---

## Phase 1 — Sidebar redesign

### Task 5: Build `MobileMenuProfileHeader` sub-component

**Files:**
- Create: `src/components/layout/MobileMenuProfileHeader.tsx`

- [ ] **Step 1: Inspect the customer hook shape**

Run:
```bash
grep -n "interface Customer\|type Customer\|firstName\|email" src/hooks/useCustomer.ts | head -20
```
Note the property names used (`firstName`, `lastName`, `email`). If `useCustomer` returns `{ customer, isLoading, mutate }`, the component must handle the `isLoading` and `customer === null` cases.

- [ ] **Step 2: Create the component file with logged-in + guest variants**

Create `src/components/layout/MobileMenuProfileHeader.tsx`:

```tsx
"use client";

import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/shop/WishlistProvider";

interface MobileMenuProfileHeaderProps {
  onClose: () => void;
}

export function MobileMenuProfileHeader({ onClose }: MobileMenuProfileHeaderProps) {
  const { customer, isLoading } = useCustomer();
  const { totalQuantity } = useCart();
  const wishlist = useWishlist();
  const wishlistCount = wishlist?.count ?? 0;

  // Skeleton while customer fetch is in-flight to avoid layout flash
  if (isLoading) {
    return (
      <div className="px-5 pt-safe pb-4 border-b border-neutral-100">
        <div className="mt-12 h-11 w-11 rounded-full bg-slate-100 animate-pulse" />
        <div className="mt-3 h-4 w-32 rounded bg-slate-100 animate-pulse" />
        <div className="mt-1.5 h-3 w-44 rounded bg-slate-100 animate-pulse" />
      </div>
    );
  }

  // Guest state
  if (!customer) {
    return (
      <div className="px-5 pt-safe pb-4 border-b border-neutral-100">
        <div className="mt-12 flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
            aria-hidden
          >
            <UserIcon size={22} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-900 tracking-tight">Invitado</p>
            <p className="text-[13px] text-slate-500">Ingresá para ver tus pedidos</p>
          </div>
        </div>
        <Link
          href="/login"
          onClick={onClose}
          className="mt-3 inline-flex items-center justify-center w-full h-10 rounded-lg bg-primary text-white text-[14px] font-semibold active:bg-primary/90 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  // Logged-in state
  const initial = (customer.firstName?.[0] ?? customer.email?.[0] ?? "?").toUpperCase();
  const displayName = customer.firstName
    ? `${customer.firstName}${customer.lastName ? ` ${customer.lastName}` : ""}`
    : "Mi cuenta";

  return (
    <div className="px-5 pt-safe pb-4 border-b border-neutral-100">
      <div className="mt-12">
        <div
          className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-[17px]"
          aria-hidden
        >
          {initial}
        </div>
        <p className="mt-3 text-[16px] font-bold text-slate-900 tracking-tight">
          {displayName}
        </p>
        {customer.email && (
          <p className="text-[13px] text-slate-500 truncate">{customer.email}</p>
        )}
        <div className="mt-3 flex gap-4 text-[12px] text-slate-600">
          <Link
            href="/carrito"
            onClick={onClose}
            className="hover:text-primary transition-colors"
          >
            <strong className="text-slate-900 font-bold">{totalQuantity}</strong> en carrito
          </Link>
          <Link
            href="/cuenta/favoritos"
            onClick={onClose}
            className="hover:text-primary transition-colors"
          >
            <strong className="text-slate-900 font-bold">{wishlistCount}</strong> favoritos
          </Link>
        </div>
      </div>
    </div>
  );
}
```

> **Note on `pt-safe + mt-12`:** Vaul renders the drawer below the system overlay area on some Androids; the `mt-12` (48px) reserves space for the notch/status bar even on devices where `safe-area-inset-top` is 0. This combo gives consistent spacing.

- [ ] **Step 3: Sanity-check the imports compile**

Run:
```bash
pnpm tsc --noEmit 2>&1 | grep -E "MobileMenuProfileHeader|useCustomer" | head -10
```
Expected: no errors. If `useCustomer` does not export `isLoading`, adjust the destructure to match the actual hook shape (e.g. drop the `isLoading` branch).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/MobileMenuProfileHeader.tsx
git commit -m "feat(mobile-menu): profile header con avatar/stats live + estado guest"
```

---

### Task 6: Rewrite `MobileMenu.tsx`

**Files:**
- Modify: `src/components/layout/MobileMenu.tsx`

This task replaces the entire file content. The existing nested-views logic (carousel translate-X drill-down) is **preserved verbatim** — only the rendered output changes.

- [ ] **Step 1: Read the current file to extract the drill-down logic we keep**

Run:
```bash
cat src/components/layout/MobileMenu.tsx
```
The `useState` block for `views`, `activeIndex`, `handlePush`, `handlePop`, and the `categories` `useMemo` block all stay. Only the JSX inside `<Drawer.Content>` changes.

- [ ] **Step 2: Replace the file with the rewritten version**

Overwrite `src/components/layout/MobileMenu.tsx`:

```tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Drawer } from "vaul";
import { ChevronRight, ChevronLeft, X, Menu, Package, HelpCircle } from "lucide-react";
import Link from "next/link";
import {
  COLLECTION_HIERARCHY,
  MAIN_COLLECTION_HANDLES,
  getCollectionIcon,
} from "@/lib/constants/collectionHierarchy";
import { MobileMenuProfileHeader } from "@/components/layout/MobileMenuProfileHeader";

type Category = {
  id: string;
  name: string;
  href?: string;
  handle?: string;
  children?: Category[];
};

interface MobileMenuProps {
  collections?: any[];
  /**
   * Optional controlled open state. If provided, MobileMenu becomes controlled
   * and ignores its own Trigger button. Used by EdgeSwipeOpener to open the
   * drawer in response to a global gesture.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function MobileMenu({
  collections = [],
  open,
  onOpenChange,
}: MobileMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? (open as boolean) : uncontrolledOpen;
  const setIsOpen = (next: boolean) => {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setUncontrolledOpen(next);
    }
  };

  // ---- Categories: same dynamic mapping as before ----
  const categories: Category[] = useMemo(() => {
    if (!collections || collections.length === 0) return [];
    const finalCategories: Category[] = [];

    MAIN_COLLECTION_HANDLES.forEach((handle) => {
      const mainCol = collections.find(
        (c) => c.handle === handle || c.handle === handle.split("-")[0]
      );
      if (mainCol) {
        const expectedSubs = COLLECTION_HIERARCHY[handle] || [];
        const foundSubs = expectedSubs.map((sub) => {
          const foundCol = collections.find((c) => c.handle === sub.handle);
          return {
            id: foundCol ? foundCol.id || foundCol.handle : sub.handle,
            name: foundCol ? foundCol.title : sub.name,
            href: `/collections/${sub.handle}`,
            handle: sub.handle,
          };
        });

        finalCategories.push({
          id: mainCol.id || mainCol.handle,
          name: mainCol.title,
          href: `/collections/${mainCol.handle}`,
          handle,
          children: foundSubs.length > 0 ? foundSubs : undefined,
        });
      }
    });

    return finalCategories;
  }, [collections]);

  // ---- Drill-down state (preserved logic) ----
  const initialView = { id: "root", name: "Inicio", items: categories };
  const [views, setViews] = useState<
    { id: string; name: string; items: Category[]; href?: string }[]
  >([initialView]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setViews((prev) => {
      const next = [...prev];
      next[0] = { id: "root", name: "Inicio", items: categories };
      return next;
    });
  }, [categories]);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setActiveIndex(0);
        setViews([{ id: "root", name: "Inicio", items: categories }]);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, categories]);

  const handlePush = (category: Category) => {
    if (category.children && category.children.length > 0) {
      const newView = {
        id: category.id,
        name: category.name,
        items: category.children,
        href: category.href,
      };
      const nextViews = [...views.slice(0, activeIndex + 1), newView];
      setViews(nextViews);
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePop = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const closeAndGo = () => setIsOpen(false);

  return (
    <Drawer.Root
      direction="left"
      open={isOpen}
      onOpenChange={setIsOpen}
      shouldScaleBackground
    >
      {!isControlled && (
        <Drawer.Trigger asChild>
          <button
            className="p-2 text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </Drawer.Trigger>
      )}

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />

        <Drawer.Content
          className="fixed bottom-0 left-0 top-0 z-[101] flex h-full w-[85vw] max-w-[320px] flex-col bg-white shadow-2xl outline-none"
        >
          <Drawer.Title className="sr-only">Navegación Móvil</Drawer.Title>
          <Drawer.Description className="sr-only">
            Menú principal de categorías
          </Drawer.Description>

          {/* Right-edge grabber (visual affordance for drag-to-close) */}
          <span
            aria-hidden
            className="absolute top-3 right-2 h-10 w-1 rounded-full bg-slate-300/80 z-10 pointer-events-none"
          />

          <div className="relative flex-1 w-full h-full overflow-hidden bg-white">
            <div
              className="flex h-full w-full transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
                width: `${Math.max(1, views.length) * 100}%`,
              }}
            >
              {views.map((view, index) => (
                <div
                  key={`${view.id}-${index}`}
                  className="h-full flex flex-col shrink-0 bg-white"
                  style={{ width: `${100 / Math.max(1, views.length)}%` }}
                  aria-hidden={index !== activeIndex}
                >
                  {index === 0 ? (
                    /* ---------- ROOT VIEW ---------- */
                    <>
                      <MobileMenuProfileHeader onClose={closeAndGo} />

                      <nav className="flex-1 overflow-y-auto overscroll-contain py-1">
                        <ul>
                          {view.items.map((item) => {
                            const Icon = item.handle
                              ? getCollectionIcon(item.handle)
                              : Package;
                            const hasChildren =
                              item.children && item.children.length > 0;
                            const content = (
                              <>
                                <Icon
                                  size={26}
                                  strokeWidth={1.75}
                                  className="text-slate-700 shrink-0"
                                />
                                <span className="text-[17px] font-semibold text-slate-900 tracking-tight">
                                  {item.name}
                                </span>
                                {hasChildren && (
                                  <ChevronRight
                                    size={20}
                                    className="ml-auto text-slate-300"
                                  />
                                )}
                              </>
                            );

                            return (
                              <li key={item.id}>
                                {hasChildren ? (
                                  <button
                                    onClick={() => handlePush(item)}
                                    className="w-full flex items-center gap-4 px-5 py-3 min-h-[52px] text-left active:bg-primary/[0.08] transition-colors"
                                  >
                                    {content}
                                  </button>
                                ) : (
                                  <Link
                                    href={item.href || "#"}
                                    onClick={closeAndGo}
                                    className="w-full flex items-center gap-4 px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                                  >
                                    {content}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ul>

                        {/* Account section divider */}
                        <div className="h-px bg-slate-100 my-2 mx-4" />
                        <p className="px-5 pt-2 pb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          Tu cuenta
                        </p>
                        <ul>
                          <li>
                            <Link
                              href="/cuenta/favoritos"
                              onClick={closeAndGo}
                              className="w-full flex items-center gap-4 px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                            >
                              <Package size={26} strokeWidth={1.75} className="text-slate-700" />
                              <span className="text-[17px] font-semibold text-slate-900 tracking-tight">
                                Mis pedidos
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/cuenta"
                              onClick={closeAndGo}
                              className="w-full flex items-center gap-4 px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                            >
                              <HelpCircle size={26} strokeWidth={1.75} className="text-slate-700" />
                              <span className="text-[17px] font-semibold text-slate-900 tracking-tight">
                                Mi cuenta
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </nav>

                      <div className="px-5 py-3 pb-safe border-t border-slate-100 bg-neutral-50/60 flex items-center justify-between">
                        <Link
                          href="/ayuda"
                          onClick={closeAndGo}
                          className="text-[13px] font-medium text-slate-600"
                        >
                          Ayuda · Envíos
                        </Link>
                        <a
                          href="https://wa.me/59896244003"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary text-white text-[13px] font-semibold px-3.5 py-1.5 rounded-full active:bg-primary/90 transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </>
                  ) : (
                    /* ---------- DRILLED VIEW ---------- */
                    <>
                      <div className="flex items-center justify-between px-3 pt-safe min-h-[56px] border-b border-slate-100 bg-white shrink-0">
                        <button
                          onClick={handlePop}
                          className="flex items-center text-primary font-semibold text-[15px] active:opacity-60 transition-opacity p-2 rounded-lg"
                        >
                          <ChevronLeft size={20} className="mr-1" />
                          Volver
                        </button>
                        <Drawer.Close asChild>
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-95 transition-all"
                            aria-label="Cerrar menú"
                          >
                            <X size={16} strokeWidth={2} />
                          </button>
                        </Drawer.Close>
                      </div>

                      <h2 className="px-5 pt-3 pb-2 text-[22px] font-bold text-slate-900 tracking-tight">
                        {view.name}
                      </h2>

                      <nav className="flex-1 overflow-y-auto overscroll-contain pb-safe">
                        <ul>
                          {view.href && (
                            <li>
                              <Link
                                href={view.href}
                                onClick={closeAndGo}
                                className="w-full flex items-center justify-between px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                              >
                                <span className="text-[16px] font-medium text-slate-700">
                                  Ver todo
                                </span>
                                <ChevronRight size={18} className="text-slate-300" />
                              </Link>
                            </li>
                          )}
                          {view.href && (
                            <li>
                              <div className="h-px bg-slate-100 mx-4" />
                            </li>
                          )}
                          {view.items.map((item) => (
                            <li key={item.id}>
                              <Link
                                href={item.href || "#"}
                                onClick={closeAndGo}
                                className="w-full flex items-center justify-between px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                              >
                                <span className="text-[16px] font-medium text-slate-700">
                                  {item.name}
                                </span>
                                <ChevronRight size={18} className="text-slate-300" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

> **Why `Package` is used twice in the account section:** "Mis pedidos" should ideally be a `ShoppingBag` icon and "Mi cuenta" a `UserCircle`. Both exist in `lucide-react`. After writing the file, replace `Package` with `ShoppingBag` in the "Mis pedidos" row and `UserCircle` in the "Mi cuenta" row, then add them to the lucide-react import line at the top.

- [ ] **Step 3: Replace the placeholder icons with proper ones**

Edit `src/components/layout/MobileMenu.tsx`:

1. In the import line `import { ChevronRight, ChevronLeft, X, Menu, Package, HelpCircle } from "lucide-react";` change to:
   ```tsx
   import { ChevronRight, ChevronLeft, X, Menu, Package, ShoppingBag, UserCircle } from "lucide-react";
   ```
2. In the "Mis pedidos" `<Link>`, change `<Package size={26}...` to `<ShoppingBag size={26}...`.
3. In the "Mi cuenta" `<Link>`, change `<HelpCircle size={26}...` to `<UserCircle size={26}...`.

- [ ] **Step 4: Verify TypeScript and bring up dev server**

Run:
```bash
pnpm tsc --noEmit 2>&1 | grep -E "MobileMenu" | head -10
pnpm dev
```
Expected: no TS errors related to MobileMenu. Dev server starts on `http://localhost:3000`.

- [ ] **Step 5: Manual mobile QA**

In Chrome DevTools, set device to iPhone 14 Pro. On `http://localhost:3000`:

1. Tap the hamburger button → drawer slides in from the left.
2. Confirm: avatar header at top, categories list with icons, "Tu cuenta" section, WhatsApp footer.
3. Tap a category with children (e.g. "Obra Gruesa") → carousel slides forward to the drilled view with "Volver" + title.
4. Tap "Volver" → returns to root.
5. Tap `✕` from any depth → drawer closes.
6. Drag the drawer to the left (or backdrop click) → closes via Vaul native behavior.
7. Confirm safe-area: top of profile header should not be flush with the system status bar on a notched device.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/MobileMenu.tsx
git commit -m "feat(mobile-menu): rediseno X-style con profile header, iconos y drill-down"
```

---

### Task 7: Build `EdgeSwipeOpener` and wire it into the layout

**Files:**
- Create: `src/components/layout/EdgeSwipeOpener.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/shared/Header.tsx` (only if it currently owns the `MobileMenu` instance — see Step 4)

- [ ] **Step 1: Locate where `MobileMenu` is currently mounted**

Run:
```bash
grep -rn "MobileMenu" src/app src/components | grep -v "\.test\." | head -10
```
Note the file and line where `<MobileMenu>` is rendered. It is currently uncontrolled — we need to convert that single instance to a controlled instance so `EdgeSwipeOpener` can toggle it.

- [ ] **Step 2: Create `EdgeSwipeOpener.tsx`**

Create `src/components/layout/EdgeSwipeOpener.tsx`:

```tsx
"use client";

import { useEffect } from "react";

const EDGE_ZONE_PX = 48;     // detection band from the left edge
const MIN_HORIZONTAL_PX = 80; // min horizontal travel before opening
const MAX_VERTICAL_PX = 40;   // max vertical drift to still count as a swipe

interface EdgeSwipeOpenerProps {
  onOpen: () => void;
}

export function EdgeSwipeOpener({ onOpen }: EdgeSwipeOpenerProps) {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let armed = false;

    const isAnyDrawerOpen = () => {
      // Vaul exposes [data-vaul-drawer] when its drawer is mounted.
      // Radix dialogs expose [role="dialog"][data-state="open"].
      return Boolean(
        document.querySelector('[data-vaul-drawer]') ||
          document.querySelector('[role="dialog"][data-state="open"]')
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isAnyDrawerOpen()) return;
      const t = e.touches[0];
      if (!t) return;
      if (t.clientX <= EDGE_ZONE_PX) {
        startX = t.clientX;
        startY = t.clientY;
        armed = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!armed) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      if (dx >= MIN_HORIZONTAL_PX && dy <= MAX_VERTICAL_PX) {
        armed = false;
        onOpen();
      }
    };

    const onTouchEnd = () => {
      armed = false;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [onOpen]);

  return null;
}
```

- [ ] **Step 3: Create a thin wrapper that owns the controlled state**

Since `EdgeSwipeOpener` and `MobileMenu` need to share an `isOpen` state but live in different parts of the tree, create a small bridge component `src/components/layout/MobileMenuShell.tsx`:

```tsx
"use client";

import { useState } from "react";
import MobileMenu from "@/components/layout/MobileMenu";
import { EdgeSwipeOpener } from "@/components/layout/EdgeSwipeOpener";

interface MobileMenuShellProps {
  collections?: any[];
}

export function MobileMenuShell({ collections }: MobileMenuShellProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EdgeSwipeOpener onOpen={() => setOpen(true)} />
      <MobileMenu collections={collections} open={open} onOpenChange={setOpen} />
    </>
  );
}
```

> **Trigger button visibility:** `MobileMenu` only renders its `Drawer.Trigger` when uncontrolled. Once we switch to the controlled `MobileMenuShell`, the hamburger button disappears. That is intentional only if the Header already renders its own hamburger button that calls `setOpen(true)`. Step 4 wires that.

- [ ] **Step 4: Update the Header to use the controlled shell**

Run:
```bash
grep -n "MobileMenu" src/components/shared/Header.tsx
```
Find the import and JSX usage of the old `MobileMenu` in `Header.tsx`. Replace:

```tsx
import MobileMenu from "@/components/layout/MobileMenu";
// ...
<MobileMenu collections={collections} />
```

With:

```tsx
import { MobileMenuShell } from "@/components/layout/MobileMenuShell";
// ...
<MobileMenuShell collections={collections} />
```

Then locate the existing hamburger button in `Header.tsx` (the one that currently triggers the drawer). It will no longer work since `MobileMenu` is now controlled. Two options:

**Option A (preferred):** Lift the hamburger button into `MobileMenuShell` so it owns both the trigger and the state. Modify `MobileMenuShell` to accept a `trigger?: React.ReactNode` slot OR render its own `<button>` with `onClick={() => setOpen(true)}`. The simplest: add a button rendered alongside the drawer:

```tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import MobileMenu from "@/components/layout/MobileMenu";
import { EdgeSwipeOpener } from "@/components/layout/EdgeSwipeOpener";

interface MobileMenuShellProps {
  collections?: any[];
}

export function MobileMenuShell({ collections }: MobileMenuShellProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>
      <EdgeSwipeOpener onOpen={() => setOpen(true)} />
      <MobileMenu collections={collections} open={open} onOpenChange={setOpen} />
    </>
  );
}
```

In `Header.tsx`, place `<MobileMenuShell ... />` exactly where the old `<MobileMenu ... />` was. The `<button>` inside the shell takes the place of the previous trigger.

- [ ] **Step 5: Manual QA**

Run `pnpm dev`. In Chrome DevTools mobile emulation:

1. Tap the hamburger → drawer opens.
2. Close the drawer.
3. Use the Touch tool in DevTools to drag from very near the left edge (x≈10) rightward by 80px+ in <300ms → drawer should open.
4. Drag from far from the left (x≈200) → drawer should NOT open.
5. Open the drawer, then attempt an edge swipe → drawer should not re-trigger (already open guard).

> **Limitation:** Chrome DevTools touch emulation does not perfectly mimic iOS's reserved 20px back-swipe zone. Final confirmation must happen on a real iPhone before merging.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/EdgeSwipeOpener.tsx src/components/layout/MobileMenuShell.tsx src/components/shared/Header.tsx
git commit -m "feat(mobile-menu): edge-swipe-to-open desde el borde izquierdo via shell controlado"
```

---

## Phase 2 — Product card foundation

### Task 8: TDD the `useQuickAdd` hook

**Files:**
- Create: `src/hooks/useQuickAdd.ts`
- Create: `src/__tests__/hooks/useQuickAdd.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/__tests__/hooks/useQuickAdd.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuickAdd } from "@/hooks/useQuickAdd";

// Minimal product shape — only the fields useQuickAdd reads
type Variant = { id: string; availableForSale: boolean };
type Product = {
  id: string;
  title: string;
  variants: { edges: { node: Variant }[] };
};

const mockAddToCart = vi.fn();
const mockToast = vi.fn();
const mockOpenSheet = vi.fn();

vi.mock("@/components/cart/CartProvider", () => ({
  useCart: () => ({ addToCart: mockAddToCart }),
}));

vi.mock("@/components/ui/toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

beforeEach(() => {
  mockAddToCart.mockReset();
  mockToast.mockReset();
  mockOpenSheet.mockReset();
});

function product(variants: Variant[]): Product {
  return {
    id: "gid://Product/1",
    title: "Pintura Látex 4L",
    variants: { edges: variants.map((v) => ({ node: v })) },
  };
}

describe("useQuickAdd", () => {
  it("adds the single variant directly when there is exactly one available variant", async () => {
    const p = product([{ id: "gid://Variant/1", availableForSale: true }]);
    const { result } = renderHook(() =>
      useQuickAdd({ openVariantSheet: mockOpenSheet })
    );

    await act(async () => {
      await result.current.quickAdd(p as any);
    });

    expect(mockAddToCart).toHaveBeenCalledWith("gid://Variant/1", 1);
    expect(mockOpenSheet).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining("Agregado") })
    );
  });

  it("opens the variant sheet when there are multiple variants", async () => {
    const p = product([
      { id: "gid://Variant/1", availableForSale: true },
      { id: "gid://Variant/2", availableForSale: true },
    ]);
    const { result } = renderHook(() =>
      useQuickAdd({ openVariantSheet: mockOpenSheet })
    );

    await act(async () => {
      await result.current.quickAdd(p as any);
    });

    expect(mockOpenSheet).toHaveBeenCalledWith(p);
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it("does not add when the only variant is sold out", async () => {
    const p = product([{ id: "gid://Variant/1", availableForSale: false }]);
    const { result } = renderHook(() =>
      useQuickAdd({ openVariantSheet: mockOpenSheet })
    );

    await act(async () => {
      await result.current.quickAdd(p as any);
    });

    expect(mockAddToCart).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Sin stock"),
        variant: "error",
      })
    );
  });

  it("treats variants with no availability data as available (defensive)", async () => {
    const p = product([{ id: "gid://Variant/1" } as Variant]);
    const { result } = renderHook(() =>
      useQuickAdd({ openVariantSheet: mockOpenSheet })
    );

    await act(async () => {
      await result.current.quickAdd(p as any);
    });

    expect(mockAddToCart).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Confirm `@testing-library/react` is installed**

Run:
```bash
grep "@testing-library/react" package.json
```
If absent, install it:
```bash
pnpm add -D @testing-library/react @testing-library/dom jsdom
```
Also confirm `vitest.config.ts` (or `vitest.config.mts`) sets `environment: "jsdom"`. If it doesn't, add it:
```ts
// vitest.config.ts
export default { test: { environment: "jsdom" } };
```

- [ ] **Step 3: Run tests to verify they fail**

Run:
```bash
pnpm test src/__tests__/hooks/useQuickAdd.test.ts
```
Expected: 4 failing tests with "Cannot find module '@/hooks/useQuickAdd'".

- [ ] **Step 4: Implement `useQuickAdd`**

Create `src/hooks/useQuickAdd.ts`:

```ts
"use client";

import { useCallback } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/ui/toast";
import type { ShopifyProduct } from "@/lib/types";

interface UseQuickAddOptions {
  /**
   * Called when the product has more than one variant and the picker should
   * be shown. Receives the full product so the bottom-sheet can render
   * option pills.
   */
  openVariantSheet: (product: ShopifyProduct) => void;
}

export function useQuickAdd({ openVariantSheet }: UseQuickAddOptions) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const quickAdd = useCallback(
    async (product: ShopifyProduct) => {
      const variants = product.variants?.edges?.map((e: any) => e.node) ?? [];
      const variantCount = variants.length;

      if (variantCount > 1) {
        openVariantSheet(product);
        return;
      }

      const variant = variants[0];
      if (!variant) {
        toast({
          title: "No se pudo agregar al carrito",
          variant: "error",
        });
        return;
      }

      // availableForSale === false explicitly means sold out.
      // undefined/null counts as available (defensive — most products have it set).
      if (variant.availableForSale === false) {
        toast({ title: "Sin stock", variant: "error" });
        return;
      }

      try {
        await addToCart(variant.id, 1);
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          (navigator as any).vibrate(10);
        }
        toast({
          title: `Agregado al carrito · ${product.title}`,
          variant: "success",
        });
      } catch (err) {
        toast({
          title: "Error agregando al carrito",
          description: "Intentá de nuevo en unos segundos.",
          variant: "error",
        });
      }
    },
    [addToCart, toast, openVariantSheet]
  );

  return { quickAdd };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run:
```bash
pnpm test src/__tests__/hooks/useQuickAdd.test.ts
```
Expected: 4 passing tests.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useQuickAdd.ts src/__tests__/hooks/useQuickAdd.test.ts
git commit -m "feat(hooks): useQuickAdd con branching variante-unica vs multi-variante"
```

---

### Task 9: Build `VariantBottomSheet`

**Files:**
- Create: `src/components/shop/VariantBottomSheet.tsx`

- [ ] **Step 1: Inspect Shopify variant data shape**

Run:
```bash
grep -n "selectedOptions\|options" src/lib/types.ts | head -10
```
Confirm `ShopifyProduct.options` exists (array of `{ name, values }`) and each variant has `selectedOptions: { name, value }[]`. If the type is different, adjust the component below to match.

- [ ] **Step 2: Create the component**

Create `src/components/shop/VariantBottomSheet.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/ui/toast";
import type { ShopifyProduct } from "@/lib/types";

interface VariantBottomSheetProps {
  product: ShopifyProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VariantBottomSheet({
  product,
  open,
  onOpenChange,
}: VariantBottomSheetProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Reset state every time a new product comes in
  useEffect(() => {
    if (!product) return;
    const first = product.variants?.edges?.[0]?.node;
    if (!first) return;
    const initial: Record<string, string> = {};
    first.selectedOptions?.forEach((o: any) => {
      initial[o.name] = o.value;
    });
    setSelectedOptions(initial);
    setQuantity(1);
  }, [product]);

  // Find the matching variant given the currently-selected options
  const matchedVariant = useMemo(() => {
    if (!product) return null;
    const variants = product.variants?.edges?.map((e: any) => e.node) ?? [];
    return (
      variants.find((v: any) =>
        v.selectedOptions?.every(
          (o: any) => selectedOptions[o.name] === o.value
        )
      ) ?? null
    );
  }, [product, selectedOptions]);

  if (!product) return null;

  const handleSubmit = async () => {
    if (!matchedVariant) return;
    setSubmitting(true);
    try {
      await addToCart(matchedVariant.id, quantity);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        (navigator as any).vibrate(10);
      }
      toast({
        title: `Agregado al carrito · ${product.title}`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Error agregando al carrito",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isUnavailable =
    matchedVariant?.availableForSale === false || !matchedVariant;
  const priceAmount = Number(matchedVariant?.price?.amount ?? 0);
  const priceLabel = priceAmount > 0
    ? `$${(priceAmount * quantity).toLocaleString("es-UY")}`
    : "—";

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[111] flex flex-col bg-white rounded-t-2xl max-h-[80vh] outline-none">
          <div className="mx-auto mt-3 mb-1 h-1.5 w-9 rounded-full bg-slate-300" />
          <Drawer.Title className="px-5 pt-2 pb-3 text-[18px] font-bold text-slate-900 tracking-tight">
            {product.title}
          </Drawer.Title>
          <div className="h-px bg-slate-100" />

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {product.options?.map((opt: any) => (
              <div key={opt.name}>
                <p className="text-[13px] font-semibold text-slate-700 mb-2">
                  {opt.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((value: string) => {
                    const isActive = selectedOptions[opt.name] === value;
                    return (
                      <button
                        key={value}
                        onClick={() =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [opt.name]: value,
                          }))
                        }
                        className={`min-h-[44px] px-4 rounded-full border text-[14px] font-medium transition-colors ${
                          isActive
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 active:bg-slate-50"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <p className="text-[13px] font-semibold text-slate-700 mb-2">Cantidad</p>
              <div className="inline-flex items-center gap-3 border border-slate-200 rounded-full px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center active:bg-slate-100"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className="text-[15px] font-semibold min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center active:bg-slate-100"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 pt-3 pb-safe border-t border-slate-100 bg-white">
            <button
              onClick={handleSubmit}
              disabled={isUnavailable || submitting}
              className="w-full h-12 rounded-full bg-primary text-white text-[15px] font-semibold active:bg-primary/90 disabled:opacity-50 disabled:bg-slate-400 transition-colors"
            >
              {isUnavailable
                ? "Sin stock"
                : submitting
                ? "Agregando…"
                : `Agregar — ${priceLabel}`}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

- [ ] **Step 3: TypeScript pass**

Run:
```bash
pnpm tsc --noEmit 2>&1 | grep "VariantBottomSheet" | head -10
```
Expected: no errors. If `product.options` is typed differently, adjust the `any` casts to match `ShopifyProduct` shape.

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/VariantBottomSheet.tsx
git commit -m "feat(shop): bottom-sheet picker de variantes con cantidad y safe-area"
```

---

### Task 10: Build `QuickAddButton`

**Files:**
- Create: `src/components/shop/QuickAddButton.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/shop/QuickAddButton.tsx`:

```tsx
"use client";

import { useState, type MouseEvent } from "react";
import { Plus, Lock } from "lucide-react";
import { useQuickAdd } from "@/hooks/useQuickAdd";
import { VariantBottomSheet } from "@/components/shop/VariantBottomSheet";
import type { ShopifyProduct } from "@/lib/types";

interface QuickAddButtonProps {
  product: ShopifyProduct;
  /**
   * When true, render the disabled lock icon and skip all interactivity.
   * Computed by ProductCard from `availableForSale` flags.
   */
  disabled?: boolean;
}

export function QuickAddButton({ product, disabled }: QuickAddButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState<ShopifyProduct | null>(null);
  const { quickAdd } = useQuickAdd({
    openVariantSheet: (p) => {
      setSheetProduct(p);
      setSheetOpen(true);
    },
  });

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    await quickAdd(product);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={
          disabled ? "Producto sin stock" : `Agregar ${product.title} al carrito`
        }
        className={`absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
          disabled
            ? "bg-slate-300 text-white cursor-not-allowed"
            : "bg-slate-900 text-white"
        }`}
      >
        {disabled ? <Lock size={14} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
      </button>

      <VariantBottomSheet
        product={sheetProduct}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSheetProduct(null);
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: TypeScript pass**

Run:
```bash
pnpm tsc --noEmit 2>&1 | grep "QuickAddButton" | head -10
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/shop/QuickAddButton.tsx
git commit -m "feat(shop): QuickAddButton circular con estados disabled y sheet integrada"
```

---

## Phase 3 — Product card visual rewrite

### Task 11: Rewrite `ProductCard`

**Files:**
- Modify: `src/components/shop/ProductCard.tsx`

- [ ] **Step 1: Inspect FavoriteButton to confirm props**

Run:
```bash
grep -n "interface\|FavoriteButtonProps\|export" src/components/shop/FavoriteButton.tsx | head -10
```
Confirm `FavoriteButton` takes `productId` and that it doesn't already include its own absolute positioning. If it does, we'll override or wrap.

- [ ] **Step 2: Overwrite `ProductCard.tsx` with the new visual**

Replace the entire contents of `src/components/shop/ProductCard.tsx` with:

```tsx
"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { QuickAddButton } from "@/components/shop/QuickAddButton";
import type { ShopifyProduct } from "@/lib/types";

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
}

function ProductCardInner({ product, priority = false }: ProductCardProps) {
  const priceAmount = Number(product.priceRange?.minVariantPrice?.amount || 0);
  const compareAtPrice = Number(
    product.compareAtPriceRange?.maxVariantPrice?.amount || 0
  );
  const hasDiscount = compareAtPrice > priceAmount && priceAmount > 0;
  const discountPercent = hasDiscount
    ? Math.round((1 - priceAmount / compareAtPrice) * 100)
    : 0;
  const price = priceAmount.toLocaleString("es-UY");

  const heroImage = product.featuredImage ?? product.images?.edges?.[0]?.node;

  // Sold-out is true when EVERY variant has availableForSale === false.
  // Defensive: products without variant data are treated as available.
  const variants = product.variants?.edges?.map((e: any) => e.node) ?? [];
  const isSoldOut =
    variants.length > 0 &&
    variants.every((v: any) => v.availableForSale === false);

  return (
    <Card className="group bg-white rounded-2xl border-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col p-0">
      <Link
        href={`/products/${product.handle}`}
        className="flex-1 flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-2xl"
      >
        {/* === Image area === */}
        <div className="relative w-full aspect-square bg-gradient-to-b from-white to-slate-50 flex items-center justify-center overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage.url}
              alt={heroImage.altText || product.title}
              fill
              className="object-contain p-3 sm:p-4 lg:p-5 transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 font-medium text-xs">
              CH
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center bg-red-500 text-white text-[11px] font-bold tracking-tight px-2 py-0.5 rounded-full">
              −{discountPercent}%
            </span>
          )}

          {/* Heart favorite — small, subtle, upper-right */}
          <div className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
            <FavoriteButton productId={product.id} />
          </div>

          {/* Quick-add button (bottom-right inside image) */}
          <QuickAddButton product={product} disabled={isSoldOut} />
        </div>

        {/* === Info section === */}
        <div className="px-3 pt-3 pb-3.5 flex flex-col gap-1.5">
          <h3 className="text-[14px] font-medium text-slate-900 leading-snug line-clamp-2 min-h-[36px]">
            {product.title}
          </h3>
          {priceAmount > 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-bold text-slate-900 tracking-tight">
                ${price}
              </span>
              {hasDiscount && (
                <span className="text-[12px] font-medium text-slate-400 line-through">
                  ${compareAtPrice.toLocaleString("es-UY")}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[13px] font-medium text-slate-500">
              Consultar precio
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
}

export const ProductCard = memo(ProductCardInner, (prev, next) => {
  return prev.product.id === next.product.id && prev.priority === next.priority;
});
```

> **`FavoriteButton` wrapping:** the current `FavoriteButton` has its own button + styling. By placing it inside the `bg-white/80 backdrop-blur-sm rounded-full p-1.5` wrapper we create a subtle "frosted disk" effect that ensures contrast on white product photos. If `FavoriteButton` already renders a circle background, remove the wrapper styling (set wrapper to `<></>`) to avoid double rings.

- [ ] **Step 3: Inspect `FavoriteButton` styling and adapt the wrapper**

Run:
```bash
sed -n '1,80p' src/components/shop/FavoriteButton.tsx
```

If `FavoriteButton` already renders its own circular bg (e.g. `rounded-full bg-white`), update the parent wrapper in `ProductCard.tsx` to just `<div className="absolute top-2 right-2 z-10">` — drop the extra `bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm`. Otherwise keep the wrapper as-is.

- [ ] **Step 4: Manual mobile QA**

Run `pnpm dev` and visit `/` (homepage with collection showcase) AND `/collections/[any-handle]` in Chrome DevTools iPhone 14 Pro emulation:

1. Confirm grid is 2-col on mobile.
2. Confirm cards have 1:1 aspect, white→slate-50 gradient bg, no border.
3. Confirm heart is subtle upper-right, quick-add black "+" is bottom-right.
4. Tap the heart — fills red without navigating to PDP.
5. Tap the quick-add on a single-variant product — toast appears, badge increments.
6. Tap quick-add on a multi-variant product — bottom-sheet slides up.
7. Confirm no rating widget, no "12x sin interés", no carousel inside card.

> **Photo aspect-ratio risk:** Many Shopify product photos for hardware are taller than wide. With `object-contain` they will letterbox inside the 1:1 frame. Visually this looks intentional with the gradient background. If certain photos look bad, the fix is on Shopify side (re-upload with 1:1 cropping) — not in code.

- [ ] **Step 5: Commit**

```bash
git add src/components/shop/ProductCard.tsx
git commit -m "feat(product-card): rediseno McDonalds-style 1:1, heart sutil, quick-add"
```

---

### Task 12: Update `ProductCardSkeleton`

**Files:**
- Modify: `src/components/shop/ProductCardSkeleton.tsx`

- [ ] **Step 1: Read current skeleton**

Run:
```bash
cat src/components/shop/ProductCardSkeleton.tsx
```

- [ ] **Step 2: Replace contents to match the new card layout**

Overwrite `src/components/shop/ProductCardSkeleton.tsx`:

```tsx
import { Card } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="bg-white rounded-2xl border-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col p-0 animate-pulse">
      <div className="relative w-full aspect-square bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0 m-3 sm:m-4 lg:m-5 bg-slate-100 rounded-xl" />
      </div>
      <div className="px-3 pt-3 pb-3.5 flex flex-col gap-2">
        <div className="h-4 w-[85%] bg-slate-100 rounded" />
        <div className="h-4 w-[55%] bg-slate-100 rounded" />
        <div className="mt-1 h-5 w-[40%] bg-slate-200 rounded" />
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Verify visual match**

Run `pnpm dev` and in the browser block network requests OR open a fresh collection page — the skeleton should briefly appear and have identical chrome (rounded-2xl, no border, 1:1 placeholder, same info-section heights) as the real card.

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/ProductCardSkeleton.tsx
git commit -m "refactor(skeleton): adaptar ProductCardSkeleton al nuevo layout 1:1"
```

---

### Task 13: Update `ProductGrid`

**Files:**
- Modify: `src/components/shop/ProductGrid.tsx`

- [ ] **Step 1: Read current grid**

Run:
```bash
cat src/components/shop/ProductGrid.tsx
```
Identify the grid container className (likely `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4` or similar). Also identify where it renders `<ProductCard>` and whether it already passes `priority`.

- [ ] **Step 2: Update grid columns and pass `priority` to first 4 cards**

In `src/components/shop/ProductGrid.tsx`:

1. Change the container className from whatever it currently is to:
   ```tsx
   className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
   ```
2. In the `.map()` over products, pass `priority={index < 4}`:
   ```tsx
   {products.map((product, index) => (
     <ProductCard key={product.id} product={product} priority={index < 4} />
   ))}
   ```

> **If `ProductGrid` does not exist or is named differently** (e.g. inline grid markup in a page), apply the same className change at every page that renders `<ProductCard>` in a list: `src/app/collections/[handle]/page.tsx`, `src/app/page.tsx` (homepage), `src/app/search/page.tsx`, and the "Recently viewed" component. Run `grep -rn 'ProductCard\b' src/app src/components | grep -v ProductCardSkeleton | grep -v "\.test\."` to find them all.

- [ ] **Step 3: Visual QA — LCP**

Run `pnpm dev` and use Chrome DevTools → Performance tab to record a load of `/collections/[handle]` in iPhone 14 Pro emulation. Confirm:

1. Mobile grid is 2-col.
2. LCP (Largest Contentful Paint) happens on one of the first 4 images, not on a skeleton.
3. LCP < 2.5s on simulated Fast 4G (Network → Fast 3G is a stress test).

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/ProductGrid.tsx
git commit -m "feat(grid): 2-col en mobile + priority en las primeras 4 cards"
```

---

## Phase 4 — Accessibility + Verification

### Task 14: Cross-page mobile QA checklist

**Files:** none — pure manual verification

- [ ] **Step 1: Boot the dev server in mobile mode**

```bash
pnpm dev
```
Open Chrome DevTools, switch device emulation to iPhone 14 Pro, then iPhone SE, then Pixel 7. For each device, run the full checklist below.

- [ ] **Step 2: Sidebar checklist**

- [ ] Hamburger button opens the drawer.
- [ ] Edge-swipe from the left edge opens the drawer.
- [ ] Edge-swipe is ignored when the cart drawer is open (open cart, try edge-swipe, confirm no double-drawer).
- [ ] Edge-swipe is ignored on PDPs while horizontally scrolling the image gallery (verify carousel still works).
- [ ] Profile header: logged-in shows real name + email + stats; logged-out shows "Invitado" + "Iniciar sesión" CTA.
- [ ] Tapping stats row links to /carrito and /cuenta/favoritos.
- [ ] All category icons render (no broken Lucide icons).
- [ ] Drill-down works for categories with children; chevron icons appear correctly.
- [ ] Back button (`‹ Volver`) returns to root; close (`✕`) closes from any depth.
- [ ] Drawer respects `safe-area-inset-top` and `safe-area-inset-bottom`.
- [ ] All tap targets ≥44px (use DevTools "Show tap target ruler" if available).

- [ ] **Step 3: Product card checklist**

For homepage, `/collections/[handle]`, `/search?q=pintura`, and the PDP "recently viewed" section:

- [ ] Grid is 2-col on mobile, 3-col md, 4-col lg.
- [ ] Image is 1:1, white→slate-50 gradient, no border on card.
- [ ] Discount badge "−20%" appears only on discounted products, red pill upper-left.
- [ ] Heart favorite renders upper-right, toggles state, does not navigate to PDP.
- [ ] Quick-add "+" renders bottom-right.
- [ ] Tap "+" on a single-variant product: toast appears, cart icon bumps, haptic fires on a real device.
- [ ] Tap "+" on a multi-variant product: bottom-sheet slides up with options.
- [ ] In bottom-sheet: changing variant updates price; quantity +/− works; "Agregar" closes sheet and shows toast.
- [ ] Out-of-stock product: "+" is gray + lock icon, no toast on tap.
- [ ] Card title is regular weight, 2-line clamp.
- [ ] Price is bold 17px; old price striked when discounted.
- [ ] No Judge.me widget visible on the card.
- [ ] No "12x sin interés" pill visible on the card.
- [ ] No "Envío gratis" pill visible on the card.
- [ ] No multi-image carousel inside the card.

- [ ] **Step 4: WhatsApp button checklist**

- [ ] On iPhone 14 Pro emulation, WhatsApp button sits clearly above the home indicator.
- [ ] On Pixel 7 emulation, button is at `bottom-5` (no extra inset, since Android has no home indicator).

- [ ] **Step 5: Accessibility checklist**

- [ ] Tab through the page — focus rings are visible on every interactive element including the heart and quick-add buttons.
- [ ] Screen reader (use Chrome ChromeVox extension): "Agregar al carrito" / "Agregar a favoritos" labels announced correctly.
- [ ] Color contrast: use DevTools accessibility inspector to confirm price text passes ≥4.5:1.

- [ ] **Step 6: Commit the QA log**

Create `tasks/lessons.md` entry (append) if any surprising findings emerged:

```bash
echo "" >> tasks/lessons.md
cat >> tasks/lessons.md <<'EOF'

## 2026-05-13 — Mobile sidebar + cards QA findings

- [Any notable issues found during QA]
EOF
git add tasks/lessons.md
git commit -m "docs(lessons): notas del QA mobile del rediseno sidebar+cards"
```

If no surprises: skip the commit and move on.

---

### Task 15: Honor `prefers-reduced-motion`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append a `@media (prefers-reduced-motion: reduce)` block to globals.css**

Append at the end of `src/app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable the hover scale on product card images */
  .group:hover img.group-hover\:scale-\[1\.03\] {
    transform: none !important;
  }
  /* Soften the active scale-95 micro-interaction on buttons */
  button:active,
  [role="button"]:active {
    transform: none !important;
  }
  /* Cap any transition duration at 0.01s — effectively instant but preserves transitionend events */
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

> **Why not just target our components:** the wildcard selectors catch third-party UI (Vaul, Radix, framer-motion toast) without us having to remember every place we use animation. Specific overrides above protect the explicit `group-hover:scale-[1.03]` and `active:scale-95` cases which are inline-defined via Tailwind.

- [ ] **Step 2: Verify in browser**

In Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Reload the page. Confirm:

1. Product card image does not zoom on hover.
2. Buttons do not visually scale when tapped.
3. Drawer transitions appear effectively instant.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(a11y): honrar prefers-reduced-motion en transiciones y micro-interacciones"
```

---

## Final checklist

- [ ] All 15 tasks marked complete.
- [ ] `pnpm tsc --noEmit` passes with no new errors.
- [ ] `pnpm test` passes (only the `useQuickAdd` tests are new — confirm they pass).
- [ ] `pnpm build` succeeds.
- [ ] Manual QA pass on iPhone (real device if available) before merging to `main`.
- [ ] PR description references this plan and the spec.
