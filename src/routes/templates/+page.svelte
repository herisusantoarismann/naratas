<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { TEMPLATES, type TemplateItem } from '$lib/features/templates/templateList';

	let searchQuery = $state('');
	let selectedCategory = $state<'All' | 'Engineering' | 'Product' | 'Docs' | 'Workflow'>('All');
	let pendingTemplate = $state<TemplateItem | null>(null);
	let showOverwriteModal = $state(false);

	const categories = ['All', 'Engineering', 'Product', 'Docs', 'Workflow'] as const;

	const filteredTemplates = $derived(
		TEMPLATES.filter((t) => {
			const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
			return matchesCategory && matchesSearch;
		})
	);

	function hasExistingEditorContent(): boolean {
		if (typeof window === 'undefined' || !window.localStorage) return false;
		try {
			const raw = window.localStorage.getItem('blockcraft_doc_v1');
			if (!raw) return false;
			const data = JSON.parse(raw);
			if (!data) return false;
			const hasTitle = Boolean(
				data.title && data.title !== 'Untitled Document' && data.title.trim().length > 0
			);
			const hasContent =
				Array.isArray(data.blocks) &&
				data.blocks.some((b: { content?: string }) => b.content && b.content.trim().length > 0);
			const hasMultiple = Array.isArray(data.blocks) && data.blocks.length > 1;
			return hasTitle || hasContent || hasMultiple;
		} catch {
			return false;
		}
	}

	function handleSelectTemplate(template: TemplateItem) {
		if (hasExistingEditorContent()) {
			pendingTemplate = template;
			showOverwriteModal = true;
			return;
		}
		commitTemplate(template);
	}

	function commitTemplate(template: TemplateItem) {
		if (typeof window === 'undefined' || !window.localStorage) return;
		const docData = { title: template.title, blocks: template.blocks };
		window.localStorage.setItem('blockcraft_doc_v1', JSON.stringify(docData));
		showOverwriteModal = false;
		pendingTemplate = null;
		goto('/editor');
	}
</script>

<svelte:head>
	<title>Starter Templates — Naratas</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
	<!-- Page Header -->
	<div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<h1
				class="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50"
			>
				Starter Templates
			</h1>
			<p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
				Koleksi 26+ cetak biru dokumen profesional siap pakai untuk rekayasa, produk, dan
				dokumentasi.
			</p>
		</div>

		<!-- Search Input -->
		<div class="w-full sm:w-64">
			<input
				type="text"
				placeholder="Cari template..."
				bind:value={searchQuery}
				class="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-800 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
			/>
		</div>
	</div>

	<!-- Category Filter Tabs -->
	<div class="mb-6 flex flex-wrap gap-1.5 border-b border-zinc-100 pb-3 dark:border-zinc-800">
		{#each categories as cat (cat)}
			<button
				type="button"
				onclick={() => (selectedCategory = cat)}
				class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {selectedCategory ===
				cat
					? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
					: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}"
			>
				{cat}
			</button>
		{/each}
	</div>

	<!-- Templates Grid -->
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredTemplates as template (template.id)}
			<div
				data-testid="template-card"
				class="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
			>
				<div>
					<div class="flex items-center justify-between">
						<span
							class="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 uppercase dark:bg-zinc-800 dark:text-zinc-300"
						>
							{template.badge}
						</span>
						<span class="font-mono text-[11px] text-zinc-400">{template.blocks.length} blok</span>
					</div>
					<h2 class="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
						{template.title}
					</h2>
					<p class="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
						{template.description}
					</p>
				</div>

				<div class="mt-5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
					<button
						type="button"
						data-testid={template.testId || `btn-use-template-${template.id}`}
						onclick={() => handleSelectTemplate(template)}
						class="w-full rounded-lg bg-zinc-900 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
					>
						Gunakan Template
					</button>
				</div>
			</div>
		{/each}
	</div>

	<!-- Overwrite Confirmation Modal -->
	<Modal
		open={showOverwriteModal}
		title="Timpa Dokumen yang Ada?"
		onClose={() => (showOverwriteModal = false)}
	>
		<div class="space-y-4">
			<p class="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
				Editor Anda saat ini memiliki tulisan aktif. Memuat template
				<strong class="text-zinc-900 dark:text-zinc-100">{pendingTemplate?.title}</strong>
				akan menimpa tulisan tersebut. Apakah Anda ingin melanjutkan?
			</p>
			<div class="flex justify-end gap-2 pt-2">
				<button
					type="button"
					onclick={() => (showOverwriteModal = false)}
					class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
				>
					Batal
				</button>
				<button
					type="button"
					onclick={() => pendingTemplate && commitTemplate(pendingTemplate)}
					class="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
				>
					Timpa & Buka Editor
				</button>
			</div>
		</div>
	</Modal>
</div>
