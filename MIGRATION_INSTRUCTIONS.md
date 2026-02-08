# Database Migration Instructions

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `mrqsiucmkonrfmikecxm`
3. Navigate to **SQL Editor** in the left sidebar

## Step 2: Run the Migration Script

1. Click **New Query** to create a new SQL query
2. Open the migration file: `supabase/migration.sql` in your project
3. Copy the **entire contents** of the migration script
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

## Step 3: Verify the Migration

After running the migration, verify it was successful:

```sql
-- Check if the trigger exists
SELECT tgname, tgtype, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check if the function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

You should see results for both queries, confirming the trigger and function were created.

## Step 4: Enable Email Verification in Supabase

1. In your Supabase Dashboard, go to **Authentication** → **Providers**
2. Click on **Email** provider
3. Scroll down to **Email Confirmation**
4. **Enable** the "Confirm email" toggle
5. Click **Save**

## Step 5: Test the Complete Flow

1. Go to your app's signup page: http://localhost:3000/signup
2. Create a new account with a real email address
3. Check your email for the verification link
4. Click the verification link
5. You should be redirected to the login page with a success message
6. Log in with your credentials
7. Verify you can access the dashboard

## Step 6: Verify Profile Creation

After signing up and verifying email, check that the profile was created:

```sql
-- View all profiles
SELECT id, email, name, role, created_at 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;
```

You should see your newly created profile with:
- `email`: Your email address
- `name`: The name you entered during signup
- `role`: Should be `'customer'`

## Troubleshooting

### Issue: Trigger not firing

If profiles aren't being created automatically:

1. Check if the trigger exists (Step 3)
2. Verify RLS policies allow insertion:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```
3. Check Supabase logs for errors: **Database** → **Logs**

### Issue: Email not sending

1. Verify email confirmation is enabled (Step 4)
2. Check Supabase email logs: **Authentication** → **Logs**
3. Note: Free tier has email rate limits (3 emails/hour by default)

### Issue: Verification link doesn't work

1. Ensure the callback route exists: `app/auth/callback/route.ts`
2. Check that middleware doesn't block `/auth/callback`
3. Verify the `emailRedirectTo` URL matches your app's domain

## Next Steps

Once the migration is complete and tested:
- All new user signups will automatically create profiles
- Users must verify their email before logging in
- Profiles will have the default role of `'customer'`
