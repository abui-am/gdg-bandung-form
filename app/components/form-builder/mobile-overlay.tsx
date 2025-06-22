interface MobileOverlayProps {
	isVisible: boolean;
	onClose: () => void;
}

export function MobileOverlay({ isVisible, onClose }: MobileOverlayProps) {
	if (!isVisible) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-0"
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					onClose();
				}
			}}
			role="button"
			tabIndex={0}
			aria-label="Close sidebar overlay"
		/>
	);
}
