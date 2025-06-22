import { Button } from "~/components/ui/button";

interface AddFieldButtonProps {
	onClick: () => void;
}

export function AddFieldButton({ onClick }: AddFieldButtonProps) {
	return (
		<div className="flex justify-center mt-6">
			<Button
				onClick={onClick}
				className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 h-12 p-0"
				title="Tambah pertanyaan"
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="Add question icon"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</Button>
		</div>
	);
}
