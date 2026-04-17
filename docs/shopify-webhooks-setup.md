# Configuración de Webhooks de Shopify — CompraHogar

Esta guía explica cómo conectar Shopify con el Next.js headless para que los cambios en el admin (productos, colecciones, inventario, pedidos) se reflejen al instante en la tienda, sin esperar rebuild.

## Contexto técnico

- Next.js cachea las respuestas de Shopify Storefront API (`force-cache` por default).
- El handler `src/app/api/webhooks/route.ts` recibe los webhooks de Shopify, valida la firma HMAC y ejecuta `revalidateTag()` para invalidar el caché de Next.js.
- Todos los fetches de productos/colecciones ahora tienen `tags` asociados (`products`, `collections`, `collection:<handle>`, `product:<handle>`) para que la invalidación funcione correctamente.

---

## Paso 1 — Llegar a la sección de Webhooks

1. Entrá al **Panel de Shopify**
2. Menú lateral → **Configuración** (⚙️ abajo a la izquierda)
3. **Notificaciones**
4. Bajá hasta el final de la página → sección **Webhooks**

---

## Paso 2 — Crear los 6 webhooks

Para cada uno: click en **Crear webhook** → completar los campos → **Guardar**.

Todos comparten los mismos valores:

- **Formato:** `JSON`
- **URL:** `https://www.comprahogar.com.uy/api/webhooks`
- **Versión de la API del webhook:** la que Shopify sugiera por defecto (la más reciente estable)

### Lista de webhooks a crear

| # | Evento (como aparece en Shopify en español) | Topic técnico | Para qué sirve |
|---|---|---|---|
| 1 | Creación de producto | `products/create` | Cuando creás un producto nuevo aparece al toque en colecciones, home y búsqueda |
| 2 | Actualización de producto | `products/update` | Cambios de precio, imagen, título, stock o handle → se reflejan en segundos |
| 3 | Eliminación de producto | `products/delete` | Si borrás un producto, desaparece del sitio |
| 4 | Creación de colección | `collections/create` | Colección nueva aparece en el nav del header y en `/collections` |
| 5 | Actualización de colección | `collections/update` | Cambios de título, imagen o productos asignados → se refrescan |
| 6 | Eliminación de colección | `collections/delete` | Colección borrada desaparece del nav |

> **Tip:** si no ves los nombres exactos, buscá por palabra clave: "producto", "colección", "creación", "actualización", "eliminación".

---

## Paso 3 — Configurar el secreto del webhook en Vercel

**Sin este paso**, los webhooks llegan al servidor pero el handler responde **401 No autorizado** y nada se invalida.

1. En el panel de Shopify, debajo de la lista de webhooks hay un cartel que dice algo como:
   > Todos tus webhooks se firmarán con `abc123xxxxxxxxxxxxx` para que puedas verificar su integridad.
2. **Copiá ese token.**
3. Entrá a **Vercel** → tu proyecto **comprahogar-headless** → **Settings** → **Environment Variables**
4. Si ya existe `SHOPIFY_WEBHOOK_SECRET`, editalo y pegá el nuevo valor. Si no existe, creá uno nuevo:
   - **Nombre:** `SHOPIFY_WEBHOOK_SECRET`
   - **Valor:** (el token que copiaste de Shopify)
   - **Entornos:** marcá **Production**, **Preview** y **Development**
5. **Guardar**
6. **IMPORTANTE:** hacer un redeploy manual. Vercel → **Deployments** → último deployment → botón `…` → **Redeploy**. Sin redeploy, la nueva variable de entorno no toma efecto.

---

## Paso 4 — Verificar que funciona

### Opción A — Test directo desde Shopify (rápido, 30 seg)

En cada webhook creado:
1. Click en el webhook → botón **Enviar notificación de prueba**
2. Esperá la respuesta:

| Código | Qué significa | Qué hacer |
|---|---|---|
| `200` | ✅ Todo OK, el handler recibió y procesó el webhook | Nada, está andando |
| `401` | ❌ La firma HMAC no coincide | Revisá `SHOPIFY_WEBHOOK_SECRET` en Vercel y redeploy |
| `404` | ❌ URL mal escrita | Verificá que la URL termine en `/api/webhooks` |
| `500` | ❌ Error interno | Revisá los logs de Vercel → Runtime Logs |

### Opción B — Test real (recomendado)

1. En el panel de Shopify → Productos → editá un producto existente
2. Cambiá el título levemente (agregale un espacio o un carácter) → **Guardar**
3. Abrí la página de la colección que contiene ese producto en `https://www.comprahogar.com.uy/collections/<handle>`
4. Recargá la página (Ctrl+F5) — el título nuevo debería aparecer en menos de 10 segundos
5. Si aparece → 🎉 todo funciona. Si no aparece → revisá los logs.

### Opción C — Mirar los logs de Vercel

Vercel → tu proyecto → **Logs** → filtrar por `[Webhook]`

Deberías ver líneas como:
```
[Webhook] Order event: orders/create for order 123 from comprahogaruy.myshopify.com
```

O simplemente nada, lo cual también está bien si no hubo cambios en Shopify.

---

## Solución de problemas

**"Creé todo, mandé la notificación de prueba y recibo 200, pero igual no aparecen los productos nuevos"**
→ Verificá que el producto esté publicado en el canal correcto (Producto → Canales de venta y apps → que el canal Headless / Tienda Online esté tildado).

**"Los productos aparecen pero tarda mucho"**
→ Puede ser caché del service worker del navegador. Forzá `Ctrl+Shift+R` o probá en ventana incógnita. En mobile (Android/iOS), si hace falta, abrí devtools y "unregister" del SW para testear.

**"La notificación de prueba responde 401"**
→ El secreto no coincide. Opciones:
1. Copiá nuevamente el secreto desde Shopify y actualizalo en Vercel.
2. Verificá que hiciste **redeploy** después de cambiar la variable de entorno.
3. Verificá que `SHOPIFY_WEBHOOK_SECRET` existe en el entorno **Production** (no solo en Development).

**"La prueba responde 404"**
→ La URL está mal. Debería ser exactamente `https://www.comprahogar.com.uy/api/webhooks` (fijate en `/api/webhooks` al final, sin barra al final).

**"No encuentro la sección Webhooks en el panel de Shopify"**
→ Configuración → Notificaciones → bajá hasta el fondo de la página. Si aún no aparece, puede que tu plan no lo incluya (poco probable) o que tu rol de usuario no tenga permiso (pedile al owner).

---

## Webhooks que NO hacen falta (ignorar o borrar)

- **Activación de cliente** (`customers/enable`) → no invalida nada útil en nuestro setup. Si ya lo tenías creado, borralo para no desperdiciar requests.
- Cualquier otro topic que ofrezca Shopify → solo necesitás los 6 de arriba.

---

## Qué hacer cuando cambies el dominio

Si en el futuro cambiás el dominio (ej: de `comprahogar.com.uy` a `comprahogar.com`), tenés que:
1. Editar cada uno de los 6 webhooks en el panel de Shopify → cambiar la URL al nuevo dominio.
2. Si el secreto de Shopify cambió (raro, pero puede pasar), actualizar `SHOPIFY_WEBHOOK_SECRET` en Vercel y redeploy.
