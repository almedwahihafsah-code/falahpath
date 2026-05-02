import { supabase } from "@/integrations/supabase/client";

/**
 * Points per rhetorical function. Each function strengthens a different
 * dimension of the "Life Balance" meter.
 */
export const FUNCTION_POINTS: Record<string, { points: number; dimension: string; emoji: string; color: string }> = {
  "أمر":    { points: 8, dimension: "العمل",     emoji: "⚡", color: "hsl(142 70% 45%)" },
  "نهي":    { points: 8, dimension: "الانضباط",  emoji: "🛡️", color: "hsl(0 70% 55%)" },
  "وعد":    { points: 6, dimension: "الرجاء",    emoji: "🌟", color: "hsl(45 90% 55%)" },
  "وعيد":   { points: 6, dimension: "اليقظة",    emoji: "🔔", color: "hsl(25 85% 55%)" },
  "قصة":    { points: 5, dimension: "العبرة",    emoji: "📖", color: "hsl(270 50% 60%)" },
  "مثل":    { points: 5, dimension: "البصيرة",   emoji: "💡", color: "hsl(200 70% 55%)" },
  "حوار":   { points: 4, dimension: "الحوار",    emoji: "💬", color: "hsl(180 60% 45%)" },
  "تقرير":  { points: 4, dimension: "اليقين",    emoji: "✅", color: "hsl(160 50% 45%)" },
  "تعزية":  { points: 5, dimension: "السكينة",   emoji: "🕊️", color: "hsl(210 60% 60%)" },
  "تحفيز":  { points: 6, dimension: "الهمّة",    emoji: "🚀", color: "hsl(15 85% 55%)" },
  "تصحيح":  { points: 5, dimension: "التزكية",   emoji: "🔄", color: "hsl(290 55% 55%)" },
};

export const ALL_FUNCTIONS = Object.keys(FUNCTION_POINTS);

/**
 * Award points for engaging with a verse based on its rhetorical function.
 * Uses the unique (user_id, verse_id, source) constraint so the same action
 * cannot be double-counted.
 */
export const awardFunctionPoints = async (
  userId: string,
  verseId: string,
  fn: string | null | undefined,
  source: "bookmark" | "guidance" | "view" = "bookmark"
): Promise<{ awarded: boolean; points: number; fn: string | null }> => {
  if (!fn || !FUNCTION_POINTS[fn]) return { awarded: false, points: 0, fn: null };
  const pts = FUNCTION_POINTS[fn].points;
  const { error } = await supabase
    .from("function_engagements")
    .insert({ user_id: userId, verse_id: verseId, function: fn, source, points: pts });
  // Duplicate (already awarded) → silently ignore
  if (error && !`${error.message}`.toLowerCase().includes("duplicate")) {
    return { awarded: false, points: 0, fn };
  }
  return { awarded: !error, points: pts, fn };
};

export interface FunctionStat {
  fn: string;
  count: number;
  points: number;
}

export const fetchFunctionStats = async (userId: string): Promise<FunctionStat[]> => {
  const { data } = await supabase
    .from("function_engagements")
    .select("function,points")
    .eq("user_id", userId);
  const map = new Map<string, FunctionStat>();
  for (const fn of ALL_FUNCTIONS) map.set(fn, { fn, count: 0, points: 0 });
  (data || []).forEach((r: any) => {
    const cur = map.get(r.function) || { fn: r.function, count: 0, points: 0 };
    cur.count += 1;
    cur.points += r.points || 0;
    map.set(r.function, cur);
  });
  return Array.from(map.values());
};

/**
 * Life Balance = how evenly the user engages across all functions, weighted
 * by total points. Returns 0..100. A high score means strong AND balanced.
 */
export const computeBalance = (stats: FunctionStat[]) => {
  const totalPoints = stats.reduce((s, x) => s + x.points, 0);
  const engagedCount = stats.filter((s) => s.count > 0).length;
  // Coverage 0..1 — how many distinct functions engaged
  const coverage = engagedCount / ALL_FUNCTIONS.length;
  // Strength 0..1 — saturates around 200 points
  const strength = Math.min(1, totalPoints / 200);
  // Balance is the geometric mean to penalize lopsided progress
  const balance = Math.round(Math.sqrt(coverage * strength) * 100);
  return { totalPoints, engagedCount, coverage, strength, balance };
};