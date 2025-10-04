import { supabase } from './client';

export type ProfileForRequester = {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string | null;
  location: string;
  district: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  phone_visible: boolean;
};

export async function getProfileForRequester(targetUserId: string) {
  // Supabase generated types sometimes restrict rpc names; use a safe any cast here
  const res: any = await (supabase as any).rpc('get_profile_for_requester', {
    _target_user_id: targetUserId,
  });

  if (res.error) {
    throw res.error;
  }

  const data = res.data as any;

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const row = data[0];

  return {
    id: row.id,
    user_id: row.user_id,
    full_name: row.full_name,
    phone_number: row.phone_number ?? null,
    location: row.location,
    district: row.district ?? null,
    avatar_url: row.avatar_url ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    phone_visible: !!row.phone_visible,
  } as ProfileForRequester;
}
