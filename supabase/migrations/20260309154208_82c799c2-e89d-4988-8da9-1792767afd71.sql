
ALTER TABLE public.user_financial_data ADD COLUMN IF NOT EXISTS number_of_children integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_financial_data ADD COLUMN IF NOT EXISTS first_home boolean NOT NULL DEFAULT true;

ALTER TABLE public.savings_progress ADD COLUMN IF NOT EXISTS saved_amount numeric NOT NULL DEFAULT 0;
