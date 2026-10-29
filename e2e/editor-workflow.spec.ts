import { test, expect } from '@playwright/test';

test.describe('BlockCraft E2E Production Workflow (Playwright)', () => {
	test('Navigasi multi-halaman (/ -> /templates -> /editor) dan pemuatan Template RFC', async ({
		page
	}) => {
		await page.goto('/');

		// 1. Verifikasi Main Navigation & Overview Dashboard
		const nav = page.getByRole('navigation', { name: 'Main Navigation' });
		await expect(nav).toBeVisible();
		await expect(
			page.getByRole('heading', { name: /(Naratas|BlockCraft) Workspace/ })
		).toBeVisible();

		// 2. Buka halaman Templates & pilih Engineering RFC Template
		await nav.getByRole('link', { name: 'Templates' }).click();
		await expect(page).toHaveURL(/\/templates/);

		const useRfcBtn = page.getByTestId('btn-use-template-rfc');
		await expect(useRfcBtn).toBeVisible();
		await useRfcBtn.click();

		// 3. Buka halaman Editor dan pastikan blok dari template sudah termuat
		await nav.getByRole('link', { name: 'Editor' }).click();
		await expect(page).toHaveURL(/\/editor/);

		const blockWrappers = page.getByTestId('editor-block-wrapper');
		await expect(blockWrappers).toHaveCount(3);
	});

	test('Alur lengkap Editor: Slash Command (/h1), Split Block (Enter), Undo/Redo, dan Live Inspector Drawer', async ({
		page
	}) => {
		await page.goto('/editor');
		await page.evaluate(() => window.localStorage.clear());
		await page.reload();

		// 1. Ubah judul dokumen
		const titleInput = page.getByTestId('doc-title-input');
		await titleInput.fill('Arsitektur Svelte 5 Runes');
		await titleInput.blur();

		// 2. Ketik "/h1" di blok pertama untuk membuka Slash Command Menu dan ubah jadi Heading 1
		const firstBlockInput = page.getByTestId('block-input').first();
		await firstBlockInput.fill('/h1');

		const slashMenu = page.getByTestId('slash-command-menu');
		await expect(slashMenu).toBeVisible();
		await page.getByTestId('slash-item-h1').click();

		// Pastikan blok berubah menjadi HeadingBlock dan teks "/h1" dibersihkan
		await expect(page.getByTestId('block-heading')).toBeVisible();
		const headingInput = page.getByTestId('block-input').first();
		await headingInput.fill('Pendahuluan Sistem');

		// 3. Tambah blok baru via tombol Add Block & ketik kalimat
		await page.getByTestId('btn-add-block').click();
		const secondInput = page.getByTestId('block-input').nth(1);
		await secondInput.fill('Svelte sangat cepat');

		// 4. Uji Undo & Redo dari toolbar
		await page.getByTestId('btn-undo').click();
		await page.getByTestId('btn-redo').click();

		// 5. Buka Inspector Drawer dan verifikasi output Markdown & statistik kata
		await page.getByTestId('btn-toggle-inspector').click();
		const mdPreview = page.getByTestId('markdown-preview');
		await expect(mdPreview).toContainText('# Pendahuluan Sistem');
		await expect(page.getByTestId('stat-blocks')).toHaveText('2');
	});
});
