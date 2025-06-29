import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/contexts/auth-context";

export function Navigation() {
	const { user, logout } = useAuth();
	const location = useLocation();

	const navItems = [
		{ path: "/", label: "Dashboard" },
		{ path: "/form-builder", label: "Form Builder" },
	];

	return (
		<header className="bg-white shadow">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-6">
					<div className="flex items-center space-x-8">
						<div>
							<h1 className="text-xl font-bold text-gray-900">GDG Bandung</h1>
						</div>
						<nav className="flex space-x-4">
							{navItems.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										location.pathname === item.path
											? "bg-primary text-white"
											: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
									}`}
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>
					<div className="flex items-center space-x-4">
						<span className="text-sm text-gray-600">Welcome, {user?.name}</span>
						<Button variant="outline" onClick={logout}>
							Logout
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
