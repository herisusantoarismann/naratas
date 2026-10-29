<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		ariaLabel?: string;
		onclick?: (event: MouseEvent) => void;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		ariaLabel,
		onclick,
		class: className = '',
		children
	}: Props = $props();

	const variantStyles: Record<string, string> = {
		primary:
			'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm border border-transparent',
		secondary:
			'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700',
		danger:
			'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 shadow-sm border border-transparent',
		ghost:
			'bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 border-transparent',
		outline:
			'bg-transparent text-zinc-800 border border-zinc-300 hover:bg-zinc-50 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800'
	};
</script>

<button
	{type}
	data-variant={variant}
	{disabled}
	aria-label={ariaLabel}
	{onclick}
	class="inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium tracking-tight transition-all duration-150 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 {variantStyles[
		variant
	] || variantStyles.primary} {className}"
>
	{@render children?.()}
</button>
