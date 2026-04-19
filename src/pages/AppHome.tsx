import { useEffect, useState } from "react";
import { Navbar } from "@/components/falah/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { domains } from "@/data/falah";
import { CheckCircle2, Heart } from "lucide-react";
import { toast } from "sonner";

type Scores = Record<number, number>;
type Habits = Record<string, boolean>;

const STORAGE_SCORES = "falah_scores_v1";
const STORAGE_HABITS = "falah_habits_v1";
const STORAGE_CUSTOM_HABITS = "falah_custom_habits_v1";

const baseHabits = [
  { id: "fajr", label: "صلاة الفجر في وقتها", domain: 1 },
  { id: "wird", label: "وِرد قرآني (10 دقائق)", domain: 1 },
  { id: "walk", label: "نشاط بدني (30 دقيقة)", domain: 2 },
  { id: "read", label: "قراءة نافعة (30 دقيقة)", domain: 3 },
  { id: "work", label: "إتقان مهمة عمل واحدة", domain: 4 },
  { id: "sadaqa", label: "صدقة ولو يسيرة", domain: 5 },
  { id: "family", label: "وقت جودة مع الأسرة", domain: 6 },
  { id: "help", label: "إحسان لشخصٍ ما", domain: 7 },
  { id: "sabr", label: "محاسبة وشكر قبل النوم", domain: 8 },
];

const AppHome = () => {
  const [scores, setScores] = useState<Scores>(() =>
    JSON.parse(localStorage.getItem(STORAGE_SCORES) || "{}")
  );
  const [habits, setHabits] = useState<Habits>(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_HABITS) || "{}");
    const today = new Date().toDateString();
    return stored.date === today ? stored.habits : {};
  });
  const [customHabits, setCustomHabits] = useState<{ id: string; label: string; domain: number }[]>(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_HABITS) || "{}");
    const today = new Date().toDateString();
    return stored.date === today ? stored.items : [];
  });

  const dailyHabits = [...baseHabits, ...customHabits];

  // Sync customHabits if changed in another tab/page
  useEffect(() => {
    const sync = () => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_HABITS) || "{}");
      const today = new Date().toDateString();
      setCustomHabits(stored.date === today ? stored.items : []);
    };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_SCORES, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_HABITS,
      JSON.stringify({ date: new Date().toDateString(), habits })
    );
  }, [habits]);

  const setScore = (id: number, val: number) => setScores((s) => ({ ...s, [id]: val }));
  const overall = Math.round(
    (Object.values(scores).reduce((a, b) => a + b, 0) / (domains.length * 10)) * 100
  ) || 0;

  const completed = Object.values(habits).filter(Boolean).length;
  const dailyPct = Math.round((completed / dailyHabits.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <header className="mb-10">
          <p className="text-accent text-sm tracking-widest mb-2">لوحة الفلاح</p>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">رحلتك اليومية</h1>
          <p className="text-muted-foreground">قِس فلاحك، تابع عاداتك، واسعَ بثبات.</p>
        </header>

        {/* Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="p-7 bg-gradient-emerald text-primary-foreground shadow-elegant">
            <div className="flex items-center gap-2 mb-3 opacity-80">
              <Heart className="w-4 h-4" /> <span className="text-sm">مقياس الفلاح الشامل</span>
            </div>
            <div className="font-display text-6xl mb-3 text-gradient-gold">{overall}%</div>
            <Progress value={overall} className="h-2 bg-primary-foreground/15" />
            <p className="text-sm opacity-75 mt-3">متوسط تقييمك في المجالات الثمانية.</p>
          </Card>
          <Card className="p-7 bg-gradient-card shadow-soft">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-accent" /> <span className="text-sm">عادات اليوم</span>
            </div>
            <div className="font-display text-6xl text-primary mb-3">
              {completed}<span className="text-3xl text-muted-foreground">/{dailyHabits.length}</span>
            </div>
            <Progress value={dailyPct} className="h-2" />
            <p className="text-sm text-muted-foreground mt-3">تتجدّد العادات كل يوم.</p>
          </Card>
        </div>

        {/* Daily habits */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-primary mb-5">عادات اليوم</h2>
          <Card className="p-6 bg-card shadow-soft divide-y divide-border/60">
            {dailyHabits.map((h) => {
              const checked = !!habits[h.id];
              return (
                <label
                  key={h.id}
                  className="flex items-center gap-4 py-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => {
                      setHabits((prev) => ({ ...prev, [h.id]: !!v }));
                      if (v) toast.success("بوركت — خطوة نحو الفلاح");
                    }}
                  />
                  <span className={`flex-1 ${checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {h.label}
                  </span>
                  <span className="text-xs text-accent">
                    {domains.find((d) => d.id === h.domain)?.title}
                  </span>
                </label>
              );
            })}
          </Card>
        </section>

        {/* Domain scoring */}
        <section>
          <h2 className="font-display text-2xl text-primary mb-5">قَيِّم مجالاتك (1 – 10)</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {domains.map((d) => {
              const v = scores[d.id] ?? 5;
              return (
                <Card key={d.id} className="p-6 bg-gradient-card border-border/60 shadow-soft">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg text-primary">{d.title}</h3>
                      <p className="text-xs text-accent">{d.subtitle}</p>
                    </div>
                    <span className="font-display text-3xl text-gradient-gold">{v}</span>
                  </div>
                  <p className="font-quran text-sm text-primary/70 mb-4 leading-loose">﴿ {d.quote} ﴾</p>
                  <Slider
                    value={[v]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(val) => setScore(d.id, val[0])}
                  />
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Button
              onClick={() => toast.success("تم حفظ تقييمك الأسبوعي")}
              size="lg"
              className="bg-gradient-emerald text-primary-foreground shadow-elegant px-10"
            >
              حفظ تقرير الفلاح الأسبوعي
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AppHome;
