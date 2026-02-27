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
