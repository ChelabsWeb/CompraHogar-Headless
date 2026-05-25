import { describe, it, expect } from "vitest";
import {
  WHATSAPP_NUMBER,
  buildWhatsAppUrl,
  buildCartWhatsAppMessage,
} from "@/lib/constants/contact";

describe("buildWhatsAppUrl", () => {
  it("arma un link wa.me con el número y el mensaje url-encodeado", () => {
    const url = buildWhatsAppUrl("Hola mundo");
    expect(url).toBe(`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20mundo`);
  });
});

describe("buildCartWhatsAppMessage", () => {
  it("lista los ítems con cantidad y agrega el total estimado", () => {
    const msg = buildCartWhatsAppMessage(
      [
        { productTitle: "Sillón Oslo", quantity: 1 },
        { productTitle: "Mesa Roble", quantity: 2 },
      ],
      "$61.900",
    );
    expect(msg).toContain("• 1x Sillón Oslo");
    expect(msg).toContain("• 2x Mesa Roble");
    expect(msg).toContain("Total estimado: $61.900");
    expect(msg).toContain("¿Cómo coordino el pago?");
  });

  it("funciona con un carrito vacío sin romper", () => {
    const msg = buildCartWhatsAppMessage([], "$0");
    expect(msg).toContain("Total estimado: $0");
  });
});
