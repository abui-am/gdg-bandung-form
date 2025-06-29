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
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<div className="bg-blue-50 p-4 rounded-lg">
									<h3 className="text-lg font-medium text-blue-900 mb-2">
										Events
									</h3>
									<p className="text-blue-700">
										Manage your upcoming events and registrations
									</p>
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<h3 className="text-lg font-medium text-green-900 mb-2">
										Forms
									</h3>
									<p className="text-green-700">
										Create and customize registration forms
									</p>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<h3 className="text-lg font-medium text-purple-900 mb-2">
										Analytics
									</h3>
									<p className="text-purple-700">
										View registration stats and insights
									</p>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}
