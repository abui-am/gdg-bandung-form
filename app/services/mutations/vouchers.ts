import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { api } from '../api';
import { voucherKeys } from '../queries/vouchers';
import type { 
  Voucher, 
  CreateVoucherRequest, 
  UpdateVoucherRequest, 
  ValidateVoucherRequest, 
  ValidateVoucherResponse 
} from '../types';

// Create voucher mutation
export const useCreateVoucher = (
  options?: UseMutationOptions<Voucher, Error, CreateVoucherRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Voucher, Error, CreateVoucherRequest>({
    mutationFn: (voucherData: CreateVoucherRequest) =>
      api.post<Voucher>('/vouchers', voucherData),
    onSuccess: (_data, variables) => {
      // Invalidate voucher lists for the event
      queryClient.invalidateQueries({ queryKey: voucherKeys.byEvent(variables.event_id) });
    },
    ...options,
  });
};

// Update voucher mutation
export const useUpdateVoucher = (
  options?: UseMutationOptions<Voucher, Error, { id: number; data: UpdateVoucherRequest }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<Voucher, Error, { id: number; data: UpdateVoucherRequest }>({
    mutationFn: ({ id, data }) =>
      api.put<Voucher>(`/vouchers/${id}`, data),
    onSuccess: (data, variables) => {
      // Update cached voucher details
      queryClient.setQueryData(voucherKeys.detail(variables.id), data);
      // Invalidate voucher lists for the event
      if (data.event_id) {
        queryClient.invalidateQueries({ queryKey: voucherKeys.byEvent(data.event_id) });
      }
    },
    ...options,
  });
};

// Delete voucher mutation
export const useDeleteVoucher = (
  options?: UseMutationOptions<{ message: string }, Error, { id: number; eventId: number }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, Error, { id: number; eventId: number }>({
    mutationFn: ({ id }) =>
      api.delete<{ message: string }>(`/vouchers/${id}`),
    onSuccess: (_data, variables) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: voucherKeys.detail(variables.id) });
      // Invalidate voucher lists for the event
      queryClient.invalidateQueries({ queryKey: voucherKeys.byEvent(variables.eventId) });
    },
    ...options,
  });
};

// Validate voucher mutation (public)
export const useValidateVoucher = (
  options?: UseMutationOptions<ValidateVoucherResponse, Error, ValidateVoucherRequest>
) => {
  return useMutation<ValidateVoucherResponse, Error, ValidateVoucherRequest>({
    mutationFn: (validationData: ValidateVoucherRequest) =>
      api.post<ValidateVoucherResponse>('/vouchers/validate', validationData),
    ...options,
  });
}; 