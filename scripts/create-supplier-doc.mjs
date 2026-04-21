import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, AlignmentType, BorderStyle, WidthType, ShadingType,
  ExternalHyperlink, PageBreak } from "docx";
import fs from "fs";

const TEAL = "1A8A7D";
const ORANGE = "F3843E";
const DARK = "1A1A1A";
const GRAY = "555555";
const LIGHT_BG = "F7F9FA";
const WHITE = "FFFFFF";

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const logo = fs.readFileSync("C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless/public/logo.png");

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22, color: DARK } }
    }
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 720, right: 1080, bottom: 720, left: 1080 }
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
              transformation: { width: 220, height: 130 },
              altText: { title: "CompraHogar", description: "Logo CompraHogar", name: "logo" }
            })
          ]
        }),

        // === DIVIDER LINE ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: TEAL, space: 8 } },
          children: []
        }),

        // === TITLE ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Propuesta de Alianza Comercial", size: 36, bold: true, color: TEAL, font: "Calibri" })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({ text: "Documento informativo para proveedores", size: 22, color: GRAY, italics: true })
          ]
        }),

        // === QUIENES SOMOS ===
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Quienes Somos", size: 28, bold: true, color: TEAL })
          ]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "CompraHogar", bold: true, color: ORANGE }),
            new TextRun({ text: " es una plataforma de e-commerce uruguaya especializada en materiales de construccion, herramientas, sanitaria, electricidad y productos para el hogar." })
          ]
        }),
        new Paragraph({
          spacing: { after: 260 },
          children: [
            new TextRun({ text: "Operamos con un modelo headless de ultima generacion: nuestra tienda online esta construida con tecnologia de punta (Next.js + Shopify), ofreciendo una experiencia de compra rapida, moderna y optimizada para dispositivos moviles." })
          ]
        }),

        // === NUESTRA VISION ===
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Nuestra Vision", size: 28, bold: true, color: TEAL })
          ]
        }),

        // Vision cards as table
        new Table({
          width: { size: 10080, type: WidthType.DXA },
          columnWidths: [5040, 5040],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  width: { size: 5040, type: WidthType.DXA },
                  shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                  margins: { top: 150, bottom: 150, left: 200, right: 200 },
                  children: [
                    new Paragraph({ spacing: { after: 60 }, children: [
                      new TextRun({ text: "Ser la referencia online", size: 22, bold: true, color: DARK })
                    ]}),
                    new Paragraph({ children: [
                      new TextRun({ text: "en materiales de construccion y hogar en Uruguay, conectando proveedores con miles de clientes finales y profesionales.", size: 20, color: GRAY })
                    ]})
                  ]
                }),
                new TableCell({
                  borders: noBorders,
                  width: { size: 5040, type: WidthType.DXA },
                  shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                  margins: { top: 150, bottom: 150, left: 200, right: 200 },
                  children: [
                    new Paragraph({ spacing: { after: 60 }, children: [
                      new TextRun({ text: "Creado por uruguayos,", size: 22, bold: true, color: DARK })
                    ]}),
                    new Paragraph({ children: [
                      new TextRun({ text: "para uruguayos. Entendemos el mercado local, los tiempos de obra y las necesidades reales del sector.", size: 20, color: GRAY })
                    ]})
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { after: 260 }, children: [] }),

        // === POR QUE ASOCIARSE ===
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Por que asociarse con CompraHogar", size: 28, bold: true, color: TEAL })
          ]
        }),

        // Benefits table
        new Table({
          width: { size: 10080, type: WidthType.DXA },
          columnWidths: [5040, 5040],
          rows: [
            new TableRow({
              children: [
                createBenefitCell("Canal digital propio", "Sus productos exhibidos en una tienda online profesional, con fichas detalladas, fotos de calidad y posicionamiento SEO."),
                createBenefitCell("Alcance nacional", "Llegamos a todo Uruguay con logistica propia y envios en 24-48hs a Montevideo y area metropolitana.")
              ]
            }),
            new TableRow({
              children: [
                createBenefitCell("Marketing incluido", "Campanas en redes sociales, Google Ads y email marketing que posicionan sus productos ante compradores activos."),
                createBenefitCell("Tecnologia de punta", "Plataforma rapida, segura y optimizada para conversion. Pagos con tarjetas, transferencias y cuotas sin interes.")
              ]
            }),
            new TableRow({
              children: [
                createBenefitCell("Sin inversion inicial", "No requiere desarrollo tecnologico de su parte. Nosotros nos encargamos de toda la operacion digital."),
                createBenefitCell("Reportes y metricas", "Acceso a datos de venta, productos mas buscados y tendencias del mercado en tiempo real.")
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { after: 260 }, children: [] }),

        // === CATEGORIAS ===
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Categorias que manejamos", size: 28, bold: true, color: TEAL })
          ]
        }),

        new Table({
          width: { size: 10080, type: WidthType.DXA },
          columnWidths: [2520, 2520, 2520, 2520],
          rows: [
            new TableRow({
              children: [
                createCategoryCell("Obra Gruesa"),
                createCategoryCell("Herramientas"),
                createCategoryCell("Electricidad"),
                createCategoryCell("Sanitaria")
              ]
            }),
            new TableRow({
              children: [
                createCategoryCell("Pinturas"),
                createCategoryCell("Decoracion"),
                createCategoryCell("Iluminacion"),
                createCategoryCell("Alquileres")
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { after: 300 }, children: [] }),

        // === DIVIDER ===
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: TEAL, space: 8 } },
          spacing: { after: 300 },
          children: []
        }),

        // === CONTACT / CTA ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Sumate a CompraHogar", size: 30, bold: true, color: TEAL })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Estamos buscando proveedores que quieran crecer con nosotros.", size: 22, color: GRAY })
          ]
        }),

        // Contact info table
        new Table({
          width: { size: 10080, type: WidthType.DXA },
          columnWidths: [3360, 3360, 3360],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  width: { size: 3360, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
                      new TextRun({ text: "Web", size: 20, bold: true, color: TEAL })
                    ]}),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [
                      new ExternalHyperlink({
                        children: [new TextRun({ text: "comprahogar.com.uy", style: "Hyperlink", size: 20 })],
                        link: "https://comprahogar.com.uy"
                      })
                    ]})
                  ]
                }),
                new TableCell({
                  borders: noBorders,
                  width: { size: 3360, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
                      new TextRun({ text: "Email", size: 20, bold: true, color: TEAL })
                    ]}),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [
                      new ExternalHyperlink({
                        children: [new TextRun({ text: "ventas@comprahogar.com.uy", style: "Hyperlink", size: 20 })],
                        link: "mailto:ventas@comprahogar.com.uy"
                      })
                    ]})
                  ]
                }),
                new TableCell({
                  borders: noBorders,
                  width: { size: 3360, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
                      new TextRun({ text: "Ubicacion", size: 20, bold: true, color: TEAL })
                    ]}),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [
                      new TextRun({ text: "Montevideo, Uruguay", size: 20, color: GRAY })
                    ]})
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { after: 200 }, children: [] }),

        // Footer
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "CompraHogar ", bold: true, size: 18, color: TEAL }),
            new TextRun({ text: "| Creado por uruguayos, para uruguayos.", size: 18, color: GRAY })
          ]
        })
      ]
    }
  ]
});

function createBenefitCell(title, desc) {
  return new TableCell({
    borders: noBorders,
    width: { size: 5040, type: WidthType.DXA },
    shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 180, right: 180 },
    children: [
      new Paragraph({ spacing: { after: 60 }, children: [
        new TextRun({ text: title, size: 21, bold: true, color: ORANGE })
      ]}),
      new Paragraph({ children: [
        new TextRun({ text: desc, size: 19, color: GRAY })
      ]})
    ]
  });
}

function createCategoryCell(name) {
  return new TableCell({
    borders: noBorders,
    width: { size: 2520, type: WidthType.DXA },
    shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: name, size: 20, bold: true, color: DARK })
      ]})
    ]
  });
}

const buffer = await Packer.toBuffer(doc);
const outputPath = "C:/Users/Estudiante UCU/Desktop/CompraHogar - Propuesta Proveedores.docx";
fs.writeFileSync(outputPath, buffer);
console.log("Documento creado: " + outputPath);
