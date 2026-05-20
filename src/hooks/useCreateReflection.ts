import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CreateReflectionInput = {
  verse_id: string;
  domain_code: string;
  intent_code: string;
  body: string;
  action_id?: string | null;
  clarity_score?: number | null;
  difficulty_score?: number | null;
};

export const useCreateReflection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReflectionInput) => {
      const { data: userResp } = await supabase.auth.getUser();
      const user = userResp.user;
      if (!user) throw new Error("غير مسجّل الدخول");
      const { data, error } = await supabase
        .from("reflections")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-progress"] });
      qc.invalidateQueries({ queryKey: ["recent-activity"] });
    },
  });
};