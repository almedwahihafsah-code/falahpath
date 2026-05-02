import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Radar as RadarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { domains } from "@/data/falah";
import { domainCodeToFalah } from "@/data/quran/taxonomy";

interface Props {
  userId: string;
  scores: Record<number, number>; // weekly self-scores 1..10
  tasks: Array<{ domain_id?: number | null; status: string }>;
}

// Map free-text guidance_domain (Arabic) to one of the 8 Falah domains by title match.
const guideDomainToFalahId = (text?: string | null): number | null => {
  if (!text) return null;
  const t = text.trim();
  const hit = domains.find(
    (d) => t.includes(d.title) || d.title.includes(t) || t.includes(d.subtitle)
  );
  return hit?.id ?? null;
};

export const FalahRadar = ({ userId, scores, tasks }: Props) => {
  const [bookmarkCounts, setBookmarkCounts] = useState<Record<number, number>>({});
  const [guidanceCounts, setGuidanceCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      // 1) Bookmarks → verse_id → verse_classifications.domain_code → falah id
      const bm = await supabase
        .from("verse_bookmarks")
        .select("verse_id")
        .eq("user_id", userId);
      const verseIds = (bm.data || []).map((b: any) => b.verse_id);
      const bmCounts: Record<number, number> = {};
      if (verseIds.length) {
        const cls = await supabase
          .from("verse_classifications")
          .select("verse_id,domain_code")
          .in("verse_id", verseIds);
        (cls.data || []).forEach((c: any) => {
          const fid = c.domain_code ? domainCodeToFalah[c.domain_code] : null;
          if (fid) bmCounts[fid] = (bmCounts[fid] || 0) + 1;
        });
      }

      // 2) Guidance history → guidance_domain text → falah id
      const gh = await supabase
        .from("guidance_history")
        .select("guidance_domain,domain")
        .eq("user_id", userId);
      const gCounts: Record<number, number> = {};
      (gh.data || []).forEach((g: any) => {
        const fid =
          guideDomainToFalahId(g.guidance_domain) ?? guideDomainToFalahId(g.domain);
        if (fid) gCounts[fid] = (gCounts[fid] || 0) + 1;
      });

      if (!cancelled) {
        setBookmarkCounts(bmCounts);
        setGuidanceCounts(gCounts);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Build per-domain composite score (0..100)
  // Weights: self-score 40%, tasks 25%, bookmarks 20%, guidance 15%
  const maxBookmarks = Math.max(1, ...Object.values(bookmarkCounts));
  const maxGuidance = Math.max(1, ...Object.values(guidanceCounts));

  const data = domains.map((d) => {
    const dTasks = tasks.filter((t) => t.domain_id === d.id);
    const dDone = dTasks.filter((t) => t.status === "done").length;
    const taskPct = dTasks.length ? (dDone / dTasks.length) * 100 : 0;
    const selfPct = ((scores[d.id] ?? 0) / 10) * 100;
    const bmPct = ((bookmarkCounts[d.id] || 0) / maxBookmarks) * 100;
    const gPct = ((guidanceCounts[d.id] || 0) / maxGuidance) * 100;
    const composite = Math.round(
      selfPct * 0.4 + taskPct * 0.25 + bmPct * 0.2 + gPct * 0.15
    );
    // Short label to fit on radar axis
    const short = d.title.split(" و")[0];
    return {
      domain: short,
      fullTitle: d.title,
      score: composite,
      bookmarks: bookmarkCounts[d.id] || 0,
      guidance: guidanceCounts[d.id] || 0,
      tasks: dTasks.length,
    };
  });

  const overall = Math.round(data.reduce((a, b) => a + b.score, 0) / data.length);

  return (
    <Card className="p-5 bg-gradient-card shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RadarIcon className="w-4 h-4 text-accent" />
          <h3 className="font-display text-lg text-primary">رادار الفلاح</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          متوسط شامل: {overall}%
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        تصور مرئي لتقدمك في المجالات الثمانية بناءً على تقييمك الأسبوعي، مهامك،
        آياتك المحفوظة، وسجل الإرشاد.
      </p>
      <div className="w-full h-[340px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            جارٍ تحميل البيانات...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="78%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="domain"
                tick={{
                  fill: "hsl(var(--foreground))",
                  fontSize: 11,
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                stroke="hsl(var(--border))"
              />
              <Radar
                name="الفلاح"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.45}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number, _name, props: any) => {
                  const p = props.payload;
                  return [
                    `${value}% • مهام:${p.tasks} • محفوظات:${p.bookmarks} • إرشاد:${p.guidance}`,
                    p.fullTitle,
                  ];
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};