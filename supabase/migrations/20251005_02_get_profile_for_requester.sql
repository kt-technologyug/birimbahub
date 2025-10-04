-- Migration: create secure RPC to fetch a profile for a requester
-- This function returns phone_number only when the requester is the owner,
-- an admin, or when the profile owner has explicitly opted in (phone_visible = true).

BEGIN;

CREATE OR REPLACE FUNCTION public.get_profile_for_requester(_target_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  phone_number text,
  location text,
  district text,
  avatar_url text,
  created_at timestamptz,
  updated_at timestamptz,
  phone_visible boolean
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.user_id,
    p.full_name,
    CASE
      WHEN auth.uid() = _target_user_id THEN p.phone_number
      WHEN public.has_role(auth.uid(), 'admin') THEN p.phone_number
      WHEN p.phone_visible THEN p.phone_number
      ELSE NULL
    END AS phone_number,
    p.location,
    p.district,
    p.avatar_url,
    p.created_at,
    p.updated_at,
    p.phone_visible
  FROM public.profiles p
  WHERE p.user_id = _target_user_id
  LIMIT 1;
$$;

COMMIT;
