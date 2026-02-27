---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-27T00:48:11-03:00'
inputDocuments: 
  - '{project-root}/_bmad-output/planning-artifacts/prd.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-design-specification.md'
  - '{project-root}/_bmad-output/project-context.md'
workflowType: 'architecture'
project_name: 'CompraHogar-Headless'
user_name: 'Chelabs'
date: '2026-02-27T00:30:10-03:00'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Identifiqué 15 FRs principales categorizados en: Descubrimiento de Catálogo (Buscador/Autocompletado), Información de Producto (PDPs complejas con variaciones y stock en tiempo real), Gestión de Carrito (Drawer no bloqueante), Dinámica de Precios (Active Coupon Ledger), y Checkout (redirección segura).
*Implicaciones Arquitectónicas:* Se requiere un manejo de estado cliente robusto para el carrito y los cupones que interactúe fluidamente con la API de Shopify de forma asíncrona sin bloquear la UI principal.

**Non-Functional Requirements:**
- **Performance:** Extrema (LCP < 2.5s, INP < 100ms). Requiere renderizado estático/híbrido (ISR/SSG) pesado en Next.js y delegación de recursos a la CDN de Edge.
- **Scalability & Resiliency:** Uptime de 99.9% con la estrategia de servir caché estático (ISR) si Shopify rechaza conexiones (Rate Limiting).
- **Security:** Checkout delegado a Shopify (PCI-DSS). Ocultamiento estricto de los tokens privados de la API de Shopify en un servidor Node/Edge.

**Scale & Complexity:**
- **Primary domain:** E-commerce Headless B2B/Retail.
- **Complexity level:** Medio/Alto (Por el manejo transaccional dual y requerimientos estrictos de sincronización de inventario contra otra plataforma).
- **Estimated architectural components:** Múltiples capas abstractas (API Fetch Layer, State Manager para Cart, RSC + Client UI Components).

### Technical Constraints & Dependencies

- **Framework Lock-in:** Next.js 16 (App Router) y React Server Components (obligatorio por `project-context.md`). Todo `shopifyFetch` debe ser SSR.
- **Styling:** Tailwind CSS v4 + Shadcn UI (Componentes Radix no reemplazables por temas de accesibilidad).
- **External Dependency:** Dependencia total de "Shopify Storefront API" para datos reales.

### Cross-Cutting Concerns Identified

- **Sincronización de Inventario (Real-Time vs ISR):** Manejar la dicotomía entre vender caché veloz y no vender un producto sin stock. Requiere validaciones dinámicas pre-checkout.
- **State Management (Cart):** Mantener sincronizado el carrito en toda la app sin forzar renders de componentes que no lo necesitan.
- **Performance Budget:** Restricciones estrictas en el uso extendido de `"use client"` para mantener métricas de Web Vitals.

## Starter Template Evaluation

### Primary Technology Domain

**Full-stack Web Application** basada en React Server Components (Next.js 16/15 App Router) interactuando como Headless Storefront contra Shopify GraphQL API.

### Starter Options Considered

Tras auditar las opciones actuales para la triada `Next.js` + `Tailwind CSS v4` + `Shadcn UI`:

1. **Next.js 15+ Starter Shadcn (Repositorios Comunitarios/Mainline):** Plantillas de terceros que pre-empacan autenticación, bases de datos y configuraciones pesadas (MDX, Stripe, etc.).
   *Evaluación:* Rechazado. Nuestro proyecto exige integración pura con Shopify Storefront API. Las plantillas pesadas introducen dependencias (ej: Prisma, Supabase Auth) que chocan directamente con los requerimientos B2B/Checkout de Shopify dictados en el PRD.
   
2. **Next.js Commerce (Oficial de Vercel/Shopify):**
   *Evaluación:* Rechazado. Aunque es oficial para Shopify, impone una estética y una estructura de componentes hiper-opiniada que hace casi imposible integrar fluidamente nuestro "Clean-Luxe Minimalista", Tailwind v4 y los componentes Shadcn elegidos sin reescribir la mitad del código base.

3. **Vanilla Next.js + Shadcn Canary Init (El enfoque "Clean Room"):**
   *Evaluación:* **Aprobado.** Dado que Tailwind v4 acaba de cambiar radicalmente su arquitectura (eliminando `tailwind.config.ts`), la forma más segura y purista recomendada por ambas comunidades hoy día es iniciar desde cero con la CLI oficial de Next.js e inicializar Shadcn usando su versión canary (que otorga soporte oficial a Tailwind v4).

### Selected Starter: Vanilla Next.js + Shadcn UI (Clean Room Approach)

**Rationale for Selection:**
Para un Headless E-commerce de alto rendimiento, el control total sobre el paquete final es vital (LCP < 2.5s). Utilizar el comando oficial de Next.js nos asegura cero dependencias indeseadas, TypeScript estricto desde el día 1, y la libertad total de implementar nuestra arquitectura "Hybrid Product Card" y "Active Coupon Ledger" sin luchar contra decisiones de diseño de plantillas genéricas.

**Initialization Command:**

```bash
# 1. Crear el proyecto Next.js base (Soporte nativo Tailwind v4)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# 2. Inicializar Shadcn UI (Versión con soporte para Tailwind v4 y React 19)
npx shadcn@canary init -d
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 5+ (Modo estricto habilitado por defecto).
- React 19 + Next.js App Router (Habilitando Server Components y Server Actions de forma nativa).

**Styling Solution:**
- Tailwind CSS v4 (Arquitectura basada puramente en CSS, eliminando archivos de configuración intermedios JS).
- Tema de color "New York" de Shadcn pre-inyectado en la capa CSS.

**Build Tooling:**
- Turbopack (Next.js v15/v16) para compilaciones de desarrollo hiper-rápidas.
- SWC como compilador subyacente de TypeScript/React.

**Testing Framework:**
*(No incluido por defecto).* Deberemos configurar explícitamente Jest u otro framework según el PRD en pasos posteriores.

**Code Organization:**
- Arquitectura basada en `/src`: Código fuente aislado de configuraciones de raíz.
- `/src/app`: Rutas del servidor y páginas.
- `/src/components/ui`: Destino de todas las primitivas de Shadcn (Botones, Drawers, Skeletons).

**Development Experience:**
- ESLint (Next.js Core Web Vitals preset) integrado.
- Resoluciones absolutas (`@/*`) configuradas desde el inicio, evitando el "infierno de imports relativos".

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

Basado en nuestro Starter "Clean Room" (Next.js 16 + Tailwind v4 + Shadcn) y las reglas estrictas de tu archivo `project-context.md`, ya hemos definido el esqueleto. Ahora tomemos las decisiones cruciales restantes.

**Ya Decidido (Por Starter & Contexto):**
- Rendering & Framework: Next.js 15/16 App Router (React 19).
- Fetching API: React Server Components asíncronos (`shopifyFetch` puro).
- Styling & UI: Tailwind CSS v4 + Shadcn UI (Radix) + Framer Motion.
- Infraestructura de Imágenes: `next/image` con CDN Edge de Shopify (Obligatorio).

**Decisiones Críticas a Tomar Ahora:**
1. State Management para el Carrito (Frontend Architecture).
2. Estrategia de Caching de Shopify (Data Architecture).
3. Monitoreo y Logging (Infrastructure).

---

### Frontend Architecture: State Management (Cart)

Necesitamos decidir cómo manejar el estado del Carrito ("Drawer no bloqueante") y el "Active Coupon Ledger" sincrónizándolo entre componentes de Cliente sin saturar el servidor ni romper la hidratación de Next.js.

**Opciones:**
- **Context API Nativo:** Viene con React, fácil. *Contras:* Provoca re-renders innecesarios en toda la aplicación si no se usa con extremo cuidado.
- **Redux Toolkit:** Potente, estándar de la industria. *Contras:* Excesivamente pesado para un proyecto e-commerce que ya delega el 80% de su "estado real" a Shopify.
- **Zustand (v5.0+):** Minimalista, no requiere "Provider" envolviendo `layout.tsx`, compatible con React 19 y optimizado para evitar re-renders.

**Mi Recomendación: Zustand**
Al no requerir un Provider que envuelva tu App en `"use client"`, Zustand nos permite mantener el 90% de tu e-commerce como Server Components ultra-rápidos, inyectando el estado del carrito *solamente* en los botones de "Agregar" y en el Drawer. Encaja perfecto con tu NFR de extrema performance (LCP < 2.5s).

### Data Architecture: Estrategia de Caching

Shopify penaliza severamente las consultas excesivas (Rate Limiting). Debemos decidir cómo consumiremos y almacenaremos temporalmente su catálogo.

**Opciones:**
- **No-Cache (SSR Puro):** Todo es dato real. *Contras:* Lento, dependiente del ping hacia Shopify, arriesga el Uptime del 99.9% NFR.
- **SSG (Static Generation) estricto:** Rápido, pre-creado en build time. *Contras:* El inventario mostrado se desfasa rápidamente frente a ventas B2B presenciales.
- **ISR (Incremental Static Regeneration) + Server Actions:** Cachear el listado de productos en Next.js por 1-5 minutos, pero validar dinámicamente el carrito pre-checkout usando Server Actions puras sin cache.

**Mi Recomendación: Next.js ISR (1 - 5 mins) con Validación Asíncrona Pre-Checkout**
Te permite cargar el catálogo entero desde el caché perimetral de Vercel/Edge en menos de ~100ms, protegiéndonos de caídas de Shopify. Cuando Marcelo (B2B) hace clic en "Comprar", un Server Action paralelo valida el stock real exacto instantes antes de delegar asíncronamente a la URL del checkout.

### Infrastructure & Deployment: Hosting & Manejo Edge

Dado que la velocidad LCP es un criterio de éxito primario en tu PRD.

**Opciones:**
- **Servidor Node.js Tradicional/VPS (AWS EC2, DigitalOcean):** Barato. *Contras:* Lento para usuarios lejanos, no aprovecha CDNs perimetrales.
- **Vercel u otra plataforma Edge-Native (Cloudflare Pages):** Optimización zero-configuraion para Next.js, renderizando React en nodos Edge distribuidos.

**Mi Recomendación: Plataforma Edge-Native (ej: Vercel)**
Asume toda la carga de compresión de imágenes y entrega de assets estáticos globales para que tu LCP alcance los objetivos del MVP (Fase 1) sin esfuerzo de DevOps complejo de tu lado.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
Dado que este proyecto será implementado asíncronamente por múltiples agentes de IA (Winston, Sally, Bob, Dev, QA), he identificado **5 áreas críticas** donde la falta de convención para Next.js 16 y Shopify puede destruir la integración continua.

### 1. Naming Patterns

**API & Server Actions (Shopify):**
- **Regla:** Todos los Server Actions que mutan datos (ej: carrito) deben usar el prefijo `action` y estar en formato camelCase. Las queries puras usan el sufijo `Query`.
- *Correcto:* `actionAddToCart()`, `getProductQuery()`
- *Incorrecto:* `AddToCart()`, `fetch_product()`

**Code Naming Conventions:**
- **Regla:** Componentes React en PascalCase. Hooks personalizados en camelCase empezando con `use`. Interfaces/Types en PascalCase.
- *Correcto:* `ProductCard.tsx`, `useCartStore.ts`, `ProductType`
- *Incorrecto:* `product-card.tsx`, `CartStore.ts`, `type_product`

### 2. Structure Patterns

**Project Organization (Next.js App Router):**
- **Regla:** Estricta separación entre UI "tonta" (Shadcn) y componentes de negocio. Ningún componente en `src/components/ui` puede tener lógica de negocio o llamadas a Shopify.
- *Correcto:* `/src/components/ui/button.tsx` (puro visual) y `/src/components/shop/hybrid-product-card.tsx` (conecta con store/acciones).

**File Structure Patterns:**
- **Regla:** Las queries y mutaciones de Shopify NO pueden vivir dentro de los componentes. Deben estar aisladas en `/src/lib/shopify/`.
- *Correcto:* Importar `import { getProduct } from '@/lib/shopify/queries'`
- *Incorrecto:* Escribir el `fetch` de GraphQL directamente dentro de `page.tsx`.

### 3. Format Patterns

**API Response Formats (Shopify Wrapper):**
- **Regla:** Todo retorno de la API de Shopify debe ser destructurado y formateado antes de llegar a la UI para evitar que los componentes de frontend lidien con los "nodes" y "edges" de GraphQL.
- *Correcto:* Devolver un array plano `Product[]`.
- *Incorrecto:* Devolver `data.products.edges.map(edge => edge.node)`.

**Data Exchange Formats:**
- **Regla:** Los IDs de Shopify (GIDs) deben mantenerse siempre como strings codificados en base64 tal como llegan de la API, NUNCA intentar parsearlos a numéricos.

### 4. Communication Patterns

**State Management Patterns (Zustand):**
- **Regla:** El store de Zustand (`useCartStore`) es de **solo lectura** para los componentes de interfaz en cuanto a estado. Las mutaciones deben despacharse mediante acciones encapsuladas en el mismo store que llaman a los Server Actions.
- *Correcto:* `const { cart, addItem } = useCartStore()`
- *Incorrecto:* `cart.lines.push(newItem)` (Mutación directa).

### 5. Process Patterns

**Error Handling Patterns:**
- **Regla:** Los Server Actions deben devolver AL CLIENTE siempre un objeto tipado indicando éxito o fracaso, nunca arrojar errores no capturados (`throw new Error()`) que rompan la UI de Next.js.
- *Patrón Requerido:* `return { success: false, message: 'Stock insuficiente', code: 'OUT_OF_STOCK' }`

**Loading State Patterns:**
- **Regla:** Para las transiciones de servidor (navegación en App Router), usar rigurosamente los archivos `loading.tsx` de Next.js creando Skeletons consistentes (con Shadcn `Skeleton`) en lugar de estados `isLoading` manuales en cada componente.

### 6. Enforcement Guidelines

**All AI Agents MUST:**
- Utilizar SIEMPRE alias absolutos (`@/...`) en todas las importaciones. Las relativas (`../../`) están prohibidas.
- Respetar el "Clean-Luxe Minimalista" aplicando `rounded-none` y `shadow-none` a los componentes base de Shadcn, NUNCA inyectar sombras de Tailwind a menos que una directiva explícita de UX lo exija.
- Ejecutar `npm run lint` y verificar que el tipado de TypeScript sea `strict` sin el uso de la palabra clave `any`. Todo dato de Shopify debe estar tipado a partir del Schema.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
comprahogar-headless/
├── README.md
├── package.json
├── next.config.ts
├── tailwind.config.ts           # (Si es bypass para herramientas legacy, sino CSS purista v4)
├── tsconfig.json
├── eslint.config.mjs
├── .env.local                   # Secretos de Shopify (SHOPIFY_STOREFRONT_ACCESS_TOKEN)
├── .env.example                 # Plantilla segura de variables
├── src/
│   ├── app/                     # Next.js App Router (Páginas y Server Actions puras)
│   │   ├── (shop)/              # Route Group para el e-commerce principal
│   │   │   ├── page.tsx         # Home (SSR/ISR)
│   │   │   ├── loading.tsx      # Skeletons globales de la home
│   │   │   ├── [category]/      # PLP (Product Listing Page) dinámica
│   │   │   │   └── page.tsx
│   │   │   └── product/
│   │   │       └── [handle]/    # PDP (Product Detail Page) dinámica
│   │   │           └── page.tsx
│   │   ├── api/                 # Endpoints Edge para webhooks de Shopify (Opcional)
│   │   ├── globals.css          # Inyección de Tailwind v4 y Variables de Shadcn
│   │   └── layout.tsx           # Root Layout (Server Component, inyecta fuentes)
│   │
│   ├── components/              # Separación estricta de responsabilidades UI
│   │   ├── ui/                  # Componentes "tontos" de Shadcn (Botones, Inputs genéricos)
│   │   ├── shop/                # Componentes comerciales atados a Shopify
│   │   │   ├── hybrid-product-card.tsx
│   │   │   ├── product-gallery.tsx
│   │   │   └── active-coupon-ledger.tsx
│   │   └── layout/              # Componentes estructurales
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       └── cart-drawer.tsx  # Componente Cliente conectado a Zustand
│   │
│   ├── lib/                     # Utilidades y lógica de negocio pura
│   │   ├── shopify/             # Aislamiento total de la API de Shopify
│   │   │   ├── fetch.ts         # Wrapper genérico para shopifyFetch
│   │   │   ├── queries.ts       # GraphQL: getProductQuery, getCollectionQuery
│   │   │   └── mutations.ts     # GraphQL: createCartMutation, linesAddMutation
│   │   └── utils.ts             # Tailwind cn() merger de Shadcn
│   │
│   ├── store/                   # Zustand State Management
│   │   └── use-cart-store.ts    # Store de solo lectura para el UI instanciando mutaciones asíncronas
│   │
│   └── types/                   # TypeScript interfaces estrictas
│       └── shopify.ts           # Tipos mapeados desde la API de GraphQL
│
└── public/
    └── assets/                  # Logos estáticos, íconos PWA
```

### Architectural Boundaries

**API Boundaries:**
- Todo el fetching asíncrono se delega al boundary `src/lib/shopify/fetch.ts`. Ningún componente fuera de este directorio debe hablar directamente con el endpoint de GraphQL de Shopify.
- Autenticación y Tokens: Residen exclusivamente en el entorno de Node.js / Edge de Next.js. El cliente navegador JAMAS conoce el token de acceso a Shopify, previniendo inyecciones de red.

**Component Boundaries:**
- El Server Component en `src/app/.../page.tsx` es responsable de pedir los datos a `src/lib/shopify` y pasarlos hacia abajo como props serializables a componentes de presentación.
- Los Hooks de estado global (`useCartStore`) SOLO deben ser consumidos en los nodos "hoja" del árbol de React (ej: `cart-drawer.tsx` o el botón "Agregar al Carrito"), NUNCA en el layout principal para evitar envenenar el Server-Side Rendering (`"use client"` poisoning).

**Service Boundaries:**
- Los "Server Actions" funcionan como el único puente seguro mediante el cual un componente de Cliente (como el Active Coupon Ledger) puede solicitar la mutación del carrito en Shopify de forma segura desde el servidor de Next.js.

**Data Boundaries:**
- Caching: La caché de Next.js (ISR) actúa como barrera de protección entre las oleadas de tráfico Retail y los límites de tasa (Rate Limits) de la API de Shopify.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- **Epic: Descubrimiento de Catálogo (Buscador y Navegación B2B)**
  - UI Components: `src/components/shop/hybrid-product-card.tsx`
  - Routes: `src/app/(shop)/[category]/page.tsx`
  - Fetching: `getProductQuery` en `src/lib/shopify/queries.ts`
- **Epic: PDP con Stock Real-Time y Variantes**
  - UI Components: `src/components/shop/product-gallery.tsx`
  - Routes: `src/app/(shop)/product/[handle]/page.tsx`
  - Integración Edge: Server Component con fallback asíncrono.
- **Epic: Carrito Drawer y Checkout (Retail/B2B)**
  - UI Components: `src/components/layout/cart-drawer.tsx`
  - State Mgmt: `src/store/use-cart-store.ts`
  - Mutaciones: `createCartMutation`, `updateCartMutation` en `src/lib/shopify/mutations.ts`

### Integration Points

**Internal Communication:**
- El UI desencadena un evento -> Zustand captura el evento -> Zustand invoca un Server Action -> Next.js ejecuta el Server Action en el servidor -> El Server Action invoca a `src/lib/shopify/fetch.ts` -> Retorna resultado -> Zustand actualiza el estado derivado reactivo de forma atómica.

**External Integrations:**
- Shopify Storefront API (GraphQL): Fuente única de verdad para el inventario, productos, cupones y delegación del Checkout final.

### File Organization Patterns

**Source Organization:**
Aislamiento por responsabilidad (Separation of Concerns). `app/` es para ruteo (URLs) y orquestación de datos de servidor. `components/` es para presentación. `lib/` es para lógica pura agnóstica de React. `store/` maneja mutaciones de cliente complejas.

### Development Workflow Integration

- **Development Server:** El entorno asume simulación completa local (Next.js en puerto 3000) requiriendo un `.env.local` poblado con claves reales de una tienda de desarrollo (Staging) de Shopify para no dañar datos en producción durante el ciclo MVP.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- **Next.js 15/16 + React 19 + Zustand v5 + Tailwind v4:** Todas estas versiones representan el estado del arte actual (Q1 2026) y han sido verificadas como 100% compatibles. Zustand 5 no requiere providers que rompan el SSR, lo cual es vital para el App Router de Next.js.
- **Shopify API + Edge:** La decisión de usar llamadas `fetch` nativas asíncronas desde Server Components al CDN Edge de Shopify es la forma arquitectónicamente correcta de construir Headless hoy, evitando librerías Apollo/Relay pesadas en el cliente.
- **[Añadido por Múltiples Agentes] Memoización de Caché:** Para garantizar la compatibilidad entre SSR estricto y el límite de llamadas de Shopify, TODAS las llamadas a la API (e.g., `getCart()`) deben estar envueltas explícitamente en `React.cache()` para asegurar que se ejecuten solo una vez por ciclo de render, protegiendo al CDN.

**Pattern Consistency:**
- Los patrones de nombramiento (`actionCamelCase` para mutaciones, PascalCase para UI) soportan directamente la separación estricta entre capa visual y lógica de negocio.
- La regla de "Shopify Wrapper" garantiza que los componentes visuales nunca se enteren de que la fuente de datos es GraphQL.

**Structure Alignment:**
- El árbol de directorios `src/` refleja físicamente las capas de abstracción decididas (e.g. `src/lib/shopify` encapsulado, `src/store` aislado).

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
- **Product Listing (Catálogo Libre B2B):** Cubierto por las rutas dinámicas `[category]/page.tsx` usando ISR de Next.js.
- **Product Detail (Stock Real-Time B2B):** Cubierto por los Server Actions paralelos (`product/[handle]/page.tsx`).
- **Cart & Ledger:** Cubierto por Zustand (`cart-drawer.tsx` y `active-coupon-ledger.tsx`).
- **Checkout:** Delegado a Shopify vía URL Redirect (Decisión de seguridad NFR validada).

**Functional Requirements Coverage:**
- Navegación asimétrica, sistema de cupones inteligente, buscador predictivo: Todo está mapeado a componentes específicos o llamadas a la API de Shopify en `lib/shopify`.

**Non-Functional Requirements Coverage:**
- **LCP < 2.5s:** Edge Deployment (Vercel) + ISR de Next.js + Componentes de Servidor + Tailwind v4 (CSS ultra-ligero de 10kb).
- **PCI-DSS Compliance:** Ningún dato de pago pasa por nuestro Next.js. Todo token se queda en Server Actions.
- **99.9% Uptime:** Next.js ISR oculta las caídas momentáneas de Shopify sirviendo el caché estático perimetral.

### Implementation Readiness Validation ✅

**Decision Completeness:**
- El Starter Template está definido ("Clean Room" Next.js + Shadcn).
- Las herramientas de DevEx (ESLint estricto, Alias asbsolutos) están listas para bloquear código malo en CI/CD.

**Structure Completeness:**
- El árbol de carpetas incluye desde los webhooks hasta el layout principal, no hay ambigüedades respecto a dónde va cada nuevo archivo.

**Pattern Completeness:**
- Las reglas "Must Follow" para los agentes están redactadas explícitamente y son validables en auditorías de código (e.g. *prohibido mutar manualmente el cart, usar Zustand dispatcher*).

### Gap Analysis Results

**Critical Gaps (Resueltos en Party Mode):**
- **Estrategia de Mocking para API de Shopify:** No podemos exponer nuestros límites de API perimetrales a las iteraciones agresivas de Testing CI/CD de los agentes. Hemos elevado la implementación de **MSW (Mock Service Worker)** a un requisito bloqueante de Infraestructura Inicial. Esto interceptará el tráfico de Red a nivel de Node.js durante los tests automáticos.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High. El stack "Next.js + Shopify + Shadcn" con Zustand es altamente predecible y la arquitectura defensiva aplicada protegerá al proyecto del código espagueti.

**Key Strengths:**
- Rendimiento LCP asegurado por Server Components puros y caché en Edge.
- Aislamiento total de las rarezas de GraphQL (edges/nodes) del Frontend.
- Seguridad de tokens 100% Server-Side.

**Areas for Future Enhancement:**
- Módulo de PWA (Service Workers) para la Fase 3 del PRD (Soporte Offline para vendedores B2B).

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Refer to this document for all architectural questions.

**First Implementation Priority:**
> `npx create-next-app@latest comprahogar-headless --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` seguido de la inicialización de Shadcn UI v4.
