
CREATE TYPE public.aid_impact_type AS ENUM ('financing_increase', 'downpayment_reduction', 'grant', 'tax_reduction');

CREATE TABLE public.housing_aids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text NOT NULL,
  aid_type text NOT NULL,
  benefit_description text NOT NULL,
  benefit_amount_estimate numeric DEFAULT NULL,
  impact_type aid_impact_type NOT NULL,
  max_financing_percent integer DEFAULT NULL,
  age_limit integer DEFAULT NULL,
  income_limit numeric DEFAULT NULL,
  property_price_limit numeric DEFAULT NULL,
  first_home_required boolean DEFAULT false,
  residency_years_required integer DEFAULT NULL,
  family_conditions text DEFAULT NULL,
  notes text DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.housing_aids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read housing aids"
  ON public.housing_aids
  FOR SELECT
  TO anon, authenticated
  USING (true);
