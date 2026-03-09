"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Info, ShoppingCart } from "lucide-react";

interface MaterialsCalculatorProps {
  /** Rendimiento por caja/litro (ej: 1.2 m2) */
  yieldPerUnit: number;
  /** Unidad de medida (ej: "m²", "Litros"). Por defecto "m²" */
  unitName?: string; 
  /** Nombre del empaque (ej: "Caja", "Lata"). Por defecto "Unidad" */
  packagingName?: string; 
  /** Función que se llama al agregar al carrito */
  onAddToCart: (quantity: number) => void;
}

export function MaterialsCalculator({
  yieldPerUnit,
  unitName = "m²",
  packagingName = "Unidad",
  onAddToCart,
}: MaterialsCalculatorProps) {
  const [width, setWidth] = useState<string>("");
  const [length, setLength] = useState<string>("");

  const { calculatedQuantity, totalArea, areaWithWaste } = useMemo(() => {
    const w = parseFloat(width);
    const l = parseFloat(length);

    if (isNaN(w) || isNaN(l) || w <= 0 || l <= 0) {
      return { calculatedQuantity: 0, totalArea: 0, areaWithWaste: 0 };
    }

    const area = w * l;
    const withWaste = area * 1.1; // 10% desperdicio sugerido (industria standard)
    const quantity = Math.ceil(withWaste / yieldPerUnit);

    return {
      calculatedQuantity: quantity,
      totalArea: area,
      areaWithWaste: withWaste,
    };
  }, [width, length, yieldPerUnit]);

  const handleAddToCart = () => {
    if (calculatedQuantity > 0) {
      onAddToCart(calculatedQuantity);
    }
  };

  // Helper para pluralizar de manera sencilla
  const pluralize = (word: string, count: number) => {
    if (count === 1) return word;
    return word.endsWith('a') || word.endsWith('o') || word.endsWith('e') ? `${word}s` : `${word}es`;
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 w-full space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-semibold tracking-tight">
          <Calculator className="w-5 h-5 text-[#f3843e]" />
          <h3>¿Cuánto material necesitas?</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Ancho (m)
          </label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="\d*"
            placeholder="Ej: 3.5"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="0"
            step="0.01"
            className="bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Largo (m)
          </label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="\d*"
            placeholder="Ej: 4.2"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            min="0"
            step="0.01"
            className="bg-white"
          />
        </div>
      </div>

      {calculatedQuantity > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <Alert className="bg-white border-blue-100 py-3 shadow-sm">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs text-slate-600 ml-2 mt-0.5 leading-relaxed">
               Área total: <span className="font-medium text-slate-800">{totalArea.toFixed(2)} {unitName}</span> + 10% desperdicio sugerido ({areaWithWaste.toFixed(2)} {unitName}).<br/>
               Rinde <span className="font-medium text-slate-800">{yieldPerUnit} {unitName}</span> por {packagingName.toLowerCase()}.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full bg-[#f3843e] hover:bg-[#e07534] text-white shadow-sm transition-all"
            size="lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Agregar {calculatedQuantity} {pluralize(packagingName, calculatedQuantity)} al carrito
          </Button>
        </div>
      )}
    </div>
  );
}
