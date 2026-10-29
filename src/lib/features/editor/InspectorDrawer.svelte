<script lang="ts">
	interface Props {
		open?: boolean;
		markdown?: string;
		json?: string;
		stats?: {
			totalBlocks?: number;
			wordCount?: number;
			charCount?: number;
			readingTimeMinutes?: number;
		};
		onClose?: () => void;
	}

	let {
		open = false,
		markdown = '',
		json = '',
		stats = { totalBlocks: 0, wordCount: 0, readingTimeMinutes: 0 },
		onClose
	}: Props = $props();

	let activeTab = $state<'markdown' | 'json'>('markdown');
</script>

{#if open}
	<div
		class="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95"
	>
		<div
			class="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800"
		>
			<div>
				<h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Document Inspector</h3>
				<p class="text-[11px] text-zinc-400">Live AST & Content Metrics</p>
			</div>
			{#if onClose}
				<button
					type="button"
					aria-label="Close inspector"
					onclick={onClose}
					class="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
			{/if}
		</div>

		<div class="grid grid-cols-3 gap-2 py-4">
			<div
				class="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5 text-center dark:border-zinc-800 dark:bg-zinc-800/50"
			>
				<div class="text-[10px] font-medium text-zinc-400 uppercase">Blocks</div>
				<div data-testid="stat-blocks" class="text-lg font-bold text-zinc-800 dark:text-zinc-100">
					{stats.totalBlocks ?? 0}
				</div>
			</div>
			<div
				class="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5 text-center dark:border-zinc-800 dark:bg-zinc-800/50"
			>
				<div class="text-[10px] font-medium text-zinc-400 uppercase">Words</div>
				<div data-testid="stat-words" class="text-lg font-bold text-zinc-800 dark:text-zinc-100">
					{stats.wordCount ?? 0}
				</div>
			</div>
			<div
				class="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5 text-center dark:border-zinc-800 dark:bg-zinc-800/50"
			>
				<div class="text-[10px] font-medium text-zinc-400 uppercase">Read Time</div>
				<div class="text-lg font-bold text-zinc-800 dark:text-zinc-100">
					{stats.readingTimeMinutes ?? 0}m
				</div>
			</div>
		</div>

		<div class="flex gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
			<button
				type="button"
				onclick={() => (activeTab = 'markdown')}
				class="rounded px-2.5 py-1 text-xs font-medium transition-colors {activeTab === 'markdown'
					? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
					: 'text-zinc-500 hover:text-zinc-900'}"
			>
				Markdown
			</button>
			<button
				type="button"
				onclick={() => (activeTab = 'json')}
				class="rounded px-2.5 py-1 text-xs font-medium transition-colors {activeTab === 'json'
					? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
					: 'text-zinc-500 hover:text-zinc-900'}"
			>
				JSON AST
			</button>
		</div>

		<div
			class="mt-3 flex-1 overflow-auto rounded-lg border border-zinc-200 bg-zinc-950 p-3 font-mono text-xs text-zinc-300 dark:border-zinc-800"
		>
			<pre
				data-testid="markdown-preview"
				class="{activeTab === 'markdown' ? 'block' : 'hidden'} whitespace-pre-wrap">{markdown}</pre>
			<pre
				data-testid="json-preview"
				class="{activeTab === 'json' ? 'block' : 'hidden'} whitespace-pre-wrap">{json}</pre>
		</div>
	</div>
{/if}
