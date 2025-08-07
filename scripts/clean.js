#!/usr/bin/env node

/**
 * Clean Script
 * Removes all generated files and folders to ensure a fresh build
 */

const fs = require('fs').promises;
const path = require('path');

const CLEAN_PATHS = [
  'public',
  'dist',
  'temp',
  '.cache',
  'node_modules/.cache',
  '**/*.css.map'
];

async function removeIfExists(filePath) {
  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await fs.rm(filePath, { recursive: true, force: true });
      console.log(`✓ Removed directory: ${filePath}`);
    } else {
      await fs.unlink(filePath);
      console.log(`✓ Removed file: ${filePath}`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`⚠ Could not remove ${filePath}:`, error.message);
    }
  }
}

async function clean() {
  console.log('🧹 Starting clean process...\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  
  for (const cleanPath of CLEAN_PATHS) {
    const fullPath = path.join(projectRoot, cleanPath);
    await removeIfExists(fullPath);
  }
  
  console.log('\n✨ Clean process completed successfully!');
}

if (require.main === module) {
  clean().catch(error => {
    console.error('❌ Clean process failed:', error);
    process.exit(1);
  });
}

module.exports = clean;
