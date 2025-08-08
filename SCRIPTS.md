# NPM Scripts (Current Minimal Set)

Only the Vite-native workflow is retained; legacy custom Node build/watch/serve/optimize/performance scripts were removed (cleanup finalized 2025-08).

## `npm run dev`

Vite development server with HMR (default port 5173).

## `npm run build`

Production build into `dist/` (hashed assets, PWA, sitemap, robots, build-info).

## `npm run preview`

Local preview of the production build (static server) – sanity check before deploy.

## `npm run clean`

Removes `dist/` and caches (see `scripts/clean.js`).

## `npm run lint`

Custom lightweight quality checks (HTML/SCSS/JS + package.json sanity) via `scripts/lint.js`.

## `npm test`

Alias to `npm run lint` (placeholder for future test expansion).

## Common Workflows

Development:

```bash
npm run dev
```

Build & preview:

```bash
npm run build
npm run preview
```

Clean & rebuild:

```bash
npm run clean && npm run build
```

Quality check:

```bash
npm run lint
```

## Notes

- Removed scripts: custom `serve`, legacy build/watch, optimize, performance tracking – all superseded by Vite (and now deleted from repo).
- Removed config: `build.config.json` (no longer used).
- Tailwind directives now reside solely in `src/tailwind.css` (legacy `input.css` deleted).

Refer to `BUILD.md` for deeper architectural details.
