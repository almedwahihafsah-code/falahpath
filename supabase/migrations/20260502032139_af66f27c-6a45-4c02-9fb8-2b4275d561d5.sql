CREATE TABLE public.function_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  verse_id UUID NOT NULL,
  function TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'bookmark',
  points INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.function_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fe_select_own" ON public.function_engagements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fe_insert_own" ON public.function_engagements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fe_delete_own" ON public.function_engagements
  FOR DELETE USING (auth.uid() = user_id);

CREATE UNIQUE INDEX function_engagements_unique
  ON public.function_engagements (user_id, verse_id, source);

CREATE INDEX function_engagements_user_fn
  ON public.function_engagements (user_id, function);