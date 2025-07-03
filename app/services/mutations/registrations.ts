import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { registrationKeys } from "../queries/registrations";
import type { CreateRegistrationRequest, RegistrationResponse } from "../types";

// Create registration mutation (public)
export const useCreateRegistration = (
	options?: UseMutationOptions<
		RegistrationResponse,
		Error,
		CreateRegistrationRequest
	>,
) => {
	const queryClient = useQueryClient();

	return useMutation<RegistrationResponse, Error, CreateRegistrationRequest>({
		mutationFn: (registrationData: CreateRegistrationRequest) =>
			api.post<RegistrationResponse>("/registrations", registrationData),
		...options,
		onSuccess: (data, variables, context) => {
			// Invalidate event registrations for the event owner
			queryClient.invalidateQueries({
				queryKey: registrationKeys.byEvent(variables.event_id),
			});
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};
