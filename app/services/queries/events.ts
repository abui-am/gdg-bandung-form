import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import type { Event, PaginationParams } from "../types";

// Query Keys
export const eventKeys = {
	all: ["events"] as const,
	lists: () => [...eventKeys.all, "list"] as const,
	list: (params: PaginationParams) => [...eventKeys.lists(), params] as const,
	details: () => [...eventKeys.all, "detail"] as const,
	detail: (id: string) => [...eventKeys.details(), id] as const,
	public: () => [...eventKeys.all, "public"] as const,
	publicDetail: (id: string) => [...eventKeys.public(), id] as const,
};

// Get user's events
export const useEvents = (
	params?: PaginationParams,
	options?: UseQueryOptions<Event[], Error>,
) => {
	return useQuery<Event[], Error>({
		queryKey: eventKeys.list(params || {}),
		queryFn: () => api.get<Event[]>("/events", params),
		...options,
	});
};

// Get event details (owner only)
export const useEventDetails = (
	id: string,
	options?: UseQueryOptions<Event, Error>,
) => {
	return useQuery<Event, Error>({
		queryKey: eventKeys.detail(id),
		queryFn: () => api.get<Event>(`/events/${id}/details`),
		enabled: !!id,
		...options,
	});
};

// Get public event details
export const usePublicEvent = (
	id: string,
	options?: UseQueryOptions<Event, Error>,
) => {
	return useQuery<Event, Error>({
		queryKey: eventKeys.publicDetail(id),
		queryFn: () => api.get<Event>(`/events/${id}`),
		enabled: !!id,
		...options,
	});
};
