import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, TabStopPosition, TabStopType
} from 'docx';
import fs from 'fs';

// ── Brand Colors ──
const BRAND = "2B9E8E";
const BRAND_LIGHT = "E8F5F2";
const DARK_TEXT = "333333";
const WHITE = "FFFFFF";
const GRAY_ALT = "F7F7F7";
const GRAY_HEADER = "F2F2F2";

// ── Table helpers ──
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// A4 content width with 1" margins: 11906 - 2*1440 = 9026 twips
const TABLE_WIDTH = 9026;

function tableHeaderCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: BRAND, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color: WHITE })]
    })]
  });
}

function tableCell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({
        text,
        font: "Arial",
        size: 20,
        bold: opts.bold || false,
        color: opts.color || DARK_TEXT
      })]
    })]
  });
}

// ── Content helpers ──
function title(text, size, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: opts.before || 0, after: opts.after || 200 },
    children: [new TextRun({
      text,
      bold: true,
      font: "Arial",
      size: size * 2, // half-points
      color: opts.color || BRAND
    })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 0, after: opts.after || 120 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({
      text,
      font: "Arial",
      size: 22,
      color: opts.color || DARK_TEXT,
      bold: opts.bold || false,
      italics: opts.italics || false,
    })]
  });
}

function labeledBody(label, text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label + " ", font: "Arial", size: 22, bold: true, color: DARK_TEXT }),
      new TextRun({ text, font: "Arial", size: 22, color: DARK_TEXT }),
    ]
  });
}

function sectionLabel(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: DARK_TEXT })]
  });
}

function bullet(text, reference = "persona-bullets") {
  return new Paragraph({
    numbering: { reference, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK_TEXT })]
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}

function accentBar() {
  // A full-width table row with brand color as a visual separator
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            shading: { fill: BRAND, type: ShadingType.CLEAR },
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: [new Paragraph({
              spacing: { before: 0, after: 0 },
              children: [new TextRun({ text: " ", font: "Arial", size: 8 })]
            })]
          })
        ]
      })
    ]
  });
}

function personaHeader(personaTitle) {
  // Light teal background header bar with persona name
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: BRAND },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: BRAND },
              left: { style: BorderStyle.SINGLE, size: 6, color: BRAND },
              right: { style: BorderStyle.NONE, size: 0 },
            },
            shading: { fill: BRAND_LIGHT, type: ShadingType.CLEAR },
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [new Paragraph({
              children: [new TextRun({
                text: personaTitle,
                font: "Arial",
                size: 36,
                bold: true,
                color: BRAND,
              })]
            })]
          })
        ]
      })
    ]
  });
}

// ── Persona builder ──
function buildPersona(persona) {
  const children = [];

  // Accent header with light teal bg
  children.push(personaHeader(persona.title));
  children.push(emptyLine());

  // Basic info fields
  for (const [label, value] of persona.info) {
    children.push(labeledBody(label, value));
  }

  // Necesidades
  children.push(sectionLabel("Necesidades:"));
  for (const item of persona.necesidades) {
    children.push(bullet(item));
  }

  // Comportamiento de compra
  children.push(sectionLabel("Comportamiento de compra:"));
  for (const item of persona.comportamiento) {
    children.push(bullet(item));
  }

  // Frustraciones
  children.push(sectionLabel("Frustraciones:"));
  for (const item of persona.frustraciones) {
    children.push(bullet(item));
  }

  // Mensaje clave
  children.push(emptyLine());
  children.push(new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: "Mensaje clave: ", font: "Arial", size: 22, bold: true, color: BRAND }),
      new TextRun({ text: `\u201C${persona.mensajeClave}\u201D`, font: "Arial", size: 22, italics: true, color: DARK_TEXT }),
    ]
  }));

  // Canales preferidos
  children.push(new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "Canales preferidos: ", font: "Arial", size: 22, bold: true, color: DARK_TEXT }),
      new TextRun({ text: persona.canales, font: "Arial", size: 22, color: DARK_TEXT }),
    ]
  }));

  return children;
}

// ── Persona Data ──
const personas = [
  {
    title: "Persona 1: Mar\u00EDa \u2014 La Cooperativista",
    info: [
      ["Nombre ficticio:", "Mar\u00EDa Rodr\u00EDguez"],
      ["Edad:", "35 a\u00F1os"],
      ["Ubicaci\u00F3n:", "Montevideo (barrio en desarrollo cooperativo)"],
      ["Ocupaci\u00F3n:", "Administrativa en empresa privada"],
      ["Situaci\u00F3n:", "Integrante de una cooperativa de ayuda mutua (FUCVAM). Participa activamente en la obra de su futura vivienda junto a otros socios."],
      ["Ingresos:", "$35.000 - $50.000 UYU/mes (ingreso familiar)"],
    ],
    necesidades: [
      "Materiales de construcci\u00F3n a precios accesibles (cemento, ladrillos, hierro, arena)",
      "Herramientas b\u00E1sicas para trabajo en obra (taladro, amoladora, nivel)",
      "Productos de terminaci\u00F3n (pinturas, cer\u00E1micos, grifer\u00EDas)",
      "Facilidades de pago (cuotas sin inter\u00E9s)",
    ],
    comportamiento: [
      "Consulta precios online antes de ir a la barraca",
      "Compara entre 3-4 proveedores",
      "Valora el env\u00EDo a obra (no tiene veh\u00EDculo grande)",
      "Compra en grupo con otros cooperativistas para conseguir descuentos por volumen",
      "Usa WhatsApp como canal principal de comunicaci\u00F3n",
    ],
    frustraciones: [
      "Precios poco transparentes en barracas tradicionales",
      "Falta de stock cuando m\u00E1s se necesita",
      "Dificultad para coordinar entregas en horarios de obra",
      "No encuentra todo en un solo lugar",
    ],
    mensajeClave: "Materiales de calidad a precios justos, con env\u00EDo directo a tu obra cooperativa",
    canales: "WhatsApp, Facebook, Instagram",
  },
  {
    title: "Persona 2: Carlos \u2014 El Profesional Independiente",
    info: [
      ["Nombre ficticio:", "Carlos Fern\u00E1ndez"],
      ["Edad:", "42 a\u00F1os"],
      ["Ubicaci\u00F3n:", "Canelones / \u00C1rea metropolitana"],
      ["Ocupaci\u00F3n:", "Alba\u00F1il y constructor independiente"],
      ["Situaci\u00F3n:", "Trabaja por cuenta propia realizando obras chicas y medianas. Tiene 2 ayudantes. Busca optimizar costos para ser m\u00E1s competitivo en presupuestos."],
      ["Ingresos:", "$40.000 - $70.000 UYU/mes (variable seg\u00FAn obras)"],
    ],
    necesidades: [
      "Materiales de construcci\u00F3n en cantidades medianas-grandes",
      "Herramientas profesionales durables (Bosch, DeWalt, Makita)",
      "Precios por volumen / descuentos para profesionales",
      "Facturaci\u00F3n (necesita facturas para deducir gastos)",
    ],
    comportamiento: [
      "Tiene proveedores \u201Cde confianza\u201D pero siempre busca mejores precios",
      "Compra semanalmente seg\u00FAn avance de obra",
      "Prefiere retirar en dep\u00F3sito o que le entreguen temprano en la ma\u00F1ana",
      "Paga en efectivo o transferencia, a veces pide cuenta corriente",
    ],
    frustraciones: [
      "Perder tiempo yendo a varias barracas",
      "Demoras en entregas que frenan la obra",
      "No poder comparar precios f\u00E1cilmente",
      "Proveedores que no tienen stock y no avisan",
    ],
    mensajeClave: "Todo lo que necesit\u00E1s para tu obra, en un solo lugar, con entrega puntual",
    canales: "WhatsApp, llamada telef\u00F3nica, b\u00FAsqueda en Google",
  },
  {
    title: "Persona 3: Laura \u2014 Propietaria que Reforma",
    info: [
      ["Nombre ficticio:", "Laura Mart\u00EDnez"],
      ["Edad:", "38 a\u00F1os"],
      ["Ubicaci\u00F3n:", "Montevideo (Pocitos / Cord\u00F3n / Malv\u00EDn)"],
      ["Ocupaci\u00F3n:", "Profesional (abogada / contadora)"],
      ["Situaci\u00F3n:", "Propietaria de apartamento que quiere renovar ba\u00F1o y cocina. Busca productos de buena calidad con dise\u00F1o moderno. No es experta en construcci\u00F3n."],
      ["Ingresos:", "$60.000 - $90.000 UYU/mes"],
    ],
    necesidades: [
      "Grifer\u00EDas, sanitarios, vanitorys modernos",
      "Cer\u00E1micos y porcelanatos de dise\u00F1o",
      "Iluminaci\u00F3n LED",
      "Asesoramiento sobre compatibilidad de productos",
    ],
    comportamiento: [
      "Investiga mucho en Instagram y Pinterest antes de comprar",
      "Busca inspiraci\u00F3n visual (fotos de ambientes)",
      "Valora reviews y opiniones de otros compradores",
      "Compra online si la experiencia es confiable y hay devoluci\u00F3n f\u00E1cil",
      "Paga con tarjeta en cuotas sin inter\u00E9s",
    ],
    frustraciones: [
      "Sitios web de barracas desactualizados y dif\u00EDciles de navegar",
      "No poder ver fotos reales de los productos instalados",
      "Falta de informaci\u00F3n t\u00E9cnica en lenguaje simple",
      "Experiencia de compra offline intimidante (ambientes masculinos, jerga t\u00E9cnica)",
    ],
    mensajeClave: "Renovar tu hogar es f\u00E1cil: eleg\u00ED, compr\u00E1 y recib\u00ED en tu puerta",
    canales: "Instagram, Google, email",
  },
  {
    title: "Persona 4: Diego \u2014 El Encargado de Compras de Cooperativa",
    info: [
      ["Nombre ficticio:", "Diego Pereira"],
      ["Edad:", "48 a\u00F1os"],
      ["Ubicaci\u00F3n:", "Interior (Salto / Paysand\u00FA / Rivera)"],
      ["Ocupaci\u00F3n:", "Docente y referente de su cooperativa"],
      ["Situaci\u00F3n:", "Es el encargado de compras de una cooperativa de 60 familias. Centraliza pedidos, negocia con proveedores y gestiona el presupuesto de obra. Tiene responsabilidad fiduciaria ante los socios."],
      ["Ingresos personales:", "$30.000 - $45.000 UYU/mes"],
      ["Presupuesto de cooperativa:", "$200.000 - $500.000 UYU/mes en materiales"],
    ],
    necesidades: [
      "Precios mayoristas con facturaci\u00F3n",
      "Entregas programadas y confiables (la obra no puede parar)",
      "Un solo proveedor que tenga variedad (reduce gesti\u00F3n)",
      "Transparencia en precios para rendir cuentas a la asamblea",
      "Cr\u00E9dito o cuenta corriente",
    ],
    comportamiento: [
      "Compara al menos 3 presupuestos antes de decidir",
      "Necesita documentaci\u00F3n formal (presupuestos escritos, facturas)",
      "Decide en asamblea o con directiva de la cooperativa",
      "Ciclo de compra largo (1-2 semanas desde consulta hasta pedido)",
      "Fideliza si el proveedor cumple",
    ],
    frustraciones: [
      "Proveedores que no env\u00EDan al interior o cobran mucho flete",
      "Falta de respuesta r\u00E1pida a consultas de presupuesto",
      "Cambios de precio sin aviso",
      "No encontrar un proveedor confiable a distancia",
    ],
    mensajeClave: "Presupuestos claros, entregas cumplidas y precios estables para tu cooperativa",
    canales: "Email, WhatsApp, llamada telef\u00F3nica",
  },
  {
    title: "Persona 5: Andr\u00E9s \u2014 El Constructor con Empresa",
    info: [
      ["Nombre ficticio:", "Andr\u00E9s Silva"],
      ["Edad:", "52 a\u00F1os"],
      ["Ubicaci\u00F3n:", "Montevideo"],
      ["Ocupaci\u00F3n:", "Director de empresa constructora (5-15 empleados)"],
      ["Situaci\u00F3n:", "Maneja 2-3 obras simult\u00E1neas. Tiene un administrativo que gestiona compras. Busca eficiencia y previsibilidad en costos."],
      ["Ingresos empresa:", "Facturaci\u00F3n $300.000 - $1.000.000 UYU/mes"],
    ],
    necesidades: [
      "Cuenta corriente con cr\u00E9dito a 30-60 d\u00EDas",
      "Cat\u00E1logo completo (no quiere usar 10 proveedores)",
      "Log\u00EDstica coordinada (entregas a m\u00FAltiples obras)",
      "Precios estables por proyecto (presupuesto cerrado)",
      "Reportes de compra para control de costos",
    ],
    comportamiento: [
      "Delega compras al administrativo",
      "Negocia condiciones una vez y espera que se mantengan",
      "Valora la relaci\u00F3n comercial a largo plazo",
      "Quiere un ejecutivo de cuenta dedicado",
      "Paga por transferencia, necesita factura electr\u00F3nica",
    ],
    frustraciones: [
      "Perder tiempo en gesti\u00F3n de compras",
      "Proveedores que fallan en entregas y frenan la obra",
      "No tener visibilidad de consumo por obra",
      "Falta de profesionalismo en el sector",
    ],
    mensajeClave: "Un socio digital para tu empresa constructora: cat\u00E1logo, cr\u00E9dito y log\u00EDstica en una sola plataforma",
    canales: "Email, reuni\u00F3n comercial, portal web",
  },
];

// ── Summary Table Data ──
const summaryHeaders = ["Persona", "Segmento", "Ticket Promedio", "Frecuencia", "Canal Principal", "Prioridad"];
const summaryRows = [
  ["Mar\u00EDa", "Cooperativista individual", "$5.000-15.000", "Quincenal", "WhatsApp", "Alta"],
  ["Carlos", "Profesional independiente", "$10.000-30.000", "Semanal", "WhatsApp/Google", "Alta"],
  ["Laura", "Propietaria que reforma", "$15.000-50.000", "Puntual", "Instagram/Google", "Media"],
  ["Diego", "Encargado de cooperativa", "$200.000-500.000", "Mensual", "Email/WhatsApp", "Muy Alta"],
  ["Andr\u00E9s", "Empresa constructora", "$300.000-1.000.000", "Continuo", "Email/Portal", "Alta"],
];

// ── Column widths for summary table ──
const colW = [1200, 1800, 1500, 1200, 1700, 1200]; // ~8600 total

// ── Build Document ──
const children = [];

// ===== COVER / TITLE SECTION =====
children.push(new Paragraph({ spacing: { before: 2400, after: 0 }, children: [] }));

// Brand accent bar at top
children.push(accentBar());
children.push(new Paragraph({ spacing: { before: 400, after: 0 }, children: [] }));

// Title
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [new TextRun({
    text: "Buyer Personas",
    font: "Arial",
    size: 56,
    bold: true,
    color: BRAND,
  })]
}));

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 },
  children: [new TextRun({
    text: "CompraHogar",
    font: "Arial",
    size: 44,
    bold: true,
    color: DARK_TEXT,
  })]
}));

// Accent bar below title
children.push(new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }));
children.push(accentBar());
children.push(new Paragraph({ spacing: { before: 300, after: 0 }, children: [] }));

// Subtitle
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [new TextRun({
    text: "Perfiles de cliente ideal para estrategia comercial y de marketing",
    font: "Arial",
    size: 24,
    color: "666666",
    italics: true,
  })]
}));

// Date
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 600 },
  children: [new TextRun({
    text: "Abril 2026",
    font: "Arial",
    size: 22,
    color: "888888",
  })]
}));

// Page break after cover
children.push(new Paragraph({
  children: [new PageBreak()]
}));

// ===== CONTEXTO DE MERCADO =====
children.push(title("Contexto de Mercado", 16, { before: 200 }));
children.push(body(
  "Uruguay cuenta con m\u00E1s de 50.000 familias organizadas en cooperativas de vivienda (FUCVAM, FECOVI y otras federaciones), un sector en constante crecimiento que demanda materiales de construcci\u00F3n, herramientas y productos para el hogar de forma recurrente. A esto se suman profesionales independientes del sector construcci\u00F3n y propietarios que realizan mejoras en sus viviendas. CompraHogar se posiciona como el canal digital que conecta estos segmentos con proveedores de calidad.",
  { after: 400 }
));

// ===== PERSONAS =====
for (let i = 0; i < personas.length; i++) {
  if (i > 0) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }
  children.push(...buildPersona(personas[i]));
}

// Page break before summary
children.push(new Paragraph({ children: [new PageBreak()] }));

// ===== RESUMEN ESTRATEGICO =====
children.push(title("Resumen Estrat\u00E9gico", 16, { before: 200 }));
children.push(emptyLine());

// Summary table
const headerRow = new TableRow({
  tableHeader: true,
  children: summaryHeaders.map((h, i) => tableHeaderCell(h, colW[i])),
});

const dataRows = summaryRows.map((row, rowIdx) => {
  const shading = rowIdx % 2 === 1 ? GRAY_ALT : undefined;
  return new TableRow({
    children: row.map((cellText, colIdx) => tableCell(cellText, colW[colIdx], {
      shading,
      bold: colIdx === 0,
      align: colIdx >= 2 ? AlignmentType.CENTER : AlignmentType.LEFT,
    })),
  });
});

children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [headerRow, ...dataRows],
}));

children.push(emptyLine());
children.push(emptyLine());

// Final paragraph
children.push(body(
  "Las cooperativas de vivienda representan el segmento de mayor potencial estrat\u00E9gico para CompraHogar: 50.000+ familias con necesidades recurrentes, compras centralizadas de alto volumen, y un modelo de fidelizaci\u00F3n natural basado en la confianza y el cumplimiento.",
  { bold: false, after: 200, italics: true }
));


// ── Create Document ──
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22, color: DARK_TEXT }
      }
    },
  },
  numbering: {
    config: [
      {
        reference: "persona-bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        // A4
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND, space: 4 } },
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "CompraHogar", bold: true, font: "Arial", size: 20, color: BRAND }),
            new TextRun({ text: "  \u2014  Buyer Personas", font: "Arial", size: 20, color: "888888" }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } },
          children: [
            new TextRun({ text: "CompraHogar \u2014 Chelabs | P\u00E1gina ", font: "Arial", size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" }),
          ]
        })]
      })
    },
    children,
  }]
});

// ── Write File ──
const OUTPUT = "C:/Users/Estudiante UCU/Desktop/CompraHogar - Buyer Personas.docx";

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(OUTPUT, buffer);
console.log(`Document created: ${OUTPUT}`);
console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
