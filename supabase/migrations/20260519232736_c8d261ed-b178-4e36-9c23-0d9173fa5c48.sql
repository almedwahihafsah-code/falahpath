CREATE TABLE public.ayah_domains (
  verse_id uuid NOT NULL,
  domain_code text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  confidence_score smallint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  CONSTRAINT ayah_domains_pkey PRIMARY KEY (verse_id, domain_code),
  CONSTRAINT ayah_domains_verse_id_fkey FOREIGN KEY (verse_id) REFERENCES public.verses(id) ON DELETE CASCADE,
  CONSTRAINT ayah_domains_domain_code_fkey FOREIGN KEY (domain_code) REFERENCES public.domains(code) ON DELETE CASCADE
);

ALTER TABLE public.ayah_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ayah_domains_public_read"
  ON public.ayah_domains
  FOR SELECT
  USING (true);

CREATE POLICY "ayah_domains_admin_write"
  ON public.ayah_domains
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER ayah_domains_set_updated_at
  BEFORE UPDATE ON public.ayah_domains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();