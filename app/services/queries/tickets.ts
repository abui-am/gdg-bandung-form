import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { api } from '../api';
import type { Ticket } from '../types';

// Query Keys
export const ticketKeys = {
  all: ['tickets'] as const,
  public: (eventId: number) => [...ticketKeys.all, 'public', eventId] as const,
  manage: (eventId: number) => [...ticketKeys.all, 'manage', eventId] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: number) => [...ticketKeys.details(), id] as const,
};

// Get public tickets for event
export const usePublicTickets = (
  eventId: number,
  options?: UseQueryOptions<Ticket[], Error>
) => {
  return useQuery<Ticket[], Error>({
    queryKey: ticketKeys.public(eventId),
    queryFn: () => api.get<Ticket[]>(`/events/${eventId}/tickets`),
    enabled: !!eventId,
    ...options,
  });
};

// Get tickets for event management (owner only)
export const useTicketsForManagement = (
  eventId: number,
  options?: UseQueryOptions<Ticket[], Error>
) => {
  return useQuery<Ticket[], Error>({
    queryKey: ticketKeys.manage(eventId),
    queryFn: () => api.get<Ticket[]>(`/events/${eventId}/tickets/manage`),
    enabled: !!eventId,
    ...options,
  });
};

// Get ticket details (owner only)
export const useTicketDetails = (
  id: number,
  options?: UseQueryOptions<Ticket, Error>
) => {
  return useQuery<Ticket, Error>({
    queryKey: ticketKeys.detail(id),
    queryFn: () => api.get<Ticket>(`/tickets/${id}`),
    enabled: !!id,
    ...options,
  });
}; 