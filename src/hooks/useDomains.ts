import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Domain = {
  code: string;
  label_ar: string;
  label_en: string | null;
  subtitle_ar: string | null;
  description_ar: string | null;
  sort_order: number;
};

export const useDomains = () =>
  useQuery({
    queryKey: ["domains"],
    staleTime: 60 * 60 * 1000,
    queryFn: async (): Promise<Domain[]> => {
      const { data, error } = await supabase
        .from("domains")
        .select("code,label_ar,label_en,subtitle_ar,description_ar,sort_order")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Domain[];
    },
  });

export const useDomainCoverage = () =>
  useQuery({
    queryKey: ["domain-coverage"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error } = await supabase
        .from("ayah_domains")
        .select("domain_code");
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data ?? []).forEach((r: { domain_code: string }) => {
        counts[r.domain_code] = (counts[r.domain_code] ?? 0) + 1;
      });
      return counts;
    },
  });