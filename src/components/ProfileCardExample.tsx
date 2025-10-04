import React from 'react';
import { useProfileForRequester } from '@/hooks/useProfileForRequester';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
  userId: string;
};

export default function ProfileCardExample({ userId }: Props) {
  const { data, isLoading, error } = useProfileForRequester(userId);
  const { user } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Profile not found</div>;

  return (
    <div className="p-4 border rounded">
      <div className="font-bold text-lg">{data.full_name}</div>
      <div className="text-sm text-muted-foreground">{data.location}</div>
      {data.phone_number ? (
        <div className="mt-2">Phone: {data.phone_number}</div>
      ) : (
        <div className="mt-2 text-sm text-muted-foreground">Phone not available</div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">Viewed as: {user?.id === userId ? 'owner' : 'visitor'}</div>
    </div>
  );
}
