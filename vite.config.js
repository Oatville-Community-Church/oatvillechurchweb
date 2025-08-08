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
function htmlPlaceholderPlugin() {
  return {
    name: 'html-church-data-placeholders',
    transformIndexHtml(html, ctx) {
      let transformed = html.replace(/\{\{([^}]+)\}\}/g, (m, p) => {
        const val = getValue(churchData, p);
        return val !== undefined ? String(val) : m;
      });
      const siteUrl = process.env.SITE_URL || 'https://sharesmallbiz-support.github.io/oatvillechurch';
      // Determine path for canonical: index.html -> '/', others -> '/filename'
      const filename = ctx?.filename ? path.basename(ctx.filename) : 'index.html';
      const pagePath = filename === 'index.html' ? '/' : `/${filename.replace(/index\.html$/, '')}`;
      const canonicalHref = `${siteUrl}${pagePath}`.replace(/\/$\/$/, '/');
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
      const siteUrl = process.env.SITE_URL || 'https://sharesmallbiz-support.github.io/oatvillechurch';
      const htmlPages = Object.keys(bundle).filter(f => f.endsWith('.html'));
      const urls = htmlPages.map(f => {
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
        fs.readdirSync(assetsDir).forEach(file => {
          const full = path.join(assetsDir, file);
          if (fs.statSync(full).isFile() && !/\.(js|ts|jsx|tsx|scss|css)$/.test(file)) {
            this.emitFile({ type: 'asset', fileName: file, source: fs.readFileSync(full) });
          }
        });
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const repoName = 'oatvillechurch'; // for GitHub Pages base
  const ghPages = process.env.GITHUB_PAGES === 'true';
  return {
    // Project source root now lives in /src (all HTML pages relocated there)
    root: 'src',
    // publicDir removed – all assets now sourced from /src and copied via plugins
    publicDir: false,
    base: ghPages ? `/${repoName}/` : '/',
    build: {
      outDir: 'dist', // new dist output (keeps legacy build folder separate)
      emptyOutDir: true,
      manifest: true,
      sourcemap: mode !== 'production',
      rollupOptions: {
        // Explicit multi-page entry points now under src/
        input: {
          main: path.resolve(__dirname, 'src', 'index.html'),
          plan: path.resolve(__dirname, 'src', 'plan-visit.html'),
            ministries: path.resolve(__dirname, 'src', 'ministries.html'),
          offline: path.resolve(__dirname, 'src', 'offline.html')
        }
      }
    },
    css: {
      devSourcemap: true
    },
    plugins: [
      htmlPlaceholderPlugin(),
      buildInfoPlugin(),
      bundleSizeReporter(),
      sitemapAndRobotsPlugin(),
      staticCopyPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: churchData?.name || 'Church Site',
          short_name: 'Church',
          start_url: '.',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1f2937',
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
