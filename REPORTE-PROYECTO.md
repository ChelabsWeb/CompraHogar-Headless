# Reporte: CompraHogar Headless

Generado: 2026-03-23

## Resumen ejecutivo

CompraHogar es un e-commerce headless de artículos para construcción y hogar, orientado al mercado uruguayo, con backend en Shopify y frontend custom en Next.js 16. El proyecto está considerablemente avanzado: cuenta con catálogo de productos, carrito completo, autenticación de clientes, sistema de favoritos, búsqueda predictiva, páginas de cuenta y contenido estático. **Completitud estimada: ~70-75%.** Los pendientes principales son integraciones con servicios externos (reviews, CRM, email transaccional) y hardening para producción.

## Información general

- **Nombre del proyecto:** CompraHogar Headless (`comprahogar-headless`)
- **Descripción:** Storefront headless de e-commerce para materiales de construcción y hogar. Conectado a Shopify como backend de comercio, con frontend Next.js para control total del diseño y experiencia de usuario. Mercado target: Uruguay.
- **URL de producción:** Deployado en Vercel (proyecto `comprahogar-headless`, ID: `prj_tGSZqgzH3CTtsPDopQ3ZmmYAAerr`). No se detectó dominio custom configurado — probablemente accesible vía `comprahogar-headless.vercel.app` o similar. Verificar manualmente.
- **Repositorio:** GitHub — `ChelabsWeb/CompraHogar-Headless`. Repositorio single-project (no monorepo).
- **Estructura de carpetas principal:**
  ```
  src/
  ├── app/              # App Router: páginas, layouts, API routes, server actions
  │   ├── api/          # Endpoints: webhooks, newsletter, back-in-stock, wishlist, location, customer
  │   ├── collections/  # Listado y detalle de colecciones
  │   ├── products/     # Detalle de producto
  │   ├── cuenta/       # Dashboard de cuenta (perfil, pedidos, direcciones, favoritos, cambiar password)
  │   ├── login/        # Login y recuperar password
  │   ├── registro/     # Registro de cuenta
  │   └── [páginas estáticas]  # sobre-nosotros, envíos, devoluciones, privacidad, términos
  ├── components/
  │   ├── analytics/    # Tracker de GA4
  │   ├── cart/         # CartProvider y CartSheet
  │   ├── layout/       # Header, Footer, MegaMenu, MobileMenu, LocaleSwitcher
  │   ├── shared/       # ErrorFallback, InfoDrawer, PredictiveSearch
  │   ├── shop/         # Componentes de negocio (ProductGrid, ProductView, Filters, Wishlist, etc.)
  │   └── ui/           # Componentes base (button, card, input, modal, sheet, etc.)
  ├── hooks/            # useStoreFilters
  └── lib/              # shopify.ts, queries.ts, types.ts, analytics.ts, customer.ts, reviews.ts, utils.ts, rate-limit.ts
      └── constants/    # collectionHierarchy.ts, shippingRates.ts
  ```

## Stack técnico

| Tecnología | Versión | Propósito |
|---|---|---|
| Next.js | 16.1.6 | Framework principal (App Router) |
| React | 19.2.3 | Biblioteca de UI |
| TypeScript | ^5 | Tipado estático |
| Tailwind CSS | ^4 | Framework de estilos utility-first |
| SWR | ^2.4.1 | Data fetching client-side |
| Radix UI | ^1.4.3 | Primitivos headless de UI (+ progress ^1.1.8, switch ^1.2.6, tooltip ^1.2.8) |
| Framer Motion | ^12.34.3 | Animaciones |
| Lucide React | ^0.575.0 | Iconografía |
| Vaul | ^1.1.2 | Drawer/sheet component |
| class-variance-authority | ^0.7.1 | Gestión de variantes de componentes |
| clsx / tailwind-merge | ^2.1.1 / ^3.5.0 | Utilidades de clases CSS |
| tailwindcss-animate / tw-animate-css | ^1.0.7 / ^1.4.0 | Animaciones CSS con Tailwind |
| js-cookie | ^3.0.5 | Manejo de cookies en cliente |
| shadcn | ^3.8.5 (dev) | CLI para generación de componentes UI |
| ESLint | ^9 + eslint-config-next 16.1.6 | Linting |
| @tailwindcss/typography | ^0.5.19 | Plugin tipografía Tailwind |
| @tailwindcss/postcss | ^4 | Integración PostCSS |

## Servicios externos

| Servicio | Plan actual | Costo mensual estimado | Propósito |
|---|---|---|---|
| Vercel | No determinado — verificar manualmente (proyecto vinculado, ID: `prj_tGSZqgzH3CTtsPDopQ3ZmmYAAerr`) | $0 (Free) / $20 (Pro por miembro) | Hosting y deploy |
| Shopify | Tienda activa: `comprahogaruy.myshopify.com`. Plan no determinado — verificar en admin de Shopify | Variable según plan Shopify | Backend de comercio (Storefront API + Admin API) |
| Google Tag Manager / GA4 | Gratuito | $0 | Analytics (snippet GTM implementado, pendiente configurar `NEXT_PUBLIC_GTM_ID`) |
| Judge.me | Scripts cargados en layout.tsx (widget_preloader + installed.js) | $0 (Free) / $15 (Awesome) | Sistema de reviews de productos (scripts cargados pero integración server-side NO implementada) |
| Google Fonts (Inter) | Gratuito | $0 | Tipografía |
| Unsplash | Gratuito (imágenes referenciadas en hero/promos) | $0 | Imágenes placeholder |

**Servicios referenciados en código pero NO integrados aún:**

| Servicio | Estado | Propósito planificado |
|---|---|---|
| Klaviyo | Mencionado en backlog como CRM/email | CRM, back-in-stock notifications, email marketing |
| Resend | Mencionado en backlog | Email transaccional |
| ERP externo | Referenciado en webhook handler | Sincronización de órdenes |

## Base de datos

Este proyecto **NO usa Supabase ni base de datos propia**. Todo el almacenamiento de datos se gestiona a través de Shopify:

| Recurso de datos | Plataforma | Descripción |
|---|---|---|
| Productos | Shopify Storefront API | Catálogo completo con variantes, precios, imágenes, metafields (material, instrucciones de cuidado, rendimiento) |
| Colecciones | Shopify Storefront API | Categorías y agrupaciones de productos |
| Carrito | Shopify Storefront API | Cart API con líneas, costos, códigos de descuento, gift cards |
| Clientes | Shopify Storefront API | Auth, perfil, direcciones, órdenes, wishlist (metafield) |
| Órdenes | Shopify Storefront API | Historial de compras, estado financiero, estado de fulfillment, tracking |
| Newsletter | Shopify Storefront API | Creación de customer con `acceptsMarketing: true` |
| Back-in-stock | Shopify Admin API | Metafield `custom.back_in_stock_emails` en productos (JSON con emails) |
| Wishlist (remoto) | Shopify Storefront API | Metafield `custom.wishlist` en customer + localStorage como fuente primaria |
| Webhooks | Shopify → Next.js API | Eventos: products/create/update/delete, collections/create/update/delete, orders/create/updated, inventory_levels/update |

**Nota:** No se encontraron carpetas `supabase/`, archivos de migraciones, ni configuración de Supabase en el proyecto. El stack real es **Next.js + Shopify + Vercel**, no Next.js + Supabase + Vercel.

## Funcionalidades completadas

- ✅ **Homepage completa**: Hero banner responsive (mobile/desktop), trust bar con iconos, card de autenticación, categorías con shortcuts, sección "Oferta del día", banners de promociones, productos destacados vía Shopify API — `src/app/page.tsx`

- ✅ **Catálogo de productos**: Listado por colección con filtros dinámicos de Shopify (sidebar desktop + drawer mobile), sorting, paginación con cursores, subcategorías jerárquicas, breadcrumbs — `src/app/collections/[handle]/page.tsx`, `src/components/shop/SidebarFilter.tsx`, `src/components/shop/MobileFilterDrawer.tsx`, `src/hooks/useStoreFilters.ts`

- ✅ **Página de producto**: Galería multimedia (imágenes, video MP4, modelo 3D via model-viewer), selector de variantes con color swatches, tabs (descripción/ficha técnica/garantía), sticky buy box mobile, "Avisarme cuando vuelva" para out-of-stock, recomendaciones, calculadora de materiales (m²), calculadora de envío por departamento, breadcrumbs — `src/app/products/[handle]/page.tsx`, `src/components/shop/ProductView.tsx`, `src/components/shop/ShippingCalculator.tsx`, `src/components/shop/MaterialsCalculator.tsx`

- ✅ **Carrito completo**: CartProvider con React Context, CartSheet (drawer lateral), agregar/actualizar/eliminar productos, códigos de descuento, gift cards, asociación automática de carrito a cliente autenticado, redirect a Shopify Checkout — `src/components/cart/CartProvider.tsx`, `src/components/cart/CartSheet.tsx`

- ✅ **Autenticación de clientes**: Login con email/password via Shopify Customer API, registro, logout, recuperar contraseña (flujo email + reset por token URL), rate limiting por IP, cookies HTTP-only, middleware de protección de rutas `/cuenta/*` — `src/app/login/`, `src/app/registro/`, `src/app/olvide-password/`, `src/app/recuperar-password/`, `src/middleware.ts`

- ✅ **Dashboard de cuenta**: Perfil editable, historial de pedidos con detalle y timeline, gestión de direcciones (CRUD + dirección default), página de favoritos, cambiar contraseña — `src/app/cuenta/`

- ✅ **Sistema de favoritos/wishlist**: WishlistProvider con localStorage + sync a Shopify metafield para usuarios autenticados, botón de favorito en productos, drawer de favoritos, página de favoritos en cuenta — `src/components/shop/WishlistProvider.tsx`, `src/components/shop/FavoriteButton.tsx`, `src/components/shop/FavoritesSheet.tsx`, `src/app/api/wishlist/sync/route.ts`

- ✅ **Búsqueda predictiva**: Componente en header con búsqueda en tiempo real via Shopify Predictive Search API — `src/components/shared/PredictiveSearch.tsx`, `src/app/actions/search.ts`

- ✅ **Página de búsqueda**: Resultados de búsqueda completos — `src/app/search/page.tsx`

- ✅ **Newsletter**: Endpoint que crea customer en Shopify con `acceptsMarketing: true`, formulario en Footer — `src/app/api/newsletter/route.ts`

- ✅ **Back-in-stock notifications**: Endpoint real conectado a Shopify Admin API, guarda emails en metafield del producto con deduplicación y cap de 500 entradas — `src/app/api/back-in-stock/route.ts`

- ✅ **Webhooks de Shopify**: Endpoint con validación HMAC estricta (timingSafeEqual), routing por topic (catálogo, órdenes, inventario), revalidación de cache — `src/app/api/webhooks/route.ts`

- ✅ **Mega menú y navegación**: Header con mega menu desktop, menú mobile hamburguesa, fallback a datos mock si Shopify no responde — `src/components/layout/Header.tsx`, `src/components/layout/MegaMenu.tsx`, `src/components/layout/MobileMenu.tsx`

- ✅ **Analytics GA4/GTM**: Capa de analytics tipada con eventos `view_item` y `add_to_cart`, snippet GTM condicional en layout (se activa con env var), tracker de página de producto — `src/lib/analytics.ts`, `src/components/analytics/ProductPageTracker.tsx`, `src/app/layout.tsx`

- ✅ **SEO**: Sitemap dinámico con paginación (productos + colecciones de Shopify), robots.ts, metadata OG/Twitter, URLs canónicas — `src/app/sitemap.ts`, `src/app/robots.ts`

- ✅ **Security headers**: CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy — `next.config.ts`

- ✅ **Páginas estáticas**: Sobre nosotros, envíos y entregas, devoluciones y garantías, política de privacidad, términos y condiciones — `src/app/sobre-nosotros/`, `src/app/envios-y-entregas/`, etc.

- ✅ **Tarifas de envío**: Sistema de cálculo por departamento (19 departamentos de Uruguay) con umbral de envío gratis ($4,000) — `src/lib/constants/shippingRates.ts`

- ✅ **Jerarquía de colecciones**: Mapeo de categorías/subcategorías para navegación — `src/lib/constants/collectionHierarchy.ts`

- ✅ **Componentes UI completos**: Sistema de componentes basado en shadcn/ui — button, card, input, modal, sheet, drawer, accordion, tabs, badge, breadcrumbs, checkbox, radio, select, textarea, tooltip, switch, progress, pagination, skeleton, separator, scroll-area, toast, toggle, quantity-selector, navigation-menu — `src/components/ui/`

- ✅ **Rate limiting**: Implementación in-memory para endpoints de auth — `src/lib/rate-limit.ts`

- ✅ **Error handling**: Error boundaries por ruta (`error.tsx`), página 404 (`not-found.tsx`), loading states (`loading.tsx`), componente ErrorFallback reutilizable — `src/app/error.tsx`, `src/app/not-found.tsx`

## Funcionalidades pendientes

- ⏳ **Integración de reviews real**: `lib/reviews.ts` retorna `null` (mock). Necesita conectar con Judge.me API server-side o metafields de Shopify (`reviews.rating`, `reviews.rating_count`). Scripts de Judge.me ya están cargados en `layout.tsx` — Complejidad: **media**

- ⏳ **Webhook handlers de órdenes**: `handleOrderWebhook()` en `api/webhooks/route.ts` está vacío (solo un TODO). Falta integrar con ERP externo, Klaviyo (CRM) y Resend (email transaccional) — Complejidad: **alta**

- ⏳ **Google Tag Manager ID**: El snippet GTM está implementado en `layout.tsx` pero requiere la variable de entorno `NEXT_PUBLIC_GTM_ID` para activarse. Sin ella, no hay tracking — Complejidad: **baja** (solo configuración)

- ⏳ **Dominio de producción y URL canónica**: `NEXT_PUBLIC_SITE_URL` no está configurada; sitemap y metadata usan `localhost:3000` como fallback — Complejidad: **baja**

- ⏳ **Dato "vendidos" hardcodeado**: "1024 vendidos" en `ProductView.tsx` es un valor estático, no proviene de Shopify ni analytics — Complejidad: **baja**

- ⏳ **Paginación hacia atrás en colecciones**: El código actual solo soporta paginación `direction=next`. Falta implementar el query con `last` y `before: cursor` — Complejidad: **media**

- ⏳ **Mock recommendations en EmptyState**: `EmptyState.tsx` tiene `mockRecommendations` hardcodeados en lugar de productos reales de Shopify — Complejidad: **baja**

- ⏳ **LocaleSwitcher**: Componente existe pero sin implementación real de multimoneda/multilenguaje — Complejidad: **alta**

- ⏳ **Calculadora de envío real**: `ShippingCalculator.tsx` usa tarifas estáticas por departamento (`shippingRates.ts`), no está conectado a la API de Shopify ni a un proveedor logístico real — Complejidad: **media**

- ⏳ **Modelo 3D en producción**: Usa `model-viewer` cargado desde CDN externo; evaluar impacto en performance y bundling — Complejidad: **baja**

- ⏳ **Metadata dinámica de colecciones**: `generateMetadata` en `collections/[handle]/page.tsx` construye el título desde el handle formateado, no desde datos reales de la colección en Shopify — Complejidad: **baja**

- ⏳ **Tipado estricto**: Múltiples usos de `any` en `layout.tsx`, `CartProvider.tsx`, `MegaMenu.tsx` y otros. Falta tipar respuestas de Storefront API — Complejidad: **media**

- ⏳ **Tests E2E**: No hay tests. Se necesitan tests Playwright para flujos críticos: agregar al carrito, checkout redirect, login/registro — Complejidad: **alta**

- ⏳ **Pipeline CI/CD**: No hay pipeline configurado. Falta configurar preview deployments por PR y verificaciones automáticas — Complejidad: **media**

- ⏳ **Accesibilidad (a11y)**: Color picker en `ProductView.tsx` usa botones sin `aria-label` descriptivo. Falta revisión completa de accesibilidad — Complejidad: **media**

- ⏳ **Categorías dinámicas en homepage**: Array `categories` en `page.tsx` está hardcodeado. Debería venir de `collectionHierarchy.ts` o de Shopify directamente — Complejidad: **baja**

- ⏳ **Eliminar página `/ui-test`**: `src/app/ui-test/page.tsx` expone la hoja de estilos interna. Debe eliminarse antes de producción — Complejidad: **baja**

## Estado del código

- **Archivos fuente (ts/tsx/css):** 131
- **Líneas de código:** ~15,290
- **Tests:** 0 tests del proyecto (No implementado)
- **Errores de TypeScript:** 3 errores conocidos en `src/app/api/webhooks/route.ts` (firma de `revalidateTag` con Next.js 16 requiere segundo argumento)
- **Vulnerabilidades npm:** 2 (1 moderate en `next@16.1.6` — 5 CVEs, 1 high en `flatted` — Prototype Pollution). Fix disponible via `npm audit fix`.
- **Último commit:** 2026-03-20 — `fix: shipping calculator UI, progress bar colors, mobile drawer z-index` (autor: Mate-Cardenas)
- **Total commits:** 29 (21 de Mate-Cardenas, 8 de Chelabs)
- **Primer commit:** ~2026-02-26

### Branches activas

| Branch | Propósito | Estado |
|---|---|---|
| `main` | Branch principal de producción | Base |
| `pre-launch-hardening` * | Hardening de pre-lanzamiento (GTM, security, SEO, webhooks) | **Branch activa actual — NO mergeada a main** |
| `Mobile-Fixes` | Correcciones de UX mobile | Mergeada (PR #2) |
| `ShopifyAPI-Conexiones` | Conexiones iniciales con Shopify API | Mergeada (PR #1) |
| `felipebranch` | Branch de desarrollo de Felipe | Sin detalles |
| `Kenmiti` | Branch de desarrollo | Sin detalles |
| `remotes/origin/felidesopapi` | Branch remota de Felipe | Sin detalles |
| `remotes/origin/felidisenio` | Branch remota de Felipe (diseño) | Sin detalles |
| `remotes/origin/login` | Branch de feature login | Sin detalles |

**⚠️ IMPORTANTE:** La branch `pre-launch-hardening` contiene TODO el trabajo de hardening (security headers, HMAC webhooks, GTM, back-in-stock real, newsletter real, cuenta de usuario, wishlist sync, etc.) y aún NO está mergeada a `main`. Esto significa que `main` está significativamente desactualizada.

## Variables de entorno requeridas

| Variable | Propósito | Estado |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | Dominio de la tienda Shopify (server-side) | ✅ Configurada: `comprahogaruy.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Dominio de la tienda Shopify (client-side) | ✅ Configurada |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Token de Storefront API (server-side) | ✅ Configurada |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Token de Storefront API (client-side) | ✅ Configurada |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Token de Admin API (para back-in-stock, webhooks) | ✅ Configurada |
| `SHOPIFY_WEBHOOK_SECRET` | Secreto para validación HMAC de webhooks | ✅ Configurada |
| `NEXT_PUBLIC_GTM_ID` | ID de Google Tag Manager (formato `GTM-XXXXXXX`) | ❌ No configurada — analytics desactivado |
| `NEXT_PUBLIC_SITE_URL` | URL canónica del sitio (para sitemap, metadata) | ❌ No configurada — usa `localhost:3000` como fallback |

**⚠️ RIESGO DE SEGURIDAD:** El archivo `.env.local` contiene tokens reales de Shopify (Storefront + Admin). Verificar que NO esté commiteado al repositorio (actualmente está en `.gitignore`).

## Plataformas

- [x] Web (Next.js 16 — responsive mobile-first)
- [ ] Mobile (React Native / Expo)
- [ ] Desktop (Electron / Tauri)

**Notas:** El proyecto es exclusivamente web. No hay planes documentados de app móvil nativa ni desktop. El diseño es mobile-first responsive con breakpoints para tablet y desktop. No hay estructura de monorepo multiplataforma.

## Deuda técnica y riesgos

1. **Branch `pre-launch-hardening` sin mergear a `main`**: Todo el trabajo significativo de los últimos días (security, auth, cuenta, wishlist, API routes) está en una branch separada. Si `main` es la que está deployada, la versión en producción carece de estas funcionalidades. **Impacto: CRÍTICO — mergear antes de la presentación.**

2. **Tokens de Shopify en `.env.local`**: Los tokens de Storefront y Admin API están en el archivo local. Están en `.gitignore` pero es fundamental verificar que nunca se commitearon al historial de git. El Admin token (`shpat_...`) da acceso de escritura a la tienda. **Impacto: ALTO si se filtra.**

3. **Next.js 16.1.6 con vulnerabilidades conocidas**: 5 CVEs moderadas (HTTP smuggling, disk cache DoS, CSRF bypass, HMR CSRF, resume buffering DoS). Fix disponible actualizando a 16.2.1. **Impacto: MEDIO — actualizar antes de producción.**

4. **`flatted` con Prototype Pollution (high severity)**: Dependencia transitiva con CVE. Fix disponible via `npm audit fix`. **Impacto: MEDIO.**

5. **3 errores de TypeScript**: En `webhooks/route.ts`, la función `revalidateTag` se llama con 1 argumento pero Next.js 16 requiere 2. El wrapper `revalidate()` al inicio del archivo maneja esto, pero las llamadas directas en `handleInventoryLevelWebhook` y `handleCatalogWebhook` usan `revalidate()` correctamente — los errores podrían ser del archivo `ts_errors.txt` desactualizado. Verificar. **Impacto: BAJO.**

6. **Rate limiting in-memory**: `rate-limit.ts` usa un `Map` en memoria. Se resetea con cada deploy/restart y no funciona en entornos con múltiples instancias (Vercel Edge). Para producción real considerar Upstash Redis o similar. **Impacto: BAJO a corto plazo.**

7. **Reviews mock (`lib/reviews.ts`)**: Retorna `null`, la sección de reviews no se muestra. Los scripts de Judge.me están cargados en el layout pero no hay integración server-side. **Impacto: MEDIO — feature visible faltante.**

8. **Webhook handlers de órdenes vacíos**: `handleOrderWebhook()` no hace nada. No hay notificación por email de órdenes ni sincronización con ERP. **Impacto: MEDIO — funcionalidad operativa faltante.**

9. **Datos hardcodeados**: "1024 vendidos" en ProductView, categorías en homepage, mock recommendations en EmptyState, "Oferta del día" con datos estáticos y enlace a `/`. **Impacto: BAJO — cosmético.**

10. **Sin tests**: 0 tests automatizados. Cualquier cambio puede romper funcionalidades sin detección. **Impacto: MEDIO a largo plazo.**

11. **Sin CI/CD pipeline**: No hay verificaciones automáticas en PRs. Los deploys dependen de la configuración manual de Vercel. **Impacto: BAJO a corto plazo.**

12. **Página `/ui-test` expuesta**: Muestra la hoja de estilos interna del proyecto. Debe eliminarse antes de producción. **Impacto: BAJO — estético/profesionalismo.**

## Costos mensuales estimados en producción

| Concepto | Mínimo | Esperado | Notas |
|---|---|---|---|
| Hosting (Vercel) | $0 | $20-40 | Free tier soporta el tráfico inicial. Pro = $20/miembro si se necesitan features avanzadas (2 miembros = $40) |
| Shopify | $39 | $39-105 | Basic Shopify $39/mes. Shopify $105/mes si se necesitan reportes avanzados. El Storefront API está incluido en todos los planes |
| Judge.me (Reviews) | $0 | $15 | Plan Free limitado. Plan Awesome $15/mes para features completas |
| Google Analytics / GTM | $0 | $0 | Gratuito |
| Dominio (.com.uy o .uy) | $2 | $2-5 | Precio anual de dominio uruguayo prorrateado mensual |
| Klaviyo (si se integra) | $0 | $20-45 | Free hasta 250 contactos. $20/mes para 251-500. Escala con la base de clientes |
| Resend (si se integra) | $0 | $0-20 | Free tier: 3,000 emails/mes. Pro: $20/mes para 50,000 emails |
| **TOTAL** | **$41** | **$96-225** | Rango según planes elegidos y volumen de negocio |

**Nota:** Los costos de Shopify son el componente principal y fijo. Shopify también cobra comisiones por transacción (2.9% + $0.30 en Basic, reducibles con planes superiores). Los costos de Vercel y servicios auxiliares pueden mantenerse en tier gratuito durante la fase de lanzamiento.
