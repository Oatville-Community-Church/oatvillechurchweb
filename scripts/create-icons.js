const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIconsFromSVG() {
  try {
    const svgPath = path.join(__dirname, '..', 'src', 'assets', 'favicon.svg');
    const outputDir = path.join(__dirname, '..', 'src', 'assets');
    
    if (!fs.existsSync(svgPath)) {
      console.log('❌ favicon.svg not found, skipping icon generation');
      return;
    }

    // Generate 192x192 PNG icon
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(outputDir, 'icon-192.png'));
    
    console.log('✓ Generated icon-192.png');

    // Generate 512x512 PNG icon
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(outputDir, 'icon-512.png'));
    
    console.log('✓ Generated icon-512.png');

    console.log('[create-icons] Done.');
  } catch (error) {
    console.warn('[create-icons] Warning:', error.message);
    console.log('Continuing without icon generation...');
  }
}

createIconsFromSVG();
