export const DOMAINS = [
  { code: "A", label: "أ. الله والغيبيات", color: "domain-a" },
  { code: "B", label: "ب. الإنسان", color: "domain-b" },
  { code: "C", label: "ج. الكون", color: "domain-c" },
  { code: "D", label: "د. الهداية والتشريع", color: "domain-d" },
  { code: "E", label: "هـ. الحياة العملية", color: "domain-e" },
  { code: "F", label: "و. المصير والآخرة", color: "domain-f" },
];

export const FUNCTIONS = ["أمر","نهي","وعد","وعيد","قصة","مثل","حوار","تقرير","تعزية","تحفيز","تصحيح"];
export const THEMES = ["التوحيد","الابتلاء","التمكين","الصبر","الشكر","التوبة","الحكمة","العدل","الرحمة","الإيمان","النفاق","الكفر","الجهاد","الأسرة","المال"];
export const EFFECTS = ["بناء_الإيمان","تزكية_النفس","تصحيح_السلوك","إحياء_الرجاء","تثبيت_القلب","تنمية_الوعي"];
export const TAGS = ["#سنة_إلهية","#تمكين","#قيادة","#تحول","#ابتلاء","#نصر","#هداية","#تشريع"];
export const CONTEXTS = ["مكية","مدنية"];

export const domainColor = (code?: string | null) => {
  const d = DOMAINS.find(x => x.code === code);
  return d ? `hsl(var(--${d.color}))` : "hsl(var(--muted-foreground))";
};
export const domainLabel = (code?: string | null) => DOMAINS.find(x => x.code === code)?.label || "غير مصنّف";

// Map a domain code (A-F) to the existing Falah domain id (1-8) for task creation
export const domainCodeToFalah: Record<string, number> = {
  A: 1, B: 4, C: 7, D: 1, E: 6, F: 1,
};
