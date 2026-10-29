<script lang="ts">
	import type { BlockObject } from '../../../../types/blocks.type';
	import { caretManager } from '../../../actions/caretManager';

	interface Props {
		block: BlockObject;
		isActive?: boolean;
		onContentChange?: (id: string, content: string) => void;
		onSplit?: (id: string, cursorIndex: number) => void;
		onMerge?: (id: string) => void;
		onSlashTrigger?: (id: string, value: string) => void;
		onDelete?: (id: string) => void;
	}

	let {
		block,
		isActive = false,
		onContentChange,
		onSplit,
		onMerge,
		onSlashTrigger,
		onDelete
	}: Props = $props();

	const variant = $derived(String(block.props?.variant || 'info').toLowerCase());

	const variantStyles: Record<string, { bg: string; border: string; icon: string }> = {
		info: {
			bg: 'bg-sky-50 dark:bg-sky-950/40',
			border: 'border-sky-300 dark:border-sky-800',
			icon: 'ℹ️'
		},
		warning: {
			bg: 'bg-amber-50 dark:bg-amber-950/40',
			border: 'border-amber-300 dark:border-amber-800',
			icon: '⚠️'
		},
		danger: {
			bg: 'bg-rose-50 dark:bg-rose-950/40',
			border: 'border-rose-300 dark:border-rose-800',
			icon: '🚨'
		},
		success: {
			bg: 'bg-emerald-50 dark:bg-emerald-950/40',
			border: 'border-emerald-300 dark:border-emerald-800',
			icon: '✅'
		}
	};

	const currentStyle = $derived(variantStyles[variant] || variantStyles.info);

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		const val = e.currentTarget.value;
		onContentChange?.(block.id, val);
		if (val.startsWith('/')) {
			onSlashTrigger?.(block.id, val);
		}
	}

	function handleKeyDown(e: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSplit?.(block.id, e.currentTarget.selectionStart ?? 0);
		} else if (
			e.key === 'Backspace' &&
			(block.content === '' || e.currentTarget.selectionStart === 0)
		) {
			e.preventDefault();
			onMerge?.(block.id);
		}
	}
</script>

<div
	data-testid="block-callout"
	data-variant={variant}
	class="group my-2 flex items-start gap-3 rounded-xl border p-3.5 transition-all {currentStyle.bg} {currentStyle.border}"
>
	<span class="mt-0.5 text-base leading-none select-none">{currentStyle.icon}</span>
	<input
		data-testid="block-input"
		type="text"
		value={block.content}
		oninput={handleInput}
		onkeydown={handleKeyDown}
		use:caretManager={{ isFocused: isActive }}
		placeholder="Type a callout message..."
		class="w-full bg-transparent text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-200 dark:placeholder:text-zinc-500"
	/>
</div>
