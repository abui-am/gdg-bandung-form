import * as React from "react";
import { AddFieldButton } from "./add-field-button";
import { EmptyState } from "./empty-state";
import { FieldItem } from "./field-item";
import { FormHeader } from "./form-header";
import { Header } from "./header";
import { MobileOverlay } from "./mobile-overlay";
import { Sidebar } from "./sidebar";
import type { FieldType, FormConfig, FormField } from "./types";
import { createField } from "./utils";

export function GoogleFormBuilder() {
	const [formConfig, setFormConfig] = React.useState<FormConfig>({
		fields: [],
	});
	const [editingField, setEditingField] = React.useState<string | null>(null);
	const [sidebarOpen, setSidebarOpen] = React.useState(true);
	const [localValues, setLocalValues] = React.useState<Record<string, string>>(
		{},
	);
	const [formTitle, setFormTitle] = React.useState("Form tanpa judul");
	const [formDescription, setFormDescription] =
		React.useState("Deskripsi formulir");

	const addField = (type: FieldType) => {
		const newField = createField(type);
		setFormConfig((prev) => ({
			...prev,
			fields: [...prev.fields, newField],
		}));
		setEditingField(newField.id);
	};

	const updateField = React.useCallback((updatedField: FormField) => {
		setFormConfig((prev) => ({
			...prev,
			fields: prev.fields.map((field) =>
				field.id === updatedField.id ? updatedField : field,
			),
		}));
	}, []);

	// Debounced update for text inputs to prevent focus loss
	const debouncedUpdateRef = React.useRef<NodeJS.Timeout | null>(null);
	const handleLabelChange = React.useCallback(
		(fieldId: string, value: string) => {
			// Update local state immediately for responsive UI
			setLocalValues((prev) => ({ ...prev, [fieldId]: value }));

			// Clear previous timeout
			if (debouncedUpdateRef.current) {
				clearTimeout(debouncedUpdateRef.current);
			}

			// Set new timeout to update form config
			debouncedUpdateRef.current = setTimeout(() => {
				setFormConfig((prev) => ({
					...prev,
					fields: prev.fields.map((field) =>
						field.id === fieldId ? { ...field, label: value } : field,
					),
				}));
			}, 300);
		},
		[],
	);

	const deleteField = (fieldId: string) => {
		setFormConfig((prev) => ({
			...prev,
			fields: prev.fields.filter((field) => field.id !== fieldId),
		}));
		setEditingField(null);
	};

	const duplicateField = (field: FormField) => {
		const newField = {
			...field,
			id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			label: `${field.label} - Salinan`,
		};
		setFormConfig((prev) => ({
			...prev,
			fields: [...prev.fields, newField],
		}));
	};

	const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

	return (
		<div className="min-h-screen bg-purple-50">
			{/* Sidebar */}
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				onAddField={addField}
			/>

			{/* Main Content */}
			<div
				className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}
			>
				{/* Header */}
				<Header
					title={formTitle}
					sidebarOpen={sidebarOpen}
					onToggleSidebar={handleSidebarToggle}
				/>

				{/* Form Content */}
				<div className="p-6 max-w-4xl mx-auto">
					{/* Form Header */}
					<FormHeader
						title={formTitle}
						description={formDescription}
						onTitleChange={setFormTitle}
						onDescriptionChange={setFormDescription}
					/>

					{/* Form Fields */}
					{formConfig.fields.length === 0 ? (
						<EmptyState />
					) : (
						<div className="space-y-4">
							{formConfig.fields.map((field) => (
								<FieldItem
									key={field.id}
									field={field}
									isEditing={editingField === field.id}
									localValue={localValues[field.id]}
									onLabelChange={handleLabelChange}
									onUpdateField={updateField}
									onDelete={deleteField}
									onDuplicate={duplicateField}
									onEdit={setEditingField}
								/>
							))}
						</div>
					)}

					{/* Add Field Button */}
					<AddFieldButton onClick={() => setSidebarOpen(true)} />
				</div>
			</div>

			{/* Mobile Overlay */}
			<MobileOverlay
				isVisible={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
		</div>
	);
}
