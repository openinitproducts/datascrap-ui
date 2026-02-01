-- Enable required PostgreSQL extensions
-- Run this first before any other migrations

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Encryption for OAuth tokens
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Full-text search (built-in, but ensure it's available)
-- CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For similarity search (optional)

-- pg_cron for scheduled jobs (requires Supabase Pro or self-hosted)
-- CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Comment for future use
COMMENT ON EXTENSION "uuid-ossp" IS 'UUID generation functions';
COMMENT ON EXTENSION "pgcrypto" IS 'Cryptographic functions for encrypting OAuth tokens';
