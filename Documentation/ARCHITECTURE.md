# Architecture Overview

Authoritative technical overview for the Oatville Community Church website. This central document consolidates prior scattered sections (Architecture, Build Process, Configuration, Performance notes, and the 2025 cleanup summary) from the root README.

---

## 1. Project Structure

```text
├── src/                    # All source (Vite root)
│   ├── scss/               # SCSS partials & main stylesheet
│   ├── js/                 # JavaScript (progressive enhancement)
│   ├── images/             # Image assets (photos/graphics)
│   ├── assets/             # Favicons / manifest / misc static
│   ├── data/               # Data JSON (churchInformation.json, future caches)
│   └── *.html              # Multi‑page HTML entry points (registered in vite.config.js)
├── scripts/                # Node utility scripts (clean, lint)
├── Documentation/          # Canonical project docs (this file, build, scripts, etc.)
├── dist/                   # Build output (generated – never edit manually)
└── vite.config.js          # Vite configuration & custom HTML/data plugins
```

---
Key rules: All runtime / static assets originate under `src/`. `publicDir` is disabled (`public/` must not exist). Multi‑page entries explicitly declared in `vite.config.js` for sitemap & canonical tag generation.

---

## 2. Build Pipeline Flow

1. HTML entry pages discovered from explicit `rollupOptions.input`.
2. Custom placeholder plugin replaces `{{token}}` with values from `src/data/churchInformation.json` (dot‑notation supported).
3. Tailwind + SCSS compiled; unused utilities purged by content globs.
4. Rollup optimization: tree‑shaking, minification, content‑hashed filenames.
5. Static copy plugin moves approved assets from controlled `src` subpaths.
6. Sitemap & robots generated from emitted HTML.
7. (Optional) PWA enhancements & build metadata file emitted.

See also: `Documentation/BUILD.md` for command‑level build instructions.

---

## 3. Configuration Surfaces

| Aspect | Location | Notes |
|--------|----------|-------|
| Vite root & inputs | `vite.config.js` | Keep new pages registered for sitemap inclusion |
| Data source | `src/data/churchInformation.json` | Single source for templated content & structured data values |
| Tailwind content | `tailwind.config.js` | Update if adding non‑standard file patterns |
| SCSS variables | `src/scss/_variables.scss` | Theming tokens |
| Performance budget | ENV `BUNDLE_BUDGET_KB` or plugin default | Warns when exceeded |

---

## 4. Data & Placeholder Conventions

- Use semantic, plain‑text values in `churchInformation.json`.
- Reference with `{{key}}` or nested `{{path.to.key}}`.
- For new structured data (JSON‑LD) fields, add to JSON then embed scripts in page `<head>`.

---

## 5. Performance Considerations

- Soft total raw bundle budget ≈ 300 KB (pre‑gzip) – monitor reports.
- Keep Largest Contentful Paint (hero heading / image) lean; prefer optimized WebP/AVIF.
- Lazy‑load non‑critical imagery (`loading="lazy"`).
- Defer heavy third‑party scripts (prefer none unless justified).
- Consider “lite” YouTube embedding if cumulative layout shift or blocking cost increases.

---

## 6. Accessibility & SEO Integration (Cross‑Reference)

Refer to `.github/copilot-instructions.md` §7–§8 for authoritative a11y & metadata requirements. Each page must maintain a single `<h1>`, proper alt text, and JSON‑LD where applicable (Organization, Event, FAQ, VideoObject).

---

## 7. Deployment Notes

- GitHub Pages workflow runs `npm ci && npm run build` with `GITHUB_PAGES=true` to set proper base.
- Output lives exclusively in `dist/`.
- Static hosting portability: Any CDN / static host works (Netlify, Vercel, S3+CloudFront, etc.).

---

## 8. Historical Cleanup (February 2025)

Actions performed during project streamlining:

- Removed legacy bespoke build scripts (replaced fully by Vite pipeline).
- Eliminated deprecated `pages/` directory; all entries standardized under `src/`.
- Purged unused dependencies (`@types/node`, `node-fetch`, `rollup-plugin-visualizer`).
- Unified asset locations (`src/images`, `src/assets`).
- Hardened prohibition of `public/` usage (`publicDir: false`).

---

## 9. Adding a New Page (Quick Recipe)

1. Create `src/<name>.html` replicating head structure from an existing page.
2. Insert required meta + placeholder tokens.
3. Add entry to `rollupOptions.input` in `vite.config.js`.
4. Populate any new data keys in `churchInformation.json`.
5. Run `npm run build` and verify page appears in sitemap & canonical link.

---

## 10. Related Documents

- Build Commands: `Documentation/BUILD.md`
- Script Reference: `Documentation/SCRIPTS.md`
- Assistant / Governance Policy: `.github/copilot-instructions.md`

---

## 11. Maintenance Guidelines

- Avoid duplicating substantive narrative from this file in the root README; link instead.
- Update budget thresholds & performance notes if new tooling or major assets introduced.
- Record notable refactors in an Appendix section rather than inflating README.

---
*End of Architecture Overview.*
