# Plan — CompraHogar
_Última actualización: 2026-03-17_

## Estado actual

El proyecto está considerablemente más avanzado de lo que indica el CLAUDE.md (el cual estaba desactualizado). El scaffold inicial fue superado: existe una aplicación e-commerce funcional en estructura, con páginas completas, componentes UI ricos y lógica de Shopify conectada.

**Lo que está construido:**
- Layout raíz con Header/Footer, CartProvider y autenticación por cookie (`customerAccessToken`)
- Homepage completa: hero, trust bar, categorías, bento de promos, productos destacados via Shopify Storefront API
- Listado de colecciones (`/collections/[handle]`): filtros por URL, paginación con cursor, sorting, sidebar con filtros de Shopify, drawer móvil, breadcrumbs, subcategorías jerárquicas
- Página de producto (`/products/[handle]`): galería multimedia (imágenes, video MP4, modelo 3D via model-viewer), selector de variantes, carrito, calculadora de materiales (m²), calculadora de envío, tab descripción/ficha técnica/garantía, "Avisarme cuando vuelva" para out-of-stock, sticky buy box móvil, recomendaciones, breadcrumbs, metadata OG/Twitter
- Cart completo: `CartProvider` con context, `CartSheet` (drawer lateral), add/update/remove, códigos de descuento y gift cards, asociación de carrito a cliente autenticado
- Auth completo: login, registro, logout, recuperar contraseña (doble flujo: olvidé-password + token en URL), página de cuenta con historial de pedidos y dirección principal
- Búsqueda predictiva en header (`PredictiveSearch`)
- Página de búsqueda (`/search`)
- MegaMenu y MobileMenu con fallback a mock data si Shopify no retorna colecciones
- Analytics layer para GA4/GTM: `pushDatalayerEvent`, eventos `view_item` y `add_to_cart` implementados en ProductView y ProductPageTracker
- Webhook endpoint (`/api/webhooks/route.ts`) estructurado pero con lógica placeholder
- Páginas de contenido estático: sobre nosotros, envíos y entregas, devoluciones y garantías, política de privacidad, términos y condiciones
- Página de cuenta con pedidos y dirección, protegida por token
- Sistema de filtros URL-first con hook `useStoreFilters`
- Jerarquía de colecciones en `lib/constants/collectionHierarchy.ts`
- Componente `/ui-test/page.tsx` de prueba de componentes UI (debe eliminarse en producción)

**Bloqueantes reales confirmados:**
- Sin `.env.local`: las variables `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` y `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` no están configuradas. El sitio no puede conectarse a Shopify sin ellas.
- Reviews (`lib/reviews.ts`): retorna datos mock estáticos. No hay integración real con Judge.me u otro sistema.
- Back-in-stock (`ProductView.tsx`): el handler `handleBackInStockSubmit` es un mock que hace `console.log` y `alert()`.
- Webhook (`/api/webhooks/route.ts`): la lógica de ERP, CRM (Klaviyo) y email transaccional (Resend) son placeholders con `console.log`.
- GTM: la capa de analytics (`lib/analytics.ts`) está lista pero el snippet de GTM no está inyectado en el layout.
- "1024 vendidos" en ProductView: dato hardcodeado, no viene de Shopify.
- Favoritos (estrella en ProductView): estado local sin persistencia, no conectado a Shopify Wishlists ni backend.

## Próximos pasos (ordenados por prioridad)

1. Configurar `.env.local` con las credenciales reales de Shopify (dominio + Storefront Access Token) para habilitar toda la integración existente.
2. Inyectar el snippet de GTM en `layout.tsx` para activar el tracking GA4 ya implementado.
3. Integrar sistema de reviews real (Judge.me o metafields de Shopify) reemplazando `lib/reviews.ts` mock.
4. Implementar el endpoint back-in-stock real en `ProductView` (reemplazar `console.log`/`alert` por llamada a API o Klaviyo).
5. Completar el webhook de Shopify en `/api/webhooks/route.ts` con la lógica real de ERP, CRM y email transaccional.
6. Eliminar la página `/ui-test` antes del deploy a producción.
7. Reemplazar "1024 vendidos" hardcodeado por dato real (metafield de Shopify o analytics).
8. Persistir favoritos (wishlist) vinculada a la cuenta del cliente o localStorage estructurado.
9. Configurar variable de entorno `NEXT_PUBLIC_SITE_URL` para las URLs canónicas SEO en collections.
10. Agregar el snippet HMAC para validar autenticidad de los webhooks de Shopify (actualmente el endpoint no lo verifica).
