"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Clock, Check } from "lucide-react";
import { getShippingRate, FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shippingRates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
    const locationBtn = document.querySelector<HTMLButtonElement>(
      "[data-location-selector]"
    );
    if (locationBtn) locationBtn.click();
  };

  // Listen for location changes
  useEffect(() => {
    const handleFocus = () => {
      fetch("/api/location")
        .then((r) => r.json())
        .then((d) => setDepartment(d.department))
        .catch(() => {});
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const isFreeShipping = shippingInfo?.rate === 0;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeft = FREE_SHIPPING_THRESHOLD - cartTotal;

  if (isLoading) {
    return (
      <Card className="py-4">
        <CardContent className="px-4">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // No department set
  if (!department || !shippingInfo) {
    return (
      <Card className="py-4">
        <CardContent className="px-4 space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="size-5 text-[#21645d]" />
            <span className="text-sm font-semibold text-foreground">Calculá tu envío</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Seleccioná tu ubicación para ver las opciones de envío.
          </p>
          <button
            onClick={handleChangeLocation}
            className="text-sm font-medium text-[#21645d] hover:text-[#1a4f4a] hover:underline transition-colors"
          >
            Seleccionar ubicación
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-4">
      <CardContent className="px-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="size-5 text-[#21645d]" />
            <span className="text-sm font-semibold text-foreground">Envío</span>
          </div>
          <button
            onClick={handleChangeLocation}
            className="text-xs font-medium text-[#21645d] hover:text-[#1a4f4a] hover:underline transition-colors"
          >
            Cambiar
          </button>
        </div>

        {/* Destination + Rate */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-slate-400" />
              {department}
            </span>
            <span className="text-xs text-muted-foreground ml-5 flex items-center gap-1">
              <Clock className="size-3" />
              {shippingInfo.estimate}
            </span>
          </div>
          {isFreeShipping ? (
            <Badge variant="success" className="gap-1">
              <Check className="size-3" />
              Gratis
            </Badge>
          ) : (
            <span className="text-sm font-bold text-foreground">
              ${shippingInfo.rate.toLocaleString("es-UY")}
            </span>
          )}
        </div>

        {/* Free shipping progress */}
        {!isFreeShipping && amountLeft > 0 && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center">
              Agregá{" "}
              <span className="font-semibold text-[#21645d]">
                ${amountLeft.toLocaleString("es-UY")}
              </span>{" "}
              más para envío gratis
            </p>
          </div>
        )}

        {isFreeShipping && (
          <p className="text-xs text-emerald-600 font-medium text-center flex items-center justify-center gap-1">
            <Check className="size-3.5" />
            ¡Envío gratis alcanzado!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
