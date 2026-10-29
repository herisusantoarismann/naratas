import { describe, it, expect, vi } from 'vitest';
import { clickOutside } from '$lib/actions/clickOutside';
import { shortcut } from '$lib/actions/shortcut';
import { caretManager } from '$lib/actions/caretManager';
import { slashMenuPosition } from '$lib/actions/slashMenuPosition';

describe('Gate 04: Svelte Custom Actions & Memory Leak Prevention', () => {
	it('clickOutside memicu callback hanya saat klik di luar node dan membersihkan event listener saat destroy()', () => {
		const box = document.createElement('div');
		const outsideBtn = document.createElement('button');
		document.body.append(box, outsideBtn);

		const onOutside = vi.fn();
		const action = clickOutside(box, onOutside);

		box.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(onOutside).not.toHaveBeenCalled();

		outsideBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(onOutside).toHaveBeenCalledTimes(1);

		action?.destroy?.();
		outsideBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(onOutside).toHaveBeenCalledTimes(1);

		box.remove();
		outsideBtn.remove();
	});

	it('shortcut action menangani kombinasi Ctrl+Z / Ctrl+Shift+Z dan melepas listener window saat destroy()', () => {
		const el = document.createElement('div');
		const onUndo = vi.fn();
		const action = shortcut(el, { key: 'z', ctrl: true, shift: false, callback: onUndo });

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: false }));
		expect(onUndo).not.toHaveBeenCalled();

		window.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, shiftKey: false })
		);
		expect(onUndo).toHaveBeenCalledTimes(1);

		action?.destroy?.();
		window.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, shiftKey: false })
		);
		expect(onUndo).toHaveBeenCalledTimes(1);
	});

	it('caretManager memberikan fokus otomatis dan mengatur posisi kursor (selectionRange) saat aktif', () => {
		const input = document.createElement('input');
		input.value = 'Belajar Svelte 5';
		document.body.appendChild(input);

		const focusSpy = vi.spyOn(input, 'focus');
		const selectionSpy = vi.spyOn(input, 'setSelectionRange');

		const action = caretManager(input, { isFocused: true, cursorOffset: 7 });
		expect(focusSpy).toHaveBeenCalled();
		expect(selectionSpy).toHaveBeenCalledWith(7, 7);

		action?.update?.({ isFocused: true, cursorOffset: 3 });
		expect(selectionSpy).toHaveBeenCalledWith(3, 3);

		action?.destroy?.();
		input.remove();
	});

	it('slashMenuPosition memposisikan floating menu secara presisi berdasarkan anchorRect dan mendukung update()', () => {
		const menu = document.createElement('div');
		const action = slashMenuPosition(menu, { bottom: 120, left: 64 });

		expect(menu.style.position).toBe('fixed');
		expect(menu.style.top).toBe('128px'); // 120 + 8px offset
		expect(menu.style.left).toBe('64px');

		action?.update?.({ bottom: 200, left: 100 });
		expect(menu.style.top).toBe('208px');
		expect(menu.style.left).toBe('100px');

		action?.destroy?.();
	});
});
