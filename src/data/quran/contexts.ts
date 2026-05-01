import { TAGS, DOMAINS, THEMES } from "./taxonomy";

export interface LifeContext {
  id: string;
  title: string;          // e.g. "الاستقرار المالي"
  subtitle: string;       // short hint
  emoji: string;
  domains: string[];      // domain codes from DOMAINS (A-F)
  tags: string[];         // smart tags from TAGS
  themes: string[];       // themes from THEMES
  expectedImpact: string; // human-readable expected outcome
  keywords: string[];     // for free-text matching
}

/**
 * Curated bridges between common life situations and the
 * Quranic taxonomy (domains + smart tags + themes).
 * Tags/domains/themes here MUST exist in src/data/quran/taxonomy.ts.
 */
export const LIFE_CONTEXTS: LifeContext[] = [
  {
    id: "financial",
    title: "الاستقرار المالي",
    subtitle: "رزق، بركة، تدبير",
    emoji: "💰",
    domains: ["E"],
    tags: ["#تمكين", "#سنة_إلهية"],
    themes: ["المال", "الشكر", "الصبر"],
    expectedImpact: "ثقة في الرزق، تدبير حكيم، وبركة في الكسب",
    keywords: ["مال", "رزق", "عمل", "وظيفة", "دين", "فقر", "غنى", "بركة"],
  },
  {
    id: "inner_peace",
    title: "السكينة الداخلية",
    subtitle: "طمأنينة وراحة قلب",
    emoji: "🕊️",
    domains: ["A", "B"],
    tags: ["#هداية", "#تحول"],
    themes: ["الإيمان", "التوبة", "الصبر", "الشكر"],
    expectedImpact: "هدوء النفس، صفاء القلب، وثبات في الابتلاء",
    keywords: ["قلق", "خوف", "حزن", "اكتئاب", "ضيق", "وحدة", "سكينة", "طمأنينة"],
  },
  {
    id: "family",
    title: "انسجام الأسرة",
    subtitle: "رحمة ومودة وتربية",
    emoji: "🏡",
    domains: ["E"],
    tags: ["#قيادة"],
    themes: ["الأسرة", "الرحمة", "العدل"],
    expectedImpact: "تواصل دافئ، تربية متّزنة، وحلّ الخلافات بحكمة",
    keywords: ["أسرة", "زوج", "زوجة", "أبناء", "والدين", "بيت", "خلاف", "تربية"],
  },
  {
    id: "weakness_to_empowerment",
    title: "من الضعف إلى التمكين",
    subtitle: "تجاوز العجز وبناء القوة",
    emoji: "🌱",
    domains: ["B", "E"],
    tags: ["#تمكين", "#نصر", "#تحول"],
    themes: ["الصبر", "الابتلاء", "التمكين"],
    expectedImpact: "ثقة بوعد الله، صبر فاعل، وخطوات نحو التمكين",
    keywords: ["ضعف", "عجز", "فشل", "خذلان", "هزيمة", "إحباط", "ظلم"],
  },
  {
    id: "guidance",
    title: "البحث عن الهداية",
    subtitle: "وضوح وبصيرة في القرار",
    emoji: "🧭",
    domains: ["D", "A"],
    tags: ["#هداية", "#تشريع"],
    themes: ["التوحيد", "الحكمة", "الإيمان"],
    expectedImpact: "وضوح الرؤية، رشد في الاختيار، وثبات على الحق",
    keywords: ["حيرة", "تردد", "قرار", "اختيار", "ضياع", "هداية", "بصيرة"],
  },
  {
    id: "trial",
    title: "في الابتلاء والمحنة",
    subtitle: "صبر وثبات حتى الفرج",
    emoji: "⚓",
    domains: ["B", "F"],
    tags: ["#ابتلاء", "#سنة_إلهية"],
    themes: ["الصبر", "الابتلاء", "الإيمان"],
    expectedImpact: "احتساب الأجر، تثبيت القلب، واليقين بقُرب الفرج",
    keywords: ["مرض", "موت", "فقد", "بلاء", "محنة", "كرب", "مصيبة"],
  },
  {
    id: "leadership",
    title: "القيادة والتأثير",
    subtitle: "مسؤولية، عدل، ورؤية",
    emoji: "🌟",
    domains: ["E"],
    tags: ["#قيادة", "#تمكين"],
    themes: ["العدل", "الحكمة", "التمكين"],
    expectedImpact: "قرار عادل، رؤية ناضجة، وأثر طيّب في من حولك",
    keywords: ["قيادة", "إدارة", "مسؤولية", "فريق", "تأثير", "قرار"],
  },
  {
    id: "self_correction",
    title: "محاسبة وتزكية",
    subtitle: "توبة وتصحيح المسار",
    emoji: "🔄",
    domains: ["B", "D"],
    tags: ["#تحول", "#هداية"],
    themes: ["التوبة", "الإيمان", "الحكمة"],
    expectedImpact: "صدق التوبة، تزكية النفس، واستئناف المسار",
    keywords: ["ذنب", "خطأ", "ندم", "توبة", "غفلة", "تقصير"],
  },
];

export const findContextByText = (q: string): LifeContext | null => {
  const norm = q.trim().toLowerCase();
  if (!norm) return null;
  for (const c of LIFE_CONTEXTS) {
    if (c.keywords.some(k => norm.includes(k))) return c;
  }
  return null;
};

// Sanity check (compile-time hint): ensure referenced tags exist in TAGS list
const _allKnownTags = new Set(TAGS);
const _allKnownDomains = new Set(DOMAINS.map(d => d.code));
const _allKnownThemes = new Set(THEMES);
export const _validateContexts = () => {
  const issues: string[] = [];
  for (const c of LIFE_CONTEXTS) {
    c.tags.forEach(t => !_allKnownTags.has(t) && issues.push(`tag ${t} (${c.id})`));
    c.domains.forEach(d => !_allKnownDomains.has(d) && issues.push(`domain ${d} (${c.id})`));
    c.themes.forEach(t => !_allKnownThemes.has(t) && issues.push(`theme ${t} (${c.id})`));
  }
  return issues;
};