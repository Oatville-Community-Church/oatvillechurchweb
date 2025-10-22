#!/usr/bin/env node

/**
 * Increment package.json version (patch) on every build
 * Example: 1.0.0 -> 1.0.1 -> 1.0.2
 */

const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Parse current version
const oldVersion = pkg.version;
const versionParts = pkg.version.split('.').map(Number);
const [major, minor, patch] = versionParts;

// Increment patch version
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update package.json
pkg.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log(`✓ Version incremented: ${oldVersion} → ${newVersion}`);
console.log(`  Build version: ${newVersion}`);
