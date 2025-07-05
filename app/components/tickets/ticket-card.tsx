import { Button } from "~/components/ui/button";
import type { Ticket } from "~/services/types";

interface TicketCardProps {
	ticket: Ticket;
	onDelete: () => void;
	isDeleting: boolean;
}

export function TicketCard({ ticket, onDelete, isDeleting }: TicketCardProps) {
	const availableTickets = ticket.quota - ticket.sold;
	const soldPercentage = (ticket.sold / ticket.quota) * 100;

	return (
		<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-900 mb-1">
						{ticket.name}
					</h3>
					<p className="text-2xl font-bold text-primary">
						Rp {ticket.price.toLocaleString("id-ID")}
					</p>
				</div>
				<div className="text-right">
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						Active
					</span>
				</div>
			</div>

			<div className="space-y-3 mb-4">
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Quota:</span>
					<span className="font-medium">{ticket.quota}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Sold:</span>
					<span className="font-medium text-green-600">{ticket.sold}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-600">Available:</span>
					<span className="font-medium text-blue-600">{availableTickets}</span>
				</div>
			</div>

			{/* Progress bar */}
			<div className="mb-4">
				<div className="flex justify-between text-xs text-gray-600 mb-1">
					<span>Sales Progress</span>
					<span>{soldPercentage.toFixed(1)}%</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-primary h-2 rounded-full transition-all duration-300"
						style={{ width: `${Math.min(soldPercentage, 100)}%` }}
					></div>
				</div>
			</div>

			<div className="flex space-x-2">
				<Button
					variant="outline"
					size="sm"
					className="flex-1"
					onClick={() => {
						// TODO: Implement edit functionality
						alert("Edit functionality coming soon!");
					}}
				>
					Edit
				</Button>
				<Button
					variant="destructive"
					size="sm"
					className="flex-1"
					onClick={onDelete}
					disabled={isDeleting}
				>
					{isDeleting ? "Deleting..." : "Delete"}
				</Button>
			</div>

			<div className="mt-3 text-xs text-gray-500">
				Created: {new Date(ticket.created_at).toLocaleDateString()}
			</div>
		</div>
	);
}
