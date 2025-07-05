import { useId, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { CreateTicketRequest } from "~/services/types";

interface CreateTicketFormProps {
	onSubmit: (data: CreateTicketRequest) => void;
	onCancel: () => void;
	isLoading: boolean;
	eventId: string;
}

export function CreateTicketForm({
	onSubmit,
	onCancel,
	isLoading,
	eventId,
}: CreateTicketFormProps) {
	const nameId = useId();
	const priceId = useId();
	const quotaId = useId();

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		quota: "",
	});

	const [errors, setErrors] = useState<{
		name?: string;
		price?: string;
		quota?: string;
	}>({});

	const validateForm = (): boolean => {
		const newErrors: typeof errors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Ticket name is required";
		} else if (formData.name.length < 3) {
			newErrors.name = "Ticket name must be at least 3 characters";
		}

		if (!formData.price) {
			newErrors.price = "Price is required";
		} else {
			const price = parseFloat(formData.price);
			if (isNaN(price) || price < 0) {
				newErrors.price = "Price must be a valid positive number";
			}
		}

		if (!formData.quota) {
			newErrors.quota = "Quota is required";
		} else {
			const quota = parseInt(formData.quota);
			if (isNaN(quota) || quota < 1) {
				newErrors.quota = "Quota must be at least 1";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const ticketData: CreateTicketRequest = {
			event_id: eventId,
			name: formData.name.trim(),
			price: parseFloat(formData.price),
			quota: parseInt(formData.quota),
		};

		onSubmit(ticketData);
	};

	const handleInputChange =
		(field: keyof typeof formData) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));

			// Clear error when user starts typing
			if (errors[field]) {
				setErrors((prev) => ({
					...prev,
					[field]: undefined,
				}));
			}
		};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<Label htmlFor={nameId}>Ticket Name</Label>
						<Input
							id={nameId}
							type="text"
							value={formData.name}
							onChange={handleInputChange("name")}
							placeholder="e.g., Early Bird, Regular, VIP"
							className={errors.name ? "border-red-500" : ""}
							required
						/>
						{errors.name && (
							<p className="mt-1 text-sm text-red-600">{errors.name}</p>
						)}
					</div>

					<div>
						<Label htmlFor={priceId}>Price (IDR)</Label>
						<Input
							id={priceId}
							type="number"
							step="1000"
							min="0"
							value={formData.price}
							onChange={handleInputChange("price")}
							placeholder="0"
							className={errors.price ? "border-red-500" : ""}
							required
						/>
						{errors.price && (
							<p className="mt-1 text-sm text-red-600">{errors.price}</p>
						)}
					</div>

					<div>
						<Label htmlFor={quotaId}>Quota</Label>
						<Input
							id={quotaId}
							type="number"
							min="1"
							value={formData.quota}
							onChange={handleInputChange("quota")}
							placeholder="100"
							className={errors.quota ? "border-red-500" : ""}
							required
						/>
						{errors.quota && (
							<p className="mt-1 text-sm text-red-600">{errors.quota}</p>
						)}
					</div>
				</div>

				<div className="flex space-x-3">
					<Button type="submit" disabled={isLoading} className="flex-1">
						{isLoading ? "Creating..." : "Create Ticket"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
						className="flex-1"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
