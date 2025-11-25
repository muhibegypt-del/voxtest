/*
  # Security Improvements
  
  This migration addresses security issues identified in the database audit.
  
  1. Remove Unused Index
    - Drop `idx_articles_author_id` index on articles table
    - This index is not being used by any queries in the application
    - Reduces storage overhead and maintenance cost
    - The foreign key constraint doesn't require a separate index for our use case
  
  2. Enable Leaked Password Protection
    - Enable HaveIBeenPwned password protection in Supabase Auth
    - Prevents users from using compromised passwords
    - Enhances overall account security
    - Checks passwords against known breached password databases
  
  Note: The leaked password protection is enabled at the project configuration level
  via Supabase Auth settings, not via SQL migration. This must be enabled in the
  Supabase Dashboard under Authentication > Providers > Email > Password Protection.
*/

-- Remove unused index on author_id
DROP INDEX IF EXISTS idx_articles_author_id;

-- Note: Leaked password protection must be enabled in Supabase Dashboard:
-- 1. Go to Authentication > Providers
-- 2. Click on Email provider settings
-- 3. Enable "Check for compromised passwords" under Password Protection
-- 4. This will automatically check passwords against HaveIBeenPwned.org

-- We cannot enable this via SQL as it's a project-level Auth configuration
-- However, we'll document it here for reference and compliance