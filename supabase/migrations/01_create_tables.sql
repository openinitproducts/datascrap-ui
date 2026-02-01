-- Create all database tables for DataScrap Content Digest Generator
-- Run after 00_enable_extensions.sql

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- Extended user profile data (supplements auth.users)

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/New_York',

  -- Subscription & billing
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,

  -- API usage tracking
  api_tokens_used INTEGER DEFAULT 0,
  digests_generated INTEGER DEFAULT 0,
  monthly_reset_date DATE DEFAULT CURRENT_DATE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

COMMENT ON TABLE profiles IS 'Extended user profile data for DataScrap users';
COMMENT ON COLUMN profiles.subscription_tier IS 'User subscription level: free, pro, or enterprise';
COMMENT ON COLUMN profiles.api_tokens_used IS 'Total AI tokens consumed this month';

-- ============================================================================
-- 2. SOURCES TABLE
-- ============================================================================
-- Website/RSS feed sources added by users

CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Source details
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rss', 'html')),
  description TEXT,
  favicon_url TEXT,

  -- Configuration
  tags TEXT[] DEFAULT '{}',  -- Array of tags
  keywords TEXT[] DEFAULT '{}',  -- Optional keyword filters
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),

  -- Health tracking
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  consecutive_errors INTEGER DEFAULT 0,
  total_fetches INTEGER DEFAULT 0,
  total_articles_found INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, url)
);

COMMENT ON TABLE sources IS 'RSS feeds and HTML sources tracked by users';
COMMENT ON COLUMN sources.type IS 'Source type: rss for RSS feeds, html for web pages';
COMMENT ON COLUMN sources.status IS 'Health status: active, inactive, or error';

-- ============================================================================
-- 3. ARTICLES TABLE
-- ============================================================================
-- Fetched articles from sources (temporary storage with auto-cleanup after 7 days)

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- Denormalized for faster queries

  -- Article content
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  published_at TIMESTAMP WITH TIME ZONE,
  author TEXT,
  excerpt TEXT,  -- First 500 chars

  -- AI-generated summary
  summary JSONB,  -- Array of bullet points: ["bullet 1", "bullet 2", "bullet 3"]
  summarized_at TIMESTAMP WITH TIME ZONE,
  tokens_used INTEGER DEFAULT 0,

  -- Metadata
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  included_in_digest BOOLEAN DEFAULT FALSE,

  -- Auto-deletion after 7 days
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE articles IS 'Temporary storage for scraped articles (auto-deleted after 7 days)';
COMMENT ON COLUMN articles.summary IS 'AI-generated summary as JSON array of bullet points';
COMMENT ON COLUMN articles.expires_at IS 'Articles automatically deleted after this timestamp';

-- ============================================================================
-- 4. DIGESTS TABLE
-- ============================================================================
-- Generated digest metadata and content

CREATE TABLE digests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Digest metadata
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'manual')),
  date_range_start DATE,
  date_range_end DATE,

  -- Content (multiple formats)
  content JSONB NOT NULL,  -- { markdown: "...", html: "...", notionBlocks: [...] }

  -- Delivery tracking
  delivery_status JSONB DEFAULT '{"email": false, "notion": false, "gdocs": false}',
  delivery_details JSONB DEFAULT '{}',  -- Store delivery IDs, URLs, etc.

  -- Statistics
  article_count INTEGER DEFAULT 0,
  sources_processed INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  processing_time_ms INTEGER,  -- Milliseconds

  -- Timestamps
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE digests IS 'Generated content digests with delivery tracking';
COMMENT ON COLUMN digests.content IS 'Digest content in multiple formats (Markdown, HTML, Notion blocks)';
COMMENT ON COLUMN digests.delivery_status IS 'Delivery status for each channel (email, notion, gdocs)';

-- ============================================================================
-- 5. DIGEST_ARTICLES TABLE (Join Table)
-- ============================================================================
-- Many-to-many relationship between digests and articles

CREATE TABLE digest_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  digest_id UUID NOT NULL REFERENCES digests(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,  -- Order in digest
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(digest_id, article_id)
);

COMMENT ON TABLE digest_articles IS 'Junction table linking digests to articles with ordering';
COMMENT ON COLUMN digest_articles.position IS 'Display order of article within the digest';

-- ============================================================================
-- 6. DELIVERY_SETTINGS TABLE
-- ============================================================================
-- User delivery preferences and OAuth tokens

CREATE TABLE delivery_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Schedule
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'manual')),
  delivery_time TIME DEFAULT '08:00:00',  -- 8 AM
  delivery_day TEXT CHECK (delivery_day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),  -- For weekly
  timezone TEXT DEFAULT 'America/New_York',

  -- Email settings
  email_enabled BOOLEAN DEFAULT TRUE,
  email_address TEXT,
  email_subject_template TEXT DEFAULT '🔍 {title}',
  email_format TEXT DEFAULT 'html' CHECK (email_format IN ('html', 'markdown')),

  -- Notion settings
  notion_enabled BOOLEAN DEFAULT FALSE,
  notion_access_token TEXT,  -- Encrypted
  notion_workspace_id TEXT,
  notion_database_id TEXT,
  notion_template TEXT DEFAULT 'default',

  -- Google Docs settings
  gdocs_enabled BOOLEAN DEFAULT FALSE,
  gdocs_access_token TEXT,  -- Encrypted
  gdocs_refresh_token TEXT,  -- Encrypted
  gdocs_folder_id TEXT,

  -- Content preferences
  max_articles_per_digest INTEGER DEFAULT 20,
  min_articles_per_source INTEGER DEFAULT 1,
  include_sources UUID[] DEFAULT '{}',  -- Specific sources to include
  exclude_sources UUID[] DEFAULT '{}',  -- Sources to exclude

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

COMMENT ON TABLE delivery_settings IS 'User preferences for digest delivery and OAuth tokens';
COMMENT ON COLUMN delivery_settings.notion_access_token IS 'Encrypted OAuth token for Notion API';
COMMENT ON COLUMN delivery_settings.gdocs_access_token IS 'Encrypted OAuth token for Google Docs API';

-- ============================================================================
-- 7. DELIVERY_LOGS TABLE
-- ============================================================================
-- Track delivery attempts and results

CREATE TABLE delivery_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  digest_id UUID NOT NULL REFERENCES digests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Delivery details
  channel TEXT NOT NULL CHECK (channel IN ('email', 'notion', 'gdocs')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'retrying')),

  -- Result data
  external_id TEXT,  -- SendGrid message ID, Notion page ID, etc.
  external_url TEXT,  -- Notion page URL, Google Doc URL, etc.
  error_message TEXT,

  -- Retry tracking
  attempt_number INTEGER DEFAULT 1,
  max_attempts INTEGER DEFAULT 3,
  next_retry_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE delivery_logs IS 'Log of all digest delivery attempts and results';
COMMENT ON COLUMN delivery_logs.channel IS 'Delivery channel: email, notion, or gdocs';
COMMENT ON COLUMN delivery_logs.status IS 'Delivery status: pending, sent, failed, or retrying';

-- ============================================================================
-- 8. JOBS TABLE
-- ============================================================================
-- Track background jobs (BullMQ job metadata)

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Job details
  type TEXT NOT NULL,  -- 'digest:daily', 'digest:weekly', 'scrape:single', etc.
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'failed', 'retrying')),

  -- Job data (flexible JSON)
  data JSONB DEFAULT '{}',
  progress JSONB DEFAULT '{"current": 0, "total": 100, "message": ""}',
  result JSONB,
  error TEXT,

  -- Retry tracking
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,

  -- Auto-delete after 7 days
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

COMMENT ON TABLE jobs IS 'Background job queue metadata (BullMQ integration)';
COMMENT ON COLUMN jobs.type IS 'Job type identifier (e.g., digest:daily, scrape:single)';
COMMENT ON COLUMN jobs.progress IS 'Real-time job progress tracking';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'All tables created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Run 02_create_rls_policies.sql for Row Level Security';
  RAISE NOTICE '  2. Run 03_create_indexes.sql for performance optimization';
  RAISE NOTICE '  3. Run 04_create_functions.sql for triggers and helpers';
END $$;
