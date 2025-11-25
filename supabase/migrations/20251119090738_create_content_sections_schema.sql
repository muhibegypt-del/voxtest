/*
  # Enhanced CMS with Content Sections

  ## Overview
  This migration creates a flexible, section-based CMS that mirrors the website structure.
  Each section (Analysis, Voices, Media, Store, etc.) becomes a content type with minimal
  required fields and optional advanced fields.

  ## New Tables

  ### 1. content_sections
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Section name (Analysis, Voices, Media, etc.)
  - `slug` (text, unique) - URL-friendly slug
  - `icon` (text) - Icon identifier for UI
  - `description` (text) - Section description
  - `sort_order` (integer) - Display order
  - `enabled` (boolean) - Whether section is active
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. content_items
  - `id` (uuid, primary key) - Unique identifier
  - `section_id` (uuid, foreign key) - References content_sections
  - `title` (text) - Content title
  - `slug` (text, unique) - URL-friendly slug
  - `body` (text) - Main content
  - `excerpt` (text) - Short summary
  - `author_id` (uuid, foreign key) - References auth.users
  - `author_name` (text) - Display name
  - `status` (text) - draft, published, archived
  - `featured_image` (text) - Main image URL
  - `images` (jsonb) - Additional images array
  - `metadata` (jsonb) - Flexible field for section-specific data
  - `tags` (text[]) - Content tags
  - `published_at` (timestamptz) - Publication date
  - `scheduled_at` (timestamptz) - Scheduled publication
  - `view_count` (integer) - View counter
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. quick_drafts
  - `id` (uuid, primary key) - Unique identifier
  - `section_id` (uuid, foreign key) - References content_sections
  - `title` (text) - Quick draft title
  - `created_by` (uuid, foreign key) - References auth.users
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all new tables
  - Authenticated users can manage content
  - Public can view published content

  ## Indexes
  - Optimize for section-based queries
  - Fast filtering by status and tags
*/

-- Create content_sections table
CREATE TABLE IF NOT EXISTS content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  description text,
  sort_order integer DEFAULT 0,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create content_items table
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES content_sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES auth.users(id),
  author_name text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured_image text,
  images jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  scheduled_at timestamptz,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quick_drafts table
CREATE TABLE IF NOT EXISTS quick_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES content_sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Insert default content sections
INSERT INTO content_sections (name, slug, icon, description, sort_order) VALUES
  ('Analysis', 'analysis', 'BarChart3', 'In-depth analysis and commentary', 1),
  ('Voices', 'voices', 'Users', 'Opinion pieces and perspectives', 2),
  ('Media', 'media', 'Image', 'Photos, videos, and multimedia', 3),
  ('The Store', 'store', 'ShoppingBag', 'Products and merchandise', 4),
  ('Foundations', 'foundations', 'BookOpen', 'Educational resources and foundations', 5),
  ('The Archive', 'archive', 'Archive', 'Historical content and archives', 6),
  ('Bookshelf', 'bookshelf', 'Book', 'Book reviews and recommendations', 7)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_sections
CREATE POLICY "Public can view enabled sections"
  ON content_sections FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

CREATE POLICY "Authenticated users can manage sections"
  ON content_sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for content_items
CREATE POLICY "Public can view published content"
  ON content_items FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published' AND 
    (published_at IS NULL OR published_at <= now())
  );

CREATE POLICY "Authenticated users can view all content"
  ON content_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create content"
  ON content_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authenticated users can update their content"
  ON content_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authenticated users can delete their content"
  ON content_items FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for quick_drafts
CREATE POLICY "Users can view their drafts"
  ON quick_drafts FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create drafts"
  ON quick_drafts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their drafts"
  ON quick_drafts FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_sections_slug ON content_sections(slug);
CREATE INDEX IF NOT EXISTS idx_content_sections_enabled ON content_sections(enabled);
CREATE INDEX IF NOT EXISTS idx_content_sections_sort ON content_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_content_items_section ON content_items(section_id);
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_author ON content_items(author_id);
CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(published_at);
CREATE INDEX IF NOT EXISTS idx_content_items_scheduled ON content_items(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON content_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_items_metadata ON content_items USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_quick_drafts_section ON quick_drafts(section_id);
CREATE INDEX IF NOT EXISTS idx_quick_drafts_user ON quick_drafts(created_by);

-- Function to update content_items timestamp
CREATE OR REPLACE FUNCTION update_content_items_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for content_items updates
DROP TRIGGER IF EXISTS update_content_items_trigger ON content_items;
CREATE TRIGGER update_content_items_trigger
  BEFORE UPDATE ON content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_content_items_timestamp();

-- Function to auto-publish scheduled content
CREATE OR REPLACE FUNCTION auto_publish_scheduled_content()
RETURNS void AS $$
BEGIN
  UPDATE content_items
  SET status = 'published', published_at = scheduled_at
  WHERE status = 'draft'
    AND scheduled_at IS NOT NULL
    AND scheduled_at <= now();
END;
$$ LANGUAGE plpgsql;
