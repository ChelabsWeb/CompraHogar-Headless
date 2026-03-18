"use client";

import { useState, useTransition, useEffect } from "react";
import { setLocation, getLocation } from "@/app/actions/location";
import { MapPin, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function LocationSelector() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Form state
  const [cp, setCp] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  
  // Display state
  const [currentLocation, setCurrentLocation] = useState<{ cp: string; department: string } | null>(null);

  // Initialize from cookies on mount
  useEffect(() => {
    const fetchLocation = async () => {
      const loc = await getLocation();
      if (loc) {
        setCurrentLocation(loc);
        setCp(loc.cp);
        setDepartment(loc.department);
      }
    };
    fetchLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic Validations
    if (!department) {
      setError("Por favor, selecciona un departamento.");
      return;
    }
    if (!cp || cp.length < 4 || !/^\d+$/.test(cp)) {
      setError("Por favor, ingresa un código postal válido (ej: 11000).");
      return;
    }

    startTransition(async () => {
      const result = await setLocation(cp, department);
      if (result.success) {
        setCurrentLocation({ cp, department });
        setIsOpen(false);
        // Refrescar el enrutador para que los Server Components lean la nueva cookie
        router.refresh(); 
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 h-9 px-3 py-2 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground rounded-md text-foreground transition-colors group lg:h-12 lg:px-4 lg:rounded-xl lg:border-slate-200 lg:bg-white lg:text-slate-700 lg:hover:bg-slate-50"
      >
        <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-muted-foreground lg:text-slate-500">Enviar a</span>
          <span className="font-medium hidden sm:block lg:text-sm">
            {currentLocation ? `${currentLocation.department} ${currentLocation.cp}` : "Seleccionar ubicación"}
          </span>
        </div>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Ingresa tu ubicación"
        description="Podrás ver costos y tiempos de entrega exactos para tu zona."
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          
          {/* Department Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="department" className="text-sm font-medium text-slate-700">Departamento</label>
            <Select
              value={department}
              onValueChange={setDepartment}
            >
              <SelectTrigger id="department" className="w-full bg-white">
                <SelectValue placeholder="Selecciona un departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Artigas">Artigas</SelectItem>
                <SelectItem value="Canelones">Canelones</SelectItem>
                <SelectItem value="Cerro Largo">Cerro Largo</SelectItem>
                <SelectItem value="Colonia">Colonia</SelectItem>
                <SelectItem value="Durazno">Durazno</SelectItem>
                <SelectItem value="Flores">Flores</SelectItem>
                <SelectItem value="Florida">Florida</SelectItem>
                <SelectItem value="Lavalleja">Lavalleja</SelectItem>
                <SelectItem value="Maldonado">Maldonado</SelectItem>
                <SelectItem value="Montevideo">Montevideo</SelectItem>
                <SelectItem value="Paysandú">Paysandú</SelectItem>
                <SelectItem value="Río Negro">Río Negro</SelectItem>
                <SelectItem value="Rivera">Rivera</SelectItem>
                <SelectItem value="Rocha">Rocha</SelectItem>
                <SelectItem value="Salto">Salto</SelectItem>
                <SelectItem value="San José">San José</SelectItem>
                <SelectItem value="Soriano">Soriano</SelectItem>
                <SelectItem value="Tacuarembó">Tacuarembó</SelectItem>
                <SelectItem value="Treinta y Tres">Treinta y Tres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Zip Code Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cp" className="text-sm font-medium text-slate-700">Código Postal</label>
            <input
              type="text"
              id="cp"
              value={cp}
              onChange={(e) => setCp(e.target.value)}
              placeholder="Ej: 11000"
              className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              maxLength={5}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full flex items-center justify-center rounded-md bg-[#21645d] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a4f4a] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar ubicación"
            )}
          </button>
        </form>
      </Modal>
    </>
  );
}
