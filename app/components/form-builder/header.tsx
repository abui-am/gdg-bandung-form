import { Button } from "~/components/ui/button";

interface HeaderProps {
	title?: string;
	sidebarOpen: boolean;
	onToggleSidebar: () => void;
}

export function Header({
	title = "Form tanpa judul",
	sidebarOpen,
	onToggleSidebar,
}: HeaderProps) {
	return (
		<div className="bg-white shadow-sm p-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				{!sidebarOpen && (
					<Button variant="ghost" size="sm" onClick={onToggleSidebar}>
						→
					</Button>
				)}
				<h1 className="text-xl font-medium text-gray-800">{title}</h1>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm">
					Preview
				</Button>
				<Button size="sm" className="bg-purple-600 hover:bg-purple-700">
					Kirim
				</Button>
			</div>
		</div>
	);
}
