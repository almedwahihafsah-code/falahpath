import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, BookOpen, Sparkles, ArrowLeft, Compass } from "lucide-react";
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

export const FalahPrescription = ({ context, onBack, surahMap }: Props) => {
  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<(VerseRow & { cls: ClassRow })[]>([]);

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
      <Card className="p-6 bg-gradient-emerald text-primary-foreground shadow-elegant">
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
            <Card className="p-5 bg-gradient-card shadow-soft">
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
          <div className="relative">
            <div className="absolute top-0 bottom-0 right-[19px] w-px bg-gradient-to-b from-accent/40 via-primary/30 to-accent/40" />
            <div className="space-y-4">
              {verses.map((v, idx) => (
                <Card key={v.id} className="p-5 mr-12 bg-card shadow-soft relative">
                  <div className="absolute -right-12 top-5 w-10 h-10 rounded-full bg-gradient-emerald text-primary-foreground flex items-center justify-center font-display shadow-soft">
                    {idx + 1}
                  </div>
                  <div className="text-xs text-accent mb-2 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    سورة {surahMap[v.surah_number] || v.surah_number} • آية {v.verse_number}
                  </div>
                  <p className="font-quran text-2xl leading-loose text-foreground" dir="rtl">
                    {v.text_ar}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(v.cls.tags || []).slice(0, 3).map(t => (
                      <Badge key={t} variant="outline" className="text-accent text-xs">{t}</Badge>
                    ))}
                    {(v.cls.educational_effects || []).slice(0, 2).map(e => (
                      <Badge key={e} variant="secondary" className="gap-1 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100 text-xs">
                        <Heart className="w-3 h-3" />{e.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
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