# Backlog — CompraHogar

## Alta prioridad

- [ ] Configurar `.env.local` con `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` y `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` reales para desbloquear toda la integración con Shopify.
- [ ] Inyectar snippet de Google Tag Manager en `src/app/layout.tsx` (script en `<head>` + noscript en `<body>`) para activar el tracking GA4 ya cableado vía `pushDatalayerEvent`.
- [ ] Implementar verificación HMAC en `src/app/api/webhooks/route.ts` para validar que los webhooks provienen de Shopify y no de actores externos.
- [ ] Reemplazar el handler mock `handleBackInStockSubmit` en `ProductView.tsx` por una llamada real a Klaviyo o a un endpoint interno que registre el lead de restock.
- [ ] Eliminar la ruta `/ui-test` (`src/app/ui-test/page.tsx`) antes de cualquier deploy a producción — expone la hoja de estilos interna del proyecto.
- [ ] Configurar `NEXT_PUBLIC_SITE_URL` en el entorno para que las URLs canónicas de colecciones apunten al dominio real y no a `localhost:3000`.

## Media prioridad

- [ ] Integrar sistema de reseñas real en `src/lib/reviews.ts`: conectar con Judge.me API o metafields de Shopify (`reviews.rating`, `reviews.rating_count`) reemplazando los datos mock hardcodeados.
- [ ] Completar la lógica del webhook en `src/app/api/webhooks/route.ts`: implementar llamadas reales a ERP externo, Klaviyo (CRM) y Resend (email transaccional) reemplazando los `console.log` placeholder.
- [ ] Reemplazar "1024 vendidos" hardcodeado en `ProductView.tsx` por un dato real (metafield de Shopify o conteo de analytics).
- [ ] Implementar persistencia de favoritos: conectar el botón de estrella en `ProductView.tsx` a localStorage estructurado (usuarios anónimos) o a una lista de deseos de Shopify (usuarios autenticados).
- [ ] Implementar paginación hacia atrás en `/collections/[handle]`: el código actual tiene un comentario indicando que solo funciona `direction=next`; completar el query GraphQL para soportar `last` y `before: cursor`.
- [ ] Conectar el formulario de newsletter en el Footer a un proveedor real (Klaviyo, Mailchimp u otro).
- [ ] Reemplazar `mockRecommendations` hardcodeados en `EmptyState.tsx` por productos reales de Shopify.
- [ ] Implementar el flujo real de la calculadora de envío en `ShippingCalculator.tsx`: conectar el cálculo de tarifa de envío por código postal a la API de Shopify o al proveedor logístico.
- [ ] Implementar `LocaleSwitcher.tsx` si se requiere soporte multimoneda o multilenguaje.

## Baja prioridad

- [ ] Agregar soporte completo de modelo 3D en producción: el componente usa `model-viewer` cargado desde CDN externo; evaluar bundlearlo o diferirlo correctamente para no impactar performance.
- [ ] Configurar `next.config` con `images.domains` o `images.remotePatterns` para los dominios de imágenes de Shopify (actualmente no detectado en el repo).
- [ ] Agregar metadatos de colección dinámicos basados en datos reales de Shopify en `generateMetadata` de `collections/[handle]/page.tsx` (actualmente se construye desde el handle formateado, no desde el título real de la colección).
- [ ] Revisar el tipo `any` extendido en `layout.tsx`, `CartProvider.tsx`, `MegaMenu.tsx` y otros archivos; tipar apropiadamente las respuestas de la Storefront API.
- [ ] Agregar tests E2E (Playwright) para los flujos críticos: agregar al carrito, checkout redirect, login/registro.
- [ ] Configurar pipeline de CI/CD (Vercel o similar) con variables de entorno y preview deployments por PR.
- [ ] Revisar accesibilidad (a11y): el color picker en `ProductView.tsx` usa botones `<button>` sin aria-label descriptivo más allá del `sr-only`.
- [ ] Mover las categorías hardcodeadas en `src/app/page.tsx` (array `categories`) a una fuente de datos real o constante compartida con `collectionHierarchy.ts`.
