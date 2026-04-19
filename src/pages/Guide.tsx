import { useState } from "react";
import { Navbar } from "@/components/falah/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { domains } from "@/data/falah";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, BookOpen, Heart, ListChecks, Loader2, Plus } from "lucide-react";

const STORAGE_CUSTOM_HABITS = "falah_custom_habits_v1";

interface Guidance {
  verse_arabic: string;
  verse_reference: string;
  domain: string;
  reflection: string;
  actions: string[];
  dua: string;
}

const moods = ["مطمئن", "قلِق", "حزين", "متعب", "متحمّس", "مشتّت", "ممتنّ", "محبَط"];

const Guide = () => {
  const [mood, setMood] = useState<string>("");
  const [situation, setSituation] = useState("");
  const [domain, setDomain] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Guidance | null>(null);

  const handleSubmit = async () => {
    if (!mood && !situation) {
      toast.error("صف حالك أو اختر شعورك أولاً");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("falah-guide", {
        body: { mood, situation, domain },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setResult(data.guidance);
    } catch (e: any) {
      toast.error(e?.message || "حدث خطأ، حاول مجددًا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12 max-w-4xl">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent">مرشد الفلاح الذكي</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-3">
            ما حالك اليوم؟
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            صف لنا شعورك أو موقفك، ويختار لك مرشد الفلاح آيةً، تأمّلًا، وثلاث خطوات عملية.
          </p>
        </header>

        <Card className="p-6 md:p-8 bg-gradient-card shadow-soft mb-8">
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block text-primary">الشعور الغالب</Label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`px-4 py-1.5 rounded-full text-sm transition-smooth border ${
                      mood === m
                        ? "bg-gradient-emerald text-primary-foreground border-primary shadow-soft"
                        : "bg-background border-border hover:border-accent text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="situation" className="mb-2 block text-primary">
                صِف موقفك (اختياري)
              </Label>
              <Textarea
                id="situation"
                placeholder="مثال: أواجه ضغطًا في العمل وأشعر بفقدان التركيز..."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div>
              <Label className="mb-2 block text-primary">المجال المهتم به (اختياري)</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مجالًا من المجالات الثمانية" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((d) => (
                    <SelectItem key={d.id} value={d.title}>
                      {d.title} — {d.subtitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="lg"
              className="w-full bg-gradient-emerald text-primary-foreground shadow-elegant hover:opacity-90"
            >
              {loading ? (
                <><Loader2 className="ml-2 w-4 h-4 animate-spin" /> يستلهم المرشد...</>
              ) : (
                <><Sparkles className="ml-2 w-4 h-4" /> اطلب الإرشاد</>
              )}
            </Button>
          </div>
        </Card>

        {result && (
          <div className="space-y-5 animate-float-in">
            <Card className="p-8 bg-gradient-emerald text-primary-foreground shadow-elegant text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-4 opacity-70" />
              <p className="font-quran text-2xl md:text-3xl leading-loose mb-4">
                ﴿ {result.verse_arabic} ﴾
              </p>
              <p className="text-sm text-accent-glow">{result.verse_reference}</p>
              <p className="mt-3 text-xs opacity-75">المجال: {result.domain}</p>
            </Card>

            <Card className="p-7 bg-gradient-card shadow-soft">
              <div className="flex items-center gap-2 mb-3 text-accent">
                <Heart className="w-4 h-4" /><span className="text-sm font-medium">تأمّل</span>
              </div>
              <p className="text-foreground leading-relaxed">{result.reflection}</p>
            </Card>

            <Card className="p-7 bg-card shadow-soft">
              <div className="flex items-center gap-2 mb-4 text-accent">
                <ListChecks className="w-4 h-4" /><span className="text-sm font-medium">سلوكيات اليوم</span>
              </div>
              <ul className="space-y-3">
                {result.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-emerald text-primary-foreground font-display text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-foreground leading-relaxed pt-0.5">{a}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => {
                  const today = new Date().toDateString();
                  const stored = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_HABITS) || "{}");
                  const existing = stored.date === today ? stored.items : [];
                  const newItems = result.actions.map((label, i) => ({
                    id: `guide_${Date.now()}_${i}`,
                    label,
                    domain: 1,
                  }));
                  localStorage.setItem(
                    STORAGE_CUSTOM_HABITS,
                    JSON.stringify({ date: today, items: [...existing, ...newItems] })
                  );
                  toast.success("أُضيفت السلوكيات إلى عادات اليوم");
                }}
                variant="outline"
                className="w-full mt-5 border-accent/40 text-accent hover:bg-accent/10"
              >
                <Plus className="ml-2 w-4 h-4" /> أضف هذه السلوكيات إلى عادات اليوم
              </Button>
            </Card>

            <Card className="p-7 ornament-border bg-card shadow-soft text-center">
              <p className="text-xs text-accent tracking-widest mb-3">دعاء</p>
              <p className="font-quran text-xl text-primary leading-loose">{result.dua}</p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Guide;
