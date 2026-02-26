# Arquitectura de Flujos de Usuario y Taxonomía (Compra Hogar)

Este documento define la arquitectura de interacciones, los flujos del usuario (End-to-End) y la jerarquía de colecciones para Compra Hogar. El objetivo es crear una versión superadora de Mercado Libre, combinando un catálogo extenso y categorizado con una experiencia de usuario (UX) premium, minimalista y libre de fricción.

## 1. Flujos de Interacción del Usuario (E2E User Flows)

La arquitectura de interacciones se basa en el concepto de "Navegación Fluida" y "Feedback Instantáneo".

### 1.1. Flujo de Descubrimiento (Discovery Flow)
1. **Punto de Entrada (Home/Landing):** El usuario aterriza en la Home. El Hero Muestra promociones o el concepto de marca. El Header es dinámico.
2. **Navegación por Catálogo:** El usuario abre el Mega-menú o hace scroll. El Mega-menú despliega las categorías principales y subcategorías al hacer hover (sin clics innecesarios).
3. **Página de Colección (PLP - Product Listing Page):**
    * **Filtros Laterales (Faceted Search):** Filtros dinámicos por marca, precio, especificaciones técnicas (ej. voltaje para herramientas). El filtrado actualiza la grilla de productos *instantáneamente* sin recargar la página (usando React/Next.js).
    * **Lazy Loading:** Scroll infinito o paginación "Cargar más" ultrarrápida.
    * **Vista Rápida (Quick View):** Un modal ligero al hacer hover o clic secundario sobre un producto para agregar al carrito rápidamente o ver variantes sin salir de la lista.

### 1.2. Flujo de Producto (PDP - Product Detail Page)
1. **Acceso a PDP:** El usuario hace clic en un producto desde la PLP o Home.
2. **Scrollytelling:** La galería de imágenes se explora mediante scroll vertical.
3. **Selección de Variantes:** Cambio de tamaño, color o especificaciones técnicas. Actualización inmediata de precio e imágenes usando la Storefront API de Shopify.
4. **Reseñas y Especificaciones Técnicas:** Secciones colapsables (Accordions) para mantener la vista limpia, ampliables al hacer clic.
5. **Sticky Add-to-Cart (ATC):** Agrega al carrito. Se despliega automáticamente el Side Cart (Carrito Lateral) confirmando la acción sin abandonar la página.

### 1.3. Flujo de Carrito y Checkout (Cart & Checkout Flow)
1. **Carrito Lateral (Side Cart / Drawer):** Resumen de productos, subtotales, estimadores de envío (barra de progreso para envío gratis) y campo de código de descuento.
2. **Cross-Selling/Upselling en Carrito:** Sugerencias algorítmicas (ej. "Compraste un taladro, necesitas brocas").
3. **Transición a Checkout:** Clic en "Finalizar Compra". Se redirige al Checkout Headless de Shopify.
4. **Checkout (Shopify Plus/Standard):** Pasos simplificados: Información de contacto -> Envío -> Pago. Integración con métodos locales (Mercado Pago, transferencia, contra reembolso).
5. **Confirmación:** Página de "Gracias por su compra" con número de seguimiento y creación de cuenta opcional.

### 1.4. Flujo de Usuario (Login & Account Management)
1. **Acceso:** Icono de perfil en el Header.
2. **Autenticación (Customer Account API de Shopify):** Login/Registro simplificado (Email o Social Login si se configura). Uso de OTP (One Time Passwords) o links mágicos para evitar fricción con contraseñas complejas.
3. **Panel de Usuario (Dashboard):**
    * Historial de pedidos y estado de envío en tiempo real.
    * Direcciones guardadas.
    * Preferencias y facturación (RUT).

---

## 2. Taxonomía y Jerarquía de Colecciones (Catálogo)

Para manejar un catálogo amplio al estilo Mercado Libre, pero exclusivo para hogar y construcción, necesitamos una categorización profunda y lógica. Esta estructura se debe reflejar en Shopify como Colecciones y Metafields.

### 2.1. Nivel 1: Macrocategorías (Departamentos)
Estas son las grandes áreas de la tienda, visibles en el Nivel 1 del Mega-menú.

1. **Construcción y Materiales**
2. **Herramientas y Maquinaria**
3. **Electricidad e Iluminación**
4. **Sanitaria y Grifería**
5. **Pinturas y Acabados**
6. **Hogar y Decoración**
7. **Jardín y Exteriores**

### 2.2. Nivel 2 y 3: Categorías y Subcategorías

Desglose de ejemplo por Departamento:

#### 1. Construcción y Materiales
* **Obra Gruesa:** Ladrillos, Bloques, Cemento, Cal, Arena, Pedregullo.
* **Hierros y Aceros:** Varillas (ADN 500), Mallas electrosoldadas, Perfiles, Chapas.
* **Maderas y Placas:** Fenólicos, MDF, OSB, Tirantes, Tablas.
* **Aislantes y Membranas:** Membranas asfálticas, Aislantes térmicos, Espumas poliuretano.
* **Construcción en Seco (Drywall):** Placas de yeso, Perfiles galvanizados, Tornillería, Masillas.

#### 2. Herramientas y Maquinaria
* **Herramientas Eléctricas:** Taladros, Amoladoras, Sierras, Lijadoras, Rotomartillos.
* **Herramientas Inalámbricas (Batería):** Taladros atornilladores, Llaves de impacto.
* **Herramientas Manuales:** Martillos, Destornilladores, Llaves, Pinzas, Niveles.
* **Maquinaria Pesada/Construcción:** Hormigoneras, Compactadoras, Elevadores.
* **Accesorios:** Brocas, Discos de corte, Lijas, Puntas de destornillador.

#### 3. Electricidad e Iluminación
* **Cables y Conductores:** Cables unipolares, Subterráneos, Coaxiales.
* **Tubos y Caños Eléctricos:** Corrugados, PVC rígido, Cajas de luz.
* **Módulos y Llaves:** Llaves de luz, Tomacorrientes, Tapas, Módulos USB.
* **Tableros y Protecciones:** Llaves térmicas, Disyuntores diferenciales, Tableros plásticos/metálicos.
* **Iluminación:** Lámparas LED, Paneles, Listones, Reflectores exteriores, Iluminación de obra.

#### 4. Sanitaria y Grifería
* **Caños y Conexiones:** PVC, Termofusión, Polipropileno.
* **Grifería:** Cocina, Baño, Exterior, Repuestos.
* **Loza Sanitaria:** Inodoros, Bidets, Lavatorios, Bachas.
* **Bombas y Tanques:** Bombas de agua, Tanques tricapa, Automáticos.

#### 5. Pinturas y Acabados
* **Pinturas de Interior/Exterior:** Látex, Esmaltes sintéticos, Acrílicos.
* **Impermeabilizantes:** Frentes, Terrazas, Selladores.
* **Preparación de Superficies:** Enduido, Fijador sellador, Removedores.
* **Accesorios para Pintar:** Pinceles, Rodillos, Bandejas, Cinta de enmascarar.

#### 6. Hogar y Decoración
* **Revestimientos:** Cerámicas, Porcelanatos, Pisos flotantes, Zócalos.
* **Baño y Cocina (Mobiliario):** Espejos, Muebles de baño, Organizadores.

#### 7. Jardín y Exteriores
* **Herramientas de Jardín:** Cortadoras de césped, Bordeadoras, Motosierras.
* **Mobiliario de Exterior:** Juegos de patio, Reposeras.
* **Riego:** Mangueras, Aspersores, Accesorios.

## 3. Implementación en Shopify y Next.js

Para que esto funcione con Headless y filtros rápidos:

1. **Estructura en Shopify:**
    * Crear las colecciones principales en Shopify.
    * Usar **Tags** o **Metafields** para las subcategorías y los atributos de filtrado (Ej: Marca, Voltaje, Material).
2. **Navegación Dinámica (Next.js):**
    * Generaremos el Mega-menú leyendo la jerarquía de colecciones desde la Storefront API.
    * Las URLs seguirán un patrón lógico: `/collections/herramientas-electricas`, `/collections/construccion/mallas`.
