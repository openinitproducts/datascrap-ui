-- Helper Functions and Triggers for DataScrap
-- Run after 03_create_indexes.sql

-- ============================================================================
-- 1. AUTO-UPDATE TIMESTAMP FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates updated_at timestamp on row update';

-- Apply triggers to tables with updated_at column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at
  BEFORE UPDATE ON sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_settings_updated_at
  BEFORE UPDATE ON delivery_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. CREATE PROFILE ON USER SIGNUP
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  -- Create default delivery settings
  INSERT INTO delivery_settings (user_id, email_address)
  VALUES (NEW.id, NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION handle_new_user() IS 'Creates profile and delivery settings when new user signs up';

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- 3. CLEANUP EXPIRED ARTICLES
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_articles()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM articles WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_expired_articles() IS 'Deletes articles older than 7 days (run via cron)';

-- ============================================================================
-- 4. CLEANUP EXPIRED JOBS
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_jobs()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM jobs WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_expired_jobs() IS 'Deletes jobs older than 7 days (run via cron)';

-- ============================================================================
-- 5. TOKEN ENCRYPTION FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION encrypt_token(token TEXT, encryption_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(token, encryption_key),
    'base64'
  );
END;
$$;

COMMENT ON FUNCTION encrypt_token(TEXT, TEXT) IS 'Encrypts OAuth tokens using AES encryption';

CREATE OR REPLACE FUNCTION decrypt_token(encrypted_token TEXT, encryption_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_token, 'base64'),
    encryption_key
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;  -- Return NULL if decryption fails
END;
$$;

COMMENT ON FUNCTION decrypt_token(TEXT, TEXT) IS 'Decrypts OAuth tokens using AES decryption';

-- ============================================================================
-- 6. INCREMENT USAGE COUNTERS
-- ============================================================================

CREATE OR REPLACE FUNCTION increment_profile_tokens(
  p_user_id UUID,
  p_tokens INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE profiles
  SET
    api_tokens_used = api_tokens_used + p_tokens,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$;

COMMENT ON FUNCTION increment_profile_tokens(UUID, INTEGER) IS 'Increments AI token usage counter for user';

CREATE OR REPLACE FUNCTION increment_profile_digests(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE profiles
  SET
    digests_generated = digests_generated + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$;

COMMENT ON FUNCTION increment_profile_digests(UUID) IS 'Increments digest generation counter for user';

-- ============================================================================
-- 7. RESET MONTHLY USAGE
-- ============================================================================

CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  reset_count INTEGER;
BEGIN
  UPDATE profiles
  SET
    api_tokens_used = 0,
    digests_generated = 0,
    monthly_reset_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE monthly_reset_date < CURRENT_DATE;

  GET DIAGNOSTICS reset_count = ROW_COUNT;
  RETURN reset_count;
END;
$$;

COMMENT ON FUNCTION reset_monthly_usage() IS 'Resets monthly usage counters (run monthly via cron)';

-- ============================================================================
-- 8. GET USER DIGEST STATS
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_digest_stats(p_user_id UUID)
RETURNS TABLE (
  total_digests BIGINT,
  total_articles BIGINT,
  total_sources BIGINT,
  avg_articles_per_digest NUMERIC,
  last_digest_date TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT d.id)::BIGINT as total_digests,
    COUNT(DISTINCT da.article_id)::BIGINT as total_articles,
    COUNT(DISTINCT s.id)::BIGINT as total_sources,
    ROUND(AVG(d.article_count), 2) as avg_articles_per_digest,
    MAX(d.generated_at) as last_digest_date
  FROM digests d
  LEFT JOIN digest_articles da ON d.id = da.digest_id
  LEFT JOIN articles a ON da.article_id = a.id
  LEFT JOIN sources s ON a.source_id = s.id
  WHERE d.user_id = p_user_id;
END;
$$;

COMMENT ON FUNCTION get_user_digest_stats(UUID) IS 'Returns aggregate statistics for a user';

-- ============================================================================
-- 9. UPDATE SOURCE HEALTH
-- ============================================================================

CREATE OR REPLACE FUNCTION update_source_health(
  p_source_id UUID,
  p_success BOOLEAN,
  p_articles_found INTEGER DEFAULT 0,
  p_error_message TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_success THEN
    UPDATE sources
    SET
      status = 'active',
      last_fetched_at = NOW(),
      consecutive_errors = 0,
      last_error = NULL,
      total_fetches = total_fetches + 1,
      total_articles_found = total_articles_found + p_articles_found,
      updated_at = NOW()
    WHERE id = p_source_id;
  ELSE
    UPDATE sources
    SET
      status = CASE
        WHEN consecutive_errors + 1 >= 5 THEN 'error'::TEXT
        ELSE 'active'::TEXT
      END,
      last_fetched_at = NOW(),
      consecutive_errors = consecutive_errors + 1,
      last_error = p_error_message,
      total_fetches = total_fetches + 1,
      updated_at = NOW()
    WHERE id = p_source_id;
  END IF;
END;
$$;

COMMENT ON FUNCTION update_source_health(UUID, BOOLEAN, INTEGER, TEXT) IS 'Updates source health metrics after fetch attempt';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'All helper functions and triggers created successfully!';
  RAISE NOTICE 'Database is fully functional with automated workflows.';
  RAISE NOTICE 'Optional: Run 05_setup_cron.sql if using pg_cron for scheduled jobs';
END $$;
