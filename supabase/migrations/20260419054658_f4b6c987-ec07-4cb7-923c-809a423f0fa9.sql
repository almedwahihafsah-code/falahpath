
CREATE TABLE public.guidance_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT,
  situation TEXT,
  domain TEXT,
  verse_arabic TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  guidance_domain TEXT,
  reflection TEXT NOT NULL,
  actions JSONB NOT NULL,
  dua TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guidance_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own guidance history"
ON public.guidance_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own guidance history"
ON public.guidance_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guidance history"
ON public.guidance_history FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_guidance_history_user_created
ON public.guidance_history (user_id, created_at DESC);
