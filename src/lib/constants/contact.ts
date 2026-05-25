/** Número de WhatsApp de atención (formato internacional sin +). */
export const WHATSAPP_NUMBER = "59896244003";

/** Arma un link wa.me con un mensaje pre-cargado. */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type WhatsAppCartLine = { productTitle: string; quantity: number };

/**
 * Mensaje pre-cargado para coordinar una compra por WhatsApp desde el carrito.
 * `totalLabel` es el total ya formateado (ej. "$61.900").
 */
export function buildCartWhatsAppMessage(
  lines: WhatsAppCartLine[],
  totalLabel: string,
): string {
  const items = lines.map((l) => `• ${l.quantity}x ${l.productTitle}`).join("\n");
  return [
    "Hola! Quiero hacer una compra en CompraHogar:",
    items,
    `Total estimado: ${totalLabel}`,
    "¿Cómo coordino el pago?",
  ]
    .filter(Boolean)
    .join("\n");
}
