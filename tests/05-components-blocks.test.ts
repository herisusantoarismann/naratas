import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Button from '$lib/components/ui/Button.svelte';
import Badge from '$lib/components/ui/Badge.svelte';
import Modal from '$lib/components/ui/Modal.svelte';
import HeadingBlock from '$lib/features/editor/blocks/HeadingBlock.svelte';
import ParagraphBlock from '$lib/features/editor/blocks/ParagraphBlock.svelte';
import CalloutBlock from '$lib/features/editor/blocks/CalloutBlock.svelte';
import CodeBlock from '$lib/features/editor/blocks/CodeBlock.svelte';
import SlashCommandMenu from '$lib/features/editor/SlashCommandMenu.svelte';
import InspectorDrawer from '$lib/features/editor/InspectorDrawer.svelte';

describe('Gate 05: Atomic UI & Block Editor Components Specification', () => {
	describe('Atomic UI Components (Button, Badge, Modal)', () => {
		it('Button.svelte merender atribut type, data-variant, dan memicu onclick', async () => {
			const user = userEvent.setup();
			const onclick = vi.fn();
			render(Button, { props: { variant: 'danger', ariaLabel: 'Delete', onclick } });

			const btn = screen.getByRole('button', { name: 'Delete' });
			expect(btn).toHaveAttribute('type', 'button');
			expect(btn).toHaveAttribute('data-variant', 'danger');

			await user.click(btn);
			expect(onclick).toHaveBeenCalledTimes(1);
		});

		it('Badge.svelte merender data-testid="ui-badge" dan data-tone yang sesuai', () => {
			render(Badge, { props: { text: 'MARKDOWN', tone: 'accent' } });
			const badge = screen.getByTestId('ui-badge');
			expect(badge).toHaveTextContent('MARKDOWN');
			expect(badge).toHaveAttribute('data-tone', 'accent');
		});

		it('Modal.svelte memiliki role="dialog", aria-modal="true", dan tombol Close modal', async () => {
			const user = userEvent.setup();
			const onClose = vi.fn();
			render(Modal, { props: { open: true, title: 'Export Document', onClose } });

			const dialog = screen.getByRole('dialog');
			expect(dialog).toHaveAttribute('aria-modal', 'true');
			await user.click(screen.getByRole('button', { name: /close modal/i }));
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('Editor Block Components (Heading, Paragraph, Callout, Code)', () => {
		it('HeadingBlock.svelte merender data-testid="block-heading" dengan data-level yang tepat', () => {
			render(HeadingBlock, {
				props: {
					block: { id: 'h-1', type: 'heading', content: 'Bab 1', props: { level: 2 } }
				}
			});

			const wrapper = screen.getByTestId('block-heading');
			expect(wrapper).toHaveAttribute('data-level', '2');
			expect(screen.getByTestId('block-input')).toHaveValue('Bab 1');
		});

		it('ParagraphBlock.svelte memicu onSlashTrigger saat diketik "/", onSplit saat Enter, dan onMerge saat Backspace kosong', async () => {
			const user = userEvent.setup();
			const onSlashTrigger = vi.fn();
			const onSplit = vi.fn();
			const onMerge = vi.fn();

			render(ParagraphBlock, {
				props: {
					block: { id: 'p-1', type: 'paragraph', content: '', props: {} },
					onSlashTrigger,
					onSplit,
					onMerge
				}
			});

			const input = screen.getByTestId('block-input');

			// Ketik "/" memicu slash menu
			await user.type(input, '/');
			expect(onSlashTrigger).toHaveBeenCalledWith('p-1', expect.stringContaining('/'));

			// Tekan Enter memicu split
			await user.keyboard('{Enter}');
			expect(onSplit).toHaveBeenCalled();

			// Clear dan tekan Backspace memicu merge
			await user.clear(input);
			await user.keyboard('{Backspace}');
			expect(onMerge).toHaveBeenCalledWith('p-1');
		});

		it('CalloutBlock.svelte dan CodeBlock.svelte merender atribut varian dan bahasa dengan benar', () => {
			render(CalloutBlock, {
				props: {
					block: {
						id: 'c-1',
						type: 'callout',
						content: 'Perhatian!',
						props: { variant: 'warning' }
					}
				}
			});
			expect(screen.getByTestId('block-callout')).toHaveAttribute('data-variant', 'warning');

			render(CodeBlock, {
				props: {
					block: { id: 'cd-1', type: 'code', content: 'let a = 1;', props: { language: 'rust' } }
				}
			});
			expect(screen.getByTestId('block-code')).toHaveTextContent(/rust/i);
		});
	});

	describe('SlashCommandMenu & InspectorDrawer', () => {
		it('SlashCommandMenu merender daftar opsi yang difilter dan memanggil onSelect saat diklik', async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();

			render(SlashCommandMenu, {
				props: { open: true, query: '/h1', onSelect, onClose: vi.fn() }
			});

			const menu = screen.getByTestId('slash-command-menu');
			expect(menu).toBeInTheDocument();

			const h1Btn = screen.getByTestId('slash-item-h1');
			await user.click(h1Btn);
			expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'h1', type: 'heading' }));
		});

		it('InspectorDrawer menampilkan statistik kata, jumlah blok, preview Markdown dan JSON', () => {
			render(InspectorDrawer, {
				props: {
					open: true,
					markdown: '# Judul',
					json: '{"title":"Doc"}',
					stats: { totalBlocks: 4, wordCount: 25, readingTimeMinutes: 1 }
				}
			});

			expect(screen.getByTestId('stat-words')).toHaveTextContent('25');
			expect(screen.getByTestId('stat-blocks')).toHaveTextContent('4');
			expect(screen.getByTestId('markdown-preview')).toHaveTextContent('# Judul');
			expect(screen.getByTestId('json-preview')).toHaveTextContent('{"title":"Doc"}');
		});
	});
});
