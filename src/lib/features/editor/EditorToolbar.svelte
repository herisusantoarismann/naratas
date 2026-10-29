<script lang="ts">
	interface Props {
		canUndo?: boolean;
		canRedo?: boolean;
		searchQuery?: string;
		typeFilter?: string;
		onAddBlock?: () => void;
		onUndo?: () => void;
		onRedo?: () => void;
		onSearchChange?: (q: string) => void;
		onFilterChange?: (f: string) => void;
		onExportMarkdown?: () => void;
		onOpenShare?: () => void;
		onToggleInspector?: () => void;
	}

	let {
		canUndo = false,
		canRedo = false,
		searchQuery = '',
		typeFilter = 'all',
		onAddBlock,
		onUndo,
		onRedo,
		onSearchChange,
		onFilterChange,
		onExportMarkdown,
		onOpenShare,
		onToggleInspector
	}: Props = $props();
</script>

<div
	class="sticky top-16 z-20 mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white/90 p-2.5 shadow-xs backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90"
>
	<div class="flex flex-wrap items-center gap-1.5">
		<button
			type="button"
			data-testid="btn-add-block"
			onclick={onAddBlock}
			class="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
		>
			<span>+ Add Block</span>
		</button>
		<button
			type="button"
			data-testid="btn-undo"
			disabled={!canUndo}
			onclick={onUndo}
			class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
		>
			Undo
		</button>
		<button
			type="button"
			data-testid="btn-redo"
			disabled={!canRedo}
			onclick={onRedo}
			class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
		>
			Redo
		</button>
		<button
			type="button"
			data-testid="btn-export-markdown"
			title="Download .md (Ctrl + S)"
			onclick={onExportMarkdown}
			class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
		>
			<svg class="h-3.5 w-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
				/>
			</svg>
			<span>Save .md</span>
		</button>
		<button
			type="button"
			data-testid="btn-share"
			title="Bagikan Tautan (Supabase)"
			onclick={onOpenShare}
			class="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
		>
			<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
				/>
			</svg>
			<span>Share</span>
		</button>
	</div>

	<div class="flex items-center gap-2">
		<input
			data-testid="block-search-input"
			type="text"
			placeholder="Search blocks..."
			value={searchQuery}
			oninput={(e) => onSearchChange?.(e.currentTarget.value)}
			class="w-32 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-800 outline-none focus:border-zinc-400 sm:w-44 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
		/>
		<select
			data-testid="block-type-filter"
			value={typeFilter}
			onchange={(e) => onFilterChange?.(e.currentTarget.value)}
			class="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-800 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
		>
			<option value="all">All</option>
			<option value="heading">Headings</option>
			<option value="paragraph">Paragraphs</option>
			<option value="callout">Callouts</option>
			<option value="code">Code</option>
		</select>
		<button
			type="button"
			data-testid="btn-toggle-inspector"
			onclick={onToggleInspector}
			class="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
		>
			Inspector
		</button>
	</div>
</div>
