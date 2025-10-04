import { useQuery } from '@tanstack/react-query';
import { getProfileForRequester, ProfileForRequester } from '@/integrations/supabase/rpc';

export function useProfileForRequester(userId?: string) {
  return useQuery<ProfileForRequester | null, Error>({
    queryKey: ['profile_for_requester', userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getProfileForRequester(userId);
    },
    enabled: !!userId,
  });
}
