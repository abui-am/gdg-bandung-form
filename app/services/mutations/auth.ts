import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, setAuthToken } from "../api";
import { authKeys } from "../queries/auth";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

// Login mutation
export const useLogin = (
	options?: UseMutationOptions<AuthResponse, Error, LoginRequest>,
) => {
	const queryClient = useQueryClient();

	return useMutation<AuthResponse, Error, LoginRequest>({
		mutationFn: (credentials: LoginRequest) =>
			api.post<AuthResponse>("/auth/login", credentials),

		...options,
		onSuccess: (data, variables, context) => {
			// Set the auth token after successful login
			setAuthToken(data.token);
			// Invalidate profile query to trigger refetch
			queryClient.invalidateQueries({ queryKey: authKeys.profile() });
			options?.onSuccess?.(data, variables, context);
		},
	});
};

// Register mutation
export const useRegister = (
	options?: UseMutationOptions<AuthResponse, Error, RegisterRequest>,
) => {
	return useMutation<AuthResponse, Error, RegisterRequest>({
		mutationFn: (userData: RegisterRequest) =>
			api.post<AuthResponse>("/auth/register", userData),

		...options,
		onSuccess: (data, variables, context) => {
			// Set the auth token after successful registration
			setAuthToken(data.token);
			options?.onSuccess?.(data, variables, context);
		},
	});
};

// Logout mutation (client-side only)
export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
	return useMutation<void, Error, void>({
		mutationFn: () => {
			// Clear the auth token
			setAuthToken(null);
			return Promise.resolve();
		},
		...options,
	});
};
