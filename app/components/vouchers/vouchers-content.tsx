import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	useCreateVoucher,
	useDeleteVoucher,
	useEventVouchers,
} from "~/services";
import type { CreateVoucherRequest } from "~/services/types";
import { CreateVoucherForm } from "./create-voucher-form";
import { VoucherCard } from "./voucher-card";

interface VouchersContentProps {
	eventId: string;
}

export function VouchersContent({ eventId }: VouchersContentProps) {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const { data: vouchers, isLoading, error } = useEventVouchers(eventId);
	const createVoucherMutation = useCreateVoucher({
		onSuccess: () => {
			setShowCreateForm(false);
		},
	});
	const deleteVoucherMutation = useDeleteVoucher();

	// Ensure vouchers is always an array
	const vouchersArray = vouchers || [];

	const filteredVouchers = vouchersArray.filter((voucher) =>
		voucher.code.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (isLoading) {
		return (
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex items-center justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-red-50 border border-red-200 rounded-md p-4">
						<p className="text-red-800">
							Error loading vouchers: {error.message}
						</p>
						{error.message.includes("Network Error") && (
							<p className="text-sm text-red-600 mt-2">
								The backend server might not be running. Please start the
								backend server and try again.
							</p>
						)}
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<div className="px-4 py-6 sm:px-0">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center space-x-4">
						<Link
							to={`/events/${eventId}`}
							className="text-gray-600 hover:text-gray-900 transition-colors"
						>
							← Back to Event
						</Link>
						<h1 className="text-3xl font-bold text-gray-900">Vouchers</h1>
					</div>
					<Button onClick={() => setShowCreateForm(true)}>
						Create Voucher
					</Button>
				</div>

				{/* Search */}
				<div className="mb-6">
					<Input
						type="text"
						placeholder="Search vouchers by code..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-md"
					/>
				</div>

				{/* Create Voucher Form */}
				{showCreateForm && (
					<CreateVoucherForm
						eventId={eventId}
						onSubmit={(data: CreateVoucherRequest) => {
							createVoucherMutation.mutate(data);
						}}
						onCancel={() => setShowCreateForm(false)}
						isLoading={createVoucherMutation.isPending}
					/>
				)}

				{/* Vouchers List */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredVouchers.map((voucher) => (
						<VoucherCard
							key={voucher.id}
							voucher={voucher}
							onDelete={() => {
								if (confirm("Are you sure you want to delete this voucher?")) {
									deleteVoucherMutation.mutate({
										id: voucher.id,
										eventId: Number(eventId),
									});
								}
							}}
							isDeleting={deleteVoucherMutation.isPending}
						/>
					))}
				</div>

				{filteredVouchers.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							{searchTerm
								? "No vouchers found matching your search."
								: "No vouchers yet. Create your first voucher!"}
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
