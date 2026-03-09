# 🏗️ World-Class Build Process (Vite + GitHub Pages + PWA)

This project now uses a lean, fast, and production-grade static build pipeline powered by **Vite**, with first-class support for **GitHub Pages**, **PWA offline caching**, **sitemap/robots generation**, and **bundle size budgets**.

## 🚀 Quick Start

```bash
npm install            # Install dependencies
npm run dev           # Vite dev server (HMR)
npm run build         # CI-safe build (lint + vite build) -> dist/
npm run build:release # Full release build (version + assets + YouTube refresh)
npm run preview       # Preview production build locally
npm run clean         # Remove dist and temp artifacts
npm run lint          # Custom lint/quality checks
```

## 📁 Project Structure

```bash
├── src/                    # Source root (ALL HTML entry pages + JS, Tailwind, assets)
│   ├── js/                 # JavaScript files
│   ├── images/             # Image assets
│   ├── tailwind.css        # Tailwind entry stylesheet
│   └── assets/             # Icons / misc static
├── dist/                   # Vite production output (after build)
├── scripts/                # Utility scripts (clean.js, lint.js only)
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies & scripts
```

## 🛠️ Build Commands

### Development & Production

- **`npm run dev`** – Instant-start dev server (native ESM, on-demand transforms) with HMR
- **`npm run build`** – CI-safe production build (`lint` + `build:ci`) → `dist/`
- **`npm run build:ci`** – Raw Vite production build (used by CI workflows)
- **`npm run build:release`** – Release build (lint + version increment + image optimize + YouTube refresh + Vite build)
- **`npm run preview`** – Local preview of built output
- **`npm run clean`** – Remove `dist/` and caches
- **`npm run lint`** – Custom HTML/CSS/JS quality checks

### Testing & Quality

- **`npm test`** - Run all quality checks (lint)
- **`npm run lint`** - Check code quality and best practices

## 🔧 Build Process Details

### 1. Clean Phase (`scripts/clean.js`)

- Removes all generated files and directories
- Ensures clean slate for each build
- Clears cache and temporary files

### 2. Build Phase (Vite Core)

- Tailwind CSS entry import compiled through `src/main.js` (`src/tailwind.css`)
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
- **CSS Linting**: Checks stylesheet best practices
- **JavaScript Analysis**: Basic syntax and best practice checks
- **Package.json Validation**: Ensures proper configuration

## 📋 Build Features

### ✅ Automated Tasks

- [x] Tailwind-driven CSS bundling via Vite
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

### Tailwind Entry Stylesheet (`src/tailwind.css`)

Shared utility-first stylesheet entry with global Tailwind layers and project-level custom CSS.

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

### CSS/Tailwind

- Prefer Tailwind utility classes and semantic HTML composition
- Keep custom CSS in `src/tailwind.css` minimal and component-oriented
- Avoid deep selector nesting and `!important` unless justified
- Use CSS variables for repeated theme tokens when utilities are not enough

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
