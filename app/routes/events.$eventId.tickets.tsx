import { useParams } from "react-router";
import { TicketsContent } from "~/components/tickets";

export default function EventTicketsPage() {
	const { eventId } = useParams<{ eventId: string }>();

	if (!eventId) {
		return (
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-red-50 border border-red-200 rounded-md p-4">
						<p className="text-red-800">Event ID is required.</p>
					</div>
				</div>
			</div>
		);
	}

	return <TicketsContent eventId={eventId} />;
}
