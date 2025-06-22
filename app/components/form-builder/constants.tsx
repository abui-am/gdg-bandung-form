import type * as React from "react";
import type { FieldType } from "./types";

export interface FieldTypeConfig {
	type: FieldType;
	label: string;
	icon: React.ReactNode;
}

export const fieldTypes: FieldTypeConfig[] = [
	{
		type: "text" as FieldType,
		label: "Teks singkat",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-label="Text input icon"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M4 6h16M4 12h16M4 18h7"
				/>
			</svg>
		),
	},
	{
		type: "paragraph" as FieldType,
		label: "Paragraf",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-label="Paragraph icon"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M4 6h16M4 10h16M4 14h16M4 18h16"
				/>
			</svg>
		),
	},
	{
		type: "email" as FieldType,
		label: "Email",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-label="Email icon"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
				/>
			</svg>
		),
	},
	{
		type: "dropdown" as FieldType,
		label: "Pilihan ganda",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-label="Dropdown icon"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M19 9l-7 7-7-7"
				/>
			</svg>
		),
	},
	{
		type: "checkbox" as FieldType,
		label: "Kotak centang",
		icon: (
			<svg
				className="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-label="Checkbox icon"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
	},
];
