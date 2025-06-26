import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { api } from '../api';
import { formKeys } from '../queries/forms';
import type { Form, CreateFormRequest } from '../types';

// Create or update form mutation
export const useCreateOrUpdateForm = (
  options?: UseMutationOptions<Form, Error, CreateFormRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Form, Error, CreateFormRequest>({
    mutationFn: (formData: CreateFormRequest) =>
      api.post<Form>('/forms', formData),
    onSuccess: (data, variables) => {
      // Update cached form data
      queryClient.setQueryData(formKeys.edit(variables.event_id), data);
      queryClient.setQueryData(formKeys.public(variables.event_id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
    ...options,
  });
};

// Delete form mutation
export const useDeleteForm = (
  options?: UseMutationOptions<{ message: string }, Error, number>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, Error, number>({
    mutationFn: (eventId: number) =>
      api.delete<{ message: string }>(`/events/${eventId}/form`),
    onSuccess: (_data, eventId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: formKeys.edit(eventId) });
      queryClient.removeQueries({ queryKey: formKeys.public(eventId) });
      // Invalidate form queries
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
    ...options,
  });
}; 