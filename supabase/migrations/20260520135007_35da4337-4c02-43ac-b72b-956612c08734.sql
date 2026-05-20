-- Helper function (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ actions ============
CREATE TABLE IF NOT EXISTS public.actions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verse_id      UUID NOT NULL REFERENCES public.verses(id) ON DELETE RESTRICT,
  domain_code   TEXT NOT NULL REFERENCES public.domains(code) ON DELETE RESTRICT,
  intent_code   TEXT NOT NULL REFERENCES public.intents(code) ON DELETE RESTRICT,
  title         TEXT NOT NULL,
  body          TEXT,
  status        TEXT NOT NULL DEFAULT 'committed'
                CHECK (status IN ('committed','in_progress','completed','released')),
  committed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_actions_user   ON public.actions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_actions_verse  ON public.actions(verse_id);
CREATE INDEX IF NOT EXISTS idx_actions_domain ON public.actions(domain_code);

ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "actions_select_own" ON public.actions;
DROP POLICY IF EXISTS "actions_insert_own" ON public.actions;
DROP POLICY IF EXISTS "actions_update_own" ON public.actions;
DROP POLICY IF EXISTS "actions_delete_own" ON public.actions;
CREATE POLICY "actions_select_own" ON public.actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "actions_insert_own" ON public.actions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "actions_update_own" ON public.actions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "actions_delete_own" ON public.actions FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_actions_updated_at ON public.actions;
CREATE TRIGGER trg_actions_updated_at BEFORE UPDATE ON public.actions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ reflections ============
CREATE TABLE IF NOT EXISTS public.reflections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_id         UUID REFERENCES public.actions(id) ON DELETE SET NULL,
  verse_id          UUID NOT NULL REFERENCES public.verses(id) ON DELETE RESTRICT,
  domain_code       TEXT NOT NULL REFERENCES public.domains(code) ON DELETE RESTRICT,
  intent_code       TEXT NOT NULL REFERENCES public.intents(code) ON DELETE RESTRICT,
  body              TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 8000),
  clarity_score     SMALLINT CHECK (clarity_score BETWEEN 1 AND 5),
  difficulty_score  SMALLINT CHECK (difficulty_score BETWEEN 1 AND 5),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reflections_user   ON public.reflections(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_action ON public.reflections(action_id);
CREATE INDEX IF NOT EXISTS idx_reflections_verse  ON public.reflections(verse_id);

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reflections_select_own" ON public.reflections;
DROP POLICY IF EXISTS "reflections_insert_own" ON public.reflections;
DROP POLICY IF EXISTS "reflections_update_own" ON public.reflections;
DROP POLICY IF EXISTS "reflections_delete_own" ON public.reflections;
CREATE POLICY "reflections_select_own" ON public.reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reflections_insert_own" ON public.reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reflections_update_own" ON public.reflections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reflections_delete_own" ON public.reflections FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_reflections_updated_at ON public.reflections;
CREATE TRIGGER trg_reflections_updated_at BEFORE UPDATE ON public.reflections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ayah_domains PK (guarded) ============
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.ayah_domains'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE public.ayah_domains
      ADD CONSTRAINT ayah_domains_pkey PRIMARY KEY (verse_id, domain_code);
  END IF;
END$$;