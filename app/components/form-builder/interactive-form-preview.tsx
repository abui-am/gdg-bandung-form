import * as React from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { FormField as BuilderFormField, FormConfig } from "./types";

interface InteractiveFormPreviewProps {
	formConfig: FormConfig;
	onSubmit?: (formData: Record<string, any>) => void;
	onReset?: () => void;
}

interface FormFieldProps {
	field: BuilderFormField;
	value: any;
	onChange: (value: any) => void;
	error?: string;
}

// Individual Form Field Components
function TextField({ field, value, onChange, error }: FormFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
				{field.label}
				{field.required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<input
				id={field.id}
				type="text"
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={field.placeholder || "Enter your answer..."}
				className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					error ? "border-red-500" : "border-gray-300"
				}`}
			/>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}

function ParagraphField({ field, value, onChange, error }: FormFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
				{field.label}
				{field.required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<Textarea
				id={field.id}
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={field.placeholder || "Enter your answer..."}
				rows={4}
				className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
					error ? "border-red-500" : "border-gray-300"
				}`}
			/>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}

function EmailField({ field, value, onChange, error }: FormFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
				{field.label}
				{field.required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<input
				id={field.id}
				type="email"
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={field.placeholder || "Enter your email..."}
				className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					error ? "border-red-500" : "border-gray-300"
				}`}
			/>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}

function DropdownField({ field, value, onChange, error }: FormFieldProps) {
	const dropdownField = field as BuilderFormField & { options: string[] };
	return (
		<div className="space-y-2">
			<Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
				{field.label}
				{field.required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<select
				id={field.id}
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					error ? "border-red-500" : "border-gray-300"
				}`}
			>
				<option value="">{field.placeholder || "Select an option..."}</option>
				{dropdownField.options?.map((option: string) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}

function CheckboxField({ field, value, onChange, error }: FormFieldProps) {
	const checkboxField = field as BuilderFormField & { options: string[] };
	const selectedValues = Array.isArray(value) ? value : [];

	const handleOptionChange = (option: string, checked: boolean) => {
		let newValues: string[];
		if (checked) {
			newValues = [...selectedValues, option];
		} else {
			newValues = selectedValues.filter((val) => val !== option);
		}
		onChange(newValues);
	};

	return (
		<div className="space-y-2">
			<Label className="text-sm font-medium text-gray-700">
				{field.label}
				{field.required && <span className="text-red-500 ml-1">*</span>}
			</Label>
			<div className="space-y-2">
				{(checkboxField.options || []).map((option) => (
					<div key={option} className="flex items-center space-x-2">
						<input
							id={`${field.id}-${option}`}
							type="checkbox"
							checked={selectedValues.includes(option)}
							onChange={(e) => handleOptionChange(option, e.target.checked)}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<Label
							htmlFor={`${field.id}-${option}`}
							className="text-sm text-gray-700"
						>
							{option}
						</Label>
					</div>
				))}
			</div>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
}

// Main Interactive Form Preview Component
export function InteractiveFormPreview({
	formConfig,
	onSubmit,
	onReset,
}: InteractiveFormPreviewProps) {
	const [formData, setFormData] = React.useState<Record<string, any>>({});
	const [errors, setErrors] = React.useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [isSubmitted, setIsSubmitted] = React.useState(false);

	// Reset form data when form config changes
	React.useEffect(() => {
		setFormData({});
		setErrors({});
		setIsSubmitted(false);
	}, [formConfig.fields.length]);

	const handleFieldChange = (fieldId: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[fieldId]: value,
		}));
		// Clear error when user starts typing
		if (errors[fieldId]) {
			setErrors((prev) => ({
				...prev,
				[fieldId]: "",
			}));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		formConfig.fields.forEach((field) => {
			const value = formData[field.id];

			// Check required fields
			if (field.required) {
				if (value === undefined || value === null || value === "") {
					newErrors[field.id] = "This field is required";
				}
			}

			// Validate email format
			if (field.type === "email" && value && value !== "") {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) {
					newErrors[field.id] = "Please enter a valid email address";
				}
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			if (onSubmit) {
				await onSubmit(formData);
			}
			setIsSubmitted(true);
		} catch (error) {
			console.error("Form submission error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReset = () => {
		setFormData({});
		setErrors({});
		setIsSubmitted(false);
		if (onReset) {
			onReset();
		}
	};

	const renderField = (field: BuilderFormField) => {
		const value = formData[field.id];
		const error = errors[field.id];

		switch (field.type) {
			case "text":
				return (
					<TextField
						key={field.id}
						field={field}
						value={value}
						onChange={(val) => handleFieldChange(field.id, val)}
						error={error}
					/>
				);
			case "paragraph":
				return (
					<ParagraphField
						key={field.id}
						field={field}
						value={value}
						onChange={(val) => handleFieldChange(field.id, val)}
						error={error}
					/>
				);
			case "email":
				return (
					<EmailField
						key={field.id}
						field={field}
						value={value}
						onChange={(val) => handleFieldChange(field.id, val)}
						error={error}
					/>
				);
			case "dropdown":
				return (
					<DropdownField
						key={field.id}
						field={field}
						value={value}
						onChange={(val) => handleFieldChange(field.id, val)}
						error={error}
					/>
				);
			case "checkbox":
				return (
					<CheckboxField
						key={field.id}
						field={field}
						value={value}
						onChange={(val) => handleFieldChange(field.id, val)}
						error={error}
					/>
				);
			default:
				return null;
		}
	};

	if (isSubmitted) {
		return (
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="p-6">
					<div className="text-center">
						<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
							<svg
								className="h-6 w-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-label="Success checkmark"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							Form Submitted Successfully!
						</h3>
						<p className="text-gray-600 mb-6">
							Thank you for your submission. Here's what you submitted:
						</p>

						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<h4 className="font-medium text-gray-900 mb-3">
								Submitted Data:
							</h4>
							<div className="space-y-2 text-sm">
								{formConfig.fields.map((field) => {
									const value = formData[field.id];
									if (value === undefined || value === null || value === "") {
										return null;
									}
									return (
										<div key={field.id} className="flex justify-between">
											<span className="font-medium text-gray-700">
												{field.label}:
											</span>
											<span className="text-gray-600">
												{typeof value === "boolean"
													? value
														? "Yes"
														: "No"
													: String(value)}
											</span>
										</div>
									);
								})}
							</div>
						</div>

						<div className="flex justify-center space-x-3">
							<Button variant="outline" onClick={handleReset}>
								Fill Form Again
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden">
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold text-gray-900">
						Interactive Form Preview
					</h3>
					<div className="flex items-center space-x-2">
						<Button variant="outline" size="sm" onClick={handleReset}>
							Reset Form
						</Button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{formConfig.fields.length === 0 ? (
						<div className="text-center py-12 text-gray-500">
							<p className="text-lg mb-2">No form fields to display</p>
							<p className="text-sm">
								Add some fields to the form builder to see them here
							</p>
						</div>
					) : (
						<div className="space-y-6">
							{formConfig.fields.map(renderField)}
						</div>
					)}

					{formConfig.fields.length > 0 && (
						<div className="pt-6 border-t border-gray-200">
							<div className="flex items-center justify-between">
								<div className="text-sm text-gray-600">
									{formConfig.fields.filter((f) => f.required).length} required
									field(s)
								</div>
								<Button
									type="submit"
									disabled={isSubmitting || formConfig.fields.length === 0}
								>
									{isSubmitting ? "Submitting..." : "Submit Form"}
								</Button>
							</div>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
