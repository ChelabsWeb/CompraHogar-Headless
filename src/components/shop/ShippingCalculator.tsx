"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type ShippingStatus = "idle" | "loading" | "success" | "error";

interface ShippingOption {
  id: string;
  name: string;
  estimatedTime: string;
  price: number;
}

export function ShippingCalculator() {
  const [cp, setCp] = useState("");
  const [status, setStatus] = useState<ShippingStatus>("idle");
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize from cookies
  useEffect(() => {
    const savedCp = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_cp="))
      ?.split("=")[1];

    if (savedCp) {
      setCp(savedCp);
      calculateShipping(savedCp);
    }
  }, []);

  const calculateShipping = (postcode: string) => {
    if (!postcode || postcode.length < 4) {
      setStatus("error");
      setErrorMessage("Por favor, ingresa un código postal válido.");
      return;
    }

    setStatus("loading");

    // Simulate API call to logistics service
    setTimeout(() => {
      const isMontevideo = postcode.startsWith("11") || postcode.startsWith("12");
      const baseOptions: ShippingOption[] = [
        {
          id: "home_delivery",
          name: "Envío a Domicilio",
          estimatedTime: isMontevideo ? "Llega mañana" : "Llega en 48-72 hrs",
          price: isMontevideo ? 200 : 350,
        },
        {
          id: "store_pickup",
          name: "Retiro en Sucursal",
          estimatedTime: "Disponible gratis hoy",
          price: 0,
        },
      ];

      setOptions(baseOptions);
      setStatus("success");

      // Save valid CP in cookies for 30 days
      document.cookie = `user_cp=${postcode}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateShipping(cp);
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 text-foreground font-medium">
        <Truck className="size-5 text-primary" />
        <h3 className="text-sm">Opciones de Envío</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Ingresa tu CP (ej: 11000)"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            className="pl-9 bg-background h-10 w-full"
            maxLength={8}
          />
        </div>
        <Button 
          type="submit" 
          disabled={status === "loading" || !cp} 
          isLoading={status === "loading"}
          className="h-10 px-4"
        >
          {status !== "loading" && <Search className="size-4 mr-2" />}
          Calcular
        </Button>
      </form>

      {/* Loading State */}
      {status === "loading" && (
        <div className="space-y-3 mt-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg mt-4 border border-destructive/20">
          <AlertCircle className="size-4 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Success State */}
      {status === "success" && options.length > 0 && (
        <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="size-3.5 text-green-500" />
                  {option.name}
                </span>
                <span className="text-xs text-muted-foreground ml-5">
                  {option.estimatedTime}
                </span>
              </div>
              <div className="text-sm font-semibold text-foreground">
                {option.price === 0 ? (
                  <span className="text-green-600 dark:text-green-500">Gratis</span>
                ) : (
                  `$${option.price}`
                )}
              </div>
            </div>
          ))}
          <div className="text-xs text-center text-muted-foreground pt-2">
            Tarifas calculadas para el CP: <strong className="text-foreground">{cp}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
