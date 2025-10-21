# Plan Visit Page Enhancement - Session Documentation

**Date:** October 21, 2025
**Project:** Oatville Community Church Website

## Overview

Successfully updated the `plan-visit.html` page to be fully data-driven using a new JSON data source, optimizing it for search engine ranking and indexing. The page now sources all content from `/src/data/planvisit.json` and generates a complete static page during the build process.

## Changes Made

### 1. Created New Data Structure

- **File:** `/src/data/planvisit.json`
- **Purpose:** Centralized data source for all plan-visit page content
- **Structure:** Organized into logical sections (hero, whatToExpect, serviceTimes, childrenFamilies, beforeYouArrive, commonQuestions, nextStep, seo, structuredData, accessibility)

### 2. Updated Build Process

- **File:** `vite.config.js`
- **Enhancement:** Modified `htmlPlaceholderPlugin` to load and merge `planvisit.json` into the main `churchData` object
- **Access Pattern:** Content accessible via `{{planvisit.*}}` placeholders

### 3. Enhanced Plan Visit HTML Page

- **File:** `src/plan-visit.html`
- **Changes:**
  - Replaced all static content with `{{planvisit.*}}` placeholders
  - Enhanced SEO meta tags with comprehensive description and keywords
  - Added extensive structured data (FAQPage, Event, Breadcrumbs)
  - Improved Open Graph and Twitter meta tags
  - Added accessibility information section
  - Expanded FAQ section with 5 questions (previously 3)

### 4. SEO Optimizations

#### Meta Tags

- **Title:** "Plan Your Visit | Oatville Community Church | Wichita, KS"
- **Description:** Comprehensive 155-character description optimized for search
- **Keywords:** 10 targeted keyword phrases for plan visit queries
- **Open Graph:** Complete og:title, og:description, og:image, og:url tags
- **Twitter Cards:** Summary large image with proper title/description

#### Structured Data (JSON-LD)

1. **BreadcrumbList:** Navigation hierarchy for search results
2. **FAQPage:** 5 common visitor questions with structured answers
3. **Event:** Next Sunday service details with location and organizer info

### 5. Content Enhancements

#### Expanded FAQ Section

- "Do I need to dress up?"
- "Will I be singled out?"
- "Is the building accessible?"
- "What about parking?" (NEW)
- "Can I bring my children?" (NEW)

#### New Accessibility Section

- Wheelchair accessible entrances and seating
- Accessible restrooms
- Large print materials available
- Hearing assistance devices available
- Service animal friendly

## Technical Implementation

### Data Structure Pattern

```json
{
  "planvisit": {
    "hero": { "title", "subtitle" },
    "whatToExpect": { "title", "description", "highlights", "links" },
    "serviceTimes": { "title", "timezone", "schedule" },
    "seo": { "title", "description", "keywords" },
    "structuredData": { "breadcrumbs", "faqPage", "event" }
  }
}
```

### Placeholder Replacement

- Build-time replacement via Vite plugin
- Supports nested object access (e.g., `{{planvisit.seo.title}}`)
- Preserves performance with static generation

## SEO Benefits Achieved

1. **Comprehensive Meta Data:** Complete title, description, keywords optimized for first-time visitor searches
2. **Structured Data:** Enhanced search result appearance with FAQ rich snippets and event information
3. **Accessibility Information:** Clear accessibility features improve local search ranking
4. **Mobile-First Content:** Responsive design with accessibility considerations
5. **Page Speed:** Static generation maintains fast loading times
6. **Local SEO:** Specific location and service time information for Wichita searches

## Build Results

- **File Size:** 22.17 kB (plan-visit.html)
- **Gzipped:** 5.09 kB
- **Performance:** Maintained static build performance
- **Structure:** All placeholders successfully replaced during build
- **Validation:** Structured data properly formatted for search engines

## Future Considerations

1. **Dynamic FAQ Loading:** Consider expanding FAQ section based on visitor analytics
2. **A/B Testing:** Test different hero messages for conversion optimization  
3. **Multi-language:** Prepare data structure for potential Spanish translation
4. **Rich Media:** Consider adding virtual tour or photo gallery integration

## Verification Steps Completed

1. ✅ Build process successfully merges JSON data
2. ✅ All placeholders replaced in final HTML
3. ✅ Structured data validates as proper JSON-LD
4. ✅ Meta tags optimized for search engines
5. ✅ Accessibility section enhances inclusive design
6. ✅ Page maintains responsive design integrity
7. ✅ Performance budget maintained under acceptable thresholds

## Files Modified

- `src/data/planvisit.json` (NEW)
- `src/plan-visit.html` (UPDATED)
- `vite.config.js` (ENHANCED)

## Documentation Location

This session documentation stored in: `copilot/session-2025-10-21/plan-visit-enhancement.md`
