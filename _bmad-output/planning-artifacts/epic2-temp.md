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
