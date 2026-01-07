-- Add registration_payload column for retry functionality (temporary for testing)
ALTER TABLE drgreen_clients 
ADD COLUMN IF NOT EXISTS registration_payload JSONB DEFAULT NULL;