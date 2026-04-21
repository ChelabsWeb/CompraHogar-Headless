// Genera public/og-default.png (1200x630) — imagen de compartido por defecto.
// Fondo blanco (regla de marca) + logo centrado + tagline.
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = path.join(root, "public/logocomprahogar.png");
const outPath = path.join(root, "public/og-default.png");

const W = 1200;
const H = 630;

// Redimensionamos el logo manteniendo aspect ratio
const logo = await sharp(logoPath)
  .resize({ width: 520, fit: "inside", withoutEnlargement: false })
  .toBuffer();
const logoMeta = await sharp(logo).metadata();

const tagline = "Ferretería online en Uruguay · Envíos 24-48hs";

const svgOverlay = Buffer.from(`
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .tagline { font-family: 'Inter','Segoe UI','Arial',sans-serif; font-size: 30px; font-weight: 500; fill: #21645d; letter-spacing: 0.3px; }
      .brand   { font-family: 'Inter','Segoe UI','Arial',sans-serif; font-size: 22px; font-weight: 700; fill: #f3843e; letter-spacing: 2px; }
    </style>
    <text x="${W / 2}" y="${H / 2 + (logoMeta.height || 140) / 2 + 60}" class="tagline" text-anchor="middle">${tagline}</text>
    <text x="${W / 2}" y="${H / 2 + (logoMeta.height || 140) / 2 + 110}" class="brand" text-anchor="middle">COMPRAHOGAR.UY</text>
  </svg>
`);

await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([
    {
      input: logo,
      top: Math.round((H - (logoMeta.height || 140)) / 2) - 30,
      left: Math.round((W - (logoMeta.width || 520)) / 2),
    },
    { input: svgOverlay, top: 0, left: 0 },
  ])
  .png()
  .toFile(outPath);

const stat = await fs.stat(outPath);
console.log(`og-default.png generado (${stat.size} bytes, ${W}x${H}) -> ${outPath}`);
