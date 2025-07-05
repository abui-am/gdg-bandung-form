import { useId, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { EventType } from "~/services/types";

interface CreateEventFormProps {
	onSubmit: (data: any) => void;
	onCancel: () => void;
	isLoading: boolean;
}

export function CreateEventForm({
	onSubmit,
	onCancel,
	isLoading,
}: CreateEventFormProps) {
	const titleId = useId();
	const eventTypeId = useId();
	const descriptionId = useId();
	const startDateId = useId();
	const endDateId = useId();
	const locationId = useId();
	const linkId = useId();
	const isPublishedId = useId();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		start_date: "",
		end_date: "",
		location: "",
		link: "",
		event_type: "offline" as EventType,
		is_published: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Convert datetime-local format to ISO string format
		const formatDateForAPI = (dateString: string) => {
			if (!dateString) return "";
			// Convert to ISO string format
			return new Date(dateString).toISOString();
		};

		const formattedData = {
			...formData,
			start_date: formatDateForAPI(formData.start_date),
			end_date: formatDateForAPI(formData.end_date),
		};

		onSubmit(formattedData);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 className="text-xl font-semibold mb-4">Create New Event</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor={titleId}>Title</Label>
						<Input
							id={titleId}
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							required
						/>
					</div>
					<div>
						<Label htmlFor={eventTypeId}>Event Type</Label>
						<select
							id={eventTypeId}
							value={formData.event_type}
							onChange={(e) =>
								setFormData({
									...formData,
									event_type: e.target.value as EventType,
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="offline">Offline</option>
							<option value="online">Online</option>
							<option value="hybrid">Hybrid</option>
						</select>
					</div>
				</div>

				<div>
					<Label htmlFor={descriptionId}>Description</Label>
					<Textarea
						id={descriptionId}
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						required
						rows={3}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor={startDateId}>Start Date</Label>
						<Input
							id={startDateId}
							type="datetime-local"
							value={formData.start_date}
							onChange={(e) =>
								setFormData({ ...formData, start_date: e.target.value })
							}
							required
						/>
					</div>
					<div>
						<Label htmlFor={endDateId}>End Date</Label>
						<Input
							id={endDateId}
							type="datetime-local"
							value={formData.end_date}
							onChange={(e) =>
								setFormData({ ...formData, end_date: e.target.value })
							}
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor={locationId}>Location</Label>
						<Input
							id={locationId}
							value={formData.location}
							onChange={(e) =>
								setFormData({ ...formData, location: e.target.value })
							}
							required
						/>
					</div>
					<div>
						<Label htmlFor={linkId}>Link (for online/hybrid events)</Label>
						<Input
							id={linkId}
							type="url"
							value={formData.link}
							onChange={(e) =>
								setFormData({ ...formData, link: e.target.value })
							}
						/>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<input
						id={isPublishedId}
						type="checkbox"
						checked={formData.is_published}
						onChange={(e) =>
							setFormData({ ...formData, is_published: e.target.checked })
						}
						className="rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<Label htmlFor={isPublishedId}>Publish immediately</Label>
				</div>

				<div className="flex space-x-2">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Creating..." : "Create Event"}
					</Button>
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
