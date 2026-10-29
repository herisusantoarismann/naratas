<script lang="ts">
	import { DocumentEngine } from '$lib/features/editor/documentEngine.svelte';
	import BlockRenderer from '$lib/features/editor/BlockRenderer.svelte';
	import SlashCommandMenu from '$lib/features/editor/SlashCommandMenu.svelte';
	import InspectorDrawer from '$lib/features/editor/InspectorDrawer.svelte';
	import EditorToolbar from '$lib/features/editor/EditorToolbar.svelte';
	import ShareModal from '$lib/features/editor/ShareModal.svelte';
	import { downloadMarkdownFile } from '$lib/features/editor/exportUtils';
	import type { SlashCommand } from '$lib/utils/slashCommands';

	const engine = new DocumentEngine();
	let titleInput = $state(engine.title);
	let inspectorOpen = $state(false);
	let shareModalOpen = $state(false);
	let slashMenuOpen = $state(false);
	let slashQuery = $state('');
	let slashBlockId = $state<string | null>(null);
	let toastMessage = $state('');

	$effect(() => {
		titleInput = engine.title;
	});

	function handleTitleBlur() {
		try {
			if (titleInput.trim().length >= 3) {
				engine.setTitle(titleInput.trim());
			}
		} catch {
			titleInput = engine.title;
		}
	}

	function handleSlashTrigger(id: string, value: string) {
		slashBlockId = id;
		slashQuery = value;
		slashMenuOpen = true;
	}

	function handleSlashSelect(cmd: SlashCommand) {
		if (slashBlockId) {
			engine.transformBlockType(slashBlockId, cmd.type, cmd.props);
		}
		slashMenuOpen = false;
		slashBlockId = null;
		slashQuery = '';
	}

	function handleExportMarkdown() {
		const filename = downloadMarkdownFile(engine.title, engine.exportMarkdown());
		toastMessage = `Tersimpan: ${filename}`;
		setTimeout(() => {
			toastMessage = '';
		}, 3000);
	}

	function handleWindowKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
			e.preventDefault();
			handleExportMarkdown();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<svelte:head>
	<title>{titleInput || 'Untitled Document'} — Naratas Editor</title>
	<meta
		name="description"
		content="Editor dokumen blok berbasis Svelte 5 Runes. Format bebas dengan slash commands dan simpan ke Markdown."
	/>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="relative mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6">
	<!-- Modular Editor Toolbar -->
	<EditorToolbar
		canUndo={engine.canUndo}
		canRedo={engine.canRedo}
		searchQuery={engine.searchQuery}
		typeFilter={engine.typeFilter}
		onAddBlock={() => engine.addBlock()}
		onUndo={() => engine.undo()}
		onRedo={() => engine.redo()}
		onSearchChange={(q) => engine.setSearchQuery(q)}
		onFilterChange={(f) => engine.setTypeFilter(f)}
		onExportMarkdown={handleExportMarkdown}
		onOpenShare={() => (shareModalOpen = true)}
		onToggleInspector={() => (inspectorOpen = !inspectorOpen)}
	/>

	<!-- Document Title -->
	<div class="mb-6">
		<input
			data-testid="doc-title-input"
			type="text"
			bind:value={titleInput}
			onblur={handleTitleBlur}
			placeholder="Untitled Document"
			class="w-full bg-transparent text-3xl font-extrabold tracking-tight text-zinc-900 outline-none placeholder:text-zinc-300 sm:text-4xl dark:text-zinc-50 dark:placeholder:text-zinc-700"
		/>
	</div>

	<!-- Block List -->
	<div data-testid="block-list" class="space-y-1 pb-32">
		{#each engine.filteredBlocks as block (block.id)}
			<div
				data-testid="editor-block-wrapper"
				class="group/block relative rounded-lg px-2 transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
			>
				<BlockRenderer
					{block}
					isActive={engine.activeBlockId === block.id}
					onContentChange={(id: string, content: string) => engine.updateBlockContent(id, content)}
					onSplit={(id: string, cursor: number) => engine.splitBlockAtCursor(id, cursor)}
					onMerge={(id: string) => engine.mergeWithPrevious(id)}
					onSlashTrigger={handleSlashTrigger}
					onDelete={(id: string) => engine.deleteBlock(id)}
				/>
			</div>
		{/each}
	</div>

	<!-- Slash Command Floating Menu -->
	{#if slashMenuOpen}
		<div class="fixed top-36 left-1/2 z-50 -translate-x-1/2">
			<SlashCommandMenu
				open={slashMenuOpen}
				query={slashQuery}
				onSelect={handleSlashSelect}
				onClose={() => (slashMenuOpen = false)}
			/>
		</div>
	{/if}

	<!-- Inspector Drawer -->
	<InspectorDrawer
		open={inspectorOpen}
		markdown={engine.exportMarkdown()}
		json={engine.exportJSON()}
		stats={engine.stats}
		onClose={() => (inspectorOpen = false)}
	/>

	<!-- Supabase Share Modal -->
	<ShareModal
		open={shareModalOpen}
		title={engine.title}
		blocks={engine.blocks}
		onClose={() => (shareModalOpen = false)}
	/>

	<!-- Toast Notification -->
	{#if toastMessage}
		<div
			class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-zinc-200 bg-zinc-900/90 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-100/95 dark:text-zinc-900"
		>
			{toastMessage}
		</div>
	{/if}
</div>
