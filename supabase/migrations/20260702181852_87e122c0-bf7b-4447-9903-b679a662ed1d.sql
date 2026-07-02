
INSERT INTO public.intents (code, label_ar, label_en, description_ar, sort_order, is_active)
VALUES ('rizq', 'الرزق', 'Rizq', 'اطلب البركة في الرزق، والسعي المبارك، والقناعة.', 7, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.domains (code, label_ar, label_en, subtitle_ar, description_ar, sort_order, is_active)
VALUES ('qasas', 'القصص', 'Qasas', 'عبرٌ من قصص القرآن', 'استلهم من قصص الأنبياء والأمم عبرًا تُنير طريقك اليوم.', 9, true)
ON CONFLICT (code) DO NOTHING;
