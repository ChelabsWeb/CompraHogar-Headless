# Checkout "En Construcción" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bloquear el pago online (los 3 botones que van al checkout de Shopify) detrás de un flag, dejando el catálogo y el carrito funcionales, y ofreciendo coordinar la compra por WhatsApp.

**Architecture:** El corte real ocurre en un único lugar —`CartProvider`— que es la única fuente del `checkoutUrl`. Cuando el flag `NEXT_PUBLIC_CHECKOUT_ENABLED` no es `"true"`, el provider deja `checkoutUrl` en `null` y `addToCart` no retorna URL, así ningún botón (actual o futuro) puede redirigir al pago. La UI del carrito y del PDP se ajustan para reflejarlo. Reversible con una sola variable de entorno.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Vitest 4 (jsdom, globals, alias `@/` → `src/`), lucide-react.

**Spec:** `docs/superpowers/specs/2026-05-25-checkout-construction-mode-design.md`

---

## File Structure

- **Create** `src/lib/config/storeStatus.ts` — helper `isCheckoutEnabled()` (fuente única del flag).
- **Create** `src/lib/config/storeStatus.test.ts` — tests del helper.
- **Create** `src/lib/constants/contact.ts` — `WHATSAPP_NUMBER`, `buildWhatsAppUrl()`, `buildCartWhatsAppMessage()`.
- **Create** `src/lib/constants/contact.test.ts` — tests de los helpers de WhatsApp.
- **Modify** `src/components/shared/WhatsAppButton.tsx` — usa la constante compartida (sin cambio visible).
- **Modify** `src/components/cart/CartProvider.tsx` — gatea `checkoutUrl` y el return de `addToCart`.
- **Modify** `src/components/cart/CartSheet.tsx` — estado "Pago en construcción" + CTA WhatsApp.
- **Modify** `src/components/shop/ProductView.tsx` — oculta "Comprar ahora" cuando el pago está deshabilitado.
- **Modify** `.env.example` — documenta `NEXT_PUBLIC_CHECKOUT_ENABLED`.

> **Nota de diseño:** el spec mostraba `isCheckoutEnabled` como `const`. Lo implementamos como **función** que lee `process.env` en cada llamada: idéntico en el bundle de browser (Next inlina `process.env.NEXT_PUBLIC_*` también dentro de funciones) y mucho más testeable (el test setea `process.env` y llama). Decisión consciente.

---

## Task 1: Helper de configuración `isCheckoutEnabled`

**Files:**
- Create: `src/lib/config/storeStatus.ts`
- Test: `src/lib/config/storeStatus.test.ts`

- [ ] **Step 1: Escribir el test que falla**

Create `src/lib/config/storeStatus.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import { isCheckoutEnabled } from "@/lib/config/storeStatus";

describe("isCheckoutEnabled", () => {
  const original = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED;

  afterEach(() => {
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED = original;
  });

  it("es true solo cuando la variable es exactamente 'true'", () => {
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED = "true";
    expect(isCheckoutEnabled()).toBe(true);
  });

  it("es false cuando la variable no está seteada (fail-closed)", () => {
    delete process.env.NEXT_PUBLIC_CHECKOUT_ENABLED;
    expect(isCheckoutEnabled()).toBe(false);
  });

  it("es false cuando la variable es 'false'", () => {
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED = "false";
    expect(isCheckoutEnabled()).toBe(false);
  });

  it("es false para cualquier otro valor", () => {
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED = "1";
    expect(isCheckoutEnabled()).toBe(false);
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx vitest run src/lib/config/storeStatus.test.ts`
Expected: FAIL — "Failed to resolve import '@/lib/config/storeStatus'" (el módulo no existe todavía).

- [ ] **Step 3: Implementar el helper mínimo**

Create `src/lib/config/storeStatus.ts`:

```ts
/**
 * Fuente única para saber si el checkout (pago online) está habilitado.
 *
 * Fail-closed: si NEXT_PUBLIC_CHECKOUT_ENABLED no es exactamente "true",
 * el pago está APAGADO. Es intencional — nunca queremos cobrar si no
 * estamos listos para cumplir la venta.
 *
 * Para habilitar ventas online: setear NEXT_PUBLIC_CHECKOUT_ENABLED=true
 * en el entorno y redeploy. Cero cambios de código.
 */
export function isCheckoutEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx vitest run src/lib/config/storeStatus.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/config/storeStatus.ts src/lib/config/storeStatus.test.ts
git commit -m "feat(config): flag isCheckoutEnabled (fail-closed) para bloquear el pago"
```

---

## Task 2: Constantes de contacto y helpers de WhatsApp

**Files:**
- Create: `src/lib/constants/contact.ts`
- Test: `src/lib/constants/contact.test.ts`

- [ ] **Step 1: Escribir el test que falla**

Create `src/lib/constants/contact.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  WHATSAPP_NUMBER,
  buildWhatsAppUrl,
  buildCartWhatsAppMessage,
} from "@/lib/constants/contact";

describe("buildWhatsAppUrl", () => {
  it("arma un link wa.me con el número y el mensaje url-encodeado", () => {
    const url = buildWhatsAppUrl("Hola mundo");
    expect(url).toBe(`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20mundo`);
  });
});

describe("buildCartWhatsAppMessage", () => {
  it("lista los ítems con cantidad y agrega el total estimado", () => {
    const msg = buildCartWhatsAppMessage(
      [
        { productTitle: "Sillón Oslo", quantity: 1 },
        { productTitle: "Mesa Roble", quantity: 2 },
      ],
      "$61.900",
    );
    expect(msg).toContain("• 1x Sillón Oslo");
    expect(msg).toContain("• 2x Mesa Roble");
    expect(msg).toContain("Total estimado: $61.900");
    expect(msg).toContain("¿Cómo coordino el pago?");
  });

  it("funciona con un carrito vacío sin romper", () => {
    const msg = buildCartWhatsAppMessage([], "$0");
    expect(msg).toContain("Total estimado: $0");
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx vitest run src/lib/constants/contact.test.ts`
Expected: FAIL — "Failed to resolve import '@/lib/constants/contact'".

- [ ] **Step 3: Implementar las constantes y helpers**

Create `src/lib/constants/contact.ts`:

```ts
/** Número de WhatsApp de atención (formato internacional sin +). */
export const WHATSAPP_NUMBER = "59896244003";

/** Arma un link wa.me con un mensaje pre-cargado. */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type WhatsAppCartLine = { productTitle: string; quantity: number };

/**
 * Mensaje pre-cargado para coordinar una compra por WhatsApp desde el carrito.
 * `totalLabel` es el total ya formateado (ej. "$61.900").
 */
export function buildCartWhatsAppMessage(
  lines: WhatsAppCartLine[],
  totalLabel: string,
): string {
  const items = lines.map((l) => `• ${l.quantity}x ${l.productTitle}`).join("\n");
  return [
    "Hola! Quiero hacer una compra en CompraHogar:",
    items,
    `Total estimado: ${totalLabel}`,
    "¿Cómo coordino el pago?",
  ]
    .filter(Boolean)
    .join("\n");
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx vitest run src/lib/constants/contact.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants/contact.ts src/lib/constants/contact.test.ts
git commit -m "feat(contact): constante WHATSAPP_NUMBER + helpers de mensaje"
```

---

## Task 3: `WhatsAppButton` usa la constante compartida

**Files:**
- Modify: `src/components/shared/WhatsAppButton.tsx:6-12`

Refactor sin cambio de comportamiento visible: reemplazar el número y la construcción de URL inline por los helpers compartidos.

- [ ] **Step 1: Reemplazar la constante local y el armado de URL**

En `src/components/shared/WhatsAppButton.tsx`, las líneas actuales:

```tsx
import { useState } from "react";
import { X } from "lucide-react";

const WHATSAPP_NUMBER = "59896244003";
const DEFAULT_MESSAGE = "Hola! Tengo una consulta sobre un producto en CompraHogar.";

export function WhatsAppButton() {
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
```

Pasan a ser:

```tsx
import { useState } from "react";
import { X } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/constants/contact";

const DEFAULT_MESSAGE = "Hola! Tengo una consulta sobre un producto en CompraHogar.";

export function WhatsAppButton() {
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);

    const whatsappUrl = buildWhatsAppUrl(DEFAULT_MESSAGE);
```

(El resto del componente queda igual.)

- [ ] **Step 2: Verificar tipos y lint**

Run: `npx tsc --noEmit && pnpm lint`
Expected: cero errores nuevos.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/WhatsAppButton.tsx
git commit -m "refactor(whatsapp): reusar buildWhatsAppUrl compartido"
```

---

## Task 4: Cortar el pago en el `CartProvider`

**Files:**
- Modify: `src/components/cart/CartProvider.tsx` (import nuevo; líneas 110, 175-177, 189-195)

Cuando el checkout está deshabilitado: `checkoutUrl` queda `null` y `addToCart` retorna `undefined`. El item igual se agrega al carrito.

- [ ] **Step 1: Agregar el import del helper**

Después de los imports existentes (debajo de `import { getShippingRate } ...` en la línea 5), agregar:

```tsx
import { isCheckoutEnabled } from "@/lib/config/storeStatus";
```

- [ ] **Step 2: Gatear `checkoutUrl` en `parseCartData`**

Línea 110 actual:

```tsx
        setCheckoutUrl(cart.checkoutUrl);
```

Reemplazar por:

```tsx
        setCheckoutUrl(isCheckoutEnabled() ? cart.checkoutUrl : null);
```

- [ ] **Step 3: Gatear el return en la rama "carrito existente" de `addToCart`**

Líneas 175-177 actuales:

```tsx
                const newCheckoutUrl = body?.data?.cartLinesAdd?.cart?.checkoutUrl;
                parseCartData(body?.data?.cartLinesAdd?.cart);
                return newCheckoutUrl;
```

Reemplazar por:

```tsx
                const newCheckoutUrl = body?.data?.cartLinesAdd?.cart?.checkoutUrl;
                parseCartData(body?.data?.cartLinesAdd?.cart);
                return isCheckoutEnabled() ? newCheckoutUrl : undefined;
```

- [ ] **Step 4: Gatear el return en la rama "carrito nuevo" de `addToCart`**

Líneas 189-195 actuales:

```tsx
                const newCart = body?.data?.cartCreate?.cart;
                if (newCart) {
                    setCartId(newCart.id);
                    localStorage.setItem("shopify_cart_id", newCart.id);
                    parseCartData(newCart);
                    return newCart.checkoutUrl;
                }
```

Reemplazar por:

```tsx
                const newCart = body?.data?.cartCreate?.cart;
                if (newCart) {
                    setCartId(newCart.id);
                    localStorage.setItem("shopify_cart_id", newCart.id);
                    parseCartData(newCart);
                    return isCheckoutEnabled() ? newCart.checkoutUrl : undefined;
                }
```

- [ ] **Step 5: Verificar tipos y lint**

Run: `npx tsc --noEmit && pnpm lint`
Expected: cero errores nuevos.

- [ ] **Step 6: Commit**

```bash
git add src/components/cart/CartProvider.tsx
git commit -m "feat(cart): no exponer checkoutUrl cuando el pago esta deshabilitado"
```

---

## Task 5: `CartSheet` — estado "Pago en construcción" + CTA WhatsApp

**Files:**
- Modify: `src/components/cart/CartSheet.tsx` (imports; destructura; bloque de botones líneas 239-265)

- [ ] **Step 1: Agregar imports y el flag computado**

En la cabecera de imports (líneas 1-11), agregar `Lock` y `MessageCircle` al import de lucide-react y los dos módulos nuevos. El import de iconos actual:

```tsx
import { Trash2, Plus, Minus, ShieldCheck, ShoppingCart } from "lucide-react";
```

pasa a:

```tsx
import { Trash2, Plus, Minus, ShieldCheck, ShoppingCart, Lock, MessageCircle } from "lucide-react";
```

Y agregar, junto a los otros imports:

```tsx
import { isCheckoutEnabled } from "@/lib/config/storeStatus";
import { buildWhatsAppUrl, buildCartWhatsAppMessage } from "@/lib/constants/contact";
```

Luego, dentro de `CartDrawer`, justo después de la línea `const totalEstimated = subtotal + (estimatedShipping || 0);` (línea 39), agregar:

```tsx
    const checkoutEnabled = isCheckoutEnabled();
    const whatsappCheckoutUrl = buildWhatsAppUrl(
        buildCartWhatsAppMessage(
            items.map((i) => ({ productTitle: i.productTitle, quantity: i.quantity })),
            `$${totalEstimated.toLocaleString(LOCALE)}`,
        ),
    );
```

- [ ] **Step 2: Reemplazar el bloque de botones del footer**

El bloque actual (líneas 239-265):

```tsx
                        <div className="grid gap-2.5">
                            <Button
                                size="lg"
                                className="w-full font-semibold rounded-xl h-[48px]"
                                onClick={() => {
                                    if (checkoutUrl) window.location.href = checkoutUrl;
                                }}
                                disabled={isCartLoading || !checkoutUrl}
                            >
                                {checkoutUrl ? (
                                    <>
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Finalizar compra
                                    </>
                                ) : (
                                    <span>Preparando checkout...</span>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full rounded-xl h-[44px] border-primary/30 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary"
                                onClick={onClose}
                            >
                                Seguir comprando
                            </Button>
                        </div>
```

Reemplazar por:

```tsx
                        <div className="grid gap-2.5">
                            {checkoutEnabled ? (
                                <Button
                                    size="lg"
                                    className="w-full font-semibold rounded-xl h-[48px]"
                                    onClick={() => {
                                        if (checkoutUrl) window.location.href = checkoutUrl;
                                    }}
                                    disabled={isCartLoading || !checkoutUrl}
                                >
                                    {checkoutUrl ? (
                                        <>
                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                            Finalizar compra
                                        </>
                                    ) : (
                                        <span>Preparando checkout...</span>
                                    )}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        size="lg"
                                        className="w-full font-semibold rounded-xl h-[48px]"
                                        disabled
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Pago en construcción
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
                                        Estamos terminando de habilitar el pago online. Mientras tanto, escribinos y coordinamos tu compra al instante.
                                    </p>
                                    <a
                                        href={whatsappCheckoutUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 w-full h-[48px] rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Coordinar compra por WhatsApp
                                    </a>
                                </>
                            )}
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full rounded-xl h-[44px] border-primary/30 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary"
                                onClick={onClose}
                            >
                                Seguir comprando
                            </Button>
                        </div>
```

- [ ] **Step 3: Verificar tipos y lint**

Run: `npx tsc --noEmit && pnpm lint`
Expected: cero errores nuevos.

- [ ] **Step 4: Smoke test manual del carrito**

Con `NEXT_PUBLIC_CHECKOUT_ENABLED` sin setear en `.env.local`:

```bash
pnpm dev
```

1. Agregar un producto al carrito → se abre el drawer, el ítem aparece.
2. En el footer: botón **"Pago en construcción"** deshabilitado con candado, la nota, y el botón verde **"Coordinar compra por WhatsApp"**.
3. Click en el botón verde → abre `wa.me` con el mensaje listando el ítem + total.

- [ ] **Step 5: Commit**

```bash
git add src/components/cart/CartSheet.tsx
git commit -m "feat(cart): estado pago en construccion + CTA WhatsApp en el drawer"
```

---

## Task 6: `ProductView` — ocultar "Comprar ahora" cuando el pago está deshabilitado

**Files:**
- Modify: `src/components/shop/ProductView.tsx` (import; const tras línea 33; botones líneas 651-668 y 829-846)

- [ ] **Step 1: Agregar import y flag computado**

Agregar junto a los imports existentes:

```tsx
import { isCheckoutEnabled } from "@/lib/config/storeStatus";
```

Justo después de la línea 33 (`const { addToCart, isCartLoading, checkoutUrl } = useCart();`), agregar:

```tsx
    const checkoutEnabled = isCheckoutEnabled();
```

- [ ] **Step 2: Envolver el botón "Comprar ahora" de desktop**

El bloque actual (líneas 651-668):

```tsx
                            <Button
                                size={isQuickView ? "default" : "lg"}
                                className={cn(
                                    "w-full text-base font-semibold h-[48px] rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all",
                                    isVariantChanging && "opacity-80"
                                )}
                                onClick={async () => {
                                    if (currentVariant?.id) {
                                        const url = await addToCart(currentVariant.id, quantity);
                                        if (url) window.location.href = url;
                                        else if (checkoutUrl) window.location.href = checkoutUrl;
                                        else setIsCartOpen(true);
                                    }
                                }}
                                disabled={isCartLoading || !currentVariant?.id || isVariantChanging}
                            >
                                {isVariantChanging ? <Loader2 className="w-5 h-5 animate-spin" /> : "Comprar ahora"}
                            </Button>
```

Envolverlo en `{checkoutEnabled && (...)}`:

```tsx
                            {checkoutEnabled && (
                                <Button
                                    size={isQuickView ? "default" : "lg"}
                                    className={cn(
                                        "w-full text-base font-semibold h-[48px] rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all",
                                        isVariantChanging && "opacity-80"
                                    )}
                                    onClick={async () => {
                                        if (currentVariant?.id) {
                                            const url = await addToCart(currentVariant.id, quantity);
                                            if (url) window.location.href = url;
                                            else if (checkoutUrl) window.location.href = checkoutUrl;
                                            else setIsCartOpen(true);
                                        }
                                    }}
                                    disabled={isCartLoading || !currentVariant?.id || isVariantChanging}
                                >
                                    {isVariantChanging ? <Loader2 className="w-5 h-5 animate-spin" /> : "Comprar ahora"}
                                </Button>
                            )}
```

> El botón "Agregar al carrito" que sigue (debajo, ~líneas 669-685) queda intacto y pasa a ser el único CTA, ya a ancho completo dentro del mismo `flex flex-col`.

- [ ] **Step 3: Envolver el botón "Comprar ahora" del sticky mobile**

El bloque actual (líneas 829-846):

```tsx
                    <Button
                        size="lg"
                        className={cn(
                            "w-full h-[48px] text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all",
                            isVariantChanging && "opacity-80"
                        )}
                        onClick={async () => {
                            if (currentVariant?.id) {
                                const url = await addToCart(currentVariant.id, quantity);
                                if (url) window.location.href = url;
                                else if (checkoutUrl) window.location.href = checkoutUrl;
                                else setIsCartOpen(true);
                            }
                        }}
                        disabled={isCartLoading || !currentVariant?.id || isVariantChanging}
                    >
                        {isVariantChanging ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Comprar ahora"}
                    </Button>
```

Envolverlo en `{checkoutEnabled && (...)}`:

```tsx
                    {checkoutEnabled && (
                        <Button
                            size="lg"
                            className={cn(
                                "w-full h-[48px] text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all",
                                isVariantChanging && "opacity-80"
                            )}
                            onClick={async () => {
                                if (currentVariant?.id) {
                                    const url = await addToCart(currentVariant.id, quantity);
                                    if (url) window.location.href = url;
                                    else if (checkoutUrl) window.location.href = checkoutUrl;
                                    else setIsCartOpen(true);
                                }
                            }}
                            disabled={isCartLoading || !currentVariant?.id || isVariantChanging}
                        >
                            {isVariantChanging ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Comprar ahora"}
                        </Button>
                    )}
```

> El botón "Agregar al carrito" del sticky (debajo, ~líneas 847+) queda intacto como único CTA a ancho completo.

- [ ] **Step 4: Verificar tipos y lint**

Run: `npx tsc --noEmit && pnpm lint`
Expected: cero errores nuevos.

- [ ] **Step 5: Smoke test manual del PDP**

Con `NEXT_PUBLIC_CHECKOUT_ENABLED` sin setear:

```bash
pnpm dev
```

1. Abrir un producto en desktop → **no** aparece "Comprar ahora"; sí "Agregar al carrito".
2. En mobile (DevTools responsive) → el sticky inferior muestra solo "Agregar al carrito".
3. Click "Agregar al carrito" → el ítem entra y abre el drawer con el estado de Task 5.

- [ ] **Step 6: Commit**

```bash
git add src/components/shop/ProductView.tsx
git commit -m "feat(pdp): ocultar Comprar ahora cuando el pago esta deshabilitado"
```

---

## Task 7: Documentar el flag en `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Leer el archivo para ubicar dónde insertar**

Run: `cat .env.example`
Buscar la sección de Shopify / commerce para agregar el flag cerca (o al final si no hay una sección clara).

- [ ] **Step 2: Agregar el bloque documentado**

Agregar al `.env.example`:

```dotenv
# Pago online. "true" = checkout habilitado (los botones llevan a la pasarela).
# Cualquier otro valor o sin setear = pago en construccion (bloqueado, fail-closed).
# Mantener apagado hasta que la pasarela (Shopify o Medusa) este lista para vender.
NEXT_PUBLIC_CHECKOUT_ENABLED=false
```

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "docs(env): documentar NEXT_PUBLIC_CHECKOUT_ENABLED"
```

---

## Task 8: Verificación final completa

**Files:** ninguno (solo verificación).

- [ ] **Step 1: Suite de tests completa**

Run: `npm test`
Expected: PASS — incluye `storeStatus.test.ts` (4) y `contact.test.ts` (3), sin romper los tests existentes.

- [ ] **Step 2: Tipos y lint del proyecto entero**

Run: `npx tsc --noEmit && pnpm lint`
Expected: cero errores.

- [ ] **Step 3: Smoke test — pago DESHABILITADO (estado actual)**

Con `NEXT_PUBLIC_CHECKOUT_ENABLED` sin setear, `pnpm dev`:
- [ ] PDP desktop y mobile: no hay "Comprar ahora"; sí "Agregar al carrito".
- [ ] Carrito: "Pago en construcción" deshabilitado + nota + CTA WhatsApp.
- [ ] CTA WhatsApp abre `wa.me` con los ítems y el total en el mensaje.
- [ ] FAB de WhatsApp (esquina) sigue funcionando igual que antes.

- [ ] **Step 4: Smoke test — pago HABILITADO (regresión)**

Setear en `.env.local`:

```dotenv
NEXT_PUBLIC_CHECKOUT_ENABLED=true
```

Reiniciar `pnpm dev` y verificar:
- [ ] Reaparecen los "Comprar ahora" en el PDP y redirigen al checkout.
- [ ] El carrito muestra "Finalizar compra" y redirige al checkout.

Luego **revertir** el cambio en `.env.local` (sacar la línea o ponerla en `false`) para dejar la tienda bloqueada.

- [ ] **Step 5: Commit de cierre (opcional)**

```bash
git commit --allow-empty -m "chore(checkout): verificacion final del modo en construccion"
```

---

## Notas de Ops (cliente — fuera de código)

No son parte de la implementación, pero completan la solución:

1. **Shopify → "Pause and Build" (~US$5/mes):** deshabilita el checkout del lado de Shopify (bloqueo real del pago) y mantiene admin + datos para seguir construyendo. Alternativa: pausa total, pero entonces el catálogo deja de cargar en el sitio.
2. **Exportar datos de Shopify YA** (productos, colecciones, clientes) dentro del período de gracia (~30 días tras el vencimiento). Ver Phase 2 del plan de migración a Medusa (`docs/superpowers/plans/2026-05-16-medusa-migration.md`). Time-sensitive.
