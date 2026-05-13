import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuickAdd } from "@/hooks/useQuickAdd";

type Variant = { id: string; availableForSale?: boolean };
type Product = {
  id: string;
  title: string;
  variants: { edges: { node: Variant }[] };
};

const mockAddToCart = vi.fn();
const mockToast = vi.fn();
const mockOpenSheet = vi.fn();

vi.mock("@/components/cart/CartProvider", () => ({
  useCart: () => ({ addToCart: mockAddToCart }),
}));

vi.mock("@/components/ui/toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

beforeEach(() => {
  mockAddToCart.mockReset();
  mockToast.mockReset();
  mockOpenSheet.mockReset();
});

function product(variants: Variant[]): Product {
  return {
    id: "gid://Product/1",
    title: "Pintura Látex 4L",
    variants: { edges: variants.map((v) => ({ node: v })) },
  };
}

describe("useQuickAdd", () => {
  it("adds the single variant directly when there is exactly one available variant", async () => {
    const p = product([{ id: "gid://Variant/1", availableForSale: true }]);
    const { result } = renderHook(() =>
      useQuickAdd({ openVariantSheet: mockOpenSheet })
    );

    await act(async () => {
      await result.current.quickAdd(p as any);
    });

    expect(mockAddToCart).toHaveBeenCalledWith("gid://Variant/1", 1);
    expect(mockOpenSheet).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining("Agregado") })
    );
  });

  it("opens the variant sheet when there are multiple variants", async () => {
    const p = product([
      { id: "gid://Variant/1", availableForSale: true },
      { id: "gid://Variant/2", availableForSale: true },
    ]);
    const { result } = renderHook(() =>
      useQuickAdd({ openVariantSheet: mockOpenSheet })
    );

    await act(async () => {
      await result.current.quickAdd(p as any);
    });

    expect(mockOpenSheet).toHaveBeenCalledWith(p);
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it("does not add when the only variant is sold out", async () => {
    const p = product([{ id: "gid://Variant/1", availableForSale: false }]);
    const { result } = renderHook(() =>
      useQuickAdd({ openVariantSheet: mockOpenSheet })
    );

    await act(async () => {
      await result.current.quickAdd(p as any);
    });

    expect(mockAddToCart).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Sin stock"),
        variant: "error",
      })
    );
  });

  it("treats variants with no availability data as available (defensive)", async () => {
    const p = product([{ id: "gid://Variant/1" } as Variant]);
    const { result } = renderHook(() =>
      useQuickAdd({ openVariantSheet: mockOpenSheet })
    );

    await act(async () => {
      await result.current.quickAdd(p as any);
    });

    expect(mockAddToCart).toHaveBeenCalled();
  });
});
