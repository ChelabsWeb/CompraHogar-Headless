export interface Subcollection {
  name: string;
  handle: string;
  image?: string;
}

export type CollectionHierarchy = Record<string, Subcollection[]>;

export const COLLECTION_HIERARCHY: CollectionHierarchy = {
  "construccion-y-materiales": [
    { name: "Cementos y Cal", handle: "cementos-y-cal", image: "/images/categories/cementos.jpg" },
    { name: "Ladrillos y Bloques", handle: "ladrillos-y-bloques", image: "/images/categories/ladrillos.jpg" },
    { name: "Hierros y Mallas", handle: "hierros-y-mallas", image: "/images/categories/hierros.jpg" },
    { name: "Áridos", handle: "aridos", image: "/images/categories/aridos.jpg" },
    { name: "Impermeabilizantes", handle: "impermeabilizantes" },
    { name: "Aditivos", handle: "aditivos" }
  ],
  "herramientas-y-maquinaria": [
    { name: "Herramientas Eléctricas", handle: "herramientas-electricas" },
    { name: "Herramientas Manuales", handle: "herramientas-manuales" },
    { name: "Medición y Trazado", handle: "medicion-y-trazado" },
    { name: "Accesorios", handle: "accesorios" },
    { name: "Seguridad Industrial", handle: "seguridad-industrial" }
  ],
  "electricidad-e-iluminacion": [
    { name: "Cables y Conductores", handle: "cables-y-conductores" },
    { name: "Tableros y Protecciones", handle: "tableros-y-protecciones" },
    { name: "Iluminación LED", handle: "iluminacion" }
  ],
  "sanitaria-y-griferia": [
    { name: "Caños y Conexiones", handle: "canos-y-conexiones" },
    { name: "Grifería", handle: "griferia" },
    { name: "Loza Sanitaria", handle: "loza-sanitaria" },
    { name: "Bombas de Agua", handle: "bombas-de-agua" },
    { name: "Tanques y Cisternas", handle: "tanques-y-cisternas" }
  ],
  "pinturas-y-acabados": [
    { name: "Pinturas de Interior", handle: "pinturas-de-interior" },
    { name: "Pinturas de Exterior", handle: "pinturas-de-exterior" },
    { name: "Accesorios para Pintar", handle: "accesorios-para-pintar" }
  ],
  "hogar-y-decoracion": [
    { name: "Revestimientos y Pisos", handle: "revestimientos-y-pisos" },
    { name: "Mobiliario de Baño y Cocina", handle: "mobiliario-de-bano-y-cocina" }
  ],
  "jardin-y-exteriores": [
    { name: "Muebles de Jardín", handle: "muebles-de-jardin" },
    { name: "Piscinas y Mantenimiento", handle: "piscinas-y-mantenimiento" },
    { name: "Herramientas de Jardinería", handle: "herramientas-de-jardineria" },
    { name: "Riego", handle: "riego" }
  ],
  "servicios-y-alquileres": [
    { name: "Alquiler de Maquinaria", handle: "alquiler-de-maquinaria" },
    { name: "Fletes y Envíos", handle: "fletes-y-envios" }
  ]
};

export const MAIN_COLLECTION_HANDLES = Object.keys(COLLECTION_HIERARCHY);

export function getSubcollections(parentHandle: string): Subcollection[] | undefined {
  return COLLECTION_HIERARCHY[parentHandle];
}
