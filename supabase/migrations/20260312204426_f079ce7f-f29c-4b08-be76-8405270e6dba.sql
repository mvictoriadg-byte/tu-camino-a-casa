
-- Create location_prices table
CREATE TABLE public.location_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comunidad TEXT NOT NULL,
  ciudad TEXT, -- NULL means comunidad average
  avg_price_m2 NUMERIC NOT NULL,
  mortgage_rate NUMERIC NOT NULL DEFAULT 3.2,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.location_prices ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read location prices"
  ON public.location_prices
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Add comunidad and ciudad columns to user_financial_data
ALTER TABLE public.user_financial_data 
  ADD COLUMN IF NOT EXISTS comunidad TEXT,
  ADD COLUMN IF NOT EXISTS ciudad TEXT;
