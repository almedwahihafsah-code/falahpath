import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Scale, Sparkles } from "lucide-react";
import {
  FUNCTION_POINTS,
  ALL_FUNCTIONS,
  fetchFunctionStats,
  computeBalance,
  type FunctionStat,
} from "@/lib/function-points";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  userId: string;
  /** bump to force refresh after an external action */
  refreshKey?: number;
}

export const LifeBalanceMeter = ({ userId, refreshKey = 0 }: Props) => {
  const [stats, setStats] = useState<FunctionStat[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const s = await fetchFunctionStats(userId);
    setStats(s);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load, refreshKey]);

  // Realtime: refresh when new engagements arrive
  useEffect(() => {
    const ch = supabase
      .channel(`fe-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "function_engagements", filter: `user_id=eq.${userId}` },
        () => load()
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, load]);

  const { totalPoints, engagedCount, balance } = computeBalance(stats);

  return (
    <Card className="p-5 bg-gradient-card shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-accent" />
          <h3 className="font-display text-lg text-primary">ميزان توازن الحياة</h3>
        </div>
        <Badge variant="outline" className="text-xs gap-1">
          <Sparkles className="w-3 h-3" /> {totalPoints} نقطة
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        كل تفاعل مع آية يضيف نقاطًا حسب وظيفتها الخطابية (أمر، وعد، قصة...). كلما توازنت
        تفاعلاتك بين الوظائف، ارتفع مؤشر التوازن.
      </p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-muted-foreground">مؤشر التوازن</span>
          <span className="font-display text-2xl text-gradient-gold">{balance}%</span>
        </div>
        <Progress value={balance} className="h-3" />
        <p className="text-[10px] text-muted-foreground mt-1.5">
          غطّيت {engagedCount} من {ALL_FUNCTIONS.length} وظائف خطابية
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {stats.map((s) => {
          const meta = FUNCTION_POINTS[s.fn];
          if (!meta) return null;
          // per-function bar caps at 5 engagements (~40 pts)
          const pct = Math.min(100, (s.count / 5) * 100);
          const dim = s.count === 0;
          return (
            <div
              key={s.fn}
              className={`rounded-md border border-border/50 p-2 transition-opacity ${dim ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-foreground">
                  {meta.emoji} {s.fn}
                </span>
                <span className="text-muted-foreground">{s.count}×</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: meta.color }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{meta.dimension} • {s.points} ن</p>
            </div>
          );
        })}
      </div>

      {loading && <p className="text-xs text-muted-foreground text-center mt-3">...جارٍ التحميل</p>}
    </Card>
  );
};