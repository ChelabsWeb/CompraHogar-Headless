# ProductCard Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar las 5 cards de producto divergentes (`ProductCard`, `ProductCarousel`, `CollectionShowcase`, `RecentlyViewed`, `WishlistCard`) por un único `ProductCard` con imagen full-bleed, cuotas y envío dinámico según cookie de ubicación.

**Architecture:** Un solo componente `ProductCard` que recibe `ShopifyProduct` y deriva todo internamente. Un nuevo hook `useUserLocation` lee `/api/location` vía SWR (dedupe global, 5 min). Reusamos `getShippingRate()` y `FREE_SHIPPING_THRESHOLD` existentes. `RecentlyViewed` migra a guardar `{ id, viewedAt }` y refetchea via `getProductsByIdsQuery` (ampliada).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, SWR 2.4, Vitest + @testing-library/react, Shopify Storefront API.

---

## Spec

Ver `docs/superpowers/specs/2026-05-18-product-card-unification-design.md`.

## File Structure

**Crear:**
- `src/hooks/useUserLocation.ts` — SWR hook wrapping `/api/location`.
- `src/components/shop/ProductCardShipping.tsx` — sub-componente que renderiza el bloque "🚚 envío" con su lógica de fallback (extraído para testeabilidad).
- `src/__tests__/hooks/useUserLocation.test.tsx`
- `src/__tests__/components/ProductCardShipping.test.tsx`
- `src/app/actions/recently-viewed.ts` — server action que recibe IDs y devuelve `ShopifyProduct[]`.

**Modificar:**
- `src/lib/customer.ts:463-491` — ampliar `getProductsByIdsQuery` con `compareAtPriceRange` y `variants.edges.node.availableForSale`.
- `src/components/shop/ProductCard.tsx` — reescribir completo: quitar padding de imagen, agregar cuotas + envío.
- `src/components/shop/ProductCardSkeleton.tsx` — sacar margins del placeholder de imagen, agregar 2 líneas extra para cuotas/envío.
- `src/components/shop/ProductCarousel.tsx` — reemplazar card inline por `<ProductCard>`.
- `src/components/home/CollectionShowcase.tsx` — reemplazar card inline por `<ProductCard>`.
- `src/components/shop/RecentlyViewed.tsx` — cambiar storage a `{ id, viewedAt }`, refetch via server action, reemplazar card inline.
- `src/components/shop/ProductViewTracker.tsx` — actualizar payload para que solo pase `{ id }` (o el shape mínimo requerido por el nuevo `trackProductView`).
- `src/app/cuenta/favoritos/page.tsx` — reemplazar `<WishlistCard>` por `<ProductCard>`.

**Eliminar:**
- `src/components/shop/WishlistCard.tsx`.

---

## Task 1: Crear `useUserLocation` hook con tests

**Files:**
- Create: `src/hooks/useUserLocation.ts`
- Create: `src/__tests__/hooks/useUserLocation.test.tsx`

- [ ] **Step 1: Escribir el test (failing) para `useUserLocation`**

Crear `src/__tests__/hooks/useUserLocation.test.tsx`:

```typescript
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useUserLocation", () => {
  it("returns department when /api/location resolves with one", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ department: "Montevideo" }),
      })
    );

    const { result } = renderHook(() => useUserLocation(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.department).toBe("Montevideo");
  });

  it("returns null department when /api/location resolves with department=null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ department: null }),
      })
    );

    const { result } = renderHook(() => useUserLocation(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.department).toBeNull();
  });

  it("returns null department when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const { result } = renderHook(() => useUserLocation(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.department).toBeNull();
  });
});
```

- [ ] **Step 2: Correr el test para confirmar que falla**

Run: `pnpm test src/__tests__/hooks/useUserLocation.test.tsx`
Expected: FAIL with "Cannot find module '@/hooks/useUserLocation'".

- [ ] **Step 3: Implementar `useUserLocation`**

Crear `src/hooks/useUserLocation.ts`:

```typescript
"use client";

import useSWR from "swr";

interface LocationApiResponse {
  department: string | null;
}

const LOCATION_KEY = "/api/location";

const fetcher = async (url: string): Promise<LocationApiResponse> => {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch {
    return { department: null };
  }
};

export function useUserLocation() {
  const { data, isLoading } = useSWR<LocationApiResponse>(LOCATION_KEY, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 5 * 60 * 1000,
  });

  return {
    department: data?.department ?? null,
    isLoading,
  };
}
```

- [ ] **Step 4: Correr el test para confirmar que pasa**

Run: `pnpm test src/__tests__/hooks/useUserLocation.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useUserLocation.ts src/__tests__/hooks/useUserLocation.test.tsx
git commit -m "feat(hooks): add useUserLocation SWR hook"
```

---

## Task 2: Crear `ProductCardShipping` sub-componente con tests

**Files:**
- Create: `src/components/shop/ProductCardShipping.tsx`
- Create: `src/__tests__/components/ProductCardShipping.test.tsx`

- [ ] **Step 1: Escribir el test (failing)**

Crear `src/__tests__/components/ProductCardShipping.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCardShipping } from "@/components/shop/ProductCardShipping";

vi.mock("@/hooks/useUserLocation", () => ({
  useUserLocation: vi.fn(),
}));

import { useUserLocation } from "@/hooks/useUserLocation";

beforeEach(() => {
  vi.mocked(useUserLocation).mockReset();
});

describe("ProductCardShipping", () => {
  it("renders nothing when priceAmount is 0", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: null, isLoading: false });
    const { container } = render(<ProductCardShipping priceAmount={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows 'Envío gratis' when priceAmount >= 4000", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: null, isLoading: false });
    render(<ProductCardShipping priceAmount={4500} />);
    expect(screen.queryByText("Envío gratis")).not.toBeNull();
  });

  it("shows 'Llega en {estimate}' when department is known and price below threshold", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: "Montevideo", isLoading: false });
    render(<ProductCardShipping priceAmount={2500} />);
    expect(screen.queryByText(/Llega en 1-2 días hábiles/)).not.toBeNull();
  });

  it("shows fallback 'Envío a todo Uruguay' when no department and price below threshold", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: null, isLoading: false });
    render(<ProductCardShipping priceAmount={2500} />);
    expect(screen.queryByText("Envío a todo Uruguay")).not.toBeNull();
  });

  it("renders nothing while location is loading and price below threshold", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: null, isLoading: true });
    const { container } = render(<ProductCardShipping priceAmount={2500} />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Correr el test para confirmar que falla**

Run: `pnpm test src/__tests__/components/ProductCardShipping.test.tsx`
Expected: FAIL with "Cannot find module '@/components/shop/ProductCardShipping'".

- [ ] **Step 3: Implementar `ProductCardShipping`**

Crear `src/components/shop/ProductCardShipping.tsx`:

```tsx
"use client";

import { Truck } from "lucide-react";
import { useUserLocation } from "@/hooks/useUserLocation";
import {
  getShippingRate,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants/shippingRates";

interface ProductCardShippingProps {
  priceAmount: number;
}

export function ProductCardShipping({ priceAmount }: ProductCardShippingProps) {
  const { department, isLoading } = useUserLocation();

  if (priceAmount === 0) return null;

  let label: string | null = null;

  if (priceAmount >= FREE_SHIPPING_THRESHOLD) {
    label = "Envío gratis";
  } else if (isLoading) {
    return null;
  } else if (!department) {
    label = "Envío a todo Uruguay";
  } else {
    const info = getShippingRate(department, 0);
    label = info ? `Llega en ${info.estimate}` : "Envío a todo Uruguay";
  }

  return (
    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
      <Truck className="w-3 h-3" strokeWidth={2} aria-hidden />
      <span>{label}</span>
    </div>
  );
}
```

- [ ] **Step 4: Correr el test para confirmar que pasa**

Run: `pnpm test src/__tests__/components/ProductCardShipping.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/shop/ProductCardShipping.tsx src/__tests__/components/ProductCardShipping.test.tsx
git commit -m "feat(shop): add ProductCardShipping subcomponent"
```

---

## Task 3: Reescribir `ProductCard` con imagen full-bleed + cuotas + envío

**Files:**
- Modify: `src/components/shop/ProductCard.tsx` (reescritura completa)

- [ ] **Step 1: Reescribir `ProductCard`**

Reemplazar el contenido de `src/components/shop/ProductCard.tsx` con:

```tsx
"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { QuickAddButton } from "@/components/shop/QuickAddButton";
import { ProductCardShipping } from "@/components/shop/ProductCardShipping";
import type { ShopifyProduct } from "@/lib/types";

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
}

const INSTALLMENT_THRESHOLD = 1000;
const INSTALLMENT_COUNT = 12;

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

  const variants = product.variants?.edges?.map((e: any) => e.node) ?? [];
  const isSoldOut =
    variants.length > 0 &&
    variants.every((v: any) => v.availableForSale === false);

  const installmentLabel =
    priceAmount > INSTALLMENT_THRESHOLD
      ? `${INSTALLMENT_COUNT} cuotas de $${(priceAmount / INSTALLMENT_COUNT).toLocaleString(
          "es-UY",
          { maximumFractionDigits: 0 }
        )} sin interés`
      : null;

  return (
    <Card className="group bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col p-0">
      <Link
        href={`/products/${product.handle}`}
        className="flex-1 flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-2xl"
      >
        {/* Image area — FULL BLEED, sin padding */}
        <div className="relative w-full aspect-square bg-gradient-to-b from-white to-slate-50 overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage.url}
              alt={heroImage.altText || product.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300">
              <ImageOff className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.25} />
              <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400">
                Sin imagen
              </span>
            </div>
          )}

          {hasDiscount && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center bg-red-500 text-white text-[11px] font-bold tracking-tight px-2 py-0.5 rounded-full">
              −{discountPercent}%
            </span>
          )}

          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton productId={product.id} size="sm" />
          </div>

          <QuickAddButton product={product} disabled={isSoldOut} />
        </div>

        {/* Info section */}
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

          {installmentLabel && (
            <span className="text-[11px] text-emerald-700 font-medium">
              {installmentLabel}
            </span>
          )}

          <ProductCardShipping priceAmount={priceAmount} />
        </div>
      </Link>
    </Card>
  );
}

export const ProductCard = memo(ProductCardInner, (prev, next) => {
  return prev.product.id === next.product.id && prev.priority === next.priority;
});
```

- [ ] **Step 2: Build para verificar que tipa bien**

Run: `pnpm build`
Expected: build pasa. La firma pública (`{ product: ShopifyProduct; priority?: boolean }`) no cambió, así que ningún consumidor existente debería romperse. Si hay error en otros archivos, debe ser por algo no relacionado — investigar antes de continuar.

- [ ] **Step 3: Correr el dev server y mirar el grid de colección**

Run: `pnpm dev`
Abrir: `http://localhost:3000/collections/[handle]` (cualquier colección con productos).
Verificar visualmente:
- Las imágenes llenan TODO el alto de su contenedor (sin padding visible).
- Aparece línea de cuotas debajo del precio (en productos > $1000).
- Aparece línea "🚚 ..." debajo de las cuotas.

Si hay producto > $4000 → muestra "Envío gratis".
Si no hay cookie `user_location` → muestra "Envío a todo Uruguay".

Si visualmente algo está mal, ajustar antes de continuar.

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/ProductCard.tsx
git commit -m "feat(shop): rewrite ProductCard with full-bleed image, installments, dynamic shipping"
```

---

## Task 4: Actualizar `ProductCardSkeleton` al nuevo layout

**Files:**
- Modify: `src/components/shop/ProductCardSkeleton.tsx`

- [ ] **Step 1: Reescribir el skeleton**

Reemplazar el contenido de `src/components/shop/ProductCardSkeleton.tsx` con:

```tsx
import { Card } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col p-0 animate-pulse">
      {/* Image placeholder — full bleed, sin margins */}
      <div className="relative w-full aspect-square bg-slate-100" />
      <div className="px-3 pt-3 pb-3.5 flex flex-col gap-1.5">
        {/* Title (2 lines) */}
        <div className="h-4 w-[85%] bg-slate-100 rounded" />
        <div className="h-4 w-[55%] bg-slate-100 rounded" />
        {/* Price */}
        <div className="mt-1 h-5 w-[40%] bg-slate-200 rounded" />
        {/* Installments */}
        <div className="h-3 w-[60%] bg-slate-100 rounded" />
        {/* Shipping */}
        <div className="h-3 w-[50%] bg-slate-100 rounded" />
      </div>
    </Card>
  );
}

// Envoltorio esqueleto para el grid completo — debe replicar la estructura de <ProductGrid />
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 xl:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar visualmente con dev server**

Si el dev server sigue corriendo, navegar a una colección y refrescar mientras se ve el skeleton (puede requerir throttling de red en DevTools).
Expected: skeleton tiene altura proporcional al nuevo ProductCard (2 líneas más bajo el precio).

- [ ] **Step 3: Commit**

```bash
git add src/components/shop/ProductCardSkeleton.tsx
git commit -m "feat(shop): update ProductCardSkeleton to match new layout"
```

---

## Task 5: Migrar `ProductCarousel` a usar `<ProductCard>`

**Files:**
- Modify: `src/components/shop/ProductCarousel.tsx`

- [ ] **Step 1: Reescribir `ProductCarousel`**

Reemplazar el contenido completo de `src/components/shop/ProductCarousel.tsx` con:

```tsx
"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { SnapCarousel } from "@/components/shop/SnapCarousel";
import type { ShopifyProduct } from "@/lib/types";

interface ProductCarouselProps {
  title: string;
  products: Array<ShopifyProduct | { node: ShopifyProduct }>;
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full py-8 mt-4 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      <SnapCarousel
        ariaLabel={title}
        trackClassName="gap-4 pb-6 -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {products.map((entry) => {
          const node = "node" in entry ? entry.node : entry;
          return (
            <div
              key={node.id}
              className="min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] snap-start shrink-0"
            >
              <ProductCard product={node} />
            </div>
          );
        })}
      </SnapCarousel>
    </div>
  );
}
```

- [ ] **Step 2: Verificar consumidores de `ProductCarousel`**

Usar la herramienta Grep buscando `ProductCarousel` en `src/`.
Expected: se usa en `src/app/products/[handle]/page.tsx` y `src/components/shop/EmptyState.tsx`.

Leer ambos archivos y confirmar que sólo pasan las props `title` y `products`. Si alguno pasa props que ya no existen, corregirlas. **Ojo en `EmptyState.tsx`:** abrir el archivo y revisar también que el shape de `products` sea `ShopifyProduct[]` o `{ node: ShopifyProduct }[]` (ambos soportados).

- [ ] **Step 3: Verificar en `/products/[handle]`**

Run: `pnpm dev` (si no estaba corriendo).
Abrir un producto con productos relacionados (o cualquier producto).
Verificar:
- El carrusel "Productos relacionados" (o como se llame en esa página) usa ahora las cards nuevas.
- Las cards muestran cuotas + envío.
- Ancho de cada card ~220-260px responsive.

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/ProductCarousel.tsx
git commit -m "refactor(shop): use ProductCard in ProductCarousel"
```

---

## Task 6: Migrar `CollectionShowcase` a usar `<ProductCard>`

**Files:**
- Modify: `src/components/home/CollectionShowcase.tsx`

- [ ] **Step 1: Reescribir `CollectionShowcase`**

Reemplazar el contenido completo de `src/components/home/CollectionShowcase.tsx` con:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { SnapCarousel } from "@/components/shop/SnapCarousel";
import type { ShopifyProduct } from "@/lib/types";

interface CollectionShowcaseProps {
  title: string;
  handle: string;
  description?: string;
  bannerImage?: string;
  bannerColor?: string;
  products: Array<ShopifyProduct | { node: ShopifyProduct }>;
}

export function CollectionShowcase({
  title,
  handle,
  description,
  bannerImage,
  bannerColor = "from-primary to-primary/80",
  products,
}: CollectionShowcaseProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">
          {title}
        </h2>
        <Link
          href={`/collections/${handle}`}
          className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Ver todo <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <SnapCarousel
        ariaLabel={title}
        trackClassName="gap-3 md:gap-4 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {/* Collection Banner Card */}
        <Link
          href={`/collections/${handle}`}
          className="relative min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] snap-start shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${bannerColor}`} />
          {bannerImage && (
            <div className="absolute inset-0">
              <Image
                src={bannerImage}
                alt={title}
                fill
                className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                sizes="260px"
              />
            </div>
          )}
          <div className="relative z-10 h-full min-h-[360px] p-5 md:p-6 flex flex-col justify-end">
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-white/70 text-xs md:text-sm line-clamp-2 mb-3">
                {description}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-white/90 text-xs md:text-sm font-medium group-hover:gap-2 transition-all">
              Explorar <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Product Cards */}
        {products.map((entry) => {
          const node = "node" in entry ? entry.node : entry;
          return (
            <div
              key={node.id}
              className="min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] snap-start shrink-0"
            >
              <ProductCard product={node} />
            </div>
          );
        })}
      </SnapCarousel>
    </section>
  );
}
```

- [ ] **Step 2: Verificar en `/` (home)**

Run: `pnpm dev` (si no estaba corriendo).
Abrir: `http://localhost:3000/`.
Verificar:
- Los `CollectionShowcase` (Categorías, Ofertas, etc.) ahora muestran cards con cuotas + envío.
- El banner de colección al inicio de cada showcase mantiene su estilo (gradiente + título + "Explorar").
- Ancho de cards consistente entre showcases.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/CollectionShowcase.tsx
git commit -m "refactor(home): use ProductCard in CollectionShowcase"
```

---

## Task 7: Ampliar `getProductsByIdsQuery` para soportar `ProductCard`

**Files:**
- Modify: `src/lib/customer.ts:463-491`

- [ ] **Step 1: Ampliar la query GraphQL**

En `src/lib/customer.ts`, reemplazar `getProductsByIdsQuery` (líneas ~463-491) con:

```typescript
export const getProductsByIdsQuery = `
  query getProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        variants(first: 10) {
          edges {
            node {
              id
              availableForSale
            }
          }
        }
      }
    }
  }
`;
```

**Cambios:**
- Agrega `compareAtPriceRange` (para que `ProductCard` muestre badge de descuento).
- Cambia `variants(first: 1)` → `variants(first: 10)` y agrega `availableForSale` en cada variant (para que `ProductCard` calcule sold-out correctamente).

- [ ] **Step 2: Build para verificar que la query sigue siendo válida**

Run: `pnpm build`
Expected: build pasa. (Esta query tiene tipado dinámico vía `body.data.nodes`, así que el cambio no rompe tipos.)

- [ ] **Step 3: Verificar en `/cuenta/favoritos`**

Run: `pnpm dev`. Loggear como cliente y agregar al menos un producto a favoritos.
Abrir `/cuenta/favoritos`.
Expected: la página carga sin errores. (Las `WishlistCard` viejas aún funcionan porque ignoran los campos nuevos.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/customer.ts
git commit -m "feat(api): extend getProductsByIdsQuery with compareAtPrice and variant availability"
```

---

## Task 8: Crear server action `getRecentlyViewedProducts`

**Files:**
- Create: `src/app/actions/recently-viewed.ts`

- [ ] **Step 1: Crear el server action**

Crear `src/app/actions/recently-viewed.ts`:

```typescript
"use server";

import { shopifyFetch } from "@/lib/shopify";
import { getProductsByIdsQuery } from "@/lib/customer";
import type { ShopifyProduct } from "@/lib/types";

export async function getRecentlyViewedProducts(
  ids: string[]
): Promise<ShopifyProduct[]> {
  if (!ids || ids.length === 0) return [];

  try {
    const { body } = await shopifyFetch({
      query: getProductsByIdsQuery,
      variables: { ids },
    });
    const products = (body?.data?.nodes ?? []).filter(
      (n: unknown): n is ShopifyProduct => n !== null && typeof n === "object"
    );
    // Preservar el orden recibido (más recientes primero)
    const indexMap = new Map(ids.map((id, i) => [id, i]));
    return products.sort(
      (a, b) => (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0)
    );
  } catch (error) {
    console.error("Error fetching recently viewed products:", error);
    return [];
  }
}
```

- [ ] **Step 2: Build para verificar tipos**

Run: `pnpm build`
Expected: build pasa.

- [ ] **Step 3: Commit**

```bash
git add src/app/actions/recently-viewed.ts
git commit -m "feat(actions): add getRecentlyViewedProducts server action"
```

---

## Task 9: Migrar `RecentlyViewed` a `<ProductCard>` + nuevo storage

**Files:**
- Modify: `src/components/shop/RecentlyViewed.tsx`

- [ ] **Step 1: Reescribir `RecentlyViewed`**

Reemplazar el contenido completo de `src/components/shop/RecentlyViewed.tsx` con:

```tsx
"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { SnapCarousel } from "@/components/shop/SnapCarousel";
import { getRecentlyViewedProducts } from "@/app/actions/recently-viewed";
import type { ShopifyProduct } from "@/lib/types";

interface RecentEntry {
  id: string;
  viewedAt: number;
}

const STORAGE_KEY = "comprahogar-recently-viewed";
const MAX_ITEMS = 10;

function readStorage(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // Filtrar entries con el nuevo shape válido; descartar viejas.
    return Array.isArray(raw)
      ? raw.filter(
          (e): e is RecentEntry =>
            e &&
            typeof e === "object" &&
            typeof e.id === "string" &&
            typeof e.viewedAt === "number"
        )
      : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: RecentEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ITEMS)));
  } catch {
    // Silent fail
  }
}

/**
 * Llamar desde el tracker en la página de producto.
 * Guarda solo `{ id, viewedAt }` — los datos del producto se refetcheán al renderizar.
 */
export function trackProductView(product: { id: string }) {
  if (typeof window === "undefined") return;
  const entries = readStorage();
  const filtered = entries.filter((e) => e.id !== product.id);
  filtered.unshift({ id: product.id, viewedAt: Date.now() });
  writeStorage(filtered);
}

export function RecentlyViewed({ excludeHandle }: { excludeHandle?: string }) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const entries = readStorage();
      const ids = entries.slice(0, MAX_ITEMS).map((e) => e.id);
      if (ids.length === 0) {
        if (!cancelled) {
          setProducts([]);
          setLoaded(true);
        }
        return;
      }
      const fetched = await getRecentlyViewedProducts(ids);
      const filtered = excludeHandle
        ? fetched.filter((p) => p.handle !== excludeHandle)
        : fetched;
      if (!cancelled) {
        setProducts(filtered);
        setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [excludeHandle]);

  if (!loaded || products.length < 2) return null;

  return (
    <div className="w-full mt-8 lg:mt-12">
      <h2 className="text-lg lg:text-xl font-semibold text-slate-800 mb-4">
        Visto recientemente
      </h2>
      <SnapCarousel
        ariaLabel="Productos vistos recientemente"
        trackClassName="gap-3 md:gap-4 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] snap-start shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </SnapCarousel>
    </div>
  );
}
```

- [ ] **Step 2: Actualizar `ProductViewTracker` para nuevo shape**

Modificar `src/components/shop/ProductViewTracker.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { trackProductView } from "@/components/shop/RecentlyViewed";

interface ProductViewTrackerProps {
  product: {
    id: string;
  };
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    trackProductView(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}
```

- [ ] **Step 3: Verificar usos de `ProductViewTracker`**

Usar la herramienta Grep buscando `ProductViewTracker` en `src/`.
Expected: usado en `src/app/products/[handle]/page.tsx`.

Si la página pasa más props que `{ id }`, la nueva interface es retro-compatible (TypeScript permite excess properties cuando un objeto es asignado directamente). **No hace falta cambiar el call site.** Verificar igual leyendo el archivo.

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: build pasa.

- [ ] **Step 5: Verificar en navegador**

Run: `pnpm dev`. Visitar 2-3 productos distintos. Luego entrar a un cuarto producto y bajar a "Visto recientemente".
Expected:
- Aparecen las cards con cuotas + envío.
- El producto actual NO aparece en la lista (filtrado por `excludeHandle`).
- En localStorage solo hay `{ id, viewedAt }` (verificar con `JSON.parse(localStorage.getItem('comprahogar-recently-viewed'))` en consola).
- Si quedaban entries viejas con el shape `{ id, handle, title, price, image }`, fueron descartadas silenciosamente al primer mount.

- [ ] **Step 6: Commit**

```bash
git add src/components/shop/RecentlyViewed.tsx src/components/shop/ProductViewTracker.tsx
git commit -m "refactor(shop): migrate RecentlyViewed to ProductCard with id+timestamp storage"
```

---

## Task 10: Migrar página de favoritos a `<ProductCard>` y eliminar `WishlistCard`

**Files:**
- Modify: `src/app/cuenta/favoritos/page.tsx`
- Delete: `src/components/shop/WishlistCard.tsx`

- [ ] **Step 1: Reescribir `favoritos/page.tsx`**

Reemplazar el contenido de `src/app/cuenta/favoritos/page.tsx` con:

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { GlassButton } from "@/components/ui/glass-button";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsByIdsQuery } from "@/lib/customer";
import { AccountSectionHeader } from "@/components/cuenta/AccountSectionHeader";
import { AccountCard } from "@/components/cuenta/AccountCard";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductCardSkeleton } from "@/components/shop/ProductCardSkeleton";
import type { ShopifyProduct } from "@/lib/types";

export default function FavoritosPage() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchProducts = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setProducts([]);
      setFetchError(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(false);
    try {
      const { body } = await shopifyFetch({
        query: getProductsByIdsQuery,
        variables: { ids },
      });
      const fetched: ShopifyProduct[] = (body.data?.nodes ?? []).filter(
        Boolean
      );
      setProducts(fetched);
    } catch (error) {
      console.error("Error fetching wishlist products:", error);
      setProducts([]);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(items);
  }, [items, fetchProducts]);

  const count = items.length;
  const description =
    count > 0
      ? `${count} producto${count === 1 ? "" : "s"} guardado${count === 1 ? "" : "s"}`
      : "Tu lista de productos guardados";

  if (!loading && count === 0) {
    return (
      <div className="space-y-6">
        <AccountSectionHeader title="Mis favoritos" description={description} />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AccountSectionHeader title="Mis favoritos" description={description} />

      {fetchError && !loading && (
        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm"
        >
          No pudimos cargar tus productos favoritos. Recargá la página o
          intentá de nuevo en unos minutos.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: count || 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <AccountCard
      padding="lg"
      className="flex flex-col items-center justify-center py-14 text-center"
    >
      <span
        className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5"
        aria-hidden
      >
        <Heart className="w-7 h-7" />
      </span>
      <h2 className="font-display text-[20px] sm:text-[22px] font-normal tracking-tight text-foreground mb-2">
        Aún no tenés favoritos
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-7">
        Cuando encuentres productos que te gusten, tocá el corazón para
        guardarlos acá.
      </p>
      <GlassButton variant="light" size="md" asChild>
        <Link href="/products">Explorar productos</Link>
      </GlassButton>
    </AccountCard>
  );
}
```

- [ ] **Step 2: Verificar que no quedan más consumidores de `WishlistCard`**

Usar la herramienta Grep buscando `WishlistCard` en `src/`.
Expected: solo aparece en `src/components/shop/WishlistCard.tsx`. Si aparece en otro archivo, migrarlo también.

- [ ] **Step 3: Eliminar `WishlistCard.tsx`**

```bash
rm "src/components/shop/WishlistCard.tsx"
```

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: build pasa.

- [ ] **Step 5: Verificar en navegador**

Run: `pnpm dev`. Loggear como cliente, agregar al menos 1 favorito (o usar uno existente).
Abrir `/cuenta/favoritos`.
Expected:
- Las cards son ahora `ProductCard` con cuotas + envío.
- El botón "Agregar al carrito" inline ya no aparece; en su lugar el `QuickAddButton` flotante (sobre la imagen) funciona como en el grid de colección.
- El empty state cuando no hay favoritos se mantiene.

- [ ] **Step 6: Commit**

```bash
git add src/app/cuenta/favoritos/page.tsx
git rm src/components/shop/WishlistCard.tsx
git commit -m "refactor(favoritos): replace WishlistCard with unified ProductCard"
```

---

## Task 11: Verificación final + screenshots

**Files:** ninguno (verificación visual).

- [ ] **Step 1: Lint + build + tests todos verdes**

```bash
pnpm lint
pnpm build
pnpm test
```

Expected: los tres pasan sin errores.

- [ ] **Step 2: Screenshots de las 4 superficies (Chrome DevTools MCP)**

Con `pnpm dev` corriendo, capturar screenshot de:

1. **Home** (`http://localhost:3000/`) → verificar CollectionShowcase con cards nuevas.
2. **Grid de colección** (`http://localhost:3000/collections/{cualquier-handle}`) → verificar ProductGrid con cards nuevas.
3. **Detalle de producto** (`http://localhost:3000/products/{cualquier-handle}`) → verificar carrusel "Productos relacionados" + "Visto recientemente" (después de visitar 2-3 productos primero).
4. **Favoritos** (`http://localhost:3000/cuenta/favoritos`) → loggeado, con al menos 2 favoritos.

Guardar los screenshots en algún folder local para el PR — no se commitean.

- [ ] **Step 3: Probar combinaciones de envío**

En cada surface:

a. **Sin cookie de ubicación** (Application → Cookies → borrar `user_location`):
   - Productos < $4000 → muestra "🚚 Envío a todo Uruguay".
   - Productos ≥ $4000 → muestra "🚚 Envío gratis".

b. **Con cookie Montevideo** (usar `LocationSelector` para elegir Montevideo):
   - Productos < $4000 → muestra "🚚 Llega en 1-2 días hábiles".
   - Productos ≥ $4000 → muestra "🚚 Envío gratis" (gana el threshold).

c. **Con cookie de departamento del interior** (ej. Salto):
   - Productos < $4000 → muestra "🚚 Llega en 4-7 días hábiles".

- [ ] **Step 4: Verificar accesibilidad básica**

En el grid de colección:
- Tab a través de 2 cards: foco visible en cada card (ring del Link).
- Lector de pantalla (VoiceOver/NVDA opcional): la card anuncia título, precio y descripción del envío.
- Las imágenes tienen `alt` (verificar inspeccionando una card).

- [ ] **Step 5: Commit final si hace falta + push**

Si todo está bien, no hay nada que commitear. Si hubo ajustes visuales pequeños:

```bash
git add -A
git commit -m "fix(shop): pulir layout final ProductCard"
```

Push directo a main (per project workflow):

```bash
git push origin main
```

---

## Definition of Done

- [ ] Hook `useUserLocation` creado, testeado y commiteado.
- [ ] Sub-componente `ProductCardShipping` creado, testeado y commiteado.
- [ ] `ProductCard` reescrito con imagen full-bleed, cuotas y envío dinámico.
- [ ] `ProductCardSkeleton` actualizado al nuevo layout.
- [ ] `ProductCarousel`, `CollectionShowcase`, `RecentlyViewed`, página de `/cuenta/favoritos` migrados a `<ProductCard>`.
- [ ] `WishlistCard.tsx` eliminado, no quedan referencias.
- [ ] `getProductsByIdsQuery` ampliada con `compareAtPriceRange` y `variants.availableForSale`.
- [ ] Server action `getRecentlyViewedProducts` creado.
- [ ] `RecentlyViewed` localStorage migrado a `{ id, viewedAt }`, entries viejas descartadas silenciosamente.
- [ ] `pnpm build`, `pnpm lint`, `pnpm test` pasan.
- [ ] Screenshots de las 4 superficies tomadas y revisadas.
- [ ] Probado con/sin cookie de ubicación y con productos por encima/debajo del threshold de envío gratis.
