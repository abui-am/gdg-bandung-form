import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import type { Form } from "../types";

// Query Keys
export const formKeys = {
	all: ["forms"] as const,
	public: (eventId: string) => [...formKeys.all, "public", eventId] as const,
	edit: (eventId: string) => [...formKeys.all, "edit", eventId] as const,
};

// Get public form for event
export const usePublicForm = (
	eventId: string,
	options?: UseQueryOptions<Form, Error>,
) => {
	return useQuery<Form, Error>({
		queryKey: formKeys.public(eventId),
		queryFn: () => api.get<Form>(`/events/${eventId}/form`),
		enabled: !!eventId,
		...options,
	});
};

// Get form for editing (owner only)
export const useFormForEdit = (
	eventId: string,
	options?: UseQueryOptions<Form, Error>,
) => {
	return useQuery<Form, Error>({
		queryKey: formKeys.edit(eventId),
		queryFn: () => api.get<Form>(`/events/${eventId}/form/edit`),
		enabled: !!eventId,
		...options,
	});
};
