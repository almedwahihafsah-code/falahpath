import { useEffect, useState } from "react";
import { Navbar } from "@/components/falah/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ClassificationForm } from "@/components/quran/ClassificationForm";
import { ClassificationChips } from "@/components/quran/ClassificationChips";
import { Navigate } from "react-router-dom";

const QuranAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [classifications, setClassifications] = useState<Record<string, any>>({});
  const [editing, setEditing] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "unclassified" | "classified">("unclassified");

  useEffect(() => {
    if (!user) return;
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const load = async () => {
    const { data: vs } = await supabase.from("verses").select("*").eq("surah_number", 2).order("verse_number");
    setVerses(vs || []);
    const { data: cs } = await supabase.from("verse_classifications").select("*");
    const map: Record<string, any> = {};
    cs?.forEach(c => { map[c.verse_id] = c; });
    setClassifications(map);
  };
  useEffect(() => { load(); }, []);

  if (isAdmin === false) return <Navigate to="/quran" replace />;
  if (isAdmin === null) return null;

  const filtered = verses.filter(v => {
    if (filter === "classified") return !!classifications[v.id];
    if (filter === "unclassified") return !classifications[v.id];
    return true;
  });

  const total = verses.length;
  const done = verses.filter(v => classifications[v.id]).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 space-y-5">
        <header>
          <p className="text-accent text-sm tracking-widest mb-1">إدارة التصنيف</p>
          <h1 className="font-display text-3xl text-primary">تصنيف آيات سورة البقرة</h1>
          <p className="text-sm text-muted-foreground mt-1">{done} / {total} آية مصنّفة ({Math.round(done/total*100)}%)</p>
        </header>

        <div className="flex gap-2 flex-wrap">
          {(["unclassified","classified","all"] as const).map(f => (
            <Badge key={f} variant={filter === f ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter(f)}>
              {f === "all" ? "الكل" : f === "classified" ? "مصنّفة" : "غير مصنّفة"}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.slice(0, 50).map(v => (
            <Card key={v.id} className="p-4 flex items-start gap-4">
              <div className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">{v.verse_number}</div>
              <div className="flex-1">
                <p className="font-quran text-lg leading-loose mb-2" dir="rtl">{v.text_ar}</p>
                <ClassificationChips classification={classifications[v.id]} />
              </div>
              <Button size="sm" onClick={() => setEditing(v)}>{classifications[v.id] ? "تعديل" : "تصنيف"}</Button>
            </Card>
          ))}
          {filtered.length > 50 && <p className="text-center text-sm text-muted-foreground">يُعرض أول 50 آية. استخدم الفلاتر للتركيز.</p>}
        </div>
      </main>

      <ClassificationForm
        open={!!editing}
        onClose={() => setEditing(null)}
        verse={editing}
        existing={editing ? classifications[editing.id] : null}
        onSaved={load}
      />
    </div>
  );
};

export default QuranAdmin;
