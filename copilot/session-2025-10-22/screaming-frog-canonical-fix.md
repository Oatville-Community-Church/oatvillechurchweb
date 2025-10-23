# Screaming Frog Canonical URL Fix - October 22, 2025

## Issue Description (Screaming Frog Report)

Screaming Frog reported that pages on the live site (`https://oatville-community-church.org`) had canonical URLs pointing to non-indexable GitHub Pages URLs (`https://oatville-community-church.github.io/oatvillechurchweb/`).

**Screaming Frog Results:**

```
"Address","Occurrences","Indexability","Indexability Status","Canonical Link Element 1"
"https://oatville-community-church.org/","1","Non-Indexable","Canonicalised","https://oatville-community-church.github.io/oatvillechurchweb/"
```

All pages were marked as "Non-Indexable" because their canonicals pointed to GitHub Pages URLs instead of the custom domain.

## Root Cause Analysis

The GitHub Actions deployment workflow in `.github/workflows/deploy.yml` was setting:

```yaml
SITE_URL: "https://oatville-community-church.github.io/oatvillechurchweb"
```

This environment variable overrode the correct custom domain configuration and caused all canonical URLs to point to the GitHub Pages domain instead of the custom domain.

## Solution Implemented

### Fixed GitHub Actions Deployment Environment Variable

**File:** `.github/workflows/deploy.yml`

Changed the `SITE_URL` environment variable from:

```yaml
SITE_URL: "https://oatville-community-church.github.io/oatvillechurchweb" # GitHub Pages URL
```

To:

```yaml
SITE_URL: "https://oatville-community-church.org" # Custom domain URL
```

### Verified Build Configuration

The existing configuration in `vite.config.js` was already correct:

- `htmlPlaceholderPlugin` uses `process.env.SITE_URL` first, then falls back to `churchData?.site?.url`
- `isCustomDomain` detection works correctly (detects non-github.io URLs or CNAME file)
- `sitemapAndRobotsPlugin` uses the same URL prioritization logic

## Verification Results

### Local Build Test

After the fix, local build generated correct canonical URLs:

**index.html:**

```html
<link rel="canonical" href="https://oatville-community-church.org/" />
```

**plan-visit.html:**

```html
<link rel="canonical" href="https://oatville-community-church.org/plan-visit.html" />
```

### Sitemap Generation

The sitemap.xml now contains correct URLs:

```xml
<loc>https://oatville-community-church.org/</loc>
<loc>https://oatville-community-church.org/plan-visit.html</loc>
<loc>https://oatville-community-church.org/ministries.html</loc>
<loc>https://oatville-community-church.org/you-tube.html</loc>
```

## Expected SEO Impact

After the next deployment:

- All canonical URLs will point to the custom domain
- Screaming Frog should report pages as "Indexable" instead of "Non-Indexable"
- Search engines will properly consolidate indexing signals to the correct domain
- No more "canonicalised" to non-indexable pages

## Next Steps

1. **Deploy the fix** - Push changes to trigger GitHub Actions deployment
2. **Re-run Screaming Frog** - After deployment, verify that canonical URLs are fixed
3. **Monitor search console** - Check for improved indexing status

## Files Modified

- `.github/workflows/deploy.yml` - Fixed SITE_URL environment variable

## Build Version

- Version incremented to 1.0.14 during testing
