<script lang="ts">
	import { filterSlashCommands, type SlashCommand } from '../../utils/slashCommands';

	interface Props {
		open?: boolean;
		query?: string;
		onSelect?: (command: SlashCommand) => void;
		onClose?: () => void;
	}

	let { open = false, query = '', onSelect, onClose }: Props = $props();

	const filteredCommands = $derived(filterSlashCommands(query));
	let selectedIndex = $state(0);

	$effect(() => {
		// Reset selected index when query changes
		if (query !== undefined) {
			selectedIndex = 0;
		}
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = (selectedIndex + 1) % Math.max(1, filteredCommands.length);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex =
				(selectedIndex - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filteredCommands[selectedIndex]) {
				onSelect?.(filteredCommands[selectedIndex]);
			}
		} else if (e.key === 'Escape') {
			e.preventDefault();
			onClose?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if open}
	<div
		role="listbox"
		data-testid="slash-command-menu"
		class="z-50 w-72 overflow-hidden rounded-xl border border-zinc-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95"
	>
		<div class="px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
			Blocks
		</div>
		<div class="max-h-60 space-y-0.5 overflow-y-auto">
			{#if filteredCommands.length === 0}
				<div class="px-3 py-4 text-center text-xs text-zinc-400">No matching commands</div>
			{:else}
				{#each filteredCommands as cmd, i (cmd.id)}
					<button
						type="button"
						role="option"
						aria-selected={i === selectedIndex}
						data-testid={`slash-item-${cmd.id}`}
						onclick={() => onSelect?.(cmd)}
						onmouseenter={() => (selectedIndex = i)}
						class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors {i ===
						selectedIndex
							? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
							: 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50'}"
					>
						<span
							class="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
						>
							{#if cmd.id === 'h1'}H1
							{:else if cmd.id === 'h2'}H2
							{:else if cmd.id === 'paragraph'}¶
							{:else if cmd.id === 'callout'}💡
							{:else if cmd.id === 'code'}&lt;&gt;
							{:else}—{/if}
						</span>
						<div class="flex flex-col">
							<span class="font-medium">{cmd.label}</span>
							<span class="text-[10px] text-zinc-400">/{cmd.keywords[0]}</span>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	</div>
{/if}
