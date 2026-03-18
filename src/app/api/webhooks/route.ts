import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag as _revalidateTag } from 'next/cache';
import crypto from 'crypto';

// Next.js 16 requires a second argument (cache profile) for revalidateTag
const revalidate = (tag: string) => _revalidateTag(tag, "default" as any);

// --- Interfaces ---

export interface ShopifyOrderPayload {
  id: number;
  email?: string;
  total_price: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string | null;
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    sku?: string;
    price: string;
    product_id: number | null;
    variant_id: number | null;
  }>;
  customer?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  [key: string]: any;
}

export interface ShopifyInventoryLevelPayload {
  inventory_item_id: number;
  location_id: number;
  available: number;
  updated_at: string;
  admin_graphql_api_id: string;
  [key: string]: any;
}

// --- Handlers ---

async function handleOrderWebhook(topic: string, payload: ShopifyOrderPayload, shopDomain: string) {
  console.log(`[Webhook] Procesando orden (${topic}) para la tienda ${shopDomain}`);
  console.log(`[Webhook] Order ID: ${payload.id}, Email: ${payload.email ?? 'N/A'}, Total: ${payload.total_price} ${payload.currency}`);

  // [Placeholder] 1. ERP Externo
  console.log(`[Webhook] Placeholder: Enviando orden de venta ${payload.id} a ERP externo...`);

  // [Placeholder] 2. CRM (Klaviyo)
  console.log(`[Webhook] Placeholder: Actualizando perfil de cliente en CRM (Klaviyo) para orden ${payload.id}...`);

  // [Placeholder] 3. Email Transaccional (Resend)
  console.log(`[Webhook] Placeholder: Disparando email transaccional local (ej. Resend) para orden confirmada/actualizada...`);
}

async function handleInventoryLevelWebhook(topic: string, payload: ShopifyInventoryLevelPayload, shopDomain: string) {
  console.log(`[Webhook] Procesando actualización de inventario (${topic}) para la tienda ${shopDomain}`);
  console.log(`[Webhook] Inventory Item ID: ${payload.inventory_item_id}, Nuevo stock disponible: ${payload.available}`);

  if (payload.available <= 0) {
    console.log(`[Webhook] ⚠️ Alerta de Stock: El item ${payload.inventory_item_id} de la locación ${payload.location_id} se quedó sin inventario.`);
    
    // Invalidamos la caché general de productos para evitar over-selling en el frontend estático
    revalidate('products');
    console.log('[Webhook] Caché revalidada para tag: "products" (Previniendo over-selling)');
  } else {
    // Si hay stock, revalidamos para asegurar que el dato fresco está en la UI
    revalidate('products');
    console.log('[Webhook] Caché revalidada para tag: "products" (Actualización de stock regular)');
  }
}

async function handleCatalogWebhook(topic: string, shopDomain: string) {
  console.log(`[Webhook] Procesando evento de catálogo (${topic}) para la tienda ${shopDomain}`);
  
  if (topic.startsWith('products/')) {
    revalidate('products');
    revalidate('collections');
    console.log('[Webhook] Caché revalidada para tags: "products", "collections"');
  } else if (topic.startsWith('collections/')) {
    revalidate('collections');
    console.log('[Webhook] Caché revalidada para tag: "collections"');
  }
}

// --- Route Handler ---

export async function POST(req: NextRequest) {
  try {
    // 1. Obtener el texto en crudo del cuerpo (Requerido para validación HMAC estricta)
    // Usar req.text() asegura que obtenemos exactamente los mismos bytes que firmó Shopify.
    const rawBody = await req.text();
    
    // 2. Obtener los headers requeridos por Shopify
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    const shopDomain = req.headers.get('x-shopify-shop-domain');

    if (!hmacHeader || !topic || !shopDomain) {
      return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
    }

    // 3. Obtener el secreto del webhook desde variables de entorno
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('SHOPIFY_WEBHOOK_SECRET is not definida');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 4. Convalidación estricta de la firma HMAC
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    const generatedBuffer = Buffer.from(generatedHash);
    const hmacBuffer = Buffer.from(hmacHeader);

    if (generatedBuffer.length !== hmacBuffer.length || !crypto.timingSafeEqual(generatedBuffer, hmacBuffer)) {
      console.warn('Alerta de seguridad: Firma HMAC inválida en Webhook.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 5. Parsear el payload (ahora es seguro)
    const payload = JSON.parse(rawBody);

    console.log(`[Webhook] Recibido evento: ${topic} para la tienda ${shopDomain}`);

    // 6. Enrutar basado en el topic del evento
    switch (topic) {
      case 'products/update':
      case 'products/create':
      case 'products/delete':
      case 'collections/update':
      case 'collections/create':
      case 'collections/delete':
        await handleCatalogWebhook(topic, shopDomain);
        break;

      case 'orders/create':
      case 'orders/updated':
        await handleOrderWebhook(topic, payload as ShopifyOrderPayload, shopDomain);
        break;

      case 'inventory_levels/update':
        await handleInventoryLevelWebhook(topic, payload as ShopifyInventoryLevelPayload, shopDomain);
        break;

      default:
        console.log(`[Webhook] Evento reportado y verificado pero sin handler específico: ${topic}`);
    }

    // 7. Retornar éxito
    return NextResponse.json({ success: true, message: 'Webhook procesado exitosamente' }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error interno procesando webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
