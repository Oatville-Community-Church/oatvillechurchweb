import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

// Load package.json for version info
const packagePath = path.resolve(__dirname, 'package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Load church data once
const dataPath = path.resolve(__dirname, 'src', 'data', 'churchInformation.json');
const planVisitDataPath = path.resolve(__dirname, 'src', 'data', 'planvisit.json');
const ministriesDataPath = path.resolve(__dirname, 'src', 'data', 'ministries.json');
let churchData = {};
let planVisitData = {};
let ministriesData = {};
try {
  churchData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Could not load churchInformation.json for placeholder replacement');
}
try {
  planVisitData = JSON.parse(fs.readFileSync(planVisitDataPath, 'utf8'));
  // Merge planvisit data into churchData for placeholder access
  churchData.planvisit = planVisitData;
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Could not load planvisit.json for placeholder replacement');
}
try {
  ministriesData = JSON.parse(fs.readFileSync(ministriesDataPath, 'utf8'));
  // Merge ministries data into churchData for placeholder access
  churchData.ministries = ministriesData;
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('Could not load ministries.json for placeholder replacement');
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
        : (process.env.SITE_URL || churchData?.site?.url || 'https://oatville-community-church.org').replace(/\/$/, '');

      // Get build metadata
      const buildDate = new Date().toISOString();
      const buildDateFormatted = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const version = packageData.version;

      let transformed = html.replace(/\{\{([^}]+)\}\}/g, (m, p) => {
        // Special case for site.url to use environment-aware URL
        if (p.trim() === 'site.url') {
          return siteUrl;
        }
        // Special cases for build metadata
        if (p.trim() === 'build.version') {
          return version;
        }
        if (p.trim() === 'build.date') {
          return buildDateFormatted;
        }
        if (p.trim() === 'build.dateISO') {
          return buildDate;
        }
        const val = getValue(churchData, p);
        return val !== undefined ? String(val) : m;
      });
      // Determine path for canonical: index.html -> '/', others -> '/filename'
      const filename = ctx?.filename ? path.basename(ctx.filename) : 'index.html';
      const cleanName = filename === 'index.html' ? '' : filename;
      const pagePath = cleanName ? `/${cleanName}` : '/';
      const canonicalHref = `${siteUrl}${pagePath}`;
      
      // Enhanced SEO meta tags
      const canonicalTag = `<link rel=\"canonical\" href=\"${canonicalHref}\" />`;
      const robotsTag = `<meta name=\"robots\" content=\"${churchData?.seo?.robots || 'index,follow'}\" />`;
      const authorTag = `<meta name=\"author\" content=\"${churchData?.seo?.author || churchData?.name || ''}\" />`;
      const publisherTag = `<meta name=\"publisher\" content=\"${churchData?.site?.publisher || churchData?.name || ''}\" />`;
      const copyrightTag = `<meta name=\"copyright\" content=\"${churchData?.site?.copyright || ''}\" />`;
      const languageTag = `<meta name=\"language\" content=\"${churchData?.site?.languageCode || 'en'}\" />`;
      const geoTags = churchData?.location ? `
  <meta name=\"geo.region\" content=\"${churchData.location.state}-${churchData.location.city}\" />
  <meta name=\"geo.placename\" content=\"${churchData.location.city}, ${churchData.location.state}\" />
  <meta name=\"geo.position\" content=\"37.6173;-97.2633\" />
  <meta name=\"ICBM\" content=\"37.6173, -97.2633\" />` : '';
      
      // Insert essential SEO meta tags
      if (!/rel="canonical"/.test(transformed)) {
        transformed = transformed.replace('</head>', `  ${canonicalTag}\n</head>`);
      }
      if (!/name="robots"/.test(transformed)) {
        transformed = transformed.replace('</head>', `  ${robotsTag}\n</head>`);
      }
      if (!/name="author"/.test(transformed)) {
        transformed = transformed.replace('</head>', `  ${authorTag}\n</head>`);
      }
      if (geoTags && !/name="geo\.region"/.test(transformed)) {
        transformed = transformed.replace('</head>', `${geoTags}\n</head>`);
      }
      
      // Enhanced Open Graph tags
      if (!/og:title/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:title\" content=\"${churchData?.seo?.title || ''}\" />\n</head>`);
      }
      if (!/og:description/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:description\" content=\"${churchData?.seo?.description || ''}\" />\n</head>`);
      }
      if (!/og:url/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:url\" content=\"${canonicalHref}\" />\n</head>`);
      }
      if (!/og:type/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:type\" content=\"${churchData?.site?.type || 'website'}\" />\n</head>`);
      }
      if (!/og:site_name/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:site_name\" content=\"${churchData?.site?.siteName || churchData?.name || ''}\" />\n</head>`);
      }
      if (!/og:locale/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:locale\" content=\"${churchData?.site?.locale || 'en_US'}\" />\n</head>`);
      }
      if (!/og:image/.test(transformed) && churchData?.site?.socialImage) {
        const socialImageUrl = churchData.site.socialImage.startsWith('http') ? churchData.site.socialImage : `${siteUrl}${churchData.site.socialImage}`;
        transformed = transformed.replace('</head>', `  <meta property=\"og:image\" content=\"${socialImageUrl}\" />\n</head>`);
      }
      if (churchData?.site?.socialImage && !/og:image:alt/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta property=\"og:image:alt\" content=\"${churchData?.site?.socialImageAlt || churchData?.seo?.title || ''}\" />\n</head>`);
      }
      if (churchData?.site?.socialImage && !/og:image:width/.test(transformed)) {
        transformed = transformed.replace('</head>', '  <meta property="og:image:width" content="1200" />\n</head>');
      }
      if (churchData?.site?.socialImage && !/og:image:height/.test(transformed)) {
        transformed = transformed.replace('</head>', '  <meta property="og:image:height" content="630" />\n</head>');
      }
      
      // Enhanced Twitter Card tags
      if (!/twitter:card/.test(transformed)) {
        transformed = transformed.replace('</head>', '  <meta name="twitter:card" content="summary_large_image" />\n</head>');
      }
      if (!/twitter:site/.test(transformed) && churchData?.site?.twitterSite) {
        transformed = transformed.replace('</head>', `  <meta name=\"twitter:site\" content=\"${churchData.site.twitterSite}\" />\n</head>`);
      }
      if (!/twitter:title/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta name=\"twitter:title\" content=\"${churchData?.seo?.title || ''}\" />\n</head>`);
      }
      if (!/twitter:description/.test(transformed)) {
        transformed = transformed.replace('</head>', `  <meta name=\"twitter:description\" content=\"${churchData?.seo?.description || ''}\" />\n</head>`);
      }
      if (!/twitter:image/.test(transformed) && churchData?.site?.socialImage) {
        const socialImageUrl = churchData.site.socialImage.startsWith('http') ? churchData.site.socialImage : `${siteUrl}${churchData.site.socialImage}`;
        transformed = transformed.replace('</head>', `  <meta name=\"twitter:image\" content=\"${socialImageUrl}\" />\n</head>`);
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

// Generate sitemap.xml and robots.txt with enhanced SEO
function sitemapAndRobotsPlugin() {
  return {
    name: 'sitemap-and-robots',
    closeBundle() {
      const siteUrl = process.env.SITE_URL || churchData?.site?.url || 'https://oatville-community-church.org';
      const lastMod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Define pages with priorities and change frequencies
      const pages = [
        { file: 'index.html', priority: '1.0', changefreq: 'weekly' },
        { file: 'plan-visit.html', priority: '0.9', changefreq: 'monthly' },
        { file: 'ministries.html', priority: '0.8', changefreq: 'monthly' },
        { file: 'you-tube.html', priority: '0.7', changefreq: 'weekly' }
      ];
      
      const urls = pages.map(page => {
        const clean = page.file === 'index.html' ? '/' : `/${page.file}`;
        return `  <url>
    <loc>${siteUrl}${clean}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      }).join('\n');
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

      // Write files directly to dist
      const distPath = path.resolve(__dirname, 'dist');
      fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap);

      // Enhanced robots.txt with additional directives
      const robots = `User-agent: *
Allow: /
Disallow: /assets/
Disallow: /.vite/
Disallow: /data/

# Major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# SEO and performance
Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl.replace('https://', '')}

# Crawl-delay for courtesy
Crawl-delay: 1`;
      
      fs.writeFileSync(path.join(distPath, 'robots.txt'), robots);
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
      // Copy CNAME file for GitHub Pages custom domain
      const cnameFile = path.resolve(__dirname, 'src', 'CNAME');
      if (fs.existsSync(cnameFile)) {
        this.emitFile({ type: 'asset', fileName: 'CNAME', source: fs.readFileSync(cnameFile) });
      }
      // Add .nojekyll file for GitHub Pages (prevents Jekyll processing)
      this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' });
      // Add security.txt for responsible disclosure
      const securityTxt = `Contact: ${churchData?.contact?.email || 'oatvillecommunitychurch@gmail.com'}
Expires: 2026-12-31T23:59:59.000Z
Preferred-Languages: en
Canonical: https://oatville-community-church.org/.well-known/security.txt`;
      this.emitFile({ type: 'asset', fileName: '.well-known/security.txt', source: securityTxt });
      // Add humans.txt
      const humansTxt = `/* TEAM */
Site: ${churchData?.site?.url || 'https://oatville-community-church.org'}
Pastor: Rick Oglesby
Contact: ${churchData?.contact?.email || 'oatvillecommunitychurch@gmail.com'}
Location: ${churchData?.location?.fullAddress || 'Wichita, KS'}

/* SITE */
Language: English
Doctype: HTML5
IDE: VS Code, GitHub Copilot
Technologies: Vite, Tailwind CSS, SCSS, PWA`;
      this.emitFile({ type: 'asset', fileName: 'humans.txt', source: humansTxt });
    }
  };
}

// Plugin to add comprehensive structured data (JSON-LD)
function structuredDataPlugin() {
  return {
    name: 'structured-data',
    transformIndexHtml(html, ctx) {
      if (!churchData?.seo?.structuredDataEnabled) return html;
      
      const filename = ctx?.filename ? path.basename(ctx.filename) : 'index.html';
      const siteUrl = process.env.SITE_URL || churchData?.site?.url || 'https://oatville-community-church.org';
      
      // Organization/Church Schema
      const organizationSchema = {
        "@context": "https://schema.org",
        "@type": ["Organization", "Church", "LocalBusiness"],
        "name": churchData.name,
        "alternateName": [churchData.tagline, "OCC"],
        "description": churchData.description,
        "url": siteUrl,
        "logo": `${siteUrl}/favicon.svg`,
        "image": `${siteUrl}${churchData.site.socialImage}`,
        "email": churchData.contact.email,
        "telephone": churchData.contact.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": churchData.location.address,
          "addressLocality": churchData.location.city,
          "addressRegion": churchData.location.state,
          "postalCode": churchData.location.zipCode,
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 37.6173,
          "longitude": -97.2633
        },
        "openingHours": [
          "Su 09:30-13:00",
          "Mo 08:30-16:00", 
          "Tu 08:30-16:00",
          "We 08:30-16:00",
          "Th 08:00-16:00",
          "Sa 14:00-17:00"
        ],
        "sameAs": [
          churchData.socialMedia.facebook,
          churchData.socialMedia.youtube,
          churchData.socialMedia.instagram
        ]
      };
      
      // Website Schema
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": churchData.site.siteName,
        "url": siteUrl,
        "description": churchData.seo.description,
        "publisher": {
          "@type": "Organization",
          "name": churchData.name
        }
      };
      
      // Combine schemas
      const schemas = [organizationSchema, websiteSchema];
      
      const structuredDataScript = schemas.map(schema => 
        `<script type="application/ld+json">${JSON.stringify(schema, null, 0)}</script>`
      ).join('\n  ');
      
      return html.replace('</head>', `  ${structuredDataScript}\n</head>`);
    }
  };
}

export default defineConfig(({ mode, command }) => {
  const repoName = 'oatvillechurchweb'; // for GitHub Pages base
  // Custom domain support: Check if SITE_URL env var contains a custom domain OR if CNAME file exists
  const siteUrl = process.env.SITE_URL || churchData?.site?.url || 'https://oatville-community-church.org';
  const isCustomDomain = (siteUrl && !siteUrl.includes('github.io')) || fs.existsSync(path.resolve(__dirname, 'src', 'CNAME'));
  
  // Determine if we're running locally (dev server or preview) vs production deployment
  const isLocal = command === 'serve' || mode === 'development';
  
  // Use GitHub Pages base path ONLY when NOT using custom domain and NOT in local development
  const ghPages = !isLocal && !isCustomDomain && (process.env.GITHUB_PAGES === 'true' || (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY.endsWith(`/${repoName}`)));
  
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
      structuredDataPlugin(),
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
            {
              src: ghPages ? `/${repoName}/icon-192.png` : '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: ghPages ? `/${repoName}/icon-512.png` : '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
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
