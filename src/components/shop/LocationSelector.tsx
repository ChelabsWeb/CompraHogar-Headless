"use client";

import { useState, useTransition, useEffect } from "react";
import { setLocation, getLocation } from "@/app/actions/location";
import { MapPin, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
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
        className="flex items-center gap-1.5 hover:bg-black/10 px-2 py-1 rounded-sm transition-colors group"
      >
        <MapPin className="w-4 h-4 opacity-80 group-hover:opacity-100" />
        <div className="flex items-center gap-1 leading-none">
          <span className="opacity-80">Enviar a</span>
          <span className="font-semibold hidden sm:block">
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
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecciona un departamento</option>
              <option value="Artigas">Artigas</option>
              <option value="Canelones">Canelones</option>
              <option value="Cerro Largo">Cerro Largo</option>
              <option value="Colonia">Colonia</option>
              <option value="Durazno">Durazno</option>
              <option value="Flores">Flores</option>
              <option value="Florida">Florida</option>
              <option value="Lavalleja">Lavalleja</option>
              <option value="Maldonado">Maldonado</option>
              <option value="Montevideo">Montevideo</option>
              <option value="Paysandú">Paysandú</option>
              <option value="Río Negro">Río Negro</option>
              <option value="Rivera">Rivera</option>
              <option value="Rocha">Rocha</option>
              <option value="Salto">Salto</option>
              <option value="San José">San José</option>
              <option value="Soriano">Soriano</option>
              <option value="Tacuarembó">Tacuarembó</option>
              <option value="Treinta y Tres">Treinta y Tres</option>
            </select>
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
              className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
