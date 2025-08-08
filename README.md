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
│   └── *.html             # HTML templates
├── scripts/               # Clean + lint utilities
├── dist/                  # Build output (after npm run build)
└── package.json           # Dependencies & scripts
```

### Build Process (Vite)

1. **Entry Aggregation**: `src/main.js` imports SCSS + Tailwind + JS
2. **Placeholder Injection**: `{{token}}` replaced from `src/data/churchInformation.json`
3. **Optimization**: Minify, tree-shake, hash filenames
4. **SEO Aids**: Canonical + OG tags + sitemap + robots
5. **PWA**: Manifest + service worker via `vite-plugin-pwa`
6. **Budget**: Warn if raw bundle size > `BUNDLE_BUDGET_KB`

## 🛠️ Development

### Available Commands

- `npm run dev`       - Dev server (HMR)
- `npm run build`     - Production build
- `npm run preview`   - Static preview of dist/
- `npm run clean`     - Remove dist/
- `npm run lint`      - Basic quality scan

See [SCRIPTS.md](SCRIPTS.md) for complete command reference.

### Making Changes

1. Edit files in the `src/` directory
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

Config: `tailwind.config.js`. Tailwind directives now live in `src/tailwind.css` imported by `src/main.js` (no separate CLI output file).

## 📱 Content Sections

- **Hero**: Welcome message with call-to-action
- **About**: Church mission, values, and vision
- **Services**: Worship and Bible study schedules  
- **Contact**: Address, phone, email, and hours
- **Footer**: Copyright and additional info

## 🔧 Configuration

### Build Settings

Primary configuration: `vite.config.js` (GitHub Pages base, sitemap/robots, PWA, build budgets, static copy from src).

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
