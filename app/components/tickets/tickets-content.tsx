import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	useCreateTicket,
	useDeleteTicket,
	useTicketsForManagement,
} from "~/services";
import type { CreateTicketRequest } from "~/services/types";
import { CreateTicketForm } from "./create-ticket-form";
import { TicketCard } from "./ticket-card";

interface TicketsContentProps {
	eventId: string;
}

export function TicketsContent({ eventId }: TicketsContentProps) {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const { data: tickets, isLoading, error } = useTicketsForManagement(eventId);
	const createTicketMutation = useCreateTicket({
		onSuccess: () => {
			setShowCreateForm(false);
		},
	});
	const deleteTicketMutation = useDeleteTicket();

	// Ensure tickets is always an array
	const ticketsArray = tickets || [];

	const filteredTickets = ticketsArray.filter((ticket) =>
		ticket.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
							Error loading tickets: {error.message}
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
					<div className="flex items-center space-x-4">
						<Link
							to={`/events/${eventId}`}
							className="text-gray-600 hover:text-gray-900 transition-colors"
						>
							← Back to Event
						</Link>
						<h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
					</div>
					<Button onClick={() => setShowCreateForm(true)}>Create Ticket</Button>
				</div>

				{/* Search */}
				<div className="mb-6">
					<Input
						type="text"
						placeholder="Search tickets by name..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-md"
					/>
				</div>

				{/* Create Ticket Form */}
				{showCreateForm && (
					<CreateTicketForm
						eventId={eventId}
						onSubmit={(data: CreateTicketRequest) => {
							createTicketMutation.mutate(data);
						}}
						onCancel={() => setShowCreateForm(false)}
						isLoading={createTicketMutation.isPending}
					/>
				)}

				{/* Tickets List */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredTickets.map((ticket) => (
						<TicketCard
							key={ticket.id}
							ticket={ticket}
							onDelete={() => {
								if (confirm("Are you sure you want to delete this ticket?")) {
									deleteTicketMutation.mutate({
										id: ticket.id,
										eventId: eventId,
									});
								}
							}}
							isDeleting={deleteTicketMutation.isPending}
						/>
					))}
				</div>

				{filteredTickets.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							{searchTerm
								? "No tickets found matching your search."
								: "No tickets yet. Create your first ticket!"}
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
