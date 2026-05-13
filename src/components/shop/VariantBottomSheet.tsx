"use client";

import { useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/ui/toast";
import type { ShopifyProduct, ShopifyProductOption, ShopifyVariant } from "@/lib/types";

interface VariantBottomSheetProps {
  product: ShopifyProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VariantBottomSheet({
  product,
  open,
  onOpenChange,
}: VariantBottomSheetProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Reset state every time a new product comes in
  useEffect(() => {
    if (!product) return;
    const first = product.variants?.edges?.[0]?.node;
    if (!first) return;
    const initial: Record<string, string> = {};
    first.selectedOptions.forEach((o) => {
      initial[o.name] = o.value;
    });
    setSelectedOptions(initial);
    setQuantity(1);
  }, [product]);

  // Find the matching variant given the currently-selected options
  const matchedVariant = useMemo((): ShopifyVariant | null => {
    if (!product) return null;
    const variants = product.variants?.edges?.map((e) => e.node) ?? [];
    return (
      variants.find((v) =>
        v.selectedOptions.every(
          (o) => selectedOptions[o.name] === o.value
        )
      ) ?? null
    );
  }, [product, selectedOptions]);

  if (!product) return null;

  const handleSubmit = async () => {
    if (!matchedVariant) return;
    setSubmitting(true);
    try {
      await addToCart(matchedVariant.id, quantity);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(10);
      }
      toast({
        title: `Agregado al carrito · ${product.title}`,
        variant: "success",
      });
      onOpenChange(false);
    } catch {
      toast({
        title: "Error agregando al carrito",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isUnavailable = matchedVariant?.availableForSale === false || !matchedVariant;
  const priceAmount = Number(matchedVariant?.price?.amount ?? 0);
  const priceLabel =
    priceAmount > 0
      ? `$${(priceAmount * quantity).toLocaleString("es-UY")}`
      : "—";

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[111] flex flex-col bg-white rounded-t-2xl max-h-[80vh] outline-none">
          {/* Handle */}
          <div className="mx-auto mt-3 mb-1 h-1.5 w-9 rounded-full bg-slate-300" />

          <Drawer.Title className="px-5 pt-2 pb-3 text-[18px] font-bold text-slate-900 tracking-tight">
            {product.title}
          </Drawer.Title>
          <div className="h-px bg-slate-100" />

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {product.options?.map((opt: ShopifyProductOption) => (
              <div key={opt.name}>
                <p className="text-[13px] font-semibold text-slate-700 mb-2">
                  {opt.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((value: string) => {
                    const isActive = selectedOptions[opt.name] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [opt.name]: value,
                          }))
                        }
                        className={`min-h-[44px] px-4 rounded-full border text-[14px] font-medium transition-colors ${
                          isActive
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 active:bg-slate-50"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity selector */}
            <div>
              <p className="text-[13px] font-semibold text-slate-700 mb-2">Cantidad</p>
              <div className="inline-flex items-center gap-3 border border-slate-200 rounded-full px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center active:bg-slate-100"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className="text-[15px] font-semibold min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center active:bg-slate-100"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="px-5 pt-3 pb-safe border-t border-slate-100 bg-white">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUnavailable || submitting}
              className="w-full h-12 rounded-full bg-primary text-white text-[15px] font-semibold active:bg-primary/90 disabled:opacity-50 disabled:bg-slate-400 transition-colors"
            >
              {isUnavailable
                ? "Sin stock"
                : submitting
                ? "Agregando…"
                : `Agregar — ${priceLabel}`}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
