import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AyahListItem = {
  id: string;
  surah_number: number;
  verse_number: number;
  text_ar: string;
  text_simple: string | null;
  surah_name_ar?: string | null;
  is_primary: boolean;
  confidence_score: number | null;
};

export const useAyatByDomain = (domainCode: string | null | undefined) =>
  useQuery({
    queryKey: ["ayat-by-domain", domainCode],
    enabled: !!domainCode,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<AyahListItem[]> => {
      const { data, error } = await supabase
        .from("ayah_domains")
        .select("is_primary,confidence_score,verses(id,surah_number,verse_number,text_ar,text_simple)")
        .eq("domain_code", domainCode!)
        .order("is_primary", { ascending: false })
        .order("confidence_score", { ascending: false, nullsFirst: false })
        .limit(12);
      if (error) throw error;

      const rows = (data ?? [])
        .filter((r: any) => r.verses)
        .map((r: any) => ({
          id: r.verses.id,
          surah_number: r.verses.surah_number,
          verse_number: r.verses.verse_number,
          text_ar: r.verses.text_ar,
          text_simple: r.verses.text_simple,
          is_primary: r.is_primary,
          confidence_score: r.confidence_score,
        })) as AyahListItem[];

      const surahNumbers = Array.from(new Set(rows.map((r) => r.surah_number)));
      if (surahNumbers.length) {
        const { data: surahs } = await supabase
          .from("surahs")
          .select("number,name_ar")
          .in("number", surahNumbers);
        const nameMap = new Map((surahs ?? []).map((s: any) => [s.number, s.name_ar]));
        rows.forEach((r) => {
          r.surah_name_ar = nameMap.get(r.surah_number) ?? null;
        });
      }
      return rows;
    },
  });