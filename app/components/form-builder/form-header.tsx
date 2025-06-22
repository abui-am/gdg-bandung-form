interface FormHeaderProps {
	title?: string;
	description?: string;
	onTitleChange?: (title: string) => void;
	onDescriptionChange?: (description: string) => void;
}

export function FormHeader({
	title = "Form tanpa judul",
	description = "Deskripsi formulir",
	onTitleChange,
	onDescriptionChange,
}: FormHeaderProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
			<input
				type="text"
				value={title}
				onChange={(e) => onTitleChange?.(e.target.value)}
				placeholder="Form tanpa judul"
				className="text-3xl font-normal text-gray-800 w-full border-0 outline-none focus:border-b-2 focus:border-purple-500 pb-2 mb-4"
				onClick={(e) => e.stopPropagation()}
			/>
			<input
				type="text"
				value={description}
				onChange={(e) => onDescriptionChange?.(e.target.value)}
				placeholder="Deskripsi formulir"
				className="text-sm text-gray-600 w-full border-0 outline-none focus:border-b focus:border-purple-500 pb-2"
				onClick={(e) => e.stopPropagation()}
			/>
		</div>
	);
}
