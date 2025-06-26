import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { api } from '../api';
import { ticketKeys } from '../queries/tickets';
import type { Ticket, CreateTicketRequest, UpdateTicketRequest } from '../types';

// Create ticket mutation
export const useCreateTicket = (
  options?: UseMutationOptions<Ticket, Error, CreateTicketRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Ticket, Error, CreateTicketRequest>({
    mutationFn: (ticketData: CreateTicketRequest) =>
      api.post<Ticket>('/tickets', ticketData),
    onSuccess: (_data, variables) => {
      // Invalidate ticket lists for the event
      queryClient.invalidateQueries({ queryKey: ticketKeys.public(variables.event_id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.manage(variables.event_id) });
    },
    ...options,
  });
};

// Update ticket mutation
export const useUpdateTicket = (
  options?: UseMutationOptions<Ticket, Error, { id: number; data: UpdateTicketRequest }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Ticket, Error, { id: number; data: UpdateTicketRequest }>({
    mutationFn: ({ id, data }) =>
      api.put<Ticket>(`/tickets/${id}`, data),
    onSuccess: (data, variables) => {
      // Update cached ticket details
      queryClient.setQueryData(ticketKeys.detail(variables.id), data);
      // Invalidate ticket lists for the event
      if (data.event_id) {
        queryClient.invalidateQueries({ queryKey: ticketKeys.public(data.event_id) });
        queryClient.invalidateQueries({ queryKey: ticketKeys.manage(data.event_id) });
      }
    },
    ...options,
  });
};

// Delete ticket mutation
export const useDeleteTicket = (
  options?: UseMutationOptions<{ message: string }, Error, { id: number; eventId: number }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, Error, { id: number; eventId: number }>({
    mutationFn: ({ id }) =>
      api.delete<{ message: string }>(`/tickets/${id}`),
    onSuccess: (_data, variables) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ticketKeys.detail(variables.id) });
      // Invalidate ticket lists for the event
      queryClient.invalidateQueries({ queryKey: ticketKeys.public(variables.eventId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.manage(variables.eventId) });
    },
    ...options,
  });
}; 