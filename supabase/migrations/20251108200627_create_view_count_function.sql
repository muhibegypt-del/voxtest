/*
  # Create View Count Increment Function

  ## Overview
  This migration creates a database function to safely increment article view counts.
  This is more efficient than updating from the client and prevents race conditions.

  ## New Functions
  - `increment_view_count` - Increments the view_count for a given article
*/

-- Function to safely increment view count
CREATE OR REPLACE FUNCTION increment_view_count(article_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO anon, authenticated;
