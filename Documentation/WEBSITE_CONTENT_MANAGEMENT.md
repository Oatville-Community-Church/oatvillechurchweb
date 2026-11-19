# Website Content Management Guide

## Quick Start

### Updating Website Content

1. Edit the markdown files in the `content/` folder (see [WEBSITE_CONTENT_GUIDE.md](WEBSITE_CONTENT_GUIDE.md) for which file controls what):
   - `church.md`, `hours.md`, `services.md`, `about.md`, `faq.md`, `leadership.md`, ... - church info and home page
   - `ministries/` - one file per ministry (`_index.md` holds the page heading)
   - `plan-visit.md` - Visitor information and expectations
   - `beliefs.md` - What We Believe page (hidden until `approved: true`)

2. Build and deploy:

   ```bash
   npm run build
   git add .
   git commit -m "Update content"
   git push
   ```

### Updating Images

1. Replace image files in `src/images/` folder
2. Keep the same filenames for automatic replacement
3. Build and deploy (same as above)

## Error Prevention

### The system automatically prevents common errors

- **Content syntax errors** - Build will fail with the file name and line number
- **Invalid commits** - Git hooks prevent broken code from being saved
- **Image cache issues** - Browser automatically gets new images

### If you see an error message

- **"Nested mappings are not allowed"** - A line has a colon followed by a space inside the text; wrap the text in double quotes
- **"missing front matter"** - The file must start with `---` and have a closing `---` after the settings
- **"... is already defined in ..."** - The same setting appears in two content files; keep only one
- Run `npm run lint` to see all issues at once

## Key Commands

```bash
npm run build    # Build website for deployment
npm run dev      # Preview changes locally
npm run lint     # Check for errors only
```

## Content File Structure

### Example: Adding a new ministry

Create `content/ministries/07-youth-night.md` (the number sets the order on the page):

```md
---
id: youth-night
title: Youth Night
icon: 🎸
detailsTitle: Schedule
details:
  - Fridays at 6:00 PM
  - Games and worship
---

A night for teens to connect, worship, and grow together.
```

**Important**: Use spaces (not tabs) for indentation, and put text in double quotes if it contains a colon followed by a space.

**Technical files:** `src/data/site.json` (site and SEO settings) is edited by the developer. `src/data/youtube.json` is rewritten automatically by the weekly YouTube update.

## Getting Help

1. Check error messages - they show exactly what to fix
2. Use `npm run lint` to validate content and JSON files
3. The build process prevents broken content from going live

The system is designed to catch errors before they affect the website.
