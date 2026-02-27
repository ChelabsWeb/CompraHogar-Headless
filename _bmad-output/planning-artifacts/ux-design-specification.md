---
lastStep: 14
stepsCompleted: 
  - step-01-init
  - step-02-discovery
  - step-03-core-experience
  - step-04-emotional-response
  - step-05-inspiration
  - step-06-design-system
  - step-07-defining-experience
  - step-08-visual-foundation
  - step-10-user-journeys
  - step-11-component-strategy
  - step-12-ux-patterns
  - step-13-responsive-accessibility
  - step-14-complete
inputDocuments: 
  - '{project-root}/_bmad-output/planning-artifacts/prd.md'
  - '{project-root}/_bmad-output/project-context.md'
---

# UX Design Specification CompraHogar-Headless

**Author:** Chelabs
**Date:** 2026-02-26T19:35:00-03:00

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision
CompraHogar-Headless es una plataforma e-commerce B2B/B2C que une la alta eficiencia transaccional con una experiencia visual premium ("Modern Luxe"). El objetivo de diseño es generar confianza absoluta a través de la velocidad (Next.js Headless) y transparencia de información, elevando la percepción de calidad de los materiales de construcción sin alienar a los usuarios sensibles al precio.

### Target Users
1. **Marcelo (El Constructor B2B - Usuario Principal):** Busca máxima eficiencia. Entra desde su móvil en la obra, requiere buscadores rápidos, fichas técnicas claras y confirmación de stock. Valora el checkout sin fricciones donde aplicar sus cupones sea evidente.
2. **Lucía (Comprador Retail "Aspiracional"):** Busca inspiración y diseño con presupuesto ajustado. Valora las imágenes inmersivas (sin bordes redondeados) y necesita seguridad sobre los descuentos y envíos antes del pago.

### Key Design Challenges
- **Equilibrio Estética vs. Rendimiento:** Lograr un diseño "premium/lujo" con micro-interacciones suaves (Framer Motion) sin impactar el LCP estricto (< 2.5s).
- **Dualidad de Información:** Diseñar fichas de producto que inspiren visualmente a Lucía, pero que ofrezcan lectura instantánea de datos duros a Marcelo.
- **Transparencia en Precios:** Integrar la aplicación de cupones de manera nativa y evidente antes de redirir al checkout de Shopify.

### Design Opportunities
- **Jerarquía Visual Elegante:** Usar proporciones balanceadas y un diseño moderno que no se sienta excesivamente crudo ni decorado.
- **Micro-interacciones de Confianza:** Validaciones de stock asíncronas visualmente integradas que no bloqueen al usuario.
- **Navegación Móvil Táctica:** Implementar patrones como Drawers (Slide-overs) para el carrito y filtros.

## Core User Experience

### Defining Experience
La experiencia central de CompraHogar-Headless es la **"Transaccionalidad Inspiradora"**. El usuario debe poder transicionar sin fricción desde el descubrimiento visual inmersivo (imágenes grandes, jerarquía limpia) hacia la decisión de compra táctica (lectura de especificaciones técnicas, validación rápida de stock y aplicación intuitiva de cupones). La acción central crítica es **la adición al carrito y visualización de beneficios económicos antes del checkout**.

### Platform Strategy
- **Mobile-First Estricto:** Dado que tanto los constructores en obra (Marcelo) como los compradores retail "aspiracionales" (Lucía) navegarán predominantemente desde dispositivos móviles.
- **Interacciones Touch-Optimized:** Botones grandes (Shadcn UI), navegación táctil por gestos (Framer Motion swipes para galerías y drawers).
- **Web App (SPA/SSR Híbrida):** Carga inicial ultrarrápida (SSR Next.js) seguida de una navegación tipo Single Page Application, garantizando que el usuario nunca vea una "página en blanco" al cambiar de categoría.

### Effortless Interactions
- **Aplicación Automática/Sugerida de Cupones:** El sistema debe pre-calcular o sugerir agresivamente la aplicación de cupones en el *Slide-over Cart*, eliminando la necesidad de buscar códigos externos.
- **Acceso Inmediato a Specs:** Las especificaciones técnicas clave (medidas, stock real) deben ser escaneables en menos de 2 segundos sin hacer scroll excesivo.
- **Búsqueda Tolerante a Fallos:** El autocompletado del buscador debe ser instantáneo y perdonar errores ortográficos comunes en materiales de construcción.

### Critical Success Moments
- **El Momento "Wow" de Carga:** La primera impresión visual al abrir un link desde Instagram o WhatsApp y que la página cargue en < 2.5s con diseño premium.
- **La Revelación del Descuento:** El momento en que Lucía/Marcelo ven que el precio premium inicial se ajusta dramáticamente a su favor en el Drawer del carrito.
- **Checkout Handoff:** La transición fluida desde el storefront de Next.js hacia el checkout seguro de Shopify sin romper la narrativa visual.

### Experience Principles
1. **El Producto como Héroe:** Minimizar el ruido visual de la interfaz. Diseño equilibrado, accesible y premium.
2. **Velocidad es Confianza:** Las interacciones deben ser o parecer instantáneas (INP < 100ms).
3. **Honestidad Táctica:** Las especificaciones técnicas y los costos adicionales (como envíos) nunca deben ocultarse detrás de un acordeón si son críticos para la compra.

## Desired Emotional Response

### Primary Emotional Goals
La respuesta emocional principal a lograr es la **"Confianza Exclusiva"**. El usuario debe sentir que está comprando en una boutique de diseño de alto nivel, pero con el respaldo, la seguridad y los precios de un distribuidor mayorista masivo. No es "barato", es "una compra inteligente y sofisticada".

### Emotional Journey Mapping
- **Descubrimiento (Home/Categorías):** *Inspiración y Sorpresa.* El usuario llega pensando en "materiales de construcción" y se encuentra con una presentación digna de una galería de diseño.
- **Evaluación (Ficha de Producto):** *Alivio y Claridad.* La ansiedad de comprar online un producto físico pesado/técnico se disipa al ver especificaciones exactas y stock en tiempo real.
- **Acción (Carrito/Promociones):** *Triunfo (Delight).* La aplicación nativa y sin fricciones de un cupón hace que el usuario sienta que "le ganó al sistema" validando su esfuerzo.
- **Resolución (Checkout):** *Seguridad Absoluta.* La transición a la pasarela de pago (Shopify) se siente robusta, profesional y encriptada.

### Micro-Emotions
- **Confianza vs. Escepticismo:** El rendimiento instantáneo (Next.js Headless) destruye el escepticismo inicial que suele acompañar a sitios de e-commerce desconocidos.
- **Empoderamiento vs. Ansiedad:** Ver los "Costos de envío al interior" calculados *antes* de ingresar la tarjeta de crédito elimina el miedo a los cargos ocultos.

### Design Implications
- **Para inspirar confianza exclusiva:** Usar tipografías sans-serif fuertes comerciales (ej. Inter o Roboto Mono para precios/specs) y mucho espacio en blanco (Negative Space). Eliminar banners pop-up ruidosos.
- **Para generar alivio técnico:** Agrupar la información dura en tablas o grillas sobrias, separadas visualmente de las grandes fotografías aspiracionales.
- **Para potenciar el sentimiento de triunfo:** Las animaciones (Framer Motion) en el Drawer del carrito al aplicar un cupón deben tener "physics" (rebote sutil) y destacar el dinero ahorrado (ej. color `#FF4D00` u otro color de acento sobre fondo oscuro).

### Emotional Design Principles
1. **El silencio visual habla de lujo:** Menos elementos en la interfaz aumentan el valor percibido del inventario.
2. **La velocidad elimina la ansiedad:** Una página que responde en 100ms se siente intrínsecamente más segura y profesional que una que tarda 3 segundos.
3. **Sorpresa en el ahorro, no en el costo:** Los descuentos deben ser dramáticamente visibles, los costos adicionales (envíos) deben ser transparentes desde el segundo cero.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
- **SSENSE / Kickgame (Lujo Moderno):**
  - *Éxito UX:* El producto es el héroe absoluto. Uso extremo del espacio negativo (blanco). Ausencia de "cajas" contenedoras visibles.
  - *Lección:* Esta estética eleva instantáneamente la percepción de calidad del inventario, algo vital para que Lucía (Retail) sienta que está comprando diseño y no solo "materiales".
- **Apple Store (Transaccionalidad Fluida):**
  - *Éxito UX:* Transición perfecta entre fotografía inspiracional inmensa y selección de especificaciones técnicas densas.
  - *Lección:* Simplifica decisiones técnicas complejas sin abrumar visualmente.
- **Home Depot / MercadoLibre (Aciertos Funcionales):**
  - *Éxito UX:* Visibilidad agresiva de "Stock Disponible" y "Fecha de Entrega/Envío".
  - *Lección:* Resuelve de inmediato la ansiedad operativa de Marcelo (B2B Constructor).

### Transferable UX Patterns
**Navigation Patterns:**
- *Sticky Buy Bar:* Barra inferior o superior fija en versión móvil durante el scroll en la ficha de producto, permitiendo agregar al carrito sin volver a subir (inspirado en Apple).
- *Slide-Over Cart (Drawer):* Un carrito lateral que no redirige a otra URL, permitiendo visualizar el pedido y **aplicar cupones de forma nativa** sin abandonar el catálogo.

**Interaction Patterns:**
- *Filtros Instantáneos (Sin Recarga):* Actualización de la grilla de productos instantánea al tocar filtros (Next.js Shallow Routing con Server Components).
- *Stock Semántico:* Indicadores visuales claros de inventario (ej. "50+ Cajas Disponibles" en verde institucional).

### Anti-Patterns to Avoid
- *Pop-ups Intrusivos Iniciales:* Pedir el email con un modal a los 3 segundos destruye la percepción "Premium".
- *Acordeones Escondiendo Specs:* Obligar al usuario B2B a hacer clics extra para encontrar dimensiones o rendimiento por m2.
- *Sorpresas en el Checkout:* Esconder el costo del envío para el interior del país hasta el último paso de Shopify.

### Design Inspiration Strategy
**What to Adopt:**
- El layout moderno y balanceado de marcas de lujo para el catálogo general.
- El "Drawer Cart" inteligente con previsualización dinámica de ahorros.
**What to Adapt:**
- Las "fichas de lujo": Adaptarlas para mostrar una alta densidad de datos técnicos (absorción, tamaño, peso) de manera escaneable y rápida, combinando la limpieza de Apple con la información de Home Depot.
**What to Avoid:**
- Elementos UI desactualizados: Diseños excesivamente recargados o plantillas genéricas sin personalidad. El diseño debe sentirse cohesivo y curado.

## Design System Foundation

### 1.1 Design System Choice
**Themeable System: Shadcn UI + Tailwind CSS v4 + Framer Motion**

### Rationale for Selection
- **Control Absoluto del DOM:** Shadcn UI permite eliminar *por completo* las clases genéricas (como bordes redondeados y sombras) para lograr el look "Clean-Luxe" sin pelear contra la especificidad de CSS, ya que controlas el código de cada componente.
- **Rendimiento Máximo:** Tailwind CSS v4 garantiza una carga inicial ínfima, crucial para el objetivo de alto rendimiento de Next.js Headless (LCP < 2.5s).
- **Micro-interacciones Nativas:** Framer Motion se integra en el ecosistema de React/Next.js para animar la entrada/salida de componentes clave (como el Drawer del carrito) con máxima fluidez.

### Implementation Approach
- **Fundación Base:** Inicializar Next.js con Tailwind v4.
- **Inyección de Componentes:** Instalar componentes de Shadcn UI (Button, Sheet, Input) copiando el código al proyecto según se necesiten.
- **Configuración Global:** Limpiar la configuración de Tailwind para establecer variables de marca hiper-restrictivas.

### Customization Strategy
- **Diseño Paramétrico Combinado:** Configurar Shadcn UI para lograr un equilibrio (ej. `--radius: 0.25rem` o `--radius: 0.5rem`) que no se sienta tan agresivo como el bordes rectos totales.
- **Paleta de Alto Contraste:** Definir un esquema estrictamente binario (Blanco/Negro absolutos o grises muy extremos) con un único color de acento energético (ej. Naranja Industrial) para conversiones.
- **Tipografía Intransigente:** Reemplazar las fuentes genéricas del OS por tipografías comerciales web (ej. Inter o familia Mono) para todo el texto de interfaz.

## 2. Core User Experience

### 2.1 Defining Experience
La interacción clave que el usuario recordará y que define a CompraHogar-Headless es la **"Revelación del Descuento Táctico" (The Tactical Discount Reveal)**. Es el momento donde el cliente B2B siente alivio y recompensa por su lealtad, y el cliente Retail siente que encontró una oportunidad exclusiva. Ocurre cuando el usuario añade un producto premium al carrito y, al abrirse el "Slide-Over Drawer", el sistema precalcula o sugiere agresivamente un cupón que reduce dramáticamente el precio total.

### 2.2 User Mental Model
- **El B2B (Marcelo):** Espera que comprar online le dé los mismos beneficios que llamar a su distribuidor de confianza. Su modelo mental es *comprar volumen = precio preferencial*.
- **El Retail (Lucía):** Espera que una tienda de aspecto premium tenga precios inalcanzables. Su modelo mental es *esperar a un descuento especial*.
- **La Solución (Expectativa Rota):** La plataforma no oculta los descuentos. En lugar de un campo pasivo "Introduce tu cupón", el Drawer muestra activamente: *"Tienes un cupón del 20% aplicable a este pedido"*.

### 2.3 Success Criteria
1. **Fricción Cero:** El descuento debe aplicarse con 1 tap/clic directamente dentro del Drawer del carrito, sin redirigir de página ni abrir un modal.
2. **Impacto Visual:** El precio original debe tacharse y el nuevo precio (y la cantidad ahorrada) debe resaltarse con el color de acento energético.
3. **Carga Inmediata:** La validación SSR/Server-Actions debe ocurrir pre-cargada, para que la recompensa se sienta fluida e instantánea.

### 2.4 Novel UX Patterns
- **El "Active Coupon Ledger":** En lugar de seguir el patrón tradicional donde el usuario debe buscar e ingresar un código en el checkout, el Carrito (Drawer) hace un *match* automático entre el usuario logueado y sugiere los cupones válidos aplicables al instante. Convierte un campo de formulario en una micro-interacción de deleite.

### 2.5 Experience Mechanics
1. **Iniciación:** El usuario presiona el botón "Agregar al Carrito" (Sticky Buy Bar o Ficha de Producto).
2. **Interacción:** Next.js abre el "Slide-Over Drawer" (animado con Framer Motion). La UI despliega una card sutil que dice *"Descuento por Volumen disponible"*. El usuario presiona "Aplicar".
3. **Feedback:** Animación fluida de cálculo numérico utilizando 'spring physics'. El precio baja visualmente, y el color cambia sutilmente al Naranja de acento por 1 segundo antes de volver al fondo base, mostrando *"Te has ahorrado $X"*.
4. **Finalización:** Con el beneficio económico visualizado, el botón dominante de "Ir a Pagar" guía al usuario directamente al flujo de checkout seguro de Shopify.

## Visual Design Foundation

### Color System
**Estrategia:** La paleta "Kickgame Clone" combinada sutilmente con acentos energéticos transaccionales en un entorno de alto contraste.
- **Main Background (--background):** `#FCFBF7` (Off-white/Crema). Nunca blanco puro, otorgando un aspecto editorial/luxe que elimina la fatiga visual.
- **Main Text & Accents (--foreground):** `#121212` (Casi negro). Para asegurar legibilidad absoluta y contraste extremo.
- **Secondary Backgrounds (--muted):** `#F2EFE7` (Beige/Arena). Utilizado suavemente para inputs, barras de búsqueda o áreas de navegación secundarias.
- **Product Boxes (--secondary):** `#F3F3F3` (Gris claro). Las imágenes (con fondo transparente desde Shopify) siempre descansarán sobre este tono, en cajas uniformes.
- **Transactional Accent:** Naranja Industrial (`#FF4D00`). Estrictamente reservado para acciones críticas de conversión (Slide-over Cart, descuentos aplicados, checkout).
- **Semantics:** Verde vibrante para stock positivo, Rojo para falta de stock.

### Typography System
**Estrategia:** Realismo Digital 2026. Legibilidad técnica combinada con impacto estético equilibrado.
- **Primary Font (Headings):** `Inter` o fuentes Sans geométricas estructuradas siempre en **Mayúsculas (UPPERCASE)** para los encabezados. Pesos fuertes (`font-bold` / `font-black`).
- **Secondary Font (Data & Specs):** Tipografía monoespaciada para precios (especialmente tachados), SKUs y dimensiones. Añade la sensación de "precisión técnica B2B".
- **Alignment:** Todo el texto crítico debajo del producto (Marca, Título, Precio "Desde") va estrictamente **alineado a la izquierda**. Cero asimetrías.

### Spacing & Layout Foundation
**Estrategia:** Estructura modular y rítmica.
- **Grillas Uniformes:** 4 columnas en Desktop, 2 en Móvil. Cajas estructuradas para cada producto para fácil escaneo.
- **UI Curada (No-Genérica):**
    - Sombras utilizadas de forma muy táctica y sutil, solo para elevar elementos críticos (como el Drawer o modales).
    - Radios de borde (`border-radius`) pequeños a medianos para suavizar la interfaz (ej. botones que invitan al clic, sin verse como cajas de sistema operativo antiguo).
    - Evitar completamente el "glassmorphism" en favor de opacidades sólidas para la legibilidad B2B.
- **Fichas de Producto (PDP) Split-Screen:** Layout rígido: Izquierda galería visual inmensa; derecha información densa B2B con un CTA de "Añadir al carrito" rectangular, negro sólido y contundente.

## Design Direction Decision

### Design Directions Explored
1. **Pure Brutalism (Retail Focus):** Minimalismo extremo, imágenes inmensas centradas en cajas secas. Descartado por ser demasiado hostil para la densidad de datos B2B.
2. **B2B Efficiency First:** Listado de alta densidad priorizando SKU y precios mayoristas interactivos. Descartado por alienar al comprador Retail aspiracional.
3. **Hybrid Luxe (PDP + Drawer):** Ficha de producto "Split-Screen" (galería inmersiva a la izquierda, información táctica B2B a la derecha) conectada a un "Slide-Over Cart" que revela descuentos dinámicamente.

### Chosen Direction
**Direction 3: Hybrid Luxe (Modified to "Modern Luxe")**

### Design Rationale
Se seleccionó la arquitectura de la Dirección 3, pero el equipo y los stakeholders decidieron suavizar la estética cruda del "Brutalismo" puro hacia un estilo **"Modern Luxe"**. Esto significa reintroducir sombras tácticas (`shadow-soft`) para elevar elementos clave (como el Drawer), usar bordes redondeados sutiles (`rounded-xl` a `rounded-2xl`) para hacer la interfaz más accesible, y utilizar una paleta de colores menos agresiva (Off-white con detalles gris cálido), manteniendo el alto contraste solo para las acciones transaccionales puras.

### Implementation Approach
- Aplicar la arquitectura Split-Screen para las páginas de detalle de producto (PDP).
- Implementar el patrón "Active Coupon Ledger" en el Slide-Over Cart usando Server Components de Next.js para pre-calcular descuentos por volumen B2B de forma nativa.
- Configurar el tema de Shadcn UI de forma paramétrica para soportar esquinas redondeadas amigables y sombras suaves para profundidad.

## User Journey Flows

### Journey 1: El Constructor B2B (Marcelo) - Eficiencia y Transacción Rápida

Marcelo entra desde su móvil en la obra. Su prioridad es encontrar un producto técnico específico, validar stock real y aplicar su beneficio de cliente frecuente (B2B) para realizar el pedido de volumen sin demoras ni fricciones visuales innecesarias.

```mermaid
flowchart TD
    A[Inicio: Aterriza en Home Mobile] --> B[Buscador Inteligente]
    B -->|Busca SKU o término exacto| C{Resultados (Autocompletado)}
    C -->|Clic en resultado directo| D[Ficha de Producto PDP]
    
    D --> E[Revisar Specs: Rendimiento/Peso]
    D --> F[Validar Stock en Tiempo Real]
    
    E & F --> G{Decisión de Compra}
    
    G -->|Agregar 20 cajas| H[Abre Slide-Over Cart]
    
    H --> I{Active Coupon Ledger}
    I -->|Detecta usuario B2B o volumen| J[Aplica Descuento Táctico -20%]
    I -->|Usuario ingresa código manual| K[Valida Código]
    
    J & K --> L[Muestra Subtotal, Ahorro y Envío]
    
    L --> M[Ir a Pagar CTA]
    M --> N[Redirección Segura a Shopify Checkout]
    N --> O[Pago Completado: Marcelo vuelve al trabajo]
```

### Journey 2: El Comprador Retail "Aspiracional" (Lucía) - Descubrimiento y Confianza

Lucía llega a la web buscando inspiración y diseño para su hogar. Se sorprende con la estética "Modern Luxe" pero le preocupa el precio y el envío. Su flujo depende de la navegación visual y el descubrimiento de oportunidades (cupones).

```mermaid
flowchart TD
    A[Inicio: Clic en Anuncio de Instagram] --> B[Aterriza en Home / Categoría]
    B --> C[Exploración Visual (UX Split-Screen / Galerías)]
    
    C --> D{Interés en Producto}
    D -->|Clic en Imagen| E[Ficha de Producto PDP]
    
    E --> F[Inmersión en Galería Fotográfica Alta Res.]
    E --> G[Descubre Banner Nativo (Ej: Envío Gratis en Decoración)]
    
    F & G --> H{Decisión de Compra}
    
    H -->|Agregar 1 unidad| I[Abre Slide-Over Cart]
    
    I --> J[Revisa Producto y Costo de Envío pre-calculado]
    J --> K[Ingresa Cupón Descubierto (HOME20)]
    
    K --> L[Animación Spring: Precio Tachado y Ahorro Resaltado en Color Acento]
    
    L --> M[Ir a Pagar CTA]
    M --> N[Redirección a Shopify Checkout]
    N --> O[Pago Completado: Lucía siente que hizo una compra inteligente]
```

### Journey Patterns

Across these flows, I'm seeing some common patterns we can standardize:

**Navigation Patterns:**
- **Search-First vs. Browse-First:** Marcelo (B2B) entra directamente por el buscador (Search-First). Lucía (Retail) entra por navegación de categorías visuales (Browse-First). La UI debe soportar ambos sin fricción.
- **Persistent Slide-Over Cart:** El carrito nunca redirige a una URL `/cart`. Siempre se superpone (Slide-Over) para no romper el contexto ni la inmersión de ninguno de los dos usuarios.

**Decision Patterns:**
- **Stock Assurance Trigger:** La decisión de Marcelo se gatilla por el indicador semántico de "Stock Inmediato".
- **Tactical Discount Trigger:** La decisión de Lucía se consolida al momento de ver el descuento aplicado visualmente en el carrito, aliviando la ansiedad del "sobreprecio".

**Feedback Patterns:**
- **Active Coupon Ledger Feedback:** Transformamos la carga cognitiva ("¿tendré un cupón?") en Delight ("¡El sistema me dio un descuento!").
- **Handoff sin sorpresas:** El paso de Next.js a Shopify es reportado en el Slide-Over diciendo "Checkout Seguro", reduciendo el abandono de carrito.

### Flow Optimization Principles

- **Zero Dead-Ends (Edge Case de Stock):** Si un producto se agota durante el checkout (Journey 3), el usuario nunca ve una pantalla genérica de error. Se le devuelve al Drawer con opciones de "Productos Similares con el mismo rendimiento m2".
- **Progressive Disclosure B2B:** En móvil, priorizamos la imagen grande primero. Con un sutil scroll down exponemos la grilla técnica densa (peso, medidas), manteniendo la estética "Modern Luxe" pero salvando al usuario B2B de clics extra en acordeones.
- **One-Tap Apply:** Los cupones sugeridos en el Drawer del carrito se aplican con un solo toque (Tap), eliminando el molesto copy-paste de códigos en dispositivos móviles.

## Component Strategy

### Design System Components

Based on our chosen design system (Shadcn UI + Tailwind CSS v4 + Framer Motion) and our "Modern Luxe" design direction, we will leverage the following foundation components directly, tweaking only `--radius` (0.25rem - 0.5rem) and colors:

- **Button:** Foundation for all CTAs (Add to Cart, Checkout).
- **Sheet (Drawer):** The core mechanical component for our "Slide-Over Cart".
- **Input & Form:** For search bars and checkout fields.
- **Badge:** For semantic tags like "Top Seller B2B" o "Nuevo".
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

## UX Consistency Patterns

### Button Hierarchy

**Uso de Botones Shadcn UI personalizados (sin hardcodear colores)**

- **Primary Action (Añadir al Carrito / Pagar):**
  - *Visual:* Fondo sólido oscuro (`bg-foreground`), texto claro (`text-background`). Sin bordes redondeados excesivos (`rounded-md` máximo) para mantener la rigidez B2B. Textura mate (sin gradientes).
  - *Behavior:* Hover state sutil bajando la opacidad (`hover:opacity-90`) o elevándose milimétricamente. Nunca cambiar el tamaño del botón al hacer hover.
- **Secondary Action (Filtros / Continuar Comprando):**
  - *Visual:* Fondo claro/Beige (`bg-muted`), texto oscuro (`text-foreground`). Borde sutil opcional (`border border-input`).
  - *Behavior:* Hover state invirtiendo colores sutilmente o oscureciendo el fondo (`hover:bg-accent/10`).
- **Tactical/Accent Action (Aplicar Cupón):**
  - *Visual:* Uso exclusivo del color Naranja Industrial (`bg-accent` / `#FF4D00`).
  - *Behavior:* Se activa con animaciones "Spring" de Framer Motion al lograr descuentos.

### Feedback Patterns

**El silencio visual es lujo; el ruido es ansiedad.**

- **Success (Stock in-stock / Cupón Aplicado):**
  - *Visual:* Semántica visual discreta (un simple punto verde o texto en el color de acento). Evitar grandes banners verdes genéricos.
  - *Behavior:* Transición inmediata usando Framer Motion (`layoutId` animations) para que el elemento se actualice en su lugar sin recargar ni hacer flash.
- **Errors/Warnings:**
  - *Visual:* Borde inferior rojo sutil (`border-b-destructive`). Texto de error debajo del input en fuente mono-espaciada pequeña.
  - *Behavior:* Validación en tiempo real (Client-side) para inputs cortos: "shake" animation leve si se intenta enviar un formulario de checkout sin datos vitales.

### Form Patterns

**Inputs para campos de alta fricción (Checkout / Búsqueda B2B).**

- **Visual Design:** Cajas amplias, bien delineadas. Fondo ligeramente diferenciado (`bg-secondary/50`) sobre el fondo Off-white. Tipografía grande para inputs (mínimo `text-lg` en móviles) para evitar zooms no deseados en iOS.
- **Behavior (Buscador):** Autocompletado instantáneo (0 fricciones). Tolera errores de tipeo y no requiere apretar un botón "Buscar" (se despliegan los resultados al teclear).
- **Behavior (Checkout):** Agrupación lógica en bloques (Envío, Pago) separando visualmente los pasos sin crear acordeones complejos.

### Navigation Patterns

**Interacciones tácticas sin recargas completas.**

- **Desktop (Split-Screen / Galerías):** Navegación lateral sutil, menú superior fijo, minimalista, fondo sólido cuando hay scroll.
- **Mobile (Gestos Primeros):**
  - *Drawers (Sheets):* Usar Sheets para el Carrito y para los Filtros. Esto mantiene al usuario B2B/Retail siempre anclado en la página actual.
  - *Sticky Buy Bar:* En las Fichas de Producto, el CTA "Añadir al Carrito" se fija abajo apenas el usuario hace scroll pasando la primera foto.

### Additional Patterns

**Zero Dead-Ends.**

- **Loading States (Skeletons):** En lugar de "spinners" (loops de carga infinitos), mostramos `Skeleton` components que mimetizan exactamente la forma final del contenido (especialmente útil para la grilla B2B mientras Shopify responde).
- **Empty Cart/Search:** Mantener la estética premium. En lugar de decir "No hay productos", presentar una cuadrícula de "Descubrir Categorías" o "Lo más pedido en Obra".

## Responsive Design & Accessibility

### Responsive Strategy
**Mobile-First Estricto.**
- **Mobile (Constructores en Obra):** Pantallas diseñadas para uso visual rápido y "Thumb-zone" (zona del pulgar). CTAs grandes, navegación con un dedo, "Sticky Buy Bar". Prioriza rendimiento LCP (Largest Contentful Paint) extremo.
- **Desktop (Retail/Oficina):** Aprovechar el espacio extra para la arquitectura "Split-Screen" (imágenes inmersivas a la izquierda, especificaciones tácticas B2B y checkout rápido a la derecha).
- **Tablet:** Vistas híbridas. Menú lateral fijo, grillas de productos expandidas a 3 columnas.

### Breakpoint Strategy
Utilizaremos los breakpoints súper optimizados por defecto de **Tailwind CSS v4**:
- `sm` (640px) - Móviles grandes y phablets.
- `md` (768px) - Tablets portrait. Aquí la tarjeta de producto pasa de "Stacked" a "Split-Screen".
- `lg` (1024px) - Tablets landscape y laptops pequeñas.
- `xl` (1280px) - Escritorios modernos. Máximo ancho del contenedor (max-w-7xl) para no distorsionar las fotografías.

### Accessibility Strategy
**Compliance Goal: WCAG 2.1 Level AA**
Dado que CompraHogar apunta también al sector B2B (posibles compras corporativas o gubernamentales), la accesibilidad no es opcional.
- **Color Contrast:** Mantenemos la paleta "Modern Luxe" de Alto Contraste (Fondo `#FCFBF7` vs Texto `#121212`). Relación de contraste 14:1+, superando cómodamente el 4.5:1 requerido.
- **Focus Indicators:** Todos los elementos interactivos o inputs tendrán un anillo de enfoque (focus-ring) claro, sin ser invasivo.
- **Touch Targets:** Siguiendo la ley de Fitts, ningún botón táctico (como agregar al carrito) será menor a `44x44px`.

### Testing Strategy
- **Performance/A11y:** CI/CD integrado con *Lighthouse* (meta: 95+ en Accesibilidad y Performance).
- **Manual Testing:** Pruebas nativas con VoiceOver (iOS) y navegación 100% por teclado en Desktop (vital para el usuario B2B que entra datos en Excel y la web al mismo tiempo).

### Implementation Guidelines
- **Accesibilidad Base:** Utilizar exclusivamente las primitivas de Radix UI (a través de Shadcn UI) ya que garantizan atributos WAI-ARIA, manejo de foco y soporte de teclado pre-construido. Evitar recrear modales o drawers desde cero.
- **Tamaños de Fuente Relativos:** Evitar tamaños de fuente en `px`. Todo debe usar `rem` a través de las clases de Tailwind (`text-base`, `text-lg`) para respetar las preferencias de zoom del sistema operativo.
- **Regla Estricta de Contraste (Naranja Industrial):** Auditar que el uso del color de acento `#FF4D00` apruebe WCAG AA definiendo su contraste obligatorio con el color del texto. Nunca usar texto blanco sobre naranja a menos que tenga una sombra o grosor que garantice legibilidad (idealmente, mantener texto oscuro o fondo oscuro cuando se usa el Naranja).
- **Regla Estricta de LCP en Imágenes:** Exigir `alt=""` descriptivo en todas las fotografías "Hero" de lifestyle. Además, se debe exigir el uso del atributo `priority={true}` de `next/image` explícitamente en la primera imagen del producto (LCP) para asegurar que la página cargue en móviles por debajo de los 2.5s.

