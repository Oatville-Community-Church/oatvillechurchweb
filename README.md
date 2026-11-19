# 🏛️ Oatville Community Church Website

> A modern church website built with automated content management and deployment.

[![Website](https://img.shields.io/website?url=https%3A//oatville-community-church.org/)](https://oatville-community-church.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Website:** [oatville-community-church.org](https://oatville-community-church.org)

## ✨ Technical Features

**🚀 Build System & CI/CD:**

- **Automated JSON Validation:** Pre-commit hooks and build-time validation prevent broken placeholders
- **GitHub Actions CI/CD:** Multi-stage deployment pipeline with comprehensive validation steps
- **Asset Processing:** Automatic image optimization and cache-busting via Vite
- **Performance Monitoring:** Bundle size tracking with configurable budget warnings
- **Automated Versioning:** Build-time version incrementing and metadata injection

**📱 Architecture:**

- **Static Site Generation:** Vite-powered build system with multi-page support
- **Data-Driven Content:** Markdown/YAML content files with placeholder templating
- **Modern Web Standards:** PWA-capable with offline support and structured data
- **Performance Optimized:** Asset optimization, cache management, and lazy loading
- **SEO Enhanced:** Automatic sitemap generation, robots.txt, and meta tag injection

**🔧 Development Features:**

- **Hot Module Replacement:** Live development server with instant updates
- **Code Quality Gates:** Automated linting and validation preventing deployment issues
- **Image Processing:** WebP/AVIF conversion with automatic optimization
- **Content Validation:** JSON schema validation with detailed error reporting

## 🏗️ Project Structure

```text
src/                          # All source files and assets
├── *.html                   # Website pages (index, ministries, plan-visit, you-tube)
├── assets/                  # Favicons, icons, and static metadata assets
├── data/
│   ├── site.json            # Site + SEO settings (developer-owned)
│   └── youtube.json         # Latest video data (written by the weekly YouTube job)
├── images/                  # Church photos and graphics
├── js/                      # Website functionality
└── tailwind.css             # Tailwind entry stylesheet
content/                      # Pastor-editable content (markdown + YAML front matter)
├── church.md, hours.md, services.md, about.md, faq.md, ...
├── plan-visit.md            # Plan Your Visit page
├── beliefs.md               # What We Believe page (hidden until approved)
└── ministries/              # _index.md + one numbered file per ministry
Documentation/               # Pastor and setup guides
├── PASTOR_HANDOVER_GUIDE.md # Complete setup instructions for pastor
├── GITHUB_ACCOUNT_SETUP.md  # GitHub account creation guide
├── CLOUDFLARE_DOMAIN_SETUP.md # Domain connection guide
├── WEBSITE_CONTENT_GUIDE.md # How to update website content
├── IMAGE_MANAGEMENT_GUIDE.md # How to add/manage photos
└── technical/               # Technical documentation
    ├── ARCHITECTURE.md      # Technical details
    └── BUILD.md            # Build process information
scripts/                    # Automation tools
├── fetch-latest-video.js   # YouTube integration
├── optimize-images.js      # Image compression
└── *.js                   # Other maintenance scripts
```

## 📚 Technical Documentation

**System Architecture & Build Process:**

- **[Technical Architecture](Documentation/technical/ARCHITECTURE.md)** - System design, component architecture, and technical decisions
- **[Build System Details](Documentation/technical/BUILD.md)** - Comprehensive build process and deployment pipeline documentation

**Setup and Configuration Guides:**

- **[GitHub Account Setup](Documentation/GITHUB_ACCOUNT_SETUP.md)** - Repository configuration and GitHub Pages setup
- **[Domain Configuration](Documentation/CLOUDFLARE_DOMAIN_SETUP.md)** - Custom domain setup and DNS configuration
- **[Content Management](Documentation/WEBSITE_CONTENT_GUIDE.md)** - Content update procedures and JSON data management
- **[Image Management](Documentation/IMAGE_MANAGEMENT_GUIDE.md)** - Image optimization pipeline and asset management

## 🎯 Technical Architecture

The website provides a modern development experience with:

- **📊 Multi-Stage Build Pipeline:** Comprehensive validation and optimization workflow
- **🔄 Automated Content Management:** JSON-driven content with git-based versioning
- **⚡ Performance Optimization:** Asset processing, bundle analysis, and cache management
- **� Quality Assurance:** Pre-commit hooks, validation gates, and error prevention
- **🚀 CI/CD Integration:** GitHub Actions with multi-environment deployment support

## 🚀 For Developers

### Prerequisites

- **Node.js:** Version 20.19.0 or higher
- **npm:** Version 8.0.0 or higher

### Development Commands

```bash
npm install            # Install dependencies + setup git hooks
npm run dev            # Start development server (http://localhost:5173)
npm run build          # CI-safe build (lint + vite build)
npm run build:release  # Full release build (version + assets + YouTube refresh)
npm run preview        # Preview production build
npm run lint           # Comprehensive code quality check
npm run lint:json      # JSON-only validation for content files
npm run images:optimize # Optimize and convert images to modern formats
npm run clean          # Clean build artifacts and caches
```

### Build System Architecture

The project uses a Vite-based build pipeline with explicit CI and release paths:

**📋 Build Commands:**

1. **`npm run build` (default CI-safe):**
   - JSON syntax validation with trailing comma detection
   - Content structure validation for church data files
   - Code quality linting across HTML, CSS, and JavaScript
   - Vite build with automatic asset hashing for cache-busting

2. **`npm run build:release` (content + release automation):**
   - Version incrementing with timestamp injection
   - Image optimization (WebP/AVIF conversion with quality tuning)
   - YouTube RSS/live status refresh
   - Vite build output generation (`dist/`)

3. **Vite Output Generation (both build paths):**
   - Multi-page HTML processing with data placeholder injection
   - PWA manifest generation with environment-aware URLs
   - Sitemap.xml with priority-based URL mapping
   - Enhanced robots.txt, security.txt, humans.txt, and build metadata

**🔒 Quality Assurance:**

- **Git Pre-commit Hooks:** Automatically validate JSON before commits
- **JSON Validation System:** Prevents `{{placeholder}}` display issues in production
- **Bundle Size Monitoring:** Configurable performance budgets with warnings
- **Error Prevention:** Build fails fast on validation errors with precise error locations

### Content Data Structure

The website uses a centralized data management approach:

- **Editable Content:** `content/*.md` (YAML front matter) holds the church info and page text; `content/ministries/` has one file per ministry. `scripts/content-loader.js` merges these into one `churchData` object at build time
- **Technical Data:** `src/data/site.json` (site + SEO) and `src/data/youtube.json` (written by the weekly YouTube workflow) are merged in too
- **Dynamic Placeholders:** HTML pages use `{{placeholder}}` syntax for dynamic content injection
- **Automated Validation:** `npm run lint` validates every content file (with file and line numbers) and the build prevents broken placeholders

Example content file (`content/services.md`) and usage:

```md
---
services:
  primary:
    name: Service Name
    time: Service Time
---
```

Each top-level front matter key becomes a top-level data key. `content/plan-visit.md` is nested under `planvisit`, and the `ministries` object is built from `content/ministries/`. The body text of a ministry file becomes its `description`.

Reference in HTML: `{{name}}` or `{{services.primary.time}}` or `{{seo.title}}`

### Image Management & Optimization

**Automated Pipeline:**

1. Place original images in `src/images/` with descriptive filenames
2. Run `npm run images:optimize` to generate optimized WebP/AVIF versions
3. Build system automatically handles cache-busting via Vite's asset hashing
4. Reference in HTML with standard paths: `/images/your-image.webp`

**Optimization Features:**

- **Format Conversion:** Automatic WebP/AVIF generation from JPEG/PNG sources
- **Quality Tuning:** Optimized compression settings for web delivery
- **Cache Management:** Vite generates unique hashes (e.g., `image-BzKB4LMw.avif`)
- **Lazy Loading:** Built-in browser optimization with `loading="lazy"` attributes

### Development Workflow

**Content Updates:**

1. **Text Changes:** Edit markdown files in `content/`
2. **Validation:** Run `npm run lint:json` to check JSON and content syntax
3. **Testing:** Use `npm run dev` for live preview
4. **Deployment:** `npm run build` validates and prepares for production

**Code Changes:**

1. **Development:** Use `npm run dev` with hot module replacement
2. **Quality Check:** Run `npm run lint` before committing
3. **Git Integration:** Pre-commit hooks automatically validate changes
4. **Build Verification:** `npm run build` ensures production readiness

**Error Handling:**

- **Content/JSON Syntax Errors:** Precise line-by-line error reporting with fix suggestions
- **Build Failures:** Early termination with detailed error context
- **Asset Issues:** Image optimization failures halt deployment
- **Performance Warnings:** Bundle size budget violations logged to console

## 🌐 Deployment & CI/CD Pipeline

**🏗️ GitHub Actions Workflows:**

The project uses a sophisticated CI/CD pipeline with two automated workflows:

### **Primary Deployment (`deploy.yml`)**

**Triggers:**

- Push to main branch (automatic)
- Manual workflow dispatch

**Pipeline Stages:**

```yaml
1. Environment Setup
   ├── Ubuntu latest runner
   ├── Node.js 20 with npm caching
   └── Dependency installation

2. Quality Assurance  
   ├── Comprehensive lint validation
   ├── JSON-specific content validation
   └── Build system verification

3. Content Processing
    ├── Automated version incrementing
    ├── Image optimization pipeline
    └── YouTube RSS + live status updates

4. Production Build
   ├── Vite build with asset processing
   ├── Bundle size monitoring
   └── Performance budget validation

5. Deployment
   ├── GitHub Pages artifact upload
   └── Live site deployment
```

**Environment Variables:**

- `GITHUB_PAGES: "true"` - GitHub Pages configuration
- `BUNDLE_BUDGET_KB: "300"` - Performance budget enforcement
- `SITE_URL: "https://oatville-community-church.org"` - Custom domain
- `YOUTUBE_API_KEY: "<key>"` - Optional, enables static live/upcoming stream status snapshot generation (`src/data/live-status.json`) in GitHub Actions

### **Weekly Content Updates (`weekly-update.yml`)**

**Triggers:**

- Scheduled: Every 3 hours (UTC)
- Manual workflow dispatch

**Pipeline Features:**

- Automated YouTube content fetching
- Git commit of content changes
- Full validation and deployment pipeline
- Change detection with conditional processing

**🔧 Build System Integration:**

**Local Development:**

```bash
npm run dev
# ├── Fetches latest YouTube content
# ├── Starts Vite dev server (localhost:5173)
# ├── Hot module replacement enabled
# └── Live placeholder injection
```

**Production Build:**

```bash
npm run build
# ├── Lint + JSON validation
# ├── Vite compilation + asset processing
# └── Output: dist/ ready for deployment

npm run build:release
# ├── Lint + JSON validation
# ├── Version increment + image optimization
# ├── YouTube content/live refresh
# └── Vite build output
```

**🚀 Deployment Features:**

- **Zero-Downtime:** GitHub Pages deployment with artifact versioning
- **Cache Management:** Automatic asset hash generation for browser cache invalidation
- **Performance Monitoring:** Bundle size tracking with configurable budgets
- **Error Prevention:** Multi-stage validation prevents broken deployments
- **Content Automation:** Weekly YouTube integration keeps sermons current

**📊 Build Analytics:**

- **Build Time Tracking:** GitHub Actions provides execution time metrics
- **Bundle Size Reporting:** Console output shows raw bundle size vs budget
- **Error Reporting:** Detailed failure context with precise error locations
- **Asset Optimization:** Image processing statistics and compression ratios

**Current Hosting Configuration:**

- **Primary Domain:** [oatville-community-church.org](https://oatville-community-church.org)
- **GitHub Pages Fallback:** [oatville-community-church.github.io/oatvillechurchweb](https://oatville-community-church.github.io/oatvillechurchweb/)
- **Custom Domain Setup:** CNAME file in `src/` directory for GitHub Pages
- **SSL/TLS:** Automatic HTTPS enforcement via GitHub Pages

**Deployment Timeline:**

- Code push → GitHub Actions trigger → Build validation → Asset processing → Live deployment
- **Typical Duration:** 2-3 minutes from push to live site update
- **Rollback:** Previous deployments accessible via GitHub Pages history

## 📞 Technical Support

- **Repository Issues:** [GitHub Issues](https://github.com/Oatville-Community-Church/oatvillechurchweb/issues)
- **Documentation:** See guides in `Documentation/` folder

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Modern Static Site Architecture**

[🌐 Live Website](https://oatville-community-church.org) • [📂 GitHub Repository](https://github.com/Oatville-Community-Church/oatvillechurchweb)
