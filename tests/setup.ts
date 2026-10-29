import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/svelte';
import { vi, afterEach } from 'vitest';

afterEach(() => {
	cleanup();
});

const createStorageMock = () => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
		setItem: vi.fn((key: string, value: unknown) => {
			store[key] = String(value);
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		})
	};
};

Object.defineProperty(globalThis, 'localStorage', {
	value: createStorageMock(),
	writable: true,
	configurable: true
});
