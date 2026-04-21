# Plan — PWA (Progressive Web App)

_Fecha: 2026-04-14_

## Objetivo
Convertir el sitio en instalable desde mobile/desktop con experiencia standalone, funcionamiento offline básico y caché inteligente de assets.

## Scope
- Manifest Web App con icons cuadrados y metadata
- Service Worker con precache del app shell + runtime cache
- Página offline fallback
- Meta tags iOS para "add to home screen"
- Registro del SW desde layout raíz
- Script para regenerar íconos si cambia el logo

## No incluye
- Push notifications (requiere backend de subscripción)
- Install prompt UI custom (el browser lo maneja nativo)
- Background sync
- Precache de toda la navegación

## Archivos

**Crear:**
- `scripts/generate-pwa-icons.mjs` — genera íconos desde `public/logo2.png`
- `public/manifest.webmanifest` — manifest PWA
- `public/sw.js` — service worker
- `public/offline.html` — página offline
- `public/icons/icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png` — generados
- `src/components/shared/ServiceWorkerRegister.tsx` — registra SW client-side

**Modificar:**
- `src/app/layout.tsx` — agregar link a manifest, meta tags Apple/theme, renderizar `<ServiceWorkerRegister />`
- `next.config.ts` — asegurar que SW se sirva con el header correcto (Service-Worker-Allowed)

## Manifest (contenido)
```json
{
  "name": "CompraHogar Uruguay",
  "short_name": "CompraHogar",
  "description": "Materiales, herramientas y todo para tu hogar. Envíos en 24-48hs.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#21645d",
  "orientation": "portrait-primary",
  "lang": "es-UY",
  "categories": ["shopping", "lifestyle"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## Service Worker (estrategia)
- **Install**: precache `/offline.html` + íconos críticos
- **Activate**: limpiar cachés viejos, claim clients
- **Fetch**:
  - GET de imágenes de `cdn.shopify.com` → stale-while-revalidate
  - GET de navegaciones HTML → network-first con fallback a `/offline.html`
  - Otros GET del mismo origen (JS, CSS, fuentes) → stale-while-revalidate
  - Requests a Shopify Storefront API → passthrough (no cachear — evita carritos obsoletos)
  - POST → passthrough sin cache

Cache name versionado: `comprahogar-v1` — bump al actualizar SW.

## Meta tags a agregar al layout
- `<link rel="manifest" href="/manifest.webmanifest" />`
- `<meta name="theme-color" content="#21645d" />`
- `<meta name="apple-mobile-web-app-capable" content="yes" />`
- `<meta name="apple-mobile-web-app-status-bar-style" content="default" />`
- `<meta name="apple-mobile-web-app-title" content="CompraHogar" />`
- `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />`

## Criterios de verificación
1. Build limpio
2. `/manifest.webmanifest` accesible con JSON válido
3. `/sw.js` accesible con Content-Type JS
4. Chrome DevTools → Application → Manifest detecta íconos y nombre
5. Chrome DevTools → Application → Service Workers muestra activado
6. Instalable en Chrome/Edge desktop (botón install en address bar)
7. Offline: cargar homepage → desconectar → navegar → ve `/offline.html`
