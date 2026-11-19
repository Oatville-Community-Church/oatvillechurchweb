#!/usr/bin/env node

/**
 * Pre-commit Hook Script
 * Validates JSON files and runs basic linting before allowing commits
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class PreCommitValidator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.errors = [];
  }

  async runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        cwd: this.projectRoot
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

  async getStagedFiles() {
    try {
      const result = await this.runCommand('git', ['diff', '--cached', '--name-only']);
      if (result.code !== 0) {
        return [];
      }
      return result.stdout.split('\n').filter(file => file.trim());
    } catch (error) {
      console.warn('Warning: Could not get staged files:', error.message);
      return [];
    }
  }

  async validateStagedJsonFiles() {
    console.log('🔍 Checking staged JSON files...');
    
    const stagedFiles = await this.getStagedFiles();
    const jsonFiles = stagedFiles.filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      console.log('✓ No JSON files staged for commit');
      return true;
    }

    let hasErrors = false;

    for (const file of jsonFiles) {
      const filePath = path.join(this.projectRoot, file);
      
      try {
        // Check if file exists (might be deleted)
        await fs.access(filePath);
        
        const content = await fs.readFile(filePath, 'utf8');
        
        // Quick syntax validation
        try {
          JSON.parse(content);
          console.log(`✓ ${file}: Valid JSON`);
        } catch (parseError) {
          console.error(`❌ ${file}: Invalid JSON - ${parseError.message}`);
          hasErrors = true;
        }
        
        // Check for common issues
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          const lineNum = i + 1;
          
          if (line.match(/,\s*[\]}]/)) {
            console.error(`❌ ${file}:${lineNum}: Trailing comma found`);
            hasErrors = true;
          }
        }
        
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error(`❌ ${file}: Failed to read file - ${error.message}`);
          hasErrors = true;
        }
      }
    }

    return !hasErrors;
  }

  async runLinter() {
    console.log('🔧 Running full linter...');
    
    try {
      const result = await this.runCommand('npm', ['run', 'lint']);
      
      if (result.code === 0) {
        console.log('✓ All linting checks passed');
        return true;
      } else {
        console.error('❌ Linting failed:');
        console.error(result.stdout);
        console.error(result.stderr);
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to run linter:', error.message);
      return false;
    }
  }

  async validate() {
    console.log('🚀 Pre-commit validation starting...\n');
    
    // Check staged JSON files first (fast check)
    const jsonValid = await this.validateStagedJsonFiles();
    
    if (!jsonValid) {
      console.error('\n❌ JSON validation failed. Please fix the errors above before committing.');
      console.error('\n💡 Common fixes:');
      console.error('   • Remove trailing commas before ] or }');
      console.error('   • Check for proper quote matching');
      console.error('   • Ensure all brackets and braces are properly closed');
      return false;
    }
    
    // Run full linter (thorough check)
    const lintValid = await this.runLinter();
    
    if (!lintValid) {
      console.error('\n❌ Code quality checks failed. Please fix the issues above before committing.');
      console.error('   • Content files (content/*.md): check indentation, and that the top section starts and ends with ---');
      return false;
    }

    console.log('\n✅ All pre-commit checks passed! Commit is allowed to proceed.');
    return true;
  }
}

async function runPreCommitHook() {
  const validator = new PreCommitValidator();
  const isValid = await validator.validate();
  
  if (!isValid) {
    process.exit(1);
  }
}

if (require.main === module) {
  runPreCommitHook().catch(error => {
    console.error('❌ Pre-commit validation failed:', error);
    process.exit(1);
  });
}

module.exports = runPreCommitHook;