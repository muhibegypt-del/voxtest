/*
  # Add Author Name and Enhanced Categorization

  ## Overview
  This migration adds author name field and enhanced categorization inspired by Middle East Eye:
  - Author name for bylines
  - Content types (News, Opinion, Video, Explainer, Analysis)
  - Subcategories for better organization
  - Geographic regions for location-based filtering

  ## Changes to Articles Table
  - `author_name` (text) - Writer's display name for byline
  - `content_type` (text) - Article format type
  - `subcategory` (text) - Additional categorization layer
  - `region` (text) - Geographic region/country

  ## New Tables
  - `content_types` - Predefined content type options
  - `subcategories` - Category-specific subcategories
  - `regions` - Geographic regions for articles
*/

-- Add new columns to articles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'author_name'
  ) THEN
    ALTER TABLE articles ADD COLUMN author_name text DEFAULT 'Staff Writer';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE articles ADD COLUMN content_type text DEFAULT 'News';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE articles ADD COLUMN subcategory text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'region'
  ) THEN
    ALTER TABLE articles ADD COLUMN region text;
  END IF;
END $$;

-- Create content_types table
CREATE TABLE IF NOT EXISTS content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  parent_category text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(slug, parent_category)
);

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  continent text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_types
CREATE POLICY "Public can view content types"
  ON content_types FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage content types"
  ON content_types FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for subcategories
CREATE POLICY "Public can view subcategories"
  ON subcategories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage subcategories"
  ON subcategories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for regions
CREATE POLICY "Public can view regions"
  ON regions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage regions"
  ON regions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_content_type ON articles(content_type);
CREATE INDEX IF NOT EXISTS idx_articles_subcategory ON articles(subcategory);
CREATE INDEX IF NOT EXISTS idx_articles_region ON articles(region);
CREATE INDEX IF NOT EXISTS idx_articles_author_name ON articles(author_name);
CREATE INDEX IF NOT EXISTS idx_subcategories_parent ON subcategories(parent_category);
CREATE INDEX IF NOT EXISTS idx_regions_continent ON regions(continent);

-- Insert default content types (inspired by Middle East Eye)
INSERT INTO content_types (name, slug, description, icon, color) VALUES
  ('News', 'news', 'Breaking news and current events', '📰', 'blue'),
  ('Opinion', 'opinion', 'Editorial pieces and commentary', '💭', 'purple'),
  ('Analysis', 'analysis', 'In-depth analysis and expert insights', '🔍', 'green'),
  ('Explainer', 'explainer', 'Detailed explainers of complex topics', '📖', 'orange'),
  ('Video', 'video', 'Video content and interviews', '🎥', 'red'),
  ('Live', 'live', 'Live coverage and updates', '🔴', 'red'),
  ('Feature', 'feature', 'Long-form feature stories', '📝', 'indigo')
ON CONFLICT (slug) DO NOTHING;

-- Insert default subcategories for main categories
INSERT INTO subcategories (name, slug, parent_category, description) VALUES
  -- Politics subcategories
  ('International Relations', 'international-relations', 'Politics', 'Global diplomatic affairs'),
  ('Domestic Policy', 'domestic-policy', 'Politics', 'National political developments'),
  ('Elections', 'elections', 'Politics', 'Election coverage and analysis'),
  
  -- Technology subcategories
  ('Cybersecurity', 'cybersecurity', 'Technology', 'Digital security and privacy'),
  ('AI & Machine Learning', 'ai-machine-learning', 'Technology', 'Artificial intelligence developments'),
  ('Social Media', 'social-media', 'Technology', 'Social platform news'),
  
  -- Business subcategories
  ('Markets', 'markets', 'Business', 'Financial markets and trading'),
  ('Economy', 'economy', 'Business', 'Economic policy and indicators'),
  ('Corporate', 'corporate', 'Business', 'Corporate news and developments'),
  
  -- Sports subcategories
  ('Football', 'football', 'Sports', 'Football/soccer coverage'),
  ('Olympics', 'olympics', 'Sports', 'Olympic games and athletes'),
  ('Basketball', 'basketball', 'Sports', 'Basketball news'),
  
  -- Entertainment subcategories
  ('Film & TV', 'film-tv', 'Entertainment', 'Movies and television'),
  ('Music', 'music', 'Entertainment', 'Music industry news'),
  ('Celebrity', 'celebrity', 'Entertainment', 'Celebrity news and gossip'),
  
  -- News subcategories
  ('Investigations', 'investigations', 'News', 'Investigative journalism'),
  ('Breaking', 'breaking', 'News', 'Breaking news updates'),
  ('Human Interest', 'human-interest', 'News', 'Human interest stories')
ON CONFLICT (slug, parent_category) DO NOTHING;

-- Insert geographic regions (Middle East Eye style)
INSERT INTO regions (name, slug, continent, description) VALUES
  -- Middle East
  ('Palestine', 'palestine', 'Middle East', 'Palestinian Territories'),
  ('Israel', 'israel', 'Middle East', 'State of Israel'),
  ('Lebanon', 'lebanon', 'Middle East', 'Lebanese Republic'),
  ('Syria', 'syria', 'Middle East', 'Syrian Arab Republic'),
  ('Iraq', 'iraq', 'Middle East', 'Republic of Iraq'),
  ('Jordan', 'jordan', 'Middle East', 'Hashemite Kingdom of Jordan'),
  ('Saudi Arabia', 'saudi-arabia', 'Middle East', 'Kingdom of Saudi Arabia'),
  ('UAE', 'uae', 'Middle East', 'United Arab Emirates'),
  ('Qatar', 'qatar', 'Middle East', 'State of Qatar'),
  ('Kuwait', 'kuwait', 'Middle East', 'State of Kuwait'),
  ('Bahrain', 'bahrain', 'Middle East', 'Kingdom of Bahrain'),
  ('Oman', 'oman', 'Middle East', 'Sultanate of Oman'),
  ('Yemen', 'yemen', 'Middle East', 'Republic of Yemen'),
  ('Iran', 'iran', 'Middle East', 'Islamic Republic of Iran'),
  ('Turkey', 'turkey', 'Middle East', 'Republic of Turkey'),
  
  -- North Africa
  ('Egypt', 'egypt', 'North Africa', 'Arab Republic of Egypt'),
  ('Libya', 'libya', 'North Africa', 'State of Libya'),
  ('Tunisia', 'tunisia', 'North Africa', 'Republic of Tunisia'),
  ('Algeria', 'algeria', 'North Africa', 'People''s Democratic Republic of Algeria'),
  ('Morocco', 'morocco', 'North Africa', 'Kingdom of Morocco'),
  ('Sudan', 'sudan', 'North Africa', 'Republic of Sudan'),
  
  -- Other key regions
  ('Afghanistan', 'afghanistan', 'Central Asia', 'Islamic Emirate of Afghanistan'),
  ('Pakistan', 'pakistan', 'South Asia', 'Islamic Republic of Pakistan'),
  ('United States', 'united-states', 'North America', 'United States of America'),
  ('United Kingdom', 'united-kingdom', 'Europe', 'United Kingdom of Great Britain'),
  ('Russia', 'russia', 'Europe', 'Russian Federation'),
  ('China', 'china', 'East Asia', 'People''s Republic of China'),
  ('India', 'india', 'South Asia', 'Republic of India'),
  ('Global', 'global', 'Worldwide', 'International and global coverage')
ON CONFLICT (slug) DO NOTHING;

-- Add check constraints for valid values
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_content_type_check;
ALTER TABLE articles ADD CONSTRAINT articles_content_type_check 
  CHECK (content_type IN ('News', 'Opinion', 'Analysis', 'Explainer', 'Video', 'Live', 'Feature'));