"use client";

import { useState, type MouseEvent } from "react";
import { Plus, Lock } from "lucide-react";
import { useQuickAdd } from "@/hooks/useQuickAdd";
import { VariantBottomSheet } from "@/components/shop/VariantBottomSheet";
import type { ShopifyProduct } from "@/lib/types";

interface QuickAddButtonProps {
  product: ShopifyProduct;
  /**
   * When true, render the disabled lock icon and skip all interactivity.
   * Computed by ProductCard from `availableForSale` flags.
   */
  disabled?: boolean;
}

export function QuickAddButton({ product, disabled }: QuickAddButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState<ShopifyProduct | null>(null);
  const { quickAdd } = useQuickAdd({
    openVariantSheet: (p) => {
      setSheetProduct(p);
      setSheetOpen(true);
    },
  });

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    await quickAdd(product);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={
          disabled ? "Producto sin stock" : `Agregar ${product.title} al carrito`
        }
        className={`absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
          disabled
            ? "bg-slate-300 text-white cursor-not-allowed"
            : "bg-slate-900 text-white"
        }`}
      >
        {disabled ? <Lock size={14} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
      </button>

      <VariantBottomSheet
        product={sheetProduct}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSheetProduct(null);
        }}
      />
    </>
  );
}
