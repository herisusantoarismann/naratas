<script lang="ts">
	import type { BlockObject } from '../../../types/blocks.type';
	import HeadingBlock from './blocks/HeadingBlock.svelte';
	import ParagraphBlock from './blocks/ParagraphBlock.svelte';
	import CalloutBlock from './blocks/CalloutBlock.svelte';
	import CodeBlock from './blocks/CodeBlock.svelte';

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
</script>

{#if block.type === 'heading'}
	<HeadingBlock
		{block}
		{isActive}
		{onContentChange}
		{onSplit}
		{onMerge}
		{onSlashTrigger}
		{onDelete}
	/>
{:else if block.type === 'callout'}
	<CalloutBlock
		{block}
		{isActive}
		{onContentChange}
		{onSplit}
		{onMerge}
		{onSlashTrigger}
		{onDelete}
	/>
{:else if block.type === 'code'}
	<CodeBlock {block} {isActive} {onContentChange} {onSplit} {onMerge} {onSlashTrigger} {onDelete} />
{:else if block.type === 'divider'}
	<div class="my-3 py-1">
		<hr class="border-t border-zinc-200 dark:border-zinc-800" />
	</div>
{:else}
	<ParagraphBlock
		{block}
		{isActive}
		{onContentChange}
		{onSplit}
		{onMerge}
		{onSlashTrigger}
		{onDelete}
	/>
{/if}
