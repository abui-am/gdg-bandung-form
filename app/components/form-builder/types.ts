export type FieldType =
	| "text"
	| "paragraph"
	| "email"
	| "dropdown"
	| "checkbox";

export interface BaseField {
	id: string;
	type: FieldType;
	label: string;
	required: boolean;
	placeholder?: string;
}

export interface TextField extends BaseField {
	type: "text";
}

export interface ParagraphField extends BaseField {
	type: "paragraph";
}

export interface EmailField extends BaseField {
	type: "email";
}

export interface DropdownField extends BaseField {
	type: "dropdown";
	options: string[];
}

export interface CheckboxField extends BaseField {
	type: "checkbox";
	options: string[];
}

export type FormField =
	| TextField
	| ParagraphField
	| EmailField
	| DropdownField
	| CheckboxField;

export interface FormConfig {
	fields: FormField[];
}

export interface DragItem {
	id: string;
	type: string;
}
