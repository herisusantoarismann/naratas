import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { DocumentEngine } from '$lib/features/editor/documentEngine.svelte';
import VirtualBlockCanvas from '$lib/features/editor/VirtualBlockCanvas.svelte';

describe('Gate 06 (Expert): High-Volume Performance, Virtualization & SSR Safety', () => {
	it('VirtualBlockCanvas membatasi jumlah elemen DOM <= 30 node meskipun diberi 2.000 blok dokumen', () => {
		const massiveBlocks = Array.from({ length: 2000 }, (_, i) => ({
			id: `v-${i}`,
			type: (i % 5 === 0 ? 'heading' : 'paragraph') as 'heading' | 'paragraph',
			content: `Baris dokumen ke-${i + 1}`,
			props: i % 5 === 0 ? { level: 2 } : {}
		}));

		const { container } = render(VirtualBlockCanvas, {
			props: {
				blocks: massiveBlocks,
				viewportHeight: 480,
				estimatedBlockHeight: 48
			}
		});

		const renderedRows = container.querySelectorAll('[data-testid="virtual-block-row"]');
		expect(renderedRows.length).toBeGreaterThan(0);
		expect(renderedRows.length).toBeLessThanOrEqual(30);
	});

	it('DocumentEngine.bulkLoadBlocks memuat dan memfilter 2.500 blok dalam waktu < 50ms', () => {
		const engine = new DocumentEngine();
		const dataset = Array.from({ length: 2500 }, (_, i) => ({
			id: `bulk-${i}`,
			type: (i % 10 === 0 ? 'callout' : 'paragraph') as 'callout' | 'paragraph',
			content: i % 50 === 0 ? `Bottleneck Render Check #${i}` : `Regular paragraph content ${i}`,
			props: { variant: 'info' },
			updatedAt: Date.now()
		}));

		const t0 = performance.now();
		engine.bulkLoadBlocks(dataset);
		engine.setTypeFilter('callout');
		engine.setSearchQuery('Bottleneck');
		const results = engine.filteredBlocks;
		const elapsed = performance.now() - t0;

		expect(results.length).toBe(50);
		expect(
			elapsed,
			`Komputasi reaktif terlalu lambat (${elapsed.toFixed(2)}ms). Gunakan optimasi seperti $state.raw atau batching agar < 50ms!`
		).toBeLessThan(50);
	});

	it('SSR Safety Guard: DocumentEngine tidak melempar ReferenceError saat dijalankan di server tanpa localStorage', () => {
		const backupStorage = globalThis.localStorage;
		try {
			// @ts-expect-error simulating ssr without localstorage
			delete globalThis.localStorage;
			expect(() => {
				const ssrEngine = new DocumentEngine();
				ssrEngine.addBlock({ type: 'heading', content: 'SSR Heading', props: { level: 1 } });
			}).not.toThrow();
		} finally {
			globalThis.localStorage = backupStorage;
		}
	});
});
