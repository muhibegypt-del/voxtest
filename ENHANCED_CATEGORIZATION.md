# Enhanced Categorization System - Documentation

## Overview

The CMS has been enhanced with a comprehensive categorization system inspired by Middle East Eye, providing multiple dimensions for organizing and filtering content.

## New Features Added

### 1. Author Name Field

**Purpose:** Display writer bylines on articles instead of generic "Staff Writer"

**Implementation:**
- New `author_name` field in articles table (defaults to "Staff Writer")
- Required field in article editor
- Displayed prominently on article detail pages
- Shows in admin dashboard when different from default

**Usage:**
- When creating/editing an article, enter the writer's name in the "Author Name" field
- The name appears below the article title on published articles
- Example: "By John Smith" instead of "By Staff Writer"

---

### 2. Content Types

**Purpose:** Categorize articles by format/style (like Middle East Eye's content types)

**Available Types:**
- **News** - Breaking news and current events
- **Opinion** - Editorial pieces and commentary
- **Analysis** - In-depth analysis and expert insights
- **Explainer** - Detailed explainers of complex topics
- **Video** - Video content and interviews
- **Live** - Live coverage and updates
- **Feature** - Long-form feature stories

**Benefits:**
- Helps readers identify article format at a glance
- Enables filtering by content type
- Allows different editorial processes per type
- Better analytics on which formats perform best

**Display:**
- Blue badge next to category on article pages
- Visible in admin dashboard
- Can be used for filtering and searching

---

### 3. Subcategories

**Purpose:** Add an additional layer of organization within main categories

**Examples by Category:**

**Politics:**
- International Relations
- Domestic Policy
- Elections

**Technology:**
- Cybersecurity
- AI & Machine Learning
- Social Media

**Business:**
- Markets
- Economy
- Corporate

**Sports:**
- Football
- Olympics
- Basketball

**Entertainment:**
- Film & TV
- Music
- Celebrity

**News:**
- Investigations
- Breaking
- Human Interest

**How It Works:**
- Subcategories are dynamically loaded based on selected main category
- Optional field - can be left empty
- Enables more precise content organization
- Example: "Politics" → "International Relations"

---

### 4. Geographic Regions

**Purpose:** Tag articles with specific countries/regions (Middle East Eye style)

**Available Regions:**

**Middle East (30+ countries):**
- Palestine, Israel, Lebanon, Syria, Iraq, Jordan
- Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman, Yemen
- Iran, Turkey

**North Africa:**
- Egypt, Libya, Tunisia, Algeria, Morocco, Sudan

**Other Key Regions:**
- Afghanistan, Pakistan, India, China, Russia
- United States, United Kingdom
- Global (for international coverage)

**Benefits:**
- Location-based filtering and navigation
- Better geographic coverage insights
- Enables region-specific news sections
- Analytics on which regions get most coverage

**Display:**
- Green badge with 📍 icon on article pages
- Optional field - use "Global" or leave empty for non-regional content

---

## Database Schema

### New Tables Created

#### `content_types`
```sql
- id (uuid)
- name (text) - e.g., "Opinion"
- slug (text) - e.g., "opinion"
- description (text)
- icon (text) - emoji or icon identifier
- color (text) - for UI theming
```

#### `subcategories`
```sql
- id (uuid)
- name (text) - e.g., "International Relations"
- slug (text) - e.g., "international-relations"
- parent_category (text) - e.g., "Politics"
- description (text)
```

#### `regions`
```sql
- id (uuid)
- name (text) - e.g., "Palestine"
- slug (text) - e.g., "palestine"
- continent (text) - e.g., "Middle East"
- description (text)
```

### Updated Articles Table

New columns added:
- `author_name` (text) - Writer's display name
- `content_type` (text) - Article format type
- `subcategory` (text) - Optional subcategory slug
- `region` (text) - Optional region slug

All new columns have appropriate indexes for fast filtering.

---

## Using the Enhanced CMS

### Creating an Article

1. **Basic Information:**
   - Enter title (auto-generates slug)
   - Select main **Category** (News, Politics, etc.)
   - Choose **Subcategory** (automatically filtered by main category)

2. **Content Classification:**
   - Select **Content Type** (News, Opinion, Analysis, etc.)
   - Choose **Geographic Region** (optional)
   - Enter **Author Name** (defaults to "Staff Writer")

3. **Content Creation:**
   - Add featured image URL
   - Write excerpt summary
   - Create content using rich text editor
   - Add tags for topics

4. **SEO & Settings:**
   - Optimize meta tags
   - Set featured status
   - Schedule publication

### Filtering Articles

**Admin Dashboard Features:**
- Search by title, content, or author
- Filter by category
- Filter by published/draft status
- Bulk operations on selected articles

**Future Filtering Enhancements:**
- Filter by content type
- Filter by region
- Filter by subcategory
- Multi-filter combinations

---

## Front-End Display

### Article Detail Pages

Articles now display:
- **Category badge** (red) - Main category
- **Content Type badge** (blue) - Article format
- **Region badge** (green with 📍) - Geographic location
- **Author name** - In byline with User icon
- **View count** - Number of views
- **Tags** - At bottom of article

### Admin Dashboard

The articles table shows:
- Article title and slug
- Category with subcategory
- Content type (if not "News")
- Author name (if not "Staff Writer")
- Published status
- View count
- Created date

---

## Benefits of New System

### For Content Creators

1. **Better Organization:** Multi-dimensional categorization for precise content classification
2. **Clearer Attribution:** Author bylines improve accountability and recognition
3. **Format Flexibility:** Different content types for various article formats
4. **Geographic Focus:** Easy to identify and filter region-specific content

### For Readers

1. **Improved Navigation:** Find content by category, type, and region
2. **Clear Context:** Badges immediately show article type and location
3. **Author Recognition:** Know who wrote each article
4. **Better Discovery:** Multiple filtering dimensions help find relevant content

### For Administrators

1. **Rich Analytics:** Track performance by category, type, region, and author
2. **Content Balance:** Ensure diverse coverage across regions and types
3. **Editorial Planning:** Identify gaps in coverage
4. **Team Management:** Track author contributions

---

## Middle East Eye Inspiration

This implementation draws from Middle East Eye's successful approach:

### Similar Features Implemented

1. **Content Types:** News, Opinion, Video, Explainers (like MEE's sections)
2. **Geographic Focus:** Extensive country-specific tagging
3. **Multiple Formats:** Support for different article types
4. **Editorial Structure:** Clear categorization for complex topics

### Unique Adaptations

1. **Subcategories:** Additional organization layer not in MEE
2. **Tag System:** Flexible topic tagging alongside categories
3. **Featured Articles:** Priority system for homepage placement
4. **Scheduled Publishing:** Time-based publication automation

---

## Future Enhancements

### Potential Additions

1. **Content Type Icons:** Visual icons for each type (📰 News, 💭 Opinion, etc.)
2. **Region Map View:** Geographic visualization of article coverage
3. **Author Profiles:** Full author pages with bio and articles
4. **Trending by Region:** Most viewed articles per region
5. **Content Type Analytics:** Performance metrics per format
6. **Advanced Filtering:** Combine multiple filters in admin dashboard
7. **Region-Specific Sections:** Auto-generated region landing pages
8. **Subcategory Pages:** Dedicated pages for each subcategory

---

## API Usage

### Fetching Subcategories

```typescript
import { fetchSubcategories } from './lib/cms-utils';

const subs = await fetchSubcategories('Politics');
// Returns: [{ name: 'International Relations', slug: 'international-relations', ... }]
```

### Fetching Regions

```typescript
import { fetchAllRegions } from './lib/cms-utils';

const regions = await fetchAllRegions();
// Returns: [{ name: 'Palestine', slug: 'palestine', continent: 'Middle East', ... }]
```

### Querying Articles by New Fields

```typescript
// By content type
const { data } = await supabase
  .from('articles')
  .select('*')
  .eq('content_type', 'Opinion')
  .eq('published', true);

// By region
const { data } = await supabase
  .from('articles')
  .select('*')
  .eq('region', 'palestine')
  .eq('published', true);

// By author
const { data } = await supabase
  .from('articles')
  .select('*')
  .eq('author_name', 'John Smith')
  .eq('published', true);
```

---

## Database Migrations

All changes are in migration file:
`supabase/migrations/[timestamp]_add_author_name_and_enhanced_categories.sql`

The migration:
- Adds new columns to articles table
- Creates three new tables (content_types, subcategories, regions)
- Inserts default data for all types, subcategories, and regions
- Sets up Row Level Security policies
- Creates performance indexes

**Migration is idempotent** - safe to run multiple times.

---

## Maintenance

### Adding New Subcategories

```sql
INSERT INTO subcategories (name, slug, parent_category, description)
VALUES ('New Subcategory', 'new-subcategory', 'ParentCategory', 'Description');
```

### Adding New Regions

```sql
INSERT INTO regions (name, slug, continent, description)
VALUES ('Country Name', 'country-name', 'Continent', 'Full country name');
```

### Adding New Content Types

```sql
INSERT INTO content_types (name, slug, description, icon, color)
VALUES ('Podcast', 'podcast', 'Audio podcast episodes', '🎙️', 'purple');
```

---

## Summary

The enhanced categorization system transforms the CMS into a powerful content management platform with:

- ✅ **7 content types** for different article formats
- ✅ **18 subcategories** for refined organization
- ✅ **30+ geographic regions** for location-based tagging
- ✅ **Author attribution** with custom bylines
- ✅ **Multi-dimensional filtering** for precise content discovery
- ✅ **Middle East Eye-inspired** structure for complex news coverage

This system provides the foundation for building sophisticated content strategies, enabling better organization, discovery, and analytics across all dimensions of your news content.
