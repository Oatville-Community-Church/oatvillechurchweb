# 📜 NPM Scripts Reference

This document provides detailed information about all available NPM scripts in this project.

## 🚀 Primary Commands

### `npm run dev`

**Development server with hot reloading**

- Starts the development server at <http://localhost:3000>
- Automatically rebuilds when files change
- Includes file watching for instant feedback
- Perfect for active development

```bash
npm run dev
```

### `npm run build`

**Production build process**

- Runs complete build pipeline
- Includes pre/post build hooks
- Generates optimized assets
- Creates build info metadata

```bash
npm run build
```

### `npm start`

**Build and serve (production)**

- Builds the project for production
- Starts production server
- Best for deployment testing

```bash
npm start
```

## 🛠️ Build Commands

### `npm run clean`

**Clean all generated files**

- Removes public/, dist/, temp/ directories
- Clears build cache
- Ensures fresh build environment

```bash
npm run clean
```

### `npm run serve`

**Production server only**

- Serves pre-built files from public/
- Includes compression and security headers
- Requires prior build (run `npm run build` first)

```bash
npm run serve
```

### `npm run build:production`

**Production-optimized build**

- Sets NODE_ENV=production
- Enables production optimizations
- Generates compressed assets

```bash
npm run build:production
```

## 🔍 Quality & Testing

### `npm run lint`

**Code quality checks**

- Validates HTML structure and accessibility
- Checks CSS/SCSS for best practices
- Analyzes JavaScript for common issues
- Reports errors and warnings

```bash
npm run lint
```

### `npm test`

**Run all tests (currently runs lint)**

- Executes code quality checks
- Future: will include unit tests
- Required for CI/CD pipelines

```bash
npm test
```

## 🔄 Lifecycle Hooks

### `npm run prebuild`

**Pre-build cleanup (auto-runs before build)**

- Automatically executed before `npm run build`
- Runs `npm run clean`
- Ensures clean build environment

### `npm run postbuild`

**Post-build validation (auto-runs after build)**

- Automatically executed after `npm run build`
- Runs `npm run lint`
- Validates build quality

## 📚 Legacy Commands (Backwards Compatibility)

These commands are maintained for backwards compatibility but use the old build system:

### `npm run _legacy:build`

**Legacy build process**

```bash
npm run _legacy:build
```

### `npm run _legacy:watch`

**Legacy file watching**

```bash
npm run _legacy:watch
```

### `npm run _legacy:build-sass`

**Legacy SASS compilation**

```bash
npm run _legacy:build-sass
```

### `npm run _legacy:build-css`

**Legacy Tailwind compilation**

```bash
npm run _legacy:build-css
```

## 🎯 Common Workflows

### Development Workflow

```bash
# Start development
npm run dev

# Make changes to files in src/
# Files automatically rebuild on save

# Run quality checks
npm run lint
```

### Production Deployment

```bash
# Clean build
npm run clean

# Production build
npm run build:production

# Test production build locally
npm run serve

# Deploy (copy public/ directory to server)
```

### Troubleshooting

```bash
# Clean everything and rebuild
npm run clean
npm install
npm run build

# Check for issues
npm run lint

# Test locally
npm run dev
```

## ⚙️ Configuration

Scripts behavior can be customized through:

- **`build.config.json`** - Build process configuration
- **`tailwind.config.js`** - Tailwind CSS settings  
- **`package.json`** - NPM scripts and dependencies
- **Environment variables** - NODE_ENV, PORT, etc.

## 🔧 Advanced Usage

### Custom Port

```bash
PORT=8080 npm run dev
PORT=8080 npm run serve
```

### Environment Variables

```bash
NODE_ENV=development npm run build
NODE_ENV=production npm run build
```

### Chaining Commands

```bash
npm run clean && npm run build && npm run serve
```

## 📊 Performance

- **Build time**: ~1-2 seconds
- **Hot reload**: ~100-500ms
- **File watching**: Real-time
- **Server startup**: ~100ms

## 🚨 Error Handling

Scripts include comprehensive error handling:

- Build failures stop the process
- File watching recovers gracefully
- Server errors are logged clearly
- Exit codes indicate success/failure

## 🌐 Browser Support

Built assets support:

- Modern browsers (ES6+)
- Progressive enhancement
- Responsive design
- Accessibility standards

---

*For more details, see [BUILD.md](BUILD.md)*
