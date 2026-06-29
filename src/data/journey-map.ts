// Falah Journey static map: Intent → Domain(s) → {verse, action, reflection}
// Used to activate every domain even when DB content is still being curated.
// This layer is intentionally modular so it can later be replaced by, or
// merged with, the Falahi Digital Twin + Falah Index personalization layer
// without touching the UI components that consume it.

export type DomainCode =
  | "heart" | "body" | "mind" | "work"
  | "wealth" | "family" | "ummah" | "trials";

export type IntentCode =
  | "falah" | "sakinah" | "hidayah" | "thabat" | "shukr" | "inabah";

export type DomainJourneyContent = {
  verse: {
    text_ar: string;
    surah_name_ar: string;
    surah_number: number;
    verse_number: number;
  };
  action: string;       // Practical, small, today-actionable.
  reflection: string;   // Single, open, sincere question.
};

// Each intent maps to its most relevant domains (ordered).
// Every domain still remains accessible — this just guides the ordering.
export const INTENT_TO_DOMAINS: Record<IntentCode, DomainCode[]> = {
  falah:   ["heart", "work", "ummah", "wealth"],
  sakinah: ["heart", "trials", "family"],
  hidayah: ["mind", "heart", "work"],
  thabat:  ["trials", "heart", "mind"],
  shukr:   ["heart", "family", "wealth", "body"],
  inabah:  ["heart", "trials", "mind"],
};

// Per-domain placeholder content — curated, dignified, Museumcore-aligned.
// Replace progressively with real classified verses as data matures.
export const DOMAIN_JOURNEY: Record<DomainCode, DomainJourneyContent> = {
  heart: {
    verse: {
      text_ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      surah_name_ar: "الرعد", surah_number: 13, verse_number: 28,
    },
    action: "خصّص خمس دقائق اليوم لذكرٍ هادئ قبل أن تفتح هاتفك.",
    reflection: "ما الذي يثقل قلبك الآن، وما أوّل خطوة لتطمينه بذكر الله؟",
  },
  body: {
    verse: {
      text_ar: "وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا ۚ إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ",
      surah_name_ar: "الأعراف", surah_number: 7, verse_number: 31,
    },
    action: "اشرب كوب ماء الآن، وامشِ عشر دقائق قبل المغرب.",
    reflection: "كيف تُكرم جسدك اليوم كأمانةٍ أعطاكها الله؟",
  },
  mind: {
    verse: {
      text_ar: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
      surah_name_ar: "العلق", surah_number: 96, verse_number: 1,
    },
    action: "اقرأ صفحةً نافعة اليوم، ودوّن فكرةً واحدة تعمل بها.",
    reflection: "ما المعرفة التي إن تعلّمتها هذا الأسبوع غيّرت قراراتك؟",
  },
  work: {
    verse: {
      text_ar: "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ",
      surah_name_ar: "التوبة", surah_number: 9, verse_number: 105,
    },
    action: "أنجز مهمّتك الأهمّ اليوم بإتقان قبل أن تنشغل بغيرها.",
    reflection: "هل عملك اليوم يستحقّ أن يُرى؟ ما الذي تُحسّنه فيه؟",
  },
  wealth: {
    verse: {
      text_ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
      surah_name_ar: "الطلاق", surah_number: 65, verse_number: 2,
    },
    action: "راجع نفقةً واحدة اليوم: هل هي حاجة أم إسراف؟ واتّخذ قرارًا.",
    reflection: "أين تستشعر بركة الرزق في حياتك، وأين تشعر بضيقه؟",
  },
  family: {
    verse: {
      text_ar: "وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
      surah_name_ar: "الروم", surah_number: 30, verse_number: 21,
    },
    action: "اتّصل بأحد أهلك اليوم بكلمةٍ طيّبة دون سببٍ سوى الودّ.",
    reflection: "من في بيتك يحتاج حضورك لا حديثك؟",
  },
  ummah: {
    verse: {
      text_ar: "كُنتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ تَأْمُرُونَ بِالْمَعْرُوفِ وَتَنْهَوْنَ عَنِ الْمُنكَرِ",
      surah_name_ar: "آل عمران", surah_number: 3, verse_number: 110,
    },
    action: "قدّم اليوم نفعًا واحدًا لإنسان خارج دائرتك القريبة.",
    reflection: "ما الأثر الذي تودّ أن تتركه في مجتمعك خلال هذا العام؟",
  },
  trials: {
    verse: {
      text_ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      surah_name_ar: "الشرح", surah_number: 94, verse_number: 5,
    },
    action: "اكتب ابتلاءً تمرّ به، ثم اذكر نعمةً واحدة فيه لم تنتبه لها.",
    reflection: "ما الذي يعلّمك إيّاه هذا الابتلاء عن نفسك وعن ربّك؟",
  },
};

export const getDomainsForIntent = (intent?: string | null): DomainCode[] => {
  if (!intent) return [];
  return INTENT_TO_DOMAINS[intent as IntentCode] ?? [];
};

export const getDomainJourney = (code?: string | null): DomainJourneyContent | null => {
  if (!code) return null;
  return DOMAIN_JOURNEY[code as DomainCode] ?? null;
};