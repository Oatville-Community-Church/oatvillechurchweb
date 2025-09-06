# 🏛️ Oatville Community Church Website

> **"Small church with a big heart"** - A modern, accessible, and performance-optimized website for our Wichita, KS church community.

[![Build Status](https://github.com/Oatville-Community-Church/oatvillechurchweb/actions/workflows/deploy.yml/badge.svg)](https://github.com/Oatville-Community-Church/oatvillechurchweb/actions)
[![Website](https://img.shields.io/website?url=https%3A//oatville-community-church.github.io/oatvillechurchweb/)](https://oatville-community-church.github.io/oatvillechurchweb/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.19.0-brightgreen)](https://nodejs.org/)

**Live Website:** [oatvillecommunitychurch.org](https://www.oatvillecommunitychurch.org) | [GitHub Pages](https://oatville-community-church.github.io/oatvillechurchweb/)

## 📖 About Our Church

Oatville Community Church is a non-denominational community church located at **3814 S Hoover Rd, Wichita, KS 67215**. Our mission is to "reach the lost and show and grow in Christ's love" - creating a welcoming space where authentic faith meets genuine community.

### 🕒 Service Times

- **Sunday Worship:** 11:00 AM & 5:00 PM (Central)
- **Christian Education:** Sundays at 10:00 AM
- **Wednesday Prayer:** 6:00 PM
- **YaWeh Bible Study:** Wednesdays at 6:45 PM

### 🎥 Live Stream

Join us online! Our Sunday 11:00 AM service streams live on [YouTube](https://www.youtube.com/@OatvilleCommunityChurch) with archived messages available for on-demand viewing.

## 🚀 Quick Start

```bash
npm install            # install dependencies (Node >=20)
npm run dev            # Vite dev server with HMR (http://localhost:5173)
npm run build          # production build -> dist/ (includes prebuild optimizations)
npm run preview        # preview built site locally
npm run lint           # custom lint checks & quality assurance
npm test               # run test suite (currently aliases lint)
npm run clean          # remove dist directory
npm run images:optimize # optimize source images via Sharp
```

**Development Server:** <http://localhost:5173>

## ✨ Key Features

- **🏗️ Modern Architecture:** Multi‑page Vite build with TypeScript-ready configuration
- **🎨 Beautiful Design:** Tailwind CSS v4 + SCSS with custom church branding
- **📱 Mobile-First & Responsive:** Optimized for all devices and screen sizes
- **⚡ Lightning Fast:** Automated image optimization, lazy loading, and performance budgets
- **♿ Accessibility First:** WCAG 2.1 AA compliant with semantic HTML structure
- **🔍 SEO Optimized:** Auto-generated sitemaps, schema.org structured data, Open Graph tags
- **📱 Progressive Web App:** Offline support with service worker and app manifest
- **📊 Performance Monitoring:** Bundle size reporting with 300KB soft budget
- **🔄 CI/CD Pipeline:** Automated deployment to GitHub Pages with quality checks
- **📄 Content Management:** JSON-based content system with placeholder templating

### 🛠️ Technical Highlights

- **Build System:** Vite 7+ with hot module replacement and optimized production builds
- **Styling:** Tailwind CSS v4 with JIT compilation + organized SCSS partials
- **Asset Pipeline:** Automated image optimization (WebP/AVIF), favicon generation
- **Data Layer:** Centralized content management via `churchInformation.json`
- **SEO & Schema:** Automated canonical URLs, JSON-LD structured data for events/organization
- **Performance:** Lazy loading, code splitting, and compressed asset delivery
- **Quality Assurance:** ESLint, Prettier, custom lint scripts, and accessibility auditing

## 🏗️ Project Structure

```text
src/                          # All source code and assets
├── *.html                   # Multi-page entry points (index, ministries, etc.)
├── data/
│   └── churchInformation.json # Single source of truth for all content
├── images/                  # Optimized images (WebP/AVIF formats)
├── assets/                  # Favicon, logos, and static assets
├── js/                      # JavaScript modules and components
└── scss/                    # SCSS partials and custom styles
Documentation/               # Comprehensive project documentation
├── ARCHITECTURE.md         # Technical architecture deep-dive
├── BUILD.md               # Build system and troubleshooting
└── *.md                   # Additional technical documentation
scripts/                    # Node.js automation scripts
├── optimize-images.js     # Image optimization pipeline
├── fetch-latest-video.js  # YouTube integration
└── *.js                   # Build and maintenance scripts
```

All runtime assets **must** live under `src/` - no `public/` directory is used (`publicDir: false` in Vite config).

## 🎯 Ministry Focus Areas

Our website serves our church's core ministries:

- **👨‍👩‍👧‍👦 Family Ministry:** Children's church, nursery services, and family-friendly programming
- **📚 Christian Education:** Adult Sunday school, YaWeh Bible Study, and discipleship programs  
- **🙏 Prayer & Worship:** Traditional hymns, contemporary music, and community prayer
- **🤝 Community Outreach:** Local missions, benevolence programs, and community events
- **💒 Life Events:** Weddings, baptisms, and pastoral care services

## 🚀 Getting Started for Contributors

### Prerequisites

- **Node.js:** Version 20.19.0 or higher
- **npm:** Version 8.0.0 or higher
- **Git:** For version control and collaboration

### Installation & Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Oatville-Community-Church/oatvillechurchweb.git
   cd oatvillechurchweb
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The site will be available at [http://localhost:5173](http://localhost:5173)

4. **Build for production**

   ```bash
   npm run build
   ```

   Built files will be in the `dist/` directory

### Development Workflow

1. **Content Updates:** Edit `src/data/churchInformation.json` for text, service times, contact info
2. **Page Updates:** Modify HTML files in `src/` using `{{placeholder}}` syntax for dynamic content
3. **Styling:** Add utility classes (Tailwind) or custom styles in `src/scss/` partials
4. **Images:** Place optimized images in `src/images/` - run `npm run images:optimize` if needed
5. **Testing:** Run `npm run lint` before committing changes
6. **Preview:** Use `npm run preview` to test the production build locally

## 🎨 Content Management

### 📝 Updating Church Information

All church data lives in `src/data/churchInformation.json`:

```json
{
  "name": "Oatville Community Church",
  "tagline": "Small church with a big heart",
  "services": {
    "sundayWorship": {
      "name": "Sunday Worship",
      "time": "11:00 AM & 5:00 PM"
    }
  }
}
```

Reference in HTML using placeholder syntax: `{{name}}`, `{{services.sundayWorship.time}}`

### 🖼️ Adding Images

1. Place images in `src/images/` with descriptive, lowercase, hyphenated names
2. Run `npm run images:optimize` to generate WebP/AVIF formats
3. Include explicit `width` and `height` attributes for better performance
4. Use `loading="lazy"` for non-critical images

### 📄 Adding New Pages

1. Create `src/newpage.html` following existing page structure
2. Add entry to `vite.config.js` in `rollupOptions.input`
3. Include proper meta tags, structured data, and navigation links
4. Run `npm run build` to verify it appears in generated sitemap

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Production build (includes prebuild optimizations) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run quality checks and linting |
| `npm test` | Run test suite (currently aliases lint) |
| `npm run clean` | Remove dist directory |
| `npm run images:optimize` | Optimize images using Sharp |

### Prebuild Pipeline

The `npm run build` command automatically runs:

1. **Image Optimization:** Generates WebP/AVIF formats for all images
2. **Video Fetch:** Updates latest sermon from YouTube RSS feed
3. **Quality Checks:** Runs lint and accessibility audits
4. **Bundle Analysis:** Reports bundle size against 300KB budget

## 🌟 Performance & Best Practices

### 🚀 Performance Features

- **Lighthouse Score:** Consistently 95+ across all metrics
- **Bundle Size:** Soft 300KB budget with automated monitoring
- **Image Optimization:** WebP/AVIF with lazy loading and proper sizing
- **Caching Strategy:** Service worker with strategic asset caching
- **Critical CSS:** Inlined for above-the-fold rendering

### ♿ Accessibility Standards

- **WCAG 2.1 AA Compliance:** Semantic HTML, proper contrast ratios
- **Keyboard Navigation:** Full keyboard accessibility with visible focus
- **Screen Reader Support:** Proper headings, alt text, and ARIA labels
- **Color Blindness:** Information conveyed beyond color alone

### 🔍 SEO Optimization

- **Structured Data:** JSON-LD schema for Organization, Events, FAQs
- **Meta Tags:** Comprehensive Open Graph, Twitter Cards, canonical URLs  
- **Sitemap:** Auto-generated XML sitemap with proper priority and frequency
- **Performance:** Fast loading times and mobile-first responsive design

## 🤝 Contributing to Our Ministry

We welcome contributions from our church community and fellow developers! Please see our [Contributing Guidelines](.github/CONTRIBUTING.md) for details.

### 🔄 Pull Request Process

1. Fork the repository and create a feature branch
2. Make your changes following our coding standards
3. Test thoroughly with `npm run lint` and `npm run build`
4. Submit a pull request with a clear description
5. Wait for review and address any feedback

### 📋 Code of Conduct

This project follows our [Code of Conduct](.github/CODE_OF_CONDUCT.md) based on Christian values of love, respect, and community.

## 🌐 Deployment & Hosting

### 🌐 Production Deployment

- **Primary:** [oatvillecommunitychurch.org](https://www.oatvillecommunitychurch.org)
- **GitHub Pages:** [oatville-community-church.github.io/oatvillechurchweb](https://oatville-community-church.github.io/oatvillechurchweb/)

### ⚙️ CI/CD Pipeline

Automated deployment via GitHub Actions:

- **Quality Gates:** Lint, build verification, accessibility audits
- **Performance Monitoring:** Bundle size reporting and Lighthouse CI
- **Deploy Targets:** GitHub Pages with custom domain support
- **Environment Variables:** `GITHUB_PAGES=true` for correct base path

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](Documentation/ARCHITECTURE.md) | Technical architecture and design decisions |
| [Build System](Documentation/BUILD.md) | Build process and troubleshooting |
| [Scripts Reference](Documentation/SCRIPTS.md) | Detailed command explanations |
| [Copilot Instructions](.github/copilot-instructions.md) | AI assistant guidelines |

## 🌍 Browser Support

- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest 2 versions  
- **Safari:** Latest 2 versions (including iOS)
- **Mobile:** Chrome Mobile, iOS Safari

## 📞 Support & Contact

- **Church Office:** (316) 390-3591
- **Email:** [oatvillecommunitychurch@gmail.com](mailto:oatvillecommunitychurch@gmail.com)
- **Address:** 3814 S Hoover Rd, Wichita, KS 67215
- **Technical Issues:** [GitHub Issues](https://github.com/Oatville-Community-Church/oatvillechurchweb/issues)

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and Christian community values
- Powered by [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Sass](https://sass-lang.com/)
- Hosted with love on [GitHub Pages](https://pages.github.com/)
- Special thanks to our volunteer developers and church family

---

**"Small church with a big heart"** ❤️

*Making disciples, serving our community, and glorifying God through modern technology.*

[🌐 Visit Our Website](https://www.oatvillecommunitychurch.org) • [📺 Watch Live](https://www.youtube.com/@OatvilleCommunityChurch) • [📧 Contact Us](mailto:oatvillecommunitychurch@gmail.com)

---
Historical refactors & extended rationale moved to `Documentation/ARCHITECTURE.md`.
