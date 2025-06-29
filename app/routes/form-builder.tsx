import { ProtectedRoute } from "../components/auth/protected-route";
import { GoogleFormBuilder } from "../components/form-builder/google-form-builder";
import { Navigation } from "../components/navigation/navigation";

export function meta() {
	return [
		{ title: "Form Builder - GDG Bandung" },
		{ name: "description", content: "Build custom forms for your events" },
	];
}

export default function FormBuilderPage() {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<Navigation />
				<main>
					<GoogleFormBuilder />
				</main>
			</div>
		</ProtectedRoute>
	);
}
