# 🏛️ Oatville Community Church Website

Modern, multi‑page static site powered by Vite, Tailwind, and SCSS. This README is intentionally concise; in‑depth technical and process documentation now lives under `Documentation/`.

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

## ✨ Key Features

- Vite dev server & optimized production build
- Tailwind + SCSS (utility + structured styles)
- Data placeholders via `churchInformation.json`
- Sitemap & robots generation
- Performance budget warnings
- Accessibility & SEO conscious head/meta structure

## 🏗️ Structure (Summary)

All source lives in `src/` (HTML entry pages, styles, scripts, assets, data). See `Documentation/ARCHITECTURE.md` for full details.

## 🛠️ Development Commands

- `npm run dev`       - Dev server (HMR)
- `npm run build`     - Production build
- `npm run preview`   - Static preview of dist/
- `npm run clean`     - Remove dist/
- `npm run lint`      - Basic quality scan

Full command explanations: `Documentation/SCRIPTS.md`.

### Making Changes

1. Edit files in the `src/` directory (including HTML pages)
2. Changes automatically rebuild with `npm run dev`
3. Check quality with `npm run lint`
4. Build for production with `npm run build`

## 🎨 Styling (Pointers)

SCSS partials in `src/scss/`. Tailwind configured via `tailwind.config.js` and loaded from `src/tailwind.css`. See Architecture doc for layering guidance.

## 📄 Content Source

Key textual data & placeholders: `src/data/churchInformation.json`.

## 🔧 Configuration

Central config: `vite.config.js`. Tailwind: `tailwind.config.js`. Data-driven tokens: `churchInformation.json`.

## 📊 Performance & SEO

Automated sitemap, robots, canonical tags, and bundle size reporting.

## 🚨 Troubleshooting

See `Documentation/BUILD.md` (Troubleshooting section) for full guidance.

## 🌐 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)  
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 Extended Documentation

- Architecture: `Documentation/ARCHITECTURE.md`
- Build System: `Documentation/BUILD.md`
- Scripts Reference: `Documentation/SCRIPTS.md`
- Governance / Assistant Policy: `.github/copilot-instructions.md`

## 🚀 Deployment

Primary target: GitHub Pages (CI build & deploy). Portable to any static host (Netlify, Vercel, S3/CDN). Details: `Documentation/ARCHITECTURE.md` §7.

## 🤝 Contributing

1. Create a feature branch.
2. Edit only under `src/` (no `public/`).
3. Add/update data in `churchInformation.json` when introducing new placeholders.
4. Run `npm run lint` & build before PR.
5. Document substantive architectural changes in `Documentation/ARCHITECTURE.md`.

---

*Built with modern web standards, Vite, and automated CI for Oatville Community Church* 🙏

---

---
Historical refactors & extended rationale moved to `Documentation/ARCHITECTURE.md`.
