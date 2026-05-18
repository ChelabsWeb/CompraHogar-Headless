# ProductCard Unification — Design Spec

**Fecha:** 2026-05-18
**Autor:** Chelabs (sesión Claude)
**Estado:** Aprobado — listo para writing-plans

---

## Contexto

Hoy existen **cinco** variantes divergentes de "card de producto" en el codebase:

| Componente | Ubicación | Estado |
|---|---|---|
| `ProductCard.tsx` | `src/components/shop/` | Minimalista actual. Sin cuotas, sin envío. Usado solo en `ProductGrid`. |
| `ProductCarousel.tsx` | `src/components/shop/` | Renderiza card inline (no usa `ProductCard`). Con "12 cuotas" y "Llega gratis mañana" hardcoded. |
| `CollectionShowcase.tsx` | `src/components/home/` | Renderiza card inline en `SnapCarousel`. Con cuotas + "Envío gratis" estático (threshold $2000). |
| `RecentlyViewed.tsx` | `src/components/shop/` | Renderiza card inline en `SnapCarousel`. Con cuotas + envío estático. |
| `WishlistCard.tsx` | `src/components/shop/` | Card propia para favoritos. Sin cuotas/envío, con botón "Agregar al carrito" inline. |

**Problemas:**

1. **Inconsistencia visual:** anchos, paddings, tipografía y bloques informativos divergen.
2. **Duplicación de lógica:** cálculo de descuento, formateo de precio, threshold de cuotas y envío repetido en cada archivo.
3. **Envío estático e inconsistente:** unos componentes muestran "Envío gratis" con threshold $2000, otros "Llega gratis mañana", ignorando la infraestructura real de ubicación.
4. **`ProductCard` actual incompleto:** falta cuotas y envío, los dos hooks comerciales más importantes en e-commerce uruguayo.

**Infraestructura ya existente** (reusable):
- Cookie httpOnly `user_location` con `{ cp, department }` (server action `setLocation` / `getLocation` en `src/app/actions/location.ts`).
- API route `/api/location` que retorna el departamento al cliente.
- `getShippingRate(department, cartTotal)` en `src/lib/constants/shippingRates.ts` que devuelve `{ rate, estimate }` con strings tipo "1-2 días hábiles".
- `FREE_SHIPPING_THRESHOLD = 4000` UYU.

---

## Objetivo

Un único componente `ProductCard` que:

1. Se usa en **todos** los lugares que muestran productos (grid de colección, carruseles de home, recently viewed, favoritos, recomendaciones).
2. La imagen ocupa todo el contenedor (sin padding interno).
3. Muestra cuotas y tiempo de envío dinámico según ubicación.
4. Cero configuración por consumidor — toda la lógica vive en el componente.

---

## No-objetivos

- No refactorizar la lógica de cart / favoritos / quick-add (ya funcionan).
- No introducir un nuevo sistema de variantes (size sm/md/lg) — se aprobó una talla unificada.
- No tocar el `ShippingCalculator` ni `LocationSelector` existentes.
- No migrar `RecentProduct` (localStorage) a un schema nuevo — se resuelve refetcheando por handle.

---

## Diseño

### Componente: `ProductCard`

**Path:** `src/components/shop/ProductCard.tsx` (reescritura del actual)

**Firma:**

```tsx
interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
}

export const ProductCard = memo(ProductCardInner, propsAreEqual);
```

No se agregan flags. Toda la decisión de qué mostrar se deriva del `product` y de la cookie de ubicación.

**Layout (vista esquemática):**

```
┌───────────────────────────────┐
│ -20%                       ♥  │  ← discount badge (sólo si hasDiscount) + FavoriteButton
│                               │
│      [imagen producto]        │  ← <Image fill object-contain> SIN padding
│                               │
│                       [⊕ Add] │  ← QuickAddButton flotante (mobile siempre / desktop hover)
├───────────────────────────────┤
│ Cama Queen tapizada gris      │  ← title, line-clamp-2, text-[14px] font-medium text-slate-900
│ $12.990  $14.990              │  ← price (font-bold) + compareAt tachado (si aplica)
│ 12 cuotas de $1.082 s/int     │  ← cuotas (sólo si price > 1000), text-[11px] text-emerald-700
│ 🚚 Llega en 1-2 días hábiles  │  ← envío dinámico (ver §"Lógica de envío")
└───────────────────────────────┘
```

**Container:**
- `bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col p-0`
- Sin `min-width` en el componente — el contenedor (Grid o SnapCarousel) decide ancho exterior.

**Image area:**
- `relative w-full aspect-square bg-gradient-to-b from-white to-slate-50 overflow-hidden`
- `<Image fill object-contain transition-transform duration-500 group-hover:scale-[1.03]>` — **sin la clase `p-3 sm:p-4 lg:p-5` actual**.
- `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"` se mantiene.
- Discount badge: top-left, rojo, `-{percent}%`, sólo si `compareAtPrice > price`.
- `FavoriteButton`: top-right (componente existente, sin cambios).
- `QuickAddButton`: bottom-right dentro del área de imagen (componente existente).

**Info area:**
- Padding `px-3 pt-3 pb-3.5 flex flex-col gap-1.5`.
- Orden DOM: título → precio → cuotas → envío.
- Si `priceAmount === 0`: muestra "Consultar precio" y **omite cuotas y envío**.

### Hook nuevo: `useUserLocation`

**Path:** `src/hooks/useUserLocation.ts`

```tsx
"use client";

import useSWR from "swr";

interface LocationResponse {
  department: string | null;
  cp: string | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useUserLocation() {
  const { data, isLoading } = useSWR<LocationResponse>("/api/location", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000, // 5 min
  });
  return {
    department: data?.department ?? null,
    isLoading,
  };
}
```

**Decisiones:**
- SWR ya está en el proyecto.
- `revalidateOnFocus: false` → la ubicación cambia raras veces, no vale la pena re-fetchear en cada focus.
- `dedupingInterval: 5min` → si 20 `ProductCard` montan simultáneamente, una sola request.

### Lógica de envío (dentro de `ProductCard`)

```tsx
import { getShippingRate, FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shippingRates";
import { useUserLocation } from "@/hooks/useUserLocation";

const { department, isLoading: locationLoading } = useUserLocation();

const shippingLabel = (() => {
  if (priceAmount === 0) return null;
  if (priceAmount >= FREE_SHIPPING_THRESHOLD) return "Envío gratis";
  if (locationLoading) return null; // reserva espacio sin texto
  if (!department) return "Envío a todo Uruguay";
  const info = getShippingRate(department, 0); // cartTotal=0 → no fuerza "Envío gratis"
  return info ? `Llega en ${info.estimate}` : "Envío a todo Uruguay";
})();
```

**Renderizado:**

```tsx
{shippingLabel && (
  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
    <Truck className="w-3 h-3" strokeWidth={2} />
    <span>{shippingLabel}</span>
  </div>
)}
```

Mientras `locationLoading === true` el bloque se omite pero el `gap-1.5` del contenedor reserva el espacio del título y precio; el shift es mínimo (una línea de 11px). No se renderiza un skeleton dedicado.

### Lógica de cuotas (dentro de `ProductCard`)

```tsx
const INSTALLMENT_THRESHOLD = 1000;
const INSTALLMENT_COUNT = 12;

const installmentLabel =
  priceAmount > INSTALLMENT_THRESHOLD
    ? `${INSTALLMENT_COUNT} cuotas de $${(priceAmount / INSTALLMENT_COUNT).toLocaleString("es-UY", { maximumFractionDigits: 0 })} sin interés`
    : null;
```

**Renderizado:**

```tsx
{installmentLabel && (
  <span className="text-[11px] text-emerald-700 font-medium">
    {installmentLabel}
  </span>
)}
```

Mantiene threshold ($1000) y formato existentes — ya validados por el cliente.

### Estados especiales (sin cambios respecto al actual)

- **Sin imagen:** `ImageOff` icon + "Sin imagen" (igual que hoy).
- **Sold-out:** lógica actual (`variants.every(v => !v.availableForSale)`); QuickAdd queda `disabled`.
- **Sin precio (`priceAmount === 0`):** muestra "Consultar precio" y omite cuotas + envío.

---

## Plan de migración

### Archivos a tocar

| Archivo | Acción |
|---|---|
| `src/components/shop/ProductCard.tsx` | **Reescribir** — quitar padding de imagen, agregar cuotas + envío, usar `useUserLocation`. |
| `src/hooks/useUserLocation.ts` | **Crear** — SWR hook sobre `/api/location`. |
| `src/components/shop/ProductCarousel.tsx` | Reemplazar card inline por `<ProductCard>` dentro del `SnapCarousel`. Eliminar lógica duplicada de precio/cuotas/envío y badge Judge.me inline (Judge.me se sigue mostrando en la página de detalle, no en cards). |
| `src/components/home/CollectionShowcase.tsx` | Reemplazar card inline por `<ProductCard>`. Mantener el banner de colección (Card especial al inicio del carousel). |
| `src/components/shop/RecentlyViewed.tsx` | Reemplazar card inline. Cambiar el storage: guardar sólo `{ handle, viewedAt }` (no más snapshot de datos). En mount, una server action `getProductsByHandles(handles: string[])` retorna los `ShopifyProduct` completos; las entries cuyo handle ya no existe en Shopify se descartan silenciosamente. Razón para no ampliar el schema viejo: el precio puede haber cambiado desde la última visita y mostrar precio viejo es engañoso en e-commerce. La query extra es aceptable porque `RecentlyViewed` sólo aparece en `/products/[handle]`. |
| `src/app/cuenta/favoritos/page.tsx` (y donde se importe `WishlistCard`) | Reemplazar `<WishlistCard>` por `<ProductCard>`. |
| `src/components/shop/WishlistCard.tsx` | **Eliminar**. Verificar que ningún otro consumidor lo importe (`grep WishlistCard src/`). |
| `src/components/shop/ProductCardSkeleton.tsx` | Ajustar skeleton para reflejar el nuevo layout: 2 líneas extra de texto bajo el precio (cuotas + envío). |

### Estándar de ancho en SnapCarousel

Los 3 carruseles (`ProductCarousel`, `CollectionShowcase`, `RecentlyViewed`) adoptan el mismo ancho:

```
min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] snap-start shrink-0
```

Esto reemplaza los anchos divergentes (160–280px) actuales. El Grid (`ProductGrid`) sigue siendo responsive por columnas — no se le impone min-width.

---

## Verificación

Al terminar la implementación:

1. **Screenshot** con Chrome DevTools MCP de las 4 superficies, antes/después:
   - `/` (home — `CollectionShowcase`)
   - `/collections/[handle]` (grid — `ProductGrid`)
   - `/products/[handle]` (carrusel relacionados — `ProductCarousel`, + `RecentlyViewed` al final)
   - `/cuenta/favoritos` (WishlistCard → ProductCard)
2. **Probar manualmente** con y sin cookie `user_location`:
   - Sin cookie → fallback "Envío a todo Uruguay".
   - Con cookie de Montevideo → "Llega en 1-2 días hábiles".
   - Con producto > $4000 → "Envío gratis" (ignora departamento).
3. **Lighthouse** en home: confirmar que LCP no se degrada (imagen sin padding visualmente más densa pero `next/image` ya optimiza).
4. **Type-check + lint + build** completos antes de declarar terminado.
5. **A11y:** `alt` en imagen, `aria-label` en QuickAdd y FavoriteButton (ya existentes — sólo verificar).

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| `RecentlyViewed` localStorage existente tiene schema viejo (`{ id, handle, title, price, image }`). Al migrar a `{ handle, viewedAt }` los datos viejos no son legibles. | Al leer del localStorage, normalizar: si la entry tiene `handle` string, usarla; si no, descartar. La lista se repopula naturalmente con cada visita a producto. No se necesita migración explícita. |
| `useUserLocation` hace fetch en cada montaje de cualquier página. | SWR dedupe global ya cubre — una sola request por sesión cada 5 min. |
| Quitar el padding de la imagen puede hacer que productos con fondo blanco "se peguen" al borde de la card. | Mantener el `bg-gradient-to-b from-white to-slate-50` debajo: provee un fondo sutil que enmarca productos sobre blanco. Si en pruebas se ve mal, considerar volver a un padding muy chico (`p-1`). |
| Si `/api/location` falla, `useUserLocation` retorna `department: null` → muestra "Envío a todo Uruguay". | Aceptable: es el fallback correcto. SWR no reintenta agresivamente con la config propuesta. |

---

## Definition of Done

- [ ] `ProductCard` reescrito con imagen full-bleed + cuotas + envío.
- [ ] `useUserLocation` creado y testeado manualmente.
- [ ] `ProductCarousel`, `CollectionShowcase`, `RecentlyViewed`, página de favoritos migrados a `<ProductCard>`.
- [ ] `WishlistCard` eliminado y referencias borradas.
- [ ] `ProductCardSkeleton` actualizado.
- [ ] Screenshots de las 4 superficies pegados al PR / commit.
- [ ] `pnpm build` y `pnpm lint` pasan.
- [ ] Probado con/sin cookie de ubicación y con producto > $4000.
