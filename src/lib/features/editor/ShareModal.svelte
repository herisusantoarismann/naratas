<script lang="ts">
	import type { BlockObject } from '../../../types/blocks.type';
	import {
		isSupabaseConfigured,
		shareDocumentToSupabase,
		generatePortableShareHash
	} from '$lib/services/supabase';

	interface Props {
		open?: boolean;
		title?: string;
		blocks?: BlockObject[];
		onClose?: () => void;
	}

	let { open = false, title = 'Untitled Document', blocks = [], onClose }: Props = $props();

	let loading = $state(false);
	let shareUrl = $state('');
	let copied = $state(false);
	let error = $state('');

	const configured = $derived(isSupabaseConfigured());

	async function generateSupabaseLink() {
		loading = true;
		error = '';
		const result = await shareDocumentToSupabase(title, blocks);
		loading = false;

		if (result.error) {
			error = result.error;
		} else if (result.id) {
			shareUrl = `${window.location.origin}/d/${result.id}`;
		}
	}

	function generatePortableLink() {
		const hash = generatePortableShareHash(title, blocks);
		shareUrl = `${window.location.origin}/d/preview#share=${hash}`;
	}

	async function copyToClipboard() {
		if (!shareUrl) return;
		await navigator.clipboard.writeText(shareUrl);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
		<div
			class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div
				class="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800"
			>
				<div>
					<h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Bagikan Dokumen</h3>
					<p class="text-xs text-zinc-500">Buat tautan akses untuk dibaca orang lain</p>
				</div>
				<button
					type="button"
					onclick={onClose}
					aria-label="Tutup modal"
					class="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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

			<div class="mt-4 space-y-4">
				{#if !configured}
					<div
						class="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300"
					>
						<div class="font-semibold">Supabase Belum Dikonfigurasi</div>
						<p class="mt-1 text-[11px] leading-relaxed opacity-90">
							Tambahkan <code>PUBLIC_SUPABASE_URL</code> & <code>PUBLIC_SUPABASE_ANON_KEY</code> di
							file <code>.env</code>. Anda juga dapat menggunakan opsi tautan mandiri (portable
							link).
						</p>
					</div>
				{/if}

				{#if shareUrl}
					<div class="space-y-2">
						<label
							for="share-url-input"
							class="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
							>Tautan Siap Dibagikan:</label
						>
						<div class="flex items-center gap-1.5">
							<input
								id="share-url-input"
								readonly
								value={shareUrl}
								class="flex-1 truncate rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-800 select-all dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
							/>
							<button
								type="button"
								onclick={copyToClipboard}
								class="rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
							>
								{copied ? 'Tersalin! ✓' : 'Salin'}
							</button>
						</div>
					</div>
				{:else}
					<div class="flex flex-col gap-2 pt-2">
						<button
							type="button"
							disabled={loading || !configured}
							onclick={generateSupabaseLink}
							class="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
						>
							{#if loading}
								<span>Mengunggah ke Supabase...</span>
							{:else}
								<span>Buat Tautan Supabase Cloud</span>
							{/if}
						</button>
						<button
							type="button"
							onclick={generatePortableLink}
							class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300"
						>
							Buat Tautan Mandiri (Tanpa Database)
						</button>
					</div>
				{/if}

				{#if error}
					<p class="text-xs text-rose-500">{error}</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
