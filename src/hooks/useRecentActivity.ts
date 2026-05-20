import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ActivityItem = {
  kind: "action" | "reflection";
  id: string;
  domain_code: string;
  title: string;
  created_at: string;
};

export const useRecentActivity = (limit = 10) =>
  useQuery({
    queryKey: ["recent-activity", limit],
    queryFn: async (): Promise<ActivityItem[]> => {
      const { data: userResp } = await supabase.auth.getUser();
      const user = userResp.user;
      if (!user) return [];

      const [{ data: actions }, { data: reflections }] = await Promise.all([
        supabase.from("actions").select("id,domain_code,title,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(limit),
        supabase.from("reflections").select("id,domain_code,body,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(limit),
      ]);

      const items: ActivityItem[] = [
        ...(actions ?? []).map((a: any) => ({ kind: "action" as const, id: a.id, domain_code: a.domain_code, title: a.title, created_at: a.created_at })),
        ...(reflections ?? []).map((r: any) => ({ kind: "reflection" as const, id: r.id, domain_code: r.domain_code, title: (r.body ?? "").slice(0, 80), created_at: r.created_at })),
      ];
      items.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      return items.slice(0, limit);
    },
  });