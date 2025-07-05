import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCreateEvent, useDeleteEvent, useEvents } from "~/services";
import { CreateEventForm } from "./create-event-form";
import { EventCard } from "./event-card";

export function EventsContent() {
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
