# Supabase Database Setup Guide

This directory contains all SQL migrations needed to set up the PostgreSQL database for DataScrap Content Digest Generator.

## Overview

The database consists of **8 core tables**:
1. **profiles** - User profile and subscription data
2. **sources** - RSS feeds and website sources
3. **articles** - Fetched articles (auto-deleted after 7 days)
4. **digests** - Generated content digests
5. **digest_articles** - Many-to-many join table
6. **delivery_settings** - User delivery preferences and OAuth tokens
7. **delivery_logs** - Delivery tracking and retry logic
8. **jobs** - Background job queue metadata

## Prerequisites

- Supabase account (free tier is sufficient to start)
- Basic SQL knowledge (optional, scripts are ready to run)

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Fill in project details:
   - **Name:** `datascrap-prod` (or your preferred name)
   - **Database Password:** Generate a strong password (SAVE THIS!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine to start
4. Click **"Create new project"**
5. Wait 2-3 minutes for project initialization

### Step 2: Get Supabase Credentials

Once your project is ready:

1. Go to **Settings** > **API** in the Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - **Keep this secret!**

3. Update your `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Backend only, never expose to frontend
```

### Step 3: Run Database Migrations

You have two options to run the migrations:

#### Option A: Supabase Dashboard (Easiest)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the contents of each migration file **in order**:

   ```
   1. migrations/00_enable_extensions.sql
   2. migrations/01_create_tables.sql
   3. migrations/02_create_rls_policies.sql
   4. migrations/03_create_indexes.sql
   5. migrations/04_create_functions.sql
   6. migrations/05_setup_cron.sql (optional)
   ```

4. Click **"Run"** after pasting each file
5. Check for success messages (green checkmark)

#### Option B: Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run all migrations
supabase db push
```

### Step 4: Verify Database Setup

After running all migrations, verify the setup:

1. Go to **Table Editor** in Supabase dashboard
2. You should see all 8 tables listed
3. Click on `profiles` table - it should be empty (will populate on first user signup)
4. Go to **Database** > **Policies** - you should see RLS policies for each table

### Step 5: Enable Email Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Optionally enable **Google** OAuth:
   - You'll need Google Cloud OAuth credentials
   - See: [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

### Step 6: Test Database Connection

Test the connection from your Next.js app:

```typescript
// app/test-db/page.tsx
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function TestDB() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1)

  return (
    <div>
      <h1>Database Connection Test</h1>
      {error ? (
        <p>Error: {error.message}</p>
      ) : (
        <p>✅ Connection successful!</p>
      )}
    </div>
  )
}
```

## Migration Files Explained

### `00_enable_extensions.sql`
- Enables required PostgreSQL extensions
- **uuid-ossp**: UUID generation
- **pgcrypto**: Encryption for OAuth tokens

### `01_create_tables.sql`
- Creates all 8 core tables
- Defines column types and constraints
- Sets up foreign key relationships
- Includes helpful comments

### `02_create_rls_policies.sql`
- **Row Level Security (RLS)** policies
- Ensures users can only access their own data
- Critical for data privacy and security

### `03_create_indexes.sql`
- Performance optimization indexes
- Speeds up common queries
- Includes full-text search indexes

### `04_create_functions.sql`
- Helper functions and triggers
- Auto-update timestamps
- Auto-create profile on signup
- Token encryption/decryption
- Cleanup functions

### `05_setup_cron.sql` (Optional)
- Scheduled jobs for cleanup tasks
- **Note:** Requires Supabase Pro or self-hosted PostgreSQL
- On free tier, use BullMQ or backend scheduler instead

## Database Schema Diagram

```
auth.users (Supabase managed)
     │
     ├──1:1─── profiles (subscription, usage tracking)
     │
     ├──1:N─── sources (RSS feeds, websites)
     │             │
     │             └──1:N─── articles (auto-expire after 7 days)
     │                           │
     │                           └──N:N─── digest_articles ───┐
     │                                                         │
     ├──1:N─── digests (generated content) ──────────────────┘
     │             │
     │             └──1:N─── delivery_logs (tracking)
     │
     ├──1:1─── delivery_settings (preferences, OAuth tokens)
     │
     └──1:N─── jobs (background queue metadata)
```

## Security Best Practices

### 🔒 Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- View their own data
- Insert into their own records
- Update their own records
- Delete their own records

### 🔐 OAuth Token Encryption

OAuth tokens are encrypted using `pgcrypto`:

```sql
-- Encrypt before storing
INSERT INTO delivery_settings (notion_access_token)
VALUES (encrypt_token('secret_token', 'encryption_key'));

-- Decrypt when reading
SELECT decrypt_token(notion_access_token, 'encryption_key') FROM delivery_settings;
```

**Important:** Store the encryption key in environment variables, never in the database!

### 🚫 Never Expose Service Role Key

- The **service_role** key bypasses RLS
- Only use it in your **backend** (never in frontend code)
- Add to `.env` (not `.env.local` which might be committed)

## Maintenance Tasks

### Auto-Cleanup (Automated)

The following are handled automatically:

1. **Articles** - Auto-deleted after 7 days
2. **Jobs** - Auto-deleted after 7 days
3. **Monthly Usage Reset** - Resets on 1st of each month (if pg_cron enabled)

### Manual Cleanup (if needed)

```sql
-- Manually cleanup expired articles
SELECT cleanup_expired_articles();

-- Manually cleanup expired jobs
SELECT cleanup_expired_jobs();

-- Reset monthly usage counters
SELECT reset_monthly_usage();
```

## Troubleshooting

### Issue: "relation does not exist"

**Solution:** Run migrations in correct order. Start with `00_enable_extensions.sql`.

### Issue: "permission denied for table"

**Solution:** Check RLS policies. Make sure you're authenticated (`auth.uid()` returns your user ID).

### Issue: "function does not exist"

**Solution:** Run `04_create_functions.sql` to create helper functions.

### Issue: Can't insert into profiles table

**Solution:** The `handle_new_user()` trigger auto-creates profiles. Don't insert manually.

### Issue: pg_cron not available

**Solution:** On Supabase Free tier, use BullMQ or node-cron in your backend instead.

## Backup and Recovery

### Automatic Backups (Supabase Pro)

- Supabase Pro includes daily automatic backups
- Free tier does NOT include backups

### Manual Backup

```bash
# Using Supabase CLI
supabase db dump > backup.sql

# Restore
supabase db reset
psql -h YOUR_HOST -U postgres < backup.sql
```

## Scaling Considerations

### Connection Pooling

Supabase includes connection pooling by default (PgBouncer).

### Read Replicas (Enterprise)

For high-traffic apps, consider read replicas:
- Use primary for writes
- Use replicas for reads

### Indexes

All necessary indexes are created in `03_create_indexes.sql`. Monitor slow queries and add more as needed.

## Next Steps

After database setup is complete:

1. ✅ Test database connection from Next.js
2. ⬜ Setup Supabase Auth (email + Google OAuth)
3. ⬜ Create backend API endpoints
4. ⬜ Build frontend UI components
5. ⬜ Implement business logic

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Schema Reference](../datascrap-docs/database-schema.md)

## Support

If you encounter issues:

1. Check Supabase logs: **Database** > **Query Performance**
2. Review error messages in SQL Editor
3. Check RLS policies are correctly applied
4. Verify all migrations ran successfully

---

**Status:** Database migrations ready ✅
**Last Updated:** 2026-02-01
**Version:** 1.0
