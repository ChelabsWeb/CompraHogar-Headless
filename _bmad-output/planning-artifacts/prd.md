---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - '{project-root}/_bmad-output/project-context.md'
documentCounts:
  briefCount: 0
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 1
workflowType: 'prd'
classification:
  projectType: web_app
  domain: e-commerce
  complexity: medium
  projectContext: brownfield
---

# Product Requirements Document - CompraHogar-Headless

**Author:** Chelabs
**Date:** 2026-02-26T16:30:10-03:00

## Executive Summary

CompraHogar-Headless es una plataforma de comercio electrónico diseñada para artículos del hogar y la construcción en Uruguay. Resuelve la desconexión del mercado entre transacciones funcionales y experiencias de marca inmersivas. Utilizando arquitectura headless (Next.js + Shopify Storefront API), ofrece rendimiento transaccional robusto y una estética visual "Clean-Luxe Minimalista", optimizando la velocidad (LCP < 2.5s) y el valor percibido del inventario.

### Differentiator & Vision

El diferenciador central es la combinación de precios altamente competitivos, envíos a todo Uruguay y fuerte relación B2B con la construcción, presentados en una interfaz de alta gama con mecánicas de cupones. Esta dualidad (funcionalidad masiva + estética exclusiva) posiciona la plataforma para transicionar hacia la importación directa y productos de mayor exclusividad.

## Project Classification

- **Project Type:** Web App (E-commerce storefront)
- **Domain:** E-commerce / Retail (Hogar & Construcción)
- **Complexity:** Medium (Headless Architecture, Shopify API)
- **Project Context:** Brownfield (Basado en stack Next.js/Tailwind/Shadcn)

## Success Criteria

### User Success
- **Tiempo de Resolución:** Usuarios (B2B/B2C) encuentran, agregan al carrito y completan checkout en menos de 3 minutos.
- **Claridad Técnica:** Constructores validan especificaciones técnicas y disponibilidad de stock en tiempo real desde la ficha de producto.
- **Transparencia en Precios:** Usuarios aplican y visualizan descuentos de cupones en el carrito sin fricción antes del pago.

### Business Success
- **Conversión:** Tasa de conversión > 1.2% en los primeros 3 meses.
- **Fidelización B2B:** Captar y retener > 150 cuentas recurrentes de profesionales en los primeros 6 meses (20% del volumen de ventas mensual).
- **Posicionamiento:** Baja tasa de rebote y feedback cualitativo confirman percepción de marca premium ("Clean-Luxe").

### Technical Success
- **Rendimiento Frontend:** LCP (Largest Contentful Paint) <= 2.5s y FID/INP <= 100ms.
- **Sincronización de Inventario:** Cero discrepancias demostrables entre Next.js frontend y Shopify backend.
- **Estabilidad Headless:** 99.9% de uptime medible en el storefront de Next.js.

## Product Scope & Strategy

### MVP Strategy ("Experience MVP")
Priorizar el lanzamiento a producción de funcionalidades base transaccionales (Catálogo, Checkout, Cupones) con una experiencia visual premium ("Clean-Luxe") y rendimiento técnico perfecto (LCP < 2.5s) utilizando datos sincronizados con Shopify.

### Phase 1: Minimum Viable Product (MVP)
- Frontend SPA/SSR híbrido construido sobre Next.js (App Router), Tailwind CSS y Shadcn UI.
- Backend Headless consumiendo API GraphQL de Shopify Storefront.
- Buscador con autocompletado y fichas de producto con especificaciones técnicas de nicho.
- Carrito tipo Drawer con aplicación nativa de cupones.
- Checkout redirect nativo hacia Shopify.
- Autenticación: Guest checkout habilitado.
- Estética "Clean-Luxe" responsive estricta (Mobile-First).

### Phase 2: Growth
- Autenticación y gestión de cuentas de usuario B2B en Next.js.
- Historial de pedidos y precios "tier" (cotizaciones en volumen).
- Buscador avanzado y filtros por facetas múltiples (marca, material, tránsito).

### Phase 3: Vision
- Integración de catálogo para importación directa de China.
- Apps móviles nativas (iOS y Android).

## Technical Architecture & Platform Matrix

### Core Architecture
- **Rendering:** SSR/SSG/ISR intensivo vía Next.js App Router para carga inicial instantánea e indexación SEO completa.
- **Data Fetching:** Operaciones de mutación y checkout administradas mediante Server Actions o Client Fetching asíncrono sobre rutas edge.
- **Styling:** Tailwind CSS v4 con Shadcn UI. Animaciones controladas por Framer Motion.
- **Types:** TypeScript estricto validado contra schemas de Shopify GraphQL.

### Platform Support
- **Browsers:** Últimas 2 versiones de Chrome, Safari, Firefox y Edge.
- **Dispositivos:** Mobile-First responsive rendering.

### SEO Strategy
- Estructura de URLs jerárquica y predecible.
- Metadata API de Next.js (Títulos, Descripciones y OpenGraph autogenerados).
- Generación automática de Sitemaps y robots.txt indexando el catálogo.
- JSON-LD estructurado (Schema Markup) para productos (Puntuación, Precio, Stock).

### Risk Mitigation
- **Riesgo Asíncrono de Stock:** Validación en tiempo explícito del saldo al accionar el trigger hacia el checkout mediante fetch network. Tolerancia vía caché de Next.js durante tiempos de caída, avisando con estado "Inventario sin confirmación".
- **Riesgo en Mercado Sensible a Precios:** Inserción de banners nativos de oportunidad (cupones destacados) en navegación para asociar la calidad visual superior con alta oportunidad competitiva de precios.

## User Journeys

### Journey 1: El Constructor B2B (Primary User - Success Path)
**Nombre:** Marcelo (45), Maestro Mayor de Obras.
**Situación:** Está en medio de una obra en el interior del país. Su proveedor habitual le falló con una partida de porcelanato y necesita resolverlo hoy mismo para no retrasar a los colocadores mañana.
**Objetivo:** Encontrar porcelanato específico, confirmar que hay stock real, aplicar su descuento de cliente frecuente y que se lo envíen urgente.
**El Viaje:**
- **Inicio:** Marcelo entra a CompraHogar desde su celular en la obra. La página carga instantáneamente.
- **Acción:** No pierde tiempo mirando banners promocionales; va directo al buscador y escribe "porcelanato rectificado 60x60".
- **Clímax:** Entra a la ficha del producto. Le alivia ver una sección clara y sin distracciones que muestra especificaciones técnicas (tránsito, absorción, m2 por caja) y un indicador en tiempo real de "50 cajas disponibles". 
- **Resolución:** Agrega 20 cajas al carrito. En el checkout, aplica su código de descuento `CONSTRUCTOR15` de forma transparente, viendo el desglose del costo de envío hacia el interior. Paga y vuelve a la obra tranquilo.

### Journey 2: El Comprador Retail "Aspiracional" (Primary User - Discovery Path)
**Nombre:** Lucía (32), Contadora.
**Situación:** Acaba de mudarse a su apartamento propio y quiere darle un toque de diseño, con presupuesto ajustado.
**Objetivo:** Encontrar artículos de decoración e iluminación lujosos pero a buen precio.
**El Viaje:**
- **Inicio:** Lucía ve un anuncio y hace clic. Llega a la *home* de CompraHogar y se sorprende por el diseño "Clean-Luxe Minimalista".
- **Acción:** Navega por "Iluminación". Las imágenes de los productos (grandes, sin bordes redondeados, fondo neutro) elevan su percepción de calidad. 
- **Clímax/Obstáculo:** Le encanta una lámpara, pero duda si el costo de envío a Montevideo no la hará salir de su presupuesto.
- **Resolución:** En la misma ficha de producto ve un banner nativo: "Envío Gratis en Decoración usando el cupón HOME20". Lo aplica en el carrito y verifica que el precio final es excelente. Efectúa la compra.

### Journey 3: Falla de Stock y Recuperación (Edge Case)
**Nombre:** Marcelo (Constructor B2B)
**Situación:** Intenta comprar 20 cajas de porcelanato, pero en el checkout alguien más compró las últimas cajas en tienda física y Shopify descontó el inventario.
**El Viaje:**
- Al intentar procesar el pago, la plataforma le advierte suavemente que el inventario acaba de actualizarse a "Agotado". 
- El sistema le ofrece automáticamente productos relacionados con las mismas especificaciones técnicas y le permite vaciar o actualizar su carrito en un solo clic, mitigando su frustración.

### Journey 4: El Administrador de E-commerce (Ops/Admin)
**Nombre:** Carlos (Owner / Operaciones)
**Situación:** Necesita lanzar una campaña exclusiva de fin de semana para liquidar grifería.
**El Viaje:**
- Entra a su panel de administración de Shopify.
- Ajusta el inventario y crea un código de descuento `LIQUIDA30`.
- Gracias a la revalidación de datos Headless, Carlos abre el storefront de Next.js y ve que, en milisegundos, el stock está actualizado y el código funciona en el checkout de prueba.

## Functional Requirements (MVP)

### 1. Descubrimiento de Productos (Content Discovery)
- **FR1:** Los usuarios pueden buscar productos mediante palabras clave.
- **FR2:** Los usuarios ven resultados sugeridos mientras escriben (autocompletado).
- **FR3:** Los usuarios pueden navegar productos agrupados por categorías jerárquicas (ej. Pisos > Porcelanatos).
- **FR4:** Los usuarios pueden visualizar un listado de productos con imagen, título y precio.

### 2. Información del Producto (Product Information)
- **FR5:** Los usuarios pueden ver una galería de imágenes del producto.
- **FR6:** Los usuarios pueden leer especificaciones técnicas estructuradas y descripciones comerciales.
- **FR7:** Los usuarios pueden seleccionar variantes de un producto (ej. tamaño, color).
- **FR8:** Los usuarios visualizan el estado del inventario (disponibilidad) antes de agregar al carrito.

### 3. Gestión del Carrito (Cart Management)
- **FR9:** Los usuarios pueden agregar una o múltiples unidades de un producto al carrito de compras.
- **FR10:** Los usuarios pueden visualizar un resumen de su carrito desde cualquier página de la tienda.
- **FR11:** Los usuarios pueden modificar cantidades o eliminar artículos dentro de su carrito.

### 4. Ofertas y Dinámicas de Precio (Promotions & Pricing)
- **FR12:** Los usuarios pueden ingresar y validar códigos de descuento promocionales dentro del carrito.
- **FR13:** Los usuarios pueden visualizar el impacto del descuento aplicado sobre el subtotal antes de ir al checkout.

### 5. Compra y Checkout (Purchasing & Checkout)
- **FR14:** Los usuarios son redirigidos de manera segura con su carrito hacia el flujo de pago (Shopify Checkout).
- **FR15:** El sistema notifica al usuario si un artículo en su carrito se queda sin stock en el momento exacto de procesar el pago.

## Non-Functional Requirements

### Performance
- **NFR-P1 (Carga Inicial):** El Largest Contentful Paint (LCP) de la página de inicio y ficha de producto debe ocurrir en **menos de 2.5 segundos** en redes 4G estándar.
- **NFR-P2 (Interacción):** El First Input Delay (FID) o Interaction to Next Paint (INP) debe ser menor a **100 milisegundos**, asegurando que partes críticas (ej. drawer de carrito) se sientan instantáneas.
- **NFR-P3 (Imágenes):** Todas las imágenes del catálogo deben ser servidas en formatos modernos (WebP/AVIF) pre-renderizadas o vía Edge CDN.

### Scalability
- **NFR-S1 (Uptime):** El Storefront (frontend Next.js) debe garantizar un **99.9% de uptime**.
- **NFR-S2 (Tolerancia a Fallos API):** Si la API de Shopify Storefront sufre degradación de servicio o throttling (Rate Limit excedido), el Storefront debe servir páginas desde el caché de Next.js (ISR) mostrando el último stock conocido con una advertencia visual.

### Security
- **NFR-SE1 (Checkout PCI-DSS):** Ningún dato de tarjeta de crédito será capturado por el frontend de Next.js. El flujo de pago se delega y procesa 100% en el entorno certificado de Shopify.
- **NFR-SE2 (Protección de Keys):** Los tokens de acceso a la API privada de Shopify deben permanecer protegidos en el servidor o edge (Next.js Node/Edge runtime), y las variables `NEXT_PUBLIC_` usadas en cliente solo deben tener alcance público.

### Accessibility
- **NFR-A1 (Semántica y Uso):** Se debe cumplir un estándar "Best-Effort" utilizando la accesibilidad incorporada de la librería UI (soporte básico de teclado para navegación y carrito, y etiquetas ARIA).
