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
