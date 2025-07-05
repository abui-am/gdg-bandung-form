import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { FieldEditor } from "~/components/form-builder";
import { InteractiveFormPreview } from "~/components/form-builder/interactive-form-preview";
import type {
	FormField as BuilderFormField,
	FormConfig,
} from "~/components/form-builder/types";
import { Button } from "~/components/ui/button";
import {
	useCreateOrUpdateForm,
	useDeleteForm,
} from "~/services/mutations/forms";
import { useFormForEdit } from "~/services/queries/forms";
import type { CreateFormRequest, Form, FormField } from "~/services/types";

export function meta() {
	return [
		{ title: "Manage Form - GDG Bandung" },
		{ name: "description", content: "Manage event registration form" },
	];
}

export default function ManageForm() {
	const params = useParams();
	const eventId = params.eventId;
	const [formConfig, setFormConfig] = useState<FormConfig>({ fields: [] });
	const [isLoading, setIsLoading] = useState(false);

	// Fetch existing form data
	const { data: existingForm, isLoading: isLoadingForm } = useFormForEdit(
		eventId || "",
	);

	// Convert API form fields to builder format when data is loaded
	useEffect(() => {
		if (existingForm) {
			const convertedFields: BuilderFormField[] = existingForm.form_config.map(
				(field) => {
					const baseField = {
						id: field.id,
						label: field.label,
						required: field.required,
						placeholder: field.properties?.placeholder,
					};

					switch (field.type) {
						case "text":
							return { ...baseField, type: "text" as const };
						case "textarea":
							return { ...baseField, type: "paragraph" as const };
						case "email":
							return { ...baseField, type: "email" as const };
						case "dropdown":
							return {
								...baseField,
								type: "dropdown" as const,
								options: field.options || [],
							};
						case "checkbox":
							return { ...baseField, type: "checkbox" as const };
						default:
							return { ...baseField, type: "text" as const };
					}
				},
			);

			setFormConfig({ fields: convertedFields });
		}
	}, [existingForm]);

	const createOrUpdateFormMutation = useCreateOrUpdateForm({
		onSuccess: () => {
			setIsLoading(false);
			toast.success("Form saved successfully!");
		},
		onError: (error) => {
			setIsLoading(false);
			console.error("Error saving form:", error);
			toast.error("Failed to save form. Please try again.");
		},
	});

	const deleteFormMutation = useDeleteForm({
		onSuccess: () => {
			setFormConfig({ fields: [] });
			toast.success("Form deleted successfully!");
		},
		onError: (error) => {
			console.error("Error deleting form:", error);
			toast.error("Failed to delete form. Please try again.");
		},
	});

	// Convert builder form fields to API format
	const convertToApiFormat = (
		builderFields: BuilderFormField[],
	): FormField[] => {
		return builderFields.map((field) => {
			const baseField: FormField = {
				id: field.id,
				type: field.type as FormField["type"], // Convert builder type to API type
				label: field.label,
				required: field.required,
				properties: {
					placeholder: field.placeholder,
				},
			};

			if (field.type === "dropdown") {
				baseField.options = field.options;
			}

			return baseField;
		});
	};

	const handleSaveForm = () => {
		if (!eventId) {
			toast.error(
				"Event ID is missing. Please refresh the page and try again.",
			);
			return;
		}

		setIsLoading(true);
		const apiFormFields = convertToApiFormat(formConfig.fields);

		// Validate that we have form fields
		if (apiFormFields.length === 0) {
			toast.error("Please add at least one field to the form before saving.");
			setIsLoading(false);
			return;
		}

		const requestData = {
			event_id: eventId, // event_id is string type in CreateFormRequest
			form_config: apiFormFields,
		};

		console.log("Saving form with data:", requestData);
		createOrUpdateFormMutation.mutate(requestData);
	};

	const handleDeleteForm = () => {
		if (!eventId || !existingForm) return;

		if (
			confirm(
				"Are you sure you want to delete this form? This action cannot be undone.",
			)
		) {
			deleteFormMutation.mutate(parseInt(eventId, 10));
		}
	};

	const handleFormConfigChange = (newConfig: FormConfig) => {
		setFormConfig(newConfig);
	};

	if (isLoadingForm) {
		return (
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex items-center justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<div className="px-4 py-6 sm:px-0">
				{/* Header */}
				<FormHeader eventId={eventId} />

				{/* Form Builder */}
				<FormBuilderSection
					formConfig={formConfig}
					onFormConfigChange={handleFormConfigChange}
					existingForm={existingForm}
					onSave={handleSaveForm}
					onDelete={handleDeleteForm}
					isLoading={isLoading}
					createOrUpdateFormMutation={createOrUpdateFormMutation}
					deleteFormMutation={deleteFormMutation}
				/>

				{/* Form Preview Section */}
				{formConfig.fields.length > 0 && (
					<FormPreviewSection
						formConfig={formConfig}
						onSave={handleSaveForm}
						isLoading={isLoading}
					/>
				)}
			</div>
		</main>
	);
}

// Header Component
function FormHeader({ eventId }: { eventId: string | undefined }) {
	return (
		<div className="mb-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Manage Form</h1>
					<p className="mt-2 text-gray-600">
						Create and customize the registration form for your event
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<Link
						to={`/events/${eventId}`}
						className="text-gray-600 hover:text-gray-900"
					>
						← Back to Event
					</Link>
				</div>
			</div>
		</div>
	);
}

// Form Builder Section Component
function FormBuilderSection({
	formConfig,
	onFormConfigChange,
	existingForm,
	onSave,
	onDelete,
	isLoading,
	createOrUpdateFormMutation,
	deleteFormMutation,
}: {
	formConfig: FormConfig;
	onFormConfigChange: (config: FormConfig) => void;
	existingForm: Form | undefined;
	onSave: () => void;
	onDelete: () => void;
	isLoading: boolean;
	createOrUpdateFormMutation: UseMutationResult<Form, Error, CreateFormRequest>;
	deleteFormMutation: UseMutationResult<{ message: string }, Error, number>;
}) {
	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-gray-900">Form Builder</h2>
					<div className="flex items-center space-x-3">
						{existingForm && (
							<Button
								variant="outline"
								onClick={onDelete}
								disabled={deleteFormMutation.isPending}
							>
								{deleteFormMutation.isPending ? "Deleting..." : "Delete Form"}
							</Button>
						)}
						<Button
							onClick={onSave}
							disabled={isLoading || createOrUpdateFormMutation.isPending}
						>
							{isLoading || createOrUpdateFormMutation.isPending
								? "Saving..."
								: existingForm
									? "Update Form"
									: "Create Form"}
						</Button>
					</div>
				</div>

				<ControlledFormBuilder
					formConfig={formConfig}
					onFormConfigChange={onFormConfigChange}
				/>
			</div>
		</div>
	);
}

// Form Preview Section Component
function FormPreviewSection({
	formConfig,
	onSave,
	isLoading,
}: {
	formConfig: FormConfig;
	onSave: () => void;
	isLoading: boolean;
}) {
	const handleFormSubmit = (formData: Record<string, any>) => {
		console.log("Form submitted with data:", formData);
		// In a real application, you would send this data to your API
		toast.success("Form preview submitted successfully!", {
			description: "Check the console for submitted data.",
		});
	};

	return (
		<div className="mt-8">
			<InteractiveFormPreview
				formConfig={formConfig}
				onSubmit={handleFormSubmit}
			/>
			<div className="mt-6 flex flex-col items-center">
				<Button
					onClick={onSave}
					disabled={isLoading}
					className="w-full max-w-xs"
				>
					{isLoading ? "Saving..." : "Save Form"}
				</Button>
			</div>
		</div>
	);
}

// Controlled Form Builder Component
function ControlledFormBuilder({
	formConfig,
	onFormConfigChange,
}: {
	formConfig: FormConfig;
	onFormConfigChange: (config: FormConfig) => void;
}) {
	const [editingField, setEditingField] = useState<string | null>(null);

	const [draggedType, setDraggedType] = useState<
		BuilderFormField["type"] | null
	>(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const fieldTypes: Array<{
		type: BuilderFormField["type"];
		label: string;
		icon: string;
	}> = [
		{
			type: "text",
			label: "Short Text",
			icon: "📝",
		},
		{
			type: "paragraph",
			label: "Long Text",
			icon: "📄",
		},
		{
			type: "email",
			label: "Email",
			icon: "📧",
		},
		{
			type: "dropdown",
			label: "Dropdown",
			icon: "📋",
		},
		{
			type: "checkbox",
			label: "Checkbox",
			icon: "☑️",
		},
	];

	const createField = (type: BuilderFormField["type"]): BuilderFormField => {
		const baseField = {
			id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			label: `Field ${type}`,
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
				return {
					...baseField,
					type: "dropdown",
					options: ["Option 1", "Option 2"],
				};
			case "checkbox":
				return {
					...baseField,
					type: "checkbox",
					options: ["Option 1", "Option 2"],
				};
			default:
				return { ...baseField, type: "text" };
		}
	};

	const addField = (type: BuilderFormField["type"]) => {
		const newField = createField(type);
		onFormConfigChange({
			...formConfig,
			fields: [...formConfig.fields, newField],
		});
		// Close mobile menu after adding field
		setIsMobileMenuOpen(false);
	};

	const updateField = (updatedField: BuilderFormField) => {
		onFormConfigChange({
			...formConfig,
			fields: formConfig.fields.map((field) =>
				field.id === updatedField.id ? updatedField : field,
			),
		});
	};

	const deleteField = (fieldId: string) => {
		onFormConfigChange({
			...formConfig,
			fields: formConfig.fields.filter((field) => field.id !== fieldId),
		});
		setEditingField(null);
	};

	const moveField = (fromIndex: number, toIndex: number) => {
		const newFields = [...formConfig.fields];
		const [movedField] = newFields.splice(fromIndex, 1);
		newFields.splice(toIndex, 0, movedField);
		onFormConfigChange({ ...formConfig, fields: newFields });
	};

	const handleDragStart = (
		e: React.DragEvent,
		type: BuilderFormField["type"],
	) => {
		setDraggedType(type);
		e.dataTransfer.effectAllowed = "copy";
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "copy";
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (draggedType) {
			addField(draggedType);
			setDraggedType(null);
		}
	};

	const editingFieldData = editingField
		? formConfig.fields.find((f) => f.id === editingField) || undefined
		: undefined;

	return (
		<div className="space-y-6">
			{/* Mobile Field Types Toggle */}
			<div className="lg:hidden">
				<Button
					variant="outline"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="w-full flex items-center justify-between"
				>
					<span>Add Field Types</span>
					<span>{isMobileMenuOpen ? "▼" : "▲"}</span>
				</Button>
				{isMobileMenuOpen && (
					<div className="mt-4 p-4 border rounded-lg bg-gray-50">
						<FieldTypesPanel
							fieldTypes={fieldTypes}
							onAddField={addField}
							onDragStart={handleDragStart}
							isMobile={true}
						/>
					</div>
				)}
			</div>

			{/* Desktop Layout - 3 columns */}
			<div className="hidden lg:grid lg:grid-cols-3 gap-6 items-stretch min-h-[500px]">
				{/* Field Types Panel */}
				<div className="h-full flex flex-col">
					<FieldTypesPanel
						fieldTypes={fieldTypes}
						onAddField={addField}
						onDragStart={handleDragStart}
						isMobile={false}
					/>
				</div>

				{/* Form Builder Area */}
				<div className="h-full flex flex-col">
					<FormBuilderArea
						formConfig={formConfig}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onEditField={setEditingField}
						onMoveField={moveField}
						onDeleteField={deleteField}
					/>
				</div>

				{/* Field Editor Panel */}
				<div className="h-full flex flex-col">
					<FieldEditorPanel
						editingFieldData={editingFieldData}
						onUpdateField={updateField}
						onCancelEdit={() => setEditingField(null)}
						onDeleteField={deleteField}
					/>
				</div>
			</div>

			{/* Mobile Layout */}
			<div className="lg:hidden space-y-6">
				{/* Form Builder Area */}
				<FormBuilderArea
					formConfig={formConfig}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onEditField={setEditingField}
					onMoveField={moveField}
					onDeleteField={deleteField}
				/>

				{/* Field Editor Panel */}
				{editingFieldData && (
					<FieldEditorPanel
						editingFieldData={editingFieldData}
						onUpdateField={updateField}
						onCancelEdit={() => setEditingField(null)}
						onDeleteField={deleteField}
					/>
				)}
			</div>
		</div>
	);
}

// Field Types Panel Component
function FieldTypesPanel({
	fieldTypes,
	onAddField,
	onDragStart,
	isMobile,
}: {
	fieldTypes: Array<{
		type: BuilderFormField["type"];
		label: string;
		icon: string;
	}>;
	onAddField: (type: BuilderFormField["type"]) => void;
	onDragStart: (e: React.DragEvent, type: BuilderFormField["type"]) => void;
	isMobile: boolean;
}) {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Field Types</h3>
			<div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-1"}`}>
				{fieldTypes.map((fieldType) => (
					<button
						key={fieldType.type}
						type="button"
						draggable={!isMobile}
						onDragStart={
							!isMobile ? (e) => onDragStart(e, fieldType.type) : undefined
						}
						onClick={() => onAddField(fieldType.type)}
						className="flex items-center space-x-3 p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
					>
						<span className="text-2xl">{fieldType.icon}</span>
						<span className="text-sm font-medium">{fieldType.label}</span>
					</button>
				))}
			</div>
		</div>
	);
}

// Form Builder Area Component
function FormBuilderArea({
	formConfig,
	onDragOver,
	onDrop,
	onEditField,
	onMoveField,
	onDeleteField,
}: {
	formConfig: FormConfig;
	onDragOver: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
	onEditField: (fieldId: string) => void;
	onMoveField: (fromIndex: number, toIndex: number) => void;
	onDeleteField: (fieldId: string) => void;
}) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Form Fields</h3>
				<div className="text-sm text-gray-600">
					{formConfig.fields.length} field(s)
				</div>
			</div>

			<button
				type="button"
				className="w-full min-h-96 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-blue-300 transition-colors"
				onDragOver={onDragOver}
				onDrop={onDrop}
			>
				{formConfig.fields.length === 0 ? (
					<div className="text-center text-gray-500 py-12">
						<p className="text-lg mb-2">Form is empty</p>
						<p className="text-sm">
							<span className="hidden lg:inline">
								Drag & drop fields from the left panel or{" "}
							</span>
							Click field buttons to add
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{formConfig.fields.map((field, index) => (
							<FormFieldItem
								key={field.id}
								field={field}
								index={index}
								totalFields={formConfig.fields.length}
								onEdit={() => onEditField(field.id)}
								onMoveUp={() => onMoveField(index, index - 1)}
								onMoveDown={() => onMoveField(index, index + 1)}
								onDelete={() => onDeleteField(field.id)}
							/>
						))}
					</div>
				)}
			</button>
		</div>
	);
}

// Form Field Item Component
function FormFieldItem({
	field,
	index,
	totalFields,
	onEdit,
	onMoveUp,
	onMoveDown,
	onDelete,
}: {
	field: BuilderFormField;
	index: number;
	totalFields: number;
	onEdit: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	onDelete: () => void;
}) {
	return (
		<div className="relative group p-4 border rounded-lg bg-white hover:border-blue-300 transition-colors">
			<div className="space-y-2">
				<div className="block text-sm font-medium text-gray-700">
					{field.label}
					{field.required && <span className="text-red-500 ml-1">*</span>}
				</div>
				<FormFieldPreview field={field} />
			</div>

			{/* Field Controls - Desktop */}
			<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
				<div className="flex items-center gap-1">
					<Button variant="outline" size="sm" onClick={onEdit}>
						Edit
					</Button>
					{index > 0 && (
						<Button variant="outline" size="sm" onClick={onMoveUp}>
							↑
						</Button>
					)}
					{index < totalFields - 1 && (
						<Button variant="outline" size="sm" onClick={onMoveDown}>
							↓
						</Button>
					)}
					<Button variant="outline" size="sm" onClick={onDelete}>
						Delete
					</Button>
				</div>
			</div>

			{/* Field Controls - Mobile */}
			<div className="lg:hidden mt-4 pt-4 border-t">
				<div className="flex flex-wrap items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={onEdit}
						className="flex-1"
					>
						Edit
					</Button>
					<div className="flex gap-1">
						{index > 0 && (
							<Button variant="outline" size="sm" onClick={onMoveUp}>
								↑
							</Button>
						)}
						{index < totalFields - 1 && (
							<Button variant="outline" size="sm" onClick={onMoveDown}>
								↓
							</Button>
						)}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={onDelete}
						className="text-red-600 hover:text-red-700"
					>
						Delete
					</Button>
				</div>
			</div>
		</div>
	);
}

// Field Editor Panel Component
function FieldEditorPanel({
	editingFieldData,
	onUpdateField,
	onCancelEdit,
	onDeleteField,
}: {
	editingFieldData: BuilderFormField | undefined;
	onUpdateField: (field: BuilderFormField) => void;
	onCancelEdit: () => void;
	onDeleteField: (fieldId: string) => void;
}) {
	return (
		<div className="space-y-4 flex-1 flex flex-col">
			<h3 className="text-lg font-semibold">Field Editor</h3>
			{editingFieldData ? (
				<div className="p-4 border rounded-lg bg-white flex-1 flex flex-col">
					<FieldEditor
						field={editingFieldData}
						onUpdate={onUpdateField}
						onDelete={() => onDeleteField(editingFieldData.id)}
						onClose={onCancelEdit}
					/>
				</div>
			) : (
				<div className="p-4 border rounded-lg bg-gray-50 text-center text-gray-500 flex-1 flex items-center justify-center">
					Select a field to edit
				</div>
			)}
		</div>
	);
}

// Form Field Preview Component
function FormFieldPreview({ field }: { field: BuilderFormField }) {
	switch (field.type) {
		case "text":
			return (
				<input
					type="text"
					placeholder={field.placeholder || "Enter text..."}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled
				/>
			);
		case "paragraph":
			return (
				<textarea
					placeholder={field.placeholder || "Enter text..."}
					rows={3}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled
				/>
			);
		case "email":
			return (
				<input
					type="email"
					placeholder={field.placeholder || "Enter email..."}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled
				/>
			);
		case "dropdown":
			return (
				<select
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled
				>
					<option value="">{field.placeholder || "Pilih opsi..."}</option>
					{field.options?.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			);
		case "checkbox":
			return (
				<div className="space-y-2">
					{field.options?.map((option) => (
						<div key={option} className="flex items-center">
							<input
								type="checkbox"
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								disabled
								aria-label={option}
							/>
							<div className="ml-2 text-sm text-gray-700">{option}</div>
						</div>
					))}
				</div>
			);
		default:
			return <div className="text-gray-500">Unknown field type</div>;
	}
}
