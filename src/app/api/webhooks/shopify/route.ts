import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Extraemos el raw body de forma segura en Next.js (Web API Request object)
    const rawBody = await req.text();
    const signature = req.headers.get("x-shopify-hmac-sha256");
    const topic = req.headers.get("x-shopify-topic");

    if (!signature || !topic) {
      return NextResponse.json({ error: "Missing headers" }, { status: 400 });
    }

    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("SHOPIFY_WEBHOOK_SECRET no está configurado en .env.local");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 2. Validación de firma HMAC inquebrantable
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(rawBody, "utf8").digest("base64");

    // Convertimos a Buffers estandarizados en base64 para evitar timing-attacks de longitud de string
    const signatureBuffer = Buffer.from(signature, "base64");
    const digestBuffer = Buffer.from(digest, "base64");

    if (
      signatureBuffer.length !== digestBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, digestBuffer)
    ) {
      console.warn("Firma HMAC inválida: Posible ataque o secreto erróneo.");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Ejecución Reactiva On-Demand de la caché (ISR purge)
    const payload = JSON.parse(rawBody);

    switch (topic) {
      case "products/create":
      case "products/update":
      case "products/delete":
        // Purga datos generales de productos
        // @ts-expect-error Next 15 typings require 2nd arg
        revalidateTag("products");
        // Si tienes una vista de detalle individual de tu producto
        // @ts-expect-error Next 15 typings require 2nd arg
        if (payload.handle) revalidateTag(`products:${payload.handle}`);
        break;

      case "collections/create":
      case "collections/update":
      case "collections/delete":
        // Purga listados de colecciones
        // @ts-expect-error Next 15 typings require 2nd arg
        revalidateTag("collections");
        // Purga específicamente el PLP modificado para evitar re-renderizados masivos
        // @ts-expect-error Next 15 typings require 2nd arg
        if (payload.handle) revalidateTag(`collections:${payload.handle}`);
        break;

      default:
        console.log(`Topic de webhook no manejado activamente: ${topic}`);
    }

    // Shopify espera recibir un 2xx lo más pronto posible; de lo contrario deshabilitará webhooks
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error procesando el webhook de Shopify:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
