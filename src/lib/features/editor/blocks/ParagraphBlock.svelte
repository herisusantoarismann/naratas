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

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		const val = e.currentTarget.value;
		onContentChange?.(block.id, val);
		if (val.startsWith('/') || val === '/') {
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

<div data-testid="block-paragraph" class="group relative flex items-start py-1">
	<input
		data-testid="block-input"
		type="text"
		value={block.content}
		oninput={handleInput}
		onkeydown={handleKeyDown}
		use:caretManager={{ isFocused: isActive }}
		placeholder="Type '/' for commands or start typing..."
		class="w-full bg-transparent text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-200 dark:placeholder:text-zinc-600"
	/>
</div>
