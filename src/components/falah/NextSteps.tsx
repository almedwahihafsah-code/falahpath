import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { domains } from "@/data/falah";
import { domainCodeToFalah } from "@/data/quran/taxonomy";

interface Props {
  scores: Record<number, number>;
  tasks: Array<{ domain_id?: number | null; status: string }>;
}

interface SuggestedVerse {
  id: string;
  surah_number: number;
  verse_number: number;
  text_ar: string;
  function?: string | null;
  domain_code?: string | null;
}

// Reverse map: falah domain id (1..8) → quran domain codes (A..F)
const falahToCodes: Record<number, string[]> = (() => {
  const out: Record<number, string[]> = {};
  for (const [code, fid] of Object.entries(domainCodeToFalah)) {
    (out[fid] ||= []).push(code);
  }
  return out;
})();

export const NextSteps = ({ scores, tasks }: Props) => {
  const [verses, setVerses] = useState<SuggestedVerse[]>([]);
  const [loading, setLoading] = useState(true);

  // Composite per-domain score (self-score + task completion), pick lowest
  const ranked = useMemo(() => {
    return domains
      .map((d) => {
        const dTasks = tasks.filter((t) => t.domain_id === d.id);
        const done = dTasks.filter((t) => t.status === "done").length;
        const taskPct = dTasks.length ? (done / dTasks.length) * 10 : 0;
        const self = scores[d.id] ?? 0;
        // Heavier weight on self-score; if absent, treat as 0
        const composite = self * 0.7 + taskPct * 0.3;
        return { domain: d, composite, hasData: self > 0 || dTasks.length > 0 };
      })
      .sort((a, b) => a.composite - b.composite);
  }, [scores, tasks]);

  const target = ranked[0];
  const codes = target ? falahToCodes[target.domain.id] || [] : [];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (!codes.length) {
        setVerses([]);
        setLoading(false);
        return;
      }
      const cls = await supabase
        .from("verse_classifications")
        .select("verse_id,function,domain_code")
        .in("domain_code", codes)
        .limit(60);
      const ids = (cls.data || []).map((c: any) => c.verse_id);
      if (!ids.length) {
        if (!cancelled) { setVerses([]); setLoading(false); }
        return;
      }
      const v = await supabase
        .from("verses")
        .select("id,surah_number,verse_number,text_ar")
        .in("id", ids)
        .limit(60);
      const clsMap = new Map((cls.data || []).map((c: any) => [c.verse_id, c]));
      // Pick 3 random with priority for actionable functions
      const ACTIONABLE = new Set(["أمر", "تحفيز", "وعد", "تصحيح"]);
      const enriched = (v.data || []).map((row: any) => {
        const c = clsMap.get(row.id) as any;
        return {
          ...row,
          function: c?.function ?? null,
          domain_code: c?.domain_code ?? null,
        };
      });
      enriched.sort((a, b) => {
        const aw = ACTIONABLE.has(a.function || "") ? 1 : 0;
        const bw = ACTIONABLE.has(b.function || "") ? 1 : 0;
        if (aw !== bw) return bw - aw;
        return Math.random() - 0.5;
      });
      if (!cancelled) {
        setVerses(enriched.slice(0, 3));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.domain.id]);

  if (!target) return null;

  return (
    <Card className="p-5 bg-gradient-card shadow-soft border-accent/30">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-accent" />
          <h3 className="font-display text-lg text-primary">الخطوات التالية في رحلتك</h3>
        </div>
        <Badge variant="outline" className="text-[10px]">
          أضعف مجال: {target.domain.title}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {target.hasData ? (
          <>تقييمك في <span className="text-foreground font-medium">{target.domain.title}</span> منخفض ({Math.round(target.composite)}/10). إليك آيات مختارة لتغذية هذا الجانب.</>
        ) : (
          <>ابدأ مسارك من <span className="text-foreground font-medium">{target.domain.title}</span>: {target.domain.subtitle}.</>
        )}
      </p>

      {loading ? (
        <p className="text-xs text-muted-foreground text-center py-4">...نختار لك آيات مناسبة</p>
      ) : verses.length === 0 ? (
        <div className="text-center py-4 space-y-2">
          <p className="text-xs text-muted-foreground">لا توجد آيات مصنّفة لهذا المجال بعد.</p>
          <Button asChild size="sm" variant="outline">
            <Link to="/quran">استكشف القرآن</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5 mb-3">
          {verses.map((v) => (
            <Link
              key={v.id}
              to={`/quran?surah=${v.surah_number}&ayah=${v.verse_number}`}
              className="block rounded-md bg-background/50 border border-border/50 p-3 hover:border-accent/60 hover:shadow-soft transition-smooth group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] text-accent font-medium">
                  {v.surah_number}:{v.verse_number}
                </span>
                {v.function && (
                  <Badge variant="secondary" className="text-[10px] h-5">
                    <Sparkles className="w-2.5 h-2.5 me-1" />{v.function}
                  </Badge>
                )}
              </div>
              <p
                className="font-quran text-base text-foreground line-clamp-2 leading-relaxed"
                dir="rtl"
              >
                {v.text_ar}
              </p>
            </Link>
          ))}
        </div>
      )}

      <Button asChild variant="ghost" size="sm" className="w-full text-xs gap-1">
        <Link to={`/quran?domain=${codes[0] || ""}`}>
          المزيد من آيات {target.domain.title} <ArrowLeft className="w-3 h-3" />
        </Link>
      </Button>
    </Card>
  );
};