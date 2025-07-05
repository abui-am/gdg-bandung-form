import { useId, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ProtectedRoute } from "~/components/auth/protected-route";
import { Navigation } from "~/components/navigation/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useEventDetails, useUpdateEvent } from "~/services";
import type { EventType } from "~/services/types";

export function meta() {
	return [
		{ title: "Event Details - GDG Bandung" },
		{ name: "description", content: "Event details and management" },
	];
}

export default function EventDetail() {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Navigation />
				<EventDetailContent />
			</div>
		</ProtectedRoute>
	);
}

function EventDetailContent() {
	const { eventId } = useParams();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);

	// Validate eventId
	const isValidId = eventId;
	const numericId = isValidId ? parseInt(eventId, 10) : 0;

	const { data: event, isLoading, error } = useEventDetails(eventId || "");
	const updateEventMutation = useUpdateEvent({
		onSuccess: () => {
			setIsEditing(false);
		},
	});

	if (!isValidId) {
		return (
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-red-50 border border-red-200 rounded-md p-4">
						<p className="text-red-800">Invalid event ID: {eventId}</p>
						<Button onClick={() => navigate("/events")} className="mt-2">
							Back to Events
						</Button>
					</div>
				</div>
			</main>
		);
	}

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

	if (error || !event) {
		return (
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-red-50 border border-red-200 rounded-md p-4">
						<p className="text-red-800">
							{error
								? `Error loading event: ${error.message}`
								: "Event not found"}
						</p>
						{/* Debug information */}
						<div className="mt-2 text-sm text-red-600">
							<p>Event ID: {eventId}</p>
							<p>Parsed ID: {numericId}</p>
							<p>Error: {error?.message || "No error"}</p>
							<p>Has Event: {event ? "Yes" : "No"}</p>
							{error?.message?.includes("Network Error") && (
								<p className="mt-1">The backend server might not be running.</p>
							)}
						</div>
						<Button onClick={() => navigate("/events")} className="mt-2">
							Back to Events
						</Button>
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
							to="/events"
							className="text-gray-600 hover:text-gray-900 transition-colors"
						>
							← Back to Events
						</Link>
						<h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
					</div>
					<div className="flex space-x-2">
						{!isEditing && (
							<Button onClick={() => setIsEditing(true)}>Edit Event</Button>
						)}
					</div>
				</div>

				{isEditing ? (
					<EditEventForm
						event={event}
						onSubmit={(data) => {
							updateEventMutation.mutate({ id: String(event.id), data });
						}}
						onCancel={() => setIsEditing(false)}
						isLoading={updateEventMutation.isPending}
					/>
				) : (
					<EventDetails event={event} />
				)}
			</div>
		</main>
	);
}

function EventDetails({ event }: { event: any }) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getEventTypeColor = (type: EventType) => {
		switch (type) {
			case "online":
				return "bg-blue-100 text-blue-800";
			case "offline":
				return "bg-green-100 text-green-800";
			case "hybrid":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<div className="p-6">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h2 className="text-2xl font-semibold text-gray-900 mb-2">
							{event.title}
						</h2>
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.event_type)}`}
						>
							{event.event_type}
						</span>
					</div>
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							event.is_published
								? "bg-green-100 text-green-800"
								: "bg-yellow-100 text-yellow-800"
						}`}
					>
						{event.is_published ? "Published" : "Draft"}
					</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							Event Details
						</h3>
						<div className="space-y-3">
							<div>
								<span className="font-medium text-gray-700">Start Date:</span>
								<p className="text-gray-900">{formatDate(event.start_date)}</p>
							</div>
							<div>
								<span className="font-medium text-gray-700">End Date:</span>
								<p className="text-gray-900">{formatDate(event.end_date)}</p>
							</div>
							<div>
								<span className="font-medium text-gray-700">Location:</span>
								<p className="text-gray-900">{event.location}</p>
							</div>
							{event.link && (
								<div>
									<span className="font-medium text-gray-700">Link:</span>
									<a
										href={event.link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-800 break-all"
									>
										{event.link}
									</a>
								</div>
							)}
						</div>
					</div>

					<div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							Description
						</h3>
						<p className="text-gray-700 whitespace-pre-wrap">
							{event.description}
						</p>
					</div>
				</div>

				<div className="border-t pt-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Quick Actions
					</h3>
					<div className="flex space-x-4">
						<Link
							to={`/events/${String(event.id)}/form`}
							className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
						>
							Manage Form
						</Link>
						<Link
							to={`/events/${String(event.id)}/tickets`}
							className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
						>
							Manage Tickets
						</Link>
						<Link
							to={`/events/${String(event.id)}/vouchers`}
							className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
						>
							Manage Vouchers
						</Link>
						<Link
							to={`/events/${String(event.id)}/registrations`}
							className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
						>
							View Registrations
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

function EditEventForm({
	event,
	onSubmit,
	onCancel,
	isLoading,
}: {
	event: any;
	onSubmit: (data: any) => void;
	onCancel: () => void;
	isLoading: boolean;
}) {
	const titleId = useId();
	const eventTypeId = useId();
	const descriptionId = useId();
	const startDateId = useId();
	const endDateId = useId();
	const locationId = useId();
	const linkId = useId();
	const isPublishedId = useId();

	// Convert API date format to datetime-local format
	const formatDateForForm = (dateString: string) => {
		if (!dateString) return "";
		// Convert ISO string to datetime-local format (YYYY-MM-DDTHH:MM)
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	const [formData, setFormData] = useState({
		title: event.title,
		description: event.description,
		start_date: formatDateForForm(event.start_date),
		end_date: formatDateForForm(event.end_date),
		location: event.location,
		link: event.link || "",
		event_type: event.event_type as EventType,
		is_published: event.is_published,
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
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">Edit Event</h2>
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
						rows={4}
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
					<Label htmlFor={isPublishedId}>Published</Label>
				</div>

				<div className="flex space-x-2">
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
