-- Setup Cron Jobs for Automated Tasks (OPTIONAL)
-- Requires pg_cron extension (Supabase Pro or self-hosted PostgreSQL)
-- Run after 04_create_functions.sql

-- NOTE: On Supabase Free tier, you'll need to handle these with external cron jobs or backend schedulers.
-- This file is for reference when you upgrade to Pro or use self-hosted PostgreSQL.

-- ============================================================================
-- CHECK IF PG_CRON IS AVAILABLE
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    RAISE NOTICE 'pg_cron extension not available. Skipping cron setup.';
    RAISE NOTICE 'On Supabase Free tier, use external cron or backend scheduler instead.';
    RAISE NOTICE 'Alternative: Use BullMQ repeated jobs in your Node.js backend.';
  ELSE
    RAISE NOTICE 'pg_cron extension found. Setting up scheduled jobs...';
  END IF;
END $$;

-- ============================================================================
-- 1. CLEANUP EXPIRED ARTICLES (Daily at 2 AM)
-- ============================================================================

-- Uncomment if pg_cron is available
/*
SELECT cron.schedule(
  'cleanup-expired-articles',
  '0 2 * * *',  -- Daily at 2:00 AM
  $$SELECT cleanup_expired_articles()$$
);

COMMENT ON EXTENSION pg_cron IS 'Cron job: cleanup-expired-articles runs daily at 2 AM';
*/

-- ============================================================================
-- 2. CLEANUP EXPIRED JOBS (Daily at 3 AM)
-- ============================================================================

-- Uncomment if pg_cron is available
/*
SELECT cron.schedule(
  'cleanup-expired-jobs',
  '0 3 * * *',  -- Daily at 3:00 AM
  $$SELECT cleanup_expired_jobs()$$
);

COMMENT ON EXTENSION pg_cron IS 'Cron job: cleanup-expired-jobs runs daily at 3 AM';
*/

-- ============================================================================
-- 3. RESET MONTHLY USAGE (First day of month at midnight)
-- ============================================================================

-- Uncomment if pg_cron is available
/*
SELECT cron.schedule(
  'reset-monthly-usage',
  '0 0 1 * *',  -- First day of month at midnight
  $$SELECT reset_monthly_usage()$$
);

COMMENT ON EXTENSION pg_cron IS 'Cron job: reset-monthly-usage runs on 1st of each month';
*/

-- ============================================================================
-- ALTERNATIVE: USE BACKEND SCHEDULER (RECOMMENDED FOR SUPABASE FREE)
-- ============================================================================

/*
Instead of pg_cron, you can use:

1. **BullMQ Repeated Jobs** (Recommended):
   ```typescript
   // In your Node.js backend
   import { Queue } from 'bullmq';

   const cleanupQueue = new Queue('cleanup');

   // Schedule cleanup to run daily at 2 AM
   await cleanupQueue.add(
     'cleanup-articles',
     {},
     {
       repeat: {
         pattern: '0 2 * * *',
         tz: 'America/New_York'
       }
     }
   );
   ```

2. **node-cron** (Simple alternative):
   ```typescript
   import cron from 'node-cron';
   import { supabase } from './supabase';

   // Run daily at 2 AM
   cron.schedule('0 2 * * *', async () => {
     const { data, error } = await supabase.rpc('cleanup_expired_articles');
     console.log(`Cleaned up ${data} articles`);
   });
   ```

3. **External Cron** (Most reliable):
   - Setup cron job on your server/VPS
   - Call backend API endpoint: POST /api/cron/cleanup
   - Add authentication token to secure the endpoint
*/

-- ============================================================================
-- VIEW SCHEDULED JOBS (if pg_cron is available)
-- ============================================================================

-- Uncomment to view all scheduled jobs
/*
SELECT * FROM cron.job ORDER BY jobname;
*/

-- ============================================================================
-- UNSCHEDULE JOBS (if needed)
-- ============================================================================

-- Uncomment to remove a job
/*
SELECT cron.unschedule('cleanup-expired-articles');
SELECT cron.unschedule('cleanup-expired-jobs');
SELECT cron.unschedule('reset-monthly-usage');
*/

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '=================================================================';
  RAISE NOTICE 'Cron setup information:';
  RAISE NOTICE '';
  RAISE NOTICE 'If pg_cron is NOT available (Supabase Free):';
  RAISE NOTICE '  - Use BullMQ repeated jobs in your Node.js backend';
  RAISE NOTICE '  - Or use node-cron library';
  RAISE NOTICE '  - Or setup external cron jobs';
  RAISE NOTICE '';
  RAISE NOTICE 'If pg_cron IS available (Supabase Pro):';
  RAISE NOTICE '  - Uncomment the cron.schedule() calls in this file';
  RAISE NOTICE '  - Re-run this migration';
  RAISE NOTICE '';
  RAISE NOTICE 'Database setup is complete!';
  RAISE NOTICE '=================================================================';
END $$;
