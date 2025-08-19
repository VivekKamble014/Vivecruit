# Complete Interview Creation Flow Check

## 🔍 Pre-Flight Checklist

### 1. Database Setup ✅
- [ ] Run `database-updates.sql` in Supabase SQL Editor
- [ ] Run `update-existing-users.sql` to update existing users
- [ ] Verify all columns exist in Users table:
  - `plan` (VARCHAR, default 'Free')
  - `interviews_created` (INTEGER, default 0)
  - `interviews_limit` (INTEGER, default 1)
  - `plan_updated_at` (TIMESTAMP)
  - `payment_id` (VARCHAR)
  - `order_id` (VARCHAR)

### 2. Environment Variables ✅
- [ ] `OPENROUTER_API_KET` is set
- [ ] Supabase URL and keys are configured
- [ ] All other required env vars are set

### 3. Code Fixes Applied ✅
- [ ] Provider creates users with billing columns
- [ ] QuestionList handles user plan checking properly
- [ ] Error handling is improved

## 🚀 Complete Flow Test

### Step 1: User Authentication
1. User logs in via Google OAuth
2. Provider creates/updates user in Users table
3. User data includes billing columns

### Step 2: Create Interview Form
1. User fills job position
2. User fills job description
3. User selects duration
4. User selects interview type(s)
5. Form validation passes

### Step 3: AI Question Generation
1. API call to `/api/ai-model`
2. OpenAI generates questions
3. JSON parsing handles response format
4. Questions displayed to user

### Step 4: User Plan Validation
1. Check user's current plan
2. Check interviews_created count
3. Check interviews_limit
4. Allow/deny based on plan limits

### Step 5: Save Interview
1. Insert interview into database
2. Update user's interviews_created count
3. Generate interview link
4. Show success message

## 🐛 Common Issues & Fixes

### Issue 1: "Error checking user plan"
**Cause**: Missing billing columns in Users table
**Fix**: Run database migration scripts

### Issue 2: "User not found in Users table"
**Cause**: User exists in auth but not in Users table
**Fix**: Provider now creates users with billing columns

### Issue 3: "JSON parsing error"
**Cause**: AI response format issues
**Fix**: Improved JSON parsing in QuestionList

### Issue 4: "Rate limit exceeded"
**Cause**: Too many API calls
**Fix**: Better error handling and retry logic

## 🔧 Manual Testing Steps

1. **Clear browser data** and log in fresh
2. **Create a new interview** with all required fields
3. **Check console logs** for any errors
4. **Verify database** - check Users and interviews tables
5. **Test plan limits** - try creating multiple interviews

## 📊 Database Verification Queries

```sql
-- Check Users table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Users' 
ORDER BY ordinal_position;

-- Check existing users
SELECT email, plan, interviews_created, interviews_limit
FROM Users
ORDER BY created_at DESC;

-- Check interviews table
SELECT COUNT(*) as total_interviews, 
       COUNT(DISTINCT userEmail) as unique_users
FROM interviews;
```

## 🎯 Expected Behavior

1. **New users**: Automatically get 'Free' plan with 1 interview limit
2. **Existing users**: Updated with default billing values
3. **Interview creation**: Works for users within their plan limits
4. **Plan limits**: Properly enforced with clear error messages
5. **Database consistency**: All operations maintain data integrity

## 🚨 Troubleshooting

If issues persist:
1. Check browser console for errors
2. Check Supabase logs
3. Verify environment variables
4. Test with a fresh user account
5. Check database permissions and RLS policies
