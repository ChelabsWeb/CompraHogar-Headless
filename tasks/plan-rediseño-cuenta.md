# Plan de rediseño — sección `/cuenta`

> **Para el equipo de implementación:** este plan NO se ejecuta todavía. Necesita revisión + decisiones de los puntos abiertos al final del documento antes de pasar a código.

**Goal:** rediseñar las 7 sub-rutas de `/cuenta` para alinearlas con el sistema visual premium recién definido (Cal Sans + GlassButton + tokens primary/secondary), mejorar densidad/jerarquía y unificar el fetching de datos del cliente.

**Arquitectura propuesta:** mantener el patrón shell con sidebar fijo desktop / tabs horizontales mobile (ya funciona), pero refactorizar el shell, crear un dashboard real en `/cuenta`, unificar fetching con un hook `useCustomer()` SWR-based, y rediseñar cada página con un header de sección común y cards consistentes.

**Tech stack:** Next.js 16 App Router, React 19, Tailwind v4 (tokens en `globals.css`), Radix UI primitives, SWR (a introducir formalmente), Shopify Storefront API.

---

## 1. Auditoría del estado actual

### 1.1 Layout shell (`src/app/cuenta/layout.tsx` + `account-sidebar.tsx`)

**Lo que funciona:**
- Auth gate server-side bien implementado (cookie `customerAccessToken` → redirect a `/login` si falta o token inválido).
- Patrón sidebar desktop + tabs scrollables mobile — convención e-commerce reconocible, no hay que romperla.
- Sticky positioning calibrado al header (`top-[140px]` desktop / `top-[72px]` mobile).

**Problemas:**
- Colores hardcodeados (`bg-[#21645d]`, `text-[#21645d]`, `bg-[#21645d]/10`) en lugar de los tokens semánticos `bg-primary`, `text-primary`, `bg-primary/10` que ya existen en `globals.css:82` (`--primary: #21645d`, expuesto como `--color-primary`). Cada cambio futuro de paleta obliga a un find-replace.
- El nombre del usuario en sidebar (`text-base font-bold text-slate-900`) ignora la regla `h1, h2, h3, h4, h5, h6 { font-family: var(--font-display) }` de `globals.css:115` — al ser un `<h2>` Cal Sans + `font-bold` produce un peso visualmente raro (Cal Sans ya es display, no necesita refuerzo).
- El avatar es solo iniciales sobre un círculo `bg-[#21645d]/10` — funcional pero plano. No aprovecha la nueva estética premium.
- Background gris `bg-[#f7f7f8]` es agradable pero podría ser más luminoso/cálido (`bg-neutral-50` o un blanco con un subtle radial).
- No hay breadcrumbs, aunque el componente `<Breadcrumbs>` existe en `src/components/ui/breadcrumbs.tsx`.

### 1.2 `/cuenta` dashboard (`src/app/cuenta/page.tsx`)

**Estado actual:** archivo de 5 líneas con un solo `redirect("/cuenta/perfil")`. **No hay dashboard.** El usuario aterriza en datos personales en frío sin un overview.

**Problema:** desperdicio de oportunidad. Un dashboard con saludo, último pedido, dirección por defecto y accesos rápidos da contexto y eleva la percepción del producto. Es la primera pantalla post-login.

### 1.3 Perfil (`src/app/cuenta/perfil/page.tsx`)

**Lo que funciona:** el toggle vista/edición es claro, los mensajes de éxito/error tienen buenos colores semánticos, y el form es accesible (labels, IDs, focus rings).

**Problemas:**
- 100% client component que arranca con un `Loader2` spinner mientras hace `fetch('/api/customer/profile')` en `useEffect`. Debería ser un skeleton (no spinner) y, mejor aún, leer del cache de SWR compartido con el resto de la sección.
- Cada input tiene 14 clases Tailwind copy-pasteadas (`w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]`) — ya existe `<Input>` en `src/components/ui/input.tsx` que debería usarse.
- Botón "Guardar" es `bg-[#21645d]` hardcodeado en vez del Button del sistema.
- Modo lectura: lista de pares clave-valor en un grid 1-col mobile / sm:row — visual pobre. Podríamos aprovechar para mostrar una tarjeta más rica (avatar grande arriba + datos + estado de marketing como toggle visual).

### 1.4 Mis compras lista (`src/app/cuenta/mis-compras/page.tsx`)

**Lo que funciona:** skeleton cards bien construidas, empty state pulido (con shopping-bag icon, copy, CTA), thumbnails apilados de los productos, status badges con colores semánticos.

**Problemas:**
- Card es densa: order#, status, fecha, precio, count en columna izquierda apretada, todo `text-sm` — falta jerarquía. El order# y status pierden peso.
- Click target completo del card es OK, pero el chevron a la derecha es muy pequeño.
- Mobile: thumbnails se ocultan completamente (`hidden sm:flex`) — pierde contexto visual del pedido.
- Heading `text-2xl font-bold` (mismo issue Cal Sans + bold).
- Empty state usa un button regular con `bg-primary` — bien, pero tipográficamente plano vs. el favoritos empty que ya usa GlassButton.

### 1.5 Detalle de pedido (`src/app/cuenta/mis-compras/[id]/page.tsx`)

**Lo que funciona:** OrderTimeline es una pieza buena (vertical, con animation, status logic correcto), divisiones claras por sección (timeline / productos / dirección / pago), back-link arriba.

**Problemas:**
- Usa `framer-motion` para animar la página entera — peso JS innecesario para una página de cuenta. Suficiente con CSS.
- 5 cards apiladas con la misma jerarquía visual (mismo `bg-white rounded-2xl border`) — no hay agrupación. La info importante (status, total) no destaca.
- Status badge pegado al `<h1>` desktop pero rompe visualmente en mobile (gap-3 hace wrap). Debería estar en una "barra de estado" propia.
- "Rastrear envío" usa color hardcodeado.
- El fetching es ineficiente: pide TODOS los pedidos (`/api/customer/profile`) y filtra por orderNumber en cliente. Si tenés 20 órdenes, descargás 20× lineItems. Mejorable pero no bloqueante.
- Loading state es un Loader2 grande — debería ser skeleton de la estructura final.
- Empty/not-found ("Pedido no encontrado") está bien pero el back-link aparece arriba duplicando UX (existe el sidebar).

### 1.6 Direcciones (`src/app/cuenta/direcciones/page.tsx`)

**Lo que funciona:** CRUD completo, labels custom (Casa/Oficina/Otra) en localStorage, set-default working, AddressCard limpio.

**Problemas:**
- El modal de delete-confirm está implementado a mano (`fixed inset-0 z-50 ...`) en vez de usar `<Modal>` que existe en `src/components/ui/modal.tsx`.
- El AddressForm es modal externo (componente shop) — OK, pero asegurarse que use el sistema visual nuevo.
- Botón "Agregar dirección" es teal hardcodeado.
- Empty state con MapPin icon y CTA inline link — ok pero podría ser más cálido siguiendo el patrón de mis-compras vacío.
- Sin paginación (limita a 10 direcciones — bound del query). Para Uruguay es suficiente.

### 1.7 Favoritos (`src/app/cuenta/favoritos/page.tsx`)

**Lo que funciona:** ya usa `<GlassButton>` en el empty state (es la única ruta que aplicó el sistema nuevo). Skeletons OK. Wishlist live via `useWishlist()` provider, buen patrón.

**Problemas:**
- Heading inconsistente: `Mis favoritos` vs `Mis Favoritos` (capitalización cambia entre empty y populated).
- Botón "Agregar al carrito" en cada card es teal hardcodeado y se repite N veces — viola la regla de pesos visuales pero como es por-card es aceptable.
- Sin filtros/sort (no urgente).
- Card es muy similar a la del catálogo principal pero reimplementada inline — oportunidad para extraer un `<WishlistCard>` o reusar el ProductCard del catálogo si existe (no auditado en profundidad).

### 1.8 Cambiar contraseña (`src/app/cuenta/cambiar-password/page.tsx`)

**Lo que funciona:** validación inline limpia, toggle show/hide bien hecho, autocomplete `new-password` correcto, mensajes de error específicos.

**Problemas:**
- Pide solo "nueva contraseña" — Shopify Storefront customerUpdate efectivamente no requiere current password (limitación API). UX decente para esa restricción.
- Inputs y botón con clases hardcodeadas (mismo issue).
- Sin requisitos visibles de password (length min 5 está harcoded en validate pero no se muestra al usuario hasta error).
- Heading mismo problema.

---

## 2. Information architecture propuesta

### 2.1 Jerarquía de rutas

```
/cuenta                       → DASHBOARD (NEW — reemplaza el redirect)
  ├── /perfil                 → datos personales
  ├── /mis-compras            → lista de pedidos
  │     └── /[id]             → detalle de pedido
  ├── /direcciones            → libreta de direcciones
  ├── /favoritos              → wishlist
  └── /cambiar-password       → cambio de contraseña
```

**Cambios:** se mantienen las 7 rutas. La única diferencia es que `/cuenta` deja de redirigir y tiene contenido propio (dashboard).

**Por qué sidebar y NO tabs/breadcrumbs solos:**
- 7 ítems es demasiado para tabs horizontales en desktop sin que se vean apretados.
- Los usuarios e-commerce esperan sidebar lateral en cuenta (Mercado Libre, Amazon, Shopify Customer Account UI).
- El layout actual ya implementa sidebar desktop + tabs mobile y funciona — no romperlo.

### 2.2 Agrupación visual en sidebar

Reorganizar los items con dividers semánticos para reducir carga cognitiva:

```
Sección 1: Mi cuenta
  ├── Inicio          (NEW — apunta a /cuenta)
  ├── Mi perfil
  └── Cambiar contraseña

Sección 2: Compras
  ├── Mis compras
  └── Direcciones

Sección 3: Lista de deseos
  └── Favoritos

[divider]
Cerrar Sesión
```

Esto hace al sidebar más escaneable. Los grupos se separan con un sutil `border-t border-slate-100` + `text-xs uppercase text-slate-400 tracking-wider` para el label de grupo.

### 2.3 Breadcrumbs

Agregar `<Breadcrumbs>` (componente ya existe) en la parte superior de cada sub-página, **debajo** del header del sitio y **dentro** del main content, no en el shell. Patrón:

```
Inicio > Mi cuenta > Mis compras > Pedido #1234
```

En mobile, breadcrumbs se ocultan (`hidden sm:flex`) para no robar espacio a las tabs sticky.

---

## 3. Layout shell propuesto

### 3.1 Estructura visual desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────┐
│ [Header del sitio — fijo arriba, ~140px]                           │
├────────────────────────────────────────────────────────────────────┤
│  max-w-6xl mx-auto, padding 8/12                                    │
│ ┌──────────────────┐  ┌─────────────────────────────────────────┐ │
│ │ Sidebar 240px    │  │ Inicio › Mi cuenta › Mis compras        │ │
│ │ sticky top-[140] │  │                                          │ │
│ │                  │  │ ┌─────────────────────────────────────┐ │ │
│ │ ┌──────────────┐ │  │ │ <AccountSectionHeader>              │ │ │
│ │ │ avatar grad  │ │  │ │ h1 (Cal Sans, 28-32px)              │ │ │
│ │ │ Nombre       │ │  │ │ description (slate-500)             │ │ │
│ │ │ email        │ │  │ │ optional [Action]                   │ │ │
│ │ └──────────────┘ │  │ └─────────────────────────────────────┘ │ │
│ │                  │  │                                          │ │
│ │ MI CUENTA        │  │ ┌─────────────────────────────────────┐ │ │
│ │ • Inicio         │  │ │ Contenido de la página              │ │ │
│ │ • Mi perfil      │  │ │ (cards / forms / lists)             │ │ │
│ │ • Contraseña     │  │ │                                      │ │ │
│ │                  │  │ └─────────────────────────────────────┘ │ │
│ │ COMPRAS          │  │                                          │ │
│ │ • Mis compras    │  └─────────────────────────────────────────┘ │
│ │ • Direcciones    │                                                │
│ │                  │                                                │
│ │ DESEOS           │                                                │
│ │ • Favoritos      │                                                │
│ │ ─────────────    │                                                │
│ │ Cerrar sesión    │                                                │
│ └──────────────────┘                                                │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 Estructura visual mobile (<1024px)

```
┌────────────────────────────────────┐
│ [Header sitio — sticky top, 72px]  │
├────────────────────────────────────┤
│ [Tabs scrollable horizontal]        │
│ < Inicio Perfil Compras Favoritos > │
│ sticky top-[72px], bg-white         │
├────────────────────────────────────┤
│  px-4 py-6                          │
│                                     │
│  <AccountSectionHeader>              │
│   h1                                │
│   descripción                       │
│                                     │
│  Cards / forms / listas             │
│                                     │
└────────────────────────────────────┘
```

Tabs mobile: agregar el ítem "Inicio" al principio y mantener scroll horizontal. No mostrar dividers (ruido en mobile).

### 3.3 Tokens y estética del shell

- Background del shell: `bg-neutral-50` (cálido) en lugar de gris azulado actual. Alternativa premium: `bg-gradient-to-b from-white via-neutral-50 to-neutral-100`.
- Cards: `bg-white rounded-2xl border border-neutral-200/70 shadow-sm` (suavizar el border existente, agregar sombra mínima).
- Sidebar card: el mismo + `backdrop-blur-sm` opcional si se decide aplicar un toque glass al sidebar.
- Avatar: `<div>` 56px circular con `bg-gradient-to-br from-primary to-secondary` + iniciales en blanco, font-display, font-medium. Reemplaza el flat actual.

---

## 4. Diseño página por página

> **Convención:** todos los headings principales usarán `<AccountSectionHeader>` (componente nuevo a crear) que renderiza un `<h1 className="font-display text-[28px] sm:text-[32px] font-normal tracking-tight">` + descripción + slot opcional para acción a la derecha.
>
> **Convención GlassButton:** máximo 1 instancia por pantalla, reservada al CTA primario contextual. El resto usa `<Button>` del sistema (`src/components/ui/button.tsx`).
>
> **Convención fetching:** todas las páginas consumen `useCustomer()` (SWR hook nuevo, key compartido `'/api/customer/profile'`). Eliminamos los `useEffect + useState + fetch` manuales.

### 4.1 `/cuenta` — Dashboard (NEW)

Reemplazar el redirect actual con un dashboard de bienvenida.

**Secciones (top → bottom):**

1. **Saludo personalizado**
   - `<h1>` "Hola, {firstName}" (Cal Sans, 32px desktop / 24px mobile, font-normal)
   - `<p>` con la fecha del día o un microcopy contextual ("Bienvenido de vuelta a tu cuenta")

2. **Grid de cards de resumen** (2 cols desktop, 1 col mobile)
   - **Card "Último pedido":**
     - Si hay pedidos: número, status badge, fecha, total, link "Ver detalles" → `/cuenta/mis-compras/{id}`
     - Si no hay: empty state mini con icono Package + copy "Aún no realizaste compras" + link "Explorar productos"
   - **Card "Dirección de envío":**
     - Si hay defaultAddress: nombre + line1 + city/province → link "Editar" → `/cuenta/direcciones`
     - Si no hay: empty state + CTA "Agregar dirección"
   - **Card "Favoritos":**
     - Wishlist count (de `useWishlist()`) + link "Ver lista" → `/cuenta/favoritos`
     - Si > 0: mostrar 3 thumbnails apilados como en mis-compras lista
   - **Card "Datos de contacto":**
     - email + phone (de useCustomer) + link "Editar" → `/cuenta/perfil`

3. **Banner CTA premium** (al final, una sola instancia visible de GlassButton):
   - Título "¿Buscás algo nuevo?" (Cal Sans)
   - Subtítulo corto
   - `<GlassButton variant="light" size="lg" asChild>` → "Explorar productos" → `/products`
   - Background con un gradiente sutil teal→orange a 5-8% opacity para no romper la calma del dashboard

**Estados:**
- Loading: skeleton del grid completo (4 card skeletons + banner skeleton).
- Error: usar el `<ErrorFallback>` ya existente.

**Componentes nuevos:** `DashboardSummaryCard` (privado del dashboard).

**Datos de Shopify usados:**
- `customer.firstName`
- `customer.orders.edges[0]` (más reciente)
- `customer.defaultAddress`
- `customer.email`, `customer.phone`
- `useWishlist().count` (de localStorage, no de Shopify)

### 4.2 `/cuenta/perfil`

**Layout:**

1. **AccountSectionHeader**
   - Title: "Mi perfil"
   - Description: "Gestioná tus datos personales y preferencias de comunicación"
   - Action slot: botón `<Button variant="ghost" size="sm">` con icono Pencil → "Editar" (cuando no estás editando)

2. **Card "Identidad"** (modo lectura por defecto)
   - Avatar grande (96px) con gradiente teal→orange + iniciales
   - Nombre completo (Cal Sans, 24px, font-normal)
   - Email (slate-600)
   - Phone si existe (slate-600)

3. **Card "Preferencias"**
   - Toggle visual (Radix Switch via `src/components/ui/switch.tsx`) con label "Recibir ofertas y novedades por email"
   - Estado lectura: visualizado como un row con un check verde o un dash gris

4. **Modo edición** (cuando `editing === true`):
   - Sustituye las 2 cards por una sola card con form
   - Inputs: usar `<Input>` de `src/components/ui/input.tsx` (refactor)
   - Layout: 2 columnas en desktop (firstName | lastName), email full, phone full, switch full
   - Footer del card: `<Button>Guardar</Button>` + `<Button variant="ghost">Cancelar</Button>` (NO GlassButton acá; es un form interno, no un CTA hero)

**Estados:**
- Loading: skeleton de 2 cards (estructura header + body skeleton).
- Error: alert inline (mantener mensaje actual).
- Success: alert verde inline (mantener).

**Datos de Shopify:** `firstName`, `lastName`, `email`, `phone`, `acceptsMarketing` (todos disponibles).

### 4.3 `/cuenta/mis-compras`

**Layout:**

1. **AccountSectionHeader**
   - Title: "Mis compras"
   - Description: "Historial completo de tus pedidos"
   - Action slot: vacío (el flujo es "ver detalle")

2. **Filtros sutiles** (opcional, bajo el header)
   - Tabs ghosted: "Todos" / "En proceso" / "Completados" — filtrado client-side sobre orders.
   - **Decisión abierta:** ¿se incluye en este sprint o queda para v2? Recomiendo **v2** para no inflar el alcance.

3. **Lista de OrderCards**
   - Reescribir el card actual con mejor jerarquía:
     ```
     ┌────────────────────────────────────────────────────────┐
     │ [thumbnails -space-x-2]   #1234     [Status badge]    │
     │  4 productos              5 mayo 2026                  │
     │  ────────────────────────────────                      │
     │  Total: $4.890 UYU                  [→ Ver detalle]    │
     └────────────────────────────────────────────────────────┘
     ```
   - Thumbnails visibles también en mobile (más pequeños, 32px), no ocultos.
   - Status badge: clase consistente `text-xs font-semibold px-2.5 py-1 rounded-full` con colores semánticos por estado.
   - Card hover: `hover:border-primary/30 hover:shadow-md transition-all`.

4. **Empty state**
   - Mismo patrón actual (icono Package en círculo + copy + CTA).
   - **CTA: `<GlassButton variant="light" size="md" asChild>` "Explorar productos"** → única instancia GlassButton de la página.

**Estados:**
- Loading: 3 SkeletonCards (mantener actual).
- Error: ErrorFallback shared o alert inline.

**Datos:** `customer.orders.edges` (orderNumber, processedAt, financialStatus, fulfillmentStatus, totalPrice, lineItems para thumbnails).

### 4.4 `/cuenta/mis-compras/[id]`

**Layout:**

1. **Breadcrumb** "Inicio › Mi cuenta › Mis compras › Pedido #1234"
2. **Header de pedido (especial — más prominente que AccountSectionHeader normal)**
   - Card destacada con gradient sutil:
     - `<h1>Pedido #1234</h1>` (Cal Sans, 28px)
     - Status badge grande, fecha
     - Resumen rápido: total + cantidad de productos
     - **Si hay tracking: 1 `<GlassButton variant="light" size="md">Rastrear envío</GlassButton>`** (única instancia GlassButton en la página)

3. **Timeline** (mantener `<OrderTimeline>` actual — funciona bien)
   - **Cambio:** quitar el wrapper `<motion.div>` de la página entera (peso JS innecesario). El timeline ya tiene sus propias animations internas.

4. **Productos** (card)
   - Mantener layout actual con thumbnails 64px + título + variante + cant + precio unitario + total.
   - Mejora: separar visualmente subtotal por producto vs row.

5. **Dirección de envío** (card, si existe)
   - Mostrar tal cual.

6. **Resumen de pago** (card)
   - Subtotal / Envío / Total (mantener).

7. **Link "Ver recibo en Shopify"** al final, ghost link.

**Estados:**
- Loading: skeleton de las 5 cards (header + timeline + productos + envío + pago).
- Not found: card centrado con Package icon + copy + link "Volver a mis compras". Mantener el back-link arriba.

**Componentes nuevos:** `OrderHeaderCard` (sólo para esta página).

**Decisiones técnicas:**
- Quitar `framer-motion`. Si querés transition de mount, usar Tailwind `animate-in fade-in-0 slide-in-from-bottom-2`.
- Mantener fetch ineficiente (filtrado client-side de todos los orders) por ahora — refactor a query individual de order es scope creep.

### 4.5 `/cuenta/direcciones`

**Layout:**

1. **AccountSectionHeader**
   - Title: "Mis direcciones"
   - Description: "Gestioná tus direcciones de envío"
   - Action slot: `<Button>` con Plus icon → "Agregar dirección"

2. **Grid de AddressCards** (1 col mobile, 2 cols desktop, max 3 cols 2xl)
   - Mantener `<AddressCard>` actual con micro-mejoras:
     - Avatar/icono pequeño arriba según label (Casa = home, Oficina = building, Otra = map-pin) — opcional, ayuda a escanear.
     - Border accent sutil: si es default, `border-primary/40` en lugar de la badge.
     - Hover: `hover:border-primary/30 transition-colors`.

3. **Empty state**
   - Card centrado (mantener) con MapPin icon + copy + button "Agregar tu primera dirección" (NO GlassButton — usar `<Button variant="ghost">`).

4. **Modal de creación/edición**
   - Reutilizar `<AddressForm>` actual (que ya es modal externo). Verificar que use `<Modal>` del sistema (`src/components/ui/modal.tsx`) en su implementación interna; si no, refactor.

5. **Confirm-delete**
   - **Reemplazar el modal hecho a mano por `<Modal>` del sistema** o `<Dialog>` de Radix. Layout: title "Eliminar dirección" + body + 2 buttons (Cancelar ghost + Eliminar destructive).

**Estados:**
- Loading: skeleton del grid (4 card skeletons).
- Error: alert inline (mantener).

**Datos:** `customer.addresses`, `customer.defaultAddress.id`. Labels (Casa/Oficina/Otra) viven en localStorage — **NO** son un campo de Shopify; mantener esa decisión.

### 4.6 `/cuenta/favoritos`

**Layout:**

1. **AccountSectionHeader**
   - Title: "Mis favoritos" (lowercase consistente — corregir el `Mis Favoritos` actual)
   - Description: "{count} producto(s) guardado(s)" — el subtítulo ya existe, integrarlo
   - Action slot: vacío

2. **Grid de WishlistCards**
   - Mantener layout 2/3/4 cols.
   - Refactorizar el card inline en un componente `<WishlistCard>` reutilizable en `src/components/shop/`.
   - Botón "Agregar al carrito": queda como Button regular (NO GlassButton — sería N instancias, viola la regla).
   - Heart button mantener.

3. **Empty state** (ya tiene GlassButton — perfecto)
   - Mantener tal cual; este es el ejemplo de cómo quedan los empty states del resto.

**Estados:**
- Loading: SkeletonCard grid (mantener).

**Datos:** wishlist IDs de `useWishlist()` + query Shopify `getProductsByIdsQuery` (mantener flujo).

### 4.7 `/cuenta/cambiar-password`

**Layout:**

1. **AccountSectionHeader**
   - Title: "Cambiar contraseña"
   - Description: "Elegí una contraseña segura. Mínimo 5 caracteres."

2. **Card con form** (mantener estructura actual, refactor visual)
   - Inputs usando `<Input>` del sistema con prefix Lock icon y suffix Eye toggle.
   - Indicador visual de fortaleza de contraseña (opcional, no crítico).
   - Botón "Actualizar contraseña" usando `<Button>` del sistema (NO GlassButton; es un form, no un CTA hero).

**Estados:**
- Success: alert verde inline (mantener).
- Error: alert rojo inline (mantener).
- Field errors: red border + helper text (mantener).

**Datos:** mutación `customerUpdateMutation` con `password`. **Nota:** Shopify Storefront API no requiere current password (limitación API). Documentar este behavior en un microcopy debajo del título: "Por seguridad, recibirás un email confirmando el cambio." — verificar si Shopify efectivamente envía ese email; si no, ajustar microcopy.

---

## 5. Consideraciones técnicas

### 5.1 Server vs Client Components

| Ruta | Tipo actual | Tipo propuesto | Razón |
|------|------------|----------------|-------|
| `layout.tsx` | Server | **Server** (mantener) | Auth gate + fetch inicial del customer |
| `account-sidebar.tsx` | Client | **Client** (mantener) | usa `usePathname` para active state |
| `/cuenta/page.tsx` | Server (redirect) | **Server** | render server-side del dashboard, fetch en parent |
| `/perfil` | Client | **Client** (mantener) | form con state interno |
| `/mis-compras` | Client | **Client** (mantener) | navegación entre pedidos / SWR client-side |
| `/mis-compras/[id]` | Client | **Server** (refactor) | datos no mutables, mejor SSR |
| `/direcciones` | Client | **Client** (mantener) | CRUD interactivo |
| `/favoritos` | Client | **Client** (mantener) | depende de localStorage (`useWishlist`) |
| `/cambiar-password` | Client | **Client** (mantener) | form |

**Decisión:** mantener client por defecto donde ya está, salvo `/mis-compras/[id]` que se beneficia de SSR.

### 5.2 SWR hook unificado: `useCustomer()`

Crear `src/hooks/useCustomer.ts`:

```ts
"use client";
import useSWR from "swr";

interface CustomerData { /* ... mapear de getCustomerQuery */ }

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error("auth");
  return r.json();
});

export function useCustomer() {
  const { data, error, isLoading, mutate } = useSWR<{ customer: CustomerData }>(
    "/api/customer/profile",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000, // 1 min
    }
  );
  return {
    customer: data?.customer ?? null,
    isLoading,
    error,
    mutate, // para refrescar después de mutations
  };
}
```

Beneficios:
- Deduplica fetches entre páginas (al navegar de perfil a mis-compras no se re-fetcha).
- Cache en memoria con revalidación opt-in.
- `mutate()` después de un update permite refresh sin reload.

**Páginas que migran al hook:** perfil, mis-compras, mis-compras/[id], direcciones. Favoritos mantiene su flow propio (depende de IDs de localStorage).

### 5.3 Datos de Shopify Customer API — qué hay disponible

Revisado `src/lib/customer.ts:41-139` (query `getCustomer`). Campos disponibles:

- **Customer:** `id`, `firstName`, `lastName`, `email`, `phone`, `acceptsMarketing`, `metafield(custom, wishlist)`
- **Orders (last 20, sorted desc):** `id`, `orderNumber`, `processedAt`, `financialStatus`, `fulfillmentStatus`, `statusUrl`, `totalPrice`, `subtotalPrice`, `totalShippingPrice`, `shippingAddress`, `lineItems (50 max)`, `successfulFulfillments.trackingInfo`
- **LineItem:** `title`, `quantity`, `variant.id`, `variant.title`, `variant.price`, `variant.image`
- **Addresses (first 10):** `id`, `address1/2`, `city`, `company`, `country`, `firstName`, `lastName`, `phone`, `province`, `zip`
- **defaultAddress:** mismos campos abreviados

**Campos que NO existen y NO debemos inventar:**
- `customer.createdAt` (fecha de registro) — no está en el query
- `customer.tags` — no expuestos
- discount codes / store credit
- order returns / refund initiation desde la app
- subscription / membership status
- product reviews del customer

Si el dashboard quiere mostrar "Cliente desde 2024" o similar, **requiere modificar el query** (agregar `createdAt`) en `src/lib/customer.ts:41` — flagged como decisión abierta.

### 5.4 Loading skeletons

Reemplazar todos los `<Loader2 className="animate-spin">` (5+ instancias en la sección) con skeletons que reflejen la estructura final. Usar `<Skeleton>` de `src/components/ui/skeleton.tsx` como building block.

Patrón estándar:
```tsx
<div className="space-y-6">
  <div className="space-y-2">
    <Skeleton className="h-8 w-48" /> {/* h1 */}
    <Skeleton className="h-4 w-72" /> {/* description */}
  </div>
  <Skeleton className="h-32 w-full rounded-2xl" /> {/* card */}
</div>
```

### 5.5 Mobile breakpoints

Usar los breakpoints estándar Tailwind:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px ← punto donde aparece el sidebar desktop
- `xl:` 1280px

El layout actual ya tiene `lg:flex-row` en el shell — mantener. El sticky de tabs mobile (`top-[72px]`) y de sidebar desktop (`top-[140px]`) ya está calibrado al header — verificar que no rompa con el header refactor de fast-mode-buttons (commit f2f727d).

### 5.6 Tokens semánticos — refactor cleanup

**Find & replace** (con cuidado, file por file) en toda la sección `/cuenta/**`:

| Antes | Después |
|-------|---------|
| `bg-[#21645d]` | `bg-primary` |
| `hover:bg-[#1a504a]` | `hover:bg-primary/90` |
| `text-[#21645d]` | `text-primary` |
| `bg-[#21645d]/10` | `bg-primary/10` |
| `bg-[#21645d]/20` | `bg-primary/20` |
| `focus:ring-[#21645d]/20` | `focus:ring-primary/20` |
| `focus:border-[#21645d]` | `focus:border-primary` |
| `text-slate-900` (en h1-h6) | `text-foreground` |

### 5.7 Accesibilidad

- Todos los headings con `font-display` heredan tracking-tight de la regla global — verificar que el peso `font-normal` (no bold) sea legible. Cal Sans tiene presencia visual propia.
- Sidebar nav: el active state debe tener contraste 4.5:1 entre `text-primary` y `bg-primary/10` — verificar (es `#21645d` sobre `#21645d1A`, podría ser borderline; testear con WebAIM).
- Form inputs: mantener focus-visible ring (ya lo tiene globals).
- Modales: el `<Modal>` del sistema debe trapearse el focus (verificar implementación del componente UI).
- ARIA labels en botones icon-only (Pencil, Trash, Plus): agregar `aria-label`.

---

## 6. Roadmap de implementación

> **Convención de subagentes:** dispatch en plan-mode primero por fase, review entre fases. Cada fase produce un PR independiente.

### Fase 0 — Fundamentos compartidos (1 agente, ~3-4h)

Bloquea todas las demás. No paralelizable.

- [ ] **0.1** Crear `src/hooks/useCustomer.ts` (SWR hook).
- [ ] **0.2** Crear `src/components/cuenta/AccountSectionHeader.tsx` (componente reusable).
- [ ] **0.3** Crear `src/components/cuenta/AccountCard.tsx` (wrapper estandarizado para cards de la sección).
- [ ] **0.4** Crear `src/components/cuenta/AccountSkeleton.tsx` (skeletons reusables: SkeletonHeader, SkeletonCard, SkeletonGrid).
- [ ] **0.5** Refactor `src/app/cuenta/layout.tsx`: actualizar bg, max-width, gap, padding. Pasar customer al sidebar via SWR-aware (o seguir pasando como prop desde server, decisión abierta).
- [ ] **0.6** Refactor `src/app/cuenta/account-sidebar.tsx`: avatar gradiente, agrupación visual, tokens semánticos, font-display correcto, sidebar mobile sticky con micro-tweak.
- [ ] **0.7** Find-replace tokens semánticos (`#21645d` → `primary`) en TODOS los archivos `/cuenta/**` y componentes shop relacionados (AddressCard, OrderTimeline).
- [ ] **0.8** Run `pnpm lint` y `pnpm build`. Fix anything broken. Commit.

**Output:** PR `feat(cuenta): foundation — useCustomer hook + shared primitives + token cleanup`.

### Fase 1 — Dashboard nuevo (1 agente, ~2-3h)

Depende de Fase 0.

- [ ] **1.1** Reemplazar `src/app/cuenta/page.tsx` (eliminar redirect).
- [ ] **1.2** Implementar Dashboard con saludo + 4 cards de resumen + banner CTA con GlassButton.
- [ ] **1.3** Crear `src/components/cuenta/DashboardSummaryCard.tsx`.
- [ ] **1.4** Verificar empty states de cada card.
- [ ] **1.5** Agregar "Inicio" como primer item de la nav del sidebar (modificar `account-sidebar.tsx:16-22`).
- [ ] **1.6** Test manual con cuenta sin pedidos / sin direcciones / sin favoritos.

**Output:** PR `feat(cuenta): dashboard de bienvenida con resumen y accesos rápidos`.

### Fase 2 — Páginas individuales (paralelizable, 2-3h cada una)

Depende de Fase 0. Hasta 6 agentes en paralelo en worktrees separados (uno por página). Si paralelo no es viable, secuenciarlas.

- [ ] **2.A** `/cuenta/perfil` — refactor con AccountSectionHeader, Input system, useCustomer, Button system, skeleton. (1 agente)
- [ ] **2.B** `/cuenta/mis-compras` — refactor lista de cards, mejor jerarquía, GlassButton solo en empty. (1 agente)
- [ ] **2.C** `/cuenta/mis-compras/[id]` — convertir a Server Component, OrderHeaderCard nuevo, quitar framer-motion, GlassButton tracking. (1 agente)
- [ ] **2.D** `/cuenta/direcciones` — modal Radix system, AddressCard polish, Button system. (1 agente)
- [ ] **2.E** `/cuenta/favoritos` — extraer WishlistCard, fix capitalización, header consistente. (1 agente)
- [ ] **2.F** `/cuenta/cambiar-password` — refactor form al Input system + Button system. (1 agente)

Cada PR independiente: `feat(cuenta): rediseño de [ruta]`.

### Fase 3 — Polish + verificación (1 agente, ~2h)

Depende de Fase 1 + 2.

- [ ] **3.1** A11y review: contraste de active state, ARIA labels, focus traps en modales.
- [ ] **3.2** Mobile UX review: sticky tabs no rompen, scroll horizontal smooth, tap targets 44x44.
- [ ] **3.3** Loading/error/empty state pass: cada ruta los 3 estados verificados a mano.
- [ ] **3.4** `pnpm build` + `pnpm lint` clean.
- [ ] **3.5** Lighthouse mobile + desktop en `/cuenta/perfil` y `/cuenta/mis-compras` — target LCP < 2.5s.
- [ ] **3.6** Update `CLAUDE.md` del proyecto con notas del nuevo patrón (useCustomer hook, AccountSectionHeader convention).

**Output:** PR `chore(cuenta): polish, a11y review y verificación final`.

### Estimación total

- **Secuencial:** 0 + 1 + 2×6 + 3 = 4h + 3h + 18h + 2h = **27h** (~1 semana 1 agente full-time)
- **Paralelizado:** 0 → 1 → (2A...2F en paralelo) → 3 = 4h + 3h + 3h + 2h = **12h** (~2 días con buen paralelismo)

---

## 7. Riesgos y decisiones abiertas

> **Bloqueantes** (requieren input del owner antes de pasar a Fase 0).

### 7.1 ✅ DECIDIDO — Dashboard real en `/cuenta`

Owner aprobó dashboard real. Fase 1 procede como está descripta.

### 7.2 Decisión: ¿Mostrar "Cliente desde {año}" en el dashboard?

Implica modificar `getCustomerQuery` en `src/lib/customer.ts:41` para agregar `createdAt`. Es trivial pero expande el alcance.

**Recomendación:** **no** en este sprint. Dashboard sin ese dato es completo. Lo agregamos después si pinta.

### 7.3 ✅ DECIDIDO — Eliminar `framer-motion` del order detail

Owner aprobó. Reemplazar `<motion.div>` por `animate-in fade-in-0 slide-in-from-bottom-2 duration-300` (tailwindcss-animate ya está instalado vía `@plugin "tailwindcss-animate"` en `globals.css:4`). Mantener `<OrderTimeline>` como está (sus animations internas también usan framer-motion — esas se mantienen, no las cambiamos).

### 7.4 Decisión: ¿Filtros de status en mis-compras?

Tabs "Todos / En proceso / Completados". Útil pero amplía scope.

**Recomendación:** **v2**. Sacarlo de este sprint.

### 7.5 ✅ DECIDIDO — Avatar con gradiente teal→orange selectivo

Owner delegó la decisión. Resolución:

- **Avatar grande del dashboard (96px)** → `bg-gradient-to-br from-primary to-secondary` + iniciales blancas Cal Sans.
- **Avatar del sidebar desktop (56px, sticky card)** → mismo gradiente.
- **Avatar del sidebar mobile** (si llegara a existir en una versión condensada) → solo `bg-primary` sólido para no saturar al repetirse en una superficie compacta.

Razón: reservamos el gradiente a los avatares "hero" de la sección donde tienen presencia visual. En superficies pequeñas o repetidas, el gradiente se gasta y compite con el resto del UI.

### 7.6 Decisión: ¿Dark mode en esta sección?

`globals.css` tiene `@custom-variant dark` definido pero `:root` no expone vars dark. Implementar dark mode AHORA es scope creep.

**Recomendación:** light only. Dejar la base visual lista para dark futuro (usando tokens semánticos solo, sin hardcode).

### 7.7 Decisión: ¿Sticky offsets calibrados al header refactor reciente?

El último commit (`f2f727d feat(ui): premium glass button system + Cal Sans typography`) probablemente no cambió la altura del header, pero conviene verificar. Si el header cambió a una altura distinta de 140px desktop / 72px mobile, ajustar `top-[140px]` y `top-[72px]` en `account-sidebar.tsx`.

**Acción:** flagged en Fase 0.5 (test visual).

### 7.8 Riesgo: contraste de active state en sidebar

`text-primary` (`#21645d`) sobre `bg-primary/10` (`#21645d` a 10%) — el bg efectivo sobre `bg-white` queda alrededor de `#E8EFEE`. Contraste teal / `#E8EFEE` ≈ 8:1, OK. Pero validar con WebAIM Contrast Checker en Fase 3.1.

### 7.9 Riesgo: GlassButton sobre fondo claro

`GlassButton variant="light"` sobre `bg-neutral-50` puede verse plano (poco contraste de glass). Verificar visualmente. Mitigación: aplicar gradient sutil al banner del dashboard donde vive el GlassButton.

### 7.10 Decisión: ¿Refactor del fetch ineficiente en `/mis-compras/[id]`?

Hoy pide TODOS los orders y filtra. Una alternativa es agregar un `getOrderQuery(id)` en `src/lib/customer.ts` y consultarlo individualmente.

**Recomendación:** **no en este sprint**. Es un refactor de datos, no de diseño. Anotar en backlog.

---

## 8. Out of scope (explícito — para evitar scope creep durante implementación)

- ❌ Loyalty / puntos / membresía
- ❌ Reviews del usuario sobre productos comprados
- ❌ Devoluciones / RMA desde la app
- ❌ Notificaciones in-app
- ❌ Dark mode
- ❌ Filtros avanzados en mis-compras (status filters)
- ❌ Refactor de query individual de order
- ❌ Modificación de `getCustomerQuery` (excepto si una decisión abierta cambia el verdict)
- ❌ Cambios al header del sitio
- ❌ Cambios al footer del sitio
- ❌ Re-skin de `/login` o `/register` (otra sección)

---

**Fin del plan.** Listo para revisión + decisiones de §7 antes de pasar a implementación.
