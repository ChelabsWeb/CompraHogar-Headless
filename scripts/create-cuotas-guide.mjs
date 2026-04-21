import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak
} from 'docx';
import fs from 'fs';

const BRAND = "21645D";
const BRAND_LIGHT = "D6EAE7";
const GRAY_HEADER = "F2F2F2";
const WHITE = "FFFFFF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// Table width = US Letter content width with 1" margins
const TABLE_WIDTH = 9360;

function headerCell(text, width) {
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

function cell(text, width, opts = {}) {
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
        color: opts.color || "333333"
      })]
    })]
  });
}

function boldCell(text, width, opts = {}) {
  return cell(text, width, { ...opts, bold: true });
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22, color: "333333" }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: BRAND },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: BRAND },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 }
      },
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "steps",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "reco-bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
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
            new TextRun({ text: "  \u2014  Gu\u00eda Interna", font: "Arial", size: 20, color: "888888" }),
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
            new TextRun({ text: "CompraHogar \u2014 Chelabs | P\u00e1gina ", font: "Arial", size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" }),
          ]
        })]
      })
    },
    children: [
      // ===== TITLE =====
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Cuotas sin Inter\u00e9s en E-commerce",
          bold: true, font: "Arial", size: 40, color: BRAND
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({
          text: "Gu\u00eda pr\u00e1ctica para CompraHogar \u2014 Uruguay",
          font: "Arial", size: 24, color: "666666"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({
          text: "Abril 2026 | Documento interno Chelabs",
          font: "Arial", size: 18, color: "999999"
        })]
      }),

      // ===== SECTION 1 =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("1. \u00bfQu\u00e9 son las cuotas sin inter\u00e9s?")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Las cuotas sin inter\u00e9s permiten al cliente pagar en cuotas mensuales sin ning\u00fan recargo adicional. El precio que ve el consumidor dividido en cuotas es exactamente el precio total del producto.",
          font: "Arial", size: 22
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun({
          text: "El cliente paga en cuotas iguales sin inter\u00e9s \u2014 percibe un beneficio real.",
          font: "Arial", size: 22
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun({
          text: "El comercio absorbe el costo de financiaci\u00f3n: el procesador de pago cobra una comisi\u00f3n mayor a m\u00e1s cuotas.",
          font: "Arial", size: 22
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Es una herramienta de conversi\u00f3n muy potente: reduce la barrera de precio y aumenta el ticket promedio.",
          font: "Arial", size: 22
        })]
      }),

      // Example box
      new Paragraph({
        spacing: { before: 120, after: 120 },
        shading: { fill: BRAND_LIGHT, type: ShadingType.CLEAR },
        indent: { left: 360, right: 360 },
        children: [
          new TextRun({ text: "Ejemplo: ", bold: true, font: "Arial", size: 22, color: BRAND }),
          new TextRun({
            text: "Un producto cuesta $12.000 UYU. El cliente ve \u201c12x $1.000 sin inter\u00e9s\u201d. El comercio recibe aproximadamente $11.280 (despu\u00e9s de ~6% de comisi\u00f3n en vez del ~3% habitual en un pago).",
            font: "Arial", size: 22, color: "333333"
          })
        ]
      }),

      // ===== SECTION 2 =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("2. \u00bfC\u00f3mo funciona el costo para el comercio?")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "A mayor cantidad de cuotas, mayor es la comisi\u00f3n que cobra el procesador. La siguiente tabla muestra valores aproximados:",
          font: "Arial", size: 22
        })]
      }),

      // Cost table
      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({
            children: [
              headerCell("Cuotas", 3120),
              headerCell("Comisi\u00f3n aprox.", 3120),
              headerCell("Recib\u00eds por $10.000", 3120),
            ]
          }),
          new TableRow({
            children: [
              boldCell("1 pago", 3120, { align: AlignmentType.CENTER }),
              cell("3%", 3120, { align: AlignmentType.CENTER }),
              cell("$9.700", 3120, { align: AlignmentType.CENTER }),
            ]
          }),
          new TableRow({
            children: [
              boldCell("3 cuotas", 3120, { align: AlignmentType.CENTER, shading: GRAY_HEADER }),
              cell("4,5%", 3120, { align: AlignmentType.CENTER, shading: GRAY_HEADER }),
              cell("$9.550", 3120, { align: AlignmentType.CENTER, shading: GRAY_HEADER }),
            ]
          }),
          new TableRow({
            children: [
              boldCell("6 cuotas", 3120, { align: AlignmentType.CENTER }),
              cell("5,5%", 3120, { align: AlignmentType.CENTER }),
              cell("$9.450", 3120, { align: AlignmentType.CENTER }),
            ]
          }),
          new TableRow({
            children: [
              boldCell("12 cuotas", 3120, { align: AlignmentType.CENTER, shading: GRAY_HEADER }),
              cell("7-8%", 3120, { align: AlignmentType.CENTER, shading: GRAY_HEADER }),
              cell("$9.200 - $9.300", 3120, { align: AlignmentType.CENTER, shading: GRAY_HEADER }),
            ]
          }),
        ]
      }),

      new Paragraph({
        spacing: { before: 160, after: 200 },
        children: [new TextRun({
          text: "Nota: las tasas exactas dependen del procesador de pago, el rubro del comercio y la negociaci\u00f3n particular.",
          font: "Arial", size: 20, italics: true, color: "666666"
        })]
      }),

      // ===== SECTION 3 =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("3. Opciones de procesador de pago en Uruguay")]
      }),

      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [2000, 4360, 1500, 1500],
        rows: [
          new TableRow({
            children: [
              headerCell("Procesador", 2000),
              headerCell("Caracter\u00edsticas", 4360),
              headerCell("Comisi\u00f3n", 1500),
              headerCell("Shopify", 1500),
            ]
          }),
          // Mercado Pago
          new TableRow({
            children: [
              new TableCell({
                borders, width: { size: 2000, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: BRAND_LIGHT, type: ShadingType.CLEAR },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Mercado Pago", bold: true, font: "Arial", size: 20, color: BRAND })] }),
                  new Paragraph({ children: [new TextRun({ text: "RECOMENDADO", bold: true, font: "Arial", size: 16, color: BRAND })] }),
                ]
              }),
              cell("Plugin Shopify oficial. Cuotas autom\u00e1ticas. Mayor confianza del consumidor uruguayo. Soporte local.", 4360, { shading: BRAND_LIGHT }),
              cell("4-6% + IVA", 1500, { align: AlignmentType.CENTER, shading: BRAND_LIGHT }),
              cell("Oficial", 1500, { align: AlignmentType.CENTER, bold: true, shading: BRAND_LIGHT }),
            ]
          }),
          // dLocal
          new TableRow({
            children: [
              boldCell("dLocal", 2000),
              cell("Todos los m\u00e9todos locales + internacionales. API robusta. Ideal para escalar a LatAm.", 4360),
              cell("3,5-5%", 1500, { align: AlignmentType.CENTER }),
              cell("API", 1500, { align: AlignmentType.CENTER }),
            ]
          }),
          // Plexo
          new TableRow({
            children: [
              boldCell("Plexo", 2000, { shading: GRAY_HEADER }),
              cell("Visa, Master, OCA, Anda, Cabal. Empresa uruguaya. Sin plugin nativo Shopify.", 4360, { shading: GRAY_HEADER }),
              cell("~4%", 1500, { align: AlignmentType.CENTER, shading: GRAY_HEADER }),
              cell("API", 1500, { align: AlignmentType.CENTER, shading: GRAY_HEADER }),
            ]
          }),
          // Bamboo
          new TableRow({
            children: [
              boldCell("Bamboo Payment", 2000),
              cell("Cobertura LatAm completa. API. M\u00faltiples m\u00e9todos de pago.", 4360),
              cell("Variable", 1500, { align: AlignmentType.CENTER }),
              cell("API", 1500, { align: AlignmentType.CENTER }),
            ]
          }),
        ]
      }),

      // ===== SECTION 4 =====
      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("4. Pasos para activar Mercado Pago en Shopify")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Seguir estos pasos para integrar Mercado Pago con cuotas sin inter\u00e9s en la tienda Shopify de CompraHogar:",
          font: "Arial", size: 22
        })]
      }),

      ...[
        "Crear cuenta vendedor en mercadopago.com.uy",
        "Verificar identidad (CI uruguaya + datos bancarios de la empresa)",
        "En Shopify Admin \u2192 Settings \u2192 Payments \u2192 instalar la app \u201cMercado Pago\u201d",
        "Conectar credenciales (Client ID + Client Secret desde el panel de MP)",
        "Configurar cuotas: elegir cu\u00e1ntas cuotas absorber (3, 6 o 12 sin inter\u00e9s)",
        "Activar m\u00e9todos de pago: Visa, Mastercard, OCA, Abitab, RedPagos",
      ].map((text, i) => new Paragraph({
        numbering: { reference: "steps", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text, font: "Arial", size: 22 })]
      })),

      new Paragraph({
        spacing: { before: 160, after: 200 },
        children: [new TextRun({
          text: "Tiempo estimado de activaci\u00f3n: 1-3 d\u00edas h\u00e1biles (depende de la verificaci\u00f3n de identidad).",
          font: "Arial", size: 20, italics: true, color: "666666"
        })]
      }),

      // ===== SECTION 5 =====
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("5. Recomendaci\u00f3n para CompraHogar")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Estrategia sugerida para el lanzamiento:",
          font: "Arial", size: 22
        })]
      }),
      new Paragraph({
        numbering: { reference: "reco-bullets", level: 0 },
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Comenzar con 3 cuotas sin inter\u00e9s: ", bold: true, font: "Arial", size: 22 }),
          new TextRun({ text: "menor costo para el comercio y ya resulta atractivo para el cliente.", font: "Arial", size: 22 }),
        ]
      }),
      new Paragraph({
        numbering: { reference: "reco-bullets", level: 0 },
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Ofrecer 6-12 cuotas en productos de m\u00e1s de $5.000 UYU: ", bold: true, font: "Arial", size: 22 }),
          new TextRun({ text: "a mayor ticket, mayor impacto en la conversi\u00f3n.", font: "Arial", size: 22 }),
        ]
      }),
      new Paragraph({
        numbering: { reference: "reco-bullets", level: 0 },
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Mostrar siempre el mensaje de cuotas en las tarjetas de producto: ", bold: true, font: "Arial", size: 22 }),
          new TextRun({ text: "esto ya est\u00e1 implementado en el sitio de CompraHogar.", font: "Arial", size: 22 }),
        ]
      }),

      // Final note box
      new Paragraph({
        spacing: { before: 200, after: 120 },
        shading: { fill: BRAND_LIGHT, type: ShadingType.CLEAR },
        indent: { left: 360, right: 360 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: BRAND, space: 8 } },
        children: [
          new TextRun({ text: "Pr\u00f3ximos pasos: ", bold: true, font: "Arial", size: 22, color: BRAND }),
          new TextRun({
            text: "Crear la cuenta de Mercado Pago vendedor, integrar con Shopify y configurar las cuotas antes del lanzamiento. Revisar las comisiones reales una vez aprobada la cuenta.",
            font: "Arial", size: 22, color: "333333"
          })
        ]
      }),
    ].flat()
  }]
});

const outPath = "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless/docs/cuotas-sin-interes-guia.docx";
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log(`Document created: ${outPath} (${buffer.length} bytes)`);
