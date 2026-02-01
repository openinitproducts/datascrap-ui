-- Row Level Security (RLS) Policies for DataScrap
-- Run after 01_create_tables.sql

-- ============================================================================
-- 1. PROFILES TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 2. SOURCES TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sources"
  ON sources FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sources"
  ON sources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sources"
  ON sources FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sources"
  ON sources FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. ARTICLES TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own articles"
  ON articles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own articles"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: Updates and deletes handled by system/backend only

-- ============================================================================
-- 4. DIGESTS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE digests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own digests"
  ON digests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own digests"
  ON digests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own digests"
  ON digests FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. DIGEST_ARTICLES TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE digest_articles ENABLE ROW LEVEL SECURITY;

-- Users can view articles in their own digests
CREATE POLICY "Users can view articles in own digests"
  ON digest_articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM digests
      WHERE digests.id = digest_articles.digest_id
      AND digests.user_id = auth.uid()
    )
  );

-- System can insert (backend handles this)
CREATE POLICY "System can insert digest articles"
  ON digest_articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM digests
      WHERE digests.id = digest_articles.digest_id
      AND digests.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. DELIVERY_SETTINGS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own delivery settings"
  ON delivery_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own delivery settings"
  ON delivery_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own delivery settings"
  ON delivery_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 7. DELIVERY_LOGS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own delivery logs"
  ON delivery_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Note: Inserts handled by backend (service role)

-- ============================================================================
-- 8. JOBS TABLE - RLS POLICIES
-- ============================================================================

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = user_id);

-- Note: Job creation and updates handled by backend (service role)

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'Row Level Security policies created successfully!';
  RAISE NOTICE 'All tables are now protected with user-level data isolation.';
  RAISE NOTICE 'Next: Run 03_create_indexes.sql for performance optimization';
END $$;
