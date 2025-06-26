import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { api } from '../api';
import { eventKeys } from '../queries/events';
import type { Event, UpdateEventRequest } from '../types';

// Create event mutation (Note: Create endpoint not in swagger, assuming it exists)
export const useCreateEvent = (
  options?: UseMutationOptions<Event, Error, Omit<Event, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Event, Error, Omit<Event, 'id' | 'created_at' | 'updated_at' | 'user_id'>>({
    mutationFn: (eventData) =>
      api.post<Event>('/events', eventData),
    onSuccess: () => {
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    ...options,
  });
};

// Update event mutation
export const useUpdateEvent = (
  options?: UseMutationOptions<Event, Error, { id: number; data: UpdateEventRequest }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Event, Error, { id: number; data: UpdateEventRequest }>({
    mutationFn: ({ id, data }) =>
      api.put<Event>(`/events/${id}`, data),
    onSuccess: (data, variables) => {
      // Update cached event details
      queryClient.setQueryData(eventKeys.detail(variables.id), data);
      // Invalidate events list and public detail
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.publicDetail(variables.id) });
    },
    ...options,
  });
};

// Delete event mutation
export const useDeleteEvent = (
  options?: UseMutationOptions<{ message: string }, Error, number>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, Error, number>({
    mutationFn: (id: number) =>
      api.delete<{ message: string }>(`/events/${id}`),
    onSuccess: (_data, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: eventKeys.detail(id) });
      queryClient.removeQueries({ queryKey: eventKeys.publicDetail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    ...options,
  });
}; 