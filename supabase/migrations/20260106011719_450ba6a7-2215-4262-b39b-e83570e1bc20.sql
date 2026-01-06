-- Create waitlist_signups table
CREATE TABLE public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website',
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  email_confirmed BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_email_country UNIQUE (email, country_code)
);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (public signups)
CREATE POLICY "Anyone can insert waitlist signups"
  ON public.waitlist_signups
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view signups
CREATE POLICY "Admins can view all waitlist signups"
  ON public.waitlist_signups
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can update signups
CREATE POLICY "Admins can update waitlist signups"
  ON public.waitlist_signups
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_waitlist_signups_updated_at
  BEFORE UPDATE ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for admin queries
CREATE INDEX idx_waitlist_signups_country ON public.waitlist_signups(country_code);
CREATE INDEX idx_waitlist_signups_created ON public.waitlist_signups(created_at DESC);