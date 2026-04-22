import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, AlignmentType, BorderStyle, WidthType, ShadingType,
  ExternalHyperlink, PageBreak } from "docx";
import fs from "fs";

// === BRAND COLORS ===
const TEAL = "2B9E8E";
const DARK = "333333";
const GRAY = "666666";
const LIGHT_BG = "F5F5F5";
const ACCENT_BG = "E8F5F2";
const WHITE = "FFFFFF";
const FONT = "Arial";

// === SIZING (A4 in twips: 11906 x 16838) ===
const A4_WIDTH = 11906;
const A4_HEIGHT = 16838;
const MARGIN = 1440; // 1 inch = 1440 twips
const CONTENT_WIDTH = A4_WIDTH - (MARGIN * 2); // ~9026 twips

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// Load logo
const logoPath = "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless/public/logo.png";
const logo = fs.readFileSync(logoPath);

// === HELPER FUNCTIONS ===

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 300, after: 160 },
    children: [
      new TextRun({ text, size: 32, bold: true, color: TEAL, font: FONT }) // 16pt = 32 half-pts
    ]
  });
}

function bodyText(text, options = {}) {
  return new Paragraph({
    spacing: { after: options.after || 120 },
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({ text, size: 22, color: DARK, font: FONT, ...options.run }) // 11pt = 22 half-pts
    ]
  });
}

function spacer(after = 200) {
  return new Paragraph({ spacing: { after }, children: [] });
}

function createBenefitCell(title, desc) {
  return new TableCell({
    borders: noBorders,
    width: { size: Math.floor(CONTENT_WIDTH / 2), type: WidthType.DXA },
    shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 180, right: 180 },
    children: [
      new Paragraph({ spacing: { after: 60 }, children: [
        new TextRun({ text: title, size: 22, bold: true, color: TEAL, font: FONT })
      ]}),
      new Paragraph({ children: [
        new TextRun({ text: desc, size: 20, color: GRAY, font: FONT })
      ]})
    ]
  });
}

function createSegmentRow(number, title, description) {
  return new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: 600, type: WidthType.DXA },
        shading: { fill: TEAL, type: ShadingType.CLEAR },
        verticalAlign: "center",
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: number, size: 24, bold: true, color: WHITE, font: FONT })
          ]})
        ]
      }),
      new TableCell({
        borders: noBorders,
        width: { size: CONTENT_WIDTH - 600, type: WidthType.DXA },
        shading: { fill: ACCENT_BG, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        children: [
          new Paragraph({ spacing: { after: 40 }, children: [
            new TextRun({ text: title, size: 22, bold: true, color: DARK, font: FONT })
          ]}),
          new Paragraph({ children: [
            new TextRun({ text: description, size: 20, color: GRAY, font: FONT })
          ]})
        ]
      })
    ]
  });
}

// === BUILD DOCUMENT ===

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: FONT, size: 22, color: DARK } }
    }
  },
  sections: [
    // ==================== PAGE 1 ====================
    {
      properties: {
        page: {
          size: { width: A4_WIDTH, height: A4_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
        }
      },
      children: [
        // === LOGO ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new ImageRun({
              type: "png",
              data: logo,
              transformation: { width: 200, height: 118 },
              altText: { title: "CompraHogar", description: "Logo CompraHogar", name: "logo" }
            })
          ]
        }),

        // === DIVIDER LINE ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 250 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: TEAL, space: 8 } },
          children: []
        }),

        // === TITLE ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "Propuesta de Alianza Comercial", size: 48, bold: true, color: TEAL, font: FONT }) // 24pt
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 350 },
          children: [
            new TextRun({ text: "Documento informativo para proveedores", size: 24, color: GRAY, italics: true, font: FONT })
          ]
        }),

        // === QUIENES SOMOS ===
        sectionHeading("Quiénes Somos"),

        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "CompraHogar", bold: true, color: TEAL, size: 22, font: FONT }),
            new TextRun({ text: " es una plataforma de e-commerce uruguaya especializada en materiales de construcción, herramientas, sanitaria, electricidad y productos para el hogar.", size: 22, color: DARK, font: FONT })
          ]
        }),

        new Paragraph({
          spacing: { after: 240 },
          children: [
            new TextRun({ text: "Operamos con un modelo headless de última generación: nuestra tienda online está construida con tecnología de punta, ofreciendo una experiencia de compra rápida, moderna y optimizada para dispositivos móviles.", size: 22, color: DARK, font: FONT })
          ]
        }),

        // === NUESTRA VISION ===
        sectionHeading("Nuestra Visión"),

        new Paragraph({
          spacing: { after: 240 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: "Ser la referencia online en materiales de construcción y hogar en Uruguay, conectando proveedores con miles de clientes finales y profesionales. Creado por uruguayos, para uruguayos: entendemos el mercado local, los tiempos de obra y las necesidades reales del sector.", size: 22, color: DARK, font: FONT })
          ]
        }),

        // === PUBLICO OBJETIVO (NEW SECTION) ===
        sectionHeading("Público Objetivo"),

        bodyText("CompraHogar llega a un mercado amplio y en crecimiento, con foco en los siguientes segmentos:", { after: 180 }),

        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          rows: [
            createSegmentRow(
              "1",
              "Familias en cooperativas de vivienda",
              "Más de 50.000 familias integran cooperativas de vivienda en Uruguay, con necesidades constantes de materiales de construcción, herramientas y productos para el hogar. Este segmento representa un mercado cautivo y recurrente."
            ),
            // Spacer row
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 600, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 60 }, children: [] })] }),
              new TableCell({ borders: noBorders, width: { size: CONTENT_WIDTH - 600, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 60 }, children: [] })] })
            ]}),
            createSegmentRow(
              "2",
              "Profesionales de la construcción",
              "Albañiles, electricistas, sanitarios y pintores que buscan herramientas y materiales de calidad a precios competitivos."
            ),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 600, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 60 }, children: [] })] }),
              new TableCell({ borders: noBorders, width: { size: CONTENT_WIDTH - 600, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 60 }, children: [] })] })
            ]}),
            createSegmentRow(
              "3",
              "Propietarios que reforman su hogar",
              "Familias y particulares que encaran reformas y mejoras, desde pequeñas reparaciones hasta renovaciones completas."
            ),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 600, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 60 }, children: [] })] }),
              new TableCell({ borders: noBorders, width: { size: CONTENT_WIDTH - 600, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 60 }, children: [] })] })
            ]}),
            createSegmentRow(
              "4",
              "Empresas constructoras y contratistas",
              "Empresas que requieren volúmenes regulares de materiales y valoran la eficiencia de compra digital."
            )
          ]
        }),

        spacer(240),

        // === POR QUE ASOCIARSE ===
        sectionHeading("Por qué asociarse con CompraHogar"),

        ...[
          ["Canal digital propio", "Sus productos estarán exhibidos en una tienda online profesional diseñada específicamente para convertir visitas en ventas. Cada producto cuenta con su propia ficha detallada, imágenes de alta calidad, descripción técnica y posicionamiento SEO optimizado para que los compradores lo encuentren fácilmente a través de Google. Usted no necesita montar ni mantener su propio sitio web: nosotros nos encargamos de todo el frente digital mientras usted se concentra en lo que sabe hacer."],
          ["Alcance nacional", "Llegamos a todo Uruguay con una red logística confiable, con envíos en 24 a 48 horas a Montevideo y área metropolitana, y cobertura al interior del país mediante agencias y transporte especializado. Esto significa que sus productos pueden venderse en cualquier punto del territorio nacional sin que usted tenga que ocuparse de la distribución, el embalaje ni la coordinación con transportistas."],
          ["Marketing incluido", "Invertimos permanentemente en campañas de marketing digital para atraer compradores reales a la plataforma. Esto incluye presencia activa en Instagram, Facebook y TikTok, anuncios en Google Ads segmentados por categoría y zona geográfica, y envíos periódicos de email marketing a una base creciente de clientes registrados. Sus productos formarán parte de este flujo de exposición constante sin que usted deba destinar presupuesto publicitario propio."],
          ["Tecnología de punta", "Nuestra plataforma está construida con Next.js y Shopify, dos de las tecnologías más utilizadas por las marcas líderes del comercio electrónico a nivel mundial. Esto garantiza tiempos de carga rápidos, una experiencia de compra fluida tanto en computadora como en celular, y los más altos estándares de seguridad en pagos y protección de datos del cliente. Una tienda técnicamente sólida es lo que diferencia a las marcas que venden de las que solo existen."],
          ["Sin inversión inicial", "Asociarse con CompraHogar no implica ningún desembolso inicial para usted. No hay costos de alta, no hay mensualidades fijas, no hay que contratar un equipo técnico ni comprar licencias de software. Nosotros asumimos toda la inversión y la complejidad operativa del canal digital, y usted paga únicamente en función de los resultados concretos que el canal genera. Es una forma simple y de bajo riesgo de expandir su alcance comercial."],
          ["Reportes y métricas", "Tendrá acceso a información de venta actualizada en tiempo real: qué productos están saliendo más, cuáles tienen mejor tasa de conversión, qué búsquedas hacen los usuarios y cómo se comportan los compradores por región. Estos datos le permiten tomar decisiones de stock, precio y producción con fundamento real, algo que las ventas tradicionales en mostrador simplemente no pueden entregar con el mismo nivel de detalle."]
        ].map(([title, desc]) => new Paragraph({
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({ text: `${title}. `, bold: true, color: DARK, size: 22, font: FONT }),
            new TextRun({ text: desc, size: 22, color: DARK, font: FONT })
          ]
        })),

        spacer(80),

        // Page break before page 2
        new Paragraph({
          children: [new PageBreak()]
        }),

        // ==================== PAGE 2 ====================

        // === SUMATE A COMPRAHOGAR ===
        spacer(400),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Sumate a CompraHogar", size: 48, bold: true, color: TEAL, font: FONT })
          ]
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({ text: "Estamos buscando proveedores que quieran crecer con nosotros.", size: 24, color: GRAY, font: FONT })
          ]
        }),

        // === DIVIDER ===
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: TEAL, space: 8 } },
          spacing: { after: 400 },
          children: []
        }),

        // === CONTACT INFO ===
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          columnWidths: [Math.floor(CONTENT_WIDTH / 3), Math.floor(CONTENT_WIDTH / 3), Math.floor(CONTENT_WIDTH / 3)],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  width: { size: Math.floor(CONTENT_WIDTH / 3), type: WidthType.DXA },
                  margins: { top: 120, bottom: 120, left: 100, right: 100 },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
                      new TextRun({ text: "Web", size: 22, bold: true, color: TEAL, font: FONT })
                    ]}),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [
                      new ExternalHyperlink({
                        children: [new TextRun({ text: "comprahogar.com.uy", style: "Hyperlink", size: 22, font: FONT })],
                        link: "https://comprahogar.com.uy"
                      })
                    ]})
                  ]
                }),
                new TableCell({
                  borders: noBorders,
                  width: { size: Math.floor(CONTENT_WIDTH / 3), type: WidthType.DXA },
                  margins: { top: 120, bottom: 120, left: 100, right: 100 },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
                      new TextRun({ text: "Email", size: 22, bold: true, color: TEAL, font: FONT })
                    ]}),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [
                      new ExternalHyperlink({
                        children: [new TextRun({ text: "ventas@comprahogar.com.uy", style: "Hyperlink", size: 22, font: FONT })],
                        link: "mailto:ventas@comprahogar.com.uy"
                      })
                    ]})
                  ]
                }),
                new TableCell({
                  borders: noBorders,
                  width: { size: Math.floor(CONTENT_WIDTH / 3), type: WidthType.DXA },
                  margins: { top: 120, bottom: 120, left: 100, right: 100 },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
                      new TextRun({ text: "Ubicación", size: 22, bold: true, color: TEAL, font: FONT })
                    ]}),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [
                      new TextRun({ text: "Montevideo, Uruguay", size: 22, color: GRAY, font: FONT })
                    ]})
                  ]
                })
              ]
            })
          ]
        }),

        spacer(400),

        // === FOOTER ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_BG, space: 12 } },
          spacing: { before: 200 },
          children: [
            new TextRun({ text: "CompraHogar ", bold: true, size: 20, color: TEAL, font: FONT }),
            new TextRun({ text: "| Creado por uruguayos, para uruguayos.", size: 20, color: GRAY, font: FONT })
          ]
        })
      ]
    }
  ]
});

// === GENERATE FILE ===
const buffer = await Packer.toBuffer(doc);
const outputPath = "C:/Users/Estudiante UCU/Desktop/CompraHogar - Propuesta Proveedores v2.docx";
fs.writeFileSync(outputPath, buffer);
console.log("Documento creado exitosamente: " + outputPath);
