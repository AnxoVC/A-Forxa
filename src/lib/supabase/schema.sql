-- ============================================================
-- A FORXA - Complete Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension (usually already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: profiles
-- Auto-created via trigger when a user signs up
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name              TEXT,
  weight            NUMERIC(5, 2),
  height            NUMERIC(5, 2),
  age               INTEGER,
  goal              TEXT CHECK (goal IN ('muscle', 'fat_loss', 'maintain')),
  activity_level    TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  tdee              INTEGER,
  macro_calories    INTEGER,
  macro_protein     INTEGER,
  macro_carbs       INTEGER,
  macro_fat         INTEGER,
  onboarded         BOOLEAN NOT NULL DEFAULT FALSE,
  theme             TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  language          TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'gl', 'en')),
  avatar_url        TEXT
);

-- ============================================================
-- TABLE: workouts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workouts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  name        TEXT NOT NULL,
  routine_id  UUID,
  volume      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration    INTEGER,         -- in seconds
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: workout_exercises
-- Exercises within a specific workout session
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id     UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id    TEXT NOT NULL,  -- references a static exercise catalogue (not a DB table)
  exercise_name  TEXT NOT NULL,
  order_index    INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: workout_sets
-- Individual sets within a workout exercise entry
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id  UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  set_number           INTEGER NOT NULL DEFAULT 1,
  weight               NUMERIC(6, 2),   -- kg
  reps                 INTEGER,
  done                 BOOLEAN NOT NULL DEFAULT FALSE,
  rest_seconds         INTEGER,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: exercise_progress
-- XP and personal bests per exercise per user
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exercise_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id     TEXT NOT NULL,
  xp              INTEGER NOT NULL DEFAULT 0,
  best_weight     NUMERIC(6, 2),
  best_reps       INTEGER,
  total_sessions  INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, exercise_id)
);

-- ============================================================
-- TABLE: nutrition_entries
-- Daily food log entries
-- ============================================================
CREATE TABLE IF NOT EXISTS public.nutrition_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type   TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  food_name   TEXT NOT NULL,
  brand       TEXT,
  calories    NUMERIC(8, 2) NOT NULL DEFAULT 0,
  protein     NUMERIC(6, 2) NOT NULL DEFAULT 0,
  carbs       NUMERIC(6, 2) NOT NULL DEFAULT 0,
  fat         NUMERIC(6, 2) NOT NULL DEFAULT 0,
  grams       NUMERIC(7, 2) NOT NULL DEFAULT 100,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: weight_log
-- Daily body weight tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weight_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  weight      NUMERIC(5, 2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

-- ============================================================
-- TABLE: shopping_list
-- Grocery / shopping list items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shopping_list (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  category           TEXT,
  quantity           TEXT,
  checked            BOOLEAN NOT NULL DEFAULT FALSE,
  calories_estimate  INTEGER,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: weekly_menu
-- Pre-planned weekly meal schedule
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weekly_menu (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start   DATE NOT NULL,    -- ISO Monday of the week
  day_of_week  INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sun, 1=Mon, ...
  meal_type    TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  food_name    TEXT NOT NULL,
  calories     NUMERIC(8, 2) NOT NULL DEFAULT 0,
  protein      NUMERIC(6, 2) NOT NULL DEFAULT 0,
  carbs        NUMERIC(6, 2) NOT NULL DEFAULT 0,
  fat          NUMERIC(6, 2) NOT NULL DEFAULT 0,
  grams        NUMERIC(7, 2) NOT NULL DEFAULT 100,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: routines
-- User-defined workout routines / templates
-- ============================================================
CREATE TABLE IF NOT EXISTS public.routines (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  day_tag       TEXT,          -- e.g. 'monday', 'push', 'pull'
  exercise_ids  TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_workouts_user_id       ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date          ON public.workouts(date);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date     ON public.workouts(user_id, date);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id  ON public.workout_exercises(workout_id);

CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id  ON public.workout_sets(workout_exercise_id);

CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_id    ON public.exercise_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_exercise   ON public.exercise_progress(exercise_id);

CREATE INDEX IF NOT EXISTS idx_nutrition_entries_user_id    ON public.nutrition_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_entries_date       ON public.nutrition_entries(date);
CREATE INDEX IF NOT EXISTS idx_nutrition_entries_user_date  ON public.nutrition_entries(user_id, date);

CREATE INDEX IF NOT EXISTS idx_weight_log_user_id    ON public.weight_log(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_log_date       ON public.weight_log(date);
CREATE INDEX IF NOT EXISTS idx_weight_log_user_date  ON public.weight_log(user_id, date);

CREATE INDEX IF NOT EXISTS idx_shopping_list_user_id  ON public.shopping_list(user_id);

CREATE INDEX IF NOT EXISTS idx_weekly_menu_user_id    ON public.weekly_menu(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_menu_week_start ON public.weekly_menu(week_start);

CREATE INDEX IF NOT EXISTS idx_routines_user_id  ON public.routines(user_id);

-- ============================================================
-- TRIGGER: auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop trigger if it already exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: auto-update updated_at on profiles
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables, then add policies
-- ============================================================

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- workouts
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workouts"
  ON public.workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON public.workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON public.workouts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
  ON public.workouts FOR DELETE
  USING (auth.uid() = user_id);

-- workout_exercises
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout exercises"
  ON public.workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout exercises"
  ON public.workout_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout exercises"
  ON public.workout_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout exercises"
  ON public.workout_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts w
      WHERE w.id = workout_id AND w.user_id = auth.uid()
    )
  );

-- workout_sets
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout sets"
  ON public.workout_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout sets"
  ON public.workout_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout sets"
  ON public.workout_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout sets"
  ON public.workout_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

-- exercise_progress
ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercise progress"
  ON public.exercise_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise progress"
  ON public.exercise_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise progress"
  ON public.exercise_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise progress"
  ON public.exercise_progress FOR DELETE
  USING (auth.uid() = user_id);

-- nutrition_entries
ALTER TABLE public.nutrition_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nutrition entries"
  ON public.nutrition_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition entries"
  ON public.nutrition_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition entries"
  ON public.nutrition_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition entries"
  ON public.nutrition_entries FOR DELETE
  USING (auth.uid() = user_id);

-- weight_log
ALTER TABLE public.weight_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weight log"
  ON public.weight_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight log"
  ON public.weight_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight log"
  ON public.weight_log FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight log"
  ON public.weight_log FOR DELETE
  USING (auth.uid() = user_id);

-- shopping_list
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shopping list"
  ON public.shopping_list FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shopping list"
  ON public.shopping_list FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping list"
  ON public.shopping_list FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopping list"
  ON public.shopping_list FOR DELETE
  USING (auth.uid() = user_id);

-- weekly_menu
ALTER TABLE public.weekly_menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weekly menu"
  ON public.weekly_menu FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly menu"
  ON public.weekly_menu FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly menu"
  ON public.weekly_menu FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weekly menu"
  ON public.weekly_menu FOR DELETE
  USING (auth.uid() = user_id);

-- routines
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routines"
  ON public.routines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
  ON public.routines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON public.routines FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
  ON public.routines FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- GRANT permissions to authenticated and anon roles
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT ALL ON public.profiles          TO authenticated;
GRANT ALL ON public.workouts          TO authenticated;
GRANT ALL ON public.workout_exercises TO authenticated;
GRANT ALL ON public.workout_sets      TO authenticated;
GRANT ALL ON public.exercise_progress TO authenticated;
GRANT ALL ON public.nutrition_entries TO authenticated;
GRANT ALL ON public.weight_log        TO authenticated;
GRANT ALL ON public.shopping_list     TO authenticated;
GRANT ALL ON public.weekly_menu       TO authenticated;
GRANT ALL ON public.routines          TO authenticated;

-- Grant SELECT on profiles for anon (needed for OAuth redirects in some setups)
GRANT SELECT ON public.profiles TO anon;
