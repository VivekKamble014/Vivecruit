-- Update existing users with billing columns
-- Run this after the main database-updates.sql migration

-- Update all existing users to have default billing values
UPDATE public.Users 
SET 
    plan = COALESCE(plan, 'Free'),
    interviews_created = COALESCE(interviews_created, 0),
    interviews_limit = COALESCE(interviews_limit, 1),
    plan_updated_at = COALESCE(plan_updated_at, NOW())
WHERE 
    plan IS NULL 
    OR interviews_created IS NULL 
    OR interviews_limit IS NULL 
    OR plan_updated_at IS NULL;

-- Verify the update
SELECT 
    email,
    plan,
    interviews_created,
    interviews_limit,
    plan_updated_at
FROM public.Users 
ORDER BY created_at DESC
LIMIT 10;

-- Check for any remaining NULL values
SELECT 
    COUNT(*) as users_with_null_plan,
    COUNT(*) FILTER (WHERE plan IS NULL) as null_plan,
    COUNT(*) FILTER (WHERE interviews_created IS NULL) as null_interviews_created,
    COUNT(*) FILTER (WHERE interviews_limit IS NULL) as null_interviews_limit
FROM public.Users;
