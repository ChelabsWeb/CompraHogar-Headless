// Landing pages por zona — ataque al query local transaccional.
// Cada zona genera una URL /zonas/{slug} con contenido y schema LocalBusiness
// orientado a una geografía específica de Uruguay.

export interface ZoneContent {
  slug: string;
  name: string;
  fullName: string;
  intro: string;
  deliveryInfo: {
    timing: string;
    minOrder?: string;
    freeShippingThreshold?: string;
    zones: string[];
  };
  whyUs: Array<{ title: string; body: string }>;
  faq: Array<{ question: string; answer: string }>;
  // Para OG image y schema
  coordinates?: { lat: number; lng: number };
}

export const ZONE_CONTENT: Record<string, ZoneContent> = {
  montevideo: {
    slug: "montevideo",
    name: "Montevideo",
    fullName: "Ferretería online en Montevideo",
    intro:
      "¿Buscás ferretería online en Montevideo con entrega rápida? CompraHogar te lleva materiales de construcción, herramientas, sanitaria, electricidad y pinturas a cualquier barrio de la capital en 24-48 horas. Desde Pocitos hasta Piedras Blancas, desde Centro hasta Carrasco — pagás online, recibís en tu puerta y hasta tenés 12 cuotas sin interés.",
    deliveryInfo: {
      timing: "24-48 horas hábiles",
      minOrder: "No tenemos monto mínimo para barrios de Montevideo.",
      freeShippingThreshold: "Envío gratis en compras mayores a $4.500.",
      zones: [
        "Pocitos",
        "Cordón",
        "Centro",
        "Ciudad Vieja",
        "Palermo",
        "Parque Rodó",
        "Punta Carretas",
        "Buceo",
        "Malvín",
        "Carrasco",
        "Punta Gorda",
        "Prado",
        "Aguada",
        "La Blanqueada",
        "Tres Cruces",
        "Maroñas",
        "Cerro",
        "Piedras Blancas",
        "Sayago",
        "Colón",
      ],
    },
    whyUs: [
      {
        title: "Entrega al día siguiente en la mayoría de los barrios",
        body: "Si hacés tu pedido antes del mediodía de un día hábil, en la mayoría de los casos lo recibís al día siguiente. Para Ciudad Vieja, Centro, Cordón y Pocitos, tenemos ventanas de entrega matutinas y vespertinas para que no tengas que esperar todo el día.",
      },
      {
        title: "Todos los medios de pago uruguayos",
        body: "Aceptamos todas las tarjetas de crédito con hasta 12 cuotas sin interés, débito, Mercado Pago, Abitab, RedPagos, OCA Blue y transferencia bancaria. Si sos cliente mayorista, armamos cuenta corriente.",
      },
      {
        title: "Soporte humano por WhatsApp",
        body: "¿Dudas sobre qué herramienta elegir, cuánto pegamento necesitás para colocar cerámicos en 30 m², o si una pintura es para exterior? Escribinos por WhatsApp y te respondemos un humano, no un bot.",
      },
    ],
    faq: [
      {
        question: "¿Cuánto tarda un envío a Montevideo?",
        answer:
          "Entre 24 y 48 horas hábiles. Los pedidos hechos antes del mediodía de lunes a viernes se despachan el mismo día y llegan al día siguiente en la mayoría de los barrios.",
      },
      {
        question: "¿Hacen entregas el mismo día en Montevideo?",
        answer:
          "Para pedidos urgentes dentro del anillo central de Montevideo (Centro, Cordón, Pocitos, Ciudad Vieja, Parque Rodó), podemos coordinar entrega el mismo día con un adicional de flete express. Consultanos por WhatsApp.",
      },
      {
        question: "¿Hay envío gratis?",
        answer:
          "Sí. En compras mayores a $4.500 el envío a Montevideo es sin cargo.",
      },
      {
        question: "¿Puedo retirar en una sucursal?",
        answer:
          "Trabajamos 100% online con envío a domicilio. No tenemos local físico de retiro, lo que nos permite ofrecer mejores precios y comodidad.",
      },
    ],
    coordinates: { lat: -34.9011, lng: -56.1645 },
  },

  canelones: {
    slug: "canelones",
    name: "Canelones",
    fullName: "Ferretería online con envíos a Canelones",
    intro:
      "Tu ferretería online en Canelones con envío a domicilio en 24-48 horas. CompraHogar llega a Ciudad de la Costa, Las Piedras, Pando, La Paz, Canelones ciudad, Santa Lucía, Atlántida y todas las localidades del departamento. Comprás desde tu casa y recibís materiales de construcción, herramientas, sanitaria, pinturas y más, con hasta 12 cuotas sin interés.",
    deliveryInfo: {
      timing: "24-48 horas hábiles",
      freeShippingThreshold: "Envío gratis en compras mayores a $6.500.",
      zones: [
        "Ciudad de la Costa",
        "Solymar",
        "Lagomar",
        "Lomas de Solymar",
        "El Pinar",
        "Shangrilá",
        "Las Piedras",
        "La Paz",
        "Pando",
        "Canelones (capital)",
        "Santa Lucía",
        "Atlántida",
        "Parque del Plata",
        "Salinas",
        "Progreso",
        "Sauce",
        "Toledo",
      ],
    },
    whyUs: [
      {
        title: "Cobertura completa en el departamento",
        body: "Entregamos en todo Canelones, desde la zona costera (Ciudad de la Costa, Atlántida, Salinas) hasta el interior (Santa Lucía, Tala, San Ramón). Coordinamos flete según volumen del pedido.",
      },
      {
        title: "Pensado para obras y reformas",
        body: "Muchos de nuestros clientes de Canelones están haciendo obra o ampliación. Tenemos precios mayoristas para cemento, hierro, bloques y áridos con entrega coordinada directamente a la obra.",
      },
      {
        title: "Atención comercial local",
        body: "Nuestro equipo conoce las particularidades de cada localidad — qué zonas tienen caminos rurales, dónde hay restricción de camiones en temporada alta, etc. — y coordina las entregas según el caso.",
      },
    ],
    faq: [
      {
        question: "¿Cuánto cuesta el envío a Ciudad de la Costa?",
        answer:
          "El envío tiene costo fijo según zona. En compras mayores a $6.500, el envío a Canelones es gratis. Para pedidos menores, consultá el costo exacto al finalizar la compra.",
      },
      {
        question: "¿Entregan en obras dentro de Canelones?",
        answer:
          "Sí. Para pedidos grandes de obra (cementos, hierros, áridos) coordinamos flete directo a la obra con descarga incluida. Escribinos por WhatsApp con la ubicación y el detalle del pedido.",
      },
      {
        question: "¿Hacen envíos a Atlántida y Parque del Plata en temporada?",
        answer:
          "Sí, todo el año. En temporada alta (diciembre a febrero) los plazos pueden extenderse 24hs adicionales por mayor volumen.",
      },
    ],
    coordinates: { lat: -34.5225, lng: -56.2772 },
  },

  "maldonado-y-costa": {
    slug: "maldonado-y-costa",
    name: "Maldonado y Costa",
    fullName: "Ferretería online en Maldonado, Punta del Este y zona costera",
    intro:
      "Ferretería online con envío a Maldonado, Punta del Este, Piriápolis y toda la costa uruguaya. CompraHogar llega a Maldonado capital, La Barra, Manantiales, José Ignacio, Piriápolis, Solís, Punta Ballena, Pinares y zonas aledañas. Ideal para propietarios, arquitectos y constructoras que necesitan materiales de calidad sin moverse de obra.",
    deliveryInfo: {
      timing: "2-4 días hábiles",
      freeShippingThreshold: "Envío gratis en compras mayores a $12.000.",
      zones: [
        "Maldonado (capital)",
        "Punta del Este",
        "La Barra",
        "Manantiales",
        "José Ignacio",
        "Punta Ballena",
        "Pinares",
        "San Rafael",
        "Piriápolis",
        "Solís",
        "Bella Vista",
        "Pan de Azúcar",
      ],
    },
    whyUs: [
      {
        title: "Especialistas en obra de temporada",
        body: "Sabemos que en la costa muchas obras arrancan en julio-agosto para estar listas en diciembre. Coordinamos entregas con tiempos ajustados para que no se te atrase la obra por falta de material.",
      },
      {
        title: "Precio fijo sin recargo por distancia",
        body: "Los precios de nuestros productos son los mismos para Maldonado que para Montevideo — no hay recargo por estar en la costa. Solo el flete se calcula según zona y volumen.",
      },
      {
        title: "Coordinación con arquitectos y constructoras",
        body: "Trabajamos con estudios de arquitectura y empresas constructoras de la zona. Podemos emitir facturación empresarial, coordinar entregas múltiples y manejar cuenta corriente para clientes recurrentes.",
      },
    ],
    faq: [
      {
        question: "¿Cuánto tarda un envío a Punta del Este?",
        answer:
          "Entre 2 y 4 días hábiles según la zona específica dentro de Maldonado. Para José Ignacio y zonas más alejadas, los plazos pueden ser 4-5 días.",
      },
      {
        question: "¿Entregan en La Barra y Manantiales?",
        answer:
          "Sí. Llegamos a La Barra, Manantiales y José Ignacio con la misma frecuencia que al resto de Maldonado, aunque los plazos pueden extenderse un día adicional.",
      },
      {
        question: "¿Tienen descuentos para obras grandes?",
        answer:
          "Sí. Para presupuestos mayores a cierto volumen (consultar con nuestro equipo comercial), ofrecemos descuentos mayoristas y condiciones especiales de pago.",
      },
    ],
    coordinates: { lat: -34.9037, lng: -54.9476 },
  },
};

export const ZONE_SLUGS = Object.keys(ZONE_CONTENT);

export function getZoneContent(slug: string): ZoneContent | undefined {
  return ZONE_CONTENT[slug];
}
