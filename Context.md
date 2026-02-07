# Voxummah Website - Development Context

> Persistent context document to prevent context rot across development sessions.

---

## Project Overview

**Type**: Independent Media Website (Grayzone-level)
**Stack**: Vite + React 18 + TypeScript + Tailwind CSS
**CMS**: Ghost CMS with fallback mock data
**Routing**: React Router v6

---

## Design System

### Colors (HSL CSS Variables)
```css
--brand-red: 356 63% 45%     /* Primary accent #ba2a33 */
--brand-green: 150 84% 22%   /* Secondary #096939 */
--neutral-900 to --neutral-50 /* Saturated grey scale */
```

### Typography
- **Headings**: Barlow Condensed (font-heading)
- **Body**: Inter (font-sans)
- **Weights**: 400 (normal), 700 (bold) only

### Breakpoints
- **sm**: 640px (tablet)
- **md**: 768px (tablet landscape)
- **lg**: 1024px (desktop)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/context/ContentContext.tsx` | Ghost CMS data fetching + fallback |
| `src/lib/constants.ts` | Section mappings, tag parsing |
| `src/lib/ghost.ts` | Ghost API client |
| `tailwind.config.js` | Design tokens, typography plugin |
| `src/index.css` | CSS variables, base styles |

---

## Shared Components (New)

Located in `src/components/ui/`:
- `ArticleCard.tsx` - Unified article card with variants
- `Badge.tsx` - Category/tag badges with variants
- `SectionHeader.tsx` - Section headers with color-coded underlines

---

## SEO Implementation

Articles use `react-helmet` for:
- Dynamic `<title>` and `<meta description>`
- Open Graph tags (og:title, og:image, og:url)
- Twitter Card tags

---

## Known Patterns

### Mobile-First Grids
```jsx
// Correct pattern
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Touch Targets
All interactive elements have `min-h-[44px]` for accessibility.

### Focus States
Managed globally in `index.css`:
```css
:focus-visible {
  outline: 2px solid hsl(var(--brand-red));
  outline-offset: 3px;
}
```

---

## Recent Changes (Feb 2026)

1. **Fixed** progress bar tracking in `ArticleDetail.tsx`
2. **Added** `sm:` breakpoints to all grids for tablet
3. **Created** shared UI components (`ArticleCard`, `Badge`, `SectionHeader`)
4. **Added** SEO meta tags with Open Graph/Twitter Cards
5. **Enhanced** focus states and accessibility
6. **Added** button component classes (`.btn`, `.btn-primary`, `.btn-secondary`)

---

## Future Improvements

- [ ] Migrate components to use shared UI primitives
- [ ] Add sitemap.xml generation
- [ ] Implement search functionality
- [ ] Add analytics integration
- [ ] Consider image optimization (lazy loading, WebP)
