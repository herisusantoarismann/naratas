<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		title?: string;
		onClose?: () => void;
		children?: Snippet;
	}

	let { open = false, title = 'Modal', onClose, children }: Props = $props();

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose?.();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if open}
	<div
		class="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-xs duration-150"
		onclick={handleBackdropClick}
		role="presentation"
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={title}
			class="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div
				class="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800"
			>
				<h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
				<button
					type="button"
					aria-label="Close modal"
					onclick={onClose}
					class="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="max-h-[70vh] overflow-y-auto">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
