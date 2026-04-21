import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOMAINS, FUNCTIONS, THEMES, EFFECTS, TAGS, CONTEXTS } from "@/data/quran/taxonomy";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  verse: any;
  existing: any;
  onSaved: () => void;
}

export const ClassificationForm = ({ open, onClose, verse, existing, onSaved }: Props) => {
  const { user } = useAuth();
  const [domain, setDomain] = useState<string>("");
  const [func, setFunc] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [themes, setThemes] = useState<string[]>([]);
  const [effects, setEffects] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setDomain(existing.domain_code || "");
      setFunc(existing.function || "");
      setContext(existing.context || "");
      setThemes(existing.themes || []);
      setEffects(existing.educational_effects || []);
      setTags(existing.tags || []);
      setNotes(existing.notes || "");
    } else {
      setDomain(""); setFunc(""); setContext(""); setThemes([]); setEffects([]); setTags([]); setNotes("");
    }
  }, [existing, verse]);

  const toggle = (arr: string[], v: string, setter: (a: string[]) => void) =>
    setter(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const aiSuggest = async () => {
    if (!verse) return;
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("classify-verse", { body: { verse_id: verse.id } });
      if (error) throw error;
      const s = data.suggestion;
      if (s.domain_code) setDomain(s.domain_code);
      if (s.function) setFunc(s.function);
      if (s.context) setContext(s.context);
      if (s.themes) setThemes(s.themes);
      if (s.educational_effects) setEffects(s.educational_effects);
      if (s.tags) setTags(s.tags);
      if (s.notes) setNotes(s.notes);
      toast.success("اقتراح ذكي جاهز للمراجعة");
    } catch (e: any) {
      toast.error(e.message || "تعذّر الاقتراح");
    } finally { setAiLoading(false); }
  };

  const save = async () => {
    if (!user || !verse) return;
    setSaving(true);
    const payload = {
      verse_id: verse.id,
      domain_code: domain || null,
      function: func || null,
      context: context || null,
      themes, educational_effects: effects, tags,
      notes: notes || null,
      created_by: user.id,
    };
    const { error } = existing
      ? await supabase.from("verse_classifications").update(payload).eq("id", existing.id)
      : await supabase.from("verse_classifications").insert(payload);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("تم الحفظ"); onSaved(); onClose(); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تصنيف الآية {verse?.verse_number}</DialogTitle>
        </DialogHeader>
        {verse && <p className="font-quran text-lg leading-loose text-muted-foreground" dir="rtl">{verse.text_ar}</p>}

        <Button variant="outline" onClick={aiSuggest} disabled={aiLoading} className="gap-2">
          <Sparkles className="w-4 h-4" /> {aiLoading ? "جاري الاقتراح…" : "تصنيف بالذكاء الاصطناعي"}
        </Button>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>المجال</Label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger><SelectValue placeholder="اختر مجالًا" /></SelectTrigger>
              <SelectContent>{DOMAINS.map(d => <SelectItem key={d.code} value={d.code}>{d.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>الوظيفة الخطابية</Label>
            <Select value={func} onValueChange={setFunc}>
              <SelectTrigger><SelectValue placeholder="اختر وظيفة" /></SelectTrigger>
              <SelectContent>{FUNCTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>السياق</Label>
            <Select value={context} onValueChange={setContext}>
              <SelectTrigger><SelectValue placeholder="مكية / مدنية" /></SelectTrigger>
              <SelectContent>{CONTEXTS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <Multi label="المحاور" all={THEMES} selected={themes} onToggle={(v) => toggle(themes, v, setThemes)} />
        <Multi label="الأثر التربوي" all={EFFECTS} selected={effects} onToggle={(v) => toggle(effects, v, setEffects)} />
        <Multi label="العلامات الذكية" all={TAGS} selected={tags} onToggle={(v) => toggle(tags, v, setTags)} />

        <div>
          <Label>ملاحظات وتدبر</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={save} disabled={saving} className="bg-gradient-emerald text-primary-foreground">حفظ</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Multi = ({ label, all, selected, onToggle }: { label: string; all: string[]; selected: string[]; onToggle: (v: string) => void }) => (
  <div>
    <Label>{label}</Label>
    <div className="flex flex-wrap gap-1.5 mt-2">
      {all.map(v => (
        <Badge key={v} variant={selected.includes(v) ? "default" : "outline"} className="cursor-pointer" onClick={() => onToggle(v)}>{v}</Badge>
      ))}
    </div>
  </div>
);
