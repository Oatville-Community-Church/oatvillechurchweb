# Site Audit & Best Practices Alignment

Date: 2025-08-08
Repository: oatvillechurch
Scope: Public-facing static site pages (index, plan-visit, ministries, you-tube, offline, 404) plus supporting data (`churchInformation.json`).

---

## 1. Small Community Church Website Best Practices (Research Synthesis)

Grouped by thematic area; distilled to actionable principles for a lightweight, multi‑page static implementation.

### 1.1 Core Identity & Clarity

- Church name, location, and mission visible above the fold.
- Immediate orientation: service times, invitation to visit, succinct tagline.
- Consistent phrase / brand reinforcement (“Small church with a big heart”).

### 1.2 Navigation & Information Architecture

- Flat, intuitive primary nav (≤7 items). Typical: Home, About/Beliefs, Ministries, Messages/Sermons, Plan Visit, Give, Contact.
- Persistent CTA (Plan Visit or Watch Live) across pages; mobile-accessible menu.
- 404 page with recovery paths.

### 1.3 Service Times & Events

- Service schedule clearly stated with timezone context.
- Recurring and near-term special events previewed; structured data (`Event` schema) for rich results.

### 1.4 Plan a Visit Funnel

- Dedicated page: what to expect, length, attire, parking, kids, accessibility, next step CTA.
- Friendly tone, reduces uncertainty / friction.

### 1.5 Sermons & Media

- Latest message easily playable with minimal performance impact (lite embed).
- Archive discoverable (search/filter).
- Encourage subscription (YouTube subscribe link).
- Structured data: `VideoObject` (thumbnail, date, description).

### 1.6 Beliefs / Doctrine & Leadership

- Transparent beliefs / doctrinal summary.
- Leadership: names, roles, concise bios; optional photos to build trust.

### 1.7 Giving & Engagement

- Clear theology / philosophy of giving.
- Low-friction online giving (secure provider) + alternate methods.
- Progressively enhance later if financial processor not yet integrated.

### 1.8 Social Proof & Community Signals

- Testimonials (short, authentic).
- Social media links with accessible labels.

### 1.9 Accessibility (a11y)

- Semantic heading hierarchy (single `<h1>`).
- High color contrast (WCAG AA).
- Alt text for meaningful images; decorative images empty alt.
- Keyboard navigability, visible focus indicators.
- Skip link present.

### 1.10 SEO & Structured Data

- Unique, intention-aligned `<title>` + meta description (≤160 chars).
- Canonical links to avoid duplication signals.
- Open Graph + Twitter metadata (image + alt).
- Structured data hierarchy: Organization/Church, Event(s), FAQPage, VideoObject, BreadcrumbList, (optional) SiteNavigationElement.
- XML sitemap + robots.txt.

### 1.11 Performance & Reliability

- Optimized images (WebP/AVIF, proper sizing, explicit width/height for CLS).
- Lazy-load non-critical media & iframes.
- Lightweight JS; progressive enhancement (content accessible without JS).
- CSP to reduce XSS risk; trim `'unsafe-inline'` when hashed styles feasible.
- PWA optional for offline fallback.

### 1.12 Privacy & Trust

- Transparent contact methods & address (NAP consistency).
- Clear disclaimers for forms / data collection once added.
- Minimal third-party scripts (avoid tracking bloat).

### 1.13 Engagement Pathways

- Repeated CTAs (Visit, Watch, Give, Contact).
- Next steps after content consumption (e.g., After watching: Plan Visit / Subscribe / Contact).

### 1.14 Future Enrichment

- Newsletter opt-in (double confirmation).
- Prayer request / pastoral care form with honeypot & rate-limit.
- Sermon series taxonomy, transcripts for accessibility + SEO (Article schema).
- Event registration (seasonal).

---

## 2. Current Site State vs Best Practices

Legend: ✅ Aligned | ⚠ Partial / Needs Improvement | ❌ Missing

| Category | Status | Notes |
|----------|--------|-------|
| Identity (name/tagline) | ✅ | Prominent in hero; tagline consistent. |
| Service Times Visibility | ⚠ | Added hero service line; could add sticky quick reference on scroll. |
| Events Listing Breadth | ❌ | Only next Sunday + small upcoming array; no multi-event JSON-LD output yet. |
| Navigation Completeness | ⚠ | Lacks Beliefs / Give / Leadership; no mobile menu toggle (desktop-only for secondary items). |
| Plan Visit Page | ✅ | Strong coverage (expect, kids, attire, times). |
| Sermon Latest & Archive | ✅ | Lite embed pattern + archive search scaffold. |
| Beliefs / Doctrine Public | ❌ | Data added (`beliefs`) but not rendered on a page. |
| Leadership Public | ❌ | JSON present; no page / section output. |
| Giving Path | ❌ | Philosophy present in JSON; no UI or CTA. |
| Testimonials | ✅ | Three present; length appropriate. |
| Social Links Accessibility | ✅ | Labeled buttons; visually distinct. |
| Accessibility Headings | ✅ | Index headings normalized to semantic order; cross-pages largely fine (spot-check recommended). |
| Skip Link | ✅ | Present globally. |
| Alt Text Coverage | ✅ | Key images have alt (verify interior consistency). |
| Structured Data (Core) | ✅ | Organization/Church, Event (single), FAQPage, VideoObject, BreadcrumbList. |
| Structured Data (Extended) | ⚠ | Multiple future events & beliefs not yet output; no SiteNavigationElement. |
| Canonical Tags | ✅ | Inserted into all pages. |
| OG/Twitter + Image Alt | ✅ | Added `og:image:alt`. |
| Sitemap & Robots | ✅ | Plugin handles generation. |
| Performance (Images, Lite YT) | ✅ | Modern formats, lite embed, explicit dimensions. |
| CSP Security | ⚠ | Includes `'unsafe-inline'` for styles; can remove via hashing/nonce build step. |
| PWA / Offline | ✅ | Offline & PWA manifest present. |
| Mobile Navigation | ✅ | Accessible hamburger + focus trap, outside click + Escape close; unified across pages. |
| Forms (Contact/Prayer) | ❌ | None; only static contact info. |
| Giving Integration | ❌ | Placeholder only. |
| Newsletter / Follow-up | ❌ | No subscription pathway. |
| Sermon Metadata Depth | ❌ | No series, speaker, duration enrichment or transcript. |
| Multi-Page Internal Linking | ⚠ | Reasonable, but add cross-links to future Beliefs/Giving sections. |

---

## 3. Recent Improvements (This Audit Cycle)

- Added canonical tags site-wide.
- Added `og:image:alt` for accessibility/SEO.
- Converted schema to multi-type `["Organization","Church"]`.
- Normalized heading hierarchy on index (SEO + a11y).
- Injected explicit hero service times line.
- Expanded `churchInformation.json` with `beliefs` list & `events.upcoming` array.
- Ensured Lite YouTube embed + structured data synergy remains intact.
- Implemented fully accessible mobile navigation (hamburger toggle, ARIA, focus return, Escape/outside click handling, scroll offset via `scroll-mt-24`).
- Added slide-down animation (respects reduced future ability) and documented in `MOBILE_NAV_NOTES.md`.

Note: Bundle size exceeds soft 300 KB budget primarily due to large JPG originals; optimization opportunity remains.

---

## 4. Gap Analysis & Recommended Remediation

### 4.1 High Priority (Foundational / Visitor-Facing)

| Gap | Impact | Recommended Action | Effort | Priority |
|-----|--------|--------------------|--------|----------|
| Missing Beliefs page/section | Trust, transparency | Add section on index or dedicated page referencing `beliefs` data (structured data optional) | Low | High |
| No Leadership presentation | Human connection | Output leadership grid (name, role, short bio) | Low | High |
| No Giving CTA / page | Engagement, stewardship | Add nav item + page (list methods; mark online giving “coming soon” until provider integrated) | Low-Med | High |
| Mobile nav absent | Mobile usability | (Completed) Accessible hamburger implemented. | Med | — |
| Expanded Events schema absent | Rich results, local SEO | Loop `events.upcoming` to emit multiple Event JSON-LD blocks | Low | High |

### 4.2 Medium Priority (SEO & Engagement)

| Gap | Impact | Action | Effort |
|-----|--------|--------|--------|
| No multi-event UI | Discovery | Add small “Upcoming” list (limit 3) under hero or services section | Low |
| No SiteNavigationElement schema | Minor SEO | Add JSON-LD enumerating primary nav links | Low |
| Limited internal CTAs | Funnel depth | Append CTAs after testimonials & sermon card | Low |
| Lack of newsletter signup | Retention | Reserve placeholder form (Mailchimp/Buttondown) | Med |
| No structured sermon enrichment | Long-tail SEO | Extend `latestVideo` with duration, speaker; emit `duration` in VideoObject | Low |

### 4.3 Lower Priority (Hardening / Future Growth)

| Gap | Impact | Action | Effort |
|-----|--------|--------|--------|
| `'unsafe-inline'` in CSP | Security posture | Move inline styles to CSS or hash them; update CSP | Med |
| No prayer request form | Pastoral care | Add privacy-friendly form w/ honeypot + minimal backend (serverless) | Med |
| No transcripts / series grouping | Accessibility & SEO | Add transcripts markdown -> build-time transform to HTML (future) | High |
| Online giving not integrated | Donations ease | Select provider (e.g., Stripe-hosted, Tithe.ly, Planning Center) & embed | Med |

---

## 5. Prioritized Next 10 Action Steps (Roadmap)

1. Render Beliefs section (index or new page) from `beliefs` array.
2. Render Leadership section/cards.
3. Add Giving page (or interim section) + nav entry; link to philosophy & methods.
4. Emit multi-Event JSON-LD from `events.upcoming`.
5. Display “Upcoming Gatherings” UI snippet (top 2–3 from upcoming).
6. Add SiteNavigationElement JSON-LD.
7. Add CTA blocks (after Latest Message & bottom of Ministries page).
8. Extend `latestVideo` with `duration` & `speaker`; update VideoObject.
9. Prepare CSP hardening plan (inventory inline styles; generate build-time hash).
10. Image weight reduction pass (re‑evaluate JPG compression / add responsive sources) to move toward budget.

---

## 6. Optional Stretch Items (Phase 2)

- Online giving integration (provider evaluation + secure redirect).
- Newsletter opt-in with double opt-in (low friction single field).
- Prayer request form (Netlify/Vercel serverless + spam honeypot).
- Sermon metadata file (`sermons.json`) + archive enhancements (filter by series/speaker).
- Transcript pipeline (Markdown -> HTML + `Article` schema per sermon).
- Event calendar feed (iCal export).

---

## 7. Suggested Data Model Extensions

(When implementing forthcoming features.)

```jsonc
{
  "sermonSeries": [
    { "slug": "romans-faith", "title": "Romans: Living by Faith" }
  ],
  "sermons": [
    {
      "id": "OgR3C4qiQCU",
      "title": "Faith That Endures",
      "publishedAt": "2025-08-04T05:45:32+00:00",
      "speaker": "Pastor John Doe",
      "series": "romans-faith",
      "duration": "PT42M15S",
      "tags": ["faith","romans"],
      "thumbnail": "...",
      "transcriptPath": "sermons/ogR3C4qiQCU.md"
    }
  ]
}
```

---

## 8. Quality Considerations Going Forward

| Dimension | Current Risk | Monitoring Approach |
|-----------|--------------|---------------------|
| Performance (LCP) | Low | Periodic Lighthouse & WebPageTest runs. |
| Accessibility | Moderate | Run axe-core on each major release. |
| SEO Schema Drift | Medium | Validate with Rich Results test after schema updates. |
| Security (CSP) | Medium | Remove inline styles; implement nonce pipeline. |
| Content Freshness (Events/Video) | Medium | Automate video fetch and multi-event rolling update. |

---

## 9. Implementation Sequencing Rationale

Sequence emphasizes trust + conversion (Beliefs, Leadership, Giving) before deeper structural or enrichment tasks, maximizing immediate visitor clarity and engagement while deferring higher-effort backend or schema refinements.

---

## 10. Acceptance Criteria for Upcoming Tasks

| Task | Success Criteria |
|------|------------------|
| Beliefs Section | Renders all entries; semantic headings; accessible list. |
| Leadership Section | Displays each entry (role + bio); alt text reserved for future photos. |
| Giving Page/Section | Includes philosophy + methods + future online note. |
| Mobile Nav | (Completed) Toggle button keyboard accessible; focus return; aria-expanded toggles; Escape/outside click close. |
| Multi-Event JSON-LD | At least 3 upcoming events; passes Rich Results test. |
| SiteNavigationElement | Reflects actual nav URLs (canonical). |
| VideoObject Enrichment | Includes duration + updated thumbnail if changed. |
| CSP Hardening Plan | Document hashed style sources & updated policy draft. |

---

## 11. Summary

Site now satisfies core baseline (identity, plan visit, sermons, structured data, accessibility skeleton) and has an accessible mobile navigation system. Biggest immediate gaps are public-facing belief/leadership/giving content and richer event & sermon metadata. Addressing these high-priority items plus image weight & CSP refinements will materially improve trust, conversion, search clarity, and performance with modest effort.
