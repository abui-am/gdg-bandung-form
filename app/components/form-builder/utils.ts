import type { FieldType, FormField } from "./types";

export const createField = (type: FieldType): FormField => {
	const baseField = {
		id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		type,
		label: `Pertanyaan tanpa judul`,
		required: false,
	};

	switch (type) {
		case "text":
			return { ...baseField, type: "text" };
		case "paragraph":
			return { ...baseField, type: "paragraph" };
		case "email":
			return { ...baseField, type: "email" };
		case "dropdown":
			return { ...baseField, type: "dropdown", options: ["Opsi 1"] };
		case "checkbox":
			return { ...baseField, type: "checkbox" };
		default:
			return { ...baseField, type: "text" };
	}
};
