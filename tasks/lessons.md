# Lessons Learned — CompraHogar

## [2026-03-17]

- El `CLAUDE.md` del proyecto estaba desactualizado: declaraba el proyecto como "scaffold only" con integraciones pendientes, pero la auditoría reveló que la aplicación tiene decenas de componentes, rutas completas, auth con Shopify Customer API, cart completo, analytics layer y más. Mantener el CLAUDE.md sincronizado con el estado real del proyecto es crítico para que cualquier agente o desarrollador que lo retome no subestime (o sobreestime) el trabajo hecho.

- El mayor bloqueante operativo no es código faltante sino configuración ausente: sin `.env.local` con las credenciales de Shopify, toda la funcionalidad existente falla silenciosamente (el `shopifyFetch` lanza excepciones y las páginas caen al error boundary). La primera acción antes de cualquier trabajo de desarrollo debe ser configurar el entorno.

- La capa de analytics está arquitectónicamente bien resuelta (`lib/analytics.ts` con tipado GA4 estricto, limpieza de `ecommerce: null` antes de cada push, blindaje SSR), pero el snippet de GTM nunca fue inyectado en el `layout.tsx`. Tener una librería de tracking sin el tag activo es funcionalmente equivalente a no tener tracking.

- El sistema de reviews (`lib/reviews.ts`) tiene una deuda de diseño interesante: fue pensado para SSR/RSC con fetch server-side para beneficiar el SEO, lo cual es correcto. El problema es que actualmente retorna datos mock con un `setTimeout` artificial de 300ms que se ejecuta en cada request del servidor, penalizando el TTFB en producción si se olvida de reemplazar.

- El webhook de Shopify en `src/app/api/webhooks/route.ts` no tiene verificación HMAC. Sin ella, cualquier actor puede hacer POST al endpoint y disparar la lógica de negocio (ERP, CRM, emails). Esto debe resolverse antes de conectar las integraciones reales.

- `MegaMenu.tsx` y `MobileMenu.tsx` tienen mock data como fallback cuando Shopify no retorna colecciones, lo cual es una decisión de UX pragmática (el menú nunca queda vacío). Sin embargo, si los handles del mock no coinciden con los handles reales de las colecciones en Shopify, los links del menú romperán en producción.

- La página `/ui-test` fue útil durante el desarrollo de la design system, pero en el estado actual es un vector de información expuesto al público. Debe eliminarse o protegerse con middleware antes del deploy.

- `ProductView.tsx` tiene el handler de back-in-stock implementado como `alert()` nativo del navegador — funciona para demostración pero es inaceptable en producción desde la perspectiva de UX y de captura real de leads.

- El hook `useStoreFilters.ts` y la arquitectura de filtros URL-first en la página de colecciones es una decisión arquitectónica sólida: los filtros son bookmarkables, compatibles con el botón atrás del navegador y el server component puede prerenderizar el estado correcto. Mantener este patrón.

- La jerarquía de colecciones en `lib/constants/collectionHierarchy.ts` es un archivo de configuración estático. Si la estructura de categorías de Shopify cambia, debe actualizarse manualmente. A largo plazo, considerar leerla desde metaobjects de Shopify para evitar desincronización.
