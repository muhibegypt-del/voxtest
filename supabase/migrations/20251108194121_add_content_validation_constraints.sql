/*
  # Add Content Validation Constraints
  
  This migration adds validation rules to ensure article content never breaks the frontend layout.
  
  1. Content Length Constraints
    - Title: minimum 1 character, maximum 150 characters
    - Body: minimum 100 characters (ensures quality content)
    - Category: must be one of predefined values
  
  2. URL Format Validation
    - Image URLs must start with 'http://' or 'https://'
    - Allows NULL values for optional images
  
  3. Data Integrity
    - Prevents excessively long titles that break layout
    - Ensures minimum content quality standards
    - Validates category values match frontend expectations
  
  These constraints work alongside frontend validation to provide defense-in-depth.
*/

-- Add CHECK constraint for title length (1-150 characters)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'articles_title_length_check'
  ) THEN
    ALTER TABLE articles 
    ADD CONSTRAINT articles_title_length_check 
    CHECK (char_length(title) >= 1 AND char_length(title) <= 150);
  END IF;
END $$;

-- Add CHECK constraint for body length (minimum 100 characters)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'articles_body_length_check'
  ) THEN
    ALTER TABLE articles 
    ADD CONSTRAINT articles_body_length_check 
    CHECK (char_length(body) >= 100);
  END IF;
END $$;

-- Add CHECK constraint for category values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'articles_category_check'
  ) THEN
    ALTER TABLE articles 
    ADD CONSTRAINT articles_category_check 
    CHECK (category IN ('News', 'Politics', 'Technology', 'Business', 'Sports', 'Entertainment'));
  END IF;
END $$;

-- Add CHECK constraint for image URL format
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'articles_image_url_format_check'
  ) THEN
    ALTER TABLE articles 
    ADD CONSTRAINT articles_image_url_format_check 
    CHECK (
      image_url IS NULL OR 
      image_url ~ '^https?://'
    );
  END IF;
END $$;