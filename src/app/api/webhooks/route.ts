import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import crypto from 'crypto';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = JSON.parse(rawBody);

    console.log(`[Webhook] Recibido evento: ${topic} para la tienda ${shopDomain}`);

    // 6. Invocar revalidateTag pertinentemente basado en el topic del evento
    switch (topic) {
      case 'products/update':
      case 'products/create':
      case 'products/delete':
        // Invalidar caché de productos e indirectamente colecciones si están vinculadas
        revalidateTag('products', {});
        revalidateTag('collections', {});
        console.log('[Webhook] Caché revalidada para tags: "products", "collections"');
        break;

      case 'collections/update':
      case 'collections/create':
      case 'collections/delete':
        // Invalidar caché de las colecciones específicamente
        revalidateTag('collections', {});
        console.log('[Webhook] Caché revalidada para tag: "collections"');
        break;

      default:
        console.log(`[Webhook] Evento reportado pero no atado a revalidación de caché: ${topic}`);
    }

    // 7. Retornar éxito
    return NextResponse.json({ success: true, message: 'Webhook procesado exitosamente' }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error interno procesando webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
