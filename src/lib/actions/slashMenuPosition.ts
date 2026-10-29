export interface AnchorRect {
	bottom: number;
	left: number;
	top?: number;
	right?: number;
	width?: number;
	height?: number;
}

export function slashMenuPosition(node: HTMLElement, anchorRect: AnchorRect) {
	const applyPosition = (rect: AnchorRect) => {
		if (!rect) return;
		node.style.position = 'fixed';
		node.style.top = `${rect.bottom + 8}px`;
		node.style.left = `${rect.left}px`;
	};

	applyPosition(anchorRect);

	return {
		update(newRect: AnchorRect) {
			applyPosition(newRect);
		},
		destroy() {}
	};
}
