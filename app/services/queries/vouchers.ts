import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import type { Voucher } from "../types";

// Query Keys
export const voucherKeys = {
	all: ["vouchers"] as const,
	byEvent: (eventId: string) => [...voucherKeys.all, "event", eventId] as const,
	details: () => [...voucherKeys.all, "detail"] as const,
	detail: (id: number) => [...voucherKeys.details(), id] as const,
};

// Get vouchers for event (owner only)
export const useEventVouchers = (
	eventId: string,
	options?: UseQueryOptions<Voucher[], Error>,
) => {
	return useQuery<Voucher[], Error>({
		queryKey: voucherKeys.byEvent(eventId),
		queryFn: () => api.get<Voucher[]>(`/events/${eventId}/vouchers`),
		enabled: !!eventId,
		...options,
	});
};

// Get voucher details (owner only)
export const useVoucherDetails = (
	id: number,
	options?: UseQueryOptions<Voucher, Error>,
) => {
	return useQuery<Voucher, Error>({
		queryKey: voucherKeys.detail(id),
		queryFn: () => api.get<Voucher>(`/vouchers/${id}`),
		enabled: !!id,
		...options,
	});
};
