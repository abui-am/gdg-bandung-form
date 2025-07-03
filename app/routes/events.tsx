import { useId, useState } from "react";
import { Link } from "react-router";
import { ProtectedRoute } from "~/components/auth/protected-route";
import { Navigation } from "~/components/navigation/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useCreateEvent, useDeleteEvent, useEvents } from "~/services";
import type { Event, EventType } from "~/services/types";

export function meta() {
	return [
		{ title: "Events - GDG Bandung" },
		{ name: "description", content: "Manage your events" },
	];
}

export default function Events() {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Navigation />
				<EventsContent />
			</div>
		</ProtectedRoute>
	);
}

function EventsContent() {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const { data: events, isLoading, error } = useEvents();
	const createEventMutation = useCreateEvent({
		onSuccess: () => {
			setShowCreateForm(false);
		},
	});
	const deleteEventMutation = useDeleteEvent();

	// Debug logging
	console.log("Events data:", {
		events,
		type: typeof events,
		isArray: Array.isArray(events),
	});

	// Ensure events is always an array and add null checks
	// Handle both direct array and paginated response
	let eventsArray: any[] = [];
	if (Array.isArray(events)) {
		eventsArray = events;
	} else if (events && typeof events === "object") {
		const eventsObj = events as any;
		if ("data" in eventsObj && Array.isArray(eventsObj.data)) {
			// Handle paginated response
			eventsArray = eventsObj.data;
		} else if ("events" in eventsObj && Array.isArray(eventsObj.events)) {
			// Handle nested events property
			eventsArray = eventsObj.events;
		}
	}

	// Mock data for development when backend is not available
	if (eventsArray.length === 0 && import.meta.env.DEV && !isLoading && !error) {
		eventsArray = [
			{
				id: 1,
				title: "GDG Bandung Meetup #1",
				description:
					"Join us for our first meetup of the year! We'll be discussing the latest in web development and sharing insights about modern frameworks.",
				start_date: "2024-03-15T18:00:00Z",
				end_date: "2024-03-15T21:00:00Z",
				location: "Bandung Digital Valley",
				link: "https://meet.google.com/abc-defg-hij",
				event_type: "hybrid",
				is_published: true,
				user_id: 1,
				created_at: "2024-01-15T10:00:00Z",
				updated_at: "2024-01-15T10:00:00Z",
			},
			{
				id: 2,
				title: "Flutter Workshop",
				description:
					"Learn Flutter from scratch! This hands-on workshop will cover everything from basic widgets to state management.",
				start_date: "2024-03-20T09:00:00Z",
				end_date: "2024-03-20T17:00:00Z",
				location: "TechHub Bandung",
				link: "",
				event_type: "offline",
				is_published: false,
				user_id: 1,
				created_at: "2024-01-10T14:30:00Z",
				updated_at: "2024-01-10T14:30:00Z",
			},
		];
	}

	const filteredEvents = eventsArray.filter(
		(event) =>
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
							Error loading events: {error.message}
						</p>
						<p className="text-sm text-red-600 mt-2">
							Debug info: events type = {typeof events}, isArray ={" "}
							{Array.isArray(events) ? "true" : "false"}
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
					<h1 className="text-3xl font-bold text-gray-900">Events</h1>
					<Button onClick={() => setShowCreateForm(true)}>Create Event</Button>
				</div>

				{/* Search */}
				<div className="mb-6">
					<Input
						type="text"
						placeholder="Search events..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-md"
					/>
				</div>

				{/* Create Event Form */}
				{showCreateForm && (
					<CreateEventForm
						onSubmit={(data) => {
							createEventMutation.mutate(data);
						}}
						onCancel={() => setShowCreateForm(false)}
						isLoading={createEventMutation.isPending}
					/>
				)}

				{/* Events List */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredEvents.map((event) => (
						<EventCard
							key={event.id}
							event={event}
							onDelete={() => {
								if (confirm("Are you sure you want to delete this event?")) {
									deleteEventMutation.mutate(event.id);
								}
							}}
							isDeleting={deleteEventMutation.isPending}
						/>
					))}
				</div>

				{filteredEvents.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							{searchTerm
								? "No events found matching your search."
								: "No events yet. Create your first event!"}
						</p>
					</div>
				)}
			</div>
		</main>
	);
}

function EventCard({
	event,
	onDelete,
	isDeleting,
}: {
	event: Event;
	onDelete: () => void;
	isDeleting: boolean;
}) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
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
				<div className="flex justify-between items-start mb-4">
					<h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}
					>
						{event.event_type}
					</span>
				</div>

				<p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

				<div className="space-y-2 mb-4">
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Date:</span>
						<span className="ml-2">
							{formatDate(event.start_date)} - {formatDate(event.end_date)}
						</span>
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Location:</span>
						<span className="ml-2">{event.location}</span>
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<span className="font-medium">Status:</span>
						<span
							className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
								event.is_published
									? "bg-green-100 text-green-800"
									: "bg-yellow-100 text-yellow-800"
							}`}
						>
							{event.is_published ? "Published" : "Draft"}
						</span>
					</div>
				</div>

				<div className="flex space-x-2">
					<Link
						to={`/events/${event.id}`}
						className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
					>
						View Details
					</Link>
					<Button
						variant="outline"
						size="sm"
						onClick={onDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</div>
			</div>
		</div>
	);
}

function CreateEventForm({
	onSubmit,
	onCancel,
	isLoading,
}: {
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
