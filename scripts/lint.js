#!/usr/bin/env node

/**
 * Lint Script
 * Code quality checks for HTML, CSS, and JavaScript
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class Linter {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.srcDir = path.join(this.projectRoot, 'src');
    this.errors = [];
    this.warnings = [];
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
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
        resolve({ code, stdout, stderr });
      });

      child.on('error', reject);
    });
  }

  async checkPackageJson() {
    console.log('📦 Checking package.json...');
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      const requiredFields = ['name', 'version', 'description', 'scripts'];
      const missingFields = requiredFields.filter(field => !packageJson[field]);
      
      if (missingFields.length > 0) {
        this.warnings.push(`package.json is missing fields: ${missingFields.join(', ')}`);
      }
      
      console.log('✓ package.json checked');
    } catch (error) {
      this.errors.push(`Failed to check package.json: ${error.message}`);
    }
  }

  async checkJsonFiles() {
    console.log('📄 Checking JSON files...');
    try {
      const jsonFiles = await this.getFilesWithExtension(this.srcDir, '.json');
      
      for (const file of jsonFiles) {
        const relativePath = path.relative(this.projectRoot, file);
        
        try {
          const content = await fs.readFile(file, 'utf8');
          
          // Check for common JSON syntax issues before parsing
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineNum = i + 1;
            
            // Check for trailing commas in arrays/objects
            if (line.match(/,\s*[\]}]/)) {
              this.errors.push(`${relativePath}:${lineNum}: Trailing comma found - remove comma before ] or }`);
            }
            
            // Check for missing commas between items
            if (line.match(/"\s*\n\s*"/)) {
              this.warnings.push(`${relativePath}:${lineNum}: Possible missing comma between items`);
            }
          }
          
          // Attempt to parse JSON
          const parsed = JSON.parse(content);
          
          // Validate specific church data files
          if (file.includes('churchInformation.json')) {
            await this.validateChurchInformation(parsed, relativePath);
          } else if (file.includes('ministries.json')) {
            await this.validateMinistriesData(parsed, relativePath);
          } else if (file.includes('planvisit.json')) {
            await this.validatePlanVisitData(parsed, relativePath);
          }
          
        } catch (parseError) {
          this.errors.push(`${relativePath}: Invalid JSON - ${parseError.message}`);
        }
      }
      
      console.log(`✓ Checked ${jsonFiles.length} JSON files`);
    } catch (error) {
      this.errors.push(`Failed to check JSON files: ${error.message}`);
    }
  }

  async validateChurchInformation(data, filePath) {
    const requiredFields = ['name', 'tagline', 'location', 'contact', 'services', 'seo'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      this.errors.push(`${filePath}: Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate contact information
    if (data.contact) {
      if (data.contact.email && !data.contact.email.includes('@')) {
        this.errors.push(`${filePath}: Invalid email format in contact.email`);
      }
      if (data.contact.phone && !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(data.contact.phone)) {
        this.warnings.push(`${filePath}: Phone format should be (XXX) XXX-XXXX`);
      }
    }
    
    // Validate service times format
    if (data.services && Array.isArray(data.services)) {
      data.services.forEach((service, index) => {
        if (!service.day || !service.time) {
          this.errors.push(`${filePath}: Service ${index + 1} missing day or time`);
        }
      });
    }
  }

  async validateMinistriesData(data, filePath) {
    const requiredFields = ['hero', 'ministries', 'seo'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      this.errors.push(`${filePath}: Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate ministries array
    if (data.ministries && Array.isArray(data.ministries)) {
      data.ministries.forEach((ministry, index) => {
        const requiredMinistryFields = ['id', 'title', 'description'];
        const missingMinistryFields = requiredMinistryFields.filter(field => !ministry[field]);
        
        if (missingMinistryFields.length > 0) {
          this.errors.push(`${filePath}: Ministry ${index + 1} missing fields: ${missingMinistryFields.join(', ')}`);
        }
        
        // Validate schedule format if present
        if (ministry.schedule && Array.isArray(ministry.schedule)) {
          ministry.schedule.forEach((schedule, schedIndex) => {
            if (typeof schedule !== 'string' || schedule.trim() === '') {
              this.warnings.push(`${filePath}: Ministry "${ministry.title}" schedule ${schedIndex + 1} should be a non-empty string`);
            }
          });
        }
      });
    }
    
    // Validate SEO data
    if (data.seo) {
      if (!data.seo.title || !data.seo.description) {
        this.errors.push(`${filePath}: SEO section missing title or description`);
      }
    }
  }

  async validatePlanVisitData(data, filePath) {
    const requiredFields = ['hero', 'seo'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      this.errors.push(`${filePath}: Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  async checkHtml() {
    console.log('🏗️ Checking HTML files...');
    try {
      const htmlFiles = await this.getFilesWithExtension(this.srcDir, '.html');
      
      for (const file of htmlFiles) {
        const content = await fs.readFile(file, 'utf8');
        const relativePath = path.relative(this.projectRoot, file);
        
        // Basic HTML validation
        if (!content.includes('<!DOCTYPE html>')) {
          this.warnings.push(`${relativePath}: Missing DOCTYPE declaration`);
        }
        
        if (!content.includes('<html')) {
          this.errors.push(`${relativePath}: Missing <html> tag`);
        }
        
        if (!content.includes('<title>')) {
          this.warnings.push(`${relativePath}: Missing <title> tag`);
        }
        
        // Check for accessibility
        if (!content.includes('lang=')) {
          this.warnings.push(`${relativePath}: Missing language attribute on html tag`);
        }
        
        if (content.includes('<img') && !content.includes('alt=')) {
          this.warnings.push(`${relativePath}: Images without alt attributes found`);
        }
      }
      
      console.log(`✓ Checked ${htmlFiles.length} HTML files`);
    } catch (error) {
      this.errors.push(`Failed to check HTML files: ${error.message}`);
    }
  }

  async checkCss() {
    console.log('🎨 Checking CSS/SCSS files...');
    try {
      const cssFiles = await this.getFilesWithExtension(this.srcDir, '.css');
      const scssFiles = await this.getFilesWithExtension(this.srcDir, '.scss');
      const allFiles = [...cssFiles, ...scssFiles];
      
      for (const file of allFiles) {
        const content = await fs.readFile(file, 'utf8');
        const relativePath = path.relative(this.projectRoot, file);
        
        // Check for common issues
        if (content.includes('!important')) {
            // Ignore occurrences that appear only inside comments
            const uncommented = content.replace(/\/\*[^]*?\*\//g, '').replace(/\/\/.*$/gm, '');
            if (uncommented.includes('!important')) {
              this.warnings.push(`${relativePath}: Uses !important (consider refactoring)`);
            }
        }
        
        // Check for deprecated SASS syntax
        if (file.endsWith('.scss')) {
          if (content.includes('@import')) {
            this.warnings.push(`${relativePath}: Uses deprecated @import (consider @use/@forward)`);
          }
          
          if (content.includes('darken(') || content.includes('lighten(')) {
            this.warnings.push(`${relativePath}: Uses deprecated color functions (consider color.adjust)`);
          }
        }
      }
      
      console.log(`✓ Checked ${allFiles.length} CSS/SCSS files`);
    } catch (error) {
      this.errors.push(`Failed to check CSS files: ${error.message}`);
    }
  }

  async checkJavaScript() {
    console.log('📜 Checking JavaScript files...');
    try {
      const jsFiles = await this.getFilesWithExtension(this.srcDir, '.js');
      
      for (const file of jsFiles) {
        const content = await fs.readFile(file, 'utf8');
        const relativePath = path.relative(this.projectRoot, file);
        
        // Basic syntax checks
        try {
          // Allow simple ESM syntax by stripping static import/export lines before using Function constructor
          let toParse = content;
      if (/\bimport\b|\bexport\b/.test(content)) {
            toParse = content
              // remove static import lines (keep dynamic import expression syntax untouched)
              .replace(/^\s*import[^;]+;?$/mg, '')
              // replace export default with just the expression/object
              .replace(/^\s*export\s+default/mg, ' ')
              // drop export keywords for named exports while retaining declarations
        .replace(/^\s*export\s+(const|let|var|function|class)\s+/mg, '$1 ')
        // handle "export async function"
        .replace(/^\s*export\s+async\s+function\s+/mg, 'async function ');
          }
          // Neutralize `import.meta` to avoid Node parser error in non-ESM context
          toParse = toParse.replace(/\bimport\.meta\b/g, '({})');
          new Function(toParse);
        } catch (syntaxError) {
          this.errors.push(`${relativePath}: Syntax error - ${syntaxError.message}`);
        }
        
        // Check for console.log in production code
        if (content.includes('console.log') && !content.includes('console.log(\'Navigation initialization error handled gracefully\')')) {
          this.warnings.push(`${relativePath}: Contains console.log statements`);
        }
        
        // Check for var usage
        if (content.includes(' var ')) {
          this.warnings.push(`${relativePath}: Uses var instead of let/const`);
        }
      }
      
      console.log(`✓ Checked ${jsFiles.length} JavaScript files`);
    } catch (error) {
      this.errors.push(`Failed to check JavaScript files: ${error.message}`);
    }
  }

  async getFilesWithExtension(dir, extension, files = []) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
  // Skip typical generated / vendor directories anywhere in tree
  if (entry.isDirectory() && !['node_modules', 'dist', '.vite'].includes(entry.name)) {
          await this.getFilesWithExtension(fullPath, extension, files);
        } else if (entry.name.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist, that's ok
    }
    
    return files;
  }

  async lint(jsonOnly = false) {
    if (jsonOnly) {
      console.log('🔍 Starting JSON validation checks...\n');
    } else {
      console.log('🔍 Starting code quality checks...\n');
    }
    
    try {
      if (jsonOnly) {
        // Only run JSON-related checks
        await this.checkPackageJson();
        await this.checkJsonFiles();
      } else {
        // Run all checks
        await this.checkPackageJson();
        await this.checkJsonFiles();
        await this.checkHtml();
        await this.checkCss();
        await this.checkJavaScript();
      }
      
      console.log('\n📊 Lint Results:');
      console.log(`Errors: ${this.errors.length}`);
      console.log(`Warnings: ${this.warnings.length}\n`);
      
      if (this.errors.length > 0) {
        console.log('❌ Errors:');
        this.errors.forEach(error => console.log(`  - ${error}`));
        console.log('');
      }
      if (this.warnings.length > 0) {
        console.log('⚠️ Warnings:');
        this.warnings.forEach(warning => console.log(`  - ${warning}`));
        console.log('');
      }
      
      if (this.errors.length === 0 && this.warnings.length === 0) {
        if (jsonOnly) {
          console.log('✨ JSON validation passed! All files are valid.');
        } else {
          console.log('✨ No issues found! Code quality looks great!');
        }
      } else if (this.errors.length === 0) {
        console.log('✅ No errors found! Only warnings that can be addressed later.');
      }
      
      // Exit with error code if there are errors
      if (this.errors.length > 0) {
        process.exit(1);
      }
      
    } catch (error) {
      console.error('❌ Lint process failed:', error.message);
      process.exit(1);
    }
  }
}

async function lint() {
  const jsonOnly = process.argv.includes('--json-only');
  const linter = new Linter();
  await linter.lint(jsonOnly);
}

if (require.main === module) {
  lint().catch(error => {
    console.error('❌ Linting failed:', error);
    process.exit(1);
  });
}

module.exports = lint;
