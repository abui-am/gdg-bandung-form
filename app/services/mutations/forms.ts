import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { formKeys } from "../queries/forms";
import type { CreateFormRequest, Form } from "../types";

// Create or update form mutation
export const useCreateOrUpdateForm = (
	options?: UseMutationOptions<Form, Error, CreateFormRequest>,
) => {
	const queryClient = useQueryClient();

	return useMutation<Form, Error, CreateFormRequest>({
		mutationFn: (formData: CreateFormRequest) =>
			api.post<Form>("/forms", formData),
		...options,
		onSuccess: (data, variables, context) => {
			// Update cached form data
			queryClient.setQueryData(formKeys.edit(variables.event_id), data);
			queryClient.setQueryData(formKeys.public(variables.event_id), data);
			// Invalidate related queries
			queryClient.invalidateQueries({ queryKey: formKeys.all });
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};

// Delete form mutation
export const useDeleteForm = (
	options?: UseMutationOptions<{ message: string }, Error, number>,
) => {
	const queryClient = useQueryClient();

	return useMutation<{ message: string }, Error, number>({
		mutationFn: (eventId: number) =>
			api.delete<{ message: string }>(`/events/${eventId}/form`),
		...options,
		onSuccess: (data, variables, context) => {
			// Remove from cache
			queryClient.removeQueries({ queryKey: formKeys.edit(variables) });
			queryClient.removeQueries({ queryKey: formKeys.public(variables) });
			// Invalidate form queries
			queryClient.invalidateQueries({ queryKey: formKeys.all });
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};
