CREATE TABLE public.falahi_waitlist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.falahi_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "falahi_waitlist_insert_anyone"
ON public.falahi_waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (length(email) >= 3 AND length(email) <= 255);