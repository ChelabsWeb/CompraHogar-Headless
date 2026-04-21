// Genera src/app/favicon.ico (multi-size 16/32/48) a partir de src/app/icon.png.
// Usa sharp para producir PNGs y los empaqueta en un contenedor ICO (PNG-in-ICO).
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src/app/icon.png");
const out = path.join(root, "src/app/favicon.ico");
const sizes = [16, 32, 48];

const pngBuffers = await Promise.all(
  sizes.map((size) =>
    sharp(src).resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toBuffer()
  )
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);

const entries = [];
let dataOffset = 6 + sizes.length * 16;
for (let i = 0; i < sizes.length; i++) {
  const entry = Buffer.alloc(16);
  const s = sizes[i] >= 256 ? 0 : sizes[i];
  entry.writeUInt8(s, 0);
  entry.writeUInt8(s, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffers[i].length, 8);
  entry.writeUInt32LE(dataOffset, 12);
  entries.push(entry);
  dataOffset += pngBuffers[i].length;
}

const ico = Buffer.concat([header, ...entries, ...pngBuffers]);
await fs.writeFile(out, ico);
console.log(`favicon.ico generado (${ico.length} bytes) -> ${out}`);
