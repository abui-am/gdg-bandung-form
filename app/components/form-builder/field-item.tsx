import type * as React from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { FieldPreview } from "./field-preview";
import type { FormField } from "./types";

interface FieldItemProps {
	field: FormField;
	isEditing: boolean;
	localValue?: string;
	onLabelChange: (fieldId: string, value: string) => void;
	onUpdateField: (field: FormField) => void;
	onDelete: (fieldId: string) => void;
	onDuplicate: (field: FormField) => void;
	onEdit: (fieldId: string) => void;
}

export function FieldItem({
	field,
	isEditing,
	localValue,
	onLabelChange,
	onUpdateField,
	onDelete,
	onDuplicate,
	onEdit,
}: FieldItemProps) {
	// Use a stable value to prevent re-renders that cause focus loss
	const inputValue = localValue !== undefined ? localValue : field.label;

	const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		onUpdateField({
			...field,
			required: e.target.checked,
		});
	};

	return (
		<button
			type="button"
			className={`bg-white rounded-lg shadow-sm border p-6 transition-all duration-200 cursor-pointer w-full text-left ${
				isEditing
					? "ring-2 ring-purple-500 border-purple-500"
					: "hover:shadow-md"
			}`}
			onClick={() => onEdit(field.id)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onEdit(field.id);
				}
			}}
		>
			{/* Debug indicator */}
			{isEditing && (
				<div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
					EDITING: {field.type}
				</div>
			)}

			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<input
							type="text"
							value={inputValue}
							onChange={(e) => onLabelChange(field.id, e.target.value)}
							onClick={(e) => {
								e.stopPropagation();
								onEdit(field.id);
							}}
							onFocus={(e) => {
								e.stopPropagation();
								onEdit(field.id);
							}}
							className="text-lg font-medium text-gray-800 w-full border-0 outline-none focus:border-b-2 focus:border-purple-500 pb-1"
							placeholder="Pertanyaan"
						/>
					</div>
					<div className="flex items-center gap-1 ml-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onDuplicate(field);
							}}
							title="Duplikat"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-label="Duplicate field"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onDelete(field.id);
							}}
							className="text-red-600 hover:text-red-700"
							title="Hapus"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-label="Delete field"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</Button>
					</div>
				</div>

				<div className="mt-4">
					<FieldPreview field={field} />
				</div>

				<div className="flex items-center justify-between pt-4 border-t border-gray-100">
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id={`required-${field.id}`}
							checked={field.required}
							onChange={handleRequiredChange}
							onClick={(e) => e.stopPropagation()}
							className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
						/>
						<Label
							htmlFor={`required-${field.id}`}
							className="text-sm text-gray-600"
							onClick={(e) => e.stopPropagation()}
						>
							Wajib
						</Label>
					</div>
				</div>
			</div>
		</button>
	);
}
