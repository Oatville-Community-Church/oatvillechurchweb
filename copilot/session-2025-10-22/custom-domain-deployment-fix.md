# Custom Domain Deployment Fix - October 22, 2025

## Issue Resolved

The site was deployed to <https://oatville-community-church.org/> but assets were returning 404 errors because they were being served with incorrect `/oatvillechurchweb/` path prefixes.

## Root Cause

1. The site was built using `build:github` script which sets `GITHUB_PAGES=true`
2. This caused Vite to use a base path of `/oatvillechurchweb/`
3. The custom domain hosting expects assets at the root path `/`
4. Additionally, the `isLocal` detection logic was flawed, causing localhost URLs to be used in production

## Solution Applied

### 1. Added Custom Domain Build Script

Added new build script in `package.json`:

```json
"build:custom": "cross-env SITE_URL=https://oatville-community-church.org npm run build"
```

### 2. Fixed isLocal Detection Logic

Updated `vite.config.js` line 236:

```javascript
// OLD (incorrect)
const isLocal = command === 'serve' || process.env.NODE_ENV !== 'production' || !process.env.GITHUB_PAGES;

// NEW (correct)
const isLocal = command === 'serve' || mode === 'development';
```

### 3. Results After Fix

- ✅ Assets now load correctly from root paths (e.g., `/assets/main-*.js`)
- ✅ Canonical URLs point to correct custom domain
- ✅ Sitemap.xml uses correct domain URLs
- ✅ robots.txt references correct sitemap URL
- ✅ PWA manifest uses correct paths and scope

## Deployment Commands

### For Custom Domain (oatville-community-church.org)

```bash
npm run build:custom
```

### For GitHub Pages (if ever needed)

```bash
npm run build:github
```

### For Local Development

```bash
npm run dev
```

## Verification Steps

1. Check that assets load without 404 errors
2. Verify canonical URLs use correct domain
3. Check sitemap.xml has correct URLs
4. Verify PWA manifest scope and start_url

## Files Modified

- `package.json` - Added `build:custom` script
- `vite.config.js` - Fixed `isLocal` detection logic

## Future Deployments

Always use `npm run build:custom` when deploying to the custom domain at <https://oatville-community-church.org/>
