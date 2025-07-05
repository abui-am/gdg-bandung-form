import { Textarea } from "~/components/ui/textarea";
import type { FormField } from "./types";

interface FieldPreviewProps {
	field: FormField;
}

export function FieldPreview({ field }: FieldPreviewProps) {
	switch (field.type) {
		case "text":
			return (
				<input
					type="text"
					placeholder={field.placeholder || "Enter your answer..."}
					className="w-full border-0 border-b border-gray-300 focus:border-purple-500 outline-none py-2 text-sm"
					disabled
				/>
			);

		case "paragraph":
			return (
				<Textarea
					placeholder={field.placeholder || "Enter your answer..."}
					className="w-full border border-gray-300 rounded-md focus:border-purple-500 outline-none resize-none"
					rows={3}
					disabled
				/>
			);

		case "email":
			return (
				<input
					type="email"
					placeholder={field.placeholder || "Enter your email..."}
					className="w-full border-0 border-b border-gray-300 focus:border-purple-500 outline-none py-2 text-sm"
					disabled
				/>
			);

		case "dropdown":
			return (
				<div className="space-y-2">
					{field.options.map((option) => (
						<div key={option} className="flex items-center gap-2">
							<div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
							<span className="text-sm text-gray-600">{option}</span>
						</div>
					))}
				</div>
			);

		case "checkbox":
			return (
				<div className="space-y-2">
					{field.options?.map((option) => (
						<div key={option} className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
							<span className="text-sm text-gray-600">{option}</span>
						</div>
					))}
				</div>
			);

		default:
			return null;
	}
}
