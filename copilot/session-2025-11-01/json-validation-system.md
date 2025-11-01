# JSON Validation and Build Pipeline Enhancement

## Overview

We've enhanced the website build pipeline with comprehensive JSON validation to prevent syntax errors that can break the website. This system catches issues before they reach the live site.

## What's New

### 1. Enhanced Linting System

The existing `npm run lint` command now includes:

- **JSON Syntax Validation**: Checks all JSON files for valid syntax
- **Trailing Comma Detection**: Automatically identifies problematic trailing commas
- **Data Structure Validation**: Validates specific church data files for required fields
- **Line-by-Line Analysis**: Provides exact line numbers for errors

### 2. Build Pipeline Integration

- **Automatic Validation**: JSON validation runs before every build (`npm run build`)
- **Build Blocking**: Invalid JSON prevents the build from proceeding
- **Clear Error Messages**: Detailed feedback on what needs to be fixed

### 3. Pre-Commit Hooks

- **Git Integration**: Validates JSON files before allowing commits
- **Fast Validation**: Quick checks for staged files only
- **Commit Prevention**: Stops commits with invalid JSON syntax

## How It Works

### For Developers

1. **During Development**:

   ```bash
   npm run lint          # Check all files including JSON
   npm run lint:json     # Check only JSON files (future feature)
   ```

2. **Before Building**:

   ```bash
   npm run build         # Automatically runs lint first
   ```

3. **Before Committing**:
   - Git automatically runs validation
   - Commit is blocked if JSON is invalid
   - Clear error messages guide fixes

### For Content Editors (Pastor)

The system provides helpful error messages for common issues:

**Trailing Comma Error**:

```
❌ src/data/ministries.json:32: Trailing comma found - remove comma before ] or }
```

**Invalid JSON Error**:

```
❌ src/data/ministries.json: Invalid JSON - Unexpected token '}' at position 1234
```

## Common JSON Issues Detected

### 1. Trailing Commas

```json
// ❌ WRONG - trailing comma
"schedule": [
  "Sunday Morning Worship - 10:45 AM",
  
],

// ✅ CORRECT - no trailing comma
"schedule": [
  "Sunday Morning Worship - 10:45 AM"
],
```

### 2. Missing Commas

```json
// ❌ WRONG - missing comma between items
"features": [
  "Traditional hymns"
  "Contemporary songs"
]

// ✅ CORRECT - comma between items
"features": [
  "Traditional hymns",
  "Contemporary songs"
]
```

### 3. Invalid Characters

```json
// ❌ WRONG - smart quotes
"description": "Christ–centered worship"

// ✅ CORRECT - straight quotes
"description": "Christ-centered worship"
```

## Validation Rules

### Church Information (churchInformation.json)

- Required fields: name, tagline, location, contact, services, seo
- Email format validation
- Phone number format checking
- Service times structure validation

### Ministries Data (ministries.json)

- Required fields: hero, ministries, seo
- Ministry structure validation (id, title, description required)
- Schedule format checking
- SEO data completeness

### Plan Visit Data (planvisit.json)

- Required fields: hero, seo
- Content structure validation

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run lint` | Full code quality check including JSON |
| `npm run build` | Build with automatic validation |
| `npm run setup-hooks` | Install/reinstall git hooks |
| `git commit --no-verify` | Bypass validation (emergency only) |

## Bypassing Validation

**⚠️ Use only in emergencies:**

```bash
git commit --no-verify -m "Emergency commit message"
```

This skips all validation and should only be used when:

- The validation system is broken
- Emergency fixes are needed
- Working with incomplete changes

## Error Resolution Guide

### When You See JSON Errors

1. **Read the error message** - it shows the exact file and line number
2. **Open the file** in VS Code or your editor
3. **Go to the line number** mentioned in the error
4. **Fix the syntax issue** (usually trailing commas or missing quotes)
5. **Save the file** and try again

### Getting Help

If you encounter issues you can't resolve:

1. Note the exact error message
2. Note which file is causing the issue
3. Reach out for technical support with this information

## Benefits

✅ **Prevents website breakage** from JSON syntax errors
✅ **Catches errors early** in the development process  
✅ **Provides clear guidance** on how to fix issues
✅ **Automatic enforcement** through git hooks
✅ **Maintains website quality** without manual checking

This system ensures that content updates maintain the technical quality needed for the website to function properly while providing clear guidance when issues occur.
