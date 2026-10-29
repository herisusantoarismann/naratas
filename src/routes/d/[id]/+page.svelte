<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { BlockObject } from '../../../types/blocks.type';
	import { fetchSharedDocument, parsePortableShareHash } from '$lib/services/supabase';
	import { downloadMarkdownFile } from '$lib/features/editor/exportUtils';
	import { blocksToMarkdown } from '$lib/utils/markdown';
	import BlockRenderer from '$lib/features/editor/BlockRenderer.svelte';

	let loading = $state(true);
	let notFound = $state(false);
	let title = $state('Shared Document');
	let blocks = $state<BlockObject[]>([]);
	let createdAt = $state<string>('');

	onMount(async () => {
		const docId = page.params.id;

		if (docId === 'preview' && typeof window !== 'undefined') {
			const portable = parsePortableShareHash(window.location.hash);
			if (portable) {
				title = portable.title;
				blocks = portable.blocks;
				loading = false;
				return;
			}
		}

		if (docId) {
			const res = await fetchSharedDocument(docId);
			if (res) {
				title = res.title;
				blocks = res.blocks;
				createdAt = res.createdAt;
			} else {
				notFound = true;
			}
		} else {
			notFound = true;
		}
		loading = false;
	});

	function handleCloneToEditor() {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('blockcraft_doc_v1', JSON.stringify({ title, blocks }));
			goto('/editor');
		}
	}

	function handleDownloadMarkdown() {
		const md = blocksToMarkdown(blocks);
		downloadMarkdownFile(title, md);
	}
</script>

<svelte:head>
	<title>{title} — Naratas</title>
</svelte:head>

<div class="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6">
	{#if loading}
		<div class="flex h-64 flex-col items-center justify-center gap-3">
			<div
				class="h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100"
			></div>
			<p class="text-xs text-zinc-500">Memuat dokumen dari Naratas Cloud...</p>
		</div>
	{:else if notFound}
		<div class="flex h-64 flex-col items-center justify-center gap-4 text-center">
			<h2 class="text-xl font-bold text-zinc-800 dark:text-zinc-200">Dokumen Tidak Ditemukan</h2>
			<p class="text-xs text-zinc-500">Tautan mungkin sudah kedaluwarsa atau tidak valid.</p>
			<a
				href="/editor"
				class="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
			>
				Buka Workspace Editor
			</a>
		</div>
	{:else}
		<!-- Header Actions -->
		<div
			class="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800"
		>
			<div class="flex items-center gap-2">
				<span
					class="rounded-md bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
					>Naratas Shared</span
				>
				{#if createdAt}
					<span class="text-xs text-zinc-400">{new Date(createdAt).toLocaleDateString()}</span>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={handleDownloadMarkdown}
					class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
				>
					Simpan .md
				</button>
				<button
					type="button"
					onclick={handleCloneToEditor}
					class="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
				>
					Edit di Naratas
				</button>
			</div>
		</div>

		<!-- Title -->
		<h1
			class="mb-8 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50"
		>
			{title}
		</h1>

		<!-- Blocks -->
		<div class="space-y-2 pb-24">
			{#each blocks as block (block.id)}
				<div class="rounded-lg px-2">
					<BlockRenderer {block} />
				</div>
			{/each}
		</div>
	{/if}
</div>
