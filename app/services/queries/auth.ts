import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { api } from '../api';
import type { User } from '../types';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Get user profile
export const useProfile = (
  options?: UseQueryOptions<User, Error>
) => {
  return useQuery<User, Error>({
    queryKey: authKeys.profile(),
    queryFn: () => api.get<User>('/auth/profile'),
    ...options,
  });
}; 