// Contenido SEO por colección. Se renderiza al pie de cada página de categoría
// para darle volumen semántico y keywords long-tail que Shopify no provee.
// Mantener tono natural uruguayo — Google castiga keyword stuffing.

export interface SeoContentSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CollectionSeoContent {
  intro: string;
  sections: SeoContentSection[];
  faq?: Array<{ question: string; answer: string }>;
}

export const COLLECTION_SEO_CONTENT: Record<string, CollectionSeoContent> = {
  "construccion-y-materiales": {
    intro:
      "Todo lo que necesitás para tu obra en un solo lugar. En CompraHogar encontrás materiales de construcción en Uruguay al mejor precio: cemento, hierro, bloques, áridos, impermeabilizantes y aditivos de las marcas más confiables del mercado. Trabajamos con constructoras, albañiles y propietarios en Montevideo, Canelones y todo el interior, con envíos en 24-48 horas y hasta 12 cuotas sin interés.",
    sections: [
      {
        heading: "Qué incluye nuestra sección de construcción",
        paragraphs: [
          "Cubrimos todas las etapas de una obra desde los cimientos hasta la terminación. Tenemos disponibilidad constante de cemento Portland, Ancap y UCLA, hierros de construcción nervados del 6mm al 20mm, mallas electrosoldadas, bloques de hormigón y cerámicos, áridos clasificados (arena, pedregullo, balasto) e impermeabilizantes asfálticos y acrílicos.",
        ],
        bullets: [
          "Cementos y Cal — Portland comercial, blanco, cal hidratada",
          "Hierros y Mallas — barras nervadas, mallas 15x15 y 10x10, alambre",
          "Ladrillos y Bloques — hormigón, cerámicos, ticholo",
          "Áridos — arena fina, gruesa, pedregullo, balasto",
          "Impermeabilizantes — membranas asfálticas, emulsiones acrílicas",
          "Aditivos — plastificantes, acelerantes, hidrófugos",
        ],
      },
      {
        heading: "Precios mayoristas para obras y constructoras",
        paragraphs: [
          "Si estás construyendo una vivienda, haciendo una ampliación o gestionando varias obras a la vez, tenemos condiciones especiales para compras por volumen. Contactá a nuestro equipo comercial por WhatsApp y armamos un presupuesto a medida con fletes coordinados a tu obra.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Hacen envíos de materiales de construcción a todo Uruguay?",
        answer:
          "Sí. Entregamos en Montevideo y Canelones en 24-48hs, y al resto del país en 3-5 días hábiles. Para pedidos grandes coordinamos flete directo a obra.",
      },
      {
        question: "¿Qué marcas de cemento manejan?",
        answer:
          "Trabajamos con ANCAP, Portland comercial y blanco, además de cementos especiales para albañilería según disponibilidad.",
      },
    ],
  },

  "herramientas-y-maquinaria": {
    intro:
      "Las mejores herramientas para profesionales y aficionados. En CompraHogar vas a encontrar herramientas eléctricas, manuales, de medición y equipamiento de seguridad industrial de marcas líderes como Bosch, DeWalt, Makita, Black+Decker, Stanley y Truper. Todas con garantía oficial, envíos a todo Uruguay en 24-48hs y hasta 12 cuotas sin interés con tu tarjeta.",
    sections: [
      {
        heading: "Herramientas eléctricas para cada proyecto",
        paragraphs: [
          "Desde un taladro percutor para colgar un cuadro hasta una sierra de banco para tu taller profesional. Contamos con taladros atornilladores (con y sin cable), amoladoras angulares de 4.5\" y 7\", sierras circulares, sierras caladoras, lijadoras orbitales, martillos rotopercutores y más.",
        ],
        bullets: [
          "Herramientas Eléctricas — taladros, amoladoras, sierras, lijadoras",
          "Herramientas Manuales — llaves, destornilladores, martillos, pinzas",
          "Medición y Trazado — niveles láser, cintas métricas, plomadas",
          "Seguridad Industrial — cascos, guantes, botines, arneses",
          "Accesorios — mechas, discos, hojas de sierra, brocas",
        ],
      },
      {
        heading: "¿No sabés qué herramienta elegir?",
        paragraphs: [
          "Si sos profesional de la construcción, un taladro de 18V con dos baterías te cambia el día. Si es para uso ocasional en casa, una opción de 12V con maletín y kit de mechas básico es suficiente y mucho más económico. En dudas, escribinos por WhatsApp y te asesoramos sin compromiso.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Las herramientas tienen garantía oficial?",
        answer:
          "Sí, todas nuestras herramientas Bosch, DeWalt, Makita y Stanley vienen con garantía oficial del fabricante válida en Uruguay.",
      },
      {
        question: "¿Puedo alquilar herramientas en vez de comprarlas?",
        answer:
          "Sí, para equipos grandes (hormigoneras, andamios, compactadoras) tenemos una sección de alquiler. Revisá /collections/servicios-y-alquileres.",
      },
    ],
  },

  "electricidad-e-iluminacion": {
    intro:
      "Productos eléctricos y de iluminación certificados para instalaciones seguras. En CompraHogar encontrás cables, tableros, protecciones térmicas, diferenciales e iluminación LED para tu casa, local u obra. Todo con normativa UTE, envíos en 24-48hs a todo Uruguay y cuotas sin interés.",
    sections: [
      {
        heading: "Materiales eléctricos para instalaciones nuevas y reformas",
        paragraphs: [
          "Tenemos toda la línea de cables unipolares y multipolares de 1.5, 2.5, 4 y 6 mm², tableros de distribución de 4 a 36 polos, llaves térmicas, interruptores diferenciales (disyuntores) certificados, tomacorrientes, llaves de luz y canalizaciones.",
        ],
        bullets: [
          "Cables y Conductores — unipolar, multipolar, subterráneo, calibres varios",
          "Tableros y Protecciones — térmicas, diferenciales, tableros armados",
          "Iluminación LED — plafones, dicroicas, paneles, reflectores, tiras",
        ],
      },
      {
        heading: "Iluminación LED para bajar el consumo",
        paragraphs: [
          "Cambiar a iluminación LED puede reducir hasta un 80% el consumo eléctrico de tu hogar. Tenemos desde lámparas E27 para reemplazo directo hasta paneles LED de techo, dicroicas empotrables, plafones decorativos y reflectores exteriores con sensor de movimiento.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Los productos cumplen con la normativa UTE?",
        answer:
          "Sí, todos nuestros materiales eléctricos están homologados y cumplen con las normas técnicas exigidas por UTE en Uruguay.",
      },
    ],
  },

  "sanitaria-y-griferia": {
    intro:
      "Sanitaria, grifería y todo para tu instalación de agua. En CompraHogar tenés caños PPR, PVC y de cobre, griferías monocomando y convencionales, loza sanitaria (inodoros, bidets, lavatorios), bombas de agua, tanques y cisternas. Marcas reconocidas en Uruguay como Ferrum, Hydromet, Roca y Cromcol. Envíos en 24-48hs y cuotas sin interés.",
    sections: [
      {
        heading: "Todo para tu instalación sanitaria",
        paragraphs: [
          "Cubrimos desde el caño de alimentación principal hasta el último grifo de la cocina. Trabajamos con termofusión PPR (el estándar actual en Uruguay), PVC de desagüe y cobre para instalaciones especiales. Si estás cambiando el baño completo, tenemos combos de loza sanitaria con descuento.",
        ],
        bullets: [
          "Caños y Conexiones — PPR, PVC, cobre, accesorios de termofusión",
          "Grifería — monocomando, clásica, de cocina, de baño, de ducha",
          "Loza Sanitaria — inodoros, bidets, lavatorios, piletas",
          "Bombas de Agua — presurizadoras, sumergibles, periféricas",
          "Tanques y Cisternas — polietileno, de acero, aljibes",
        ],
      },
      {
        heading: "Presión de agua baja en casa: qué hacer",
        paragraphs: [
          "Si tenés baja presión en la ducha o el termotanque no enciende bien, probablemente necesitás una bomba presurizadora. Tenemos modelos desde 0.5HP para casa de 2 baños hasta 1HP para casas grandes o duplex. Instalación sencilla, con llave de paso y retención incluidos.",
        ],
      },
    ],
  },

  "pinturas-y-acabados": {
    intro:
      "Pinturas para interior, exterior y terminaciones profesionales. En CompraHogar encontrás pintura látex, esmalte sintético, pintura para techos, impregnantes para madera, barnices y todos los accesorios necesarios para que tu trabajo quede impecable. Marcas como Inca, Sherwin-Williams, Suvinil y Glasurit, con envío en 24-48hs y cuotas sin interés.",
    sections: [
      {
        heading: "Elegí la pintura correcta para cada superficie",
        paragraphs: [
          "No es lo mismo pintar una pared interior que un muro expuesto al sol y la lluvia en Uruguay. Para interiores, el látex acrílico lavable es la opción más popular: cubre bien, seca rápido y se limpia con agua. Para exteriores, necesitás pinturas con mayor resistencia a UV y humedad — recomendamos látex 100% acrílico o pintura para techos elastomérica si tenés filtraciones.",
        ],
        bullets: [
          "Pinturas de Interior — látex lavable, al agua, mate o satinado",
          "Pinturas de Exterior — acrílicas 100%, para techos, anti-humedad",
          "Accesorios para Pintar — rodillos, pinceles, bandejas, cintas, masilla",
        ],
      },
      {
        heading: "¿Cuánta pintura necesitás?",
        paragraphs: [
          "Como regla general, 1 litro de látex cubre entre 10 y 12 m² en dos manos. Para una habitación de 4×4 con techo de 2.60m necesitás aproximadamente 6 litros. Si la superficie está en mal estado o nunca fue pintada, sumá un 20% extra.",
        ],
      },
    ],
  },

  "hogar-y-decoracion": {
    intro:
      "Revestimientos, pisos y mobiliario para transformar tu hogar. En CompraHogar encontrás cerámicas, porcelanatos, pisos laminados, vinílicos, muebles para baño y cocina. Todo con calidad garantizada, envíos en 24-48hs a todo Uruguay y hasta 12 cuotas sin interés con tu tarjeta.",
    sections: [
      {
        heading: "Revestimientos y pisos para cada ambiente",
        paragraphs: [
          "Para cocinas y baños recomendamos porcelanato rectificado por su resistencia a la humedad y facilidad de limpieza. Para living y dormitorios, el piso laminado AC4 es una excelente relación precio-calidad: se instala sin obra, dura años y es fácil de reemplazar si se daña una tabla.",
        ],
        bullets: [
          "Revestimientos y Pisos — cerámicos, porcelanato, laminado, vinílico",
          "Mobiliario de Baño y Cocina — vanitorys, alacenas, mesadas",
        ],
      },
    ],
  },

  "jardin-y-exteriores": {
    intro:
      "Todo para tu jardín, parrilla y espacio al aire libre. En CompraHogar tenés muebles de jardín, piscinas armables y de estructura, herramientas de jardinería, sistemas de riego y mantenimiento para piletas. Perfecto para disfrutar del verano uruguayo con calidad y precio.",
    sections: [
      {
        heading: "Equipate para el jardín",
        paragraphs: [
          "Desde una bordeadora eléctrica para el pasto hasta una pileta de chapa para 4 personas, cubrimos las necesidades más comunes del hogar uruguayo. Si tenés jardín grande, una cortadora de pasto con motor a explosión te ahorra horas; para patios chicos, una eléctrica con cable o batería es suficiente.",
        ],
        bullets: [
          "Muebles de Jardín — sillones, mesas, reposeras, sombrillas",
          "Piscinas y Mantenimiento — armables, bombas, cloro, limpiafondos",
          "Herramientas de Jardinería — bordeadoras, cortadoras, palas, tijeras",
          "Riego — mangueras, aspersores, riego por goteo, temporizadores",
        ],
      },
    ],
  },

  "servicios-y-alquileres": {
    intro:
      "Alquiler de maquinaria y equipos para obra sin comprar. En CompraHogar podés alquilar hormigoneras, andamios tubulares, compactadoras, martillos eléctricos y herramientas especializadas por día, semana o mes. Ideal si tenés una obra puntual y no querés invertir en un equipo que vas a usar una sola vez.",
    sections: [
      {
        heading: "Equipos disponibles para alquilar",
        paragraphs: [
          "Trabajamos con unidades revisadas y mantenidas. Incluye entrega y retiro en la zona metropolitana. Para obras más grandes coordinamos logística al interior.",
        ],
        bullets: [
          "Alquiler de Maquinaria — hormigoneras, compactadoras, grupos electrógenos",
          "Andamios y Estructuras — andamios tubulares, caballetes, rampas",
          "Herramientas Especializadas — rotomartillos grandes, soldadoras",
          "Fletes y Transporte — coordinación de flete para tu obra",
          "Servicios de Mano de Obra — conectamos con albañiles y profesionales",
          "Contenedores y Limpieza — volquetas para escombros, limpieza post-obra",
        ],
      },
    ],
  },
};

export function getCollectionSeoContent(handle: string): CollectionSeoContent | undefined {
  return COLLECTION_SEO_CONTENT[handle];
}
