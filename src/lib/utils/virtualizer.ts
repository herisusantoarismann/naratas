export interface ViewportParams {
	scrollTop: number;
	viewportHeight: number;
	estimatedBlockHeight: number;
	totalBlocks: number;
	overscan?: number;
}

export interface ViewportResult {
	startIndex: number;
	endIndex: number;
	offsetY: number;
	totalHeight: number;
}

export const calculateBlockViewport = ({
	scrollTop,
	viewportHeight,
	estimatedBlockHeight,
	totalBlocks,
	overscan = 3
}: ViewportParams): ViewportResult => {
	if (estimatedBlockHeight <= 0 || totalBlocks <= 0) {
		return {
			startIndex: 0,
			endIndex: 0,
			offsetY: 0,
			totalHeight: 0
		};
	}

	const safeScrollTop = Math.max(0, scrollTop);
	const firstVisible = Math.floor(safeScrollTop / estimatedBlockHeight);
	const visibleCount = Math.ceil(viewportHeight / estimatedBlockHeight);

	const startIndex = Math.max(0, firstVisible - overscan);
	const endIndex = Math.min(totalBlocks, firstVisible + visibleCount + overscan);
	const offsetY = startIndex * estimatedBlockHeight;
	const totalHeight = totalBlocks * estimatedBlockHeight;

	return {
		startIndex,
		endIndex,
		offsetY,
		totalHeight
	};
};
