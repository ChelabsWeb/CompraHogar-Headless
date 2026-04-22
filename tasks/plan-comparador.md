# Plan — Comparador de Productos

_Fecha: 2026-04-14_

## Objetivo
Permitir al usuario seleccionar hasta 4 productos y verlos lado a lado en una tabla de comparación con specs, precios, disponibilidad y add-to-cart individual.

## Scope

**Incluye:**
- Provider global con persistencia en localStorage (no sync a cuenta — comparación es efímera)
- Botón de comparar en `ProductCard` (icono, no ocupa espacio)
- Barra flotante fija bottom que aparece con 1+ productos seleccionados
- Página `/comparar` con tabla de comparación
- Máximo 4 productos; límite con feedback visual
- Add-to-cart individual desde la tabla
- Botón "vaciar comparación"

**No incluye:**
- Sync a cuenta Shopify (comparación es ephemeral, no tiene sentido persistirla)
- Filtros de categoría / comparables (usuario puede comparar lo que quiera)
- Comparación automática (requiere selección manual)

## Filas de la tabla de comparación
1. Imagen principal
2. Título (link al producto)
3. Precio actual
4. Precio anterior (si hay descuento) + % descuento
5. Cuotas sin interés (12x, si precio > 1000)
6. Envío gratis (si precio > 2000)
7. Disponibilidad (en stock / agotado)
8. Material (metafield)
9. Rendimiento (metafield)
10. Instrucciones de lavado (metafield)
11. CTA: Agregar al carrito (por producto)

## Archivos

**Crear:**
- `src/components/shop/CompareProvider.tsx` — context + localStorage persist
- `src/components/shop/CompareButton.tsx` — botón toggle (icono GitCompare de lucide)
- `src/components/shop/CompareBar.tsx` — barra fija bottom con thumbnails + CTA
- `src/app/comparar/page.tsx` — página de comparación (client component, fetchea productos con `getProductsByIdsQuery`)

**Modificar:**
- `src/app/layout.tsx` — envolver con `<CompareProvider>` y renderizar `<CompareBar />`
- `src/components/shop/ProductCard.tsx` — agregar `<CompareButton>` junto al `FavoriteButton`

## Contratos

**CompareContext:**
```ts
{
  items: string[]  // product IDs
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
  count: number
  max: 4
  isFull: boolean  // count >= max
}
```

**Storage:** `localStorage["comprahogar_compare"]` → `string[]`

## Criterios de verificación
1. Tocar botón "Comparar" en 2 productos → CompareBar aparece con 2 thumbnails
2. Click en "Comparar (2)" → navega a `/comparar` con tabla de 2 columnas
3. Agregar 5º producto → se bloquea con feedback (toast o shake de botón)
4. Refrescar página → items siguen presentes (localStorage)
5. `remove` desde CompareBar o tabla → item desaparece en ambos lugares
6. "Vaciar" → items[] = [] y localStorage limpio
7. Add-to-cart desde la tabla → agrega al carrito sin romper el comparador
8. Build limpio: `pnpm build` sin errores TS

## Orden de implementación
1. `CompareProvider` + storage (base)
2. `CompareButton` (integra con provider)
3. Agregar `CompareButton` a `ProductCard`
4. `CompareBar` (barra flotante)
5. Envolver layout con provider + renderizar bar
6. `/comparar/page.tsx` (fetchea productos y renderiza tabla)
7. Verificación: build + prueba manual del flow
