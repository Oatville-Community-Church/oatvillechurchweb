#!/usr/bin/env node
// DEPRECATED: Manual optimization replaced by Vite + PostCSS/Tailwind pipeline.
// Safe to delete this file.
/**
 * (Legacy) Optimization Script (Deprecated)
 * This file is no longer invoked; Vite handles minification & hashing.
 */

const fs = require('fs').promises;
const path = require('path');

class AssetOptimizer {
  constructor() {
    this.publicDir = path.resolve(__dirname, '..', 'public');
  }

  async optimizeCSS() {
    console.log('🎨 Optimizing CSS...');
    
    const cssFiles = await this.getFilesWithExtension(this.publicDir, '.css');
    
    for (const file of cssFiles) {
      const content = await fs.readFile(file, 'utf8');
      const optimized = this.minifyCSS(content);
      await fs.writeFile(file, optimized);
    }
    
    console.log(`✓ Optimized ${cssFiles.length} CSS files`);
  }

  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
      .replace(/,\s+/g, ',') // Remove spaces after commas
      .replace(/:\s+/g, ':') // Remove spaces after colons
      .trim();
  }

  async optimizeJS() {
    console.log('📜 Optimizing JavaScript...');
    
    const jsFiles = await this.getFilesWithExtension(this.publicDir, '.js');
    
    for (const file of jsFiles) {
      const content = await fs.readFile(file, 'utf8');
      const optimized = this.minifyJS(content);
      await fs.writeFile(file, optimized);
    }
    
    console.log(`✓ Optimized ${jsFiles.length} JavaScript files`);
  }

  minifyJS(js) {
    return js
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Clean up syntax
      .trim();
  }

  async generateManifest() {
    console.log('📋 Generating asset manifest...');
    
    const manifest = {};
    const files = await this.getAllFiles(this.publicDir);
    
    for (const file of files) {
      const relativePath = path.relative(this.publicDir, file);
      const stats = await fs.stat(file);
      manifest[relativePath] = {
        size: stats.size,
        modified: stats.mtime.toISOString()
      };
    }
    
    await fs.writeFile(
      path.join(this.publicDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('✓ Asset manifest generated');
  }

  async getFilesWithExtension(dir, extension, files = []) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await this.getFilesWithExtension(fullPath, extension, files);
        } else if (entry.name.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist
    }
    
    return files;
  }

  async getAllFiles(dir, files = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await this.getAllFiles(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async optimize() {
    console.log('🔧 Starting asset optimization...\n');
    
    try {
      await this.optimizeCSS();
      await this.optimizeJS();
      await this.generateManifest();
      
      console.log('\n✨ Asset optimization completed!');
    } catch (error) {
      console.error('❌ Optimization failed:', error.message);
      throw error;
    }
  }
}

async function optimize() {
  const optimizer = new AssetOptimizer();
  await optimizer.optimize();
}

if (require.main === module) {
  optimize().catch(error => {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  });
}

module.exports = optimize;
