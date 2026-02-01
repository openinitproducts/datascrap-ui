-- Database Indexes for Performance Optimization
-- Run after 02_create_rls_policies.sql

-- ============================================================================
-- 1. PROFILES TABLE - INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status) WHERE subscription_status IS NOT NULL;

-- ============================================================================
-- 2. SOURCES TABLE - INDEXES
-- ============================================================================

CREATE INDEX idx_sources_user_id ON sources(user_id);
CREATE INDEX idx_sources_status ON sources(user_id, status);
CREATE INDEX idx_sources_last_fetched ON sources(last_fetched_at) WHERE last_fetched_at IS NOT NULL;
CREATE INDEX idx_sources_type ON sources(type);
CREATE INDEX idx_sources_tags ON sources USING GIN(tags);  -- GIN index for array search

-- ============================================================================
-- 3. ARTICLES TABLE - INDEXES
-- ============================================================================

CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_user_id ON articles(user_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC NULLS LAST);
CREATE INDEX idx_articles_url_hash ON articles USING hash(url);  -- Faster duplicate checks
CREATE INDEX idx_articles_expires_at ON articles(expires_at);  -- For cleanup job
CREATE INDEX idx_articles_included_in_digest ON articles(user_id, included_in_digest) WHERE included_in_digest = FALSE;

-- Full-text search index
CREATE INDEX idx_articles_fts ON articles USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- ============================================================================
-- 4. DIGESTS TABLE - INDEXES
-- ============================================================================

CREATE INDEX idx_digests_user_id ON digests(user_id);
CREATE INDEX idx_digests_generated_at ON digests(generated_at DESC);
CREATE INDEX idx_digests_type ON digests(user_id, type);
CREATE INDEX idx_digests_date_range ON digests(date_range_start, date_range_end);

-- JSONB indexes for delivery tracking
CREATE INDEX idx_digests_delivery_status ON digests USING gin(delivery_status);

-- ============================================================================
-- 5. DIGEST_ARTICLES TABLE - INDEXES
-- ============================================================================

CREATE INDEX idx_digest_articles_digest_id ON digest_articles(digest_id);
CREATE INDEX idx_digest_articles_article_id ON digest_articles(article_id);
CREATE INDEX idx_digest_articles_position ON digest_articles(digest_id, position);

-- ============================================================================
-- 6. DELIVERY_SETTINGS TABLE - INDEXES
-- ============================================================================

CREATE INDEX idx_delivery_settings_user_id ON delivery_settings(user_id);
CREATE INDEX idx_delivery_settings_frequency ON delivery_settings(frequency);
CREATE INDEX idx_delivery_settings_schedule ON delivery_settings(delivery_time, delivery_day) WHERE frequency = 'weekly';

-- ============================================================================
-- 7. DELIVERY_LOGS TABLE - INDEXES
-- ============================================================================

CREATE INDEX idx_delivery_logs_digest_id ON delivery_logs(digest_id);
CREATE INDEX idx_delivery_logs_user_id ON delivery_logs(user_id);
CREATE INDEX idx_delivery_logs_status ON delivery_logs(status);
CREATE INDEX idx_delivery_logs_channel ON delivery_logs(channel, status);
CREATE INDEX idx_delivery_logs_next_retry ON delivery_logs(next_retry_at) WHERE status = 'retrying';
CREATE INDEX idx_delivery_logs_created_at ON delivery_logs(created_at DESC);

-- ============================================================================
-- 8. JOBS TABLE - INDEXES
-- ============================================================================

CREATE INDEX idx_jobs_user_id ON jobs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_type_status ON jobs(type, status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_expires_at ON jobs(expires_at);

-- Composite index for active jobs
CREATE INDEX idx_jobs_active ON jobs(status, started_at) WHERE status IN ('pending', 'active', 'retrying');

-- ============================================================================
-- ANALYZE TABLES FOR QUERY OPTIMIZER
-- ============================================================================

ANALYZE profiles;
ANALYZE sources;
ANALYZE articles;
ANALYZE digests;
ANALYZE digest_articles;
ANALYZE delivery_settings;
ANALYZE delivery_logs;
ANALYZE jobs;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'All performance indexes created successfully!';
  RAISE NOTICE 'Database is now optimized for queries.';
  RAISE NOTICE 'Next: Run 04_create_functions.sql for triggers and helper functions';
END $$;
