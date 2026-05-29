-- Table 1: user profiles (onboarding data)
CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  age_bracket text CHECK (age_bracket IN ('youth','maturity','harvest')),
  preferred_domains text[] DEFAULT '{}',
  initial_intent_code text,
  initial_challenge text,
  locale text DEFAULT 'ar',
  onboarding_completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Table 2: computed user signals
CREATE TABLE public.user_profile_signals (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_journeys integer DEFAULT 0,
  total_actions integer DEFAULT 0,
  total_reflections integer DEFAULT 0,
  dominant_domain_code text,
  dominant_intent_code text,
  last_active_at timestamptz DEFAULT now(),
  streak_days integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profile_signals TO authenticated;
GRANT ALL ON public.user_profile_signals TO service_role;

ALTER TABLE public.user_profile_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_signals" ON public.user_profile_signals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_signals" ON public.user_profile_signals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_signals" ON public.user_profile_signals
  FOR UPDATE USING (auth.uid() = user_id);

-- Auto-update updated_at triggers (reuse existing public.update_updated_at_column)
CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER user_profile_signals_updated_at BEFORE UPDATE ON public.user_profile_signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Avatars storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatar_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "users_upload_own_avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "users_update_own_avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );