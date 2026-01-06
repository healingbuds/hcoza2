-- Create contact_inquiries table for storing form submissions
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('eligibility', 'existing_patient', 'referral', 'general')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  medical_context TEXT,
  source TEXT NOT NULL DEFAULT 'homepage',
  country_code TEXT NOT NULL DEFAULT 'ZA',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for service role inserts (edge functions)
CREATE POLICY "Service role can insert contact inquiries"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

-- Create policy for admin read access
CREATE POLICY "Admins can view all contact inquiries"
ON public.contact_inquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admin update access
CREATE POLICY "Admins can update contact inquiries"
ON public.contact_inquiries
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_contact_inquiries_updated_at
BEFORE UPDATE ON public.contact_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();