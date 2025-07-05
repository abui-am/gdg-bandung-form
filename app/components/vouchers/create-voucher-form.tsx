import { useId, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { CreateVoucherRequest } from "~/services/types";
import { VoucherType } from "~/services/types";

interface CreateVoucherFormProps {
	onSubmit: (data: CreateVoucherRequest) => void;
	onCancel: () => void;
	isLoading: boolean;
	eventId: string;
}

export function CreateVoucherForm({
	onSubmit,
	onCancel,
	isLoading,
	eventId,
}: CreateVoucherFormProps) {
	const codeId = useId();
	const typeId = useId();
	const valueId = useId();
	const quotaId = useId();
	const expiryDateId = useId();
	const isActiveId = useId();

	const [formData, setFormData] = useState({
		code: "",
		type: VoucherType.PERCENTAGE,
		value: 0,
		quota: 1,
		expiry_date: "",
		is_active: true,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Convert date to ISO string format
		const formatDateForAPI = (dateString: string) => {
			if (!dateString) return "";
			return new Date(dateString).toISOString();
		};

		const voucherData: CreateVoucherRequest = {
			event_id: eventId,
			code: formData.code.toUpperCase(),
			type: formData.type,
			value: formData.value,
			quota: formData.quota,
			expiry_date: formatDateForAPI(formData.expiry_date),
		};

		onSubmit(voucherData);
	};

	const generateRandomCode = () => {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let result = "";
		for (let i = 0; i < 8; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		setFormData({ ...formData, code: result });
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4">Create New Voucher</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor={codeId}>Voucher Code</Label>
						<div className="flex gap-2">
							<Input
								id={codeId}
								value={formData.code}
								onChange={(e) =>
									setFormData({
										...formData,
										code: e.target.value.toUpperCase(),
									})
								}
								placeholder="Enter voucher code"
								required
								className="flex-1"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={generateRandomCode}
								className="whitespace-nowrap"
							>
								Generate
							</Button>
						</div>
					</div>
					<div>
						<Label htmlFor={typeId}>Voucher Type</Label>
						<select
							id={typeId}
							value={formData.type}
							onChange={(e) =>
								setFormData({
									...formData,
									type: e.target.value as VoucherType,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value={VoucherType.PERCENTAGE}>
								Percentage Discount
							</option>
							<option value={VoucherType.FIXED}>Fixed Amount Discount</option>
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor={valueId}>
							Value {formData.type === VoucherType.PERCENTAGE ? "(%)" : "($)"}
						</Label>
						<Input
							id={valueId}
							type="number"
							min="0"
							max={formData.type === VoucherType.PERCENTAGE ? "100" : undefined}
							value={formData.value}
							onChange={(e) =>
								setFormData({ ...formData, value: Number(e.target.value) })
							}
							required
						/>
					</div>
					<div>
						<Label htmlFor={quotaId}>Quota</Label>
						<Input
							id={quotaId}
							type="number"
							min="1"
							value={formData.quota}
							onChange={(e) =>
								setFormData({ ...formData, quota: Number(e.target.value) })
							}
							required
						/>
					</div>
				</div>

				<div>
					<Label htmlFor={expiryDateId}>Expiry Date</Label>
					<Input
						id={expiryDateId}
						type="datetime-local"
						value={formData.expiry_date}
						onChange={(e) =>
							setFormData({ ...formData, expiry_date: e.target.value })
						}
						required
					/>
				</div>

				<div className="flex items-center space-x-2">
					<input
						id={isActiveId}
						type="checkbox"
						checked={formData.is_active}
						onChange={(e) =>
							setFormData({ ...formData, is_active: e.target.checked })
						}
						className="rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<Label htmlFor={isActiveId}>Active immediately</Label>
				</div>

				<div className="flex space-x-2">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Creating..." : "Create Voucher"}
					</Button>
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
