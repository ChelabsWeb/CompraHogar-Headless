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
  // TODO: Integrate ERP, CRM (Klaviyo), and transactional email (Resend) when ready
}

async function handleInventoryLevelWebhook(topic: string, payload: ShopifyInventoryLevelPayload, shopDomain: string) {
  // Revalidate product cache on any inventory change to keep frontend fresh
  revalidate('products');
}

async function handleCatalogWebhook(topic: string, shopDomain: string) {
  if (topic.startsWith('products/')) {
    revalidate('products');
    revalidate('collections');
  } else if (topic.startsWith('collections/')) {
    revalidate('collections');
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
        break;
    }

    // 7. Retornar éxito
    return NextResponse.json({ success: true, message: 'Webhook procesado exitosamente' }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error interno procesando webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
