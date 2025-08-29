#!/usr/bin/env node
/**
 * Image optimization script.
 * - Scans src/images for .jpg/.jpeg/.png
 * - Generates WebP & AVIF versions alongside originals if missing or outdated.
 * - Generates resized (max 1600px width) performance variants: *-1600.webp / *-1600.avif
 * - Skips regeneration if target exists and source not newer.
 */
const fs = require('fs');
const path = require('path');
let sharp;
try { sharp = require('sharp'); } catch (e) {
  console.error('\n[optimize-images] sharp not installed. Run `npm i -D sharp` first.');
  process.exit(1);
}

const IMAGES_DIR = path.join(__dirname, '..', 'src', 'images');

function isRasterCandidate(file) {
  // Only process original raster sources, skip already-resized variants like *-1600.jpg/png
  if (!/\.(jpe?g|png)$/i.test(file)) return false;
  if (/-1600\.(jpe?g|png)$/i.test(file)) return false;
  return true;
}

async function processImage(file) {
  const srcPath = path.join(IMAGES_DIR, file);
  const baseName = file.replace(/\.(jpe?g|png)$/i, '');
  const targets = [
    { ext: 'webp', quality: 78, resize: false },
    { ext: 'avif', quality: 50, resize: false },
    { ext: 'webp', quality: 74, resize: 1600 },
  { ext: 'avif', quality: 48, resize: 1600 },
  // Add a compressed JPEG fallback for legacy browsers (used only when <picture> doesn't support AVIF/WebP)
  { ext: 'jpg', quality: 78, resize: 1600 }
  ];
  const srcStat = fs.statSync(srcPath);
  const image = sharp(srcPath).rotate();
  const metadata = await image.metadata().catch(() => ({}));
  for (const cfg of targets) {
    const suffix = cfg.resize ? `-${cfg.resize}` : '';
    const outName = `${baseName}${suffix}.${cfg.ext}`;
    const outPath = path.join(IMAGES_DIR, outName);
    let regenerate = true;
    if (fs.existsSync(outPath)) {
      const stat = fs.statSync(outPath);
      regenerate = stat.mtimeMs < srcStat.mtimeMs;
    }
    if (!regenerate) {
      console.log(`✓ Up-to-date ${outName}`);
      continue; // eslint-disable-line no-continue
    }
    try {
      let pipeline = sharp(srcPath).rotate();
      if (cfg.resize && metadata.width && metadata.width > cfg.resize) {
        pipeline = pipeline.resize({ width: cfg.resize });
      }
  if (cfg.ext === 'webp') pipeline = pipeline.webp({ quality: cfg.quality });
  else if (cfg.ext === 'avif') pipeline = pipeline.avif({ quality: cfg.quality });
  else if (cfg.ext === 'jpg' || cfg.ext === 'jpeg') pipeline = pipeline.jpeg({ quality: cfg.quality, mozjpeg: true });
      await pipeline.toFile(outPath);
      console.log(`✔ Generated ${outName}`);
    } catch (err) {
      console.error(`✗ Error generating ${outName}:`, err.message);
    }
  }
}

(async () => {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('[optimize-images] images directory not found:', IMAGES_DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(IMAGES_DIR).filter(isRasterCandidate);
  if (!files.length) {
    console.log('[optimize-images] No candidate images found.');
    return;
  }
  console.log(`[optimize-images] Processing ${files.length} image(s)...`);
  for (const f of files) {
    // eslint-disable-next-line no-await-in-loop
    await processImage(f);
  }
  console.log('[optimize-images] Done.');
})();
