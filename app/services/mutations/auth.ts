import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { api, setAuthToken } from '../api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

// Login mutation
export const useLogin = (
  options?: UseMutationOptions<AuthResponse, Error, LoginRequest>
) => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) =>
      api.post<AuthResponse>('/auth/login', credentials),
    onSuccess: (data) => {
      // Set the auth token after successful login
      setAuthToken(data.token);
    },
    ...options,
  });
};

// Register mutation
export const useRegister = (
  options?: UseMutationOptions<AuthResponse, Error, RegisterRequest>
) => {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (userData: RegisterRequest) =>
      api.post<AuthResponse>('/auth/register', userData),
    onSuccess: (data) => {
      // Set the auth token after successful registration
      setAuthToken(data.token);
    },
    ...options,
  });
};

// Logout mutation (client-side only)
export const useLogout = (
  options?: UseMutationOptions<void, Error, void>
) => {
  return useMutation<void, Error, void>({
    mutationFn: () => {
      // Clear the auth token
      setAuthToken(null);
      return Promise.resolve();
    },
    ...options,
  });
}; 