#!/usr/bin/env node

/**
 * Git Hooks Setup Script
 * Automatically installs pre-commit hooks for JSON validation
 */

const fs = require('fs').promises;
const path = require('path');

class GitHooksSetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.gitHooksDir = path.join(this.projectRoot, '.git', 'hooks');
  }

  async setupPreCommitHook() {
    try {
      // Check if .git directory exists
      await fs.access(this.gitHooksDir);
      
      const preCommitPath = path.join(this.gitHooksDir, 'pre-commit');
      const hookScript = `#!/bin/sh
# Auto-generated pre-commit hook for JSON validation
# This runs JSON syntax checking before allowing commits

echo "🔍 Running pre-commit validation..."
node scripts/pre-commit-hook.js

# Exit with the same code as the validation script
exit $?
`;

      await fs.writeFile(preCommitPath, hookScript, { mode: 0o755 });
      console.log('✅ Pre-commit hook installed successfully');
      console.log('   📍 Location:', preCommitPath);
      console.log('   🎯 Purpose: Validates JSON files before commits');
      
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('ℹ️  Git repository not found - hooks will be installed when repository is initialized');
        return false;
      } else {
        console.error('❌ Failed to setup pre-commit hook:', error.message);
        return false;
      }
    }
  }

  async setup() {
    console.log('🔧 Setting up Git hooks...\n');
    
    const success = await this.setupPreCommitHook();
    
    if (success) {
      console.log('\n✨ Git hooks setup complete!');
      console.log('\n📋 What this enables:');
      console.log('   • JSON syntax validation before commits');
      console.log('   • Automatic detection of trailing commas');
      console.log('   • Prevention of commits with invalid JSON');
      console.log('   • Code quality checks on all files');
      console.log('\n💡 To bypass validation (emergency only): git commit --no-verify');
    }
    
    return success;
  }
}

async function setupGitHooks() {
  const setup = new GitHooksSetup();
  await setup.setup();
}

if (require.main === module) {
  setupGitHooks().catch(error => {
    console.error('❌ Git hooks setup failed:', error);
    process.exit(1);
  });
}

module.exports = setupGitHooks;