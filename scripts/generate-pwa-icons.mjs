import sharp from "sharp";
import fs from "fs";
import path from "path";

const SOURCE = "public/logo2.png";
const OUT_DIR = "public/icons";

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

const BG = { r: 255, g: 255, b: 255, alpha: 1 };

async function generate() {
    const source = sharp(SOURCE);

    await source
        .clone()
        .resize(192, 192, { fit: "contain", background: BG })
        .flatten({ background: BG })
        .png()
        .toFile(path.join(OUT_DIR, "icon-192.png"));

    await source
        .clone()
        .resize(512, 512, { fit: "contain", background: BG })
        .flatten({ background: BG })
        .png()
        .toFile(path.join(OUT_DIR, "icon-512.png"));

    await source
        .clone()
        .resize(410, 410, { fit: "contain", background: BG })
        .extend({
            top: 51,
            bottom: 51,
            left: 51,
            right: 51,
            background: BG,
        })
        .flatten({ background: BG })
        .png()
        .toFile(path.join(OUT_DIR, "icon-512-maskable.png"));

    await source
        .clone()
        .resize(180, 180, { fit: "contain", background: BG })
        .flatten({ background: BG })
        .png()
        .toFile(path.join(OUT_DIR, "apple-touch-icon.png"));

    console.log("✓ PWA icons generated in " + OUT_DIR);
}

generate().catch((err) => {
    console.error("Error generating icons:", err);
    process.exit(1);
});
