# Custom Domain Deployment and CSP Fixes - October 22, 2025

## Issues Resolved

### 1. Asset Path Problems with Custom Domain

**Problem**: Site was loading assets from `/oatvillechurchweb/assets/` instead of `/assets/` when deployed to custom domain `oatville-community-church.org`

**Root Cause**: Vite configuration was incorrectly applying GitHub Pages base path even when using custom domain

**Solution**:

- Fixed Vite config logic to properly detect custom domain via CNAME file existence
- Updated `isCustomDomain` detection to check both `SITE_URL` and presence of `src/CNAME`
- Ensured `ghPages` variable is `false` when custom domain is detected

**Files Modified**:

- `vite.config.js` - Fixed custom domain detection logic

### 2. Content Security Policy (CSP) Violations

**Problem**: Multiple CSP warnings in console blocking inline scripts and YouTube integration

**Console Errors**:

```
Loading module from "https://oatville-community-church.org/oatvillechurchweb/assets/main-B3W9j8Hb.js" was blocked because of a disallowed MIME type ("text/html").
Content-Security-Policy: The page's settings blocked an inline script (script-src-elem) from being executed
```

**Solution**:

- Added all Vite-generated inline script hashes to CSP:
  - `'sha256-ZxAi3a7m9Mzbc+Z1LGuCCK5Xee6reDkEPRas66H9KSo='` (modern browser detection)
  - `'sha256-+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc='` (legacy polyfill loader)
  - `'sha256-MS6/3FCg4WjP9gwgaBGwLpRCY6fZBgwmhVCdrPrNf3E='` (nomodule detection)
  - `'sha256-tQjf8gvb2ROOMapIxFvFAYBeUJ0v1HCbOcSmDNXGtDo='` (legacy entry loader)
  - `'sha256-AGa2e511DJZ79HWL15j5+3fAW+AXi/wY/bVla82HzM8='` (suggested by console)

- Enhanced CSP domains:
  - Added `https://maps.googleapis.com` and `https://maps.gstatic.com` to `script-src`
  - Added `https://yt3.ggpht.com` to `img-src` for YouTube thumbnails
  - Added `https://maps.googleapis.com` to `connect-src` for CORS issues

**Files Modified**:

- `src/index.html` - Updated CSP meta tag
- `scripts/calculate-hashes.js` - Added calculation for all inline scripts

## Technical Details

### Updated CSP Policy

```
default-src 'self'; 
img-src 'self' data: https://i.ytimg.com https://www.youtube.com https://www.youtube-nocookie.com https://maps.gstatic.com https://maps.googleapis.com https://yt3.ggpht.com; 
script-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://maps.googleapis.com https://maps.gstatic.com 'sha256-ZxAi3a7m9Mzbc+Z1LGuCCK5Xee6reDkEPRas66H9KSo=' 'sha256-+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc=' 'sha256-MS6/3FCg4WjP9gwgaBGwLpRCY6fZBgwmhVCdrPrNf3E=' 'sha256-tQjf8gvb2ROOMapIxFvFAYBeUJ0v1HCbOcSmDNXGtDo=' 'sha256-AGa2e511DJZ79HWL15j5+3fAW+AXi/wY/bVla82HzM8='; 
style-src 'self' 'unsafe-inline'; 
frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com; 
connect-src 'self' https://api.allorigins.win https://maps.googleapis.com;
```

### Inline Scripts Identified

1. **Modern Browser Detection**: Checks if browser supports ES modules
2. **Legacy Polyfill Loader**: Conditional loading for older browsers
3. **NoModule Detection**: Feature detection for module support
4. **Legacy Entry Loader**: System.import for legacy browsers

## Verification

After deployment, verify:

- [ ] Assets load correctly from root paths (no `/oatvillechurchweb/` prefix)
- [ ] No CSP violations in browser console
- [ ] YouTube embeds work without security warnings
- [ ] Google Maps integration functions properly
- [ ] Service Worker and PWA features operate correctly

## Commits

- `2bfae66`: Fix custom domain deployment: remove incorrect GitHub Pages base path
- `9b04356`: Fix Content Security Policy for YouTube and inline scripts

## Expected Outcome

The site should now load correctly on `oatville-community-church.org` without:

- Asset loading errors (MIME type issues)
- CSP violations
- YouTube integration warnings
- Google Maps CORS errors
