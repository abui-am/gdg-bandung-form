import * as React from "react";
import { Button } from "~/components/ui/button";
import { FieldEditor } from "./field-editor";
import { FieldPreview, FieldTypeButton } from "./field-types";
import type { FieldType, FormConfig, FormField } from "./types";

export function FormBuilder() {
	const [formConfig, setFormConfig] = React.useState<FormConfig>({
		fields: [],
	});
	const [editingField, setEditingField] = React.useState<string | null>(null);
	const [draggedType, setDraggedType] = React.useState<FieldType | null>(null);

	const fieldTypes = [
		{
			type: "text" as FieldType,
			label: "Teks Singkat",
			icon: "📝",
		},
		{
			type: "paragraph" as FieldType,
			label: "Paragraf",
			icon: "📄",
		},
		{
			type: "email" as FieldType,
			label: "Email",
			icon: "📧",
		},
		{
			type: "dropdown" as FieldType,
			label: "Dropdown",
			icon: "📋",
		},
		{
			type: "checkbox" as FieldType,
			label: "Checkbox",
			icon: "☑️",
		},
	];

	const createField = (type: FieldType): FormField => {
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
					options: ["Opsi 1", "Opsi 2"],
				};
			case "checkbox":
				return {
					...baseField,
					type: "checkbox",
					options: ["Opsi 1", "Opsi 2"],
				};
			default:
				return { ...baseField, type: "text" };
		}
	};

	const addField = (type: FieldType) => {
		const newField = createField(type);
		setFormConfig((prev) => ({
			...prev,
			fields: [...prev.fields, newField],
		}));
	};

	const updateField = (updatedField: FormField) => {
		setFormConfig((prev) => ({
			...prev,
			fields: prev.fields.map((field) =>
				field.id === updatedField.id ? updatedField : field,
			),
		}));
	};

	const deleteField = (fieldId: string) => {
		setFormConfig((prev) => ({
			...prev,
			fields: prev.fields.filter((field) => field.id !== fieldId),
		}));
		setEditingField(null);
	};

	const moveField = (fromIndex: number, toIndex: number) => {
		setFormConfig((prev) => {
			const newFields = [...prev.fields];
			const [movedField] = newFields.splice(fromIndex, 1);
			newFields.splice(toIndex, 0, movedField);
			return { ...prev, fields: newFields };
		});
	};

	const handleDragStart = (e: React.DragEvent, type: string) => {
		setDraggedType(type as FieldType);
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
		? formConfig.fields.find((f) => f.id === editingField)
		: null;

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-center">Form Builder</h1>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Field Types Panel */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Tipe Field</h2>
						<div className="grid grid-cols-1 gap-3">
							{fieldTypes.map((fieldType) => (
								<FieldTypeButton
									key={fieldType.type}
									type={fieldType.type}
									label={fieldType.label}
									icon={<span className="text-2xl">{fieldType.icon}</span>}
									onDragStart={handleDragStart}
									onClick={() => addField(fieldType.type)}
								/>
							))}
						</div>
					</div>

					{/* Form Builder Area */}
					<div className="lg:col-span-2 space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold">Form Preview</h2>
							<div className="text-sm text-gray-600">
								{formConfig.fields.length} field(s)
							</div>
						</div>

						<div
							className="min-h-96 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white"
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						>
							{formConfig.fields.length === 0 ? (
								<div className="text-center text-gray-500 py-12">
									<p className="text-lg mb-2">Form masih kosong</p>
									<p className="text-sm">
										Drag & drop field dari panel kiri atau klik tombol field
										untuk menambahkan
									</p>
								</div>
							) : (
								<div className="space-y-6">
									{formConfig.fields.map((field, index) => (
										<div
											key={field.id}
											className="relative group p-4 border rounded-lg hover:border-blue-300 transition-colors"
										>
											<FieldPreview field={field} />

											{/* Field Controls */}
											<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<div className="flex items-center gap-1">
													<Button
														variant="outline"
														size="sm"
														onClick={() => setEditingField(field.id)}
													>
														Edit
													</Button>
													{index > 0 && (
														<Button
															variant="outline"
															size="sm"
															onClick={() => moveField(index, index - 1)}
														>
															↑
														</Button>
													)}
													{index < formConfig.fields.length - 1 && (
														<Button
															variant="outline"
															size="sm"
															onClick={() => moveField(index, index + 1)}
														>
															↓
														</Button>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Actions */}
						<div className="flex items-center justify-between pt-4">
							<Button
								variant="outline"
								onClick={() => setFormConfig({ fields: [] })}
								disabled={formConfig.fields.length === 0}
							>
								Reset Form
							</Button>
							<div className="flex items-center gap-2">
								<Button variant="outline">Preview</Button>
								<Button>Simpan Form</Button>
							</div>
						</div>
					</div>

					{/* Field Editor Panel */}
					<div>
						{editingFieldData ? (
							<FieldEditor
								field={editingFieldData}
								onUpdate={updateField}
								onDelete={() => deleteField(editingFieldData.id)}
								onClose={() => setEditingField(null)}
							/>
						) : (
							<div className="p-4 border rounded-lg bg-white">
								<h3 className="text-lg font-semibold mb-2">Editor Field</h3>
								<p className="text-gray-600 text-sm">
									Pilih field di preview untuk mengedit propertinya
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Form Config Display (Development) */}
				<div className="mt-8 p-4 bg-gray-100 rounded-lg">
					<h3 className="text-sm font-semibold mb-2">
						Form Configuration (Development)
					</h3>
					<pre className="text-xs overflow-auto">
						{JSON.stringify(formConfig, null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
}
