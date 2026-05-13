import {
  Hammer,
  PaintBucket,
  Wrench,
  Zap,
  Droplets,
  Sofa,
  Lightbulb,
  Leaf,
  Briefcase,
  Package,
  type LucideIcon,
} from "lucide-react";

export interface Subcollection {
  name: string;
  handle: string;
  image?: string;
}

export type CollectionHierarchy = Record<string, Subcollection[]>;

export const COLLECTION_HIERARCHY: CollectionHierarchy = {
  "construccion-y-materiales": [
    { name: "Cementos y cal", handle: "cementos-y-cal", image: "/images/categories/cementos.jpg" },
    { name: "Ladrillos y bloques", handle: "ladrillos-y-bloques", image: "/images/categories/ladrillos.jpg" },
    { name: "Hierros y mallas", handle: "hierros-y-mallas", image: "/images/categories/hierros.jpg" },
    { name: "Áridos", handle: "aridos", image: "/images/categories/aridos.jpg" },
    { name: "Impermeabilizantes", handle: "impermeabilizantes" },
    { name: "Aditivos", handle: "aditivos" }
  ],
  "herramientas-y-maquinaria": [
    { name: "Herramientas eléctricas", handle: "herramientas-electricas" },
    { name: "Herramientas manuales", handle: "herramientas-manuales" },
    { name: "Medición y trazado", handle: "medicion-y-trazado" },
    { name: "Accesorios", handle: "accesorios" },
    { name: "Seguridad industrial", handle: "seguridad-industrial" }
  ],
  "electricidad-e-iluminacion": [
    { name: "Cables y conductores", handle: "cables-y-conductores" },
    { name: "Tableros y protecciones", handle: "tableros-y-protecciones" },
    { name: "Iluminación LED", handle: "iluminacion" }
  ],
  "sanitaria-y-griferia": [
    { name: "Caños y conexiones", handle: "canos-y-conexiones" },
    { name: "Grifería", handle: "griferia" },
    { name: "Loza sanitaria", handle: "loza-sanitaria" },
    { name: "Bombas de agua", handle: "bombas-de-agua" },
    { name: "Tanques y cisternas", handle: "tanques-y-cisternas" }
  ],
  "pinturas-y-acabados": [
    { name: "Pinturas de interior", handle: "pinturas-de-interior" },
    { name: "Pinturas de exterior", handle: "pinturas-de-exterior" },
    { name: "Accesorios para pintar", handle: "accesorios-para-pintar" }
  ],
  "hogar-y-decoracion": [
    { name: "Revestimientos y pisos", handle: "revestimientos-y-pisos" },
    { name: "Mobiliario de baño y cocina", handle: "mobiliario-de-bano-y-cocina" }
  ],
  "jardin-y-exteriores": [
    { name: "Muebles de jardín", handle: "muebles-de-jardin" },
    { name: "Piscinas y mantenimiento", handle: "piscinas-y-mantenimiento" },
    { name: "Herramientas de jardinería", handle: "herramientas-de-jardineria" },
    { name: "Riego", handle: "riego" }
  ],
  "servicios-y-alquileres": [
    { name: "Alquiler de maquinaria", handle: "alquiler-de-maquinaria" },
    { name: "Andamios y estructuras", handle: "andamios-y-estructuras" },
    { name: "Herramientas especializadas", handle: "herramientas-especializadas-alquiler" },
    { name: "Fletes y transporte", handle: "fletes-y-transporte" },
    { name: "Servicios de mano de obra", handle: "servicios-mano-de-obra" },
    { name: "Contenedores y limpieza", handle: "contenedores-y-limpieza" },
  ]
};

export const MAIN_COLLECTION_HANDLES = Object.keys(COLLECTION_HIERARCHY);

export function getSubcollections(parentHandle: string): Subcollection[] | undefined {
  return COLLECTION_HIERARCHY[parentHandle];
}

/**
 * Icon per main collection handle. Falls back to `Package` if a handle is not
 * present in this map. The icon renders on the LEFT of each item in
 * MobileMenu's root view at 26px.
 */
export const COLLECTION_ICONS: Record<string, LucideIcon> = {
  "construccion-y-materiales": Hammer,
  "herramientas-y-maquinaria": Wrench,
  "electricidad-e-iluminacion": Zap,
  "sanitaria-y-griferia": Droplets,
  "pinturas-y-acabados": PaintBucket,
  "hogar-y-decoracion": Sofa,
  "jardin-y-exteriores": Leaf,
  "servicios-y-alquileres": Briefcase,
};

/**
 * Helper that returns the icon for a collection handle, or `Package` if no
 * mapping exists. Always returns a valid `LucideIcon` — never undefined.
 */
export function getCollectionIcon(handle: string): LucideIcon {
  return COLLECTION_ICONS[handle] ?? Package;
}
