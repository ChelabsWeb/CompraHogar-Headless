# Brief de Assets — Generaciones Higgsfield

Este doc lista **todas las imágenes que el sitio usa actualmente** y que hay que regenerar con Higgsfield para dejar de depender de Unsplash genérico y unificar la estética visual.

---

## Brand guidelines (usar en todas las generaciones)

- **Paleta**: Teal `#21645d` (primary) y Naranja `#f3843e` (secondary) como acentos posibles. Blanco/gris claro como base.
- **Estilo**: Moderno, limpio, cinematográfico. Luz natural suave. Sin sobresaturación. Nada de stock-photo cliché.
- **Tono**: Profesional pero cercano, urbano uruguayo. Productos reales usándose o presentados con cuidado. Evitar modelos posando genéricos.
- **Negocio**: Ferretería online con construcción, herramientas, sanitaria, electricidad, pinturas, decoración.
- **Audiencia**: Uruguayos (cuidado con símbolos argentinos/españoles). Mix entre profesionales de obra y dueños de casa haciendo mejoras.
- **Composición**: Space for overlays — la mayoría se muestran con text overlay o badges, así que dejar zonas "limpias" (usualmente lado izquierdo) donde el texto no compita con elementos visuales.

### Suffix universal recomendado para todos los prompts
> *"...cinematic photography, natural soft lighting, muted color grading with subtle teal and warm orange accents, clean composition with negative space on the left third, 8k, photorealistic, Canon EOS R5, shot with 35mm lens, shallow depth of field, Uruguay setting"*

---

## 1. Hero Carousel — `src/components/home/HeroCarousel.tsx`

4 slides full-width del home. El slide 1 (`hero-uruguay.jpg`) ya existe — los otros 3 usan Unsplash genérico.

**Specs comunes:**
- Dimensiones: `1920 × 1080` (16:9) — cubre desktop y mobile con overlay gradient oscuro
- Formato: `.jpg` optimizado (q=85)
- Peso objetivo: <400 KB (comprimir con TinyPNG o similar antes de subir)
- Carpeta destino: `/public/hero-*.jpg`

| # | Archivo | Slide actual | Prompt sugerido | Priority |
|---|---|---|---|---|
| 1 | `hero-uruguay.jpg` | "Creado por uruguayos, para uruguayos" | *Panoramic view of Montevideo's skyline at golden hour from La Rambla, Palacio Salvo visible, warm orange sky fading to teal dusk, wide cinematic composition, space on left for headline text overlay* | ⚠️ Ya existe — regenerar solo si no convence |
| 2 | `hero-obra.jpg` | "Nueva Temporada Obra 2026" | *Uruguayan construction site at dawn, fresh concrete blocks and rebar stacked neatly, worker in safety gear walking away, morning mist, dramatic diagonal light, rich earth tones, space on left third for text overlay* | 🔴 ALTA |
| 3 | `hero-alquileres.jpg` | "Alquilá Equipos" | *Close-up of a cement mixer and scaffolding stacked against a sunlit wall in a Montevideo construction yard, shallow depth of field, cinematic lighting, space on left for headline* | 🔴 ALTA |
| 4 | `hero-renovacion.jpg` | "Renovación Total" | *Modern Uruguayan home interior mid-renovation, freshly painted teal accent wall, a roll of paint, a ladder, brass modern faucet on a marble vanity in background, natural afternoon light, warm and inviting, clean composition with left-side negative space* | 🔴 ALTA |

---

## 2. Promos Banners — `src/app/page.tsx` (SECTION: Promos)

3 cards promocionales en grid/carousel. Dos comparten archivo con otros lados — si los regenerás, afectarás también los banners de las CollectionShowcase (punto 3 de abajo).

**Specs:**
- Dimensiones: `800 × 600` (4:3) para mobile — versión `1200 × 900` para desktop si querés nitidez extra
- Formato: `.jpg` o `.webp`
- Peso: <200 KB
- Carpeta destino: `/public/promo-*.jpg`

> ⚠️ **Archivos actuales**: `/public/hero-1.png` y `/public/hero-2.png` se usan TANTO en promos COMO en CollectionShowcase banners. Decisión: renombrar al regenerar para que sean archivos distintos por uso. Propongo `promo-griferia.jpg`, `promo-taladros.jpg`, `promo-iluminacion.jpg` + `showcase-herramientas.jpg`, `showcase-sanitaria.jpg`.

| # | Archivo final | Usa ahora | Texto overlay | Prompt sugerido |
|---|---|---|---|---|
| 1 | `promo-griferia.jpg` | `/hero-2.png` | "Hasta 40% OFF en grifería" | *Elegant modern brass faucet with brushed finish, running water in a slow stream, luxurious white marble sink background, steam softly rising, cinematic product photography, moody teal shadows* |
| 2 | `promo-taladros.jpg` | `/hero-1.png` | "Nuevos taladros inalámbricos" | *Professional cordless drill on a rustic wooden workbench, wood shavings and sawdust around it, warm workshop lighting, shallow depth of field, dramatic chiaroscuro, hints of steel blue and orange* |
| 3 | `promo-iluminacion.jpg` | Unsplash | "Renová tus ambientes" | *Modern pendant light fixture hanging in a warmly-lit Uruguayan living room at dusk, teal walls, wooden floor, cozy atmosphere, architectural photography* |

---

## 3. CollectionShowcase Banners — `src/app/page.tsx` (SECTION: Collection Showcases)

Banner card dentro de cada showcase. Actualmente reutilizan `hero-1.png` y `hero-2.png`.

**Specs:**
- Dimensiones: `800 × 1000` (4:5, vertical) — las cards son altas
- Formato: `.jpg`
- Peso: <200 KB
- Carpeta destino: `/public/showcase-*.jpg`

| # | Archivo | Colección | Prompt sugerido |
|---|---|---|---|
| 1 | `showcase-herramientas.jpg` | Herramientas y Maquinaria | *Collection of premium hand tools arranged on dark wooden surface, hammer / measuring tape / screwdriver set / wrench, overhead top-down flat lay, warm tungsten lighting, deep shadows, industrial aesthetic* |
| 2 | `showcase-sanitaria.jpg` | Sanitaria y Grifería | *Minimal modern bathroom corner with a matte black faucet, white subway tiles, a single folded white towel on brass rail, natural morning light from left, architectural photography, vertical framing* |
| 3 | `showcase-electricidad.jpg` | Electricidad | *Industrial cable coil and electrical components arranged artistically on concrete, safety gloves partially visible, warm amber lighting, moody composition* (no existe actualmente — crear) |

---

## 4. MegaMenu Featured Images — `src/components/layout/MegaMenu.tsx`

3 imágenes decorativas en el mega-menú de categorías (desktop).

**Specs:**
- Dimensiones: `800 × 600` (4:3)
- Formato: `.jpg`
- Peso: <150 KB
- Carpeta destino: `/public/menu-*.jpg`

| # | Archivo | Categoría asociada | Prompt sugerido |
|---|---|---|---|
| 1 | `menu-sanitaria.jpg` | Sanitaria | *Modern minimalist bathroom sink with gold faucet, soft morning light through blinds, single plant on marble counter* |
| 2 | `menu-herramientas.jpg` | Herramientas | *Carpenter's hands holding a classic wooden-handle hammer above a sheet of plywood, workshop ambiance* |
| 3 | `menu-construccion.jpg` | Construcción | *Neatly-stacked cement bags and a trowel on a construction site, late afternoon sun casting long shadows* |

---

## 5. EmptyState Mock Products — `src/components/shop/EmptyState.tsx`

4 productos mock usados cuando una búsqueda no devuelve resultados. **Opción mejor**: reemplazar por productos reales del store (query a Shopify) — pero mientras, los prompts abajo.

**Specs:**
- Dimensiones: `400 × 400` (1:1 cuadrado)
- Formato: `.jpg` o `.png` con transparencia si querés producto aislado
- Peso: <100 KB
- Carpeta destino: `/public/sample-*.jpg`

| # | Archivo | Producto | Prompt sugerido |
|---|---|---|---|
| 1 | `sample-taladro.jpg` | Taladro Dewalt 20V MAX | *Product photo of a yellow Dewalt cordless drill on clean white background, studio lighting, slight angled view, no hands* |
| 2 | `sample-herramientas.jpg` | Kit Stanley 150pc | *Open professional tool case with socket wrenches and screwdrivers neatly organized, top-down view, isolated on white* |
| 3 | `sample-hidrolavadora.jpg` | Kärcher K3 | *Yellow pressure washer Kärcher style isolated on seamless white background, product photography* |
| 4 | `sample-sierra.jpg` | Sierra circular Makita | *Circular saw with teal accent isolated on white, studio product photography, slight 3/4 angle* |

---

## 6. OG Image — Redes sociales (WhatsApp, Facebook, Twitter)

Imagen que aparece cuando alguien comparte un link del sitio en redes/chats.

**Specs:**
- Dimensiones: `1200 × 630` (1.91:1, estándar Open Graph)
- Formato: `.png` (para que el logo sea nítido)
- Peso: <300 KB
- Carpeta destino: `/public/og-default.png`

**Prompt sugerido:**
> *Flat hero composition with the CompraHogar teal-and-orange logo centered-left, a warm muted photo of Uruguayan home tools arranged on wood fading to the right side, clean negative space, 1200×630 banner format, modern e-commerce branding*

> ⚠️ Recomendación: en vez de generar con AI (que puede no renderizar logo), componer manualmente en Figma con el logo real + una foto de fondo generada.

---

## 7. Logo — `/public/logo*.png`

Logos actuales existentes:
- `logo.png` — versión principal (horizontal, full name)
- `logo2.png` — versión cuadrada o ícono (42×42 en el header mobile)
- `logocomprahogar.png` — usado en emails de Shopify

**No regenerar con Higgsfield** — los logos deben venir de un diseñador o ser vectoriales. Si querés actualizar, idealmente:
- Contratar diseño o usar un generador tipo Looka
- Exportar en SVG (vectorial) + PNG en múltiples tamaños (180, 256, 512)
- Mantener versión oscura (fondo blanco) y clara (fondo teal)

---

## 8. Placeholder de producto — `/public/placeholder.png`

Fallback cuando un producto de Shopify no tiene imagen.

**Specs:**
- Dimensiones: `600 × 600`
- Formato: `.png` con transparencia
- Peso: <50 KB

**Prompt sugerido:**
> *Minimal flat illustration of a gift-wrapped box with a small "CompraHogar" tag, teal and orange brand colors, transparent background, centered, clean line art style*

> Alternativa más simple: un SVG custom con solo el icon de package de Lucide sobre el logo de CompraHogar.

---

## Resumen priorizado para empezar

| Prioridad | Assets | Cantidad |
|---|---|---|
| 🔴 **Alta — arranca acá** | Hero carousel (slides 2-4) + Promos banners | 6 imágenes |
| 🟡 **Media** | CollectionShowcase banners + MegaMenu featured | 6 imágenes |
| 🟢 **Baja** | EmptyState mocks (mejor reemplazar por productos reales) + OG + Placeholder | 6 imágenes |

**Total aprox: 18 imágenes** (más 1 OG compuesto).

---

## Workflow sugerido una vez generado

1. Generar en Higgsfield con los prompts de arriba.
2. Descargar en máxima calidad.
3. Comprimir con [TinyPNG](https://tinypng.com) o `sharp` antes de commitear — los sitios pierden performance con imágenes de 5MB.
4. Guardar en `/public/` con los nombres propuestos.
5. Decirme qué imágenes tenés listas y yo actualizo las referencias en el código.

---

## Notas adicionales

- **Consistencia**: Si generás 18 imágenes con el mismo "estilo base" (luz, paleta, composición), el sitio se va a sentir mucho más cohesivo que con el mix actual Unsplash + stock.
- **Mobile first**: las imágenes hero se ven más en mobile con overlay oscuro. Priorizar que haya "algo visual" en el lado derecho y zona oscureable a la izquierda.
- **No AI-looking**: evitar el "estilo AI genérico" con frases como "hyperrealistic, masterpiece, 8k render". Ir por "cinematic photography, 35mm lens, natural light" que dan fotos que se sienten reales.
