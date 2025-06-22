import * as React from "react";
import { Button } from "~/components/ui/button";
import { fieldTypes } from "./constants";
import type { FieldType } from "./types";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	onAddField: (type: FieldType) => void;
}

export function Sidebar({ isOpen, onClose, onAddField }: SidebarProps) {
	return (
		<div
			className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 z-10 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
			style={{ width: "280px" }}
		>
			<div className="p-4 border-b">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-medium text-gray-800">
						Tambah pertanyaan
					</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="lg:hidden"
					>
						←
					</Button>
				</div>
			</div>

			<div className="p-4 space-y-2">
				{fieldTypes.map((fieldType) => (
					<button
						key={fieldType.type}
						type="button"
						className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors group w-full text-left"
						onClick={() => onAddField(fieldType.type)}
					>
						<div className="text-gray-600 group-hover:text-purple-600 transition-colors">
							{fieldType.icon}
						</div>
						<span className="text-sm text-gray-700 group-hover:text-gray-900">
							{fieldType.label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
