-- Migration: Add privacy for profiles
-- 1) Add phone_visible column to allow users to opt-in to showing phone numbers
-- 2) Create a non-sensitive mirror table `profiles_public` with no phone_number
-- 3) Sync `profiles_public` via trigger whenever `profiles` changes
-- 4) Restrict SELECT on `profiles` so only owners and admins can read full profiles
-- 5) Grant SELECT on `profiles_public` to authenticated users

BEGIN;

-- 1) Add a phone_visible column so users can opt in to share phone numbers
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_visible boolean NOT NULL DEFAULT false;

-- 2) Create a public-facing profiles table that contains only non-sensitive fields
CREATE TABLE IF NOT EXISTS public.profiles_public (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE,
  full_name TEXT,
  location TEXT,
  district TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  phone_visible boolean
);

-- Populate initial data from profiles (no phone_number copied)
INSERT INTO public.profiles_public (id, user_id, full_name, location, district, avatar_url, created_at, updated_at, phone_visible)
SELECT id, user_id, full_name, location, district, avatar_url, created_at, updated_at, phone_visible
FROM public.profiles
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  location = EXCLUDED.location,
  district = EXCLUDED.district,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = EXCLUDED.updated_at,
  phone_visible = EXCLUDED.phone_visible;

-- 3) Trigger function to keep profiles_public in sync with profiles
CREATE OR REPLACE FUNCTION public.sync_profiles_public()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.profiles_public (id, user_id, full_name, location, district, avatar_url, created_at, updated_at, phone_visible)
    VALUES (NEW.id, NEW.user_id, NEW.full_name, NEW.location, NEW.district, NEW.avatar_url, NEW.created_at, NEW.updated_at, NEW.phone_visible)
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      location = EXCLUDED.location,
      district = EXCLUDED.district,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = EXCLUDED.updated_at,
      phone_visible = EXCLUDED.phone_visible;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.profiles_public WHERE id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS profiles_sync_after_change ON public.profiles;
CREATE TRIGGER profiles_sync_after_change
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profiles_public();

-- 4) Restrict SELECT on profiles: only owners and admins may read full profile rows
-- Remove the permissive policy that allowed everyone to SELECT
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- New policy: owners or admins only
CREATE POLICY "Profiles can be viewed by owner or admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Keep existing INSERT/UPDATE policies in place (they were created in prior migration)

-- 5) Allow authenticated users to read the non-sensitive mirror
GRANT SELECT ON public.profiles_public TO authenticated;

COMMIT;
