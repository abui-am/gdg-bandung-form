import type { Label } from "@radix-ui/react-label";
import type * as React from "react";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { FormField } from "./types";

interface FieldTypeButtonProps {
	type: string;
	label: string;
	icon: React.ReactNode;
	onDragStart: (e: React.DragEvent, type: string) => void;
	onClick: () => void;
}

export function FieldTypeButton({
	type,
	label,
	icon,
	onDragStart,
	onClick,
}: FieldTypeButtonProps) {
	return (
		<button
			type="button"
			className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors group w-full text-left"
			draggable
			onDragStart={(e) => onDragStart(e, type)}
			onClick={onClick}
		>
			<div className="text-gray-600 group-hover:text-purple-600 transition-colors">
				{icon}
			</div>
			<span className="text-sm text-gray-700 group-hover:text-gray-900">
				{label}
			</span>
		</button>
	);
}

interface FieldPreviewProps {
	field: FormField;
}

export function FieldPreview({ field }: FieldPreviewProps) {
	switch (field.type) {
		case "text":
			return (
				<div className="space-y-2">
					<Label>
						{field.label}
						{field.required && <span className="text-destructive ml-1">*</span>}
					</Label>
					<input
						type="text"
						placeholder={field.placeholder}
						className="w-full px-3 py-2 border rounded-md bg-background"
						disabled
					/>
				</div>
			);

		case "paragraph":
			return (
				<div className="space-y-2">
					<Label>
						{field.label}
						{field.required && <span className="text-destructive ml-1">*</span>}
					</Label>
					<Textarea placeholder={field.placeholder} disabled />
				</div>
			);

		case "email":
			return (
				<div className="space-y-2">
					<Label>
						{field.label}
						{field.required && <span className="text-destructive ml-1">*</span>}
					</Label>
					<input
						type="email"
						placeholder={field.placeholder || "contoh@email.com"}
						className="w-full px-3 py-2 border rounded-md bg-background"
						disabled
					/>
				</div>
			);

		case "dropdown":
			return (
				<div className="space-y-2">
					<Label>
						{field.label}
						{field.required && <span className="text-destructive ml-1">*</span>}
					</Label>
					<select
						className="w-full px-3 py-2 border rounded-md bg-background"
						disabled
					>
						<option>Pilih opsi...</option>
						{field.options.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			);

		case "checkbox":
			return (
				<div className="flex items-center space-x-2">
					<input type="checkbox" className="h-4 w-4" disabled />
					<Label>
						{field.label}
						{field.required && <span className="text-destructive ml-1">*</span>}
					</Label>
				</div>
			);

		default:
			return null;
	}
}
