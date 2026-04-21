
-- Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-grant first user as admin, others as user
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Backfill: any existing users get admin (so the project owner becomes admin)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
ON CONFLICT DO NOTHING;

-- Surahs
CREATE TABLE public.surahs (
  number INT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_translit TEXT NOT NULL,
  revelation TEXT NOT NULL,
  verses_count INT NOT NULL,
  order_revelation INT
);
ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "surahs_public_read" ON public.surahs FOR SELECT USING (true);
CREATE POLICY "surahs_admin_write" ON public.surahs FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Verses
CREATE TABLE public.verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  surah_number INT NOT NULL,
  verse_number INT NOT NULL,
  text_ar TEXT NOT NULL,
  text_simple TEXT,
  page INT,
  juz INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (surah_number, verse_number)
);
CREATE INDEX idx_verses_surah ON public.verses(surah_number, verse_number);
ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "verses_public_read" ON public.verses FOR SELECT USING (true);
CREATE POLICY "verses_admin_write" ON public.verses FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Classification taxonomy
CREATE TABLE public.classification_taxonomy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  code TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  parent_code TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  UNIQUE (type, code)
);
ALTER TABLE public.classification_taxonomy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "taxonomy_public_read" ON public.classification_taxonomy FOR SELECT USING (true);
CREATE POLICY "taxonomy_admin_write" ON public.classification_taxonomy FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Verse classifications
CREATE TABLE public.verse_classifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verse_id UUID NOT NULL REFERENCES public.verses(id) ON DELETE CASCADE,
  domain_code TEXT,
  sub_domain TEXT,
  themes TEXT[] DEFAULT '{}',
  function TEXT,
  context TEXT,
  educational_effects TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_vc_verse ON public.verse_classifications(verse_id);
CREATE INDEX idx_vc_domain ON public.verse_classifications(domain_code);
ALTER TABLE public.verse_classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vc_public_read" ON public.verse_classifications FOR SELECT USING (true);
CREATE POLICY "vc_admin_write" ON public.verse_classifications FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER vc_updated_at BEFORE UPDATE ON public.verse_classifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed taxonomy
INSERT INTO public.classification_taxonomy (type, code, label_ar, sort_order) VALUES
('domain','A','أ. الله والغيبيات',1),
('domain','B','ب. الإنسان',2),
('domain','C','ج. الكون',3),
('domain','D','د. الهداية والتشريع',4),
('domain','E','هـ. الحياة العملية',5),
('domain','F','و. المصير والآخرة',6),
('function','أمر','أمر',1),
('function','نهي','نهي',2),
('function','وعد','وعد',3),
('function','وعيد','وعيد',4),
('function','قصة','قصة',5),
('function','مثل','مثل',6),
('function','حوار','حوار',7),
('function','تقرير','تقرير',8),
('function','تعزية','تعزية',9),
('function','تحفيز','تحفيز',10),
('function','تصحيح','تصحيح',11),
('theme','التوحيد','التوحيد',1),
('theme','الابتلاء','الابتلاء',2),
('theme','التمكين','التمكين',3),
('theme','الصبر','الصبر',4),
('theme','الشكر','الشكر',5),
('theme','التوبة','التوبة',6),
('theme','الحكمة','الحكمة',7),
('theme','العدل','العدل',8),
('theme','الرحمة','الرحمة',9),
('theme','الإيمان','الإيمان',10),
('theme','النفاق','النفاق',11),
('theme','الكفر','الكفر',12),
('theme','الجهاد','الجهاد',13),
('theme','الأسرة','الأسرة',14),
('theme','المال','المال',15),
('effect','بناء_الإيمان','بناء الإيمان',1),
('effect','تزكية_النفس','تزكية النفس',2),
('effect','تصحيح_السلوك','تصحيح السلوك',3),
('effect','إحياء_الرجاء','إحياء الرجاء',4),
('effect','تثبيت_القلب','تثبيت القلب',5),
('effect','تنمية_الوعي','تنمية الوعي',6),
('tag','#سنة_إلهية','#سنة_إلهية',1),
('tag','#تمكين','#تمكين',2),
('tag','#قيادة','#قيادة',3),
('tag','#تحول','#تحول',4),
('tag','#ابتلاء','#ابتلاء',5),
('tag','#نصر','#نصر',6),
('tag','#هداية','#هداية',7),
('tag','#تشريع','#تشريع',8);

-- Seed all 114 surahs index
INSERT INTO public.surahs (number, name_ar, name_translit, revelation, verses_count) VALUES
(1,'الفاتحة','Al-Fatihah','مكية',7),(2,'البقرة','Al-Baqarah','مدنية',286),(3,'آل عمران','Aal-Imran','مدنية',200),(4,'النساء','An-Nisa','مدنية',176),(5,'المائدة','Al-Maidah','مدنية',120),(6,'الأنعام','Al-Anam','مكية',165),(7,'الأعراف','Al-Araf','مكية',206),(8,'الأنفال','Al-Anfal','مدنية',75),(9,'التوبة','At-Tawbah','مدنية',129),(10,'يونس','Yunus','مكية',109),
(11,'هود','Hud','مكية',123),(12,'يوسف','Yusuf','مكية',111),(13,'الرعد','Ar-Rad','مدنية',43),(14,'إبراهيم','Ibrahim','مكية',52),(15,'الحجر','Al-Hijr','مكية',99),(16,'النحل','An-Nahl','مكية',128),(17,'الإسراء','Al-Isra','مكية',111),(18,'الكهف','Al-Kahf','مكية',110),(19,'مريم','Maryam','مكية',98),(20,'طه','Ta-Ha','مكية',135),
(21,'الأنبياء','Al-Anbiya','مكية',112),(22,'الحج','Al-Hajj','مدنية',78),(23,'المؤمنون','Al-Muminun','مكية',118),(24,'النور','An-Nur','مدنية',64),(25,'الفرقان','Al-Furqan','مكية',77),(26,'الشعراء','Ash-Shuara','مكية',227),(27,'النمل','An-Naml','مكية',93),(28,'القصص','Al-Qasas','مكية',88),(29,'العنكبوت','Al-Ankabut','مكية',69),(30,'الروم','Ar-Rum','مكية',60),
(31,'لقمان','Luqman','مكية',34),(32,'السجدة','As-Sajdah','مكية',30),(33,'الأحزاب','Al-Ahzab','مدنية',73),(34,'سبأ','Saba','مكية',54),(35,'فاطر','Fatir','مكية',45),(36,'يس','Ya-Sin','مكية',83),(37,'الصافات','As-Saffat','مكية',182),(38,'ص','Sad','مكية',88),(39,'الزمر','Az-Zumar','مكية',75),(40,'غافر','Ghafir','مكية',85),
(41,'فصلت','Fussilat','مكية',54),(42,'الشورى','Ash-Shuraa','مكية',53),(43,'الزخرف','Az-Zukhruf','مكية',89),(44,'الدخان','Ad-Dukhan','مكية',59),(45,'الجاثية','Al-Jathiyah','مكية',37),(46,'الأحقاف','Al-Ahqaf','مكية',35),(47,'محمد','Muhammad','مدنية',38),(48,'الفتح','Al-Fath','مدنية',29),(49,'الحجرات','Al-Hujurat','مدنية',18),(50,'ق','Qaf','مكية',45),
(51,'الذاريات','Adh-Dhariyat','مكية',60),(52,'الطور','At-Tur','مكية',49),(53,'النجم','An-Najm','مكية',62),(54,'القمر','Al-Qamar','مكية',55),(55,'الرحمن','Ar-Rahman','مدنية',78),(56,'الواقعة','Al-Waqiah','مكية',96),(57,'الحديد','Al-Hadid','مدنية',29),(58,'المجادلة','Al-Mujadilah','مدنية',22),(59,'الحشر','Al-Hashr','مدنية',24),(60,'الممتحنة','Al-Mumtahanah','مدنية',13),
(61,'الصف','As-Saff','مدنية',14),(62,'الجمعة','Al-Jumuah','مدنية',11),(63,'المنافقون','Al-Munafiqun','مدنية',11),(64,'التغابن','At-Taghabun','مدنية',18),(65,'الطلاق','At-Talaq','مدنية',12),(66,'التحريم','At-Tahrim','مدنية',12),(67,'الملك','Al-Mulk','مكية',30),(68,'القلم','Al-Qalam','مكية',52),(69,'الحاقة','Al-Haqqah','مكية',52),(70,'المعارج','Al-Maarij','مكية',44),
(71,'نوح','Nuh','مكية',28),(72,'الجن','Al-Jinn','مكية',28),(73,'المزمل','Al-Muzzammil','مكية',20),(74,'المدثر','Al-Muddaththir','مكية',56),(75,'القيامة','Al-Qiyamah','مكية',40),(76,'الإنسان','Al-Insan','مدنية',31),(77,'المرسلات','Al-Mursalat','مكية',50),(78,'النبأ','An-Naba','مكية',40),(79,'النازعات','An-Naziat','مكية',46),(80,'عبس','Abasa','مكية',42),
(81,'التكوير','At-Takwir','مكية',29),(82,'الانفطار','Al-Infitar','مكية',19),(83,'المطففين','Al-Mutaffifin','مكية',36),(84,'الانشقاق','Al-Inshiqaq','مكية',25),(85,'البروج','Al-Buruj','مكية',22),(86,'الطارق','At-Tariq','مكية',17),(87,'الأعلى','Al-Ala','مكية',19),(88,'الغاشية','Al-Ghashiyah','مكية',26),(89,'الفجر','Al-Fajr','مكية',30),(90,'البلد','Al-Balad','مكية',20),
(91,'الشمس','Ash-Shams','مكية',15),(92,'الليل','Al-Layl','مكية',21),(93,'الضحى','Ad-Duhaa','مكية',11),(94,'الشرح','Ash-Sharh','مكية',8),(95,'التين','At-Tin','مكية',8),(96,'العلق','Al-Alaq','مكية',19),(97,'القدر','Al-Qadr','مكية',5),(98,'البينة','Al-Bayyinah','مدنية',8),(99,'الزلزلة','Az-Zalzalah','مدنية',8),(100,'العاديات','Al-Adiyat','مكية',11),
(101,'القارعة','Al-Qariah','مكية',11),(102,'التكاثر','At-Takathur','مكية',8),(103,'العصر','Al-Asr','مكية',3),(104,'الهمزة','Al-Humazah','مكية',9),(105,'الفيل','Al-Fil','مكية',5),(106,'قريش','Quraysh','مكية',4),(107,'الماعون','Al-Maun','مكية',7),(108,'الكوثر','Al-Kawthar','مكية',3),(109,'الكافرون','Al-Kafirun','مكية',6),(110,'النصر','An-Nasr','مدنية',3),
(111,'المسد','Al-Masad','مكية',5),(112,'الإخلاص','Al-Ikhlas','مكية',4),(113,'الفلق','Al-Falaq','مكية',5),(114,'الناس','An-Nas','مكية',6);
