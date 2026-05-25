import { describe, it, expect, afterEach } from "vitest";
import { isCheckoutEnabled } from "@/lib/config/storeStatus";

describe("isCheckoutEnabled", () => {
  const original = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED;

  afterEach(() => {
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED = original;
  });

  it("es true solo cuando la variable es exactamente 'true'", () => {
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED = "true";
    expect(isCheckoutEnabled()).toBe(true);
  });

  it("es false cuando la variable no está seteada (fail-closed)", () => {
    delete process.env.NEXT_PUBLIC_CHECKOUT_ENABLED;
    expect(isCheckoutEnabled()).toBe(false);
  });

  it("es false cuando la variable es 'false'", () => {
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED = "false";
    expect(isCheckoutEnabled()).toBe(false);
  });

  it("es false para cualquier otro valor", () => {
    process.env.NEXT_PUBLIC_CHECKOUT_ENABLED = "1";
    expect(isCheckoutEnabled()).toBe(false);
  });
});
