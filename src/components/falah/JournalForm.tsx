import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { habitPoints } from "@/lib/falah-points";

const worship = [
  { key: "fajr", label: "صلاة الفجر" },
  { key: "dhuhr", label: "صلاة الظهر" },
  { key: "asr", label: "صلاة العصر" },
  { key: "maghrib", label: "صلاة المغرب" },
  { key: "isha", label: "صلاة العشاء" },
  { key: "wird", label: "وِرد قرآني" },
  { key: "sadaqa", label: "صدقة" },
  { key: "walk", label: "نشاط بدني" },
  { key: "read", label: "قراءة نافعة" },
  { key: "sabr", label: "محاسبة وشكر" },
];

interface Props {
  userId: string;
  onPointsEarned: (pts: number) => void;
}

export const JournalForm = ({ userId, onPointsEarned }: Props) => {
  const today = new Date().toISOString().slice(0, 10);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [juz, setJuz] = useState(0);
  const [reflection, setReflection] = useState(0);
  const [peace, setPeace] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: hc } = await supabase.from("habit_completions").select("habit_key").eq("user_id", userId).eq("date", today);
      if (hc) setCompleted(Object.fromEntries(hc.map((h) => [h.habit_key, true])));
      const { data: j } = await supabase.from("daily_journal").select("*").eq("user_id", userId).eq("date", today).maybeSingle();
      if (j) {
        setJuz(Number(j.quran_juz) || 0);
        setReflection(j.reflection_minutes || 0);
        setPeace(j.peace_level || 5);
        setEnergy(j.energy_level || 5);
        setNote(j.note || "");
      }
    })();
  }, [userId, today]);

  const toggleHabit = async (key: string) => {
    const isOn = completed[key];
    if (isOn) {
      await supabase.from("habit_completions").delete().eq("user_id", userId).eq("habit_key", key).eq("date", today);
      setCompleted((p) => ({ ...p, [key]: false }));
    } else {
      const pts = habitPoints[key] || 10;
      const { error } = await supabase.from("habit_completions").insert({ user_id: userId, habit_key: key, date: today, points_earned: pts });
      if (error) return toast.error("خطأ");
      setCompleted((p) => ({ ...p, [key]: true }));
      onPointsEarned(pts);
      toast.success(`+${pts} نقطة — بوركت`);
    }
  };

  const save = async () => {
    setLoading(true);
    const { error } = await supabase.from("daily_journal").upsert({
      user_id: userId, date: today, quran_juz: juz, reflection_minutes: reflection,
      peace_level: peace, energy_level: energy, note: note.trim() || null,
    }, { onConflict: "user_id,date" });
    setLoading(false);
    if (error) return toast.error("تعذّر الحفظ");
    toast.success("تم حفظ يوميتك");
  };

  return (
    <div className="space-y-5">
      <Card className="p-5 bg-card shadow-soft">
        <h3 className="font-display text-lg text-primary mb-3">عبادات اليوم</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {worship.map((w) => (
            <label key={w.key} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/40 cursor-pointer">
              <Checkbox checked={!!completed[w.key]} onCheckedChange={() => toggleHabit(w.key)} />
              <span className={`flex-1 text-sm ${completed[w.key] ? "line-through text-muted-foreground" : ""}`}>{w.label}</span>
              <span className="text-xs text-accent">+{habitPoints[w.key] || 10}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-5 bg-gradient-card shadow-soft space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">قراءة القرآن (أجزاء)</span>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" onClick={() => setJuz(Math.max(0, +(juz - 0.25).toFixed(2)))}><Minus className="w-3 h-3" /></Button>
              <span className="font-display text-2xl text-primary w-12 text-center">{juz}</span>
              <Button size="icon" variant="outline" onClick={() => setJuz(+(juz + 0.25).toFixed(2))}><Plus className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">التأمل والتدبر (دقائق)</span>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" onClick={() => setReflection(Math.max(0, reflection - 5))}><Minus className="w-3 h-3" /></Button>
              <span className="font-display text-2xl text-primary w-12 text-center">{reflection}</span>
              <Button size="icon" variant="outline" onClick={() => setReflection(reflection + 5)}><Plus className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2"><span>الطمأنينة</span><span className="text-accent">{peace}/10</span></div>
          <Slider value={[peace]} min={1} max={10} step={1} onValueChange={(v) => setPeace(v[0])} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>قلق</span><span>مطمئن</span></div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2"><span>الطاقة</span><span className="text-accent">{energy}/10</span></div>
          <Slider value={[energy]} min={1} max={10} step={1} onValueChange={(v) => setEnergy(v[0])} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>متعب</span><span>نشيط</span></div>
        </div>
        <Textarea placeholder="ملاحظة اليوم (اختياري)" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
        <Button onClick={save} disabled={loading} className="w-full bg-gradient-emerald text-primary-foreground">حفظ اليومية</Button>
      </Card>
    </div>
  );
};
