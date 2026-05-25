# Checkout "En Construcción" — Design Spec

**Fecha:** 2026-05-25
**Estado:** Aprobado (Enfoque A)
**Topic:** Bloquear el pago mientras la tienda no está lista para vender online.

---

## Contexto y problema

La tienda está públicamente accesible y la gente la encuentra: ya llegaron mails preguntando si está activa y **alguien intentó comprar y no pudo concretar**. No queremos que nadie llegue a poder pagar todavía.

Además, **se venció la suscripción de Shopify**. Detalle clave: el storefront lee el catálogo, precios e imágenes **en vivo desde la Storefront API de Shopify** (todo pasa por `shopifyFetch`). O sea, Shopify no es solo la pasarela — si Shopify queda congelado del todo, **deja de cargar el catálogo entero**, no solo el checkout.

Existe además un plan de migración a Medusa (`docs/superpowers/plans/2026-05-16-medusa-migration.md`) cuyo objetivo es justamente dejar de pagarle a Shopify. Por eso no tiene sentido pagar un plan normal de Shopify ahora.

## Decisión

Poner el **pago en "construcción"**, controlado por un flag, manteniendo el sitio navegable y el carrito funcional. Alcance elegido por el cliente: **navegar SÍ · carrito SÍ · pagar NO**.

El bloqueo debe ser **reversible con una sola variable de entorno** (para reactivar cuando el checkout —Shopify o Medusa— esté listo) y debe **convertir las compras frustradas en leads** vía WhatsApp, que es justo el dolor actual (gente que quiere comprar y no puede).

## Por qué el `CartProvider` es el punto de corte

Hoy hay **3 botones** que redirigen al checkout de Shopify:

1. `src/components/cart/CartSheet.tsx:244` — "Finalizar compra" (`window.location.href = checkoutUrl`).
2. `src/components/shop/ProductView.tsx:661` — "Comprar ahora" (desktop).
3. `src/components/shop/ProductView.tsx:839` — "Comprar ahora" (sticky mobile).

Los dos "Comprar ahora" obtienen la URL del **valor de retorno de `addToCart()`**, no solo del estado `checkoutUrl`:

```js
const url = await addToCart(currentVariant.id, quantity);
if (url) window.location.href = url;            // ← URL viene del return de addToCart
else if (checkoutUrl) window.location.href = checkoutUrl;
else setIsCartOpen(true);
```

Por eso esconder botones uno por uno es frágil (te podés olvidar uno, o agregar otro mañana). El corte correcto es en **el `CartProvider`**, única fuente del `checkoutUrl` para todos los consumidores actuales y futuros.

## Arquitectura

Tres capas:

- **Capa 1 — Fuente de verdad (`CartProvider`):** cuando el checkout está deshabilitado, `checkoutUrl` se mantiene `null` y `addToCart` retorna `undefined`. Ningún botón puede redirigir al pago.
- **Capa 2 — Presentación (UI):** el carrito muestra un estado claro de "pago en construcción" + CTA de WhatsApp; el PDP oculta los "Comprar ahora" y deja "Agregar al carrito".
- **Capa 3 — Ops (no-código):** Shopify en Pause-and-Build (bloquea el checkout del lado de Shopify) + export de datos. Belt-and-suspenders; documentado pero fuera del código.

## Componentes

### 1. `src/lib/config/storeStatus.ts` (nuevo)

```ts
/**
 * Fuente única para saber si el checkout (pago online) está habilitado.
 * Fail-closed: si la variable no es exactamente "true", el pago está APAGADO.
 * Esto es intencional — nunca queremos cobrar si no estamos listos para cumplir.
 */
export const isCheckoutEnabled =
  process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";
```

- **Default (variable sin setear) = pago deshabilitado.** Para ir a producción con ventas, setear `NEXT_PUBLIC_CHECKOUT_ENABLED=true`.

### 2. `src/lib/constants/contact.ts` (nuevo)

Extraer el número de WhatsApp (hoy hardcodeado en `WhatsAppButton.tsx:6` como `"59896244003"`) a una constante compartida, para que el carrito y el FAB usen la misma fuente.

```ts
export const WHATSAPP_NUMBER = "59896244003";

/** Construye un link wa.me con un mensaje pre-cargado. */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

`WhatsAppButton.tsx` se actualiza para importar de acá (sin cambiar su comportamiento visible).

### 3. `src/components/cart/CartProvider.tsx` (modificar)

- Importar `isCheckoutEnabled`.
- En `parseCartData`: si `!isCheckoutEnabled`, **no** propagar `cart.checkoutUrl` (dejar `checkoutUrl` en `null`).
- En `addToCart`: si `!isCheckoutEnabled`, **no** retornar la `checkoutUrl` (retornar `undefined`). El item igual se agrega al carrito; solo no se filtra la URL de pago.
- El resto del provider queda igual.

### 4. `src/components/cart/CartSheet.tsx` (modificar)

Reemplazar el bloque del botón "Finalizar compra" por lógica que distinga **3 estados**:

- **`!isCheckoutEnabled`** → botón deshabilitado **"Pago en construcción"** con ícono de candado, + nota corta, + CTA secundario **"Coordinar compra por WhatsApp"**.
- **checkout habilitado + `checkoutUrl` presente** → "Finalizar compra" (comportamiento actual).
- **checkout habilitado + sin `checkoutUrl` aún** → "Preparando checkout..." (comportamiento actual).

Nota propuesta (copy): *"Estamos terminando de habilitar el pago online. Muy pronto vas a poder comprar directo desde acá. Mientras tanto, escribinos y coordinamos tu compra al instante."*

CTA WhatsApp pre-carga el contenido del carrito:

```
Hola! Quiero hacer una compra en CompraHogar:
• 1x Sillón Oslo
• 2x Mesa Roble
Total estimado: $61.900
¿Cómo coordino el pago?
```

(El total estimado usa el `totalEstimated` que ya se calcula en el componente.)

### 5. `src/components/shop/ProductView.tsx` (modificar)

- Importar `isCheckoutEnabled`.
- Cuando `!isCheckoutEnabled`: **ocultar los dos botones "Comprar ahora"** (desktop, ~línea 651-668; sticky mobile, ~línea 829-846) y dejar visible solo "Agregar al carrito".
- En el sticky mobile, si solo queda un botón, mantener el layout correcto (un solo botón a ancho completo).
- No tocar el flujo de "Agregar al carrito" ni el de back-in-stock.

> Nota defensiva: aunque ocultemos los botones, el corte real ya está en el provider (Capa 1). Si por algún motivo un "Comprar ahora" quedara visible, `addToCart` retorna `undefined` y `checkoutUrl` es `null`, así que cae en `setIsCartOpen(true)` → abre el drawer con el mensaje de construcción. Degradación segura.

### 6. `.env.example` (modificar)

Agregar, documentado:

```dotenv
# Pago online. "true" = checkout habilitado. Cualquier otro valor / sin setear = pago en construcción (bloqueado).
# Mantener en false/sin-setear hasta que la pasarela (Shopify o Medusa) esté lista para vender.
NEXT_PUBLIC_CHECKOUT_ENABLED=false
```

## Fuera de alcance (YAGNI)

- **Banner global "tienda en construcción"** — el cliente eligió bloquear solo el pago, no señalizar todo el sitio.
- **Página "próximamente" / holding page** — el catálogo sigue navegable.
- **Guard server-side / middleware que limpie `checkoutUrl`** — over-engineering: el checkout es externo (Shopify) y el bloqueo de pago real lo da Pause-and-Build.
- **Tocar la lógica de carrito, descuentos, gift cards o back-in-stock.**

## Verificación

- **Unit test** (`src/lib/config/storeStatus.test.ts` o similar con Vitest): el helper lee la env var correctamente (`"true"` → habilitado; `undefined`/`"false"`/otro → deshabilitado).
- **Smoke test manual** con `NEXT_PUBLIC_CHECKOUT_ENABLED` sin setear:
  1. Agregar al carrito desde el PDP → el item entra y se abre el drawer.
  2. En el drawer: ver "Pago en construcción" deshabilitado + CTA de WhatsApp con los ítems pre-cargados.
  3. PDP desktop y mobile: no aparece "Comprar ahora"; sí "Agregar al carrito".
  4. Click en el CTA de WhatsApp → abre wa.me con el mensaje correcto.
- **Smoke test con `=true`:** los 3 botones vuelven a llevar al checkout (comportamiento original).
- `npx tsc --noEmit` y `pnpm lint` sin errores nuevos.

## Reactivación (cuando el pago esté listo)

Setear `NEXT_PUBLIC_CHECKOUT_ENABLED=true` en `.env.local` (y en el hosting) y redeploy. Cero cambios de código.

## Ops — acciones del cliente (no-código)

1. **Pasar Shopify a "Pause and Build" (~US$5/mes)**: deshabilita el checkout del lado de Shopify (bloqueo real del pago) y mantiene admin + datos para seguir construyendo. Alternativa: pausa total, pero entonces el catálogo no carga.
2. **Exportar los datos de Shopify YA** (productos, colecciones, clientes) dentro del período de gracia (~30 días tras el vencimiento) — ver Phase 2 del plan de migración a Medusa. Time-sensitive.
