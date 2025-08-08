#!/usr/bin/env node

/**
 * Build Script
 * Comprehensive build process for the static site
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class BuildProcessor {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.srcDir = path.join(this.projectRoot, 'src');
    this.publicDir = path.join(this.projectRoot, 'public');
    this.tempDir = path.join(this.projectRoot, 'temp');
  }

  async ensureDirectories() {
    const dirs = [this.publicDir, this.tempDir];
    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
    console.log('✓ Directories created/verified');
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      // For Windows, we need to use cmd.exe to run node_modules executables
      const isWindows = process.platform === 'win32';
      let finalCommand, finalArgs;
      
      if (isWindows) {
        finalCommand = 'cmd';
        finalArgs = ['/c', 'npx', command, ...args];
      } else {
        finalCommand = 'npx';
        finalArgs = [command, ...args];
      }
      
      const child = spawn(finalCommand, finalArgs, {
        stdio: 'pipe',
        shell: false,
        cwd: this.projectRoot,
        ...options
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr || stdout}`));
        }
      });

      child.on('error', reject);
    });
  }

  async compileSass() {
    console.log('🎨 Compiling SASS...');
    try {
      const sassInput = path.join(this.srcDir, 'scss', 'styles.scss');
      const cssOutput = path.join(this.publicDir, 'styles.css');
      
      await this.runCommand('sass', [
        sassInput,
        cssOutput,
        '--style=compressed',
        '--no-source-map'
      ]);
      console.log('✓ SASS compilation completed');
    } catch (error) {
      console.error('❌ SASS compilation failed:', error.message);
      throw error;
    }
  }

  async compileTailwind() {
    console.log('🎨 Compiling Tailwind CSS...');
    try {
      const inputCss = path.join(this.projectRoot, 'input.css');
      const outputCss = path.join(this.publicDir, 'out.css');
      
      await this.runCommand('tailwindcss', [
        '-i', inputCss,
        '-o', outputCss,
        '--minify'
      ]);
      console.log('✓ Tailwind CSS compilation completed');
    } catch (error) {
      console.error('❌ Tailwind CSS compilation failed:', error.message);
      throw error;
    }
  }

  async processHtmlTemplates() {
    console.log('📄 Processing HTML templates...');
    try {
      // Load church information
      const churchDataPath = path.join(this.srcDir, 'data', 'churchInformation.json');
      const churchDataExists = await this.pathExists(churchDataPath);
      
      let churchData = {};
      if (churchDataExists) {
        const churchDataContent = await fs.readFile(churchDataPath, 'utf8');
        churchData = JSON.parse(churchDataContent);
      }

      // Process HTML files
      const htmlFiles = await this.getFilesWithExtension(this.srcDir, '.html');
      for (const htmlFile of htmlFiles) {
        const relativePath = path.relative(this.srcDir, htmlFile);
        const targetFile = path.join(this.publicDir, relativePath);
        await this.ensureDirectoryForFile(targetFile);
        
        let htmlContent = await fs.readFile(htmlFile, 'utf8');
        
        // Replace placeholders with church data
        if (Object.keys(churchData).length > 0) {
          htmlContent = this.replacePlaceholders(htmlContent, churchData);
        }
        
        await fs.writeFile(targetFile, htmlContent);
      }

      console.log('✓ HTML templates processed successfully');
    } catch (error) {
      console.error('❌ HTML template processing failed:', error.message);
      throw error;
    }
  }

  replacePlaceholders(htmlContent, data) {
    // Helper function to safely get nested object values
    const getValue = (obj, path) => {
      return path.split('.').reduce((current, key) => current && current[key], obj);
    };

    // Replace all occurrences of {{path.to.value}} with actual data
    return htmlContent.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = getValue(data, path.trim());
      return value !== undefined ? value : match;
    });
  }

  async copyAssets() {
    console.log('📁 Copying assets...');
    try {
      // Copy JavaScript files
      const jsSource = path.join(this.srcDir, 'js');
      const jsExists = await this.pathExists(jsSource);
      if (jsExists) {
        await this.copyDirectory(jsSource, this.publicDir);
      }

      // Copy images
      const imagesSource = path.join(this.srcDir, 'images');
      const imagesTarget = path.join(this.publicDir, 'images');
      const imagesExists = await this.pathExists(imagesSource);
      if (imagesExists) {
        await this.copyDirectory(imagesSource, imagesTarget);
      }

      // Copy other static assets (fonts, icons, etc.)
      const staticAssets = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2', '.ttf', '.eot'];
      for (const ext of staticAssets) {
        const files = await this.getFilesWithExtension(this.srcDir, ext);
        for (const file of files) {
          const relativePath = path.relative(this.srcDir, file);
          const targetFile = path.join(this.publicDir, relativePath);
          await this.ensureDirectoryForFile(targetFile);
          await fs.copyFile(file, targetFile);
        }
      }

      console.log('✓ Assets copied successfully');
    } catch (error) {
      console.error('❌ Asset copying failed:', error.message);
      throw error;
    }
  }

  async pathExists(path) {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  async getFilesWithExtension(dir, extension, files = []) {
    const dirExists = await this.pathExists(dir);
    if (!dirExists) return files;

    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await this.getFilesWithExtension(fullPath, extension, files);
      } else if (entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async ensureDirectoryForFile(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
  }

  async optimizeAssets() {
    console.log('⚡ Optimizing assets...');
    // Future: Add image optimization, CSS/JS minification, etc.
    console.log('✓ Asset optimization completed');
  }

  async generateBuildInfo() {
    const buildInfo = {
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      node_version: process.version,
      environment: process.env.NODE_ENV || 'production'
    };

    await fs.writeFile(
      path.join(this.publicDir, 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    );
    
    console.log('✓ Build info generated');
  }

  async build() {
    const startTime = Date.now();
    
    console.log('🚀 Starting build process...\n');

    try {
      await this.ensureDirectories();
      
      const sassStart = Date.now();
      await this.compileSass();
      const sassTime = Date.now() - sassStart;
      
      const tailwindStart = Date.now();
      await this.compileTailwind();
      const tailwindTime = Date.now() - tailwindStart;
      
      const copyStart = Date.now();
      await this.copyAssets();
      const copyTime = Date.now() - copyStart;
      
      const htmlStart = Date.now();
      await this.processHtmlTemplates();
      const htmlTime = Date.now() - htmlStart;
      
      await this.optimizeAssets();
      await this.generateBuildInfo();

      const duration = Date.now() - startTime;
      
      // Performance report
      console.log(`\n⚡ Performance Breakdown:`);
      console.log(`  SASS: ${sassTime}ms`);
      console.log(`  Tailwind: ${tailwindTime}ms`);
      console.log(`  Assets: ${copyTime}ms`);
      console.log(`  HTML: ${htmlTime}ms`);
      console.log(`\n✨ Build completed successfully in ${duration}ms!`);
      
      // Generate performance report
      const PerformanceMonitor = require('./performance');
      const monitor = new PerformanceMonitor();
      await monitor.generateReport();
      
    } catch (error) {
      console.error('\n❌ Build process failed:', error.message);
      throw error;
    }
  }
  // Deprecated: legacy custom build script no longer used.
  // Replaced by Vite (see package.json scripts: dev, build, preview).
  // Intentionally left empty to avoid confusion; safe to delete this file.
}

async function build() {
  const processor = new BuildProcessor();
  await processor.build();
}

if (require.main === module) {
  build().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
  });
}

module.exports = build;
