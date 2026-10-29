export interface CaretOptions {
	isFocused?: boolean;
	cursorOffset?: number | null;
}

export function caretManager(node: HTMLElement, options: CaretOptions = {}) {
	const applyCaret = (opts: CaretOptions) => {
		if (opts.isFocused) {
			node.focus();
			if (
				opts.cursorOffset !== null &&
				opts.cursorOffset !== undefined &&
				typeof (node as HTMLInputElement).setSelectionRange === 'function'
			) {
				(node as HTMLInputElement).setSelectionRange(opts.cursorOffset, opts.cursorOffset);
			}
		}
	};

	applyCaret(options);

	return {
		update(newOptions: CaretOptions) {
			applyCaret(newOptions);
		},
		destroy() {}
	};
}
