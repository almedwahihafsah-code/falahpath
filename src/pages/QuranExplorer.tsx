import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/falah/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SurahHeader } from "@/components/quran/SurahHeader";
import { VerseCard } from "@/components/quran/VerseCard";
import { ClassificationDrawer } from "@/components/quran/ClassificationDrawer";
import { ClassificationForm } from "@/components/quran/ClassificationForm";
import { FilterRail, type Filters } from "@/components/quran/FilterRail";
import { Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuranExplorer = () => {
  const { user } = useAuth();
  const [surahs, setSurahs] = useState<any[]>([]);
  const [surahNum, setSurahNum] = useState(2);
  const [verses, setVerses] = useState<any[]>([]);
  const [classifications, setClassifications] = useState<Record<string, any>>({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({ domains: [], functions: [], themes: [], tags: [], classifiedOnly: false });
  const [active, setActive] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scope, setScope] = useState<"single" | "all">("single");
  const [allVerses, setAllVerses] = useState<any[]>([]);
  const [allClassifications, setAllClassifications] = useState<Record<string, any>>({});
  const [allLoaded, setAllLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);

  useEffect(() => {
    supabase.from("surahs").select("*").order("number").then(({ data }) => setSurahs(data || []));
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const loadVerses = async () => {
    const { data: vs } = await supabase.from("verses").select("*").eq("surah_number", surahNum).order("verse_number");
    setVerses(vs || []);
    if (vs?.length) {
      const ids = vs.map(v => v.id);
      const { data: cs } = await supabase.from("verse_classifications").select("*").in("verse_id", ids);
      const map: Record<string, any> = {};
      cs?.forEach(c => { map[c.verse_id] = c; });
      setClassifications(map);
    }
  };
  useEffect(() => { loadVerses(); }, [surahNum]);

  const loadAll = async () => {
    const { data: vs } = await supabase.from("verses").select("*").order("surah_number").order("verse_number").limit(10000);
    setAllVerses(vs || []);
    const { data: cs } = await supabase.from("verse_classifications").select("*").limit(10000);
    const map: Record<string, any> = {};
    cs?.forEach(c => { map[c.verse_id] = c; });
    setAllClassifications(map);
    setAllLoaded(true);
  };
  useEffect(() => {
    if (scope === "all" && !allLoaded) loadAll();
  }, [scope, allLoaded]);

  useEffect(() => { setVisibleCount(100); }, [scope, filters, search]);

  const surah = surahs.find(s => s.number === surahNum);
  const surahMap = useMemo(() => {
    const m: Record<number, string> = {};
    surahs.forEach(s => { m[s.number] = s.name_ar; });
    return m;
  }, [surahs]);

  const sourceVerses = scope === "all" ? allVerses : verses;
  const sourceClassifications = scope === "all" ? allClassifications : classifications;
  const noFilters = !filters.domains.length && !filters.functions.length && !filters.themes.length && !filters.tags.length && !search.trim();
  const effectiveClassifiedOnly = scope === "all" && noFilters ? true : filters.classifiedOnly;

  const filtered = useMemo(() => sourceVerses.filter(v => {
    const c = sourceClassifications[v.id];
    if (effectiveClassifiedOnly && !c) return false;
    if (filters.domains.length && (!c || !filters.domains.includes(c.domain_code))) return false;
    if (filters.functions.length && (!c || !filters.functions.includes(c.function))) return false;
    if (filters.themes.length && (!c || !c.themes?.some((t: string) => filters.themes.includes(t)))) return false;
    if (filters.tags.length && (!c || !c.tags?.some((t: string) => filters.tags.includes(t)))) return false;
    if (search.trim()) {
      const s = search.trim();
      if (!v.text_ar.includes(s) && String(v.verse_number) !== s) return false;
    }
    return true;
  }), [sourceVerses, sourceClassifications, filters, search, effectiveClassifiedOnly]);

  const visible = scope === "all" ? filtered.slice(0, visibleCount) : filtered;
  const availableSurahsCount = useMemo(() => {
    const set = new Set<number>();
    allVerses.forEach(v => set.add(v.surah_number));
    return set.size;
  }, [allVerses]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-accent text-sm tracking-widest mb-1">منهج الفلاح القرآني</p>
            <h1 className="font-display text-3xl text-primary">مستكشف التصنيف القرآني</h1>
          </div>
          {isAdmin && (
            <Button asChild variant="outline"><a href="/quran/admin">لوحة الإدارة</a></Button>
          )}
        </header>

        <Card className="p-4 flex flex-wrap gap-3 items-center">
          <Tabs value={scope} onValueChange={(v) => setScope(v as "single" | "all")}>
            <TabsList>
              <TabsTrigger value="single">سورة واحدة</TabsTrigger>
              <TabsTrigger value="all">كل السور</TabsTrigger>
            </TabsList>
          </Tabs>
          {scope === "single" ? (
            <Select value={String(surahNum)} onValueChange={(v) => setSurahNum(+v)}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-80">
                {surahs.map(s => (
                  <SelectItem key={s.number} value={String(s.number)}>
                    {s.number}. {s.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground px-3 py-2 rounded-md bg-muted/40">
              {allLoaded ? `نتائج من كل السور المتاحة (${availableSurahsCount})` : "جارِ التحميل..."}
            </div>
          )}
          <Input placeholder="بحث في النص أو رقم الآية..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 min-w-48" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden gap-2"><Filter className="w-4 h-4" /> فلاتر</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto"><FilterRail filters={filters} setFilters={setFilters} /></SheetContent>
          </Sheet>
        </Card>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <aside className="hidden lg:block sticky top-20 self-start">
            <Card className="p-4"><FilterRail filters={filters} setFilters={setFilters} /></Card>
          </aside>

          <section className="space-y-3">
            {scope === "single" && surah && <SurahHeader surah={surah} />}
            {scope === "all" && (
              <Card className="p-5 bg-gradient-emerald text-primary-foreground text-center shadow-elegant">
                <h2 className="font-display text-2xl">نتائج موحّدة من كل السور</h2>
                <p className="text-sm opacity-80 mt-1">طبّق الفلاتر للبحث عبر جميع الآيات المصنّفة</p>
              </Card>
            )}
            <p className="text-sm text-muted-foreground text-center">
              {scope === "all"
                ? `${visible.length} معروضة من ${filtered.length} نتيجة (${sourceVerses.length} آية إجمالاً)`
                : `${filtered.length} من ${verses.length} آية`}
            </p>
            {visible.map(v => (
              <VerseCard
                key={v.id}
                verse={v}
                classification={sourceClassifications[v.id]}
                onClick={() => setActive(v)}
                surahName={scope === "all" ? surahMap[v.surah_number] : undefined}
              />
            ))}
            {scope === "all" && visible.length < filtered.length && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" onClick={() => setVisibleCount(c => c + 100)}>
                  تحميل المزيد ({filtered.length - visible.length} متبقية)
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      <ClassificationDrawer
        open={!!active}
        onClose={() => setActive(null)}
        verse={active}
        classification={active ? sourceClassifications[active.id] : null}
        isAdmin={isAdmin}
        onEdit={() => { setEditing(active); }}
      />
      <ClassificationForm
        open={!!editing}
        onClose={() => setEditing(null)}
        verse={editing}
        existing={editing ? sourceClassifications[editing.id] : null}
        onSaved={() => { loadVerses(); if (scope === "all") loadAll(); }}
      />
    </div>
  );
};

export default QuranExplorer;
