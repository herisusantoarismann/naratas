export function clickOutside(node: HTMLElement, callback: (event: MouseEvent) => void) {
	const handleClick = (event: MouseEvent) => {
		const target = event.target as Node | null;
		if (node && target && !node.contains(target) && !event.defaultPrevented) {
			callback(event);
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
