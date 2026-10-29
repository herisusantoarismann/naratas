export interface ShortcutOptions {
	key: string;
	ctrl?: boolean;
	shift?: boolean;
	callback: (event: KeyboardEvent) => void;
}

export function shortcut(node: HTMLElement, options: ShortcutOptions) {
	let currentOptions = options;

	const handleKeyDown = (event: KeyboardEvent) => {
		const matchKey = event.key.toLowerCase() === currentOptions.key.toLowerCase();
		const matchCtrl = !!event.ctrlKey === (currentOptions.ctrl ?? false);
		const matchShift = !!event.shiftKey === (currentOptions.shift ?? false);

		if (matchKey && matchCtrl && matchShift) {
			event.preventDefault();
			currentOptions.callback(event);
		}
	};

	window.addEventListener('keydown', handleKeyDown);

	return {
		update(newOptions: ShortcutOptions) {
			currentOptions = newOptions;
		},
		destroy() {
			window.removeEventListener('keydown', handleKeyDown);
		}
	};
}
