import * as React from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import type { CheckboxField, DropdownField, FormField } from "./types";

interface FieldEditorProps {
	field: FormField;
	onUpdate: (field: FormField) => void;
	onDelete: () => void;
	onClose: () => void;
}

export function FieldEditor({
	field,
	onUpdate,
	onDelete,
	onClose,
}: FieldEditorProps) {
	// Ensure checkbox and dropdown fields have options initialized
	const initializedField = React.useMemo(() => {
		if (field.type === "checkbox" && !field.options) {
			return { ...field, options: ["Opsi 1"] };
		}
		if (field.type === "dropdown" && !field.options) {
			return { ...field, options: ["Opsi 1"] };
		}
		return field;
	}, [field]);

	const [localField, setLocalField] =
		React.useState<FormField>(initializedField);

	const [newOption, setNewOption] = React.useState("");

	const handleSave = () => {
		onUpdate(localField);
		onClose();
	};

	const handleAddOption = () => {
		if (
			newOption.trim() &&
			(localField.type === "dropdown" || localField.type === "checkbox")
		) {
			const updatedField = {
				...localField,
				options: [...localField.options, newOption.trim()],
			} as DropdownField | CheckboxField;
			setLocalField(updatedField);
			setNewOption("");
		}
	};

	const handleRemoveOption = (index: number) => {
		if (localField.type === "dropdown" || localField.type === "checkbox") {
			const updatedField = {
				...localField,
				options: localField.options.filter((_, i) => i !== index),
			} as DropdownField | CheckboxField;
			setLocalField(updatedField);
		}
	};

	React.useEffect(() => {
		setLocalField(initializedField);
	}, [initializedField]);
	return (
		<div className="space-y-4 p-4 border rounded-lg bg-background">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Edit Field</h3>
				<Button variant="ghost" size="sm" onClick={onClose}>
					✕
				</Button>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="field-label">Label</Label>
					<input
						id="field-label"
						type="text"
						value={localField.label}
						onChange={(e) =>
							setLocalField({ ...localField, label: e.target.value })
						}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="Masukkan label field"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="field-placeholder">Placeholder</Label>
					<input
						id="field-placeholder"
						type="text"
						value={localField.placeholder || ""}
						onChange={(e) =>
							setLocalField({ ...localField, placeholder: e.target.value })
						}
						className="w-full px-3 py-2 border rounded-md"
						placeholder="Masukkan placeholder (opsional)"
					/>
				</div>

				<div className="flex items-center space-x-2">
					<input
						id="field-required"
						type="checkbox"
						checked={localField.required}
						onChange={(e) =>
							setLocalField({ ...localField, required: e.target.checked })
						}
						className="h-4 w-4"
					/>
					<Label htmlFor="field-required">Wajib diisi</Label>
				</div>

				{localField.type === "dropdown" && (
					<div className="space-y-2">
						<Label>Opsi Dropdown</Label>
						<div className="space-y-2">
							{localField.options.map((option, index) => (
								<div
									key={`${option}-${index}`}
									className="flex items-center gap-2"
								>
									<input
										type="text"
										value={option}
										onChange={(e) => {
											const updatedOptions = [...localField.options];
											updatedOptions[index] = e.target.value;
											setLocalField({
												...localField,
												options: updatedOptions,
											} as DropdownField);
										}}
										className="flex-1 px-3 py-2 border rounded-md"
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleRemoveOption(index)}
									>
										Hapus
									</Button>
								</div>
							))}
							<div className="flex items-center gap-2">
								<input
									type="text"
									value={newOption}
									onChange={(e) => setNewOption(e.target.value)}
									className="flex-1 px-3 py-2 border rounded-md"
									placeholder="Tambah opsi baru"
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddOption();
										}
									}}
								/>
								<Button variant="outline" size="sm" onClick={handleAddOption}>
									Tambah
								</Button>
							</div>
						</div>
					</div>
				)}
				{localField.type === "checkbox" && (
					<div className="space-y-2">
						<Label>Opsi Checkbox</Label>
						<div className="space-y-2">
							{(localField.options || []).map((option, index) => (
								<div
									key={`${option}-${index}`}
									className="flex items-center gap-2"
								>
									<input
										type="text"
										value={option}
										onChange={(e) => {
											const updatedOptions = [...localField.options];
											updatedOptions[index] = e.target.value;
											setLocalField({
												...localField,
												options: updatedOptions,
											} as CheckboxField);
										}}
										className="flex-1 px-3 py-2 border rounded-md"
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleRemoveOption(index)}
									>
										Hapus
									</Button>
								</div>
							))}
							<div className="flex items-center gap-2">
								<input
									type="text"
									value={newOption}
									onChange={(e) => setNewOption(e.target.value)}
									className="flex-1 px-3 py-2 border rounded-md"
									placeholder="Tambah opsi baru"
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddOption();
										}
									}}
								/>
								<Button variant="outline" size="sm" onClick={handleAddOption}>
									Tambah
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="flex items-center justify-between pt-4 border-t">
				<Button variant="destructive" onClick={onDelete}>
					Hapus Field
				</Button>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={onClose}>
						Batal
					</Button>
					<Button onClick={handleSave}>Simpan</Button>
				</div>
			</div>
		</div>
	);
}
