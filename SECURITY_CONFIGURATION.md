# Security Configuration Guide

This document contains security configurations that must be applied manually through the Supabase Dashboard.

## Required Manual Configuration

### Enable Leaked Password Protection

**Status:** ⚠️ REQUIRES MANUAL ACTION

**Why:** Supabase Auth can check passwords against the HaveIBeenPwned database to prevent users from using compromised passwords. This significantly enhances account security.

**How to Enable:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `dwhxrtvvkpwkixhkwwot`
3. Navigate to: **Authentication** → **Providers**
4. Click on the **Email** provider
5. Scroll down to the **Password Protection** section
6. Enable the toggle for **"Check for compromised passwords"**
7. Save your changes

**What this does:**
- When users sign up or change their password, Supabase will check it against HaveIBeenPwned.org
- If the password has been found in a data breach, the user will be required to choose a different password
- This happens automatically without exposing the actual password to HaveIBeenPwned
- Uses k-anonymity model for privacy-preserving password checking

**Impact:**
- No performance impact on existing users
- Only affects password creation and password change operations
- Provides an additional layer of security against credential stuffing attacks

---

## Completed Security Improvements

✅ **Removed Unused Database Index** - The `idx_articles_author_id` index has been removed to reduce storage overhead and maintenance costs.

✅ **Content Validation Constraints** - Database-level constraints prevent articles with invalid content from being saved.

✅ **Row Level Security** - All tables have RLS enabled with proper policies.

✅ **Input Validation** - Frontend validation prevents malformed data from reaching the database.

---

## Security Best Practices Implemented

- ✅ SQL injection prevention through parameterized queries
- ✅ XSS protection through proper input sanitization
- ✅ CSRF protection via Supabase session management
- ✅ Rate limiting on authentication endpoints (Supabase default)
- ✅ Secure password hashing (SCRAM-SHA-256)
- ⚠️ Leaked password protection (requires manual enablement)

---

Last Updated: 2025-11-08
