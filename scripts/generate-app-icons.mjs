/**
 * Builds circular white-background icons from public/tjm-logo.png for Next.js app/ metadata.
 * White disk + logo, transparent outside the circle (shows round in browser tabs).
 * Run: npm run generate:icons
 */
import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const logoPath = join(root, 'public', 'tjm-logo.png');
const appDir = join(root, 'src', 'app');

const CANVAS = 512;
/**
 * Max logo box inside the circle: fraction of the circle’s inscribed square side
 * (side = diameter / √2). Higher = larger logo (closer to the round edge).
 */
const LOGO_FRAC = 0.94;

function circleSvg(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${r}" cy="${r}" r="${r}" fill="#ffffff"/>
    </svg>`
  );
}

async function buildCircularIcon(size) {
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

  // Clip rectangular logo bleed to the circle (same mask as white disk).
  await sharp(layered)
    .composite([{ input: circlePng, blend: 'dest-in' }])
    .png()
    .toFile(join(appDir, size === CANVAS ? 'icon.png' : 'apple-icon.png'));
}

async function main() {
  await buildCircularIcon(CANVAS);
  await buildCircularIcon(180);
  console.log('Wrote src/app/icon.png and src/app/apple-icon.png (circular)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
