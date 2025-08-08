# Copilot Instructions: Oatville Community Church Site

Authoritative guidelines for automated assistance (GitHub Copilot / AI agents) working on this repository.

---

## 0. Critical Asset Policy (Non-Negotiable)

ALL site source assets (HTML entry files, images, media, icons, fonts, JSON/data, scripts, styles, manifests) MUST live under `src/`. Root-level HTML entry pages have been deprecated — multi‑page entries now reside in `src/` and are declared explicitly in `vite.config.js` (`root: 'src'`). The legacy `public/` directory pattern remains disabled (`publicDir: false`).

Hard rules:

- Do NOT create a `public/` directory.
- Do NOT reference `/public/...` paths; use root-relative paths that Vite rewrites from `src` (e.g. `/images/foo.webp`).
- If you find any existing files in `public/`, migrate them into an appropriate `src/` subfolder (`src/images`, `src/assets`, etc.) and remove the `public` copy.
- New static assets: place in `src/images/` (photos/graphics) or `src/assets/` (favicons, manifest icons, logos, fonts, misc static).
- Build output must only be written to `dist/` by the Vite build—never hand-edit `dist/`.

Automations / plugins (`staticCopyPlugin`, PWA manifest) already expect this structure; violating it will cause assets to be omitted from production builds or cached incorrectly.

If a contribution introduces `public/`, the change should be rejected or refactored before merge.

---

## 1. Project Overview

A modern static, multi-page church website built with Vite, Tailwind JIT, SCSS, and a light data-driven templating layer (placeholder replacement from `src/data/churchInformation.json`). All static assets must originate inside `src/*`; the legacy `/public` pattern is intentionally disabled (see `vite.config.js`: `publicDir: false`). Build artifacts are emitted to `dist/`.

Primary goals:

- Communicate service times, mission, location, and ministries clearly.
- Promote weekly YouTube live stream & sermon archive.
- Improve local & organic search visibility (structured data + FAQ + events + video schema).
- Provide fast, accessible, mobile-first UX.

---

## 2. Source of Truth Data

Central dynamic data lives in: `src/data/churchInformation.json`.

- Add new mission / service / social / testimonial / SEO metadata fields here first.
- Keys can be referenced in HTML using `{{path.to.key}}` placeholders (see placeholder plugin in `vite.config.js`). Nested paths supported via dot notation.
- Keep content semantic and concise; avoid embedded HTML inside JSON values except for simple line breaks if absolutely required.

### 2.1 Adding New Data Fields

1. Add to `churchInformation.json`.
2. Reference in HTML using `{{newField}}` or `{{parent.child}}`.
3. If used in structured data (JSON-LD), update the injection logic block (create if missing) in `index.html` or page file.

---

## 3. Pages & Routing

Current entry HTML pages (all in `src/`):

- `src/index.html`
- `src/plan-visit.html`
- `src/ministries.html`
- `src/offline.html`

Adding a new page:

1. Create `src/<pagename>.html` (place directly under `src/`; avoid subfolders unless updating Tailwind content globs if needed).
2. Copy standard `<head>` structure from `src/index.html` (retain meta/OG/twitter placeholders; add structured data as required).
3. Use `{{placeholders}}` sourced from `src/data/churchInformation.json`.
4. Add the page to `rollupOptions.input` in `vite.config.js` (explicit multi-page inputs; required for sitemap and canonical generation).
5. Build (`npm run build`) to verify it appears in `dist/` and in generated `sitemap.xml`.

---

## 4. Build & Scripts

NPM Scripts:

- `dev` – Vite dev server.
- `build` – Production build (outputs `dist/`).
- `preview` – Preview production build.
- `clean` / `lint` – Housekeeping tasks.

Vite Plugins of Note:

- `htmlPlaceholderPlugin` – Replaces `{{...}}` tokens inline.
- `sitemapAndRobotsPlugin` – Auto-generates `sitemap.xml` & `robots.txt` from emitted HTML.
- `staticCopyPlugin` – Copies select static assets from controlled `src` directories.
- `buildInfoPlugin` – Emits `build-info.json` (can be displayed in an admin/debug panel).

Performance Budget: Soft budget of 300 KB raw total (see bundle size reporter). If exceeded, recommend code splitting, image optimization, or removing unused CSS.

---

## 5. Asset Management

- All images: place in `src/images/` (or nested logical subfolders). Use lowercase, hyphenated filenames (e.g., `church-exterior.webp`).
- Icons / favicons / static site meta: `src/assets/`.
- Do NOT create or rely on `/public` directory. The build has `publicDir: false` deliberately (see Critical Asset Policy §0).
- Prefer modern formats: WebP / AVIF for photographs, SVG for vector.
- Include explicit `width` & `height` attributes on `<img>` for CLS stability.
- Lazy-load non-critical images: `loading="lazy"` except hero / above-the-fold.

---

## 6. Styling & Theming

- Tailwind JIT configured: update `tailwind.config.js` if new file patterns added.
- Avoid arbitrary variant proliferation—prefer component classes and extracted partials if complexity grows.
- SCSS lives under `src/scss/`; if creating large custom styles, group logically (`_components.scss`, `_layout.scss`, etc.).
- Use utility-first approach by default; fall back to SCSS only for repeated compound patterns.

---

## 7. Accessibility (a11y) Standards

Always ensure:

- One distinct `<h1>` per page. Subsequent headings follow a logical hierarchy (no skipped levels if possible).
- Color contrast meets WCAG AA (check text on gradients/dark backgrounds).
- Provide meaningful `alt` text; if decorative, use `alt=""`.
- Interactive elements have visible keyboard focus.
- Add `aria-label` or `title` for icon-only links (social icons, subscribe buttons).
- Provide `lang="en"` on `<html>` (already present).
- Consider adding a skip link `<a href="#main" class="skip-link">Skip to main content</a>`.

---

## 8. SEO & Metadata Guidelines

Required elements in every HTML `<head>`:

- `<title>` – Unique, primary keyword left-weighted.
- `<meta name="description">` – 150–160 char compelling summary.
- `<link rel="canonical">` – Auto-inserted; verify correct when adding new pages.
- Open Graph: `og:title`, `og:description`, `og:type=website`, `og:url`, `og:image`.
- Twitter Card: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
- Remove deprecated `meta keywords`.

Structured Data (JSON-LD) inclusion priorities:

1. `Organization` / `Church` schema (sitewide, once).
2. `Event` (weekly services; treat next upcoming as `Event`).
3. `FAQPage` (for common visitor questions).
4. `VideoObject` (latest sermon) – update when video changes.

Place JSON-LD scripts near end of `<head>` before closing tag. Validate with Google Rich Results Test (avoid runtime JS-dependent injection if possible—inline static generation preferred).

---

## 9. YouTube & Live Stream Integration

- Latest video currently fetched client-side using RSS fallback; prefer **build-time caching** (future improvement) for speed and schema accuracy.
- Add a component for detecting an upcoming or current live stream (YouTube Data API v3) via a small serverless proxy (not yet implemented—document only).
- Provide a persistent CTA: “Watch Live” or “Latest Message”.
- Replace plain text social circles with accessible SVG icons.
- When adding a sermon archive grid, each card should contain:
  - Thumbnail `<img>` with `alt="Sermon: {Title}"`.
  - Title, date, optional series label.
  - Link to YouTube watch URL or local detail page.
- Optionally create `src/data/sermons.json` as curated metadata, falling back to API when empty.

---

## 10. Content Strategy Conventions

- Mission / tagline: consistent phrase usage to reinforce brand ("Small church with a big heart").
- Service times: always list local timezone context on first mention (e.g., "11:00 AM (Central)").
- Testimonials: limit to 20–40 words, attribute first name only unless permission for full name/photo is granted.
- Add a Plan Visit checklist (what to expect, children's ministry flow, parking).
- Provide Statement of Faith & Leadership pages for transparency.

---

## 11. Adding Structured Data (Example Skeleton)

Embed (minified preferred) inside `<script type="application/ld+json">`:

```
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Oatville Community Church",
  "url": "https://www.oatvillecommunitychurch.org/",
  "logo": "https://www.oatvillecommunitychurch.org/favicon.svg",
  "sameAs": [
    "https://www.facebook.com/oatvillecc/",
    "https://www.youtube.com/channel/CHANNEL_ID",
    "https://www.instagram.com/oatvillecommunitychurch/"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3814 S Hoover Rd",
    "addressLocality": "Wichita",
    "addressRegion": "KS",
    "postalCode": "67215",
    "addressCountry": "US"
  }
}
```

Add separate scripts for `Event`, `FAQPage`, `VideoObject` (avoid bundling into one large array unless necessary for maintenance).

---

## 12. Performance Guidelines

- Keep initial (above-the-fold) LCP <= 2.5s on 3G/slow CPU (target hero heading or hero image as LCP candidate).
- Inline critical CSS only if main bundle grows too large (currently small enough—monitor bundle reporter).
- Use YouTube lite embed pattern (placeholder image + click-to-load) if CLS or performance deteriorates.
- Avoid unthrottled intervals—current 30‑minute video refresh acceptable; do not lower below 5 minutes without justification.

---

## 13. Accessibility & Testing Checklist (Pre-PR)

- [ ] Valid HTML (run a validator if major structural changes).
- [ ] Exactly one `<h1>`.
- [ ] Descriptive link text (no "click here").
- [ ] Tab order logical; focus visible.
- [ ] Images have alt text.
- [ ] Lighthouse scores (Performance, Accessibility, SEO) each ≥ 90 (local test).
- [ ] Structured data passes Rich Results test (if modified).

---

## 14. Adding a New Icon / Image

1. Place file in `src/images/` or `src/assets/`.
2. Reference with root-relative path in HTML or import in CSS/JS (Vite will rewrite).
3. For large images include width/height + `loading="lazy"` (unless critical).
4. Consider generating a WebP alongside original if not vector.

---

## 15. Code Quality & Conventions

- Use semantic HTML first; divs only when no semantic element fits.
- Keep JS progressive enhancement–friendly (site should remain navigable if JS fails, except dynamic video refresh convenience).
- Avoid global pollution—encapsulate new logic in functions and run on `DOMContentLoaded`.
- Use `const` / `let`; no `var`.
- Provide graceful fallback logs (do not throw unless fatal in build tooling).

---

## 16. Versioning & Deployment

- Bump `package.json` version when introducing user-visible changes or structural SEO modifications.
- `build-info.json` automatically reflects timestamp & version—expose in an optional admin panel if needed.
- For GitHub Pages deployment using `base` path, ensure `GITHUB_PAGES=true` env var is set so base path adjusts.

---

## 17. Future Enhancements (Reserved Specifications)

- Serverless endpoint for caching YouTube API results (Netlify / Vercel function). Store simplified JSON in `src/data/cache/sermons.json` fallback.
- Email newsletter signup integration (subscribe endpoint + double opt-in).
- Full sermon detail pages statically generated (transcript + structured data per message).
- Prayer request form with spam honeypot & minimal rate limit.

---

## 18. Prohibited / Deprecated Patterns

- Do NOT reintroduce `/public` directory.
- Do NOT inject inline event handlers (e.g., `onclick=`) in HTML—use JS listeners.
- Avoid large third-party script bundles (analytics, trackers) without explicit approval.
- No meta keywords.

---

## 19. Quick Reference

| Task                    | Location / Action                                           |
| ----------------------- | ----------------------------------------------------------- |
| Add service time        | `churchInformation.json` > `services`                       |
| Add new page            | Create `src/<name>.html` + update `vite.config.js` inputs   |
| Update SEO title        | `churchInformation.json` > `seo.title`                      |
| Add structured data     | Inline `<script type="application/ld+json">` in target page |
| Add image               | `src/images/` (optimize)                                    |
| Modify sitemap behavior | `sitemapAndRobotsPlugin` (auto by HTML pages)               |
| Performance budget      | Adjust env `BUNDLE_BUDGET_KB` or plugin warning             |

---

## 20. AI Assistant Behavior Guidance

When responding to user requests:

1. Confirm intention succinctly.
2. If editing content: prefer updating `churchInformation.json` then referencing placeholders.
3. If adding structured data: produce JSON-LD compliant with schema.org.
4. Avoid large code blocks duplicating unmodified content—show only deltas if patching.
5. Validate assumptions; if uncertain, state the assumption and proceed minimally.
6. Maintain accessibility and SEO standards enumerated above.

---

## 21. Minimal Example of Adding a New FAQ Section

1. Add array to JSON:

```json
"faq": [
  {"q": "What time are Sunday services?", "a": "11:00 AM & 5:00 PM Central."}
]
```

2. Reference in HTML (looping not natively supported yet—manually insert or enhance build script if adopting loops):

```html
<section id="faq">
  <h2>Frequently Asked Questions</h2>
  <div class="faq-item">
    <h3>{{faq.0.q}}</h3>
    <p>{{faq.0.a}}</p>
  </div>
</section>
```

3. Add JSON-LD `FAQPage` script with Q/A pairs.

---

## 22. Contact

For architectural or design direction changes, open an issue summarizing rationale + impact (SEO, performance, accessibility) before implementation.

---

End of Copilot Instructions.
