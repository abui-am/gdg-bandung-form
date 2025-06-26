import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { api } from '../api';
import type { Registration, PaginationParams } from '../types';

// Query Keys
export const registrationKeys = {
  all: ['registrations'] as const,
  byEvent: (eventId: number, params?: PaginationParams) => 
    [...registrationKeys.all, 'event', eventId, params] as const,
  details: () => [...registrationKeys.all, 'detail'] as const,
  detail: (id: number) => [...registrationKeys.details(), id] as const,
};

// Get event registrations (owner only)
export const useEventRegistrations = (
  eventId: number,
  params?: PaginationParams,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery<any, Error>({
    queryKey: registrationKeys.byEvent(eventId, params),
    queryFn: () => api.get(`/events/${eventId}/registrations`, params),
    enabled: !!eventId,
    ...options,
  });
};

// Get registration details (owner only)
export const useRegistrationDetails = (
  id: number,
  options?: UseQueryOptions<Registration, Error>
) => {
  return useQuery<Registration, Error>({
    queryKey: registrationKeys.detail(id),
    queryFn: () => api.get<Registration>(`/registrations/${id}`),
    enabled: !!id,
    ...options,
  });
}; 