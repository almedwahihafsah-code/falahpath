import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Intent = {
  code: string;
  label_ar: string;
  label_en: string | null;
  description_ar: string;
  sort_order: number;
};

export const useIntents = () =>
  useQuery({
    queryKey: ["intents"],
    staleTime: 60 * 60 * 1000,
    queryFn: async (): Promise<Intent[]> => {
      const { data, error } = await supabase
        .from("intents")
        .select("code,label_ar,label_en,description_ar,sort_order")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Intent[];
    },
  });