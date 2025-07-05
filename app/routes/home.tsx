import { Link } from "react-router";
import { ProtectedRoute } from "../components/auth/protected-route";
import { Navigation } from "../components/navigation/navigation";

export function meta() {
	return [
		{ title: "Dashboard - GDG Bandung" },
		{ name: "description", content: "GDG Bandung Dashboard" },
	];
}

export default function Home() {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Navigation />

				<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
					<div className="px-4 py-6 sm:px-0">
						<div className="bg-white shadow rounded-lg p-6">
							<h2 className="text-2xl font-semibold text-gray-900 mb-6">
								Dashboard Overview
							</h2>
							<div className="flex justify-center">
								<Link
									to="/events"
									className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors max-w-md w-full"
								>
									<h3 className="text-xl font-medium text-blue-900 mb-3">
										Events
									</h3>
									<p className="text-blue-700">
										Manage your upcoming events, registrations, forms, tickets,
										and vouchers
									</p>
								</Link>
							</div>
						</div>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}
