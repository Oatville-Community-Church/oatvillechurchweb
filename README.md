# 🏛️ Oatville Community Church Website

Modern, multi‑page static site powered by Vite, Tailwind, SCSS, and a light data placeholder layer. This README intentionally stays concise; authoritative deep‑dive docs live under `Documentation/`.

## 🚀 Quick Start

```bash
npm install            # install dependencies (Node >=16)
npm run dev            # Vite dev server (HMR)
npm run build          # production build -> dist/ (runs prebuild automatically)
npm run preview        # preview built site locally
npm run lint           # custom lint checks
npm test               # alias -> lint (placeholder for future tests)
npm run clean          # remove dist
npm run images:optimize # (standalone) optimize source images via sharp
```

Dev server (default): <http://localhost:5173>

## ✨ Key Features

- Multi‑page Vite build (entries: `index`, `plan-visit`, `ministries`, `offline`, `404`)
- Tailwind + SCSS (utility + structured style partials)
- Data placeholder replacement via `churchInformation.json` (`{{path.to.key}}`)
- Automated: sitemap.xml, robots.txt, canonical tags, Open Graph tags
- PWA manifest & service worker (auto update) + offline fallback page
- Build metadata emission (`build-info.json`) & bundle size budget reporter (soft 300 KB)
- Prebuild pipeline: image optimization + latest YouTube video metadata fetch
- Accessibility & SEO‑optimized head/meta and structured data friendly
- Strict asset policy: ALL runtime assets live under `src/` (`publicDir: false`)

## 🏗️ Structure (Summary)

All source lives in `src/` (HTML entry pages, styles, scripts, assets, data). No `public/` directory is used or permitted (`publicDir: false`). See `Documentation/ARCHITECTURE.md` for full details.

## 🛠️ Development Commands

- `npm run dev`            - Dev server (HMR)
- `npm run build`          - Production build (runs `prebuild` internally: image optimize + video fetch)
- `npm run preview`        - Static preview of dist/
- `npm run clean`          - Remove dist/
- `npm run lint` / `test`  - Basic quality scan
- `npm run images:optimize` - Manually (re)optimize images if needed

Full command explanations: `Documentation/SCRIPTS.md`.

### Making Changes

1. Edit files in `src/` (HTML, SCSS, JS, data) – keep new assets under `src/images` or `src/assets`.
2. Dev server (`npm run dev`) hot reloads changes.
3. Add new templated content first to `churchInformation.json` then reference with `{{placeholder}}`.
4. Run `npm run lint` before committing.
5. Run `npm run build` to verify production output (check bundle size note in console).

## 🎨 Styling (Pointers)

SCSS partials live in `src/scss/` with variables in `_variables.scss`. Tailwind configured via `tailwind.config.js` and sourced from `src/tailwind.css`. Prefer utility classes; promote repeated patterns to SCSS only when justified.

## 📄 Content Source

Key textual data & placeholders: `src/data/churchInformation.json` (single source of truth for contact info, service times, SEO title/description, hero copy, FAQ, etc.).

## 🔧 Configuration

Central config: `vite.config.js` (multi‑page inputs, plugins, base path). Tailwind: `tailwind.config.js`. Data: `churchInformation.json`. Engines: Node >=16 (see `package.json`). Set `GITHUB_PAGES=true` in CI to emit correct `base` for GitHub Pages.

## 📊 Performance & SEO

Automatic sitemap, robots, canonical & OG tags insertion, bundle size reporting (warns if budget exceeded). PWA adds offline resilience (see `offline.html`). Structured data (JSON‑LD) can be added inline per page using values from the data file.

## 🚨 Troubleshooting

See `Documentation/BUILD.md` (Troubleshooting section) for full guidance. Common: run `npm run clean`, reinstall deps, then rebuild. Ensure new pages are registered in `vite.config.js` `rollupOptions.input`.

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

Primary target: GitHub Pages (CI build & deploy) with `GITHUB_PAGES=true` env to set correct base path. Portable to any static host (Netlify, Vercel, S3/CDN) since output is static in `dist/`. Details: `Documentation/ARCHITECTURE.md` §7.

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
