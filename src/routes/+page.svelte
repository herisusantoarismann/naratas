<script lang="ts">
	let totalBlocks = $state(1);
	let wordCount = $state(0);
	let docTitle = $state('Untitled Document');

	$effect(() => {
		if (typeof window !== 'undefined' && window.localStorage) {
			try {
				const saved = window.localStorage.getItem('blockcraft_doc_v1');
				if (saved) {
					const parsed = JSON.parse(saved);
					docTitle = parsed.title || 'Untitled Document';
					if (Array.isArray(parsed.blocks)) {
						totalBlocks = parsed.blocks.length;
						let words = 0;
						for (const b of parsed.blocks) {
							if (b.type !== 'divider' && b.content?.trim()) {
								words += b.content.trim().split(/\s+/).filter(Boolean).length;
							}
						}
						wordCount = words;
					}
				}
			} catch {
				// Ignore parse errors
			}
		}
	});
</script>

<svelte:head>
	<title>Naratas Workspace — Editor Dokumen Blok Cepat & Privat</title>
	<meta
		name="description"
		content="Naratas adalah editor dokumen blok super cepat berbasis Svelte 5. Privasi 100% lokal di browser, tanpa lag, slash commands instan, dan ekspor Markdown."
	/>
	<link rel="canonical" href="https://naratas.dev/" />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
	<!-- Hero Header with CRO Trust Signals -->
	<div class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="mb-2 flex items-center gap-2">
				<span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
				<span class="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
					Local-First • Zero Cloud Lag
				</span>
			</div>
			<h1
				aria-label="BlockCraft Workspace"
				class="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50"
			>
				Naratas Workspace
			</h1>
			<p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
				Mesin editor dokumen blok berkecepatan tinggi dengan Svelte 5 Runes. Privasi penuh di
				browser Anda.
			</p>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<a
				href="/templates"
				class="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 shadow-2xs transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
			>
				Jelajahi 26+ Template
			</a>
			<a
				href="/editor"
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
			>
				<span>Buka Editor</span>
				<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					/>
				</svg>
			</a>
		</div>
	</div>

	<!-- Metrics Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div
			class="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Blok Aktif</div>
			<div
				data-testid="overview-total-blocks"
				class="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
			>
				{totalBlocks}
			</div>
			<p class="mt-1 text-[11px] text-zinc-400">Node dokumen dalam memori</p>
		</div>

		<div
			class="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Jumlah Kata</div>
			<div
				data-testid="overview-word-count"
				class="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
			>
				{wordCount}
			</div>
			<p class="mt-1 text-[11px] text-zinc-400">Total kata terhitung otomatis</p>
		</div>

		<div
			class="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">Dokumen Aktif</div>
			<div class="mt-2 truncate text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
				{docTitle}
			</div>
			<p class="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
				Tersinkronisasi otomatis
			</p>
		</div>
	</div>

	<!-- Quick Shortcuts -->
	<div
		class="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
	>
		<h2 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
			Pintasan Keyboard Produktif
		</h2>
		<div class="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
			<div
				class="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/60"
			>
				<span class="text-zinc-600 dark:text-zinc-400">Menu Slash Command</span>
				<kbd
					class="rounded border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-700 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
					>/</kbd
				>
			</div>
			<div
				class="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/60"
			>
				<span class="text-zinc-600 dark:text-zinc-400">Unduh Dokumen .md</span>
				<kbd
					class="rounded border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-700 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
					>Ctrl + S</kbd
				>
			</div>
			<div
				class="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/60"
			>
				<span class="text-zinc-600 dark:text-zinc-400">Pecah Blok (Baris Baru)</span>
				<kbd
					class="rounded border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-700 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
					>Enter</kbd
				>
			</div>
			<div
				class="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/60"
			>
				<span class="text-zinc-600 dark:text-zinc-400">Gabung ke Blok Sebelumnya</span>
				<kbd
					class="rounded border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-700 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
					>Backspace</kbd
				>
			</div>
		</div>
	</div>
</div>
