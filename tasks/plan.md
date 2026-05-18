# Plan — CompraHogar
_Última actualización: 2026-05-17_

## Estado actual

E-commerce headless en avanzado estado. UI/UX pulido (a11y 100/100 Lighthouse, performance con streaming Suspense, lint sin errors). Integraciones externas pendientes.

**Lo que está construido:**
- Layout raíz con Header/Footer, providers (Cart/Wishlist/Compare), autenticación por cookie
- Homepage con hero carousel, trust bar, categorías, promociones especiales, showcases por colección (lazy con Suspense individual), productos destacados
- Listado de colecciones (`/collections/[handle]`): filtros URL-first, cursor pagination forward, sorting, sidebar Shopify, drawer móvil, breadcrumbs, jerarquía
- Página de producto (`/products/[handle]`): galería multimedia (imágenes, video, 3D vía model-viewer con lazy load), variantes con `aria-pressed`, calculadora materiales m², calculadora envío, tabs descripción/ficha/garantía, back-in-stock, sticky CTA móvil, recomendaciones
- Cart drawer (no route) con add/update/remove, descuentos, gift cards, asociación a cliente
- Auth: login, registro, logout, recuperar contraseña doble flujo, sección `/cuenta/*` con dashboard, pedidos, direcciones
- Búsqueda predictiva en header + página `/search` con SSR
- MegaMenu desktop + MobileMenu sidebar tipo app con edge-swipe
- Analytics GA4/GTM cableado (`pushDatalayerEvent` con `view_item` y `add_to_cart`)
- Meta Pixel integrado (ViewContent, AddToCart)
- Webhook endpoint estructurado (lógica placeholder)
- Páginas de contenido estático
- Sistema de comparación de productos con persistencia localStorage
- Wishlist persistida (localStorage + sync remoto si logged in)
- Recently Viewed
- PWA con manifest, service worker, install hints — **deprecated: vamos a Capacitor**
- Premium mobile pass: safe-area, bottom sheets, pull-to-refresh en collections, page transitions, predictive search fullscreen mobile, etc.

**UI/UX cerrado en esta sesión (2026-05-17):**
- Header desktop tape arreglado (`pt-[128px]`)
- A11y Lighthouse 92 → **100/100** en home y PDP (badges, dots HeroCarousel, aria-pressed color picker, heading order, contraste micro-copy)
- Performance: showcases lazy con Suspense + defer model-viewer
- Lint: 4 errors `react-hooks/set-state-in-effect` resueltos con patrón `requestAnimationFrame`
- CSP: `cdnwidget.judge.me` agregado a script-src
- `middleware.ts` → `proxy.ts` (migración Next 16)
- Placeholder mejorado para productos sin imagen

**Bloqueantes reales (pendientes):**
- Sin `.env.local`: variables `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` y `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` no configuradas en algunos entornos.
- Reviews (`lib/reviews.ts`): datos mock. Sin integración real con Judge.me o metafields Shopify.
- Back-in-stock (`ProductView.tsx`): handler mock con `console.log` y `alert()`.
- Webhook (`/api/webhooks/route.ts`): ERP, CRM (Klaviyo), email (Resend) son placeholders.

## Próximos pasos (ordenados por prioridad)

1. Configurar `.env.local` con credenciales reales de Shopify en cada entorno.
2. Configurar `NEXT_PUBLIC_SITE_URL` para canónicas SEO.
3. Integrar Judge.me real reemplazando `lib/reviews.ts` mock.
4. Implementar back-in-stock real (Klaviyo o endpoint interno).
5. Completar webhook Shopify con HMAC + lógica ERP/CRM/email.
6. Conectar newsletter del footer a Klaviyo/Mailchimp.
7. Implementar ShippingCalculator real por código postal.
8. Paginación hacia atrás en colecciones (hoy solo `next`).
9. Tipar `any` extendido en `layout.tsx`, `CartProvider.tsx`, `MegaMenu.tsx`.
10. Tests E2E Playwright (carrito, checkout redirect, login/registro).
11. CI/CD Vercel con preview por PR.
12. Mover categorías hardcoded en `src/app/page.tsx` a `lib/constants/categories.ts`.
13. **Iniciar migración a Capacitor** (plan en `docs/superpowers/plans/2026-05-16-medusa-migration.md` y futuro plan Capacitor).

## Decisión estratégica pendiente

- **Backend e-commerce**: Shopify Headless actual vs migración a Medusa.js v2 self-hosted. Plan completo en `docs/superpowers/plans/2026-05-16-medusa-migration.md`.
