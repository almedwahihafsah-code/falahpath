
CREATE TABLE public.domains (
  code text PRIMARY KEY,
  label_ar text NOT NULL,
  label_en text,
  subtitle_ar text,
  description_ar text,
  anchor_verse_ref text,
  sort_order smallint NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.intents (
  code text PRIMARY KEY,
  label_ar text NOT NULL,
  label_en text,
  description_ar text NOT NULL,
  sort_order smallint NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY domains_public_read ON public.domains FOR SELECT USING (true);
CREATE POLICY domains_admin_write ON public.domains FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY intents_public_read ON public.intents FOR SELECT USING (true);
CREATE POLICY intents_admin_write ON public.intents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER domains_set_updated_at
  BEFORE UPDATE ON public.domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER intents_set_updated_at
  BEFORE UPDATE ON public.intents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.domains (code, label_ar, label_en, subtitle_ar, anchor_verse_ref, sort_order) VALUES
  ('heart',  'القلب والروح',      'Heart & Soul',              'المحرك الداخلي',    '13:28', 1),
  ('body',   'الجسد والصحة',      'Body & Health',             'الأمانة الجسدية',   '7:31',  2),
  ('mind',   'العقل والمعرفة',     'Mind & Knowledge',          'البناء الفكري',     '96:1',  3),
  ('work',   'العمل والإنجاز',     'Work & Achievement',        'السعي والإتقان',    '9:105', 4),
  ('wealth', 'المال والموارد',     'Wealth & Resources',        'الاستخلاف المالي',  '65:2',  5),
  ('family', 'الأسرة والعلاقات',   'Family & Relationships',    'البناء الاجتماعي',  '30:21', 6),
  ('ummah',  'المجتمع والأمة',     'Community & Ummah',         'الأثر الحضاري',     '3:110', 7),
  ('trials', 'الابتلاءات والثبات', 'Trials & Steadfastness',    'الصبر والثبات',     '94:6',  8);

INSERT INTO public.intents (code, label_ar, label_en, description_ar, sort_order) VALUES
  ('falah',   'الفلاح',  'Falah (Flourishing)', 'الفوز والنجاح في الدنيا والآخرة',     1),
  ('sakinah', 'السكينة', 'Tranquility',         'طمأنينة القلب وسكون النفس',           2),
  ('hidayah', 'الهداية', 'Guidance',            'طلب الهدى والبصيرة في القرار',        3),
  ('thabat',  'الثبات',  'Steadfastness',       'الثبات على الحق عند الابتلاء',        4),
  ('shukr',   'الشكر',   'Gratitude',           'شكر النعمة وحفظها',                   5),
  ('inabah',  'الإنابة', 'Turning Back',        'الرجوع إلى الله والتوبة الصادقة',     6);
