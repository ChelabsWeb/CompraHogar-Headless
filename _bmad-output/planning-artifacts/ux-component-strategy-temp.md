## Component Strategy

### Design System Components

Based on our chosen design system (Shadcn UI + Tailwind CSS v4 + Framer Motion) and our "Modern Luxe" design direction, we will leverage the following foundation components directly, tweaking only `--radius` (0.25rem - 0.5rem) and colors:

- **Button:** Foundation for all CTAs (Add to Cart, Checkout).
- **Sheet (Drawer):** The core mechanical component for our "Slide-Over Cart".
- **Input & Form:** For search bars and checkout fields.
- **Badge:** For semantic tags like "Top Seller B2B" or "Nuevo".
- **Skeleton:** Important for perceived performance (LCP) while Next.js Server Components stream the B2B pricing data.
- **Accordion:** Strictly limited to non-critical information (like FAQs or long descriptions) to respect the "Progressive Disclosure" principle.

### Custom Components

While Shadcn provides the primitives, our User Journeys require specific, custom-built composite components unique to CompraHogar-Headless.

#### 1. Active Coupon Ledger (The Tactical Discount Reveal)

**Purpose:** Automates the discovery and application of volume/B2B discounts directly inside the cart, turning a boring form field into a moment of delight.
**Usage:** Rendered inside the `Sheet` (Slide-Over Cart) when the user adds qualifying items.
**Anatomy:**
- *Trigger/Header:* Small accent badge ("Descuento Detectado").
- *Body:* Explanation of the automatic discount (e.g., "Nivel Constructor B2B Aplicado por llevar +10 cajas").
- *Action:* A prominent "Aplicar -20%" button.
- *State (Applied):* Seamlessly transforms into a success state showing the exact dollar amount saved in the `accent` color.
**States:** Hidden (default) -> Detected (Opportunity) -> Applied (Success/Saved Amount) -> Error (Code Invalid).
**Interaction Behavior:** One-tap apply. Uses Framer Motion `spring` physics to slightly expand and contract when applied, highlighting the total price drop.

#### 2. Hybrid Product Card (Split-Screen PDP)

**Purpose:** Balances the "Modern Luxe" imagery required by Retail users with the high-density technical data required by B2B users.
**Usage:** The main component of the `/[product]` route.
**Anatomy:** 
- *Left Pane (Visual):* Aspect-square or 4:3 large imagery with soft shadows (`shadow-soft`) and subtle hover scaling.
- *Right Pane (Data):* Clean, structured grid of technical specifications (Weight, Dimensions, Edge type, m2 yield).
- *Sticky Buy Bar (Mobile only):* A modified persistent version of the Right Pane's Add to Cart button that sticks to the bottom of the viewport on mobile devices.
**Variants:** Desktop (Split 50/50) vs Mobile (Stacked with Sticky Buy Bar).
**Content Guidelines:** Left pane needs background-removed PNGs/WebPs provided by Shopify. Right pane needs strict, short string values from Shopify Metafields.

#### 3. Real-Time Stock Indicator

**Purpose:** Alleviates B2B anxiety by confirming immediately if the volume needed is available in the warehouse.
**Usage:** Lives inside the `Hybrid Product Card` and inside the `Product Grid Item`.
**Anatomy:** A semantic dot (Green/Red/Amber) alongside heavy mono-spaced text (e.g., "500+ Cajas en Stock").
**States:** 
- *In Stock (Green):* "Inmediata"
- *Low Stock (Amber):* "Últimas X unidades"
- *Out of Stock (Red):* "Agotado - Ingresa [Date]"
- *Fetching (Skeleton):* While React Server Components resolve the Shopify API request to avoid blocking the LCP.

### Component Implementation Strategy

- **Atomic Design via Radix:** We will build the Custom Components by composing the accessible primitives from Shadcn UI (which uses Radix UI under the hood).
- **Tailwind Tokens:** All custom components MUST use semantic Tailwind classes (`bg-background`, `text-foreground`, `shadow-soft`, `text-accent`) defined in our `tailwind.config.js` to ensure the "Modern Luxe" consistency. Hardcoding hex colors (`#FF4D00`) inside components is strictly forbidden.
- **Client vs Server:** Semantic data (like the base Product Info in the Hybrid Card) will be Server Components. Interactivity (like the Active Coupon Ledger and the Sheet Drawer) will be Client Components (`"use client"`).

### Implementation Roadmap

**Phase 1 - Core Transactability (The Engine)**
- `Hybrid Product Card` (Focus on the layout and passing static mock data).
- `Sheet` (Slide-Over Cart setup).
- `Button` and `Input` standardizations.

**Phase 2 - The "Wow" Moments (The Experience)**
- `Active Coupon Ledger` (Connecting state management to the Cart to calculate exact savings).
- `Real-Time Stock Indicator` (Connecting to Shopify Storefront API).
- Framer Motion implementations on the Cart Drawer entrance and exit.

**Phase 3 - Polish & Edge Cases (The Safety Net)**
- `Skeleton` loaders for the Hybrid Product Card.
- "Zero Dead-Ends" empty states for the Cart and Search results.
