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

	const language = $derived(String(block.props?.language || 'javascript'));

	function handleInput(e: Event & { currentTarget: HTMLTextAreaElement }) {
		onContentChange?.(block.id, e.currentTarget.value);
	}

	function handleKeyDown(e: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) {
		if (e.key === 'Backspace' && (block.content === '' || e.currentTarget.selectionStart === 0)) {
			e.preventDefault();
			onMerge?.(block.id);
		}
	}
</script>

<div
	data-testid="block-code"
	class="group my-2 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900 font-mono text-zinc-100 shadow-sm dark:border-zinc-800"
>
	<div
		class="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-3.5 py-1.5 text-xs text-zinc-400"
	>
		<span class="font-medium tracking-wide uppercase">{language}</span>
		<span class="text-[10px] text-zinc-500">Code Snippet</span>
	</div>
	<div class="p-3">
		<textarea
			data-testid="block-input"
			value={block.content}
			oninput={handleInput}
			onkeydown={handleKeyDown}
			use:caretManager={{ isFocused: isActive }}
			rows="3"
			placeholder="// write code here..."
			class="w-full resize-y bg-transparent font-mono text-xs leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
		></textarea>
	</div>
</div>
