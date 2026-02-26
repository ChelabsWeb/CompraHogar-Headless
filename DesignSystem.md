# Design System & Headless Architecture: Compra Hogar (Kickgame Clone)

Este documento consolida la arquitectura UX/UI desarrollada para la reconstrucción **Headless (Next.js + Shopify)** de Compra Hogar, priorizando un enfoque **Clean-Luxe Minimalista**, inspirado directamente en plataformas como Kickgame.

## 1. Patrones de Navegación & Header Estático
El componente `Header.tsx` adopta un estilo premium y estructurado.
- **Top Bar:** Barra negra sólida (`bg-black text-white`) con tipografía pequeña (`text-xs`) informando promociones clave (Envío gratis, etc).
- **Main Nav:**
  - El logo "COMPRA HOGAR" va siempre **centrado** en tipografía negra, muy pesada y geométrica.
  - La barra de búsqueda se posiciona a la izquierda, usando un fondo beige/arena (`#F2EFE7`), sin bordes fuertes.
  - Los íconos de usuario y carrito van a la derecha, limpios y delineados.
  - La navegación principal debajo de esto usa tipografía de `14px` o `15px`, `UPPERCASE` y SemiBold (`font-semibold`).
- **No Sticky:** El header fluye con el scroll (estático), enfocando la atención 100% en los productos.

## 2. Product Grid (Home Page y Colecciones)
La grilla abandona la asimetría para enfocarse en un orden casi militar, limpio y estandarizado.
- **Grilla Uniforme:** Típicamente 4 columnas en Desktop, 2 en Móvil.
- **Flat Design absoluto:** No hay sombras (`shadow-none`), ni bordes redondeados en las imágenes (`rounded-none`).
- **Cajas de Producto:** Las imágenes de los productos (con fondo removido) siempre se asientan sobre cajas con fondo gris muy claro (`#F3F3F3` o `bg-secondary` / `bg-muted`).
- **Alineación de Texto:** Todo el texto debajo del producto (Marca, Título, Precio) va estrictamente **alineado a la izquierda**. El precio puede prefijarse con "Desde ". No hay hover animations fantasiosas en el texto.

## 3. Scrollytelling & Botones UI
- **Botones:** Radican en esquinas duras o un radio de borde mínimo (máximo `4px` o `rounded-sm`). El botón primario es un bloque sólido negro (`bg-black text-white hover:bg-black/90`).
- **Fichas de Producto (PDP):** Estructura split-screen limpia. Izquierda para una galería fotográfica grande y detallada; derecha para información y el CTA de "Añadir al carrito" que es siempre rectangular y contundente.

## 4. Tipografía y Realismo Digital 2026
- **Fuente:** `Inter` o fuentes Sans geoméctricas similares estructuradas en mayúsculas (`uppercase`) para los Headings.
- **Colores (Paleta Kickgame):**
  - **Main Background:** `#FCFBF7` (Off-white/Crema) – nunca blanco puro, para dar un aspecto editorial/luxe. En Tailwind mapeado a `--background`.
  - **Texto Principal (Accents):** `#121212` (Casi negro). En Tailwind mapeado a `--foreground`.
  - **Texto Secundario:** `#444444` (Gris medio).
  - **Fondos Secundarios (Inputs/Barra de Búsqueda):** `#F2EFE7` (Beige/Arena). Mapeado a `--muted`.
  - **Cajas de producto:** `#F3F3F3`. Mapeado a `--secondary`.
- **Estética Flat:** Se eliminan *glow-effects*, bordes *glassmorphism* y gradientes translúcidos. 

---
### **Rendimiento e Integración de Datos (Shopify)**
- **Imágenes:** Las imágenes provienen del CDN de Shopify. Para cumplir con esta estética, las imágenes de producto *deberían* tener un fondo transparente en Shopify, para que el box `#F3F3F3` se luzca.
- **Componentes de Servidor:** Las llamadas GraphQL (GraphQL `shopifyFetch`) se resuelven en el **Server Component** (`page.tsx`) antes de hidratar.
