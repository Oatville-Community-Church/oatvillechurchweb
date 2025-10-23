# Canonical URL Fix - October 22, 2025

## Issue Description

Pages had canonical URLs pointing to a different URL. The URL was being 'canonicalised' to another location, instructing search engines to not index the page properly and consolidate indexing and linking properties to the URL in the canonical.

All canonical URLs needed to be updated to use `https://oatville-community-church.org/` (without www subdomain).

## Changes Made

### 1. Updated Site URL in Data Configuration

**File:** `src/data/churchInformation.json`

- Changed `site.url` from `"https://oatville-community-church.org"` to `"https://oatville-community-church.org/"` (added trailing slash)
- This ensures consistent URL formatting across all generated pages

### 2. Fixed Hard-coded www Reference

**File:** `src/index.html`

- Updated JSON-LD structured data logo URL from `"https://www.oatville-community-church.org/favicon.svg"` to `"https://oatville-community-church.org/favicon.svg"`
- Removed www subdomain to match the canonical domain

### 3. Fixed Sitemap Generation Double-Slash Issue

**File:** `vite.config.js`

- Modified `sitemapAndRobotsPlugin()` function to strip trailing slash from base URL before concatenating with page paths
- Changed from: `const siteUrl = process.env.SITE_URL || churchData?.site?.url || 'https://oatville-community-church.org';`
- To: `const siteUrl = (process.env.SITE_URL || churchData?.site?.url || 'https://oatville-community-church.org').replace(/\/$/, '');`

## Results

### Canonical URLs Now Correct

All pages now have proper canonical URLs:

- `index.html`: `https://oatville-community-church.org/`
- `plan-visit.html`: `https://oatville-community-church.org/plan-visit.html`
- `ministries.html`: `https://oatville-community-church.org/ministries.html`
- `you-tube.html`: `https://oatville-community-church.org/you-tube.html`
- `404.html`: `https://oatville-community-church.org/404.html`
- `offline.html`: `https://oatville-community-church.org/offline.html`

### Sitemap URLs Fixed

The sitemap.xml now contains properly formatted URLs without double slashes:

```xml
<loc>https://oatville-community-church.org/</loc>
<loc>https://oatville-community-church.org/plan-visit.html</loc>
<loc>https://oatville-community-church.org/ministries.html</loc>
<loc>https://oatville-community-church.org/you-tube.html</loc>
```

### SEO Impact

- Search engines will now properly consolidate indexing signals to the correct canonical domain
- Eliminates duplicate content issues that could arise from www vs non-www variations
- Improves overall SEO authority consolidation for the site

## Notes

- All external service URLs (YouTube, Facebook, Instagram, Google Maps) correctly retain their www subdomains where appropriate
- The build process successfully validates the changes with no errors
- Version automatically incremented to 1.0.13 during the build process
