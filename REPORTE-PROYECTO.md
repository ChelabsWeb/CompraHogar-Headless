# Reporte: CompraHogar
Generado: 2026-05-04 (sustituye reporte previo del 2026-03-23)

## Resumen ejecutivo

CompraHogar es un e-commerce headless para Uruguay (materiales, herramientas, sanitaria, electricidad), con Shopify como backend de comercio y un frontend Next.js 16 / React 19 con catálogo, carrito, checkout (vía Shopify), auth de clientes, búsqueda predictiva, comparador, cotizador de pintura, PWA instalable y assets de marca generados (Higgsfield) ya integrados. **Estado real: ~85% del web listo para producción, 0% de Capacitor / apps móviles (no hay nada iniciado), ~60% del "design system"** (CSS variables sí, sistema formal no). Crítico: faltan credenciales en `.env.local`, hay 2 errores de lint, 3 errores de TypeScript en webhooks (firma de `revalidateTag` Next 16), y la app móvil nativa no existe en absoluto.

---

## Stack técnico

| Tecnología | Versión | Propósito |
|---|---|---|
| Next.js | 16.2.2 | Framework App Router (RSC, route handlers) |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Tipado estricto |
| Tailwind CSS | ^4 | Estilos utility-first (PostCSS plugin) |
| Radix UI | ^1.4.3 + progress/switch/tooltip | Accesibilidad headless |
| SWR | ^2.4.1 | Data fetching client / cache |
| Framer Motion | ^12.34.3 | Animaciones |
| Vaul | ^1.1.2 | Drawers móviles (cart, filtros) |
| lucide-react | ^0.575.0 | Iconografía |
| gradient-border-plugin | ^1.1.3 | Bordes con gradiente (UI nuevo) |
| js-cookie | ^3.0.5 | Lectura de cookies en cliente |
| shadcn (CLI) | ^3.8.5 (dev) | Generación de componentes |
| Vitest | ^4.1.1 | Tests unitarios |
| ESLint + eslint-config-next | 9 / 16.1.6 | Lint |
| docx | ^9.6.1 | Generación de docs internos (scripts) |
| pnpm | (usado) | Package manager |

---

## Servicios externos

| Servicio | Plan actual | Costo mensual estimado | Propósito |
|---|---|---|---|
| Shopify | Lo paga el cliente | USD 39–105 | Catálogo, checkout, clientes |
| Vercel | Pro asumido | USD 20/mes/miembro | Hosting Next.js, edge, ISR |
| Judge.me | Free / Awesome | USD 0 / 15 | Reseñas |
| GTM + GA4 | Free | USD 0 | Analytics y eventos e-commerce |
| Meta Pixel | Free | USD 0 | Tracking ads |
| WhatsApp Business | Free (link `wa.me`) | USD 0 | Soporte |
| Klaviyo / Resend | No conectado | USD 0–45 | Email tx / CRM (placeholders) |
| Mercado Pago | Activación pendiente | Comisión por txn | Pasarela de pago local |
| Higgsfield / Nano Banana | Pago por uso (consumido) | One-shot | Generación de assets visuales |

---

## Integraciones Shopify

- **Storefront API 2024-04** vía `shopifyFetch` (`src/lib/shopify.ts`) con header `X-Shopify-Storefront-Access-Token`. Soporta `tags` para revalidación ISR.
- **Queries (`src/lib/queries.ts`):** `getCollectionMeta`, `getProducts`, `getProductByHandle` (media: imágenes, video, model3d; metafields; variants, options, tags), `getProductRecommendations`, `getCollections`, `getCollectionWithProducts` (filters, sortKey, cursor `after`/`before`), `predictiveSearch`.
- **Cart API completa:** `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `getCart`, `cartBuyerIdentityUpdate`, `cartDiscountCodesUpdate`, `cartGiftCardCodesUpdate`. Persistencia del `cartId` en localStorage. Checkout vía `cart.checkoutUrl`.
- **Customer API:** `customerCreate`, `customerAccessTokenCreate`, `getCustomer` (con orders), reset/recover password, update profile.
- **Webhooks (`src/app/api/webhooks/route.ts`):** firma HMAC-SHA256 verificada. Topics: `products/{create,update,delete}`, `collections/*`, `orders/{create,updated}`, `inventory_levels/update`. **Bug:** Next 16 cambió firma de `revalidateTag`; quedan 3 errores TS.
- **Endpoints internos:** `/api/back-in-stock`, `/api/newsletter`, `/api/location`, `/api/wishlist/sync`, `/api/customer/profile`.
- **Server Actions:** `collection.ts`, `location.ts`, `search.ts`.

---

## Funcionalidades completadas

- ✅ Homepage (HeroCarousel, trust bar, atajos categorías, bento promos, productos destacados, CollectionShowcase)
- ✅ Listado de colecciones con filtros URL-first, paginación cursor, sort, sidebar y MobileFilterDrawer
- ✅ Detalle de producto con galería multimedia (imágenes/video/model-viewer 3D), variantes, calculadora m², calculadora envío, tabs, sticky buy box, recomendaciones, JSON-LD
- ✅ Carrito (drawer Vaul, descuentos, gift cards, asociación a customer)
- ✅ Auth completo: login, registro, logout, olvide-password, reset por token, cambio password
- ✅ Dashboard de cuenta: pedidos, direcciones, favoritos, perfil
- ✅ Comparador
- ✅ Cotizador de pintura
- ✅ Búsqueda predictiva + página `/search`
- ✅ MegaMenu y MobileMenu con fallback mock
- ✅ PWA instalable (manifest, SW, offline.html)
- ✅ Analytics: GA4 vía GTM + Meta Pixel + eventos `view_item`/`add_to_cart`
- ✅ Webhook Shopify con HMAC validado
- ✅ WhatsApp flotante, ExitIntentPopup (10% OFF), iconos pagos, Recently Viewed, Wishlist, Favoritos
- ✅ Páginas legales y SEO (sobre-nosotros, envíos, devoluciones, privacidad, términos, zonas/[slug])
- ✅ SEO: JSON-LD Organization/Store/WebSite/Product/BreadcrumbList, sitemap dinámico, robots, OG default, preconnects
- ✅ Security: CSP estricto (unsafe-eval solo dev), HSTS, X-Frame-Options DENY, Permissions-Policy
- ✅ Rate limiting (`src/lib/rate-limit.ts`)
- ✅ Tests: `analytics.test.ts`, `shipping.test.ts`

## Funcionalidades pendientes

- ⏳ **Capacitor iOS/Android: 0% iniciado** — Complejidad: alta
- ⏳ Configurar `.env.local` con credenciales reales — Complejidad: baja
- ⏳ Reemplazar `lib/reviews.ts` mock por Judge.me real — Complejidad: media
- ⏳ Endpoint back-in-stock real (Klaviyo/Resend) — Complejidad: media
- ⏳ Webhook handlers: ERP/CRM/email tx — Complejidad: media
- ⏳ Eliminar/proteger `/dev/button-preview` — Complejidad: baja
- ⏳ Reemplazar "1024 vendidos" hardcoded en `ProductView.tsx` — Complejidad: baja
- ⏳ Newsletter Footer a proveedor real — Complejidad: baja
- ⏳ Activar Mercado Pago en Shopify Admin — Complejidad: baja (config)
- ⏳ Sistema formal de design tokens (Style Dictionary) — Complejidad: media
- ⏳ Fix 3 errores TS en `api/webhooks/route.ts` — Complejidad: baja
- ⏳ Fix 2 errores ESLint en `PredictiveSearch.tsx:173` — Complejidad: baja
- ⏳ Verificar dominio en Search Console y submitir sitemap — Complejidad: baja

---

## Estado del código

- Archivos TS/TSX en `src/`: **156**
- Líneas de código aprox: **~19.576**
- Tests: 2 archivos (`analytics.test.ts`, `shipping.test.ts`) — pasan/fallan: No determinado
- **Errores de TypeScript: 3** (`src/app/api/webhooks/route.ts:53,54,62` — firma `revalidateTag` Next 16)
- **Errores de ESLint: 2 errors + 2 warnings** (entidades `"` en `PredictiveSearch.tsx`; missing dep `CartProvider.tsx`; eslint-disable directive sin uso en webhooks)
- Último commit: 2026-04-28 19:07 — `Merge branch 'pre-launch-hardening'` (~6 días)
- Cambios sin commitear: 5 archivos (`package.json`, `pnpm-lock.yaml`, `globals.css`, `page.tsx`, `HeroCarousel.tsx`)
- Untracked: `src/app/dev/`, `src/components/ui/gradient-border*`, `src/styles/`
- TODOs en código: 3 (todos en `Footer.tsx`: dirección, teléfono, redes)
- **Branches locales:** `main`, `Kenmiti`, `Mobile-Fixes`, `ShopifyAPI-Conexiones`, `claude/add-claude-documentation-3Ic2R`, `felipebranch`, `pre-launch-hardening`
- **Branches remotas extras:** `felidesopapi`, `felidisenio`, `login`

---

## Variables de entorno requeridas

- `SHOPIFY_STORE_DOMAIN` / `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` / `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: token Admin (`shpat_...`) server-only
- `SHOPIFY_WEBHOOK_SECRET`: secreto HMAC de webhooks
- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_FB_PIXEL_ID`
- `NEXT_PUBLIC_SITE_URL`

---

## Plataformas target

- [x] Web (Next.js + Vercel)
- [x] PWA instalable (manifest + SW activos)
- [ ] Mobile iOS (Capacitor) — **no iniciado**
- [ ] Mobile Android (Capacitor) — **no iniciado**
- [ ] Desktop — fuera de scope

---

## Estado del Capacitor / Apps móviles

**No existe nada de Capacitor en el repo.** Verificado:
- No hay `capacitor.config.ts/json`
- No existen carpetas `ios/` ni `android/`
- `package.json` no contiene `@capacitor/*` ni plugins
- Cero referencias a "capacitor"/"ionic"/"expo" en TS/TSX/MD/JSON
- Lo único "móvil-first" es la PWA instalable (manifest + SW + offline.html)

**Para builds móviles haría falta:**
- Instalar `@capacitor/core` + `@capacitor/cli` + plataformas
- Decidir estrategia: Next exportado estático no es viable por SSR/RSC; lo realista es **WebView wrapper** apuntando a la URL de Vercel
- Generar `capacitor.config.ts`, `npx cap add ios|android`
- Splash/íconos (parcialmente reusables del PWA)
- Permisos, signing iOS (Apple Developer USD 99/año) y Android (keystore + Play Console USD 25 one-time)

**Estimación: 3–5 semanas** combinando ambas plataformas (WebView wrapper); **6–10 semanas** si se quiere experiencia nativa con plugins (push, biometría, share).

---

## Estado del Design System / Tokens

**No existe un sistema formal de tokens.** Lo que hay:
- CSS custom properties en `src/app/globals.css` bajo `@theme` y `:root` (Tailwind v4 native): brand colors (`--color-brand-teal #21645d`, `--color-brand-orange #f3843e`), neutrales, primary/secondary/destructive, radius (`--radius: 0.75rem`)
- `components.json` (config shadcn CLI)
- Utilities sueltas: `.glass-nav`, `.hover-lift`, `gradient-border-plugin.css` recién agregado
- 32 componentes UI en `src/components/ui/` (Radix/shadcn-style)
- `/dev/button-preview` para revisar variantes (debe protegerse antes de producción)

**Lo que falta:** fuente única de verdad (JSON o `tokens/` con Style Dictionary), tokens semánticos versionados, documentación visual (Storybook/Ladle), naming convention consistente.

**Si solo se quieren ajustes finales: 2–4 días. Sistema formal Style Dictionary: +1–2 semanas.**

---

## Deuda técnica y riesgos

1. **0% de Capacitor**: el bloqueante más grande para shipping multiplataforma
2. **3 errores TypeScript** en `api/webhooks/route.ts` (firma `revalidateTag` Next 16)
3. **Sin `.env.local`**: páginas con Shopify caen al error boundary silencioso
4. **`alert()` nativo en back-in-stock** (`ProductView.tsx`): pésima UX y no captura leads
5. **Mock data**: `lib/reviews.ts` (setTimeout 300ms penaliza TTFB), MegaMenu/MobileMenu fallback puede romper links, "1024 vendidos" hardcoded
6. **Ruta `/dev/button-preview` pública** (untracked): expone styleguide
7. **8 branches sin mergear** (Felipe, Kenmiti, Mobile-Fixes, ShopifyAPI-Conexiones, login)
8. **5 archivos modificados sin commitear hace 6 días** (incluye `package.json` con `gradient-border-plugin`)
9. **Newsletter Footer y formularios sin proveedor real**
10. **Tests cubren solo `analytics` y `shipping`**: 0% sobre cart, auth, checkout, webhooks. Sin E2E
11. **Sin pipeline CI/CD configurado** (no hay `.github/workflows`, no hay `vercel.json`)
12. **`SHOPIFY_ADMIN_ACCESS_TOKEN` declarado**: si filtra el real, da escritura completa a Shopify
13. **`script-src 'unsafe-inline'`** en CSP de producción — riesgo XSS aceptado

---

## Costos mensuales estimados en producción

| Concepto | Mínimo | Esperado | Notas |
|---|---|---|---|
| Vercel Pro | USD 20 | USD 40 | $20/mes/miembro; 2 founders ≈ $40 |
| Shopify | USD 39 | USD 105 | Lo paga el cliente típicamente |
| Dominio `.com.uy` | USD 1 | USD 5 | Anualizado ~$10–60/año |
| Judge.me Awesome | USD 0 | USD 15 | Free tier funcional |
| Mercado Pago / Pasarelas | USD 0 | Comisión txn | ~3–6% por venta + IVA |
| Email tx (Resend / Klaviyo) | USD 0 | USD 20 | Resend free hasta 3k/mes |
| Apple Developer Program | USD 8 | USD 8 | $99/año = $8.25/mes |
| Google Play Console | USD 0 | USD 0 | One-time $25 |
| GTM + GA4 + Meta Pixel | USD 0 | USD 0 | Free |
| **TOTAL** | **~USD 68/mes** | **~USD 193/mes** | Sin contar comisiones de pasarela |

---

## Tiempo estimado para shipping

- **Web pulido + fixes** (TS errors, lint, mocks reemplazados, `.env`, eliminar `/dev`, integrar Judge.me, conectar newsletter, back-in-stock real, webhook handlers): **5–8 días hábiles**
- **Design tokens consolidados**: **2–4 días**. Sistema formal Style Dictionary: +1–2 semanas (opcional)
- **Capacitor iOS** (init + WebView wrapper + splash/íconos + Apple Developer + signing + submission TestFlight → App Store, incluye review Apple): **2–3 semanas**
- **Capacitor Android** (init + WebView wrapper + signing + Play Console + submission): **1–2 semanas**
- **Configuración no-código** (Mercado Pago en Shopify, abandoned cart emails, Search Console, Meta Pixel ID, WhatsApp number, og-default.png): **1–2 días**

**Total realista web + apps: 5–8 semanas (shipping aproximado entre 2026-06-08 y 2026-06-29).**

**Si se omite Capacitor, web puede cerrarse en ~2 semanas (2026-05-18).**
