import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/falah/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { domains } from "@/data/falah";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { VerseOfTheDay } from "@/components/falah/VerseOfTheDay";
import { StatsBar } from "@/components/falah/StatsBar";
import { TaskForm } from "@/components/falah/TaskForm";
import { TaskList, type Task } from "@/components/falah/TaskList";
import { JournalForm } from "@/components/falah/JournalForm";
import { Achievements } from "@/components/falah/Achievements";
import { calcLevel } from "@/lib/falah-points";

type Scores = Record<number, number>;

const AppHome = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<Scores>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [habitCount, setHabitCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [domainFilter, setDomainFilter] = useState<number | null>(null);

  const loadAll = useCallback(async () => {
    if (!user) return;
    const [t, p, hc, ds] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("user_progress").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("habit_completions").select("date,points_earned").eq("user_id", user.id),
      supabase.from("domain_scores").select("domain_id,score").eq("user_id", user.id),
    ]);
    setTasks((t.data as Task[]) || []);
    setPoints(p.data?.total_points || 0);
    setStreak(p.data?.streak_days || 0);
    setHabitCount(hc.data?.length || 0);
    if (ds.data) setScores(Object.fromEntries(ds.data.map((d) => [d.domain_id, d.score])));
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const addPoints = async (pts: number) => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const newTotal = points + pts;
    const newLevel = calcLevel(newTotal);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const { data: cur } = await supabase.from("user_progress").select("last_activity_date,streak_days").eq("user_id", user.id).maybeSingle();
    let newStreak = cur?.streak_days || 0;
    if (cur?.last_activity_date !== today) {
      newStreak = cur?.last_activity_date === yesterday ? newStreak + 1 : 1;
    }
    await supabase.from("user_progress").upsert({
      user_id: user.id, total_points: newTotal, level: newLevel, streak_days: newStreak, last_activity_date: today,
    });
    setPoints(newTotal); setStreak(newStreak);
  };

  const setScore = async (id: number, val: number) => {
    if (!user) return;
    setScores((s) => ({ ...s, [id]: val }));
    const week = new Date().toISOString().slice(0, 10);
    await supabase.from("domain_scores").upsert(
      { user_id: user.id, domain_id: id, score: val, week_of: week },
      { onConflict: "user_id,domain_id,week_of" }
    );
  };

  const overall = Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / (domains.length * 10)) * 100) || 0;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const filtered = tasks.filter((t) => {
    if (filter === "active" && t.status !== "active") return false;
    if (filter === "done" && t.status !== "done") return false;
    if (domainFilter && t.domain_id !== domainFilter) return false;
    return true;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 space-y-6">
        <header>
          <p className="text-accent text-sm tracking-widest mb-2">لوحة الفلاح</p>
          <h1 className="font-display text-3xl md:text-4xl text-primary">رحلتك اليومية</h1>
        </header>

        <StatsBar tasks={tasks.length} completed={completedTasks} points={points} level={calcLevel(points)} />

        <div className="grid md:grid-cols-2 gap-5">
          <VerseOfTheDay />
          <Card className="p-6 bg-gradient-emerald text-primary-foreground shadow-elegant">
            <div className="flex items-center gap-2 mb-3 opacity-80">
              <Heart className="w-4 h-4" /> <span className="text-sm">مقياس الفلاح الشامل</span>
            </div>
            <div className="font-display text-5xl mb-3 text-gradient-gold">{overall}%</div>
            <Progress value={overall} className="h-2 bg-primary-foreground/15" />
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid grid-cols-4 w-full h-auto">
            <TabsTrigger value="tasks">📋 المهام</TabsTrigger>
            <TabsTrigger value="domains">🌿 المجالات</TabsTrigger>
            <TabsTrigger value="journal">🌅 اليومية</TabsTrigger>
            <TabsTrigger value="achievements">🏆 الإنجازات</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4 mt-4">
            <TaskForm userId={user.id} onCreated={loadAll} />
            <div className="flex flex-wrap gap-2">
              {(["all", "active", "done"] as const).map((f) => (
                <Badge key={f} variant={filter === f ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter(f)}>
                  {f === "all" ? "الكل" : f === "active" ? "نشطة" : "منجزة"}
                </Badge>
              ))}
              {domainFilter && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setDomainFilter(null)}>
                  ✕ {domains.find((d) => d.id === domainFilter)?.title}
                </Badge>
              )}
            </div>
            <TaskList tasks={filtered} onChange={loadAll} onComplete={addPoints} />
          </TabsContent>

          <TabsContent value="domains" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {domains.map((d) => {
                const dTasks = tasks.filter((t) => t.domain_id === d.id);
                const dDone = dTasks.filter((t) => t.status === "done").length;
                const pct = dTasks.length ? Math.round((dDone / dTasks.length) * 100) : 0;
                const v = scores[d.id] ?? 5;
                return (
                  <Card key={d.id} className="p-5 bg-gradient-card shadow-soft">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display text-lg text-primary cursor-pointer hover:underline" onClick={() => setDomainFilter(d.id)}>{d.title}</h3>
                        <p className="text-xs text-accent">{d.subtitle}</p>
                      </div>
                      <span className="font-display text-2xl text-gradient-gold">{v}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{dDone}/{dTasks.length} مهام • {pct}%</p>
                    <Progress value={pct} className="h-1.5 mb-3" />
                    <Slider value={[v]} min={1} max={10} step={1} onValueChange={(val) => setScore(d.id, val[0])} />
                  </Card>
                );
              })}
            </div>
            <div className="text-center pt-4">
              <Button onClick={() => toast.success("تم حفظ تقييمك")} className="bg-gradient-emerald text-primary-foreground px-8">
                حفظ تقرير الفلاح الأسبوعي
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="mt-4">
            <JournalForm userId={user.id} onPointsEarned={addPoints} />
          </TabsContent>

          <TabsContent value="achievements" className="mt-4">
            <Achievements points={points} habitCount={habitCount} streak={streak} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AppHome;
