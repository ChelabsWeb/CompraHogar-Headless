"use client";

import { Truck } from "lucide-react";
import { useUserLocation } from "@/hooks/useUserLocation";
import {
  getShippingRate,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants/shippingRates";

interface ProductCardShippingProps {
  priceAmount: number;
}

export function ProductCardShipping({ priceAmount }: ProductCardShippingProps) {
  const { department, isLoading } = useUserLocation();

  if (priceAmount === 0) return null;

  let label: string | null = null;

  if (priceAmount >= FREE_SHIPPING_THRESHOLD) {
    label = "Envío gratis";
  } else if (isLoading) {
    return null;
  } else if (!department) {
    label = "Envío a todo Uruguay";
  } else {
    const info = getShippingRate(department, 0);
    label = info ? `Llega en ${info.estimate}` : "Envío a todo Uruguay";
  }

  return (
    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
      <Truck className="w-3 h-3" strokeWidth={2} aria-hidden />
      <span>{label}</span>
    </div>
  );
}
