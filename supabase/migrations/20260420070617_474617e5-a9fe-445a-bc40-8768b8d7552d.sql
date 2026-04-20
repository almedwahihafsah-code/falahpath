-- Tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  domain_id INT,
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date DATE,
  type TEXT NOT NULL DEFAULT 'task',
  status TEXT NOT NULL DEFAULT 'active',
  completed_at TIMESTAMPTZ,
  points INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_select_own" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tasks_insert_own" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_update_own" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tasks_delete_own" ON public.tasks FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_tasks_user ON public.tasks(user_id);

-- Daily Journal
CREATE TABLE public.daily_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  quran_juz NUMERIC(4,2) DEFAULT 0,
  reflection_minutes INT DEFAULT 0,
  peace_level INT DEFAULT 5,
  energy_level INT DEFAULT 5,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);
ALTER TABLE public.daily_journal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "journal_select_own" ON public.daily_journal FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "journal_insert_own" ON public.daily_journal FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "journal_update_own" ON public.daily_journal FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "journal_delete_own" ON public.daily_journal FOR DELETE USING (auth.uid() = user_id);

-- User Progress
CREATE TABLE public.user_progress (
  user_id UUID PRIMARY KEY,
  total_points INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 0,
  streak_days INT NOT NULL DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_select_own" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress_insert_own" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_update_own" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Domain Scores
CREATE TABLE public.domain_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  domain_id INT NOT NULL,
  score INT NOT NULL,
  week_of DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, domain_id, week_of)
);
ALTER TABLE public.domain_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ds_select_own" ON public.domain_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ds_insert_own" ON public.domain_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ds_update_own" ON public.domain_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ds_delete_own" ON public.domain_scores FOR DELETE USING (auth.uid() = user_id);

-- Habit Completions
CREATE TABLE public.habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  habit_key TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  points_earned INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, habit_key, date)
);
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hc_select_own" ON public.habit_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "hc_insert_own" ON public.habit_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hc_delete_own" ON public.habit_completions FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_hc_user_date ON public.habit_completions(user_id, date);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_journal_updated BEFORE UPDATE ON public.daily_journal FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_progress_updated BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();