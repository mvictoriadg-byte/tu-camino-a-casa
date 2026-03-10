
CREATE TABLE public.user_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('feedback', 'contact')),
  message text NOT NULL,
  name text,
  email text,
  page_context text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages" ON public.user_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read messages" ON public.user_messages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
