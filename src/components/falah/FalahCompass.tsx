import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import {
  Heart, Activity, Brain, Sparkles, Wallet, Briefcase, Home, Users,
  Compass as CompassIcon, Scale, Target, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { domainCodeToFalah } from "@/data/quran/taxonomy";
import { LIFE_CONTEXTS } from "@/data/quran/contexts";

/**
 * The 8 axes of the Falah Compass.
 * Each axis maps to:
 *  - falahIds: ids in src/data/falah.ts (8 broader life domains)
 *  - domainCodes: Quranic taxonomy codes (A..F)
 *  - guideContextId: best matching Smart Guide context for "Explore" CTA
 */
interface CompassAxis {
  key: string;
  label: string;          // short Arabic label (radar axis)
  fullLabel: string;      // long label
  Icon: typeof Heart;
  falahIds: number[];     // domain ids contributing self-score / tasks
  domainCodes: string[];  // Quran classification domain_code(s)
  guideContextId: string; // contexts.ts id for CTA
  ctaLabel: string;
}

const AXES: CompassAxis[] = [
  { key: "heart",   label: "القلب",   fullLabel: "القلب",   Icon: Heart,     falahIds: [1],    domainCodes: ["A"],      guideContextId: "inner_peace",            ctaLabel: "مسار السكينة الداخلية" },
  { key: "body",    label: "الجسد",   fullLabel: "الجسد",   Icon: Activity,  falahIds: [2],    domainCodes: ["B"],      guideContextId: "trial",                  ctaLabel: "مسار العناية بالجسد" },
  { key: "mind",    label: "العقل",   fullLabel: "العقل",   Icon: Brain,     falahIds: [3],    domainCodes: ["D"],      guideContextId: "guidance",               ctaLabel: "مسار البصيرة والعلم" },
  { key: "spirit",  label: "الروح",   fullLabel: "الروح",   Icon: Sparkles,  falahIds: [1],    domainCodes: ["A"],      guideContextId: "self_correction",        ctaLabel: "مسار التزكية والتوبة" },
  { key: "wealth",  label: "المال",   fullLabel: "المال",   Icon: Wallet,    falahIds: [5],    domainCodes: ["E"],      guideContextId: "financial",              ctaLabel: "مسار الاستقرار المالي" },
  { key: "work",    label: "العمل",   fullLabel: "العمل",   Icon: Briefcase, falahIds: [4],    domainCodes: ["E"],      guideContextId: "leadership",             ctaLabel: "مسار القيادة والإتقان" },
  { key: "family",  label: "الأسرة",  fullLabel: "الأسرة",  Icon: Home,      falahIds: [6],    domainCodes: ["E"],      guideContextId: "family",                 ctaLabel: "مسار انسجام الأسرة" },
  { key: "society", label: "المجتمع", fullLabel: "المجتمع", Icon: Users,     falahIds: [7],    domainCodes: ["F", "E"], guideContextId: "leadership",             ctaLabel: "مسار الأثر في المجتمع" },
];

interface Props {
  userId: string;
  scores: Record<number, number>;                          // weekly self-scores 1..10 (falah ids)
  tasks: Array<{ domain_id?: number | null; status: string }>;
}

export const FalahCompass = ({ userId, scores, tasks }: Props) => {
  const [bookmarkByCode, setBookmarkByCode] = useState<Record<string, number>>({});
  const [guidanceByContext, setGuidanceByContext] = useState<Record<string, number>>({});
  const [pathCount, setPathCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      // Bookmarks → classifications → domain_code counts
      const bm = await supabase
        .from("verse_bookmarks").select("verse_id").eq("user_id", userId);
      const verseIds = (bm.data || []).map((b: any) => b.verse_id);
      const codeCounts: Record<string, number> = {};
      if (verseIds.length) {
        const cls = await supabase
          .from("verse_classifications")
          .select("verse_id,domain_code")
          .in("verse_id", verseIds);
        (cls.data || []).forEach((c: any) => {
          if (c.domain_code) codeCounts[c.domain_code] = (codeCounts[c.domain_code] || 0) + 1;
        });
      }

      // Guidance history → match free-text guidance_domain to a Smart Guide context
      const gh = await supabase
        .from("guidance_history")
        .select("guidance_domain,domain")
        .eq("user_id", userId);
      const ctxCounts: Record<string, number> = {};
      (gh.data || []).forEach((g: any) => {
        const txt = `${g.guidance_domain ?? ""} ${g.domain ?? ""}`.trim();
        if (!txt) return;
        const hit = LIFE_CONTEXTS.find(c =>
          txt.includes(c.title) || c.keywords.some(k => txt.includes(k))
        );
        if (hit) ctxCounts[hit.id] = (ctxCounts[hit.id] || 0) + 1;
      });

      if (!cancelled) {
        setBookmarkByCode(codeCounts);
        setGuidanceByContext(ctxCounts);
        // Path Completion = distinct guide contexts the user has explored
        setPathCount(Object.keys(ctxCounts).length);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // Per-axis composite score
  const data = useMemo(() => {
    const maxBm = Math.max(1, ...Object.values(bookmarkByCode));
    const maxGuide = Math.max(1, ...Object.values(guidanceByContext));
    return AXES.map((ax) => {
      // self-score (avg of mapped falah ids), 0..10 → 0..100
      const selfVals = ax.falahIds.map((id) => scores[id]).filter((v) => typeof v === "number") as number[];
      const selfPct = selfVals.length
        ? (selfVals.reduce((a, b) => a + b, 0) / selfVals.length) * 10
        : 0;
      // task completion %
      const dTasks = tasks.filter((t) => ax.falahIds.includes(t.domain_id ?? -1));
      const dDone = dTasks.filter((t) => t.status === "done").length;
      const taskPct = dTasks.length ? (dDone / dTasks.length) * 100 : 0;
      // bookmarks (sum across mapped codes, normalized)
      const bmRaw = ax.domainCodes.reduce((s, c) => s + (bookmarkByCode[c] || 0), 0);
      const bmPct = (bmRaw / maxBm) * 100;
      // guidance via mapped context id
      const gRaw = guidanceByContext[ax.guideContextId] || 0;
      const gPct = (gRaw / maxGuide) * 100;

      const score = Math.round(selfPct * 0.4 + taskPct * 0.25 + bmPct * 0.2 + gPct * 0.15);
      return { ...ax, score, bookmarks: bmRaw, guidance: gRaw, tasks: dTasks.length };
    });
  }, [scores, tasks, bookmarkByCode, guidanceByContext]);

  // Metrics
  const focusAxis = useMemo(
    () => [...data].sort((a, b) => b.score - a.score)[0],
    [data]
  );
  const lowestAxis = useMemo(
    () => [...data].sort((a, b) => a.score - b.score)[0],
    [data]
  );

  // Balance index — 100 - normalized stdev (higher = more balanced)
  const balance = useMemo(() => {
    if (!data.length) return 0;
    const vals = data.map((d) => d.score);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
    const stdev = Math.sqrt(variance);
    // stdev for 0..100 maxes near 50 → normalize against 50
    const balanced = Math.max(0, 100 - (stdev / 50) * 100);
    return Math.round(balanced);
  }, [data]);

  const showLowBanner = lowestAxis && lowestAxis.score < 30;

  return (
    <Card className="p-5 md:p-6 bg-card/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-elegant relative overflow-hidden">
      {/* tonal washes */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <CompassIcon className="w-5 h-5 text-accent" />
            <h3 className="font-display text-xl text-primary">بوصلة الفلاح</h3>
          </div>
          <Badge variant="outline" className="text-xs border-accent/40 text-accent bg-background/50">
            ٨ محاور للحياة
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          تتبع نموّك عبر المجالات الثمانية للحياة. تتغذى البوصلة من تقييمك الأسبوعي،
          مهامك، آياتك المحفوظة، ومسارات الإرشاد التي استكشفتها.
        </p>

        {/* Radar */}
        <div className="w-full h-[320px] md:h-[380px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              جارٍ تحميل بوصلتك...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} outerRadius="78%">
                <defs>
                  <radialGradient id="compass-fill" cx="50%" cy="50%" r="65%">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.55" />
                    <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                  </radialGradient>
                  <filter id="compass-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <PolarGrid stroke="hsl(var(--accent) / 0.25)" />
                <PolarAngleAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--primary))", fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  stroke="hsl(var(--border))"
                />
                <Radar
                  name="بوصلة الفلاح"
                  dataKey="score"
                  stroke="hsl(var(--accent))"
                  fill="url(#compass-fill)"
                  fillOpacity={1}
                  strokeWidth={2.5}
                  filter="url(#compass-glow)"
                  dot={{ r: 3, fill: "hsl(var(--accent))", stroke: "hsl(var(--primary))", strokeWidth: 1 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--accent) / 0.4)",
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: "var(--shadow-soft)",
                  }}
                  formatter={(value: number, _n, props: any) => {
                    const p = props.payload;
                    return [`${value}% • مهام:${p.tasks} • محفوظات:${p.bookmarks} • إرشاد:${p.guidance}`, p.fullLabel];
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <MetricCard
            Icon={Target}
            label="المجال الأكثر تركيزًا"
            value={focusAxis ? focusAxis.fullLabel : "—"}
            sub={focusAxis ? `${focusAxis.score}% من القوة` : ""}
            tone="emerald"
          />
          <MetricCard
            Icon={Scale}
            label="مؤشر التوازن"
            value={`${balance}%`}
            sub={balance >= 70 ? "توازن ممتاز" : balance >= 45 ? "توازن مقبول" : "بحاجة لإعادة التوزيع"}
            tone="gold"
          />
          <MetricCard
            Icon={CheckCircle2}
            label="إنجاز المسارات"
            value={`${pathCount}`}
            sub={pathCount === 0 ? "لم تستكشف مسارًا بعد" : pathCount === 1 ? "مسار واحد مكتمل" : `${pathCount} مسارات مكتملة`}
            tone="emerald"
          />
        </div>

        {/* Low-domain suggestion banner */}
        {!loading && showLowBanner && lowestAxis && (
          <div className="mt-4 rounded-xl border border-accent/40 bg-gradient-to-r from-accent/10 via-background to-primary/10 p-4 flex items-start gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-gradient-gold text-accent-foreground flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-primary font-medium">
                مجال <span className="text-accent">{lowestAxis.fullLabel}</span> يحتاج إلى تغذية.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                استكشف <strong>{lowestAxis.ctaLabel}</strong> في المرشد الذكي لتحريك بوصلتك نحو التوازن.
              </p>
            </div>
            <Button asChild size="sm" className="bg-gradient-emerald text-primary-foreground shrink-0">
              <Link to={`/guide?ctx=${lowestAxis.guideContextId}`}>استكشف الآن</Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

const MetricCard = ({
  Icon, label, value, sub, tone,
}: {
  Icon: typeof Heart;
  label: string;
  value: string;
  sub?: string;
  tone: "emerald" | "gold";
}) => (
  <div className="relative rounded-xl p-4 bg-card/70 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-soft overflow-hidden">
    <div
      className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none ${
        tone === "gold" ? "bg-accent/30" : "bg-primary/25"
      }`}
    />
    <div className="relative">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
        <Icon className={`w-3.5 h-3.5 ${tone === "gold" ? "text-accent" : "text-primary"}`} />
        {label}
      </div>
      <div className={`font-display text-xl md:text-2xl ${tone === "gold" ? "text-gradient-gold" : "text-primary"}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
    </div>
  </div>
);