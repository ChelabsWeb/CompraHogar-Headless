"use client";

import { useCallback } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/ui/toast";
import type { ShopifyProduct } from "@/lib/types";

interface UseQuickAddOptions {
  /**
   * Called when the product has more than one variant and the picker should
   * be shown. Receives the full product so the bottom-sheet can render
   * option pills.
   */
  openVariantSheet: (product: ShopifyProduct) => void;
}

export function useQuickAdd({ openVariantSheet }: UseQuickAddOptions) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const quickAdd = useCallback(
    async (product: ShopifyProduct) => {
      const variants = product.variants?.edges?.map((e: any) => e.node) ?? [];
      const variantCount = variants.length;

      if (variantCount > 1) {
        openVariantSheet(product);
        return;
      }

      const variant = variants[0];
      if (!variant) {
        toast({
          title: "No se pudo agregar al carrito",
          variant: "error",
        });
        return;
      }

      // availableForSale === false explicitly means sold out.
      // undefined/null counts as available (defensive — most products have it set).
      if (variant.availableForSale === false) {
        toast({ title: "Sin stock", variant: "error" });
        return;
      }

      try {
        await addToCart(variant.id, 1);
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          (navigator as any).vibrate(10);
        }
        toast({
          title: `Agregado al carrito · ${product.title}`,
          variant: "success",
        });
      } catch (err) {
        toast({
          title: "Error agregando al carrito",
          description: "Intentá de nuevo en unos segundos.",
          variant: "error",
        });
      }
    },
    [addToCart, toast, openVariantSheet]
  );

  return { quickAdd };
}
