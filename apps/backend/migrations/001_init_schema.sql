-- 001_init_schema.sql
-- VibeSpace Database Schema for Supabase PostgreSQL

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. User YouTube Tracks
CREATE TABLE IF NOT EXISTS public.user_youtube_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT '',
  is_custom BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. User Wallpapers
CREATE TABLE IF NOT EXISTS public.user_wallpapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  is_custom BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. User Todos
CREATE TABLE IF NOT EXISTS public.user_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  is_routine BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for Foreign Keys
CREATE INDEX IF NOT EXISTS idx_user_youtube_tracks_user_id ON public.user_youtube_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wallpapers_user_id ON public.user_wallpapers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_todos_user_id ON public.user_todos(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_youtube_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_todos ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'user_profiles_select_policy'
  ) THEN
    CREATE POLICY user_profiles_select_policy ON public.user_profiles
      FOR SELECT USING ((SELECT auth.uid()) = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'user_profiles_update_policy'
  ) THEN
    CREATE POLICY user_profiles_update_policy ON public.user_profiles
      FOR UPDATE USING ((SELECT auth.uid()) = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_youtube_tracks' AND policyname = 'user_youtube_tracks_all_policy'
  ) THEN
    CREATE POLICY user_youtube_tracks_all_policy ON public.user_youtube_tracks
      FOR ALL USING ((SELECT auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_wallpapers' AND policyname = 'user_wallpapers_all_policy'
  ) THEN
    CREATE POLICY user_wallpapers_all_policy ON public.user_wallpapers
      FOR ALL USING ((SELECT auth.uid()) = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_todos' AND policyname = 'user_todos_all_policy'
  ) THEN
    CREATE POLICY user_todos_all_policy ON public.user_todos
      FOR ALL USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

-- Trigger for new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, 'User'), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
