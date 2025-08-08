# 🏗️ World-Class Build Process (Vite + GitHub Pages + PWA)

This project now uses a lean, fast, and production-grade static build pipeline powered by **Vite**, with first-class support for **GitHub Pages**, **PWA offline caching**, **sitemap/robots generation**, and **bundle size budgets**.

## 🚀 Quick Start

```bash
npm install            # Install dependencies
npm run dev           # Vite dev server (HMR)
npm run build         # Production build -> dist/
npm run preview       # Preview production build locally
npm run clean         # Remove dist and temp artifacts
npm run lint          # Custom lint/quality checks
```

## 📁 Project Structure

```bash
├── src/                    # Source root (ALL HTML entry pages + JS, SCSS, Tailwind, assets)
│   ├── scss/               # SASS stylesheets
│   ├── js/                 # JavaScript files
│   ├── images/             # Image assets
│   └── assets/             # Icons / misc static
├── dist/                   # Vite production output (after build)
├── scripts/                # Utility scripts (clean.js, lint.js only)
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies & scripts
```

## 🛠️ Build Commands

### Development & Production

- **`npm run dev`** – Instant-start dev server (native ESM, on-demand transforms) with HMR
- **`npm run build`** – Production build (Rollup under the hood) → `dist/`
- **`npm run preview`** – Local preview of built output
- **`npm run clean`** – Remove `dist/` and caches
- **`npm run lint`** – Custom HTML/JS/SCSS quality checks

### Testing & Quality

- **`npm test`** - Run all quality checks (lint)
- **`npm run lint`** - Check code quality and best practices

## 🔧 Build Process Details

### 1. Clean Phase (`scripts/clean.js`)

- Removes all generated files and directories
- Ensures clean slate for each build
- Clears cache and temporary files

### 2. Build Phase (Vite Core)

- SCSS & Tailwind unified through JS entry imports (`src/main.js`)
- Tree-shaking, code splitting, hashed filenames
- Placeholder replacement (`{{key.path}}`) using `churchInformation.json`
 (all HTML resides under `src/`, so Vite `root` is `src` and multi-page inputs are set in `vite.config.js`)
- Automatic manifest + build-info emission
- Bundle budget check (env-configured `BUNDLE_BUDGET_KB`)

### 3. Development Server (Vite)

- Native ESM dev pipeline (fast cold start)
- Hot Module Replacement (CSS/JS partial updates)
- Source maps (non-production)

### 4. Preview (`vite preview`)

Serves the already built `dist/` with simple static server—useful for final validation.

### 5. Code Quality (`scripts/lint.js`)

- **HTML Validation**: Checks HTML structure and accessibility
- **CSS/SCSS Linting**: Identifies deprecated patterns
- **JavaScript Analysis**: Basic syntax and best practice checks
- **Package.json Validation**: Ensures proper configuration

## 📋 Build Features

### ✅ Automated Tasks

- [x] SCSS + Tailwind bundling via Vite
- [x] HTML placeholder population
- [x] Hashed asset output & manifest
- [x] Build info metadata
- [x] Bundle size budget warning
- [x] Sitemap & robots.txt generation
- [x] PWA manifest + service worker (auto-update)
- [x] GitHub Pages CI/CD deployment workflow

### ✅ Best Practices

- [x] Separation of source and output
- [x] Modular build scripts
- [x] Environment-specific configurations
- [x] Error handling and recovery
- [x] Performance optimizations
- [x] Security considerations
- [x] Cache management
- [x] Asset optimization

### 🔮 Future Enhancements

- [ ] Image optimization pipeline (sharp / vite-imagetools)
- [ ] HTML minification (custom plugin or default rollup html compress)
- [ ] Structured data (JSON-LD injection plugin)
- [ ] Visual regression tests (Playwright)
- [ ] Lighthouse CI integration
- [ ] Accessibility automation (axe-core CI)
- [ ] Multi-page generation (add more HTML + placeholder transforms)

## 🌐 Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit files in `src/`
3. **Auto Rebuild**: Files automatically rebuild on save
4. **Quality Check**: `npm run lint`
5. **Production Build**: `npm run build`
6. **Deploy**: Push to main (GitHub Actions handles Pages deploy)

## 📊 Performance

- **Fast Builds**: Optimized build process
- **Hot Reloading**: Instant feedback during development
- **Compressed Output**: Minimized file sizes
- **Cached Assets**: Efficient browser caching
- **Modern Standards**: Latest build practices

## 🔧 Configuration

### Tailwind CSS (`tailwind.config.js`)

Configure Tailwind CSS settings, custom themes, and purge options.

### SASS Variables (`src/scss/_variables.scss`)

Centralized SASS variables for colors, fonts, and spacing.

### Build Scripts (`scripts/`)

Only minimal auxiliary scripts (clean & lint) remain; legacy custom build/watch/serve/optimize/performance scripts have been removed in favor of native Vite + plugin functionality (repository cleanup performed 2025-08).

## 🚨 Troubleshooting

### Build Fails

1. Run `npm run clean` to clear cache
2. Run `npm install` to ensure dependencies
3. Check console output for specific errors

### File Watching Issues

- Restart development server: `npm run dev`
- Check file permissions
- Ensure files are in `src/` directory

### Production Issues

- Ensure `dist/` exists post-build
- If GitHub Pages shows 404: confirm repository Pages settings → deploy from GitHub Actions
- Double check `base` path is set via `GITHUB_PAGES=true` env in CI

## 📈 Best Practice Guidelines

### File Organization

- Keep source files in `src/`
- Use meaningful directory names
- Group related files together
- Follow consistent naming conventions

### CSS/SASS

- Use SASS partials for organization
- Follow BEM naming methodology
- Avoid deep nesting
- Use variables for consistency

### JavaScript

- Prefer ES modules & static imports
- Keep global scope clean (encapsulate helpers)
- Use dynamic imports for future large optional sections
- Avoid blocking long tasks on main thread (consider requestIdleCallback for non-critical)

### HTML

- Use semantic HTML5 elements
- Include accessibility attributes
- Optimize for performance
- Follow web standards

---

**Built with ❤️ using Vite for fast, reliable static delivery.**
