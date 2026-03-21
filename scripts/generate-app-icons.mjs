/**
 * Builds circular white-background icons from public/tjm-logo.png for Next.js `app/` metadata
 * and `public/favicon.ico` only (keep `src/app/favicon.ico` out of the repo — Next.js would
 * inject an extra hashed `/favicon.ico?...` link and fight Chrome’s favicon cache).
 * Run: npm run generate:icons
 */
import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const logoPath = join(root, 'public', 'tjm-logo.png');
const appDir = join(root, 'src', 'app');
const publicDir = join(root, 'public');

const CANVAS = 512;
/**
 * Max logo box inside the circle: fraction of the circle’s inscribed square side
 * (side = diameter / √2). Higher = larger logo (closer to the round edge).
 */
const LOGO_FRAC = 1.0;

function circleSvg(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${r}" cy="${r}" r="${r}" fill="#ffffff"/>
    </svg>`
  );
}

/** PNG buffer: circular TJM mark at `size`×`size`. */
async function buildCircularIconPngBuffer(size) {
  const circlePng = await sharp(circleSvg(size)).png().toBuffer();

  const inscribed = size / Math.SQRT2;
  const maxSide = Math.round(inscribed * LOGO_FRAC);
  const resized = await sharp(logoPath)
    .flatten({ background: '#ffffff' })
    .resize(maxSide, maxSide, { fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = resized;
  const left = Math.round((size - info.width) / 2);
  const top = Math.round((size - info.height) / 2);

  const layered = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: circlePng, left: 0, top: 0 },
      { input: data, left, top },
    ])
    .png()
    .toBuffer();

  return sharp(layered).composite([{ input: circlePng, blend: 'dest-in' }]).png().toBuffer();
}

async function buildCircularIconFile(size, outPath) {
  const buf = await buildCircularIconPngBuffer(size);
  await sharp(buf).png().toFile(outPath);
}

async function buildFaviconIco() {
  const { default: toIco } = await import('to-ico');
  const [b16, b32, b48] = await Promise.all([
    buildCircularIconPngBuffer(16),
    buildCircularIconPngBuffer(32),
    buildCircularIconPngBuffer(48),
  ]);
  const ico = await toIco([b16, b32, b48]);
  await writeFile(join(publicDir, 'favicon.ico'), ico);
}

async function main() {
  await buildCircularIconFile(CANVAS, join(appDir, 'icon.png'));
  await buildCircularIconFile(180, join(appDir, 'apple-icon.png'));
  await buildFaviconIco();
  console.log('Wrote src/app/icon.png, src/app/apple-icon.png, public/favicon.ico (circular)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
