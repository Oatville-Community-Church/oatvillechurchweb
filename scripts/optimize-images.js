#!/usr/bin/env node
/**
 * Simple image optimization script.
 * - Scans src/images for .jpg/.jpeg/.png
 * - Generates WebP versions alongside originals if missing or if source is newer.
 * - Skips if a same-named .webp already exists and is newer than source.
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
  return /\.(jpe?g|png)$/i.test(file);
}

async function processImage(file) {
  const srcPath = path.join(IMAGES_DIR, file);
  const webpName = file.replace(/\.(jpe?g|png)$/i, '.webp');
  const webpPath = path.join(IMAGES_DIR, webpName);

  const srcStat = fs.statSync(srcPath);
  let regenerate = true;
  if (fs.existsSync(webpPath)) {
    const webpStat = fs.statSync(webpPath);
    regenerate = webpStat.mtimeMs < srcStat.mtimeMs; // only regenerate if source newer
  }
  if (!regenerate) {
    console.log(`✓ Skipping (up-to-date) ${webpName}`);
    return;
  }
  try {
    await sharp(srcPath)
      .rotate() // auto orientation
      .webp({ quality: 78 })
      .toFile(webpPath);
    console.log(`✔ Generated ${webpName}`);
  } catch (err) {
    console.error(`✗ Error generating ${webpName}:`, err.message);
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
