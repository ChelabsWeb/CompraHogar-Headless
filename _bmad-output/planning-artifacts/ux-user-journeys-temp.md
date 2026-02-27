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
