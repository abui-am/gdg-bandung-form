export function EmptyState() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-12 text-center">
			<div className="text-gray-400 mb-4">
				<svg
					className="w-12 h-12 mx-auto"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="Add field icon"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</div>
			<p className="text-gray-500 text-lg">
				Klik elemen di sidebar untuk menambahkan ke formulir Anda
			</p>
		</div>
	);
}
