import { ProtectedRoute } from "~/components/auth/protected-route";
import { EventsContent } from "~/components/events";
import { Navigation } from "~/components/navigation/navigation";

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
