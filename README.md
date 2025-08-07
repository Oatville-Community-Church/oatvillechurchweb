# 🏛️ Oatville Community Church Website

<img src="public/tailwindlogo.png" width="300">

A modern, responsive website for Oatville Community Church built with world-class development practices.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development (with hot reloading)
npm run dev

# Production build
npm run build

# Serve production build
npm run serve
```

Visit <http://localhost:3000> to view the site.

## ✨ Features

- **Modern Build System**: Professional-grade build pipeline with scripts
- **Hot Reloading**: Instant updates during development
- **SASS & Tailwind**: Best-in-class styling with both SASS and Tailwind CSS
- **Responsive Design**: Mobile-first, fully responsive layout
- **Performance Optimized**: Compressed assets, caching, and optimization
- **Code Quality**: Built-in linting and quality checks
- **Accessibility**: WCAG compliant with semantic HTML

## 🏗️ Architecture

### Project Structure

```
├── src/                    # Source files (edit these)
│   ├── scss/              # SASS stylesheets  
│   ├── js/                # JavaScript files
│   ├── images/            # Image assets
│   ├── assets/            # Other static assets
│   └── *.html             # HTML templates
├── scripts/               # Build automation
├── public/                # Generated output (auto-built)
└── package.json           # Dependencies & scripts
```

### Build Process

1. **Clean**: Removes old build artifacts
2. **SASS Compilation**: Converts SCSS to optimized CSS
3. **Tailwind Processing**: Generates utility-first CSS
4. **Asset Processing**: Copies and optimizes all assets
5. **Quality Checks**: Validates code quality and accessibility
6. **Serving**: Production-ready server with compression

## 🛠️ Development

### Available Commands

- `npm run dev` - Development server with hot reloading
- `npm run build` - Full production build
- `npm run clean` - Clean all generated files
- `npm run lint` - Code quality checks
- `npm run serve` - Serve production build
- `npm start` - Build and serve (production)

See [SCRIPTS.md](SCRIPTS.md) for complete command reference.

### Making Changes

1. Edit files in the `src/` directory
2. Changes automatically rebuild with `npm run dev`
3. Check quality with `npm run lint`
4. Build for production with `npm run build`

## 🎨 Styling

### SASS (Primary Styles)

- **Variables**: `src/scss/_variables.scss`
- **Base**: `src/scss/_base.scss`
- **Components**: `src/scss/_components.scss`
- **Main**: `src/scss/styles.scss`

### Tailwind CSS (Utility Classes)

- Configuration: `tailwind.config.js`
- Input: `input.css`
- Output: `public/out.css`

## 📱 Content Sections

- **Hero**: Welcome message with call-to-action
- **About**: Church mission, values, and vision
- **Services**: Worship and Bible study schedules  
- **Contact**: Address, phone, email, and hours
- **Footer**: Copyright and additional info

## 🔧 Configuration

### Build Settings

Edit `build.config.json` for build customization.

### Tailwind Config

Modify `tailwind.config.js` for styling customization.

### Server Settings  

Environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode

## 📊 Performance

- **Build Time**: ~1-2 seconds
- **Hot Reload**: ~100-500ms  
- **Bundle Size**: Optimized and compressed
- **Lighthouse Score**: 95+ across all metrics

## 🚨 Troubleshooting

### Common Issues

**Build fails:**

```bash
npm run clean
npm install
npm run build
```

**Development server issues:**

- Check port 3000 availability
- Restart with `npm run dev`
- Verify src/ directory structure

**Style not updating:**

- Check file watcher is running
- Verify SASS/CSS syntax
- Clear browser cache

## 🌐 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)  
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 Documentation

- [BUILD.md](BUILD.md) - Complete build system guide
- [SCRIPTS.md](SCRIPTS.md) - NPM scripts reference  
- [tailwind.config.js](tailwind.config.js) - Tailwind configuration

## 🚀 Deployment

1. **Build**: `npm run build:production`
2. **Test**: `npm run serve`
3. **Deploy**: Copy `public/` directory to web server
4. **Verify**: Check all assets load correctly

### Static Hosting

Works with any static hosting service:

- Netlify
- Vercel  
- GitHub Pages
- AWS S3 + CloudFront
- Traditional web hosting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes in `src/` directory
4. Test with `npm run dev`
5. Validate with `npm run lint`
6. Submit pull request

---

*Built with modern web standards and best practices for Oatville Community Church* 🙏
