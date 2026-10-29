import { describe, it, expect } from 'vitest';
import { sanitizeBlockContent, isValidDocumentTitle, createBlockObject } from '$lib/utils/sanitize';
import { blocksToMarkdown, markdownToBlocks } from '$lib/utils/markdown';
import { SLASH_COMMANDS, filterSlashCommands } from '$lib/utils/slashCommands';
import { calculateBlockViewport } from '$lib/utils/virtualizer';

describe('Gate 02: Pure Utilities, AST Serializer & Slash Command Matcher', () => {
	describe('src/lib/utils/sanitize.ts', () => {
		it('sanitizeBlockContent membersihkan tag <script>, event handler inline, dan tag HTML berbahaya serta melakukan trim', () => {
			const dirty =
				'  <script>window.hacked=true</script>Halo <img src=x onerror="alert(1)"><b>Dunia</b>  ';
			const result = sanitizeBlockContent(dirty);
			expect(result).not.toContain('<script>');
			expect(result).not.toContain('onerror');
			expect(result).not.toContain('<b>');
			expect(result).toBe('Halo Dunia');
		});

		it('sanitizeBlockContent menangani input non-string atau null/undefined dengan aman', () => {
			expect(sanitizeBlockContent(null)).toBe('');
			expect(sanitizeBlockContent(undefined)).toBe('');
			expect(sanitizeBlockContent(12345 as unknown as string)).toBe('');
		});

		it('isValidDocumentTitle memvalidasi panjang judul antara 3 hingga 120 karakter setelah di-trim', () => {
			expect(isValidDocumentTitle('')).toBe(false);
			expect(isValidDocumentTitle('   a   ')).toBe(false);
			expect(isValidDocumentTitle('ab')).toBe(false);
			expect(isValidDocumentTitle('RFC: Arsitektur Svelte 5')).toBe(true);
			expect(isValidDocumentTitle('x'.repeat(121))).toBe(false);
		});

		it('createBlockObject menghasilkan struktur objek blok yang terstandarisasi dan tersanitasi', () => {
			const block = createBlockObject({
				id: 'blk-101',
				type: 'heading',
				content: '  <script>bad()</script>Bab 1: Pendahuluan  ',
				props: { level: 2 }
			});

			expect(block).toEqual({
				id: 'blk-101',
				type: 'heading',
				content: 'Bab 1: Pendahuluan',
				props: { level: 2 },
				updatedAt: expect.any(Number)
			});
		});
	});

	describe('src/lib/utils/markdown.ts', () => {
		const sampleBlocks = Object.freeze([
			Object.freeze({
				id: '1',
				type: 'heading',
				content: 'Arsitektur Sistem',
				props: { level: 1 }
			}),
			Object.freeze({
				id: '2',
				type: 'paragraph',
				content: 'Dokumen ini menjelaskan desain blok.'
			}),
			Object.freeze({
				id: '3',
				type: 'callout',
				content: 'Jangan mutasi state secara langsung.',
				props: { variant: 'warning' }
			}),
			Object.freeze({
				id: '4',
				type: 'code',
				content: 'const x = $state(10);',
				props: { language: 'javascript' }
			}),
			Object.freeze({ id: '5', type: 'divider', content: '', props: {} })
		]);

		it('blocksToMarkdown mengonversi seluruh tipe blok ke string Markdown dengan presisi tanpa memutasi input', () => {
			const md = blocksToMarkdown(sampleBlocks as any);
			const expected = [
				'# Arsitektur Sistem',
				'Dokumen ini menjelaskan desain blok.',
				'> [WARNING] Jangan mutasi state secara langsung.',
				'```javascript\nconst x = $state(10);\n```',
				'---'
			].join('\n\n');

			expect(md).toBe(expected);
		});

		it('markdownToBlocks mem-parsing kembali string Markdown menjadi array objek blok yang valid', () => {
			const rawMd = [
				'## Sub Judul Kedua',
				'Paragraf penjelasan singkat.',
				'> [INFO] Catatan penting untuk engineer.',
				'---'
			].join('\n\n');

			const parsed = markdownToBlocks(rawMd);
			expect(parsed.length).toBe(4);
			expect(parsed[0]).toMatchObject({
				type: 'heading',
				content: 'Sub Judul Kedua',
				props: { level: 2 }
			});
			expect(parsed[1]).toMatchObject({
				type: 'paragraph',
				content: 'Paragraf penjelasan singkat.'
			});
			expect(parsed[2]).toMatchObject({
				type: 'callout',
				content: 'Catatan penting untuk engineer.',
				props: { variant: 'info' }
			});
			expect(parsed[3]).toMatchObject({ type: 'divider', content: '' });
		});
	});

	describe('src/lib/utils/slashCommands.ts', () => {
		it('SLASH_COMMANDS berisi minimal 6 definisi command standar (h1, h2, paragraph, callout, code, divider)', () => {
			expect(Array.isArray(SLASH_COMMANDS)).toBe(true);
			const ids = SLASH_COMMANDS.map((c) => c.id);
			expect(ids).toEqual(
				expect.arrayContaining(['h1', 'h2', 'paragraph', 'callout', 'code', 'divider'])
			);
		});

		it('filterSlashCommands menyaring daftar command berdasarkan query dengan atau tanpa awalan "/" secara case-insensitive', () => {
			expect(filterSlashCommands('/').length).toBe(SLASH_COMMANDS.length);
			expect(filterSlashCommands('/h1').map((c) => c.id)).toContain('h1');
			expect(filterSlashCommands('ALERT').map((c) => c.id)).toContain('callout');
			expect(filterSlashCommands('/snippet').map((c) => c.id)).toContain('code');
			expect(filterSlashCommands('/tidak-ada-command-ini')).toEqual([]);
		});
	});

	describe('src/lib/utils/virtualizer.ts', () => {
		it('calculateBlockViewport menghitung startIndex, endIndex, offsetY, dan totalHeight dengan overscan', () => {
			const metrics = calculateBlockViewport({
				scrollTop: 480,
				viewportHeight: 240,
				estimatedBlockHeight: 48,
				totalBlocks: 5000,
				overscan: 2
			});

			// firstVisible = 480 / 48 = 10; startIndex = max(0, 10 - 2) = 8
			// visibleCount = ceil(240 / 48) = 5; endIndex = min(5000, 10 + 5 + 2) = 17
			expect(metrics).toEqual({
				startIndex: 8,
				endIndex: 17,
				offsetY: 8 * 48,
				totalHeight: 5000 * 48
			});
		});
	});
});
