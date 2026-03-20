"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Clock } from "lucide-react";
import { getShippingRate, FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shippingRates";

interface ShippingCalculatorProps {
  cartTotal?: number;
}

export function ShippingCalculator({ cartTotal = 0 }: ShippingCalculatorProps) {
  const [department, setDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/location")
      .then((r) => r.json())
      .then((d) => setDepartment(d.department))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const shippingInfo = getShippingRate(department, cartTotal);

  const handleChangeLocation = () => {
    // Trigger the LocationSelector modal by clicking the header button
    const locationBtn = document.querySelector<HTMLButtonElement>(
      '[data-location-selector]'
    );
    if (locationBtn) {
      locationBtn.click();
    }
  };

  // Listen for location changes (router refresh after LocationSelector saves)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetch("/api/location")
          .then((r) => r.json())
          .then((d) => setDepartment(d.department))
          .catch(() => {});
      }
    };

    // Also refetch on focus to catch location changes
    const handleFocus = () => {
      fetch("/api/location")
        .then((r) => r.json())
        .then((d) => setDepartment(d.department))
        .catch(() => {});
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-muted animate-pulse" />
          <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  // No department set
  if (!department || !shippingInfo) {
    return (
      <div className="w-full rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Truck className="size-5 text-[#21645d]" />
          <h3 className="text-sm">Opciones de Env&iacute;o</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Seleccion&aacute; tu ubicaci&oacute;n para calcular el env&iacute;o
        </p>
        <button
          onClick={handleChangeLocation}
          className="text-sm font-medium text-[#21645d] hover:text-[#1a4f4a] transition-colors"
        >
          Seleccionar ubicaci&oacute;n
        </button>
      </div>
    );
  }

  const isFreeShipping = shippingInfo.rate === 0;
  const amountForFree = FREE_SHIPPING_THRESHOLD - cartTotal;

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Truck className="size-5 text-[#21645d]" />
          <h3 className="text-sm">Opciones de Env&iacute;o</h3>
        </div>
        <button
          onClick={handleChangeLocation}
          className="text-xs font-medium text-[#21645d] hover:text-[#1a4f4a] transition-colors"
        >
          Cambiar ubicaci&oacute;n
        </button>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <MapPin className="size-3.5 text-muted-foreground" />
            {department}
          </span>
          <span className="text-xs text-muted-foreground ml-5 flex items-center gap-1">
            <Clock className="size-3" />
            {shippingInfo.estimate}
          </span>
        </div>
        <div className="text-sm font-semibold">
          {isFreeShipping ? (
            <span className="text-green-600 dark:text-green-500">Env&iacute;o gratis</span>
          ) : (
            <span className="text-foreground">${shippingInfo.rate}</span>
          )}
        </div>
      </div>

      {!isFreeShipping && amountForFree > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Agreg&aacute; <span className="font-semibold text-[#21645d]">${amountForFree.toLocaleString("es-UY")}</span> m&aacute;s para env&iacute;o gratis
        </p>
      )}
    </div>
  );
}
