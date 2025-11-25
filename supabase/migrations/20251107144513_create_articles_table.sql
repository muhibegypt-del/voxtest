/*
  # Create Articles Table and Authentication

  1. New Tables
    - `articles`
      - `id` (uuid, primary key) - Unique identifier for each article
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly version of title
      - `body` (text) - Article content
      - `image_url` (text) - URL to article cover image
      - `category` (text) - Article category
      - `published` (boolean, default false) - Publication status
      - `created_at` (timestamptz) - Article creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `author_id` (uuid, foreign key) - References auth.users

  2. Security
    - Enable RLS on `articles` table
    - Public users can SELECT only published articles
    - Authenticated admin can perform all operations (INSERT, UPDATE, DELETE, SELECT)
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text NOT NULL,
  image_url text,
  category text NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id uuid REFERENCES auth.users(id)
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public users can read published articles
CREATE POLICY "Public can view published articles"
  ON articles
  FOR SELECT
  TO anon
  USING (published = true);

-- Authenticated users can view all articles
CREATE POLICY "Authenticated users can view all articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert articles
CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authenticated users can update articles
CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Authenticated users can delete articles
CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Create index on published status
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);

-- Create index on category
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on article updates
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();