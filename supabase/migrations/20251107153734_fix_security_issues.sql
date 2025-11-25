/*
  # Fix Security and Performance Issues

  ## Changes Made:
  
  1. **Performance Optimization - Foreign Key Index**
     - Add index on `author_id` column to improve foreign key constraint performance
     - Speeds up JOIN operations and CASCADE operations
  
  2. **RLS Performance Optimization**
     - Replace `auth.uid()` with `(select auth.uid())` in all RLS policies
     - Prevents re-evaluation of auth function for each row
     - Significantly improves query performance at scale
     - Affects INSERT, UPDATE, and DELETE policies
  
  3. **Remove Unused Index**
     - Drop `idx_articles_slug` index as it's not being used
     - The UNIQUE constraint on slug already provides an index
     - Reduces storage overhead and maintenance cost
  
  4. **Function Security Hardening**
     - Set immutable search_path for `update_updated_at_column` function
     - Prevents search path manipulation attacks
     - Uses explicit schema qualification
*/

-- 1. Add index for foreign key on author_id
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);

-- 2. Drop and recreate RLS policies with optimized auth.uid() calls

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

-- Recreate policies with optimized auth function calls
CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = author_id)
  WITH CHECK ((select auth.uid()) = author_id);

CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = author_id);

-- 3. Remove unused slug index (UNIQUE constraint already provides index)
DROP INDEX IF EXISTS idx_articles_slug;

-- 4. Fix function search_path to be immutable
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = pg_catalog, public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;