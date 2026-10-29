<script lang="ts">
	interface Props {
		text: string;
		tone?: 'neutral' | 'accent' | 'info' | 'warning' | 'danger' | 'success' | string;
		class?: string;
	}

	let { text, tone = 'neutral', class: className = '' }: Props = $props();

	const toneStyles: Record<string, string> = {
		neutral:
			'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
		accent:
			'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
		info: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800',
		warning:
			'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
		danger:
			'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800',
		success:
			'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
	};
</script>

<span
	data-testid="ui-badge"
	data-tone={tone}
	class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-tight select-none {toneStyles[
		tone
	] || toneStyles.neutral} {className}"
>
	{text}
</span>
