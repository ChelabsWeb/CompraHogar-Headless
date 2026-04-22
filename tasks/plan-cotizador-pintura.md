# Plan — Cotizador de Pintura

_Fecha: 2026-04-14_

## Objetivo
Página standalone donde el usuario ingresa dimensiones del ambiente a pintar y ve una lista de productos de pintura con litros y cantidad de envases calculados automáticamente, listos para agregar al carrito.

## Ruta
`/cotizador/pintura`

## Inputs del formulario
- **Ancho (m)** — del ambiente
- **Largo (m)** — del ambiente
- **Alto (m)** — default 2.5
- **Tipo de pintura**: Interior / Exterior (radio) — default Interior
- **Manos**: 1, 2, 3 (select) — default 2
- **Aberturas**: Ninguna / Pocas (10%) / Muchas (20%) — default Pocas

## Fórmula
```
m² pared = (ancho + largo) × 2 × alto
m² efectivos = m² pared × (1 - descuento_aberturas)
litros necesarios = m² efectivos × manos / rendimiento_producto
```

Redondeo: ceil al siguiente litro.

## Data source
- Collection `pinturas-de-interior` o `pinturas-de-exterior` (según tipo elegido)
- Metafield `custom.rendimiento` (ya existe en el schema)
- Si el producto no tiene rendimiento cargado, se asume default de 10 m²/L (estándar pintura látex) y se indica visualmente

## Output UI
- Lista de productos en grid 1 col mobile / 2-3 cols desktop
- Cada card muestra:
  - Imagen
  - Título
  - Rendimiento declarado
  - **Litros necesarios** (grande, destacado)
  - Precio unitario + subtotal estimado
  - Botón "Agregar al carrito" con la cantidad calculada

## Detalles de cantidad al carrito
- El producto puede ser vendido por unidad (envase de 1L, 4L, 10L, 20L)
- Sin metafield de tamaño de envase → parseo best-effort del título con regex `/(\d+(?:[.,]\d+)?)\s*L\b/i`
- Si no se encuentra, asume 4L (estándar Uruguay)
- `cantidad envases = ceil(litros_necesarios / tamaño_envase)`

## Archivos

**Crear:**
- `src/app/cotizador/pintura/page.tsx` — página client component con form + fetch + results

**Modificar:** ninguno

## Criterios de verificación
1. Cargar `/cotizador/pintura` → form visible con defaults
2. Ingresar 4×5×2.5 m, Interior, 2 manos, pocas aberturas → calcula ~40.5 m² efectivos
3. Lista productos con "Necesitás X L → N envases"
4. "Agregar al carrito" agrega N unidades al cart
5. Cambiar tipo a Exterior → refetch de collection exterior
6. Build limpio

## Fuera de scope
- Otras categorías (sanitaria, eléctrica, obra gruesa)
- PDF descargable
- Guardar cotización en cuenta
- Comparación lado a lado (ya existe `/comparar`)
