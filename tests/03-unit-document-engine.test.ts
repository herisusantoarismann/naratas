import { describe, it, expect, beforeEach } from 'vitest';
import { DocumentEngine } from '$lib/features/editor/documentEngine.svelte';

describe('Gate 03: DocumentEngine State, Tree Manipulation & Undo/Redo Stack', () => {
	let engine: DocumentEngine;

	beforeEach(() => {
		globalThis.localStorage.clear();
		engine = new DocumentEngine();
	});

	describe('Inisialisasi & Document Title Validation', () => {
		it('menginisialisasi dokumen baru dengan judul default "Untitled Document" dan minimal 1 blok paragraph', () => {
			expect(engine.title).toBe('Untitled Document');
			expect(engine.blocks.length).toBe(1);
			expect(engine.blocks[0].type).toBe('paragraph');
			expect(engine.activeBlockId).toBe(engine.blocks[0].id);
		});

		it('setTitle mengubah judul jika valid dan melempar error jika kurang dari 3 karakter', () => {
			engine.setTitle('Product Requirements Document');
			expect(engine.title).toBe('Product Requirements Document');

			expect(() => engine.setTitle('ab')).toThrowError(/invalid document title/i);
			expect(engine.title).toBe('Product Requirements Document');
		});
	});

	describe('Block CRUD, Insertion Order & Transformation', () => {
		it('addBlock menyisipkan blok di akhir atau tepat setelah afterBlockId yang ditentukan', () => {
			const firstId = engine.blocks[0].id;
			engine.updateBlockContent(firstId, 'Blok Pertama');

			const second = engine.addBlock({
				type: 'heading',
				content: 'Blok Kedua',
				props: { level: 1 }
			});
			const middle = engine.addBlock({
				type: 'callout',
				content: 'Blok Sisipan Tengah',
				props: { variant: 'info' },
				afterBlockId: firstId
			});

			expect(engine.blocks.map((b) => b.content)).toEqual([
				'Blok Pertama',
				'Blok Sisipan Tengah',
				'Blok Kedua'
			]);
			expect(engine.activeBlockId).toBe(middle.id);
		});

		it('transformBlockType mengubah tipe dan props blok serta membersihkan slash command teks seperti "/h1"', () => {
			const id = engine.blocks[0].id;
			engine.updateBlockContent(id, '/h1');

			engine.transformBlockType(id, 'heading', { level: 1 });
			expect(engine.blocks[0].type).toBe('heading');
			expect(engine.blocks[0].props).toEqual({ level: 1 });
			expect(engine.blocks[0].content).toBe('');
		});

		it('deleteBlock menghapus blok dan menjamin dokumen selalu menyisakan minimal 1 blok kosong jika semua dihapus', () => {
			const onlyId = engine.blocks[0].id;
			engine.updateBlockContent(onlyId, 'Akan dihapus');

			engine.deleteBlock(onlyId);
			expect(engine.blocks.length).toBe(1);
			expect(engine.blocks[0].id).not.toBe(onlyId);
			expect(engine.blocks[0].content).toBe('');
		});
	});

	describe('Advanced Editor Operations: Split on Enter, Merge on Backspace & Reorder', () => {
		it('splitBlockAtCursor memotong teks pada posisi kursor menjadi dua blok berurutan', () => {
			const id = engine.blocks[0].id;
			engine.updateBlockContent(id, 'Hello World Svelte');

			engine.splitBlockAtCursor(id, 5); // Potong setelah "Hello"

			expect(engine.blocks.length).toBe(2);
			expect(engine.blocks[0].content).toBe('Hello');
			expect(engine.blocks[1].content).toBe('World Svelte');
			expect(engine.blocks[1].type).toBe('paragraph');
			expect(engine.activeBlockId).toBe(engine.blocks[1].id);
		});

		it('mergeWithPrevious menggabungkan konten blok ke blok sebelumnya dan menghapus blok saat ini', () => {
			const firstId = engine.blocks[0].id;
			engine.updateBlockContent(firstId, 'Kalimat awal ');
			const second = engine.addBlock({ type: 'paragraph', content: 'dan lanjutan.' });

			// Merge di blok pertama harus return false
			expect(engine.mergeWithPrevious(firstId)).toBe(false);

			// Merge blok kedua ke blok pertama
			const merged = engine.mergeWithPrevious(second.id);
			expect(merged).toBe(true);
			expect(engine.blocks.length).toBe(1);
			expect(engine.blocks[0].content).toBe('Kalimat awal dan lanjutan.');
			expect(engine.activeBlockId).toBe(firstId);
		});

		it('moveBlock memindahkan posisi blok ke atas ("up") dan ke bawah ("down")', () => {
			const b1 = engine.blocks[0];
			engine.updateBlockContent(b1.id, 'Satu');
			const b2 = engine.addBlock({ content: 'Dua' });
			const b3 = engine.addBlock({ content: 'Tiga' });

			engine.moveBlock(b3.id, 'up');
			expect(engine.blocks.map((b) => b.content)).toEqual(['Satu', 'Tiga', 'Dua']);

			engine.moveBlock(b1.id, 'down');
			expect(engine.blocks.map((b) => b.content)).toEqual(['Tiga', 'Satu', 'Dua']);
		});
	});

	describe('Derived Stats, Filtering & Command History (Undo / Redo)', () => {
		it('menghitung derived stats (totalBlocks, wordCount, charCount, readingTimeMinutes) dan memfilter blok secara reaktif', () => {
			const firstId = engine.blocks[0].id;
			engine.transformBlockType(firstId, 'heading', { level: 1 });
			engine.updateBlockContent(firstId, 'Judul Utama Dokumen');
			engine.addBlock({
				type: 'paragraph',
				content: 'Ini adalah paragraf kedua dengan enam kata.'
			});
			engine.addBlock({ type: 'code', content: 'console.log(1);', props: { language: 'js' } });

			expect(engine.stats.totalBlocks).toBe(3);
			expect(engine.stats.wordCount).toBe(11); // 3 + 7 + 1
			expect(engine.stats.readingTimeMinutes).toBe(1);

			engine.setTypeFilter('heading');
			expect(engine.filteredBlocks.length).toBe(1);
			expect(engine.filteredBlocks[0].content).toBe('Judul Utama Dokumen');

			engine.setTypeFilter('all');
			engine.setSearchQuery('paragraf');
			expect(engine.filteredBlocks.length).toBe(1);
			expect(engine.filteredBlocks[0].type).toBe('paragraph');
		});

		it('mendukung multi-step Undo dan Redo serta sinkronisasi ke localStorage ("blockcraft_doc_v1")', () => {
			const firstId = engine.blocks[0].id;
			engine.updateBlockContent(firstId, 'Versi 1');
			engine.updateBlockContent(firstId, 'Versi 2');
			engine.addBlock({ content: 'Blok Tambahan' });

			expect(engine.blocks.length).toBe(2);
			expect(engine.canUndo).toBe(true);

			// Undo penambahan blok
			engine.undo();
			expect(engine.blocks.length).toBe(1);
			expect(engine.blocks[0].content).toBe('Versi 2');

			// Undo update konten ke Versi 1
			engine.undo();
			expect(engine.blocks[0].content).toBe('Versi 1');
			expect(engine.canRedo).toBe(true);

			// Redo kembali ke Versi 2
			engine.redo();
			expect(engine.blocks[0].content).toBe('Versi 2');

			// Pastikan tersimpan di localStorage
			expect(globalThis.localStorage.setItem).toHaveBeenCalledWith(
				'blockcraft_doc_v1',
				expect.stringContaining('Versi 2')
			);

			// Instansiasi engine baru harus me-restore state dari localStorage
			const restored = new DocumentEngine();
			expect(restored.blocks[0].content).toBe('Versi 2');
		});
	});
});
