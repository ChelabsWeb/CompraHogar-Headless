---
stepsCompleted: [1, 2, 3]
inputDocuments: 
  - '{project-root}/_bmad-output/planning-artifacts/prd.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-design-specification.md'
---

# CompraHogar-Headless - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for CompraHogar-Headless, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Los usuarios pueden buscar productos mediante palabras clave.
FR2: Los usuarios ven resultados sugeridos mientras escriben (autocompletado).
FR3: Los usuarios pueden navegar productos agrupados por categorías jerárquicas (ej. Pisos > Porcelanatos).
FR4: Los usuarios pueden visualizar un listado de productos con imagen, título y precio.
FR5: Los usuarios pueden ver una galería de imágenes del producto.
FR6: Los usuarios pueden leer especificaciones técnicas estructuradas y descripciones comerciales.
FR7: Los usuarios pueden seleccionar variantes de un producto (ej. tamaño, color).
FR8: Los usuarios visualizan el estado del inventario (disponibilidad) antes de agregar al carrito.
FR9: Los usuarios pueden agregar una o múltiples unidades de un producto al carrito de compras.
FR10: Los usuarios pueden visualizar un resumen de su carrito desde cualquier página de la tienda.
FR11: Los usuarios pueden modificar cantidades o eliminar artículos dentro de su carrito.
FR12: Los usuarios pueden ingresar y validar códigos de descuento promocionales dentro del carrito.
FR13: Los usuarios pueden visualizar el impacto del descuento aplicado sobre el subtotal antes de ir al checkout.
FR14: Los usuarios son redirigidos de manera segura con su carrito hacia el flujo de pago (Shopify Checkout).
FR15: El sistema notifica al usuario si un artículo en su carrito se queda sin stock en el momento exacto de procesar el pago.

### NonFunctional Requirements

NFR-P1 (Carga Inicial): LCP (Largest Contentful Paint) < 2.5s en redes 4G estándar.
NFR-P2 (Interacción): FID/INP < 100ms.
NFR-P3 (Imágenes): Imágenes servidas en WebP/AVIF pre-renderizadas o vía Edge CDN.
NFR-S1 (Uptime): 99.9% uptime garantizado por Next.js ISR.
NFR-S2 (Tolerancia a Fallos API): Servir páginas cacheadas (ISR) ante fallos o rate-limiting de Shopify.
NFR-SE1 (Checkout PCI-DSS): Checkout procesado 100% en Shopify, ningún dato de pago capturado por Next.js.
NFR-SE2 (Protección de Keys): Tokens de Shopify protegidos exclusivamente en servidor/edge.
NFR-A1 (Accesibilidad): Best-Effort WCAG 2.1 AA, uso de primitivas Radix UI/Shadcn UI.

### Additional Requirements

- **Starter Template:** Configuración "Clean Room" con Vanilla Next.js 15/16 (App Router), Tailwind CSS v4 y Shadcn UI Canary. (Impacta directamente Epic 1 / Story 1).
- **Mocking:** Implementación de Mock Service Worker (MSW) como requisito bloqueante de Infraestructura Inicial para testing (Evita Shopify Rate Limits).
- **Data Fetching:** Operaciones asíncronas con `shopifyFetch` nativo y cacheado con `React.cache()` para no saturar endpoints.
- **State Management:** Uso de Zustand v5.0+ para carrito y "Active Coupon Ledger".
- **UX Layout:** "Modern Luxe" design (Móvil-First). Uso de Slide-Over Cart (Sheet) para no perder contexto y Hybrid Product Card (Split-Screen) en desktop.
- **Micro-Interacciones:** Animaciones con Framer Motion (ej. validaciones de cupones interactivas).

### FR Coverage Map

FR1: Epic 1 - Búsqueda de productos
FR2: Epic 1 - Autocompletado de búsqueda
FR3: Epic 1 - Navegación por categorías
FR4: Epic 1 - Listado de productos (PLP)
FR5: Epic 1 - Galería de imágenes (PDP)
FR6: Epic 1 - Especificaciones técnicas (PDP)
FR7: Epic 1 - Selección de variantes (PDP)
FR8: Epic 2 - Disponibilidad de stock
FR9: Epic 2 - Agregar al carrito
FR10: Epic 2 - Resumen del carrito (Drawer)
FR11: Epic 2 - Modificar carrito
FR12: Epic 3 - Validar cupones
FR13: Epic 3 - Impacto de descuento
FR14: Epic 3 - Redirección a Shopify Checkout
FR15: Epic 3 - Manejo de stock agotado en checkout

## Epic List

### Epic 1: El Catálogo B2B / Retail (Descubrimiento y Exploración)
Los usuarios pueden encontrar exactamente lo que buscan al instante y visualizar las especificaciones técnicas complejas en una interfaz "Modern Luxe".
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7

### Epic 2: El Carrito Táctico (Gestión Segura de la Decisión)
Los usuarios pueden acumular productos de forma asíncrona (sin bloqueos de UI) y conocer al instante si el volumen deseado está disponible en el inventario real.
**FRs covered:** FR8, FR9, FR10, FR11

### Epic 3: Triunfo Financiero y Checkout (Conversión)
Los usuarios pueden descubrir y aplicar cupones de descuento nativamente viendo el ahorro en tiempo real, antes de transferirse de manera segura al Checkout de Shopify para pagar.
**FRs covered:** FR12, FR13, FR14, FR15

## Epic 1: El Catálogo B2B / Retail (Descubrimiento y Exploración)

Los usuarios pueden encontrar exactamente lo que buscan al instante y visualizar las especificaciones técnicas complejas en una interfaz "Modern Luxe".

### Story 1.1: Inicialización de Infraestructura Core y MSW

As a Developer,
I want to initialize the "Clean Room" Next.js project with Tailwind v4, Shadcn UI Canary, and Mock Service Worker (MSW),
So that the team has a solid, performant foundation (LCP < 2.5s) and can test safely without hitting Shopify API Rate Limits.

**Acceptance Criteria:**

**Given** the project repository is empty
**When** the initialization command is run and MSW is configured
**Then** a Next.js 15/16 app is created with Tailwind v4 and strict TypeScript
**And** Shadcn UI Canary is initialized with the "Modern Luxe" base theme (Off-white bg, no heavy shadows)
**And** MSW is configured to intercept `shopifyFetch` calls in development/test environments

### Story 1.2: Conexión Base con Shopify Storefront API

As a System,
I want a centralized, memoized `shopifyFetch` utility using React.cache(),
So that the application can securely query Shopify data from Server Components without duplication per render cycle.

**Acceptance Criteria:**

**Given** the required Shopify access tokens in `.env.local`
**When** a Server Component requests data through `shopifyFetch`
**Then** the request is sent asynchronously to the Shopify Edge CDN
**And** the response is cached per render cycle via `React.cache()`
**And** errors are handled gracefully returning typed objects instead of throwing raw exceptions

### Story 1.3: Navegación de Categorías y Landing (PLP)

As a Retail or B2B Buyer,
I want to browse an organized grid of products by category with high-quality images and clear pricing,
So that I can quickly scan the available inventory and find what I need.

**Acceptance Criteria:**

**Given** I navigate to a category page (e.g., `/pisos/porcelanatos`)
**When** the page loads
**Then** I see a "Modern Luxe" grid (4 cols Desktop, 2 cols Mobile) of products
**And** the page loads instantly using Next.js ISR (Incremental Static Regeneration)
**And** each product card shows the main image, title, and "Price From" text

### Story 1.4: Ficha de Producto (PDP) - Galería Inmersiva

As a Retail Buyer (Lucía),
I want to see large, high-resolution images of the product without visual distractions,
So that I can appreciate the design and quality before buying.

**Acceptance Criteria:**

**Given** I click on a product from the catalog
**When** the PDP loads (e.g., `/product/lámpara-led-gold`)
**Then** I see a "Split-Screen" layout on Desktop (Stacked on Mobile)
**And** the left pane contains a large, aspect-square immersive image gallery
**And** the first image uses `priority={true}` for optimal LCP

### Story 1.5: Ficha de Producto (PDP) - Datos Técnicos B2B

As a B2B Constructor (Marcelo),
I want to see a clear, structured grid of technical specifications alongside the product,
So that I can confirm dimensions, weight, and performance metrics instantly without opening accordions.

**Acceptance Criteria:**

**Given** I am viewing the PDP
**When** I look at the right pane (or scroll down on Mobile)
**Then** I see a highly readable, left-aligned typography grid displaying the Shopify Metafields (Specs)
**And** I can select product variants (e.g., Color, Size) which updates the price immediately

### Story 1.6: Buscador Predictivo (Autocompletado)

As a User,
I want to search for specific product names or SKUs and see instant suggestions,
So that I don't have to navigate through multiple categories to find my item.

**Acceptance Criteria:**

**Given** I am on any page with the header visible
**When** I type 3 or more characters in the search bar
**Then** a dropdown immediately shows matching products (Title, Image, Price) without requiring a full page reload
**And** clicking a suggestion takes me directly to the PDP

## Epic 2: El Carrito Táctico (Gestión Segura de la Decisión)

Los usuarios pueden acumular productos de forma asíncrona (sin bloqueos de UI) y conocer al instante si el volumen deseado está disponible en el inventario real.

### Story 2.1: Gestión Global del Carrito con Zustand

As a Developer,
I want to implement a non-persistent global state store using Zustand v5.0+,
So that any component in the application can read the cart's items and total price without triggering full-page SSR re-renders.

**Acceptance Criteria:**

**Given** the user is navigating the site
**When** a product is added or removed across different components (e.g., PDP, PLP)
**Then** the `useCartStore` immediately reflects the new state (items, subtotal)
**And** the state management does not use a React Context Provider that breaks Server Components

### Story 2.2: Añadir al Carrito Asíncrono (Shopify Mutation)

As a User,
I want to add products to my cart seamlessly via a Server Action mutation to Shopify,
So that I don't lose my place on the page or experience a full-page reload.

**Acceptance Criteria:**

**Given** I am on a Product Detail Page (PDP)
**When** I click the "Añadir al Carrito" button
**Then** a background Server Action calls the Shopify `cartCreate` or `cartLinesAdd` mutation
**And** upon success, the Zustand store is updated to reflect the new cart lines from Shopify
**And** if the product is out of stock, a typed error object is returned and displayed elegantly (no raw exceptions)

### Story 2.3: Visualización del Slide-Over Cart (Drawer)

As a User,
I want to see my cart contents slide in from the side of the screen without leaving the page,
So that I can review my order and continue shopping without losing my context.

**Acceptance Criteria:**

**Given** I have items in my store
**When** I click the "Cart" icon on the header OR successfully add a new item
**Then** a Shadcn `Sheet` component slides over from the right
**And** it displays the list of cart items (Image, Title, Quantity, Price) and the Subtotal

### Story 2.4: Modificación y Resumen de Ítems en Carrito

As a User,
I want to change the quantity of an item or remove it directly from the cart drawer,
So that I can easily fix mistakes or adjust my planned purchase volume.

**Acceptance Criteria:**

**Given** the Slide-Over Cart is open and contains items
**When** I click the "+" or "-" quantity buttons or the "Remove" icon
**Then** a Server Action mutates the cart line in Shopify (`cartLinesUpdate` or `cartLinesRemove`)
**And** the UI shows a loading state (spinner/skeleton on the item) while the mutation runs
**And** the Zustand store updates the Subtotal instantly upon success

### Story 2.5: Indicador de Stock en Tiempo Real B2B

As a B2B Constructor (Marcelo),
I want to see a clear visual indicator of exactly how much warehouse inventory is available,
So that I can be confident my large volume order can be fulfilled immediately.

**Acceptance Criteria:**

**Given** I am viewing a product in the PDP or the Cart Drawer
**When** the component streams in the data from Shopify
**Then** a semantic indicator (Green = "Inmediata", Amber = "Últimas X", Red = "Agotado") is displayed
**And** the "Añadir al Carrito" button is disabled if the requested quantity exceeds the real-time stock

## Epic 3: Triunfo Financiero y Checkout (Conversión)

Los usuarios pueden descubrir y aplicar cupones de descuento nativamente viendo el ahorro en tiempo real, antes de transferirse de manera segura al Checkout de Shopify para pagar.

### Story 3.1: Active Coupon Ledger - Detección de Beneficios

As a User,
I want the cart drawer to automatically suggest or allow me to easily apply valid discount codes,
So that I can see my savings without hunting for promo codes online or waiting until checkout.

**Acceptance Criteria:**

**Given** the Slide-Over Cart is open and contains items
**When** the user is viewing the subtotal
**Then** an input field or a "Suggested Deal" button is displayed (e.g., "Aplicar Cupón")
**And** submitting a code triggers a background Server Action mutation (`cartDiscountCodesUpdate`) against Shopify
**And** the UI shows a loading state during the validation process

### Story 3.2: Active Coupon Ledger - Recompensa Visual

As a User,
I want to see the exact amount of money I saved highlighted clearly when a coupon is applied,
So that I feel confident and rewarded before proceeding to checkout.

**Acceptance Criteria:**

**Given** a discount code was successfully validated via Story 3.1
**When** the Zustand store updates the cart object
**Then** the original Subtotal is crossed out
**And** the new total and the total savings amount are displayed using the Accent color (`#FF4D00`)
**And** a Framer Motion `spring` animation slightly highlights the change in price
**And** a visual indicator allows the user to easily remove the applied coupon

### Story 3.3: Preparación y Validación Asíncrona de Checkout

As a User,
I want to be warned if a product just sold out right before I pay,
So that my purchase isn't rejected mid-transaction by the payment processor.

**Acceptance Criteria:**

**Given** I am in the Slide-Over Cart ready to buy
**When** I click the "Ir a Pagar" button
**Then** a Server Action fetches the absolute latest stock from Shopify for all my cart lines
**And** if an item is out of stock, the redirect is stopped, and an inline error (in the Drawer) highlights the unavailable item
**And** if all items are in stock, the system retrieves the secure checkout URL from the Shopify cart object

### Story 3.4: Handoff Seguro hacia Shopify Checkout

As a System,
I want to securely redirect the user's validated cart to the Shopify-hosted checkout flow,
So that the application remains PCI-DSS compliant and does not process credit card data.

**Acceptance Criteria:**

**Given** the validation in Story 3.3 passed successfully
**When** the secure checkout URL is retrieved
**Then** the user is redirected via Next.js `redirect()` to the Shopify Checkout domain
**And** the cart drawer closes automatically
**And** the Shopify checkout page loads with all the user's items, discounts, and quantities perfectly matching the Next.js frontend state
