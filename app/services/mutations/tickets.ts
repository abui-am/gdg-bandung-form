import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { ticketKeys } from "../queries/tickets";
import type {
	CreateTicketRequest,
	Ticket,
	UpdateTicketRequest,
} from "../types";

// Create ticket mutation
export const useCreateTicket = (
	options?: UseMutationOptions<Ticket, Error, CreateTicketRequest>,
) => {
	const queryClient = useQueryClient();

	return useMutation<Ticket, Error, CreateTicketRequest>({
		mutationFn: (ticketData: CreateTicketRequest) =>
			api.post<Ticket>("/tickets", ticketData),
		...options,
		onSuccess: (data, variables, context) => {
			// Invalidate ticket lists for the event
			queryClient.invalidateQueries({
				queryKey: ticketKeys.public(variables.event_id),
			});
			queryClient.invalidateQueries({
				queryKey: ticketKeys.manage(variables.event_id),
			});
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};

// Update ticket mutation
export const useUpdateTicket = (
	options?: UseMutationOptions<
		Ticket,
		Error,
		{ id: number; data: UpdateTicketRequest }
	>,
) => {
	const queryClient = useQueryClient();

	return useMutation<Ticket, Error, { id: number; data: UpdateTicketRequest }>({
		mutationFn: ({ id, data }) => api.put<Ticket>(`/tickets/${id}`, data),
		...options,
		onSuccess: (data, variables, context) => {
			// Update cached ticket details
			queryClient.setQueryData(ticketKeys.detail(variables.id), data);
			// Invalidate ticket lists for the event
			if (data.event_id) {
				queryClient.invalidateQueries({
					queryKey: ticketKeys.public(data.event_id),
				});
				queryClient.invalidateQueries({
					queryKey: ticketKeys.manage(data.event_id),
				});
			}
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};

// Delete ticket mutation
export const useDeleteTicket = (
	options?: UseMutationOptions<
		{ message: string },
		Error,
		{ id: number; eventId: string }
	>,
) => {
	const queryClient = useQueryClient();

	return useMutation<
		{ message: string },
		Error,
		{ id: number; eventId: string }
	>({
		mutationFn: ({ id }) => api.delete<{ message: string }>(`/tickets/${id}`),
		...options,
		onSuccess: (data, variables, context) => {
			// Remove from cache
			queryClient.removeQueries({ queryKey: ticketKeys.detail(variables.id) });

			// Invalidate ticket lists for the event
			queryClient.invalidateQueries({
				queryKey: ticketKeys.public(variables.eventId),
			});
			queryClient.invalidateQueries({
				queryKey: ticketKeys.manage(variables.eventId),
			});
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};
