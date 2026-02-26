# Design System & Headless Architecture: Compra Hogar

Este documento consolida la arquitectura UX/UI desarrollada para la reconstrucción **Headless (Next.js + Shopify)** de Compra Hogar, priorizando un enfoque de **Minimalismo Radical**, performance excepcional ($LCP < 1.2s$), y un aspecto editorial/inmersivo.

## 1. Patrones de Navegación & Header Dinámico
El componente `Header.tsx` es el núcleo de la navegación.
- **Glassmorphism Inteligente:** Al hacer *scroll down* desaparece completamente para dar contexto a la imagen (eliminación de ruido visual).
- **Sticky Blur:** Al hacer *scroll up* suavemente, aparece con `backdrop-blur` severo (tipo iOS) y fondo apenas translúcido (`bg-black/90` simulado mediante Tailwind) para no cortar violentamente el fondo visual.
- **Mega-Menú "App-like":** Oculto detrás de un icono de hamburguesa minimalista que activa un "Drawer" (Sheet de Shadcn) abarcando la mitad de la pantalla, jerarquizando la tipografía de gran tamaño.

## 2. Product Grid (Home Page)
Refiriéndonos a estéticas como `yardsale.day`, la grilla abandona el típico "4 columnas iguales".
- **Visual First / Asimetría:** El primer producto (o producto destacado) toma `col-span-2` y `row-span-2`, volviéndose masivo.
- **Hover Transitions:** Las imágenes están recubiertas de un `black/20`. Al hacer hover en un producto, la imagen hace scale-up progresivo en 1000ms con `cubic-bezier(0.25,1,0.5,1)`, el fondo oscuro desaparece y el título flota hacia arriba con Framer Motion (micro-interacciones fluidas).

## 3. Scrollytelling Product Detail Page (PDP)
La "Ficha del Producto" (`products/[handle]`) abandona la clásica galería de carrusel en favor de una narrativa de **Scrollytelling** típica de marcas como Vessi o Apple.
- **Estructura Split-Screen:** 
  - Izquierda (60%): Una pila vertical infinita de imágenes del producto (`100svh` de alto, `sticky top-0`). Las imágenes actúan de fondo mientras el usuario scrollea, logrando un impacto brutal.
  - Derecha (40%): Contenedor Sticky. El título tipográficamente masivo, el precio y el botón de "Añadir al carrito" se mantienen siempre visibles.
- **Fricción Cero en Móvil:** Para dispositivos móviles, el botón "Add to Cart" se desmonta del flujo normal y se vuelve un modal flotante fijado en el borde inferior (`fixed bottom-0`), siempre listo para el CTA crítico.

## 4. Tipografía y Realismo Digital 2026
- **Fuente:** `Inter` (Variable Font) manipulada para extremos: muy ligera (`font-light`) para subtítulos, muy gruesa (`font-black`) para grandes reclamos de hero (`MASTERY IN MOTION`).
- **Colores:** Deep Dark Mode. El fondo no es "gris oscuro", es `bg-background` adaptado (#000000 o muy próximo, como `black/95`). Las capas se superponen usando "Glass Panels" y bordes apenas perceptibles de `white/5` (Reflejos de luz especular).
- **Realismo UI:** Uso de "glow effects" y destellos radiales (implementados como `blur-3xl bg-white/5` en posiciones asimétricas) para darle profundidad 3D a la bidimensionalidad típica del de e-commerce.

---
### **Rendimiento e Integración de Datos (Shopify)**
- **Imágenes:** El CDN de Shopify está servido a través de Next.js `<Image>`, permitiendo Carga de Imagen Prioritaria (`priority={true}`) en el LCP y carga diferida (`placeholder`, deferring) en el resto de la galería infinita, manteniendo el Core Web Vitals en la zona verde (<1.2s).
- **Componentes de Servidor:** Las llamadas GraphQL (GraphQL `shopifyFetch`) se resuelven en el **Server Component** (`page.tsx`), no hay loading spinners en la carga inicial HTML. La página escupe HTML pre-renderizado.
