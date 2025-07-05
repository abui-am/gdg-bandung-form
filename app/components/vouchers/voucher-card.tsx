import { Button } from "~/components/ui/button";
import type { Voucher } from "~/services/types";
import { VoucherType } from "~/services/types";

interface VoucherCardProps {
	voucher: Voucher;
	onDelete: () => void;
	isDeleting: boolean;
}

export function VoucherCard({
	voucher,
	onDelete,
	isDeleting,
}: VoucherCardProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getVoucherTypeColor = (type: VoucherType) => {
		switch (type) {
			case VoucherType.PERCENTAGE:
				return "bg-green-100 text-green-800";
			case VoucherType.FIXED:
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusColor = (isActive: boolean) => {
		return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
	};

	const getVoucherValueDisplay = (type: VoucherType, value: number) => {
		switch (type) {
			case VoucherType.PERCENTAGE:
				return `${value}%`;
			case VoucherType.FIXED:
				return `$${value}`;
			default:
				return value.toString();
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<div className="p-6">
				<div className="flex justify-between items-start mb-4">
					<h3 className="text-xl font-semibold text-gray-900">
						{voucher.code}
					</h3>
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getVoucherTypeColor(voucher.type)}`}
					>
						{voucher.type}
					</span>
				</div>

				<div className="space-y-2 mb-4">
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Value:</span>
						<span className="ml-2">
							{getVoucherValueDisplay(voucher.type, voucher.value)}
						</span>
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Quota:</span>
						<span className="ml-2">{voucher.quota}</span>
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Used:</span>
						<span className="ml-2">{voucher.used}</span>
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Available:</span>
						<span className="ml-2">{voucher.quota - voucher.used}</span>
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Expiry Date:</span>
						<span className="ml-2">{formatDate(voucher.expiry_date)}</span>
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Status:</span>
						<span
							className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.is_active)}`}
						>
							{voucher.is_active ? "Active" : "Inactive"}
						</span>
					</div>
				</div>

				<div className="flex space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							// TODO: Implement edit functionality
							console.log("Edit voucher:", voucher.id);
						}}
					>
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onDelete}
						disabled={isDeleting}
						className="text-red-600 hover:text-red-700"
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</div>
		</div>
	);
}
