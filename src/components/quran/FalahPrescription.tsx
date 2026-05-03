import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2, Heart, BookOpen, Sparkles, ArrowLeft, Compass,
  Shield, Sunrise, AlertTriangle, Megaphone, Scroll, HelpCircle,
  Scale, Lightbulb, Flame, Zap, Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LifeContext, LIFE_CONTEXTS } from "@/data/quran/contexts";
import { domainLabel } from "@/data/quran/taxonomy";
import { Link } from "react-router-dom";

interface VerseRow {
  id: string;
  surah_number: number;
  verse_number: number;
  text_ar: string;
}
interface ClassRow {
  verse_id: string;
  domain_code: string | null;
  function: string | null;
  themes: string[] | null;
  tags: string[] | null;
  educational_effects: string[] | null;
}

interface Props {
  context: LifeContext;
  onBack: () => void;
  surahMap: Record<number, string>;
}

// Map rhetorical functions to icons + tonal accent
const FUNCTION_META: Record<string, { Icon: typeof Shield; tone: string; label: string }> = {
  "أمر":      { Icon: Zap,           tone: "from-amber-500/80 to-orange-600/80",   label: "أمر" },
  "نهي":      { Icon: AlertTriangle, tone: "from-rose-500/80 to-red-600/80",       label: "نهي" },
  "وعد":      { Icon: Sunrise,       tone: "from-amber-400/80 to-yellow-500/80",   label: "وعد" },
  "وعيد":     { Icon: Flame,         tone: "from-rose-600/80 to-red-700/80",       label: "وعيد" },
  "تحذير":    { Icon: Shield,        tone: "from-orange-500/80 to-rose-500/80",    label: "تحذير" },
  "تحفيز":    { Icon: Star,          tone: "from-yellow-400/80 to-amber-500/80",   label: "تحفيز" },
  "قصة":      { Icon: Scroll,        tone: "from-sky-500/80 to-indigo-600/80",     label: "قصة" },
  "تشريع":    { Icon: Scale,         tone: "from-emerald-600/80 to-teal-700/80",   label: "تشريع" },
  "حكمة":     { Icon: Lightbulb,     tone: "from-amber-400/80 to-emerald-500/80",  label: "حكمة" },
  "دعاء":     { Icon: Sparkles,      tone: "from-violet-500/80 to-fuchsia-600/80", label: "دعاء" },
  "سؤال":     { Icon: HelpCircle,    tone: "from-cyan-500/80 to-blue-600/80",      label: "سؤال" },
  "بيان":     { Icon: Megaphone,     tone: "from-emerald-500/80 to-green-600/80",  label: "بيان" },
  "تصحيح":    { Icon: Scale,         tone: "from-teal-500/80 to-emerald-600/80",   label: "تصحيح" },
};
const DEFAULT_FN_META = { Icon: BookOpen, tone: "from-primary/80 to-primary-glow/80", label: "آية" };
const fnMeta = (fn?: string | null) => (fn && FUNCTION_META[fn]) || DEFAULT_FN_META;

export const FalahPrescription = ({ context, onBack, surahMap }: Props) => {
  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<(VerseRow & { cls: ClassRow })[]>([]);
  const [visibleSet, setVisibleSet] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Reveal-on-scroll
  useEffect(() => {
    if (!verses.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        setVisibleSet(prev => {
          const next = new Set(prev);
          entries.forEach(e => {
            if (e.isIntersecting) next.add((e.target as HTMLElement).dataset.id || "");
          });
          return next;
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    itemRefs.current.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [verses]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      // Query classifications matching tags OR domains OR themes
      let q = supabase.from("verse_classifications").select("*").limit(500);
      // Build OR filter — Postgres array overlap via .overlaps
      // We do client-side scoring to handle multiple criteria flexibly
      const { data: cls } = await q;
      if (!cls || cancelled) { setLoading(false); return; }

      // Score each classification by matches
      const scored = cls
        .map((c: any) => {
          let score = 0;
          if (c.domain_code && context.domains.includes(c.domain_code)) score += 3;
          (c.tags || []).forEach((t: string) => context.tags.includes(t) && (score += 4));
          (c.themes || []).forEach((t: string) => context.themes.includes(t) && (score += 2));
          return { c, score };
        })
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      if (!scored.length) {
        setVerses([]);
        setLoading(false);
        return;
      }

      const verseIds = scored.map(s => s.c.verse_id);
      const { data: vs } = await supabase.from("verses").select("*").in("id", verseIds);
      if (cancelled) return;
      const vMap = new Map<string, VerseRow>();
      (vs || []).forEach((v: any) => vMap.set(v.id, v));

      const merged = scored
        .map(s => {
          const v = vMap.get(s.c.verse_id);
          return v ? { ...v, cls: s.c } : null;
        })
        .filter(Boolean) as (VerseRow & { cls: ClassRow })[];

      setVerses(merged);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [context]);

  // Aggregate educational impacts across all returned verses → "Expected Result"
  const expectedImpacts = useMemo(() => {
    const set = new Set<string>();
    verses.forEach(v => (v.cls.educational_effects || []).forEach(e => set.add(e)));
    return Array.from(set).slice(0, 6);
  }, [verses]);

  // Empty state — suggest related contexts (sharing at least one tag/domain)
  const relatedContexts = useMemo(() => {
    return LIFE_CONTEXTS
      .filter(c => c.id !== context.id)
      .map(c => ({
        c,
        overlap:
          c.tags.filter(t => context.tags.includes(t)).length +
          c.domains.filter(d => context.domains.includes(d)).length,
      }))
      .filter(x => x.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 4)
      .map(x => x.c);
  }, [context]);

  return (
    <div className="space-y-5 animate-float-in">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
        <ArrowLeft className="w-4 h-4" /> رجوع لاختيار سياق آخر
      </Button>

      {/* Header — the prescription */}
      <Card className="p-6 bg-gradient-emerald text-primary-foreground shadow-elegant relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{context.emoji}</span>
          <div>
            <p className="text-xs opacity-80 tracking-widest">وصفة الفلاح</p>
            <h2 className="font-display text-2xl">{context.title}</h2>
          </div>
        </div>
        <p className="text-sm opacity-90 mt-3 leading-relaxed">
          <Sparkles className="inline w-3.5 h-3.5 mb-0.5" /> النتيجة المرتقبة: {context.expectedImpact}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {context.tags.map(t => (
            <Badge key={t} variant="outline" className="border-primary-foreground/40 text-primary-foreground bg-white/10">
              {t}
            </Badge>
          ))}
          {context.domains.map(d => (
            <Badge key={d} className="bg-white/20 text-primary-foreground border-0">
              {domainLabel(d)}
            </Badge>
          ))}
        </div>
      </Card>

      {loading && (
        <Card className="p-12 text-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
          نبحث في الآيات المصنّفة...
        </Card>
      )}

      {!loading && verses.length > 0 && (
        <>
          {/* Aggregated expected impacts */}
          {expectedImpacts.length > 0 && (
            <Card className="p-5 bg-card/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-soft">
              <div className="flex items-center gap-2 mb-3 text-accent">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">الأثر التربوي المتوقع</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {expectedImpacts.map(e => (
                  <Badge
                    key={e}
                    variant="secondary"
                    className="gap-1 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-900"
                  >
                    <Heart className="w-3 h-3" />
                    {e.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* The Path — verses as a numbered journey */}
          <div className="relative pt-2 pb-4">
            {/* Curved gradient spine (SVG) */}
            <svg
              className="absolute top-0 bottom-0 right-[14px] w-12 h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 40 1000"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="falah-spine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
                  <stop offset="20%" stopColor="hsl(var(--accent))" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                  <stop offset="80%" stopColor="hsl(var(--accent))" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d="M20 0 C 4 200, 36 400, 20 600 S 4 900, 20 1000"
                fill="none"
                stroke="url(#falah-spine)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="space-y-7">
              {verses.map((v, idx) => {
                const meta = fnMeta(v.cls.function);
                const visible = visibleSet.has(v.id);
                const isCurrent = idx === 0; // first step = current focus
                return (
                  <div
                    key={v.id}
                    data-id={v.id}
                    ref={el => { if (el) itemRefs.current.set(v.id, el); }}
                    className={`relative mr-14 transition-all duration-700 ease-out ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                    style={{ transitionDelay: `${Math.min(idx, 5) * 60}ms` }}
                  >
                    {/* Step node with icon + glow for current */}
                    <div className="absolute -right-[60px] top-4 z-10">
                      {isCurrent && (
                        <span className="absolute inset-0 -m-1 rounded-full bg-accent/40 blur-md animate-pulse" aria-hidden="true" />
                      )}
                      <div
                        className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${meta.tone} text-white flex items-center justify-center shadow-gold ring-2 ring-background`}
                        title={meta.label}
                      >
                        <meta.Icon className="w-5 h-5" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground bg-background/80 backdrop-blur px-1.5 rounded-full">
                        {idx + 1}
                      </div>
                    </div>

                    {/* Glassmorphism verse card */}
                    <Card
                      className={`p-6 relative overflow-hidden border bg-card/55 dark:bg-card/40 backdrop-blur-xl
                        ${isCurrent
                          ? "border-accent/50 shadow-gold ring-1 ring-accent/30"
                          : "border-white/40 dark:border-white/10 shadow-soft"}
                      `}
                    >
                      {/* soft tonal wash */}
                      <div className={`pointer-events-none absolute inset-0 opacity-[0.07] bg-gradient-to-br ${meta.tone}`} />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <div className="text-xs text-accent flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="font-medium">سورة {surahMap[v.surah_number] || v.surah_number}</span>
                            <span className="opacity-60">•</span>
                            <span>آية {v.verse_number}</span>
                          </div>
                          {v.cls.function && (
                            <Badge className={`bg-gradient-to-br ${meta.tone} text-white border-0 gap-1 text-[10px]`}>
                              <meta.Icon className="w-3 h-3" />
                              {meta.label}
                            </Badge>
                          )}
                        </div>
                        <p className="font-quran text-2xl md:text-[1.7rem] leading-[2.4rem] text-foreground" dir="rtl">
                          {v.text_ar}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {(v.cls.tags || []).slice(0, 3).map(t => (
                            <Badge key={t} variant="outline" className="text-accent text-xs bg-background/40 backdrop-blur-sm">{t}</Badge>
                          ))}
                          {(v.cls.educational_effects || []).slice(0, 2).map(e => (
                            <Badge key={e} variant="secondary" className="gap-1 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100 text-xs backdrop-blur-sm">
                              <Heart className="w-3 h-3" />{e.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {!loading && verses.length === 0 && (
        <Card className="p-7 text-center bg-gradient-card shadow-soft">
          <Compass className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-display text-lg text-primary mb-2">لم نجد آيات مصنّفة بعد لهذا السياق</h3>
          <p className="text-sm text-muted-foreground mb-5">
            الآيات تُصنَّف تدريجيًا. جرّب أحد المجالات القريبة:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {relatedContexts.map(c => (
              <Badge
                key={c.id}
                className="cursor-pointer bg-gradient-emerald text-primary-foreground border-0 px-3 py-1.5"
                onClick={() => { /* parent handles via onBack + reselect; we link via search params instead */ }}
              >
                <Link to={`/guide?ctx=${c.id}`}>{c.emoji} {c.title}</Link>
              </Badge>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-5">
            <Link to="/quran">تصفّح المستكشف القرآني</Link>
          </Button>
        </Card>
      )}
    </div>
  );
};