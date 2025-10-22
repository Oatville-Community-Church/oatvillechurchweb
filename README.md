# 🏛️ Oatville Community Church Website

> A modern church website built with automated content management and deployment.

[![Website](https://img.shields.io/website?url=https%3A//oatville-community-church.github.io/oatvillechurchweb/)](https://oatville-community-church.github.io/oatvillechurchweb/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Website:** [oatville-community-church.org](https://www.oatville-community-church.org) | [GitHub Pages](https://oatville-community-church.github.io/oatvillechurchweb/)

## ✨ Website Features

**🚀 Automated Systems:**

- **YouTube Integration:** Automatically fetches and displays latest sermons via RSS feed
- **Mobile-Responsive:** Adaptive design that works on all device sizes
- **Performance Optimized:** Fast loading with image optimization and caching
- **Zero Hosting Costs:** Deployed on GitHub Pages with free hosting
- **Content Management:** Easy updates through GitHub web interface or mobile app

**📱 Page Structure:**

- **Home:** Landing page with dynamic content and latest sermon
- **Plan Your Visit:** Information page with directions and expectations
- **Ministries:** Program and ministry information pages
- **YouTube:** Dedicated page for live streams and sermon archive

**🔧 Technical Features:**

- JSON-based content management system
- Automatic image optimization and compression
- Search engine optimization (SEO) built-in
- Progressive Web App (PWA) capabilities
- Automated build and deployment pipeline

## 🏗️ Project Structure

```text
src/                          # All source files and assets
├── *.html                   # Website pages (index, ministries, plan-visit, you-tube)
├── data/
│   └── churchInformation.json # Church content and information
├── images/                  # Church photos and graphics
├── js/                      # Website functionality
└── scss/                    # Styling and design
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

## 📚 Documentation

**Setup and Management Guides:**

- **[Complete Setup Guide](Documentation/PASTOR_HANDOVER_GUIDE.md)** - Full website setup and deployment process
- **[GitHub Account Setup](Documentation/GITHUB_ACCOUNT_SETUP.md)** - Creating and configuring GitHub account
- **[Domain Configuration](Documentation/CLOUDFLARE_DOMAIN_SETUP.md)** - Connecting custom domain
- **[Content Management](Documentation/WEBSITE_CONTENT_GUIDE.md)** - How to update website content
- **[Image Management](Documentation/IMAGE_MANAGEMENT_GUIDE.md)** - Adding and managing images

**Technical Documentation:**

- **[Architecture Guide](Documentation/technical/ARCHITECTURE.md)** - System architecture and design decisions
- **[Build Process](Documentation/technical/BUILD.md)** - Build system and deployment details

## 🎯 Website Functionality

The website provides the following functional areas:

- **� Multi-Page Navigation:** Responsive page structure with consistent layout
- **� Video Integration:** Automated YouTube content fetching and display
- **� Content Management:** JSON-based data storage for easy updates
- **🔄 Automated Deployment:** Push-to-deploy workflow with GitHub Actions

## 🚀 For Developers

### Prerequisites

- **Node.js:** Version 20.19.0 or higher
- **npm:** Version 8.0.0 or higher

### Development Commands

```bash
npm install            # Install dependencies
npm run dev            # Start development server (http://localhost:5173)
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Check code quality
npm run images:optimize # Optimize images
```

### Content Data Structure

The website uses a centralized data management approach:

- **Primary Data:** `src/data/churchInformation.json` contains all website content
- **Dynamic Placeholders:** HTML pages use `{{placeholder}}` syntax for dynamic content
- **Automated Updates:** Build process injects data into static HTML templates

Example data structure:

```json
{
  "name": "Organization Name",
  "services": {
    "primary": {
      "name": "Service Name",
      "time": "Service Time"
    }
  }
}
```

Reference in HTML: `{{name}}` or `{{services.primary.time}}`

### Image Management

1. Place images in `src/images/` with descriptive filenames
2. Run `npm run images:optimize` to create web-optimized versions
3. Reference in HTML with paths like `/images/your-image.webp`

### Making Updates

1. **Content Changes:** Edit `src/data/churchInformation.json`
2. **Page Structure:** Modify HTML files in `src/` using placeholder syntax
3. **Styling:** Update SCSS files in `src/scss/`
4. **Testing:** Run `npm run lint` before committing changes

## 🌐 Deployment & Hosting

**Current Hosting:**

- **Primary:** [oatville-community-church.org](https://www.oatville-community-church.org)
- **GitHub Pages:** [oatville-community-church.github.io/oatvillechurchweb](https://oatville-community-church.github.io/oatvillechurchweb/)

**Automatic Deployment:**

- Changes pushed to the main branch automatically deploy to GitHub Pages
- Build process includes image optimization and content updates
- Typically takes 2-3 minutes for changes to go live

## 📞 Technical Support

- **Repository Issues:** [GitHub Issues](https://github.com/Oatville-Community-Church/oatvillechurchweb/issues)
- **Documentation:** See guides in `Documentation/` folder

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Modern Church Website Solution** 🌐

[🌐 Live Website](https://www.oatville-community-church.org) • [� GitHub Repository](https://github.com/Oatville-Community-Church/oatvillechurchweb)
