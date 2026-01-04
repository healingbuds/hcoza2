-- Create extensions schema if not exists
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Move uuid-ossp extension to extensions schema (most common extension in public)
-- First drop from public if exists, then create in extensions
DROP EXTENSION IF EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Ensure gen_random_uuid() is available (built into PostgreSQL 13+, no extension needed)
-- The uuid-ossp extension provides uuid_generate_v4() as an alternative