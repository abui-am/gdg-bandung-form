import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { api } from '../api';
import type { EventAnalytics } from '../types';

// Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  event: (eventId: number) => [...analyticsKeys.all, 'event', eventId] as const,
};

// Get dashboard analytics (owner only)
export const useDashboardAnalytics = (
  options?: UseQueryOptions<Record<string, any>, Error>
) => {
  return useQuery<Record<string, any>, Error>({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => api.get<Record<string, any>>('/dashboard'),
    ...options,
  });
};

// Get event analytics (owner only)
export const useEventAnalytics = (
  eventId: number,
  options?: UseQueryOptions<EventAnalytics, Error>
) => {
  return useQuery<EventAnalytics, Error>({
    queryKey: analyticsKeys.event(eventId),
    queryFn: () => api.get<EventAnalytics>(`/events/${eventId}/analytics`),
    enabled: !!eventId,
    ...options,
  });
}; 