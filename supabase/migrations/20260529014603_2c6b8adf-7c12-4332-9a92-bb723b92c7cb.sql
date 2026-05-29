
-- newsletter_subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  locale text DEFAULT 'ar',
  source text,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz,
  confirmed boolean NOT NULL DEFAULT false,
  confirmation_token uuid NOT NULL DEFAULT gen_random_uuid()
);

GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_insert_anyone"
ON public.newsletter_subscribers
FOR INSERT TO anon, authenticated
WITH CHECK (length(email) >= 3 AND length(email) <= 255);

CREATE POLICY "newsletter_admin_read"
ON public.newsletter_subscribers
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "newsletter_admin_update"
ON public.newsletter_subscribers
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "newsletter_admin_delete"
ON public.newsletter_subscribers
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- contact_messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_type text NOT NULL,
  name text,
  email text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new',
  read_at timestamptz
);

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_insert_anyone"
ON public.contact_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(message) >= 1 AND length(message) <= 2000
  AND (email IS NULL OR length(email) <= 255)
  AND (name IS NULL OR length(name) <= 120)
  AND message_type IN ('suggestion','bug','thanks')
);

CREATE POLICY "contact_admin_read"
ON public.contact_messages
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "contact_admin_update"
ON public.contact_messages
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "contact_admin_delete"
ON public.contact_messages
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
