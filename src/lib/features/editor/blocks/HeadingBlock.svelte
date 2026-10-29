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

	const level = $derived(Math.min(Math.max(Number(block.props?.level) || 1, 1), 6));

	const levelClasses: Record<number, string> = {
		1: 'text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50',
		2: 'text-xl font-semibold tracking-tight text-zinc-850 dark:text-zinc-100',
		3: 'text-lg font-semibold text-zinc-800 dark:text-zinc-200'
	};

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
	data-testid="block-heading"
	data-level={level}
	class="group relative flex items-center py-1.5 transition-colors"
>
	<div
		class="mr-2 text-[10px] font-semibold tracking-wider text-zinc-400 opacity-0 select-none group-hover:opacity-100 dark:text-zinc-500"
	>
		H{level}
	</div>
	<input
		data-testid="block-input"
		type="text"
		value={block.content}
		oninput={handleInput}
		onkeydown={handleKeyDown}
		use:caretManager={{ isFocused: isActive }}
		placeholder={`Heading ${level}...`}
		class="w-full bg-transparent outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600 {levelClasses[
			level
		] || levelClasses[1]}"
	/>
</div>
