import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type UserProfile = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  age_bracket: "youth" | "maturity" | "harvest" | null;
  preferred_domains: string[] | null;
  initial_intent_code: string | null;
  initial_challenge: string | null;
  locale: string | null;
  onboarding_completed_at: string | null;
};

export const useUserProfile = () => {
  const { user, loading } = useAuth();
  return useQuery({
    queryKey: ["user-profile", user?.id],
    enabled: !loading && !!user,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_profiles" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return (data as any) ?? null;
    },
  });
};