CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('suggestion','bug','thanks')),
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_anyone"
ON public.feedback FOR INSERT
WITH CHECK (
  length(message) BETWEEN 1 AND 2000
  AND (email IS NULL OR length(email) <= 255)
  AND (name IS NULL OR length(name) <= 120)
);

CREATE POLICY "feedback_admin_read"
ON public.feedback FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "feedback_admin_delete"
ON public.feedback FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_feedback_created_at ON public.feedback (created_at DESC);
CREATE INDEX idx_feedback_category ON public.feedback (category);