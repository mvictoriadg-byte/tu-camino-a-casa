
-- Journey phases table
CREATE TABLE public.journey_phases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  order_index integer NOT NULL
);
ALTER TABLE public.journey_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read journey phases" ON public.journey_phases FOR SELECT TO anon, authenticated USING (true);

-- Journey steps table
CREATE TABLE public.journey_steps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id uuid NOT NULL REFERENCES public.journey_phases(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  order_index integer NOT NULL
);
ALTER TABLE public.journey_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read journey steps" ON public.journey_steps FOR SELECT TO anon, authenticated USING (true);

-- User journey progress
CREATE TABLE public.user_journey_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES public.journey_steps(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  UNIQUE(user_id, step_id)
);
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_journey_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_journey_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_journey_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.user_journey_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User tracker state
CREATE TABLE public.user_tracker_state (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_phase_id uuid REFERENCES public.journey_phases(id),
  focus_message text,
  last_calculated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.user_tracker_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tracker state" ON public.user_tracker_state FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tracker state" ON public.user_tracker_state FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tracker state" ON public.user_tracker_state FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Tracker milestones
CREATE TABLE public.tracker_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  percentage_required integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL
);
ALTER TABLE public.tracker_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read milestones" ON public.tracker_milestones FOR SELECT TO anon, authenticated USING (true);

-- User milestones
CREATE TABLE public.user_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_id uuid NOT NULL REFERENCES public.tracker_milestones(id) ON DELETE CASCADE,
  achieved_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, milestone_id)
);
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own milestones" ON public.user_milestones FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON public.user_milestones FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
