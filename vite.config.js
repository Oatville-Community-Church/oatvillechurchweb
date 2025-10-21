import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

// Load church data once
const dataPath = path.resolve(__dirname, 'src', 'data', 'churchInformation.json');
let churchData = {};
try {
  churchData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Could not load churchInformation.json for placeholder replacement');
}

// Helper to get nested value
function getValue(obj, keyPath) {
  return keyPath.trim().split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

// Plugin to replace {{placeholders}} in HTML files (index + multi-page support later)
function htmlPlaceholderPlugin(isLocal) {
  return {
    name: 'html-church-data-placeholders',
    transformIndexHtml(html, ctx) {
      // Use localhost for local development, environment-specific URL for deployment
      const siteUrl = isLocal 
        ? 'http://localhost:4173'
        : (process.env.SITE_URL || churchData?.site?.url || 'https://oatville-community-church.github.io/oatvillechurchweb').replace(/\/$/, '');
      
      let transformed = html.replace(/\{\{([^}]+)\}\}/g, (m, p) => {
        // Special case for site.url to use environment-aware URL
        if (p.trim() === 'site.url') {
          return siteUrl;
        }
        const val = getValue(churchData, p);
        return val !== undefined ? String(val) : m;
      });
      // Determine path for canonical: index.html -> '/', others -> '/filename'
      const filename = ctx?.filename ? path.basename(ctx.filename) : 'index.html';
      const cleanName = filename === 'index.html' ? '' : filename;
      const pagePath = cleanName ? `/${cleanName}` : '/';
      const canonicalHref = `${siteUrl}${pagePath}`;
      const canonicalTag = `<link rel=\"canonical\" href=\"${canonicalHref}\" />`;
      if (!/rel="canonical"/.test(transformed)) {
        transformed = transformed.replace('</head>', `  ${canonicalTag}\n</head>`);
      }
      if (!/og:title/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:title\" content=\"${churchData?.seo?.title || ''}\" />\n</head>`);
      }
      if (!/og:description/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:description\" content=\"${churchData?.seo?.description || ''}\" />\n</head>`);
      }
      if (!/og:url/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:url\" content=\"${canonicalHref}\" />\n</head>`);
      }
      if (!/og:image/.test(transformed) && churchData?.site?.socialImage) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:image\" content=\"${churchData.site.socialImage}\" />\n</head>`);
      }
      if (churchData?.site?.socialImage && !/og:image:width/.test(transformed)) {
        transformed = transformed.replace('</head>', '  <meta property="og:image:width" content="1200" />\n</head>');
      }
      if (churchData?.site?.socialImage && !/og:image:height/.test(transformed)) {
        transformed = transformed.replace('</head>', '  <meta property="og:image:height" content="630" />\n</head>');
      }
      return transformed;
    }
  };
}

// Plugin to emit build-info.json
function buildInfoPlugin() {
  return {
    name: 'build-info',
    generateBundle(_, bundle) {
      const info = {
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        node_version: process.version,
        environment: process.env.NODE_ENV || 'production'
      };
      this.emitFile({
        type: 'asset',
        fileName: 'build-info.json',
        source: JSON.stringify(info, null, 2)
      });
    }
  };
}

// Simple bundle size reporter (aggregated) for visibility
function bundleSizeReporter() {
  return {
    name: 'bundle-size-reporter',
    generateBundle(_, bundle) {
      let total = 0;
      Object.values(bundle).forEach(item => {
        if (item.type === 'asset' || item.type === 'chunk') {
          if (typeof item.code === 'string') total += Buffer.byteLength(item.code);
          else if (typeof item.source === 'string' || Buffer.isBuffer(item.source)) {
            total += Buffer.byteLength(item.source);
          }
        }
      });
      // eslint-disable-next-line no-console
      const kb = (total/1024).toFixed(2);
      console.log(`\n📦 Total bundle size (raw, no gzip): ${kb} KB`);
      const budgetKB = Number(process.env.BUNDLE_BUDGET_KB || 300);
      if (total/1024 > budgetKB) {
        // eslint-disable-next-line no-console
        console.warn(`⚠ Bundle size ${kb} KB exceeds budget of ${budgetKB} KB`);
      }
    }
  };
}

// Generate sitemap.xml and robots.txt
function sitemapAndRobotsPlugin() {
  return {
    name: 'sitemap-and-robots',
    writeBundle(_, bundle) {
      const siteUrl = process.env.SITE_URL || 'https://oatville-community-church.github.io/oatvillechurchweb';
  const htmlPages = Object.keys(bundle).filter(f => f.endsWith('.html'));
  const urls = htmlPages.filter(f => !['offline.html','not-found.html'].includes(f)).map(f => {
        const clean = f === 'index.html' ? '/' : `/${f.replace(/index.html$/, '')}`;
        return `  <url><loc>${siteUrl}${clean}</loc></url>`;
      }).join('\n');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      const robots = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml`;
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
    }
  };
}

// Copy selected static assets from src into the build output (keeps all assets in /src)
function staticCopyPlugin() {
  return {
    name: 'static-copy-from-src',
    generateBundle() {
  // Images are now handled solely by Vite's HTML asset graph (hashed & deduped)
  // to avoid duplicate copies (previously /assets/* + /images/*).
  // Copy generic asset files (favicons, logos) from src/assets (exclude code)
      const assetsDir = path.resolve(__dirname, 'src', 'assets');
      if (fs.existsSync(assetsDir)) {
        // Whitelist only essential, small, site-wide assets to avoid copying large unused files
        const allowList = [
          'favicon.ico',
          'favicon.svg',
          'site.webmanifest',
          'manifest.webmanifest',
          'icon-192.png',
          'icon-512.png',
        ];
        fs.readdirSync(assetsDir).forEach(file => {
          const full = path.join(assetsDir, file);
          if (!fs.statSync(full).isFile()) return;
          // Only emit allow-listed assets; all others (e.g., large PNG logos) are excluded unless referenced in HTML/CSS
          if (allowList.includes(file)) {
            this.emitFile({ type: 'asset', fileName: file, source: fs.readFileSync(full) });
          }
        });
      }
      // Copy only the public-safe RSS XML needed at runtime (avoid copying entire /data)
      const rssFile = path.resolve(__dirname, 'src', 'data', 'you-tube-rss.xml');
      if (fs.existsSync(rssFile)) {
        this.emitFile({ type: 'asset', fileName: 'data/you-tube-rss.xml', source: fs.readFileSync(rssFile) });
      }
    }
  };
}

export default defineConfig(({ mode, command }) => {
  const repoName = 'oatvillechurchweb'; // for GitHub Pages base
  // Custom domain support: Check if SITE_URL env var contains a custom domain
  const siteUrl = process.env.SITE_URL || 'https://oatville-community-church.github.io/oatvillechurchweb';
  const isCustomDomain = siteUrl && !siteUrl.includes('github.io');
  
  // Determine if we're running locally (dev server or preview) vs GitHub deployment
  const isLocal = command === 'serve' || process.env.NODE_ENV !== 'production' || !process.env.GITHUB_PAGES;
  
  // Use GitHub Pages base path only for actual GitHub deployment, not local development
  const ghPages = !isLocal && (process.env.GITHUB_PAGES === 'true' || (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY.endsWith(`/${repoName}`))) && !isCustomDomain;
  
  return {
    // Project source root now lives in /src (all HTML pages relocated there)
    root: 'src',
    // publicDir removed – all assets now sourced from /src and copied via plugins
    publicDir: false,
    base: ghPages ? `/${repoName}/` : '/',
    build: {
  // outDir previously 'dist' relative to root:'src' which produced output in src/dist.
  // For GitHub Pages workflow we need a root-level /dist folder.
  // Use absolute path to ensure emission outside the project root config 'src'.
  outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      manifest: true,
      sourcemap: mode !== 'production',
      rollupOptions: {
        // Explicit multi-page entry points now under src/
        input: {
          main: path.resolve(__dirname, 'src', 'index.html'),
          plan: path.resolve(__dirname, 'src', 'plan-visit.html'),
          ministries: path.resolve(__dirname, 'src', 'ministries.html'),
          messages: path.resolve(__dirname, 'src', 'you-tube.html'),
          offline: path.resolve(__dirname, 'src', 'offline.html'),
          notfound: path.resolve(__dirname, 'src', '404.html')
        }
      }
    },
    css: {
      devSourcemap: true
    },
    plugins: [
      htmlPlaceholderPlugin(isLocal),
      buildInfoPlugin(),
      bundleSizeReporter(),
      sitemapAndRobotsPlugin(),
      staticCopyPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: churchData?.name || 'Church Site',
          short_name: 'Church',
          // Use a same-origin start_url; when deployed to GitHub Pages ensure base path matches.
          start_url: ghPages ? `/${repoName}/` : '/',
          scope: ghPages ? `/${repoName}/` : '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1f2937',
          description: churchData?.seo?.description || 'Church website',
          categories: ['religion','community','education'],
          icons: [
            // Data URI minimal placeholders to avoid external public assets
            {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADAAQMAAABZQ09NAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMAAHaTzTgAAAAWSURBVEjH7cEBDQAAAMKg909tDjegAAAAAAAAAAB4G0sQAAEBSURBVAjXY2AAAyMDIwMjAwMDw3///38GIgPgP///wYGBgYGJgYGBgY+g/7/BgYGhmEGhj4GBgYGJgYGBgY+BgYGBgaGhgYGBgYGAAD//wMAz1UQ+QAAAABJRU5ErkJggg==',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgAQMAAAC9Z0ixAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMAAHaTzTgAAAAcSURBVEjH7cEBDQAAAMKg909tDjegAAAAAAAAAAAA4G0sQAAE3l1SxAAAAABJRU5ErkJggg==',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      legacy({
        targets: ['defaults', 'not IE 11'],
        modernPolyfills: true
      })
    ],
    server: {
      port: 5173,
      open: false
    }
  };
});
