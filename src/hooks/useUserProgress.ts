import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserProgress = {
  totalActions: number;
  completedActions: number;
  totalReflections: number;
  domainsTouched: number;
  perDomain: Record<string, { actions: number; reflections: number }>;
  falahIndex: number;
};

const DOMAIN_COUNT = 8;

export const useUserProgress = () =>
  useQuery({
    queryKey: ["user-progress"],
    queryFn: async (): Promise<UserProgress> => {
      const { data: userResp } = await supabase.auth.getUser();
      const user = userResp.user;
      if (!user) {
        return { totalActions: 0, completedActions: 0, totalReflections: 0, domainsTouched: 0, perDomain: {}, falahIndex: 0 };
      }

      const [{ data: actions }, { data: reflections }] = await Promise.all([
        supabase.from("actions").select("id,domain_code,status,created_at").eq("user_id", user.id),
        supabase.from("reflections").select("id,domain_code,body,created_at").eq("user_id", user.id),
      ]);

      const acts = actions ?? [];
      const refs = reflections ?? [];

      const totalActions = acts.length;
      const completedActions = acts.filter((a: any) => a.status === "completed").length;
      const totalReflections = refs.length;

      const perDomain: Record<string, { actions: number; reflections: number }> = {};
      acts.forEach((a: any) => {
        perDomain[a.domain_code] ??= { actions: 0, reflections: 0 };
        perDomain[a.domain_code].actions++;
      });
      refs.forEach((r: any) => {
        perDomain[r.domain_code] ??= { actions: 0, reflections: 0 };
        perDomain[r.domain_code].reflections++;
      });
      const domainsTouched = Object.keys(perDomain).length;

      const completionRate = totalActions ? completedActions / totalActions : 0;
      const depth = refs.length
        ? refs.reduce((acc: number, r: any) => acc + Math.min((r.body?.length ?? 0) / 200, 1), 0) / refs.length
        : 0;
      const breadth = domainsTouched / DOMAIN_COUNT;
      const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
      const recent = [
        ...acts.map((a: any) => new Date(a.created_at).getTime()),
        ...refs.map((r: any) => new Date(r.created_at).getTime()),
      ].filter((t) => t >= cutoff);
      const cadence = Math.min(recent.length / 14, 1);

      const falahIndex = Math.round((0.35 * completionRate + 0.35 * depth + 0.20 * breadth + 0.10 * cadence) * 100);

      return { totalActions, completedActions, totalReflections, domainsTouched, perDomain, falahIndex };
    },
  });