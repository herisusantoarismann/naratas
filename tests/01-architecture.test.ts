import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'src');

function getAllFiles(dirPath: string, acc: string[] = []): string[] {
	if (!fs.existsSync(dirPath)) return acc;
	for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
		const full = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			getAllFiles(full, acc);
		} else {
			acc.push(full);
		}
	}
	return acc;
}

describe('Gate 01: Architecture, Folder Contract & Clean Code Rules', () => {
	const requiredFiles = [
		'lib/utils/sanitize.ts',
		'lib/utils/markdown.ts',
		'lib/utils/slashCommands.ts',
		'lib/utils/virtualizer.ts',
		'lib/actions/clickOutside.ts',
		'lib/actions/shortcut.ts',
		'lib/actions/caretManager.ts',
		'lib/actions/slashMenuPosition.ts',
		'lib/components/ui/Button.svelte',
		'lib/components/ui/Badge.svelte',
		'lib/components/ui/Modal.svelte',
		'lib/features/editor/documentEngine.svelte.ts',
		'lib/features/editor/BlockRenderer.svelte',
		'lib/features/editor/SlashCommandMenu.svelte',
		'lib/features/editor/InspectorDrawer.svelte',
		'lib/features/editor/VirtualBlockCanvas.svelte',
		'lib/features/editor/blocks/HeadingBlock.svelte',
		'lib/features/editor/blocks/ParagraphBlock.svelte',
		'lib/features/editor/blocks/CalloutBlock.svelte',
		'lib/features/editor/blocks/CodeBlock.svelte',
		'routes/+layout.svelte',
		'routes/+page.svelte',
		'routes/editor/+page.svelte',
		'routes/templates/+page.svelte'
	];

	it('wajib memiliki seluruh file dan struktur folder sesuai SPECIFICATION.md', () => {
		for (const relPath of requiredFiles) {
			const fullPath = path.join(SRC_DIR, relPath);
			expect(fs.existsSync(fullPath), `File wajib belum dibuat: src/${relPath}`).toBe(true);
		}
	});

	it('Svelte 5 Runes Strictness: melarang sintaks legacy Svelte 4 (export let, $:, createEventDispatcher, <slot>)', () => {
		const svelteFiles = getAllFiles(SRC_DIR).filter((f) => f.endsWith('.svelte'));
		expect(
			svelteFiles.length,
			'Belum ada file .svelte di dalam folder src/'
		).toBeGreaterThanOrEqual(14);

		for (const file of svelteFiles) {
			const code = fs.readFileSync(file, 'utf-8');
			const rel = path.relative(SRC_DIR, file);

			expect(code, `Dilarang memakai 'export let' di ${rel}`).not.toMatch(/\bexport\s+let\b/);
			expect(code, `Dilarang memakai '$:' di ${rel}`).not.toMatch(/^\s*\$:/m);
			expect(code, `Dilarang memakai 'createEventDispatcher' di ${rel}`).not.toMatch(
				/createEventDispatcher/
			);
			expect(code, `Dilarang memakai '<slot' di ${rel}`).not.toMatch(/<slot[\s>]/);
		}
	});

	it('Pure Utils Isolation: src/lib/utils/ hanya boleh berisi pure TS tanpa akses DOM/storage/fetch atau import dari layer UI/features', () => {
		const utilsDir = path.join(SRC_DIR, 'lib/utils');
		const utilFiles = getAllFiles(utilsDir);
		expect(
			utilFiles.length,
			'Folder src/lib/utils/ wajib memiliki minimal 4 file'
		).toBeGreaterThanOrEqual(4);

		for (const file of utilFiles) {
			const rel = path.relative(SRC_DIR, file);
			expect(file.endsWith('.ts'), `${rel} harus berekstensi .ts murni`).toBe(true);

			const code = fs.readFileSync(file, 'utf-8');
			expect(
				code,
				`${rel} melanggar boundary: dilarang import dari features/components/routes`
			).not.toMatch(/from\s+['"].*(features|components|routes)/);
			expect(
				code,
				`${rel} tidak pure: dilarang mengakses window/document/localStorage/fetch`
			).not.toMatch(/\b(window|document|localStorage|fetch)\b/);
		}
	});

	it('Atomic UI Isolation: src/lib/components/ui/ haram mengimpor dari features/ atau mengakses localStorage/fetch', () => {
		const uiDir = path.join(SRC_DIR, 'lib/components/ui');
		const uiFiles = getAllFiles(uiDir);
		expect(
			uiFiles.length,
			'Folder src/lib/components/ui/ wajib memiliki minimal 3 komponen'
		).toBeGreaterThanOrEqual(3);

		for (const file of uiFiles) {
			const rel = path.relative(SRC_DIR, file);
			const code = fs.readFileSync(file, 'utf-8');
			expect(code, `Komponen UI ${rel} dilarang mengimpor dari features/ atau routes/`).not.toMatch(
				/from\s+['"].*(features|routes)/
			);
			expect(code, `Komponen UI ${rel} dilarang mengakses localStorage atau fetch`).not.toMatch(
				/\b(localStorage|fetch)\b/
			);
		}
	});

	it('Single Responsibility Principle: setiap file .svelte tidak boleh melebihi batas baris kode (120 untuk UI, 180 untuk Features/Routes)', () => {
		const svelteFiles = getAllFiles(SRC_DIR).filter((f) => f.endsWith('.svelte'));
		expect(svelteFiles.length).toBeGreaterThan(0);

		for (const file of svelteFiles) {
			const rel = path.relative(SRC_DIR, file);
			const lineCount = fs.readFileSync(file, 'utf-8').split('\n').length;
			const isAtomicUi = rel.includes(path.join('components', 'ui'));
			const maxLines = isAtomicUi ? 120 : 180;

			expect(
				lineCount,
				`File ${rel} terlalu panjang (${lineCount} baris). Maksimal ${maxLines} baris sesuai standar modularitas!`
			).toBeLessThanOrEqual(maxLines);
		}
	});
});
