import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/falah/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SurahHeader } from "@/components/quran/SurahHeader";
import { VerseCard } from "@/components/quran/VerseCard";
import { ClassificationDrawer } from "@/components/quran/ClassificationDrawer";
import { ClassificationForm } from "@/components/quran/ClassificationForm";
import { FilterRail, type Filters } from "@/components/quran/FilterRail";
import { Filter, Search, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [surahPickerOpen, setSurahPickerOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.from("surahs").select("*").order("number").then(({ data }) => setSurahs(data || []));
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    if (!user) { setBookmarks(new Set()); return; }
    supabase.from("verse_bookmarks").select("verse_id").eq("user_id", user.id)
      .then(({ data }) => setBookmarks(new Set((data || []).map((b: any) => b.verse_id))));
  }, [user]);

  const handleBookmarkToggle = (verseId: string, next: boolean) => {
    setBookmarks(prev => {
      const s = new Set(prev);
      if (next) s.add(verseId); else s.delete(verseId);
      return s;
    });
  };

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

  // Auto-switch to "all surahs" scope when user types a search query
  useEffect(() => {
    if (search.trim() && scope === "single") {
      setScope("all");
    }
  }, [search]);

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

  // Arabic-aware normalization: strip diacritics, unify Alif/Yaa/Taa-Marbuta variants, optionally strip leading Alif-Lam
  const normalizeArabic = (t: string, stripAlifLam = false) => {
    let s = t
      .replace(/[\u064B-\u0652\u0670\u0640]/g, "") // tashkeel + tatweel
      .replace(/[إأآا]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/ة/g, "ه");
    if (stripAlifLam) s = s.replace(/\bال/g, "");
    return s.trim();
  };

  const filtered = useMemo(() => sourceVerses.filter(v => {
    const c = sourceClassifications[v.id];
    if (effectiveClassifiedOnly && !c) return false;
    if (filters.domains.length && (!c || !filters.domains.includes(c.domain_code))) return false;
    if (filters.functions.length && (!c || !filters.functions.includes(c.function))) return false;
    if (filters.themes.length && (!c || !c.themes?.some((t: string) => filters.themes.includes(t)))) return false;
    if (filters.tags.length && (!c || !c.tags?.some((t: string) => filters.tags.includes(t)))) return false;
    if (search.trim()) {
      const s = search.trim();
      // Support: "2:255", "البقرة 255", "البقرة:255", surah name only, verse number only, or text
      const colonMatch = s.match(/^(\d+)\s*[:\-]\s*(\d+)$/);
      const nameNumMatch = s.match(/^(.+?)[\s:\-]+(\d+)$/);
      const surahName = surahMap[v.surah_number] || "";
      const surahNameNoAl = surahName.replace(/^ال/, "");
      const verseTextNorm = normalizeArabic(v.text_ar, true);
      const sNorm = normalizeArabic(s, true);
      const surahNameNorm = normalizeArabic(surahName, true);

      if (colonMatch) {
        if (v.surah_number !== +colonMatch[1] || v.verse_number !== +colonMatch[2]) return false;
      } else if (nameNumMatch && isNaN(+nameNumMatch[1])) {
        const name = nameNumMatch[1].trim();
        const num = +nameNumMatch[2];
        if (v.verse_number !== num) return false;
        const nameNorm = normalizeArabic(name, true);
        if (!surahNameNorm.includes(nameNorm)) return false;
      } else if (/^\d+$/.test(s)) {
        if (String(v.verse_number) !== s) return false;
      } else {
        const matchesText = verseTextNorm.includes(sNorm);
        const matchesSurah = surahNameNorm.includes(sNorm);
        if (!matchesText && !matchesSurah) return false;
      }
    }
    return true;
  }), [sourceVerses, sourceClassifications, filters, search, effectiveClassifiedOnly, surahMap]);

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

        <Card className="p-4 space-y-3 shadow-elegant">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder='ابحث في كل الآيات: "الحكمة"، "الصبر"، 2:255، أو "البقرة 255"...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pr-11 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
          <Tabs value={scope} onValueChange={(v) => setScope(v as "single" | "all")}>
            <TabsList>
              <TabsTrigger value="single">سورة واحدة</TabsTrigger>
              <TabsTrigger value="all">كل السور</TabsTrigger>
            </TabsList>
          </Tabs>
          {scope === "single" ? (
            <Popover open={surahPickerOpen} onOpenChange={setSurahPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-56 justify-between">
                  {surah ? `${surah.number}. ${surah.name_ar}` : "اختر سورة..."}
                  <ChevronsUpDown className="ms-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <Command
                  filter={(value, search) => {
                    const s = normalizeArabic(search, true);
                    const v = normalizeArabic(value, true);
                    return v.includes(s) ? 1 : 0;
                  }}
                >
                  <CommandInput placeholder="ابحث عن سورة..." />
                  <CommandList className="max-h-72">
                    <CommandEmpty>لا توجد نتائج</CommandEmpty>
                    <CommandGroup>
                      {surahs.map(s => (
                        <CommandItem
                          key={s.number}
                          value={`${s.number} ${s.name_ar} ${s.name_translit ?? ""}`}
                          onSelect={() => { setSurahNum(s.number); setSurahPickerOpen(false); }}
                        >
                          <Check className={cn("ms-2 h-4 w-4", surahNum === s.number ? "opacity-100" : "opacity-0")} />
                          {s.number}. {s.name_ar}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="text-sm text-muted-foreground px-3 py-2 rounded-md bg-muted/40">
              {allLoaded ? `نتائج من كل السور المتاحة (${availableSurahsCount})` : "جارِ التحميل..."}
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden gap-2"><Filter className="w-4 h-4" /> فلاتر</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto"><FilterRail filters={filters} setFilters={setFilters} /></SheetContent>
          </Sheet>
          </div>
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
                bookmarked={bookmarks.has(v.id)}
                onBookmarkToggle={handleBookmarkToggle}
                onTagClick={(t) => setFilters({ ...filters, tags: filters.tags.includes(t) ? filters.tags : [...filters.tags, t] })}
                onDomainClick={(d) => { setScope("all"); setFilters({ ...filters, domains: filters.domains.includes(d) ? filters.domains : [...filters.domains, d] }); }}
                onThemeClick={(t) => { setScope("all"); setFilters({ ...filters, themes: filters.themes.includes(t) ? filters.themes : [...filters.themes, t] }); }}
                onFunctionClick={(f) => { setScope("all"); setFilters({ ...filters, functions: filters.functions.includes(f) ? filters.functions : [...filters.functions, f] }); }}
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
