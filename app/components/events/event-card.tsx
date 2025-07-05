import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { Event, EventType } from "~/services/types";

interface EventCardProps {
	event: Event;
	onDelete: () => void;
	isDeleting: boolean;
}

export function EventCard({ event, onDelete, isDeleting }: EventCardProps) {
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
