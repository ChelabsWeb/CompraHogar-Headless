# Prompts Nano Banana 2 — bubbles de categorías con hover animation

14 imágenes (7 categorías × 2 estados) para las bubbles de la home.
El hover hace crossfade entre "estado 1" (default) y "estado 2" (activado).

---

## Flujo recomendado en Nano Banana

1. **Primera pasada — todas las "estado 1"**
   Generá las 7 imágenes base en orden. Cada prompt arranca con el mismo
   párrafo de **estilo base** (al principio del doc), así las 7 quedan
   cohesivas entre sí cuando se muestran juntas.

2. **Segunda pasada — todas las "estado 2"**
   Para cada categoría, en Nano Banana adjuntá la imagen de "estado 1"
   correspondiente **como referencia** (la opción "use as reference" / "edit
   image") y pegá el prompt de "estado 2". Esto asegura que el objeto, el
   ángulo y el encuadre permanezcan idénticos — solo cambia el "estado" del
   objeto (encendido/prendido/abierto/etc).

3. **Descargar en 1024×1024 o más**, luego comprimir a <60KB con TinyPNG
   antes de commitear.

---

## Specs técnicas

| Propiedad | Valor |
|---|---|
| Aspect ratio | **1:1** (cuadrado) |
| Resolución objetivo | **1024×1024** (comprimir luego) |
| Formato | `.png` con transparencia limpia o fondo blanco puro |
| Peso objetivo | **<60 KB** por imagen después de compresión |
| Carpeta destino | `/public/categories/` |

### Naming

Cada categoría usa dos archivos:
- `{handle}-off.png` — estado default
- `{handle}-on.png` — estado hover (activado)

Ejemplos: `electricidad-off.png` / `electricidad-on.png`.

---

## Estilo base — pegar al inicio de TODOS los prompts

Copy esta parte una sola vez y usala como prefijo obligatorio en cada prompt.
Garantiza que las 7 categorías se sientan del mismo set:

```
Clean minimalist 3D product illustration with soft photorealistic rendering, single iconic object centered on pure white background, subtle soft shadow beneath, warm ambient lighting, muted color palette with brand accents of teal (#21645d) and warm orange (#f3843e), square 1:1 composition, high-end commercial rendering style, no text, no logos, no people, no watermark
```

---

## Negative prompt (opcional pero recomendado)

```
flat illustration, cartoon, anime, childish, cluttered, busy background, text, watermark, logo, low quality, blurry, people, hands, faces
```

---

## Las 7 categorías

### 1. Obra gruesa 🏗️
`obra-gruesa-off.png` / `obra-gruesa-on.png`

**Off — pila estática:**
```
[ESTILO BASE ARRIBA] A small neat stack of four light gray concrete blocks arranged carefully on the floor, one single steel rebar rod leaning against them on the right, everything static and untouched, isolated product photography feel, subtle warm orange highlight on the edges of the blocks, white background, centered 1:1 composition
```

**On — la obra empieza:**
*(usar la imagen "off" como referencia)*
```
Same exact concrete blocks and rebar from the reference image, same angle and framing, but now a small pile of fresh wet cement mix appears at the base with a steel trowel placed on top, a couple of subtle floating dust particles suggesting recent activity, warm orange accent slightly stronger on the tools, white background, minimal composition
```

---

### 2. Herramientas 🛠️
`herramientas-off.png` / `herramientas-on.png`

**Off — taladro apagado:**
```
[ESTILO BASE] A single modern cordless power drill in black and teal color resting on its side, battery attached, drill bit pointing right, completely still and powered off, isolated centered composition, soft shadow beneath, white background, 1:1 square, no wood shavings
```

**On — taladro encendido:**
*(ref: imagen off)*
```
Same exact cordless drill from the reference image, same angle and framing, but now the drill is tilted forward mid-use, a tiny subtle glowing light on the LED trigger button, very fine wood shavings flying out near the bit, subtle orange motion lines suggesting spinning, white background, dynamic but minimal
```

---

### 3. Electricidad ⚡
`electricidad-off.png` / `electricidad-on.png`

**Off — lámpara apagada:**
```
[ESTILO BASE] A single modern matte black pendant lamp with a clear glass bulb hanging from a short cord, the bulb cold and unlit, completely still, centered 1:1 composition, soft shadow beneath the lamp area, white background, minimalist design object feel
```

**On — lámpara prendida:**
*(ref: imagen off)*
```
Same exact pendant lamp from the reference image, same angle and framing, but now the bulb glows with a warm soft orange light, a subtle radial glow around the bulb, the surrounding white background faintly tinted warm by the light, soft bloom effect, inviting cozy feel
```

---

### 4. Sanitaria 🚿
`sanitaria-off.png` / `sanitaria-on.png`

**Off — grifo cerrado:**
```
[ESTILO BASE] A single modern brushed matte chrome wall-mounted faucet, closed and dry, centered 1:1 composition, soft shadow, white background, luxurious minimalist product look, no water, no sink visible just the faucet
```

**On — grifo abriendo:**
*(ref: imagen off)*
```
Same exact faucet from the reference image, same angle and framing, but now a thin controlled stream of crystal-clear water flows out of the spout downward, a few small water droplets suspended mid-air, subtle water reflection beneath the stream, teal-tinted water, calm and refreshing feel, white background
```

---

### 5. Pinturas 🎨
`pinturas-off.png` / `pinturas-on.png`

**Off — lata cerrada:**
```
[ESTILO BASE] A single cylindrical metal paint can with a clean label area (blank, no text) sealed closed, a flat painter's brush with wooden handle resting horizontally next to it on the left, dry brush bristles, centered 1:1 composition, white background, clean product arrangement
```

**On — pintura usada:**
*(ref: imagen off)*
```
Same exact paint can and brush from the reference image, same angle and framing, but now the paint can lid is open and tilted, the brush is dipped and lifting with a fresh drip of teal-colored paint falling from the bristles, a small fresh teal paint stroke visible on the floor beside, vivid splash of color as the only color element, white background
```

---

### 6. Decoración 🛋️
`decoracion-off.png` / `decoracion-on.png`

**Off — sofá vacío:**
```
[ESTILO BASE] A single compact modern two-seat fabric sofa in warm gray upholstery, completely empty, no cushions, no throw, no decorations, isolated centered 1:1 composition, soft shadow underneath, white background, neutral and unstyled
```

**On — sofá decorado:**
*(ref: imagen off)*
```
Same exact sofa from the reference image, same angle and framing, but now two small decorative cushions appear on the sofa (one warm orange and one teal), a folded beige throw draped casually over the armrest, a small round side table with a warm glowing tiny lamp has appeared to the right, warm cozy living-room feel, white background
```

---

### 7. Servicios 🔧
`servicios-off.png` / `servicios-on.png`

**Off — equipo guardado:**
```
[ESTILO BASE] A single compact cement mixer / concrete mixer appliance standing still, drum empty, unplugged, completely stationary, centered 1:1 composition, soft shadow underneath, white background, industrial but clean product photography
```

**On — equipo funcionando:**
*(ref: imagen off)*
```
Same exact cement mixer from the reference image, same angle and framing, but now the drum is slightly rotating (convey with subtle motion blur on the drum only), a small amount of fresh cement visible tumbling inside the drum opening, subtle orange glow suggesting power is on, a tiny cloud of dust at the base, dynamic but minimal, white background
```

---

## Cómo lo integro en el código cuando las tengas

Cuando tengas las 14 imágenes en `/public/categories/`, actualizo
`CategoryShortcuts.tsx` para soportar el hover animation. La estructura
queda así:

```tsx
// Default → opacity-100 group-hover:opacity-0
// Hover   → opacity-0   group-hover:opacity-100
// Crossfade con transition-opacity duration-300
```

Además, para que no haya flash al primer hover, preload las 7 imágenes "on"
con `rel="preload"` en el layout, o usás `next/image` con `priority` en las
primeras.

---

## Checklist

- [ ] 7 imágenes `*-off.png` generadas con el estilo base aplicado
- [ ] 7 imágenes `*-on.png` generadas usando la off como referencia
- [ ] Todas pasadas por TinyPNG (<60KB cada una)
- [ ] Subidas a `/public/categories/`
- [ ] Avisarme y yo hago el switch en `MAIN_CATEGORIES` + `CategoryShortcuts`
      (de emoji → imágenes con hover animation)
