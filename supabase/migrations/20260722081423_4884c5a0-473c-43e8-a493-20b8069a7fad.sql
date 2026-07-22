
CREATE TABLE public.qr_redirect (
  id integer PRIMARY KEY DEFAULT 1,
  destination_url text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT qr_redirect_singleton CHECK (id = 1)
);

GRANT SELECT ON public.qr_redirect TO anon, authenticated;
GRANT ALL ON public.qr_redirect TO service_role;

ALTER TABLE public.qr_redirect ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qr_redirect_public_read" ON public.qr_redirect
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "qr_redirect_admin_write" ON public.qr_redirect
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER qr_redirect_set_updated_at
  BEFORE UPDATE ON public.qr_redirect
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.qr_redirect (id, destination_url) VALUES (1, 'https://falah.me/')
ON CONFLICT (id) DO NOTHING;
