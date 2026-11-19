# Architecture Overview

Authoritative technical overview for the Oatville Community Church website. This central document consolidates prior scattered sections (Architecture, Build Process, Configuration, Performance notes, and the 2025 cleanup summary) from the root README.

---

## 1. Project Structure

```text
├── src/                    # All source (Vite root)
│   ├── js/                 # JavaScript (progressive enhancement)
│   ├── images/             # Image assets (photos/graphics)
│   ├── assets/             # Favicons / manifest / misc static
│   ├── data/               # Technical data JSON (site.json, youtube.json, live-status.json)
│   ├── tailwind.css        # Tailwind entry stylesheet
│   └── *.html              # Multi‑page HTML entry points (registered in vite.config.js)
├── content/                # Editable content: markdown + YAML front matter (church info, pages, ministries/)
├── scripts/                # Node utility scripts (clean, lint, content-loader)
├── Documentation/          # Canonical project docs (this file, build, scripts, etc.)
├── dist/                   # Build output (generated – never edit manually)
└── vite.config.js          # Vite configuration & custom HTML/data plugins
```

---
Key rules: All runtime / static assets originate under `src/`. `publicDir` is disabled (`public/` must not exist). Multi‑page entries explicitly declared in `vite.config.js` for sitemap & canonical tag generation.

---

## 2. Build Pipeline Flow

1. HTML entry pages discovered from explicit `rollupOptions.input`.
2. Custom placeholder plugin replaces `{{token}}` with values from the merged content object built by `scripts/content-loader.js` from `content/**/*.md` + `src/data/*.json` (dot‑notation supported).
3. Tailwind CSS compiled from `src/tailwind.css`; unused utilities purged by content globs.
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
| Data source | `content/**/*.md`, `src/data/site.json`, `src/data/youtube.json` via `scripts/content-loader.js` | Single merged `churchData` object for templated content & structured data values |
| Tailwind content | `tailwind.config.js` | Update if adding non‑standard file patterns |
| Tailwind entry stylesheet | `src/tailwind.css` | Shared utility-driven styling entry |
| Performance budget | ENV `BUNDLE_BUDGET_KB` or plugin default | Warns when exceeded |

---

## 4. Data & Placeholder Conventions

- Use semantic, plain‑text values in `content/*.md` front matter (each top-level key becomes a top-level data key; `plan-visit.md` nests under `planvisit`; ministry file bodies become `description`).
- Reference with `{{key}}` or nested `{{path.to.key}}`.
- Repeat and conditional blocks are expanded by `scripts/template-blocks.js` before placeholders: `{{#each list}}…{{/each}}` (nestable; `{{this}}`, `{{this.field}}`, `{{@index}}`), `{{#if x}}…{{else}}…{{/if}}`, `{{#unless x}}`, `{{#unless @last}},{{/unless}}` for JSON-LD commas, and `{{plain this.field}}` to straighten curly quotes in JSON-LD. Items with `draft: true` render only in local preview.
- `npm run lint` verifies every placeholder and `{{#each}}` in `src/*.html` has data behind it.
- Tailwind scans only `src/` (`source("./")` in `src/tailwind.css`), so editing content or docs never changes the CSS.
- For new structured data (JSON‑LD) fields, add to the content (or `src/data/site.json` for technical settings) then embed scripts in page `<head>`.

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

- GitHub Pages workflow runs `npm ci && npm run lint && npm run build:ci` with `GITHUB_PAGES=true` to set proper base.
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
4. Populate any new data keys in a `content/*.md` file (or `src/data/site.json`).
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

### 11.1 Asset Hygiene & Recent Cleanup

- Temporary exploratory folders (e.g. `attached_assets/`) are not retained; all runtime imagery must live under `src/images/` and documentation-only images should (if needed) be placed under `Documentation/` (consider creating `Documentation/images/`).
- Avoid committing editor upload artifacts or one-off design reference images. Remove them promptly after use or relocate with clear naming.
- Verify every binary asset is referenced at least once in the codebase (`grep` before adding large media). Unreferenced assets should be deleted in the same PR to prevent repository bloat.
- Prefer lowercase, hyphenated filenames (e.g. `church-exterior.webp`). If adding WebP/AVIF alongside JPEG for fallback, keep identical basenames and document any fallback logic if scripted.
- Explicit width/height attributes are required on `<img>` tags (CLS stability). Already applied for current images.
- February 2025 cleanup removed an unused banner image (`OCC_banner.jpg`) and the prior `attached_assets/` folder to enforce single-source asset provenance.

---
*End of Architecture Overview.*
