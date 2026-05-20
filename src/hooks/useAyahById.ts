import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Ayah = {
  id: string;
  surah_number: number;
  verse_number: number;
  text_ar: string;
  text_simple: string | null;
  surah_name_ar: string | null;
  meaning_ar: string | null;
  contemporary_relevance_ar: string | null;
};

export const useAyahById = (id: string | undefined) =>
  useQuery({
    queryKey: ["ayah", id],
    enabled: !!id,
    queryFn: async (): Promise<Ayah | null> => {
      const { data, error } = await supabase
        .from("verses")
        .select("id,surah_number,verse_number,text_ar,text_simple")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const { data: surah } = await supabase
        .from("surahs")
        .select("name_ar")
        .eq("number", data.surah_number)
        .maybeSingle();

      // Meaning / contemporary relevance columns do not exist yet — graceful placeholder layer
      return {
        ...data,
        surah_name_ar: surah?.name_ar ?? null,
        meaning_ar: null,
        contemporary_relevance_ar: null,
      };
    },
  });