<script lang="ts">
	import type { BlockObject } from '../../../types/blocks.type';
	import { calculateBlockViewport } from '../../utils/virtualizer';

	interface Props {
		blocks?: BlockObject[];
		viewportHeight?: number;
		estimatedBlockHeight?: number;
	}

	let { blocks = [], viewportHeight = 500, estimatedBlockHeight = 48 }: Props = $props();

	let scrollTop = $state(0);

	const viewport = $derived(
		calculateBlockViewport({
			scrollTop,
			viewportHeight,
			estimatedBlockHeight,
			totalBlocks: blocks.length,
			overscan: 2
		})
	);

	const visibleBlocks = $derived(blocks.slice(viewport.startIndex, viewport.endIndex));

	function handleScroll(e: Event & { currentTarget: HTMLDivElement }) {
		scrollTop = e.currentTarget.scrollTop;
	}
</script>

<div
	onscroll={handleScroll}
	style="height: {viewportHeight}px;"
	class="relative w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900"
>
	<div style="height: {viewport.totalHeight}px; position: relative; width: 100%;">
		<div
			style="transform: translateY({viewport.offsetY}px); position: absolute; top: 0; left: 0; right: 0;"
		>
			{#each visibleBlocks as block (block.id)}
				<div
					data-testid="virtual-block-row"
					style="height: {estimatedBlockHeight}px;"
					class="flex items-center border-b border-zinc-100 px-3 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
				>
					<span
						class="mr-2 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 uppercase dark:bg-zinc-800"
					>
						{block.type}
					</span>
					<span class="truncate">{block.content}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
