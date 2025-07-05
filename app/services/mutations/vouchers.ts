import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { voucherKeys } from "../queries/vouchers";
import type {
	CreateVoucherRequest,
	UpdateVoucherRequest,
	ValidateVoucherRequest,
	ValidateVoucherResponse,
	Voucher,
} from "../types";

// Create voucher mutation
export const useCreateVoucher = (
	options?: UseMutationOptions<Voucher, Error, CreateVoucherRequest>,
) => {
	const queryClient = useQueryClient();

	return useMutation<Voucher, Error, CreateVoucherRequest>({
		mutationFn: (voucherData: CreateVoucherRequest) =>
			api.post<Voucher>("/vouchers", voucherData),
		...options,
		onSuccess: (data, variables, context) => {
			// Invalidate voucher lists for the event
			queryClient.invalidateQueries({
				queryKey: voucherKeys.byEvent(variables.event_id),
			});
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};

// Update voucher mutation
export const useUpdateVoucher = (
	options?: UseMutationOptions<
		Voucher,
		Error,
		{ id: number; data: UpdateVoucherRequest }
	>,
) => {
	const queryClient = useQueryClient();

	return useMutation<
		Voucher,
		Error,
		{ id: number; data: UpdateVoucherRequest }
	>({
		mutationFn: ({ id, data }) => api.put<Voucher>(`/vouchers/${id}`, data),
		...options,
		onSuccess: (data, variables, context) => {
			// Update cached voucher details
			queryClient.setQueryData(voucherKeys.detail(variables.id), data);
			// Invalidate voucher lists for the event
			if (data.event_id) {
				queryClient.invalidateQueries({
					queryKey: voucherKeys.byEvent(data.event_id),
				});
			}
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};

// Delete voucher mutation
export const useDeleteVoucher = (
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
		mutationFn: ({ id }) => api.delete<{ message: string }>(`/vouchers/${id}`),
		...options,
		onSuccess: (data, variables, context) => {
			// Remove from cache
			queryClient.removeQueries({ queryKey: voucherKeys.detail(variables.id) });
			// Invalidate voucher lists for the event
			queryClient.invalidateQueries({
				queryKey: voucherKeys.byEvent(variables.eventId),
			});
			// Call the original onSuccess if provided
			options?.onSuccess?.(data, variables, context);
		},
	});
};

// Validate voucher mutation (public)
export const useValidateVoucher = (
	options?: UseMutationOptions<
		ValidateVoucherResponse,
		Error,
		ValidateVoucherRequest
	>,
) => {
	return useMutation<ValidateVoucherResponse, Error, ValidateVoucherRequest>({
		mutationFn: (validationData: ValidateVoucherRequest) =>
			api.post<ValidateVoucherResponse>("/vouchers/validate", validationData),
		...options,
	});
};
