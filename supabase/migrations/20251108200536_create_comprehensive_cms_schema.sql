/*
  # Comprehensive CMS Schema Enhancement

  ## Overview
  This migration creates a complete CMS infrastructure with support for:
  - Tags and multi-category support
  - Media library management
  - Article revisions and version history
  - Analytics and view tracking
  - User roles and permissions
  - SEO metadata
  - Article scheduling

  ## New Tables

  ### 1. tags
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Tag name
  - `slug` (text, unique) - URL-friendly slug
  - `usage_count` (integer) - Number of articles using this tag
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. article_tags
  - `article_id` (uuid, foreign key) - References articles
  - `tag_id` (uuid, foreign key) - References tags
  - Primary key: (article_id, tag_id)

  ### 3. media_library
  - `id` (uuid, primary key) - Unique identifier
  - `filename` (text) - Original filename
  - `storage_path` (text) - Path in storage
  - `file_size` (bigint) - File size in bytes
  - `mime_type` (text) - File MIME type
  - `width` (integer) - Image width in pixels
  - `height` (integer) - Image height in pixels
  - `alt_text` (text) - Alternative text for accessibility
  - `uploaded_by` (uuid, foreign key) - References auth.users
  - `created_at` (timestamptz) - Upload timestamp

  ### 4. article_revisions
  - `id` (uuid, primary key) - Unique identifier
  - `article_id` (uuid, foreign key) - References articles
  - `title` (text) - Article title at this revision
  - `body` (text) - Article body at this revision
  - `changed_by` (uuid, foreign key) - References auth.users
  - `change_summary` (text) - Description of changes
  - `created_at` (timestamptz) - Revision timestamp

  ### 5. article_views
  - `id` (uuid, primary key) - Unique identifier
  - `article_id` (uuid, foreign key) - References articles
  - `viewed_at` (timestamptz) - View timestamp
  - `user_agent` (text) - Browser user agent
  - `ip_address` (inet) - Visitor IP address

  ### 6. user_roles
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `role` (text) - Role name (admin, editor, contributor)
  - `granted_by` (uuid, foreign key) - References auth.users
  - `granted_at` (timestamptz) - When role was granted

  ### 7. author_profiles
  - `user_id` (uuid, primary key, foreign key) - References auth.users
  - `display_name` (text) - Public display name
  - `bio` (text) - Author biography
  - `avatar_url` (text) - Profile picture URL
  - `social_twitter` (text) - Twitter handle
  - `social_linkedin` (text) - LinkedIn URL
  - `updated_at` (timestamptz) - Last update timestamp

  ## Enhancements to Existing Tables

  ### articles table additions
  - `excerpt` (text) - Short summary for listings
  - `meta_title` (text) - SEO meta title
  - `meta_description` (text) - SEO meta description
  - `og_image_url` (text) - Open Graph image URL
  - `featured` (boolean) - Featured article flag
  - `featured_priority` (integer) - Order for featured articles
  - `scheduled_publish_at` (timestamptz) - Scheduled publication time
  - `view_count` (integer) - Cached view count
  - `tags` (text[]) - Array of tag slugs for quick filtering

  ## Security
  - Enable RLS on all new tables
  - Create appropriate policies for each table
  - Ensure data integrity with foreign key constraints

  ## Indexes
  - Add indexes for frequently queried fields
  - Optimize for search and filtering operations
*/

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create article_tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (article_id, tag_id)
);

-- Create media_library table
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text UNIQUE NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create article_revisions table
CREATE TABLE IF NOT EXISTS article_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  change_summary text,
  created_at timestamptz DEFAULT now()
);

-- Create article_views table
CREATE TABLE IF NOT EXISTS article_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  user_agent text,
  ip_address inet
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'editor', 'contributor')),
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create author_profiles table
CREATE TABLE IF NOT EXISTS author_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text,
  avatar_url text,
  social_twitter text,
  social_linkedin text,
  updated_at timestamptz DEFAULT now()
);

-- Add new columns to articles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE articles ADD COLUMN excerpt text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE articles ADD COLUMN meta_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE articles ADD COLUMN meta_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'og_image_url'
  ) THEN
    ALTER TABLE articles ADD COLUMN og_image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'featured'
  ) THEN
    ALTER TABLE articles ADD COLUMN featured boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'featured_priority'
  ) THEN
    ALTER TABLE articles ADD COLUMN featured_priority integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'scheduled_publish_at'
  ) THEN
    ALTER TABLE articles ADD COLUMN scheduled_publish_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE articles ADD COLUMN view_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'tags'
  ) THEN
    ALTER TABLE articles ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE author_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
CREATE POLICY "Public can view tags"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for article_tags
CREATE POLICY "Public can view article tags"
  ON article_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage article tags"
  ON article_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for media_library
CREATE POLICY "Public can view media"
  ON media_library FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can update their media"
  ON media_library FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can delete their media"
  ON media_library FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- RLS Policies for article_revisions
CREATE POLICY "Authenticated users can view revisions"
  ON article_revisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create revisions"
  ON article_revisions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = changed_by);

-- RLS Policies for article_views
CREATE POLICY "Anyone can record views"
  ON article_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics"
  ON article_views FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_roles
CREATE POLICY "Authenticated users can view roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for author_profiles
CREATE POLICY "Public can view author profiles"
  ON author_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON author_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their profile"
  ON author_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON media_library(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_article_revisions_article_id ON article_revisions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_revisions_created_at ON article_revisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON article_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured, featured_priority DESC);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_publish ON articles(scheduled_publish_at);
CREATE INDEX IF NOT EXISTS idx_articles_view_count ON articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update tag usage count
DROP TRIGGER IF EXISTS update_tag_usage_trigger ON article_tags;
CREATE TRIGGER update_tag_usage_trigger
  AFTER INSERT OR DELETE ON article_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_usage_count();

-- Function to create article revision on update
CREATE OR REPLACE FUNCTION create_article_revision()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.title != NEW.title OR OLD.body != NEW.body THEN
    INSERT INTO article_revisions (article_id, title, body, changed_by)
    VALUES (OLD.id, OLD.title, OLD.body, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create revisions
DROP TRIGGER IF EXISTS create_revision_trigger ON articles;
CREATE TRIGGER create_revision_trigger
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION create_article_revision();

-- Function to update author profile timestamp
CREATE OR REPLACE FUNCTION update_author_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for author profile updates
DROP TRIGGER IF EXISTS update_author_profile_trigger ON author_profiles;
CREATE TRIGGER update_author_profile_trigger
  BEFORE UPDATE ON author_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_author_profile_timestamp();