# Backlog — CompraHogar
_Última actualización: 2026-05-17_

## Alta prioridad — bloqueantes para producción

- [ ] Configurar `.env.local` con `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` y `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` reales en cada entorno (local, preview, producción).
- [ ] Configurar `NEXT_PUBLIC_SITE_URL` para que canónicas SEO apunten al dominio real (hoy default `localhost:3000`).
- [ ] Implementar verificación HMAC en `src/app/api/webhooks/route.ts` para validar autenticidad de webhooks de Shopify.
- [ ] Reemplazar handler mock `handleBackInStockSubmit` en `ProductView.tsx` por llamada real a Klaviyo o endpoint interno.

## Media prioridad — features incompletos

- [ ] Integrar reviews reales en `src/lib/reviews.ts`: conectar con Judge.me API o metafields Shopify (`reviews.rating`, `reviews.rating_count`).
- [ ] Completar lógica del webhook en `src/app/api/webhooks/route.ts`: llamadas reales a ERP externo, Klaviyo (CRM) y Resend (email transaccional).
- [ ] Implementar paginación hacia atrás en `/collections/[handle]`: hoy solo `direction=next` funciona. Completar query GraphQL con `last` y `before: cursor`.
- [ ] Conectar newsletter del Footer a proveedor real (Klaviyo, Mailchimp).
- [ ] Implementar flujo real de `ShippingCalculator.tsx` por código postal (API Shopify o proveedor logístico).
- [ ] Implementar `LocaleSwitcher.tsx` si se requiere soporte multimoneda/multilenguaje.

## Baja prioridad — calidad / DX

- [ ] Tipar `any` extendido en `layout.tsx`, `CartProvider.tsx`, `MegaMenu.tsx` y otros archivos con tipos apropiados de Storefront API.
- [ ] Tests E2E (Playwright) para flujos críticos: carrito, checkout redirect, login/registro.
- [ ] Configurar CI/CD Vercel con variables de entorno y preview deployments por PR.
- [ ] Mover categorías hardcoded en `src/app/page.tsx` a una constante compartida con `collectionHierarchy.ts`.
- [ ] Agregar metadatos dinámicos de colección en `generateMetadata` de `collections/[handle]/page.tsx` (usar título real, no handle formateado).
- [ ] Revisar bundle de `model-viewer` (CDN externo, ya lazy-loaded pero podría bundlearse).

## Capacitor / App nativa (futuro)

- [ ] Setup Capacitor sobre el Next.js actual.
- [ ] Splash screen + ícono iOS/Android.
- [ ] Push notifications nativas vía Firebase / OneSignal.
- [ ] Deep links (Universal Links iOS + App Links Android).
- [ ] In-app browser para checkout (evitar redirección al browser nativo).
- [ ] Submission a App Store + Play Store.

Ver memoria `capacitor-migration-planned.md` para detalles de decisión.

## Decisión estratégica abierta

- **Migración a Medusa.js v2 self-hosted** vs continuar con Shopify Headless.
  Plan completo: `docs/superpowers/plans/2026-05-16-medusa-migration.md` (9 fases).

---

## ✅ Completado en sesión 2026-05-17 (UI/UX pass)

- Header desktop tape resuelto (`lg:pt-[128px]`)
- A11y Lighthouse 92 → 100 (home y PDP)
- Performance: Suspense streaming en showcases, defer model-viewer
- Lint: 4 errors `react-hooks/set-state-in-effect` resueltos
- CSP `cdnwidget.judge.me` agregado
- `middleware.ts` → `proxy.ts` (Next 16)
- Placeholder mejorado para productos sin imagen
- Estados vacíos / contenido falso: confirmado todo resuelto previamente (no había `/ui-test`, `1024 vendidos` ni `mockRecommendations` en código actual)
