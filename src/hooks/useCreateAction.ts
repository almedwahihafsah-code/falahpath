import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CreateActionInput = {
  verse_id: string;
  domain_code: string;
  intent_code: string;
  title: string;
  body?: string;
};

export const useCreateAction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateActionInput) => {
      const { data: userResp } = await supabase.auth.getUser();
      const user = userResp.user;
      if (!user) throw new Error("غير مسجّل الدخول");
      const { data, error } = await supabase
        .from("actions")
        .insert({ ...input, user_id: user.id, status: "committed" })
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