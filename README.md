# 🏛️ Oatville Community Church Website (Vite + GitHub Pages + PWA)

A modern, responsive website for Oatville Community Church using a Vite-powered static build, automated GitHub Pages deployment, and optional PWA offline capabilities.

## 🚀 Quick Start

```bash
npm install       # dependencies
npm run dev       # Vite dev server (HMR)
npm run build     # production build -> dist/
npm run preview   # preview built site locally
npm run lint      # custom lint checks
npm run clean     # remove dist
```

Dev server (default): <http://localhost:5173>

## ✨ Features

- **Modern Build System**: Vite (ESM dev server + Rollup build)
- **Hot Reloading**: Instant HMR for CSS/JS
- **SASS & Tailwind**: Best-in-class styling with both SASS and Tailwind CSS
- **Responsive Design**: Mobile-first, fully responsive layout
- **Performance Optimized**: Tree-shaking, code splitting, hashed assets
- **Code Quality**: Built-in linting and quality checks
- **Accessibility**: WCAG compliant with semantic HTML

## 🏗️ Architecture

### Project Structure

```bash
├── src/                    # Source files (edit these)
│   ├── scss/              # SASS stylesheets  
│   ├── js/                # JavaScript files
│   ├── images/            # Image assets
│   ├── assets/            # Other static assets
│   └── *.html             # HTML entry pages (multi-page root lives here)
├── scripts/               # Utility scripts (clean + lint only)
├── dist/                  # Build output (after npm run build)
└── package.json           # Dependencies & scripts
```

### Build Process (Vite)

1. **Entry Pages**: All HTML entry files live directly under `src/` (Vite root set to `src`)
2. **Entry Aggregation**: `src/main.js` imports SCSS + Tailwind (`src/tailwind.css`) + JS
3. **Placeholder Injection**: `{{token}}` replaced from `src/data/churchInformation.json`
4. **Optimization**: Minify, tree-shake, hash filenames
5. **SEO Aids**: Canonical + OG tags + sitemap + robots
6. **PWA**: Manifest + service worker via `vite-plugin-pwa`
7. **Budget**: Warn if raw bundle size > `BUNDLE_BUDGET_KB`

## 🛠️ Development

### Available Commands

- `npm run dev`       - Dev server (HMR)
- `npm run build`     - Production build
- `npm run preview`   - Static preview of dist/
- `npm run clean`     - Remove dist/
- `npm run lint`      - Basic quality scan

See [SCRIPTS.md](SCRIPTS.md) for complete command reference.

### Making Changes

1. Edit files in the `src/` directory (including HTML pages)
2. Changes automatically rebuild with `npm run dev`
3. Check quality with `npm run lint`
4. Build for production with `npm run build`

## 🎨 Styling

### SASS (Primary Styles)

*Variables:* `src/scss/_variables.scss`  
*Base:* `src/scss/_base.scss`  
*Components:* `src/scss/_components.scss`  
*Main:* `src/scss/styles.scss`

### Tailwind CSS (Utility Classes)

Config: `tailwind.config.js`. Tailwind directives live in `src/tailwind.css` imported by `src/main.js` (legacy `input.css` removed).

## 📱 Content Sections

- **Hero**: Welcome message with call-to-action
- **About**: Church mission, values, and vision
- **Services**: Worship and Bible study schedules  
- **Contact**: Address, phone, email, and hours
- **Footer**: Copyright and additional info

## 🔧 Configuration

### Build Settings

Primary configuration: `vite.config.js` (GitHub Pages base, sitemap/robots, PWA, build budgets, static copy from src). Legacy custom Node build scripts removed in favor of pure Vite pipeline.

### Tailwind Config

Modify `tailwind.config.js` for styling customization.

### Server Settings  

Environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode

## 📊 Performance

- **Cold Start**: ~<1s
- **HMR**: Near-instant incremental updates
- **Bundle Size**: Budget guarded
- **SEO**: sitemap.xml + robots.txt + canonical

## 🚨 Troubleshooting

### Common Issues

**Build fails:**

```bash
npm run clean
npm ci
npm run build
```

**Development server issues:**

- Ensure no process on port 5173
- Restart: `npm run dev`
- Validate import paths

**Style not updating:**

- Confirm file imported via `src/main.js`
- Ensure Tailwind class is not purged (matches content globs)

## 🌐 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)  
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 Documentation

- [BUILD.md](BUILD.md) - Complete build system guide
- [SCRIPTS.md](SCRIPTS.md) - NPM scripts reference  
- [tailwind.config.js](tailwind.config.js) - Tailwind configuration

## 🚀 Deployment (GitHub Pages)

Automatic via GitHub Actions workflow `.github/workflows/deploy.yml`:

1. Push to `main` triggers CI.
2. CI runs `npm ci && npm run build` with `GITHUB_PAGES=true` (sets correct base path).
3. Dist bundle uploaded & deployed to Pages.
4. Site available at: `https://sharesmallbiz-support.github.io/oatvillechurch`.

### Static Hosting

Works with any static hosting service:

- Netlify
- Vercel  
- GitHub Pages
- AWS S3 + CloudFront
- Traditional web hosting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes in `src/` directory
4. Test with `npm run dev`
5. Validate with `npm run lint`
6. Submit pull request

---

*Built with modern web standards, Vite, and automated CI for Oatville Community Church* 🙏

---

### Repository Cleanup (2025-02)

The project was streamlined:

- Removed legacy custom Node build/dev/serve/optimize/performance scripts (Vite fully replaces them)
- Removed deprecated `pages/` directory (all HTML entry pages live directly under `src/` and are registered in `vite.config.js`)
- Purged unused dependencies: `@types/node`, `node-fetch`, `rollup-plugin-visualizer`
- Tailwind config now scans only `./src/**/*`
- Consolidated static assets under `src/` (images → `src/images`, meta assets → `src/assets`)

When adding a new page:

1. Create `src/<name>.html`
2. Register it in `vite.config.js` under `rollupOptions.input`
3. Use `{{placeholders}}` from `src/data/churchInformation.json`
4. Build with `npm run build` to confirm inclusion in sitemap & canonical output

All future assets must originate under `src/`. Avoid creating a `public/` directory (intentionally disabled via `publicDir: false`).
