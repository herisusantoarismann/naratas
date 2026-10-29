<script lang="ts">
	import './layout.css';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const navItems = [
		{ href: '/', label: 'Overview' },
		{ href: '/editor', label: 'Editor' },
		{ href: '/templates', label: 'Templates' }
	];
</script>

<div
	class="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100"
>
	<header
		class="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80"
	>
		<div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
			<div class="flex items-center gap-6">
				<a
					href="/"
					class="flex items-center gap-2.5 font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
				>
					<div
						class="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-xs font-black text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
					>
						NT
					</div>
					<span class="text-sm font-semibold">Naratas</span>
					<span
						class="hidden rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 sm:inline-block dark:bg-zinc-800 dark:text-zinc-400"
					>
						v1.0
					</span>
				</a>

				<nav aria-label="Main Navigation" class="flex items-center gap-1">
					{#each navItems as item (item.href)}
						{@const isActive = page.url.pathname === item.href}
						<a
							href={item.href}
							class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {isActive
								? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
								: 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200'}"
						>
							{item.label}
						</a>
					{/each}
				</nav>
			</div>

			<div class="flex items-center gap-3">
				<a
					href="/editor"
					class="hidden items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-zinc-800 sm:inline-flex dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
				>
					Open Editor
				</a>
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer
		class="border-t border-zinc-200/80 bg-white/60 py-6 text-center text-xs text-zinc-500 backdrop-blur-xs dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400"
	>
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6"
		>
			<p>© 2026 Naratas — Local-First Block Document Engine. Open Source MIT.</p>
			<div class="flex items-center gap-4">
				<a href="/templates" class="hover:underline">Templates</a>
				<a href="/editor" class="hover:underline">Editor</a>
				<a
					href="https://github.com/herisusantoarismann/naratas"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:underline">GitHub</a
				>
			</div>
		</div>
	</footer>
</div>
