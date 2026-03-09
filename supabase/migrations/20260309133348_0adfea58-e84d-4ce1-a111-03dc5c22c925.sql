
CREATE TABLE public.savings_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL,
  month_label TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  target_amount NUMERIC NOT NULL DEFAULT 0,
  total_upfront NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_number)
);

ALTER TABLE public.savings_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own savings progress" ON public.savings_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings progress" ON public.savings_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings progress" ON public.savings_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings progress" ON public.savings_progress
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
